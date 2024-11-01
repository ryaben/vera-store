<script setup>
defineProps({
    cardInfo: {
        type: Object,
        required: true,
        default: {}
    },
    displayParameter: {
        type: String,
        required: false,
        default: 'id'
    },
    cardIndex: {
        type: Number,
        required: false,
        default: 0
    }
})
</script>

<template>
    <div class="card-container flex column" @click="exportData(); exportIndex()">
        <p class="id-title">
            <span class="bold colored">{{ cardInfo[displayParameter] }}</span>
        </p>
    </div>
</template>

<script>
export default {
    name: 'Panel Card',
    data() {
        return {
        }
    },
    methods: {
        exportData() {
            this.$emit('clickedCard', this.cardInfo);
        },
        exportIndex() {
            this.$emit('updatedIndex', this.cardIndex);
        }
    }
}
</script>

<style scoped>
.card-container {
    width: fit-content;
    height: 26px;
    padding: 6px;
    border: 1px solid var(--white-soft);
    border-radius: 8px;
    cursor: pointer;
}

.id-title {
    font-size: 18px;
    margin: 0;
}

.colored {
    color: var(--light-brown);
}

@media (prefers-color-scheme: light) {
    .card-container {
        border-color: var(--black-soft);
    }
}
</style>
