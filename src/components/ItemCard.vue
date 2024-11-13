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
});
</script>

<template>
    <div class="item-card flex">
        <img class="item-photo" :src="itemInfo.itemPhoto" alt="Photo">
        <div class="item-info-container flex column wide">
            <div class="flex column">
                <h2 class="item-title">{{ itemInfo.itemTitle }}</h2>
                <p class="item-short-description">{{ itemInfo.itemShortDescription }} <router-link
                        :to="{ name: 'ItemDescription', params: { itemID: itemInfo.id } }" class="see-more-text">{{
                            $t('itemCard.moreInfo') }}</router-link></p>
                <label class="item-price flex y-centered">
                    <span :class="{ 'strikethrough': itemInfo.itemOnSale, 'negative-text': itemInfo.itemOnSale }">
                        ${{ itemInfo.itemPrice.toFixed(2) }}
                    </span>
                    <span v-if="itemInfo.itemOnSale" style="margin-left: 5px;">
                        ${{ itemInfo.itemPriceSale.toFixed(2) }}
                    </span>
                    <span v-if="itemInfo.itemOnSale" class="sale-tag flex x-centered y-centered">
                        {{ $t('itemCard.saleTag') }}
                    </span>
                </label>
                <label class="unavailability-text negative-text" v-if="!itemInfo.itemAvailability">{{
                    $t('itemCard.unavailable') }}</label>
            </div>
            <div class="flex y-centered space-between top-margin">
                <div class="quantity-container flex">
                    <button class="change-quantity-button centered-text" @click="changeCartQuantity(-1)"
                        :class="{ 'disabled': cartQuantity <= 1 }">-</button>
                    <input class="cart-quantity" type="number" v-model="cartQuantity" min="1" max="20">
                    <button class="change-quantity-button" @click="changeCartQuantity(1)"
                        :class="{ 'disabled': cartQuantity >= 20 }">+</button>
                </div>
                <button class="action-button add-button" :class="{ 'disabled': !itemInfo.itemAvailability }"
                    @click="addToCart(); animateAdd($event)">{{ $t('itemCard.addToCart') }}</button>
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
        },
        animateAdd(event) {
            event.target.classList.add("disabled");
            event.target.classList.add("added");
            event.target.innerText = this.$t('itemCard.addedToCart');
            setTimeout(() => {
                event.target.classList.remove("disabled");
                event.target.classList.remove("added");
                event.target.innerText = this.$t('itemCard.addToCart');
            }, 1500);
        }
    }
}
</script>

<style scoped>
.item-card {
    justify-content: left;
    margin: 5px 0 5px 0;
    padding: 3%;
    border: 2px solid var(--pale-tone);
    background-color: var(--dark-grey);
    border-radius: 6px;
    min-height: 170px;
}

.item-photo {
    width: 35%;
    min-width: 125px;
    max-width: 160px;
    max-height: 140px;
    border-radius: 4px;
}

.item-info-container {
    justify-content: space-between;
    margin-left: 5%;
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

.sale-tag {
    margin-left: 7px;
    font-size: 12px;
    letter-spacing: 2px;
    height: 25px;
    padding: 0 5px 0 5px;
    border-radius: 3px;
    background: var(--red-brown);
    color: var(--white-soft);
}

.unavailability-text {
    font-size: 12px;
}

.quantity-container {
    width: 45%;
}

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
    max-width: 45px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 21px;
    border: 1px solid var(--black-mute);
    background-color: var(--soft-brown);
    color: var(--pale-tone);
    padding: 1px 6px 1px 6px;
    padding-inline: 1px;
    padding-block: 1px;
    transition: all 0.2s;
    cursor: pointer;

}

.add-button {
    height: 35px;
    width: 50%;
    border-radius: 4px;
    padding: 1px 4px 1px 4px;
    padding-inline: 0;
    max-width: 200px;
    transition: all 0.2s;
    line-height: 12px;
}

.add-button.added {
    background: var(--success-tone);
    color: var(--white);
}

@media (prefers-color-scheme: light) {
    .item-card {
        border-color: var(--indigo);
        background-color: var(--pale-grey);
    }

    .item-price {
        color: var(--intense-brown);
    }
}
</style>
