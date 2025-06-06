<script setup>
import store from '../store';
import ItemCard from '../components/ItemCard.vue';
import Multiselect from 'vue-multiselect';
import VueToggle from "vue-toggle-component";
import TabSelector from '../components/TabSelector.vue';
import LoadingGIF from '../components/LoadingGIF.vue';
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
    }
});
</script>

<template>
    <section class="page-section">
        <div class="store-container flex wide">
            <div class="store-tools flex column">
                <TabSelector v-show="windowWidth <= 850" default-tab="search" @tab-selected="selectTab" :tab-list="[
                    { identifier: 'search', tabTitle: $t('store.searchTabTitle') },
                    { identifier: 'categories', tabTitle: $t('store.categoriesTabTitle') },
                    { identifier: 'price', tabTitle: $t('store.priceTabTitle') },
                    { identifier: 'availability', tabTitle: $t('store.availabilityTabTitle') }
                ]" />
                <div v-show="windowWidth > 850 || selectedTab === 'search'" class="flex column y-centered tab-wrapper">
                    <input type="search" id="itemSearch" class="bottom-margin" name="itemSearch"
                        :class="{ 'active-search': filteredSearch }" :placeholder="$t('store.searchPlaceholder')"
                        v-model="filteredSearch" @input="filterBySearch">
                </div>
                <div v-show="windowWidth > 850 || selectedTab === 'categories'"
                    class="flex column y-centered tab-wrapper">
                    <p v-if="windowWidth > 850" class="tools-title bold">{{ $t('store.toolsTitle1') }}</p>
                    <Multiselect v-model="filteredCategories" :options="categoriesInItems" :multiple="true"
                        :select-label="$t('store.categoriesSelectLabel')"
                        :selected-label="$t('store.categoriesSelectedLabel')"
                        :placeholder="$t('store.categoriesPlaceholder')"
                        :deselect-label="$t('store.categoriesDeselectLabel')" open-direction="below"
                        @select="filterByCategory" @remove="filterByCategory" class="category-selector" />
                </div>
                <div v-show="windowWidth > 850 || selectedTab === 'price'" class="flex column tab-wrapper">
                    <p v-if="windowWidth > 850" class="tools-title bold">{{ $t('store.toolsTitle2') }}</p>
                    <label class="tab-label" for="itemMinPrice">
                        <input class="item-price" type="number" name="itemPrice" v-model="filteredPrice.min"
                            :placeholder="$t('store.itemPricePlaceholder1')" min="1" @input="filterByPrice">
                        &nbsp;—&nbsp;
                        <input class="item-price" type="number" name="itemPrice" v-model="filteredPrice.max"
                            :placeholder="$t('store.itemPricePlaceholder2')" min="1" @input="filterByPrice">
                    </label>
                </div>
                <div v-show="windowWidth > 850 || selectedTab === 'availability'" class="flex tab-wrapper"
                    :class="{ 'x-centered': windowWidth < 850 }">
                    <VueToggle id="availabilityToggle" :title="$t('store.availabilityToggle')" name="itemAvailability"
                        font-size="16px" active-color="var(--reddish-main-palette)" :toggled="availabilityToggle"
                        @toggle="toggleAvailability" />
                </div>
            </div>
            <LoadingGIF :visible="!itemsList.length" :description="$t('store.loading')" />
            <Transition name="fade">
                <div v-if="itemsList.length" id="resultsContainer" class="flex column wide">
                    <div class="display-tools flex y-centered wide space-between bottom-margin">
                        <label for="itemsPerPage">
                            <span class="bold">{{ $t('store.itemsPerPage') }}&nbsp;</span><input type="number"
                                id="itemsPerPage" min="1" max="500" v-model="itemsPerPage" @input="pageElements">
                        </label>
                        <Multiselect v-model="selectedSort" open-direction="below" label="label" @select="sortItems"
                            :searchable="false" :select-label="''" :deselect-label="''" :allow-empty="false"
                            class="sort-selector" :options="[
                                { label: $t('store.sortingOption1'), value: 'none' },
                                { label: $t('store.sortingOption2'), value: 'ascendingOrder' },
                                { label: $t('store.sortingOption3'), value: 'descendingOrder' },
                                { label: $t('store.sortingOption5'), value: 'lowestPrice' },
                                { label: $t('store.sortingOption6'), value: 'highestPrice' },
                                { label: $t('store.sortingOption7'), value: 'random' }
                            ]" />
                    </div>
                    <Transition name="fade">
                        <div :key="componentKey">
                            <ItemCard class="item-card" v-for="(item, i) in pagedElements" :key="i" v-if="true"
                                :item-info="item" :cart="cartList" />
                        </div>
                    </Transition>
                    <p class="top-margin centered-text" v-if="itemsList.length && !visibleElements.length">
                        {{ $t('store.noResults') }}
                    </p>
                    <div class="pages-container flex column y-centered top-margin bottom-margin">
                        <label for="">{{ $t('store.pageControl') }}</label>
                        <vue-awesome-paginate :total-items="visibleElements.length" :items-per-page="itemsPerPage"
                            :max-pages-shown="3" v-model="currentPage" :show-ending-buttons="true"
                            first-page-content="<<" last-page-content=">>" :show-breakpoint-buttons="false"
                            :hide-prev-next-when-ends="true" @click="setPage" />
                    </div>
                </div>
            </Transition>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Store',
    components: {
        ItemCard, Multiselect, TabSelector, VueToggle, LoadingGIF
    },
    data() {
        return {
            availabilityToggle: false,
            componentKey: 0,
            maxTotalLoad: 1000,
            filteredSearch: '',
            filteredCategories: [],
            filteredPrice: {
                min: "",
                max: ""
            },
            selectedTab: 'search',
            productsSorting: "none",
            itemsPerPage: 15,
            currentPage: 1,
            selectedSort: { label: this.$t('store.sortingOption1'), value: "none" },
            scrollYPosition: 0,
            maxScrollY: undefined
        }
    },
    watch: {
        itemsList(newValue) {
            if (newValue.length) {
                this.pageElements();
            }
        },
        filteredPrice(newValue) {
            this.filteredPrice.min = Math.abs(newValue.min);
            this.filteredPrice.max = Math.abs(newValue.max);

            if (newValue.min < 1) this.filteredPrice.min = 1;
            if (newValue.max > 1000) this.filteredPrice.max = 1000;
            if (newValue.min > this.filteredPrice.max) this.filteredPrice.min = this.filteredPrice.max;
            if (newValue.max < this.filteredPrice.min) this.filteredPrice.max = this.filteredPrice.min;
        }
    },
    computed: {
        categoriesInItems() {
            const that = this;
            let categories = [];

            this.itemsList.forEach(function (item) {
                item.itemCategories[that.$i18n.locale].forEach(function (itemCategory) {
                    const categoryCheck = categories.find(function (category) {
                        return category === itemCategory;
                    });

                    if (categoryCheck === undefined) {
                        categories.push(itemCategory);
                    }
                });
            });

            return categories;
        },
        visibleElements() {
            return this.itemsList.filter(element => !element.itemHidden && element.searchDisplay && element.categoryDisplay && element.priceDisplay && element.availabilityDisplay);
        },
        pagedElements() {
            return this.itemsList.filter(element => !element.itemHidden && element.pageDisplay && element.searchDisplay && element.categoryDisplay && element.priceDisplay && element.availabilityDisplay);
        },
        totalPages() {
            let pages = Math.ceil(this.visibleElements.length / this.itemsPerPage);
            return pages === 0 ? 1 : pages;
        }
    },
    methods: {
        toggleAvailability(value) {
            this.availabilityToggle = value;
            this.filterByAvailability();
        },
        setPage(result) {
            this.currentPage = result;
            this.pageElements();
        },
        pageElements() {
            const that = this;

            this.visibleElements.forEach(function (entry, index) {
                if (((that.itemsPerPage * that.currentPage) - 1) >= index && index >= (that.itemsPerPage * (that.currentPage - 1))) {
                    entry.pageDisplay = true;
                } else {
                    entry.pageDisplay = false;
                }
            });

            if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages;
            } else if (this.currentPage < 0) {
                this.currentPage = 1;
            }
            if (this.itemsPerPage < 1) {
                this.itemsPerPage = 1;
            } else if (this.itemsPerPage > this.maxTotalLoad) {
                this.itemsPerPage = this.maxTotalLoad;
            }

            this.componentKey++;
        },
        sortItems() {
            switch (this.selectedSort.value) {
                case 'ascendingOrder':
                    this.itemsList.sort((a, b) => (this.normalizeString(a.itemTitle[this.$i18n.locale]) > this.normalizeString(b.itemTitle[this.$i18n.locale])) ? 1 : -1);
                    break;
                case 'descendingOrder':
                    this.itemsList.sort((a, b) => (this.normalizeString(a.itemTitle[this.$i18n.locale]) > this.normalizeString(b.itemTitle[this.$i18n.locale])) ? 1 : -1);
                    this.itemsList.reverse();
                    break;
                case 'highestPrice':
                    this.itemsList.sort((a, b) => ((a.itemOnSale ? a.itemPriceSale : a.itemPrice) > (b.itemOnSale ? b.itemPriceSale : b.itemPrice)) ? 1 : -1);
                    this.itemsList.reverse();
                    break;
                case 'lowestPrice':
                    this.itemsList.sort((a, b) => ((a.itemOnSale ? a.itemPriceSale : a.itemPrice) > (b.itemOnSale ? b.itemPriceSale : b.itemPrice)) ? 1 : -1);
                    break;
                case 'random':
                    this.shuffleArray(this.itemsList);
                    break;
                default:
                    break;
            }

            this.pageElements();
        },
        filterBySearch() {
            const that = this;

            if (this.filteredSearch === '') {
                this.itemsList.forEach(function (element) {
                    element.searchDisplay = true;
                });
            } else {
                this.itemsList.forEach(function (element) {
                    const entryCurated = that.normalizeString(element.itemTitle[that.$i18n.locale].toLowerCase());
                    const searchCurated = that.normalizeString(that.filteredSearch.toLowerCase());

                    if (!entryCurated.includes(searchCurated)) {
                        element.searchDisplay = false;
                    } else {
                        element.searchDisplay = true;
                    }
                });
            }

            this.setPage(1);
        },
        filterByCategory() {
            const that = this;

            if (!this.filteredCategories.length) {
                this.itemsList.forEach(function (element) {
                    element.categoryDisplay = true;
                });
            } else {
                this.itemsList.forEach(function (element) {
                    that.arrayContainsAny(element.itemCategories[that.$i18n.locale], that.filteredCategories) ? element.categoryDisplay = true : element.categoryDisplay = false;
                });
            }

            this.pageElements();
        },
        filterByPrice() {
            const minPrice = this.filteredPrice.min === '' ? 1 : this.filteredPrice.min;
            const maxPrice = this.filteredPrice.max === '' ? Infinity : this.filteredPrice.max;

            this.itemsList.forEach(function (element) {
                switch (element.itemOnSale) {
                    case true:
                        element.itemPriceSale >= minPrice && element.itemPriceSale <= maxPrice ? element.priceDisplay = true : element.priceDisplay = false;
                        break;
                    case false:
                        element.itemPrice >= minPrice && element.itemPrice <= maxPrice ? element.priceDisplay = true : element.priceDisplay = false;
                        break;
                    default:
                        break;
                }
            });

            this.pageElements();
        },
        filterByAvailability() {
            const that = this;

            this.itemsList.forEach(function (element) {
                if (!that.availabilityToggle) {
                    element.availabilityDisplay = true;
                } else if (that.availabilityToggle && element.itemAvailability) {
                    element.availabilityDisplay = true;
                } else if (that.availabilityToggle && !element.itemAvailability) {
                    element.availabilityDisplay = false;
                }
            });

            this.pageElements();
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        },
        selectTab(index) {
            this.selectedTab = index;
        },
        arrayContainsAny(array1, array2) {
            return array1.some(item => array2.includes(item));
        },
        normalizeString(input) {
            const str = typeof input === 'string' ? input : String(input ?? '');
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
    },
    async beforeMount() {
        if (!this.itemsList.length) { await store.dispatch('getItems'); }
    },
    mounted() {
        this.pageElements();
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.display-tools {
    padding-bottom: 8px;
    border-bottom: 1px solid var(--white-soft);
}

.store-container {
    position: relative;
    flex-direction: column;
    justify-content: right;
}

.store-tools {
    height: min-content;
    border: 2px solid var(--black-soft);
    background-color: var(--light-main-palette);
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 25px;
}

div.section-selector-container {
    margin-bottom: 20px;
}

.tools-title {
    font-size: 20px;
    margin-left: auto;
    margin-bottom: 6px;
}

.tab-label {
    text-align: center;
}

.item-price {
    position: relative;
    font-size: 16px;
    width: 37%;
    max-width: 100px;
    height: 30px;
    background-color: var(--white-soft);
    color: var(--black-mute);
    border-radius: 8px;
    border: 2px solid var(--light-main-palette);
}

.item-price::before {
    display: block;
    content: '$';
    position: absolute;
}

.item-price,
.item-price::placeholder {
    text-align: center;
}

#itemSearch {
    position: relative;
    width: 100%;
    max-width: 500px;
    height: 40px;
    margin: 2px auto 5px auto;
    border: 2px solid var(--soft-main-palette);
    border-radius: 8px;
    padding-right: 4px;
    background: url("/img/search.png") no-repeat right;
    background-color: var(--white-soft);
    background-size: 20px;
    background-position: left 4px center;
    color: var(--black-soft);
}

