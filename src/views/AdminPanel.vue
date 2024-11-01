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
    }
});
</script>

<template>
    <section class="page-section bordered">
        <TabSelector class="admin-tabs" :tab-list="adminTabs" @tab-selected="selectTab" />

        <div class="tab-container flex wide" v-show="selectedTab === 'orders'">
            <Panel class="admin-panel" :card-source="ordersList" @clicked-card="populateOrderForm" />
            <PanelForm class="panel-form" :form-type="'order'" :form-info="orderForm" :items-list="itemsList" />
        </div>
        <div class="tab-container flex wide" v-show="selectedTab === 'items'">
            <Panel class="admin-panel" :card-source="itemsList" @clicked-card="populateItemForm" />
            <PanelForm class="panel-form" :form-type="'item'" :form-info="itemForm" :items-list="itemsList" />
        </div>
        <div class="tab-container flex wide" v-show="selectedTab === 'partners'">
            <Panel class="admin-panel" :card-source="partnersList" @clicked-card="populatePartnerForm" />
            <PanelForm class="panel-form" :form-type="'partner'" :form-info="partnerForm" :items-list="itemsList"
                :marker-position="[partnerForm.partnerLocation._long, partnerForm.partnerLocation._lat]" @dragged-marker="updatePartnerLocation" />
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
            adminTabs: [
                { identifier: 'items', tabTitle: 'Store items' },
                { identifier: 'orders', tabTitle: 'Customer orders' },
                { identifier: 'partners', tabTitle: 'Partner hosts' },
                { identifier: 'coupons', tabTitle: 'Store coupons' }
            ],
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
                available: true,
                longDescription: '',
                photo: '',
                price: '',
                shortDescription: '',
                title: ''
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
        updatePartnerLocation(newPosition) {
            this.partnerForm.partnerLocation = {
                _long: newPosition[1],
                _lat: newPosition[0]
            };
        },
        selectTab(index) {
            this.selectedTab = index;
        }
    },
    async beforeCreate() {
        await store.dispatch('getOrders');
    }
}
</script>

<style scoped>
.admin-tabs:deep(.section-button label) {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
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
