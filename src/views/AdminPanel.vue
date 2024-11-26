<script setup>
import store from '../store';
import Panel from '../components/Panel.vue';
import PanelPartnerForm from '../components/PanelPartnerForm.vue';
import PanelOrderForm from '../components/PanelOrderForm.vue';
import PanelItemForm from '../components/PanelItemForm.vue';
import PanelCouponForm from '../components/PanelCouponForm.vue';
import TabSelector from '../components/TabSelector.vue';
import Recaptcha from '../components/ReCaptcha.vue';
import LoadingGIF from '../components/LoadingGIF.vue';
import { notify } from "@kyvg/vue3-notification";

defineProps({
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    },
    partnersList: {
        type: Array,
        required: false,
        default: store.getters.partners
    },
    couponsList: {
        type: Array,
        required: false,
        default: store.getters.coupons
    }
});
</script>

<template>
    <section class="page-section bordered">
        <LoadingGIF :visible="!itemsList.length || !partnersList.length || !couponsList.length || !ordersList.length"
            :description="$t('adminPanel.loading')" />

        <div v-if="!passwordCheck && (itemsList.length && partnersList.length && couponsList.length && ordersList.length)"
            class="password-container flex column y-centered auto-margin">
            <label class="centered-text" for="adminPassword">{{ $t('adminPanel.adminPassword') }}</label>
            <input id="adminPassword" class="bottom-margin" type="password" v-model="adminPasswordInput">
            <Recaptcha class="flex x-centered bottom-margin" @checkbox="checkRecaptcha" />
            <button :class="{ 'disabled': !passedRecaptcha }" class="action-button large" @click="accessPanel">
                {{ $t('adminPanel.accessPanel') }}
            </button>
        </div>

        <Transition name="fade">
            <div v-if="passwordCheck" class="restricted-panel flex wide column">
                <TabSelector class="admin-tabs" @tab-selected="selectTab" :tab-list="[
                    { identifier: 'items', tabTitle: $t('adminPanel.itemsTabTitle') },
                    { identifier: 'orders', tabTitle: $t('adminPanel.ordersTabTitle') },
                    { identifier: 'partners', tabTitle: $t('adminPanel.hostsTabTitle') },
                    { identifier: 'coupons', tabTitle: $t('adminPanel.couponsTabTitle') }
                ]" />

                <div class="tab-container flex wide" v-show="selectedTab === 'orders'">
                    <Panel class="admin-panel" :card-source="ordersList" @clicked-card="populateOrderForm"
                        :parameter-options="generateParameters(orderForm)" />
                    <PanelOrderForm class="panel-form" :form-info="orderForm" :items-list="itemsList" />
                </div>
                <div class="tab-container flex wide" v-show="selectedTab === 'items'">
                    <Panel class="admin-panel" :card-source="itemsList" @clicked-card="populateItemForm"
                        :parameter-options="generateParameters(itemForm)" />
                    <PanelItemForm class="panel-form" :form-info="itemForm" :items-list="itemsList" />
                </div>
                <div class="tab-container flex wide" v-show="selectedTab === 'partners'">
                    <Panel class="admin-panel" :card-source="partnersList" @clicked-card="populatePartnerForm"
                        :parameter-options="generateParameters(partnerForm)" />
                    <PanelPartnerForm class="panel-form" :form-info="partnerForm" :items-list="itemsList"
                        :marker-position="[partnerForm.partnerLocation._long, partnerForm.partnerLocation._lat]"
                        @dragged-marker="updatePartnerLocation" />
                </div>
                <div class="tab-container flex wide" v-show="selectedTab === 'coupons'">
                    <Panel class="admin-panel" :card-source="couponsList" @clicked-card="populateCouponForm"
                        :parameter-options="generateParameters(couponForm)" />
                    <PanelCouponForm class="panel-form" :form-info="couponForm" :items-list="itemsList" />
                </div>
            </div>
        </Transition>
    </section>
</template>