#itemSearch::placeholder {
    position: absolute;
    left: 25px;
}

#itemSearch.active-search {
    background: var(--white-soft);
}

.products-amount {
    margin: 15px 0 5px 0;
    padding-top: 15px;
    border-top: 1px solid var(--white-soft);
}

.tab-wrapper {
    margin-bottom: 12px;
}

#productsSorting,
#itemsPerPage {
    background: none;
    border: none;
    font-size: 16px;
}

#itemsPerPage {
    width: 45px;
}

.multiselect.category-selector {
    height: 32px;
}

.multiselect.sort-selector {
    font-weight: normal;
    width: 40%;
    min-width: 180px;
    max-width: 320px;
}

#itemavailability-label {
    pointer-events: none;
}

.pages-container {
    padding-top: 8px;
    border-top: 1px solid var(--white-soft);
}

.master-container.light {

    .products-amount,
    .display-tools,
    .pages-container {
        border-color: var(--black-soft);
    }
}

@media only screen and (min-width: 850px) {
    .master-container.light {
        .store-tools {
            border-color: var(--black-soft);
        }
    }

    .store-container {
        flex-direction: row;
        justify-content: space-between;
    }

    .store-tools {
        position: sticky;
        width: 25dvw;
        padding: 2dvw;
        border: none;
        border-radius: 6px;
        top: 2.5dvw;
        left: 2.5dvw;
        /* margin-right: auto; */
    }

    .products-amount {
        margin-top: 5px;
        margin-bottom: 0;
    }

    .tab-wrapper {
        margin-bottom: 20px;
    }

    .tab-wrapper:last-child {
        margin-top: 5px;
        margin-bottom: 0;
    }

    .tools-title {
        margin-left: 0;
    }

    .tab-label {
        text-align: left;
    }

    #resultsContainer {
        width: 65%;
        margin-top: -4px;
    }

    #availabilityToggle {
        margin-top: 5px;
    }
}

@media only screen and (max-width: 850px) {}
</style>
