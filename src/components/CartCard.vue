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
                <div class="flex y-centered">
                    <div class="remove-icon" @click="removeItems"></div>
                    <label @click="removeItems">Remove</label>
                </div>
            </div>
            <div class="flex y-centered">
                <label>
                    <span>{{ cartItemCount.length }} x </span>
                    <span class="item-price">${{ itemInfo.price.toFixed(2) }}</span>
                    <span> = </span>
                    <span class="item-price total">${{ (cartItemCount.length * itemInfo.price.toFixed(2)).toFixed(2)
                        }}</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CartCard',
    data() {
        return {
        }
    },
    computed: {
        cartItemCount() {
            const that = this;
            return this.cart.filter(function (element) {
                return element.id === that.itemInfo.id;
            });
        }
    },
    methods: {
        async removeItems() {
            const that = this;
            const filteredCart = this.cart.filter(function(element) {
                return element.id !== that.itemInfo.id;
            });

            await store.dispatch("clearCart");
            await store.dispatch("addToCart", { addedToCart: filteredCart });
        }
    }
}
</script>

<style scoped>
.item-card {
    justify-content: space-between;
    margin: 2px 0 2px 0;
    padding: 3%;
    border-bottom: 2px solid var(--pale-tone);
    min-height: 160px;
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
    margin: 0 0 3px 0;
}

.remove-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-image: url("/img/delete-white.png");
    background-size: cover;
    margin-right: 4px;
}

.remove-icon ~ label {
    cursor: pointer;
}

.item-price {
    font-size: 18px;
    font-weight: bold;
    color: var(--light-brown);
}

.item-price.total {
    color: var(--soft-brown);
}

@media (prefers-color-scheme: light) {
    .item-card {
        border-color: var(--indigo);
    }

    .item-price.total {
        color: var(--intense-brown);
    }

    .remove-icon {
        background-image: url("/img/delete-black.png");
    }
}
</style>
