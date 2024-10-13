<script setup>
import PanelCard from './PanelCard.vue';

defineProps({
    cardSource: {
        type: Array,
        required: true,
        default: []
    },
    panelType: {
        type: String,
        required: false,
        default: 'order'
    },
})
</script>

<template>
    <div class="panel-container flex">
        <PanelCard class="panel-card" :class="{ 'selected': selectedIndex === i }" v-for="(element, i) in cardSource"
            :key="i" :card-index="i" :card-type="panelType" :card-info="element" @clicked-card="exportData"
            @updated-index="updateSelectedCard" />
    </div>
</template>

<script>
export default {
    name: 'Panel',
    components: {
        PanelCard
    },
    data() {
        return {
            selectedIndex: undefined
        }
    },
    methods: {
        exportData(cardInfo) {
            this.$emit('clickedCard', cardInfo);
        },
        updateSelectedCard(index) {
            this.selectedIndex = index;
        }
    }
}
</script>

<style scoped>
.panel-container {
    padding: 15px;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow-y: scroll;
}

.panel-card {
    margin: 0 4px 4px 0;
}

.panel-card.selected {
    background-color: var(--intense-brown);
    transition: background-color 0.25s;
}

@media (prefers-color-scheme: light) {
    .panel-card.selected:deep(.id-title) {
        color: var(--white-soft);
    }
}
</style>
