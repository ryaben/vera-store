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
            <p>{{ $t("order.loading") }}</p>
        </div>
        <div class="flex column y-centered" v-if="ordersList.length && orderData === undefined">
            <p>{{ $t("order.missingOrder") }}</p>
            <button class="action-button large red flex y-centered x-centered">
                <router-link class="flex x-centered y-centered" :to="{ name: 'Store' }">{{ $t("order.goToStore")
                    }}</router-link>
            </button>
        </div>
        <div v-if="orderData" class="flex column y-centered">
            <h2 class="order-title centered-text">{{ $t("order.title") }}<br>{{ orderData.id }}</h2>
            <!-- <p class="bottom-margin bold">
                {{ $t("order.issueDate") }}&nbsp;
                {{ orderDate.getDate() }}/{{ orderDate.getMonth() + 1 }}/{{ orderDate.getFullYear() }}
            </p> -->
            <div style="margin-bottom: 20px;">
                <p class="item-list" v-for="(item, i) in differentItemsInCart" :key="i">
                    • {{ item.amount }} x {{ itemsList.find((el) => { return el.id === item.id }).itemTitle }}
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
                    <p class="status-legend done">{{ $t("global.status0Title") }}</p>
                </div>
                &nbsp;
                <div class="flex x-centered">
                    <p class="status-legend" :class="{ 'done': orderData.orderStatus > 0 }">{{ $t("global.status1Title")
                        }}</p>
                </div>
                &nbsp;
                <div class="flex x-centered">
                    <p class="status-legend" :class="{ 'done': orderData.orderStatus > 1 }">{{ $t("global.status2Title")
                        }}</p>
                </div>
                &nbsp;
                <div class="flex x-centered">
                    <p class="status-legend" :class="{ 'done': orderData.orderStatus > 2 }">{{ $t("global.status3Title")
                        }}</p>
                </div>
                <div class="flex x-centered">
                    <p class="order-date centered-text">
                        {{ orderDate.getDate() }}/{{ orderDate.getMonth() + 1 }}/{{ orderDate.getFullYear() }}
                    </p>
                </div>
            </div>
            <p class="status-note" v-if="orderData.orderStatus === 0">
                {{ $t("order.status0Note") }}
            </p>
            <p class="status-note" v-if="orderData.orderStatus === 1">
                {{ $t("order.status1Note") }}
            </p>
            <p class="status-note" v-if="orderData.orderStatus === 2">
                {{ $t("order.status2Note") }}
            </p>
            <p class="status-note" v-if="orderData.orderStatus === 3">
                {{ $t("order.status3Note") }}
            </p>
            <div class="payment-data">
                <p>
                    {{ $t("order.paymentMethod") }}
                    <span class="bold" v-if="orderData.paymentMethod === 'cash'">{{ $t("order.paymentMethod1") }}</span>
                    <span class="bold" v-if="orderData.paymentMethod === 'card'">Payoneer</span>
                </p>
                <p v-if="orderData.paymentMethod === 'card'">
                    {{ $t("order.paymentLink") }}
                    <span v-if="orderData.paymentLink === ''">{{ $t("order.notAvailable") }}</span>
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
        orderDate() {
            return this.orderData.orderIssueDate.toDate();
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

.order-date {
    font-size: 12px;
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

@media (min-width: 1050px) {
    .status-legend {
        font-size: 18px;
    }

    .order-date {
        font-size: 16px;
    }

    .status-note {
        font-size: 16px;
    }
}
</style>
