<script setup>
import store from '../store';
import SelectedValue from '../components/SelectedValue.vue';
import { useWindowSize } from 'vue-window-size';
import LoadingGIF from '../components/LoadingGIF.vue';
import { shallowReactive } from 'vue';
import { VueFlux, FluxIndex, FluxPagination, FluxControls, FluxPreloader, Img, Fade } from 'vue-flux';
import AddToCartButton from '../components/AddToCartButton.vue';
const { width } = useWindowSize();
const windowWidth = width;

defineProps({
    itemID: {
        id: String
    },
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    },
    cartList: {
        type: Array,
        required: false,
        default: store.getters.cart
    }
});
</script>

<template>
    <section class="page-section">
        <LoadingGIF :visible="!itemsList.length" :description="$t('store.loading')" />

        <div v-if="itemsList.length" class="flex wide column y-centered">
            <h2 class="item-title centered-text">
                {{ itemData.itemTitle[$i18n.locale] }}
            </h2>
            <div class="flex wide x-centered bottom-margin" :class="{ 'column': windowWidth <= 750 }">
                <VueFlux class="right-margin" :options="galleryOptions" :rscs="photoGallery"
                    :transitions="shallowReactive([Fade])">
                    <template #preloader="preloaderProps">
                        <FluxPreloader v-bind="preloaderProps" />
                    </template>
                    <template #controls="controlsProps">
                        <FluxControls v-bind="controlsProps" />
                    </template>
                    <template #pagination="paginationProps">
                        <FluxPagination v-bind="paginationProps" />
                    </template>
                    <template #index="indexProps">
                        <FluxIndex v-bind="indexProps" />
                    </template>
                </VueFlux>

                <div class="description-flex flex column y-centered"
                    :class="{ 'flex-sized': windowWidth > 750, 'top-margin': windowWidth <= 750 }">
                    <div class="flex wide y-centered"
                        :class="{ 'left': windowWidth > 750, 'x-centered': windowWidth <= 750, 'column': windowWidth <= 750, 'bordered': windowWidth > 750 }">
                        <label class="item-price flex y-centered right-margin">
                            <span
                                :class="{ 'strikethrough': itemData.itemOnSale, 'negative-text': itemData.itemOnSale }">
                                ${{ itemData.itemPrice.toFixed(2) }}
                            </span>
                            <span v-if="itemData.itemOnSale" style="margin-left: 5px;">
                                ${{ itemData.itemPriceSale.toFixed(2) }}
                            </span>
                            <span v-if="itemData.itemOnSale" class="sale-tag flex x-centered y-centered">
                                {{ $t('itemCard.saleTag') }}
                            </span>
                        </label>
                        <div class="flex" :class="{ 'top-margin': windowWidth <= 750 }">
                            <SelectedValue v-for="(category, i) in itemData.itemCategories[$i18n.locale]" :key="i"
                                :lang-text="category" :deletable="false" />
                        </div>
                    </div>
                    <p class="item-description wide" :class="{ 'centered-text': windowWidth <= 750 }">
                        {{ itemData.itemLongDescription[$i18n.locale] }}
                    </p>
                </div>
            </div>
            <div class="flex wide x-centered bottom-margin" :class="{ 'top-margin': windowWidth <= 750 }">
                <button class="action-button large red" @click="goBack">{{
                    $t("itemDescription.back") }}</button>
                <AddToCartButton id="addToCart" class="action-button add-to-cart large" :item-info="itemData"
                    :cart="cartList" />
            </div>
        </div>

    </section>
</template>

<script>
export default {
    name: 'Item Description',
    components: {
        SelectedValue, LoadingGIF
    },
    data() {
        return {
            galleryOptions: {
                autoplay: true,
                autohideTime: 1500,
                delay: 8000
            }
        }
    },
    computed: {
        itemData() {
            const that = this;
            return this.itemsList.find(function (element) {
                return element.id === that.itemID;
            });
        },
        photoGallery() {
            return this.itemData.itemPhoto.map(photo => {
                return new Img(photo);
            });
        }
    },
    methods: {
        goBack() {
            this.$router.back();
        }
    },
    async beforeMount() {
        if (!this.itemsList.length) { await store.dispatch('getItems'); }
    }
}
</script>

<style scoped>
.item-title {
    margin-top: 0;
    margin-bottom: 2.5dvw;
}

.vue-flux {
    width: 40%;
    max-width: 400px;
    height: 300px;
    border-radius: 2px;
    border: 2px solid var(--light-main-palette);
}

.item-photo {
    width: 70%;
    max-width: 350px;
    max-height: 300px;
    border-radius: 10px;
    border: 2px solid var(--light-main-palette);
}

.photo-flex.flex-sized {
    width: 40%;
}

.photo-flex.flex-sized .item-photo {
    width: 100%;
}

.item-price {
    font-size: 24px;
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

.selected-value-container {
    margin-top: 0;
}

.description-flex.flex-sized {
    justify-content: flex-start;
    width: 50%;
    padding: 1.5dvw;
    max-width: 600px;
    border: 2px solid var(--soft-main-palette);
    max-height: 300px;
    overflow-y: scroll;
}

.item-description {
    margin: 20px auto 0 auto;
}

.action-button.large {
    width: 40%;
    height: auto;
    min-height: 55px;
    max-width: 400px;
    border-radius: 12px;
}

#addToCart {
    margin-left: 10px;
}

.bordered {
    padding-bottom: 5px;
    border-bottom: 1px solid var(--white-soft);
}

@media (max-width: 750px) {
    .vue-flux {
        width: 80%;
        margin: auto
    }
}

.master-container.light {
    .bordered {
        border-color: var(--black-soft);
    }
}
</style>
