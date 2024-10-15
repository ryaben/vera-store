<script setup>
import store from '../store';
import axios from "axios";
import AnimateHeight from 'vue-animate-height';
import { db } from '../firebase/init.js';
import { collection, addDoc } from "firebase/firestore";
import Recaptcha from '../components/ReCaptcha.vue';

defineProps({
    cartList: {
        type: Array,
        required: false,
        default: store.getters.cart
    },
    ordersList: {
        type: Array,
        required: false,
        default: store.getters.orders
    }
});
</script>

<template>
    <section class="page-section">
        <div class="flex column y-centered" v-if="processingOrder">
            <img class="loading-image" src="/img/loading.gif" alt="Loading">
            <p>Processing...</p>
        </div>
        <h2 class="form-title">Order request</h2>
        <form class="flex column wide" @submit.prevent="issueOrder">
            <div class="form-field flex column y-centered">
                <label for="checkoutFormName">Full name</label>
                <input type="text" id="checkoutFormName" required placeholder="John Doe" v-model="customerName">
            </div>
            <div class="form-field flex column y-centered">
                <label for="checkoutFormEmail">Email address</label>
                <input type="email" id="checkoutFormEmail" required placeholder="john.doe@email.com"
                    v-model="customerEmail">
            </div>
            <div class="purchase-overview flex space-between">
                <p>{{ cartList.length }} items</p>
                <div class="flex" style="margin: auto;">
                    <select name="orderCurrency" id="currencySelector" v-model="orderCurrency">
                        <option value="usd">USD</option>
                        <option v-if="paymentMethod === 'cash'" value="ars">ARS</option>
                    </select>
                    <p v-if="orderCurrency === 'usd'" class="total-price">{{ cartTotal.toFixed(2) }}</p>
                    <p v-if="orderCurrency === 'ars'" class="total-price">{{ (cartTotal * blueDollarRate).toFixed(2) }}</p>
                </div>
            </div>
            <div class="flex column wide" style="margin-bottom: 20px;">
                <div class="flex y-centered">
                    <input id="methodCash" type="radio" name="payment-method" value="cash" @change="updateHeight(); updateCurrencyToUSD()"
                        v-model="paymentMethod">
                    <label for="methodCash">Cash (USD or Argentinean Peso)</label>
                </div>
                <div class="flex y-centered">
                    <input id="methodCard" type="radio" name="payment-method" value="card" @change="updateHeight(); updateCurrencyToUSD()"
                        v-model="paymentMethod">
                    <label for="methodCard">Credit/debit card, bank transfer</label>
                </div>
            </div>
            <AnimateHeight :duration="300" :height="noteHeight" :animate-opacity="true">
                <p id="cartNotice" class="negative-text" v-show="cartTotal < 20">
                    Minimum amount of <b>$20</b> not reached. This is a threshold that Payoneer imposes for payment
                    requests.
                    You can instead either choose 'Cash' as payment method, or <router-link :to="{ name: 'Store' }">add more
                        items to the order</router-link>.
                </p>
                <p class="form-note">
                    Payment will be processed by <img src="/img/payoneer.png" alt="Logo"><a class="payoneer-text"
                        href="https://www.payoneer.com/" target="_blank">Payoneer</a>, a global renowned solution for
                    international purchases. Once you issue the order, we will receive it and generate a payment link
                    afterwards.
                    This payment link will be sent to you at the email address you added above. You'll be able to pay
                    with any type
                    of card, regardless of its issuer and country of origin. Charge will be carried out in United States
                    Dollar (USD).
                </p>
            </AnimateHeight>
            <Recaptcha class="order-recaptcha flex x-centered" @checkbox="checkRecaptcha" />
            <div class="flex wide space-between" style="margin-bottom: 20px;">
                <button class="action-button large red flex y-centered x-centered">
                    <router-link class="flex wide tall x-centered y-centered" :to="{ name: 'Cart' }">Back to
                        cart</router-link>
                </button>
                <input class="action-button large" type="submit" value="Issue order"
                    :class="{ 'disabled': (paymentMethod === 'card' && cartTotal < 20) || !passedRecaptcha || cartTotal <= 0 }">
            </div>
        </form>
    </section>
</template>

<script>
export default {
    name: 'Checkout',
    components: {
        AnimateHeight, Recaptcha
    },
    data() {
        return {
            blueDollarRate: 0,
            noteHeight: 0,
            customerName: '',
            customerEmail: '',
            paymentMethod: 'cash',
            processingOrder: false,
            passedRecaptcha: false,
            orderCurrency: 'usd'
        }
    },
    computed: {
        cartTotal() {
            let totalValue = 0;

            this.cartList.forEach(function (element) {
                totalValue += element.price;
            });

            return totalValue;
        }
    },
    methods: {
        updateHeight() {
            return this.noteHeight = this.noteHeight === 0 ? 'auto' : 0;
        },
        updateCurrencyToUSD() {
            this.orderCurrency = 'usd';
        },
        async issueOrder() {
            this.processingOrder = true;

            const docRef = await addDoc(collection(db, "orders"), {
                customer: {
                    name: this.customerName,
                    email: this.customerEmail
                },
                paymentMethod: this.paymentMethod,
                paymentLink: '',
                orderStatus: 0,
                orderPrice: this.cartTotal,
                orderItems: this.cartList.map((item) => { return item.id })
            });

            await store.dispatch("clearCart");
            this.processingOrder = false;
            this.$router.push({ name: 'Order', params: { orderID: docRef.id } });
        },
        async checkRecaptcha(value) {
            this.passedRecaptcha = value;
        }
    },
    mounted() {
        const that = this;
        axios.get("https://dolarapi.com/v1/dolares/blue")
            .then(function (response) {
                return that.blueDollarRate = (response.data.venta + response.data.compra) / 2;
            })
            .catch(function (error) {
                return console.log(error);
            })
    }
}
</script>

<style scoped>
.form-title {
    margin-top: 0;
}

.form-field {
    margin-bottom: 15px;
}

.form-field input {
    width: 70%;
}

.purchase-overview {
    margin: 10px auto 20px auto;
    width: 95%;
    border-bottom: 2px solid var(--white);
}

#currencySelector {
    font-size: 16px;
    height: 25px;
    width: 60px;
    margin-right: 5px;
}

.total-price {
    font-size: 18px;
    font-weight: bold;
    color: var(--soft-brown);
}

.form-note {
    width: 95%;
    font-size: 12px;
    margin-bottom: 25px;
}

.form-note>img {
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin: 0 2px 2px 0;
}

#cartNotice {
    font-size: 13px;
    margin: -5px auto 15px auto;
    width: 95%;
}

.order-recaptcha {
    margin-bottom: 25px;
}

.payoneer-text {
    font-weight: bold;
    text-decoration: underline;
    color: var(--payoneer-orange);
}

@media (prefers-color-scheme: light) {
    .purchase-overview {
        border-color: var(--black);
    }
}
</style>
