<script setup>
import store from '../store';

defineProps({
    itemID: {
        id: String
    },
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    }
});
</script>

<template>
    <section class="page-section">
        <h2 class="item-title">{{ itemData.title }}</h2>
        <img class="item-photo" :src="itemData.photo" alt="Photo">
        <p class="item-description">{{ itemData.longDescription }}</p>
        <button class="action-button large red" @click="goBack">Go back</button>
    </section>
</template>

<script>
export default {
    name: 'Item Description',
    data() {
        return {
        }
    },
    computed: {
        itemData() {
            const that = this;
            return this.itemsList.find(function(element) {
                return element.id === that.itemID;
            });
        }
    },
    methods: {
        goBack() {
            this.$router.back();
        }
    }
}
</script>

<style scoped>
.item-title {
    margin-top: 5px;
    font-size: 22px;
}

.item-photo {
    width: 70%;
    max-width: 25vw;
    max-height: 35vh;
    margin-bottom: 20px;
}

.item-description {
    width: 90%;
    margin-bottom: 20px;
}

.action-button {
    margin-bottom: 20px;
}

@media (prefers-color-scheme: light) {}
</style>
