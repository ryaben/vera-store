<script setup>
import store from '../store';
import axios from "axios";
import AnimateHeight from 'vue-animate-height';
import VueDatePicker from '@vuepic/vue-datepicker';
import { db } from '../firebase/init.js';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Recaptcha from '../components/ReCaptcha.vue';
import MapboxMap from '../components/MapboxMap.vue';
import LoadingGIF from '../components/LoadingGIF.vue';
import { notify } from "@kyvg/vue3-notification";
import { useWindowSize } from 'vue-window-size';
const { width } = useWindowSize();
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
        <h2 class="form-title">{{ $t("checkout.title") }}</h2>
        <LoadingGIF :visible="processingOrder" :description="$t('checkout.processing')" />
        <form class="form-container flex wide" :class="{ 'column': windowWidth < 1050 }" @submit.prevent="issueOrder">
            <div class="form-subcontainer flex column" :class="{ 'wide right-border': windowWidth >= 1050 }">
                <h2 class="centered-text">{{ $t("checkout.formSectionTitle1") }}</h2>
                <div class="form-field flex column y-centered bottom-margin">
                    <label for="checkoutFormName">{{ $t("checkout.formField1") }}</label>
                    <input type="text" id="checkoutFormName" required :placeholder="$t('checkout.namePlaceholder')" v-model="customerName">
                </div>
                <div class="form-field flex column y-centered bottom-margin">
                    <label for="checkoutFormEmail">{{ $t("checkout.formField2") }}</label>
                    <input type="email" id="checkoutFormEmail" required :placeholder="$t('checkout.emailPlaceholder')"
                        v-model="customerEmail">
                </div>
                <div class="form-field flex column y-centered">
                    <label>{{ $t("checkout.formFieldDate") }}</label>
                    <VueDatePicker id="deliveryDate" v-model="deliveryDate" month-name-format="long"
                        :flow="['year', 'month', 'calendar']" :utc="'preserve'" :timezone="'UTC'"
                        :now-button-label="$t('checkout.today')" :select-text="$t('checkout.selectDate')"
                        :cancel-text="$t('checkout.cancelDate')" :placeholder="$t('checkout.placeholderDate')"
                        :is-24="$i18n.locale === 'en' ? false : true" :min-date="new Date()"
                        :year-range="[new Date().getFullYear(), new Date().getFullYear() + 1]" :required="true" />
                </div>
                <div class="form-field flex column y-centered bottom-margin">
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

            <div class="form-subcontainer flex column"
                :class="{ 'wide': windowWidth >= 1050, 'top-border': windowWidth < 1050 }">
                <h2 class="centered-text">{{ $t("checkout.formSectionTitle2") }}</h2>
                <div class="purchase-overview flex space-between">
                    <p>{{ cartList.length }} {{ $t("checkout.items") }}</p>
                    <div class="flex auto-margin">
                        <select name="orderCurrency" id="currencySelector" v-model="orderCurrency">
                            <option value="usd">USD</option>
                            <option v-if="paymentMethod === 'cash'" value="ars">ARS</option>
                        </select>
                        <p v-if="orderCurrency === 'usd'" class="total-price">{{ checkoutAmount.toFixed(2) }}</p>
                        <p v-if="orderCurrency === 'ars'" class="total-price">{{ (checkoutAmount *
                            blueDollarRate).toFixed(2)
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
                <Recaptcha class="flex x-centered bottom-margin" @checkbox="checkRecaptcha" />
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
        AnimateHeight, Recaptcha, VueDatePicker, LoadingGIF
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
            selectedHost: undefined,
            deliveryDate: ''
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
            const orderAmount = this.orderCurrency === "usd" ? this.checkoutAmount : (this.checkoutAmount * this.blueDollarRate);

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
                orderCheckoutDate: Timestamp.fromDate(this.deliveryDate),
                orderLocation: this.selectedHost,
                orderNotes: '',
                orderStatus: 0,
                orderPrice: orderAmount,
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
    async beforeMount() {
        if (!this.partnersList.length) { await store.dispatch('getPartners'); }
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

.form-field input,
#deliveryDate {
    width: 70%;
    max-width: 500px;
    height: 30px;
}

#deliveryDate {
    margin-bottom: 25px;
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
    color: var(--soft-main-palette);
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

.payoneer-text {
    font-weight: bold;
    text-decoration: underline;
    color: var(--payoneer-orange);
}

.master-container.light {
    .form-container,
    div.right-border,
    .form-subcontainer.top-border,
    .purchase-overview {
        border-color: var(--black-soft);
    }
}
</style>
