<script setup>
import store from '../store';
import ItemCard from '../components/ItemCard.vue';

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

        <div class="flex column y-centered" v-if="!itemsList.length">
            <img class="loading-image" src="/img/loading.gif" alt="Loading">
            <p>Loading items...</p>
        </div>

        <Transition name="fade">
            <div v-if="itemsList.length" id="resultsContainer" class="flex column wide">
                <ItemCard v-for="(item, i) in itemsList" :key="i" :item-info="item" :cart="cartList" />
            </div>
        </Transition>
    </section>
</template>

<script>
export default {
    name: 'Store',
    components: {
        ItemCard
    },
    data() {
        return {
        }
    }
}
</script>

<style scoped>
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

@media (prefers-color-scheme: light) {}
</style>
