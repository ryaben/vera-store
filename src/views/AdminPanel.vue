<script setup>
import store from '../store';
import Panel from '../components/Panel.vue';
import PanelForm from '../components/PanelForm.vue';
import TabSelector from '../components/TabSelector.vue';

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
        <TabSelector class="admin-tabs" @tab-selected="selectTab" :tab-list="[
            { identifier: 'items', tabTitle: $t('adminPanel.itemsTabTitle') },
            { identifier: 'orders', tabTitle: $t('adminPanel.ordersTabTitle') },
            { identifier: 'partners', tabTitle: $t('adminPanel.hostsTabTitle') },
            { identifier: 'coupons', tabTitle: $t('adminPanel.couponsTabTitle') }
        ]" />

        <div class="tab-container flex wide" v-show="selectedTab === 'orders'">
            <Panel class="admin-panel" :card-source="ordersList" @clicked-card="populateOrderForm" :parameter-options="generateParameters(orderForm)" />
            <PanelForm class="panel-form" :form-type="'order'" :form-info="orderForm" :items-list="itemsList" />
        </div>
        <div class="tab-container flex wide" v-show="selectedTab === 'items'">
            <Panel class="admin-panel" :card-source="itemsList" @clicked-card="populateItemForm" :parameter-options="generateParameters(itemForm)" />
            <PanelForm class="panel-form" :form-type="'item'" :form-info="itemForm" :items-list="itemsList" />
        </div>
        <div class="tab-container flex wide" v-show="selectedTab === 'partners'">
            <Panel class="admin-panel" :card-source="partnersList" @clicked-card="populatePartnerForm" :parameter-options="generateParameters(partnerForm)" />
            <PanelForm class="panel-form" :form-type="'partner'" :form-info="partnerForm" :items-list="itemsList"
                :marker-position="[partnerForm.partnerLocation._long, partnerForm.partnerLocation._lat]"
                @dragged-marker="updatePartnerLocation" />
        </div>
        <div class="tab-container flex wide" v-show="selectedTab === 'coupons'">
            <Panel class="admin-panel" :card-source="couponsList" @clicked-card="populateCouponForm" :parameter-options="generateParameters(couponForm)" />
            <PanelForm class="panel-form" :form-type="'coupon'" :form-info="couponForm" :items-list="itemsList" />
        </div>
    </section>
</template>

<script>
export default {
    name: 'Admin Panel',
    components: {
        Panel, PanelForm, TabSelector
    },
    data() {
        return {
            selectedTab: 'items',
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
                itemCategories: [],
                itemLongDescription: '',
                itemPhoto: '',
                itemPrice: '',
                itemPriceSale: '',
                itemShortDescription: '',
                itemTitle: ''
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
                couponAmount: 1,
                couponAppliesOn: 'cart',
                couponApplyValue: '',
                couponAppliesOnItems: [],
                couponIncludeSaleItems: false,
                couponActive: true,
                couponMinimumSpend: 0
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
        }
    },
    async beforeCreate() {
        await store.dispatch('getOrders');
    }
}
</script>

<style scoped>
.admin-tabs {
    background: var(--soft-beige);
}

.admin-tabs:deep(.section-button label) {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}

.tab-container {
    background: var(--soft-beige);
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

@media (prefers-color-scheme: light) {
    .section-selector-container {
        border-color: var(--black-soft);
    }

    .panel-form {
        border-color: var(--black-soft);
    }
}
</style>