<script>
export default {
    name: 'Admin Panel',
    components: {
        Panel, PanelPartnerForm, PanelOrderForm, PanelItemForm, PanelCouponForm, TabSelector, Recaptcha, LoadingGIF
    },
    data() {
        return {
            selectedTab: 'items',
            selectedLanguageProfile: undefined,
            adminPassword: import.meta.env.VITE_ADMIN_PASSWORD,
            adminPasswordInput: '',
            passedRecaptcha: false,
            passwordCheck: false,
            orderForm: {
                customer: {
                    name: '',
                    email: ''
                },
                orderItems: [],
                orderNotes: '',
                orderPrice: '',
                orderStatus: 0,
                paymentLink: '',
                paymentMethod: ''
            },
            itemForm: {
                itemAvailability: true,
                itemOnSale: false,
                itemHidden: false,
                itemCategories: undefined,
                itemLongDescription: undefined,
                itemPhoto: [],
                itemPrice: '',
                itemPriceSale: '',
                itemShortDescription: undefined,
                itemTitle: undefined
            },
            partnerForm: {
                partnerAddress: '',
                partnerLocation: {
                    _lat: -34.60653558169007,
                    _long: -58.4360043295337
                },
                partnerName: '',
                partnerEmail: '',
                partnerPhone: '',
                partnerActivity: true,
                partnerPrivacy: false
            },
            couponForm: {
                couponCode: '',
                couponType: 'percentage',
                couponAmount: 10,
                couponAppliesOn: 'cart',
                couponApplyValue: '',
                couponAppliesOnItems: [],
                couponIncludeSaleItems: false,
                couponActive: true,
                couponMinimumSpend: 0,
                couponMaximumDiscount: 100
            }
        }
    },
    computed: {
        ordersList() {
            return store.getters.orders;
        },
    },
    methods: {
        populateOrderForm(cardInfo) {
            this.orderForm = cardInfo;
        },
        populateItemForm(cardInfo) {
            this.itemForm = cardInfo;
        },
        populatePartnerForm(cardInfo) {
            this.partnerForm = cardInfo;
        },
        populateCouponForm(cardInfo) {
            this.couponForm = cardInfo;
        },
        updatePartnerLocation(newPosition) {
            this.partnerForm.partnerLocation = {
                _long: newPosition[1],
                _lat: newPosition[0]
            };
        },
        selectTab(index) {
            this.selectedTab = index;
        },
        generateParameters(objectForm) {
            let formParameters = Object.keys(objectForm);
            formParameters.unshift("id");
            return formParameters;
        },
        generateItemObjects(value) {
            let resultObject = {};

            switch (value) {
                case 'string':
                    this.$i18n.availableLocales.forEach(locale => {
                        resultObject[locale] = '';
                    });
                    break;
                case 'array':
                    this.$i18n.availableLocales.forEach(locale => {
                        resultObject[locale] = [];
                    });
                    break;
                default:
                    break;
            }

            return resultObject;
        },
        async checkRecaptcha(value) {
            this.passedRecaptcha = value;
        },
        accessPanel() {
            if (this.adminPasswordInput === this.adminPassword) {
                this.passwordCheck = true;
            } else {
                this.passwordCheck = false;
                this.wrongPasswordNotification();
            }
        },
        wrongPasswordNotification() {
            notify({
                title: this.$t("adminPanel.wrongPasswordTitle"),
                text: this.$t("adminPanel.wrongPasswordText"),
                type: 'error'
            });
        },
    },
    async mounted() {
        await store.dispatch('getOrders');
        if (!this.itemsList.length) { await store.dispatch('getItems'); }
        if (!this.partnersList.length) { await store.dispatch('getPartners'); }
        if (!this.couponsList.length) { await store.dispatch('getCoupons'); }

        this.itemForm.itemCategories = this.generateItemObjects('array');
        this.itemForm.itemTitle = this.generateItemObjects('string');
        this.itemForm.itemShortDescription = this.generateItemObjects('string');
        this.itemForm.itemLongDescription = this.generateItemObjects('string');
    }
}
</script>

<style scoped>
.admin-tabs:deep(.section-button label) {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}

.admin-tabs:deep(.section-button:first-of-type label) {
    border-top-left-radius: 2px;
}

.admin-tabs:deep(.section-button:last-of-type label) {
    border-top-right-radius: 2px;
}

.admin-panel {
    width: 65%;
}

.panel-form {
    width: 35%;
    border-left: 2px solid var(--white-soft);
}

@media only screen and (max-width: 750px) {
    div.tab-container {
        flex-direction: column;
    }

    .admin-panel {
        width: auto;
    }

    .panel-form {
        width: auto;
        border-left: none;
        border-top: 2px solid var(--white-soft);
    }

    .section-button label {
        font-size: 18px;
    }
}

@media only screen and (max-width: 1050px) {
    .admin-tabs:deep(.section-button label) {
        font-size: 17px;
    }
}

.master-container.light {
    .section-selector-container {
        border-color: var(--black-soft);
    }

    .panel-form {
        border-color: var(--black-soft);
    }
}
</style>
