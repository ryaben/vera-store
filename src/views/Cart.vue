<script setup>
import store from '../store';
import CartCard from '../components/CartCard.vue';

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
        <p v-if="!cartList.length">Your shopping cart is empty.<br><router-link :to="{ name: 'Store' }">Add
                items</router-link> to start an order.</p>
        <p v-if="cartList.length">These are the items included in your order:</p>

        <div class="flex column wide">
            <TransitionGroup name="fade">
                <CartCard v-for="(cartItem, i) in differentItemsInCart" :key="i" :item-info="cartItem"
                    :cart="cartList" />
            </TransitionGroup>
        </div>

        <div class="flex column wide">
            <p v-if="cartList.length" id="cartTotal">Total: <span class="total-price">${{ cartTotal.toFixed(2) }}</span>
            </p>
        </div>

        <div v-if="cartList.length" class="buttons-container flex wide space-between" style="margin-bottom: 25px;">
            <button class="action-button large red" @click="clearCart">Clear cart</button>
            <button class="action-button large flex y-centered x-centered">
                <router-link class="flex wide tall x-centered y-centered" :to="{ name: 'Checkout' }">Checkout</router-link>
            </button>
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
#cartTotal {
    font-size: 22px;
    margin: 4px 4px 0px auto;
}

#cartTotal .total-price {
    font-weight: bold;
    color: var(--soft-brown);
}

.buttons-container {
    margin-top: 40px;
}

@media (prefers-color-scheme: light) {}
</style>
