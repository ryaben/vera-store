<script setup>
import store from '../store';
import CartCard from '../components/CartCard.vue';
import { notify } from "@kyvg/vue3-notification";
import AnimateHeight from 'vue-animate-height';
import { useWindowSize } from 'vue-window-size';
const { width } = useWindowSize();
const windowWidth = width;

defineProps({
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    },
    cartList: {
        type: Array,
        required: false,
        default: store.getters.cart
    },
    couponsList: {
        type: Array,
        required: false,
        default: store.getters.coupons
    }
});
</script>

<template>
    <section class="page-section">
        <h2 class="form-title">{{ $t("cart.title") }}</h2>
        <div class="cart-container flex wide"
            :class="{ 'column': windowWidth < 1050 || !cartList.length, 'bordered': cartList.length }">
            <div class="cart-subcontainer flex column wide"
                :class="{ 'right-border': windowWidth >= 1050 && cartList.length }">
                <p class="centered-text" v-if="!cartList.length">
                    {{ $t("cart.emptyCart") }}<br><router-link :to="{ name: 'Store' }">
                        {{ $t("cart.addItems") }}</router-link>
                    {{ $t("cart.startOrder") }}
                </p>
                <h2 class="centered-text" v-if="cartList.length">{{ $t("cart.subtitle1") }}</h2>

                <div class="flex column y-centered">
                    <CartCard class="cart-card" v-for="(cartItem, i) in differentItemsInCart" :key="i"
                        :item-info="cartItem" :cart="cartList" />
                </div>
            </div>

            <div class="cart-subcontainer flex column wide">
                <div class="flex column" style="margin: 0 3.5% 0 3.5%;" v-if="cartList.length">
                    <h2 class="centered-text" v-if="cartList.length && windowWidth >= 1050">{{ $t("cart.subtitle2") }}
                    </h2>
                    <div class="flex x-centered">
                        <label id="cartTotal">
                            {{ $t("cart.total") }}
                            <span class="total-price"
                                :class="{ 'strikethrough': redeemedCoupon, 'discounted': redeemedCoupon }">
                                ${{ (cartTotal.totalValue + cartTotal.totalValueSales).toFixed(2) }}
                            </span>
                            <span v-if="redeemedCoupon" class="total-price">
                                ${{ cartTotalWithDiscount }}
                            </span>
                        </label>
                    </div>
                    <div class="flex x-centered y-centered">
                        <label for="couponCode" class="flex right">{{ $t("cart.coupon") }}</label>
                        <input v-model="couponCodeValue" type="text" id="couponCode"
                            :placeholder="$t('cart.enterCode')">
                        <button class="action-button redeem" @click="redeemCoupon">{{ $t("cart.redeem") }}</button>
                    </div>
                    <AnimateHeight :duration="300" :height="couponInfoHeight" :animate-opacity="true">
                        <div v-if="redeemedCoupon" class="coupon-info flex top-margin x-centered y-centered">
                            <p>
                                {{ $t("cart.coupon2") }}{{ redeemedCoupon.couponCode }}{{ $t("cart.wasRedeemed") }}
                                {{ $t("cart.enjoy") }}<span v-if="redeemedCoupon.couponType === 'fixed'">$</span>{{
                                    redeemedCoupon.couponAmount }}<span
                                    v-if="redeemedCoupon.couponType === 'percentage'">%</span>{{ $t("cart.offOn") }}
                                <span v-if="redeemedCoupon.couponAppliesOn === 'cart'">{{ $t("cart.entirePurchase")
                                    }}</span>
                                <span v-if="redeemedCoupon.couponAppliesOn === 'itemsByID'">
                                    <span v-for="(itemID, i) in redeemedCoupon.couponAppliesOnItems" :key="i">
                                        {{ itemsList.find(el => el.id === itemID).itemTitle }}<span
                                            v-if="i + 1 >= redeemedCoupon.couponAppliesOnItems.length">.</span><span
                                            v-if="i + 1 < redeemedCoupon.couponAppliesOnItems.length">, </span>
                                    </span>
                                </span>
                                <span v-if="redeemedCoupon.couponAppliesOn === 'itemsByCategory'">
                                    <span v-for="(itemCategory, i) in redeemedCoupon.couponAppliesOnItems" :key="i">
                                        {{ itemCategory }}<span
                                            v-if="i + 1 >= redeemedCoupon.couponAppliesOnItems.length">.</span><span
                                            v-if="i + 1 < redeemedCoupon.couponAppliesOnItems.length">, </span>
                                    </span>
                                </span>
                                <span v-if="redeemedCoupon.couponIncludeSaleItems">{{ $t("cart.includesSale") }}</span>
                                <span v-if="!redeemedCoupon.couponIncludeSaleItems">{{ $t("cart.notIncludesSale")
                                    }}</span>
                                <span>{{ $t("cart.minimumSpend") }} ${{ redeemedCoupon.couponMinimumSpend }}.</span>
                            </p>
                        </div>
                    </AnimateHeight>
                </div>

                <div v-if="cartList.length" class="buttons-container flex wide space-evenly"
                    style="margin-bottom: 25px;">
                    <button class="action-button large red" @click="clearCart">{{ $t("cart.clear") }}</button>
                    <button class="action-button large flex y-centered x-centered" @click="setCheckoutAmount">
                        <router-link class="flex wide tall x-centered y-centered" :to="{ name: 'Checkout' }">
                            {{ $t("cart.checkout") }}
                        </router-link>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Cart',
    components: {
        CartCard, AnimateHeight
    },
    data() {
        return {
            couponCodeValue: "",
            couponInfoHeight: 0,
        }
    },
    computed: {
        differentItemsInCart() {
            let items = [];

            this.cartList.forEach(function (cartItem) {
                const itemCheck = items.find(function (item) {
                    return item.id === cartItem.id;
                });

                if (itemCheck === undefined) {
                    items.push(cartItem);
                }
            });

            return items;
        },
        cartTotal() {
            let totalValue = 0;
            let totalValueSales = 0;

            this.cartList.forEach(function (element) {
                element.itemOnSale ? totalValueSales += element.itemPriceSale : totalValue += element.itemPrice;
            });

            return { totalValue: totalValue, totalValueSales: totalValueSales };
        },
        redeemedCoupon() {
            return this.couponsList.find(function (coupon) {
                return coupon.redeemed;
            });
        },
        couponDiscountAmount() {
            return this.calculateCouponDiscountAmount();
        },
        cartTotalWithDiscount() {
            return (this.cartTotal.totalValue + this.cartTotal.totalValueSales - this.couponDiscountAmount).toFixed(2);
        }
    },
    methods: {
        redeemCoupon() {
            this.couponsList.forEach(coupon => { coupon.redeemed = false; })

            const matchedCoupon = this.couponsList.every(coupon => {
                if (coupon.couponCode === this.couponCodeValue && coupon.couponActive) {
                    coupon.redeemed = true;
                    this.couponInfoHeight = 'auto';
                    return false;
                }

                this.couponInfoHeight = 0;
                return true;
            });

            this.couponCodeValue = '';

            matchedCoupon ? this.redeemFailureNotification() : this.redeemNotification();
        },
        calculateCouponDiscountAmount() {
            const that = this;

            try {
                if (this.redeemedCoupon.couponMinimumSpend > (this.cartTotal.totalValue + this.cartTotal.totalValueSales)) {
                    return 0;
                } else {
                    if (this.redeemedCoupon.couponAppliesOn === 'cart') {
                        if (this.redeemedCoupon.couponType === 'fixed') {
                            return this.redeemedCoupon.couponAmount;
                        }
                        else if (this.redeemedCoupon.couponType === 'percentage') {
                            if (this.redeemedCoupon.couponIncludeSaleItems) {
                                return ((this.redeemedCoupon.couponAmount / 100) * (this.cartTotal.totalValue + this.cartTotal.totalValueSales));
                            } else {
                                return ((this.redeemedCoupon.couponAmount / 100) * this.cartTotal.totalValue);
                            }
                        }
                    } else {
                        let itemsTotalWithoutDiscount = 0;

                        this.cartList.forEach(function (item) {
                            function addMatchingItemsPrice() {
                                if (that.redeemedCoupon.couponIncludeSaleItems) {
                                    item.itemOnSale ? itemsTotalWithoutDiscount += item.itemPriceSale : itemsTotalWithoutDiscount += item.itemPrice;
                                } else {
                                    if (!item.itemOnSale) { itemsTotalWithoutDiscount += item.itemPrice; }
                                }
                            }

                            if (that.redeemedCoupon.couponAppliesOn === 'itemsByID') {
                                if (that.redeemedCoupon.couponAppliesOnItems.find(el => el === item.id)) {
                                    addMatchingItemsPrice();
                                }
                            } else if (that.redeemedCoupon.couponAppliesOn === 'itemsByCategory') {
                                if (that.arrayContainsAny(that.redeemedCoupon.couponAppliesOnItems, item.itemCategories)) {
                                    addMatchingItemsPrice();
                                }
                            }
                        });

                        if (this.redeemedCoupon.couponType === 'fixed') {
                            if (this.redeemedCoupon.couponAmount > itemsTotalWithoutDiscount) {
                                return itemsTotalWithoutDiscount;
                            } else {
                                return this.redeemedCoupon.couponAmount;
                            }
                        } else if (this.redeemedCoupon.couponType === 'percentage') {
                            return (this.redeemedCoupon.couponAmount / 100) * itemsTotalWithoutDiscount;
                        }
                    }
                }
            } catch {
                return 0;
            }
        },
        async clearCart() {
            await store.dispatch("clearCart");
        },
        async setCheckoutAmount() {
            await store.dispatch("setCheckoutAmount", { amount: this.cartTotalWithDiscount });
        },
        arrayContainsAny(array1, array2) {
            return array1.some(item => array2.includes(item));
        },
        redeemNotification() {
            notify({
                title: this.$t("cart.redeemNotificationTitle"),
                text: this.$t("cart.redeemNotificationText"),
                type: "success"
            });
        },
        redeemFailureNotification() {
            notify({
                title: this.$t("cart.redeemFailureNotificationTitle"),
                text: this.$t("cart.redeemFailureNotificationText"),
                type: "error"
            });
        },
    }
}
</script>

<style scoped>
.form-title {
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 2.5%;
}

.cart-container {
    border-radius: 10px;
}

.cart-container.bordered {
    border: 2px solid var(--white-soft);
}

div.right-border {
    border-right: 2px solid var(--white-soft);
}

.cart-subcontainer {
    padding-bottom: 20px;
}

#cartTotal {
    font-size: 24px;
    margin-top: 4px;
    margin-bottom: 10px;
}

.total-price {
    font-weight: bold;
    color: var(--black-soft);
}

.total-price.discounted {
    opacity: 0.7;
    color: var(--negative-main-palette);
}

.buttons-container {
    margin-top: 35px;
}

#couponCode {
    width: 35%;
    max-width: 300px;
    margin: auto 5px auto 5px;
}

.action-button.redeem {
    padding: 6px;
}

.coupon-info {
    margin-left: auto;
    margin-right: auto;
    width: 75%;
    padding: 10px;
    background: var(--success-tone);
    color: var(--white-soft);
    border-radius: 3px;
}

.coupon-info p {
    margin-bottom: 0;
}

@media (prefers-color-scheme: light) {

    .cart-container.bordered,
    div.right-border {
        border-color: var(--black-soft);
    }
}
</style>
