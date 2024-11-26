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
    <div class="action-button add-button flex y-centered space-between"
        :class="{ 'disabled': !itemInfo.itemAvailability, 'added': adding }" @click="addToCart(); animateAdd()">
        <button class="change-quantity-button centered-text" @click.native.stop="changeCartQuantity(-1)"
            :class="{ 'disabled': cartQuantity <= 1 }">-</button>
        <span class="centered-text">
            <span v-if="!adding">{{ $t('itemCard.addToCart1') }}</span>
            <span v-if="!adding" class="quantity-text">{{ cartQuantity }}</span>
            <span v-if="adding">{{ $t('itemCard.addedToCart') }}</span>
            <span v-if="!adding">{{ $t('itemCard.addToCart2') }}</span>
        </span>
        <button class="change-quantity-button" @click.native.stop="changeCartQuantity(1)"
            :class="{ 'disabled': cartQuantity >= 20 }">+</button>
    </div>
</template>

<script>
export default {
    name: 'Add To Cart Button',
    data() {
        return {
            cartQuantity: 1,
            adding: false
        }
    },
    computed: {

    },
    methods: {
        changeCartQuantity(amount) {
            this.cartQuantity += amount;
        },
        async addToCart() {
            let addedItems = [];

            for (let i = 0; i < this.cartQuantity; i++) {
                addedItems.push(this.itemInfo);
            }

            await store.dispatch("addToCart", { addedToCart: addedItems });
            this.saveCartInStorage();
        },
        animateAdd(event) {
            const that = this;
            this.adding = true;
            setTimeout(() => {
                that.adding = false;
            }, 1500);
        },
        saveCartInStorage() {
            localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
        }
    }
}
</script>

<style scoped>
.cart-quantity {
    text-align: center;
    width: 16%;
    min-width: 15px;
    margin: 0 5% 0 5%;
    -moz-appearance: textfield;
    padding-block: 0;
    padding-inline: 5px;
}

.cart-quantity::-webkit-outer-spin-button,
.cart-quantity::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.change-quantity-button {
    width: 27%;
    min-width: 22px;
    max-width: 35px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 21px;
    border: 1px solid var(--black-mute);
    background-color: var(--brown-main-palette);
    color: var(--pale-tone);
    padding: 1px 6px 1px 6px;
    padding-inline: 1px;
    padding-block: 1px;
    transition: all 0.2s;
    cursor: pointer;
}
.change-quantity-button:first-of-type {
    margin-left: 6px;
    margin-right: 6px;
}

.change-quantity-button:last-of-type {
    margin-left: 6px;
    margin-right: 6px;
}

.add-button {
    height: 40px;
    border-radius: 4px;
    padding: 1px 4px 1px 4px;
    padding-inline: 0;
    line-height: 12px;
    transition: background-color 0.2s;
}

.add-button.added {
    background: var(--success-tone);
    color: var(--white);
}

.quantity-text {
    font-size: 15px;
    color: var(--black-mute);
}

@media (max-width: 750px) {
    .change-quantity-button {
        max-width: 28px;
    }
}
</style>
