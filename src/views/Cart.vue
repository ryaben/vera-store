<script setup>
import store from '../store';
import CartCard from '../components/CartCard.vue';
import { useWindowSize } from 'vue-window-size';
const { width, height } = useWindowSize();
const windowWidth = width;

defineProps({
    cartList: {
        type: Array,
        required: false,
        default: store.getters.cart
    }
});
</script>

<template>
    <section class="page-section">
        <h1 class="form-title">Shopping cart</h1>
        <div class="cart-container flex wide"
            :class="{ 'column': windowWidth < 1050 || !cartList.length, 'bordered': cartList.length }">
            <div class="cart-subcontainer flex column wide"
                :class="{ 'right-border': windowWidth >= 1050 && cartList.length }">
                <p v-if="!cartList.length">Your shopping cart is empty.<br><router-link :to="{ name: 'Store' }">Add
                        items</router-link> to start an order.</p>
                <h2 class="centered-text" v-if="cartList.length">Products included</h2>

                <div class="flex column y-centered">
                    <CartCard class="cart-card" v-for="(cartItem, i) in differentItemsInCart" :key="i"
                        :item-info="cartItem" :cart="cartList" />
                </div>
            </div>

            <div class="cart-subcontainer flex column wide">
                <div class="flex column" style="margin: 0 3.5% 0 3.5%;" v-if="cartList.length">
                    <h2 class="centered-text" v-if="cartList.length && windowWidth >= 1050">Purchase overview</h2>
                    <div class="flex" :class="{ 'right': windowWidth < 1050, 'x-centered': windowWidth >= 1050 }">
                        <label id="cartTotal">
                            Total: <span class="total-price">${{ cartTotal.toFixed(2) }}</span>
                        </label>
                    </div>
                    <div class="flex y-centered"
                        :class="{ 'right': windowWidth < 1050, 'x-centered': windowWidth >= 1050 }">
                        <label for="couponCode" class="flex right">Coupon:</label>
                        <input type="text" id="couponCode" placeholder="Enter code...">
                        <button class="action-button redeem">Redeem</button>
                    </div>
                </div>

                <div v-if="cartList.length" class="buttons-container flex wide space-evenly"
                    style="margin-bottom: 25px;">
                    <button class="action-button large red" @click="clearCart">Clear cart</button>
                    <button class="action-button large flex y-centered x-centered">
                        <router-link class="flex wide tall x-centered y-centered"
                            :to="{ name: 'Checkout' }">Checkout</router-link>
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
        CartCard
    },
    data() {
        return {
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

            this.cartList.forEach(function (element) {
                totalValue += element.price;
            });

            return totalValue;
        },
        async clearCart() {
            await store.dispatch("clearCart");
        }
    }
}
</script>

<style scoped>
.form-title {
    font-size: 24px;
    margin-top: 0;
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

#cartTotal .total-price {
    font-weight: bold;
    color: var(--soft-brown);
}

#cartTotal .total-price.discounted {
    text-decoration: line-through;
    opacity: 70%;
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

@media (prefers-color-scheme: light) {
    .cart-container.bordered,
    div.right-border {
        border-color: var(--black-soft);
    }
}
</style>
