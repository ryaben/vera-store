<script setup>
import store from '../store';

defineProps({
    orderID: {
        id: String
    },
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    }
});
</script>

<template>
    <section class="page-section">
        <div class="flex column y-centered wide" v-if="!ordersList.length && !orderData">
            <img class="loading-image" src="/img/loading.gif" alt="Loading">
            <p>Loading data...</p>
        </div>
        <div class="flex column y-centered" v-if="ordersList.length && orderData === undefined">
            <p>An order with such ID does not exist.</p>
            <button class="action-button large red flex y-centered x-centered">
                <router-link class="flex x-centered y-centered" :to="{ name: 'Store' }">Go to
                    store</router-link>
            </button>
        </div>
        <div v-if="orderData" class="flex column y-centered">
            <h2 class="order-title">Order<br>{{ orderData.id }}</h2>
            <div style="margin-bottom: 20px;">
                <p class="item-list" v-for="(item, i) in differentItemsInCart" :key="i">
                    • {{ item.amount }} x {{ itemsList.find((el) => { return el.id === item.id }).title }}
                </p>
                <p class="items-total bold">${{ orderData.orderPrice.toFixed(2) }}</p>
            </div>
            <div class="status-grid wide">
                <div class="status-point done"></div>
                <hr class="status-line done">
                <div class="status-point" :class="{ 'done': orderData.orderStatus > 0 }"></div>
                <hr class="status-line" :class="{ 'done': orderData.orderStatus > 1 }">
                <div class="status-point" :class="{ 'done': orderData.orderStatus > 1 }"></div>
                <hr class="status-line" :class="{ 'done': orderData.orderStatus > 2 }">
                <div class="status-point" :class="{ 'done': orderData.orderStatus > 2 }"></div>
                <div class="flex x-centered">
                    <p class="status-legend done">Issued</p>
                </div>
                &nbsp;
                <div class="flex x-centered">
                    <p class="status-legend" :class="{ 'done': orderData.orderStatus > 0 }">Ready</p>
                </div>
                &nbsp;
                <div class="flex x-centered">
                    <p class="status-legend" :class="{ 'done': orderData.orderStatus > 1 }">Paid</p>
                </div>
                &nbsp;
                <div class="flex x-centered">
                    <p class="status-legend" :class="{ 'done': orderData.orderStatus > 2 }">Delivered</p>
                </div>
            </div>
            <p class="status-note" v-if="orderData.orderStatus === 0">
                Your order has been issued and we are processing it and assigning items on stock for it. If you chose
                Payoneer as payment method, the payment link will be available here and will also be sent to your email
                once it's generated.
            </p>
            <p class="status-note" v-if="orderData.orderStatus === 1">
                Everything is set! Your package of items is ready, so next step is receiving your payment. If you chose
                payment in cash, it will be on delivery. If you chose Payoneer to pay with credit/debit card or bank
                transfer, then the payment link should already be available here. Once you pay, please await up to 48 hours
                until our confirmation.
            </p>
            <p class="status-note" v-if="orderData.orderStatus === 2">
                There's nothing else to be done on your end! You'll enjoy your items when we deliver them on your
                check-out date.
            </p>
            <p class="status-note" v-if="orderData.orderStatus === 3">
                You have your souvenirs! We hope you enjoy them back home, and we thank you for your purchase!
            </p>
            <div class="payment-data">
                <p>
                    Payment method:
                    <span class="bold" v-if="orderData.paymentMethod === 'cash'">Cash</span>
                    <span class="bold" v-if="orderData.paymentMethod === 'card'">Payoneer</span>
                </p>
                <p v-if="orderData.paymentMethod === 'card'">
                    Payment link:
                    <span v-if="orderData.paymentLink === ''">Not available yet</span>
                    <a v-if="orderData.paymentLink !== ''" class="bold" :href="orderData.paymentLink" target="_blank">{{
                        orderData.paymentLink }}</a>
                </p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Order',
    data() {
        return {
        }
    },
    computed: {
        ordersList() {
            return store.getters.orders;
        },
        orderData() {
            const that = this;
            return this.ordersList.find(function (element) {
                return element.id === that.orderID;
            });
        },
        differentItemsInCart() {
            let items = [];

            this.orderData.orderItems.forEach(function (orderItem) {
                const itemCheck = items.find(function (item) {
                    return item.id === orderItem;
                });

                if (itemCheck === undefined) {
                    items.push({ id: orderItem, amount: 1 });
                } else {
                    itemCheck.amount++;
                }
            });

            return items;
        }
    },
    async beforeCreate() {
        await store.dispatch('getOrders');
    }
}
</script>

<style scoped>
.order-title {
    text-align: center;
    margin: 5px auto 20px auto;
}

.item-list {
    font-size: 16px;
    text-align: left;
}

.items-total {
    border-top: 2px solid var(--white);
    padding-top: 5px;
}

.status-grid {
    width: 70%;
    display: inline-grid;
    grid-template-columns: 16px 1fr 16px 1fr 16px 1fr 16px;
    text-align: center;
    margin-bottom: 20px;
}

.status-point {
    height: 16px;
    border-radius: 50%;
    background-color: var(--light-brown);
    margin-bottom: 5px;
}

.status-point.done {
    background-color: var(--light-success-tone);
}

.status-legend {
    font-size: 12px;
    line-height: 1;
    text-align: center;
    font-weight: bold;
}

.status-legend.done {
    color: var(--success-tone);
}

.status-line {
    height: 2px;
    background-color: var(--soft-brown);
    border: none;
    margin: 7px 0 0 0;
}

.status-line.done {
    background-color: var(--success-tone);
}

.status-note {
    font-size: 14px;
    margin-bottom: 25px;
    width: 90%;
    text-align: center;
}

.payment-data p {
    text-align: center;
    width: max-content;
}

@media (prefers-color-scheme: light) {
    .items-total {
    border-color: var(--black);
}
}
</style>
