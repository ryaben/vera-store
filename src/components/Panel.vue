<script setup>
import PanelCard from './PanelCard.vue';

defineProps({
    cardSource: {
        type: Array,
        required: true,
        default: []
    },
    parameterOptions: {
        type: Array,
        required: false,
        default: ["id"]
    },
})
</script>

<template>
    <div class="panel-container flex">
        <div class="flex wide bottom-margin">
            <label>{{ $t('panel.displayBy') }}&nbsp;</label>
            <select v-model="displayParameter" class="parameters-select">
                <option v-for="(parameter, i) in parameterOptions" :key="i" :value="parameter">{{ parameter }}</option>
            </select>
        </div>
        <PanelCard class="panel-card" :class="{ 'selected': selectedIndex === i }" v-for="(element, i) in cardSource"
            :key="i" :card-index="i" :display-parameter="displayParameter" :card-info="element"
            @clicked-card="exportData" @updated-index="updateSelectedCard" />
    </div>
</template>

<script>
export default {
    name: 'Panel',
    components: {
        PanelCard
    },
    emits: ["clickedCard"],
    data() {
        return {
            selectedIndex: undefined,
            displayParameter: ""
        }
    },
    methods: {
        exportData(cardInfo) {
            this.$emit('clickedCard', cardInfo);
        },
        updateSelectedCard(index) {
            this.selectedIndex = index;
        },
    },
    mounted() {
        this.displayParameter = this.parameterOptions[0];
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

.parameters-select {
    width: max-content;
}

.panel-card {
    margin: 0 4px 4px 0;
}

.panel-card.selected {
    background-color: var(--soft-main-palette);
    color: var(--black-soft);
    transition: background-color 0.25s;
}

.master-container.light {
    .panel-card.selected:deep(.id-title) {
        color: var(--white-soft);
    }
}
</style>
