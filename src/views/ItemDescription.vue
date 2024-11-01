<script setup>
import store from '../store';
import { useWindowSize } from 'vue-window-size';
const { width, height } = useWindowSize();
const windowWidth = width;

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
        <h2 class="item-title" :class="{ 'large-bottom-margin': windowWidth >= 1050 }">{{ itemData.title }}</h2>
        <div class="flex x-centered" :class="{ 'column': windowWidth < 1050 }">
            <div class="photo-flex flex column y-centered" :class="{ 'flex-sized': windowWidth >= 1050 }">
                <img class="item-photo" :src="itemData.photo" alt="Photo">
            </div>
            <div class="description-flex flex column x-centered y-centered" :class="{ 'flex-sized': windowWidth >= 1050 }">
                <p class="item-description">{{ itemData.longDescription }}</p>
            </div>
        </div>
        <button class="action-button large red" :class="{ 'top-margin': windowWidth >= 1050 }" @click="goBack">Go back</button>
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
            return this.itemsList.find(function (element) {
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
    max-width: 400px;
    max-height: 50vh;
    margin-bottom: 20px;
}

.photo-flex.flex-sized {
    width: 40%;
}

.photo-flex.flex-sized .item-photo {
    width: 100%;
}

.description-flex.flex-sized {
    width: 60%;
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
