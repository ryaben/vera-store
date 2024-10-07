<script setup>
import store from '../store';

defineProps({
    itemInfo: {
        type: Object,
        required: true,
        default: [{
            id: "",
            title: "Item title",
            photo: "/img/broken-img.png",
            shortDescription: "Item short description",
            longDescription: "Item long description",
            price: 1
        }]
    },
    cart: {
        type: Array,
        required: false,
        default: store.getters.cart
    }
})
</script>

<template>
    <div class="item-card flex">
        <img class="item-photo" :src="itemInfo.photo" alt="Photo">
        <div class="item-info-container flex column">
            <div class="flex column">
                <h2 class="item-title">{{ itemInfo.title }}</h2>
                <p class="item-short-description">{{ itemInfo.shortDescription }} <router-link class="see-more-text">See more...</router-link></p>
                <label class="item-price">${{ itemInfo.price.toFixed(2) }}</label>
            </div>
            <div class="flex y-centered space-between">
                <div class="quantity-container flex">
                    <button class="change-quantity-button flex column y-centered" @click="changeCartQuantity(-1)"
                        :class="{'disabled': cartQuantity <= 1}">-</button>
                    <input class="cart-quantity" type="number" v-model="cartQuantity" min="1" max="20">
                    <button class="change-quantity-button flex column y-centered" @click="changeCartQuantity(1)"
                        :class="{'disabled': cartQuantity >= 20}">+</button>
                </div>
                <button class="action-button add-button" @click="addToCart">Add to cart</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ItemCard',
    data() {
        return {
            cartQuantity: 1
        }
    },
    methods: {
        changeCartQuantity(amount) {
            this.cartQuantity += amount;
        },
        addToCart() {
            let addedItems = [];

            for (let i = 0; i < this.cartQuantity; i++) {
                addedItems.push(this.itemInfo);
            }

            store.dispatch("addToCart", { addedToCart: addedItems });
        }
    }
}
</script>

<style scoped>
.item-card {
    justify-content: space-between;
    margin: 2px 0 2px 0;
    padding: 3%;
    border: 2px solid var(--pale-tone);
    border-radius: 8px;
    min-height: 170px;
}

.item-photo {
    width: 35%;
    max-width: 200px;
    max-height: 160px;
    border-radius: 4px;
}

.item-info-container {
    justify-content: space-between;
    width: 60%;
}

.item-title {
    margin: 0;
}

.item-short-description {
    font-size: 14px;
    margin: 0 0 4px 0;
}

.see-more-text {
    font-weight: bold;
    color: var(--soft-brown);
    text-decoration: underline;
}

.item-price {
    font-size: 18px;
    font-weight: bold;
    color: var(--pale-tone);
}

.quantity-container {
    width: 45%;
}

.cart-quantity {
    text-align: center;
    width: 16%;
    margin: 0 5% 0 5%;
    -moz-appearance: textfield;
}

.cart-quantity::-webkit-outer-spin-button,
.cart-quantity::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.change-quantity-button {
    width: 27%;
    max-width: 70px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 21px;
    border: 1px solid var(--black-mute);
    background-color: var(--soft-brown);
    color: var(--pale-tone);
    transition: all 0.2s;
}

.add-button {
    height: 25px;
    width: 55%;
    border-radius: 4px;
}

@media (prefers-color-scheme: light) {
    .item-card {
        border-color: var(--indigo);
    }

    .item-price {
        color: var(--intense-brown);
    }
}
</style>
