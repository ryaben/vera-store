<script setup>
import store from '../store';
import AddToCartButton from './AddToCartButton.vue';

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
        <img class="item-photo" :src="itemInfo.itemPhoto[0]" alt="Photo">
        <div class="item-info-container flex column wide">
            <div class="flex column">
                <h2 class="item-title">{{ itemInfo.itemTitle[$i18n.locale] }}</h2>
                <p class="item-short-description">{{ itemInfo.itemShortDescription[$i18n.locale] }}</p>
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
                <label class="unavailability-text bold" v-if="!itemInfo.itemAvailability">{{
                    $t('itemCard.unavailable') }}</label>
            </div>
            <div class="flex y-centered right top-margin">
                <AddToCartButton :item-info="itemInfo" :cart="cart" />

                <button class="see-more-button action-button flex tall y-centered x-centered">
                    <router-link :to="{ name: 'ItemDescription', params: { itemID: itemInfo.id } }"
                        class="flex wide tall x-centered y-centered">
                        <img src="/img/see.png" width="28" alt="See more">
                    </router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Item Card',
    data() {
        return {
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
    font-size: 19px;
    margin: 0;
}

.item-short-description {
    font-size: 14px;
    margin: 0 0 4px 0;
}

.item-price {
    font-size: 18px;
    font-weight: bold;
    color: var(--intense-main-palette);
}

.sale-tag {
    margin-left: 7px;
    font-size: 12px;
    letter-spacing: 2px;
    height: 25px;
    padding: 0 5px 0 5px;
    border-radius: 3px;
    background: var(--impact-main-palette);
    color: var(--black-soft);
}

.unavailability-text {
    font-size: 12px;
    color: var(--pale-tone);
}

.add-button {
    width: 50%;
    max-width: 250px;
    min-width: 150px;
}

.see-more-button {
    background-color: var(--negative-main-palette);
    padding-inline: 0;
    width: 15%;
    max-width: 200px;
    min-width: 45px;
    border-radius: 4px;
    padding: 1px 4px 1px 4px;
    margin-left: 10px;
}

@media (max-width: 750px) {
    .item-info-container {
        margin-left: 3%;
    }

    .add-button {
        width: 100%;
    }

    .see-more-button {
        margin-left: 5px;
    }
}

.master-container.light {
    .item-card {
        border-color: var(--indigo);
        background-color: var(--pale-grey);
    }

    .unavailability-text {
        color: var(--indigo);
    }
}
</style>
