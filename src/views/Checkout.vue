<script setup>
import store from '../store';
import axios from "axios";
import AnimateHeight from 'vue-animate-height';
import { db } from '../firebase/init.js';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Recaptcha from '../components/ReCaptcha.vue';
import MapboxMap from '../components/MapboxMap.vue';
import { notify } from "@kyvg/vue3-notification";
import { useWindowSize } from 'vue-window-size';
const { width, height } = useWindowSize();
const windowWidth = width;

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
    },
    partnersList: {
        type: Array,
        required: false,
        default: store.getters.partners
    },
    checkoutAmount: {
        type: Number,
        required: false,
        default: store.getters.checkout
    }
});
</script>

<template>
    <section class="page-section">
        <h1 class="form-title">{{ $t("checkout.title") }}</h1>
        <div class="flex column y-centered" v-if="processingOrder">
            <img class="loading-image" src="/img/loading.gif" alt="Loading">
            <p>{{ $t("checkout.processing") }}</p>
        </div>
        <form class="form-container flex wide" :class="{ 'column': windowWidth < 1050 }" @submit.prevent="issueOrder">
            <div class="form-subcontainer flex column" :class="{ 'wide right-border': windowWidth >= 1050 }">
                <h2 class="centered-text">{{ $t("checkout.formSectionTitle1") }}</h2>
                <div class="form-field flex column y-centered">
                    <label for="checkoutFormName">{{ $t("checkout.formField1") }}</label>
                    <input type="text" id="checkoutFormName" required placeholder="John Doe" v-model="customerName">
                </div>
                <div class="form-field flex column y-centered">
                    <label for="checkoutFormEmail">{{ $t("checkout.formField2") }}</label>
                    <input type="email" id="checkoutFormEmail" required placeholder="john.doe@email.com"
                        v-model="customerEmail">
                </div>
                <div class="form-field flex column y-centered">
                    <label>{{ $t("checkout.formField3") }}</label>
                    <p>{{ $t("checkout.selected") }}
                        <span v-if="!selectedHost">{{ $t("checkout.noneSelected") }}</span>
                        <span v-if="selectedHost" class="bold">
                            {{ selectedHostAddress }}
                        </span>
                    </p>
                    <MapboxMap :height="'40vh'" :width="'90%'" :mode="'locationMap'" :collection="partnersList"
                        @host-selected="selectHost" />
                </div>
            </div>

            <div class="form-subcontainer flex column" :class="{ 'wide': windowWidth >= 1050, 'top-border': windowWidth < 1050 }">
                <h2 class="centered-text">{{ $t("checkout.formSectionTitle2") }}</h2>
                <div class="purchase-overview flex space-between">
                    <p>{{ cartList.length }} {{ $t("checkout.items") }}</p>
                    <div class="flex" style="margin: auto;">
                        <select name="orderCurrency" id="currencySelector" v-model="orderCurrency">
                            <option value="usd">USD</option>
                            <option v-if="paymentMethod === 'cash'" value="ars">ARS</option>
                        </select>
                        <p v-if="orderCurrency === 'usd'" class="total-price">{{ checkoutAmount.toFixed(2) }}</p>
                        <p v-if="orderCurrency === 'ars'" class="total-price">{{ (checkoutAmount * blueDollarRate).toFixed(2)
                            }}
                        </p>
                    </div>
                </div>
                <div class="flex column wide" style="margin-bottom: 20px;">
                    <div class="flex x-centered y-centered">
                        <input id="methodCash" type="radio" name="payment-method" value="cash"
                            @change="updateHeight(); updateCurrencyToUSD()" v-model="paymentMethod">
                        <label for="methodCash">{{ $t("checkout.paymentMethod1") }}</label>
                    </div>
                    <div class="flex x-centered y-centered">
                        <input id="methodCard" type="radio" name="payment-method" value="card"
                            @change="updateHeight(); updateCurrencyToUSD()" v-model="paymentMethod">
                        <label for="methodCard">{{ $t("checkout.paymentMethod2") }}</label>
                    </div>
                </div>
                <AnimateHeight :duration="300" :height="noteHeight" :animate-opacity="true">
                    <p id="cartNotice" class="negative-text" v-show="checkoutAmount < 20">
                        {{ $t("checkout.cartNotice") }}<router-link :to="{ name: 'Store' }">{{
                            $t("checkout.cartNoticeLink") }}</router-link>
                    </p>
                    <p class="form-note">
                        {{ $t("checkout.payoneerNote1") }}<img src="/img/payoneer.png" alt="Logo"><a
                            class="payoneer-text" href="https://www.payoneer.com/" target="_blank">Payoneer</a>{{
                                $t("checkout.payoneerNote2") }}
                    </p>
                </AnimateHeight>
                <Recaptcha class="order-recaptcha flex x-centered" @checkbox="checkRecaptcha" />
                <div class="flex wide space-evenly" style="margin-bottom: 20px;">
                    <button class="action-button large red flex y-centered x-centered">
                        <router-link class="flex wide tall x-centered y-centered" :to="{ name: 'Cart' }">
                            {{ $t("checkout.back") }}
                        </router-link>
                    </button>
                    <input class="action-button large" type="submit" :value="$t('checkout.issueOrder')"
                        :class="{ 'disabled': (paymentMethod === 'card' && checkoutAmount < 20) || !passedRecaptcha || checkoutAmount <= 0 }">
                </div>
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
            orderCurrency: 'usd',
            selectedHost: undefined
        }
    },
    computed: {
        selectedHostAddress() {
            const that = this;
            return this.partnersList.find(el => { return el.id === that.selectedHost }).partnerAddress;
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
            const that = this;

            if (!this.selectedHost) {
                return this.missingHostNotification();
            }

            this.processingOrder = true;

            const docRef = await addDoc(collection(db, "orders"), {
                customer: {
                    name: this.customerName,
                    email: this.customerEmail
                },
                paymentMethod: this.paymentMethod,
                paymentLink: '',
                orderCurrency: this.orderCurrency,
                orderIssueDate: Timestamp.fromDate(new Date()),
                orderLocation: this.selectedHost,
                orderStatus: 0,
                orderPrice: this.checkoutAmount,
                orderItems: this.cartList.map((item) => { return item.id })
            });

            await store.dispatch("clearCart");
            await store.dispatch("setCheckoutAmount", { amount: 0 });
            this.processingOrder = false;
            this.orderCreationNotification(docRef.id);
            this.$router.push({ name: 'Order', params: { orderID: docRef.id } });
        },
        async checkRecaptcha(value) {
            this.passedRecaptcha = value;
        },
        orderCreationNotification(orderID) {
            notify({
                title: this.$t("checkout.orderCreatedTitle"),
                text: `${this.$t("checkout.orderCreatedText1")}${orderID}${this.$t("checkout.orderCreatedText2")}`,
                type: "success"
            });
        },
        missingHostNotification() {
            notify({
                title: this.$t("checkout.noHostTitle"),
                text: this.$t("checkout.noHostText"),
                type: "error"
            });
        },
        selectHost(markerID) {
            this.selectedHost = markerID;
        },
        convertTZ(date, tzString) {
            return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("es-AR", { timeZone: tzString }));
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
            });
    }
}
</script>

<style scoped>
.form-title {
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 2.5%;
}

.form-container {
    border: 2px solid var(--white-soft);
    border-radius: 10px;
}

.form-subcontainer {
    padding: 10px;
}

.form-subcontainer.top-border {
    border-top: 2px solid var(--white-soft);
}

div.right-border {
    border-right: 2px solid var(--white-soft);
}

.form-field {
    margin-bottom: 15px;
}

.form-field input {
    width: 70%;
    max-width: 500px;
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
    .form-container,
    div.right-border,
    .form-subcontainer.top-border {
        border-color: var(--black-soft);
    }

    .purchase-overview {
        border-color: var(--black);
    }
}
</style>
