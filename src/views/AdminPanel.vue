<script setup>
import store from '../store';
import Panel from '../components/Panel.vue';
import PanelForm from '../components/PanelForm.vue';

defineProps({
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    }
});
</script>

<template>
    <section class="page-section bordered">
        <div class="section-selector-container wide">
            <div class="flex x-centered y-centered wide section-button">
                <input id="itemsTab" class="hidden" type="radio" name="selected-tab" value="items"
                    v-model="selectedTab">
                <label class="flex wide bold x-centered y-centered" for="itemsTab"
                    :class="{ 'selected': selectedTab === 'items' }">Store items</label>
            </div>
            <div class="flex x-centered y-centered wide section-button">
                <input id="ordersTab" class="hidden" type="radio" name="selected-tab" value="orders"
                    v-model="selectedTab">
                <label class="flex wide bold x-centered y-centered" for="ordersTab"
                    :class="{ 'selected': selectedTab === 'orders' }">Customer orders</label>
            </div>
        </div>
        <div class="tab-container flex wide" v-show="selectedTab === 'orders'">
            <Panel class="admin-panel" :card-source="ordersList" :panel-type="'order'" @clicked-card="populateOrderForm" />
            <PanelForm class="panel-form" :form-type="'order'" :form-info="orderForm" :items-list="itemsList" />
        </div>
        <div class="tab-container flex wide" v-show="selectedTab === 'items'">
            <Panel class="admin-panel" :card-source="itemsList" :panel-type="'item'" @clicked-card="populateItemForm" />
            <PanelForm class="panel-form" :form-type="'item'" :form-info="itemForm" :items-list="itemsList" />
        </div>
    </section>
</template>

<script>
export default {
    name: 'Admin Panel',
    components: {
        Panel, PanelForm
    },
    data() {
        return {
            selectedTab: 'orders',
            orderForm: {
                customer: {
                    name: '',
                    email: ''
                },
                orderItems: [],
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
        }
    },
    async beforeCreate() {
        await store.dispatch('getOrders');
    }
}
</script>

<style scoped>
.section-selector-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 2px solid var(--white-soft);
}

.section-button {
    height: 60px;
}

.section-button label {
    font-size: 22px;
    letter-spacing: 0.5px;
    height: 100%;
    cursor: pointer;
    transition: background-color 0.25s;
}

.section-button label.selected {
    background-color: var(--soft-brown);
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
