<script setup>
import store from '../store';
import ItemCard from '../components/ItemCard.vue';
import Multiselect from 'vue-multiselect';
import TabSelector from '../components/TabSelector.vue';
import { useWindowSize } from 'vue-window-size';
const { width, height } = useWindowSize();
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
        <input type="search" id="itemSearch" name="itemSearch" placeholder="Search items...">

        <div class="store-container flex wide">
            <div class="store-tools flex column">
                <TabSelector id="adminTabs" class="bottom-margin" :tab-list="storeTabs" default-tab="category"
                    @tab-selected="selectTab" />

                <div v-if="selectedTab === 'category' || windowWidth >= 1050"
                    class="flex column y-centered tab-wrapper">
                    <p class="tools-title bold">Categories</p>
                    <Multiselect v-model="filteredCategories" :options="categoriesInItems" :multiple="true"
                        select-label="Tap to select" deselect-label="Tap to remove" open-direction="below" />
                </div>
                <div v-if="selectedTab === 'price' || windowWidth >= 1050" class="flex column y-centered tab-wrapper">
                    <p class="tools-title bold">Price</p>
                    <label class="tab-label" for="itemMinPrice">
                        <input class="item-price" type="number" name="itemPrice" v-model="filteredPrice.min"
                            placeholder="Minimum">
                        &nbsp;—&nbsp;
                        <input class="item-price" type="number" name="itemPrice" v-model="filteredPrice.max"
                            placeholder="Maximum">
                    </label>
                </div>

            </div>
            <div class="loading-gif flex column x-centered y-centered top-margin" v-if="!itemsList.length">
                <img class="loading-image" src="/img/loading.gif" alt="Loading">
                <p>Loading items...</p>
            </div>
            <Transition name="fade">
                <div v-if="itemsList.length" id="resultsContainer" class="flex column wide">
                    <ItemCard class="item-card" v-for="(item, i) in itemsList" :key="i" v-if="true" :item-info="item"
                        :cart="cartList" />
                </div>
            </Transition>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Store',
    components: {
        ItemCard, Multiselect
    },
    data() {
        return {
            filteredCategories: null,
            filteredPrice: {
                min: null,
                max: null
            },
            storeTabs: [
                { identifier: 'category', tabTitle: 'Category' },
                { identifier: 'price', tabTitle: 'Price' },
                { identifier: 'availability', tabTitle: 'Availability' }
            ],
            selectedTab: 'category',
        }
    },
    computed: {
        categoriesInItems() {
            let categories = [];

            this.itemsList.forEach(function (item) {
                item.itemCategories.forEach(function (itemCategory) {
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
    },
    methods: {
        selectTab(identifier) {
            this.selectedTab = identifier;
        }
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.store-container {
    flex-direction: column;
}

.loading-gif {
    width: 100%;
}

.store-tools {
    border: 2px solid var(--pale-tone);
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 15px;
}

.tools-title {
    font-size: 20px;
    margin-left: 0;
    display: none;
}

.tab-label {
    text-align: center;
}

.item-price {
    font-size: 16px;
    width: 40%;
    max-width: 250px;
    height: 30px;
    background-color: var(--white-soft);
    color: var(--black-mute);
    border-radius: 8px;
    border: 2px solid var(--light-brown);
}

#itemSearch {
    width: 70%;
    height: 32px;
    margin: 2px auto 15px auto;
    border: 2px solid var(--soft-brown);
    border-radius: 8px;
    padding-right: 4px;
    background: url("/img/search.png") no-repeat right;
    background-size: 20px;
    background-position: right 4px center;
}

@media only screen and (min-width: 1050px) {
    .store-container {
        margin-top: 30px;
        flex-direction: row;
        justify-content: space-between;
    }

    .loading-gif {
        width: 70%;
    }

    #adminTabs {
        display: none;
    }

    .store-tools {
        width: 24%;
        padding: 2%;
        border: none;
        border-radius: 6px;
        background-color: var(--soft-brown);
    }

    .tab-wrapper {
        margin-bottom: 30px;
    }

    .tab-wrapper:last-of-type {
        margin-bottom: 0;
    }

    .tools-title {
        display: block;
    }

    .tab-label {
        text-align: left;
    }

    #resultsContainer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding-left: 3%;
        width: 70%;
        margin-top: -4px;
    }

    .item-card {
        margin-right: 8px;
    }
}

@media only screen and (min-width: 1500px) {
    #resultsContainer {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@media (prefers-color-scheme: light) and (min-width: 1050px) {
    .store-tools {
        border-color: var(--black-soft);
        background-color: var(--dimmed-brown);
    }
}
</style>
