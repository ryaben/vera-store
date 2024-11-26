<script setup>
defineProps({
    visible: {
        type: Boolean,
        required: false,
        default: true
    },
    description: {
        type: String,
        required: false,
        default: 'Loading'
    }
})
</script>

<template>
    <div class="flex column y-centered x-centered auto-margin" v-if="visible">
        <img class="loading-image" src="/img/loading.gif" alt="Loading">
        <p class="description-text centered-text">{{ description }}</p>
    </div>
</template>

<script>
export default {
    name: 'Loading GIF',
    data() {
        return {
        }
    }
}
</script>

<style scoped>
img.loading-image {
  width: 32px;
}

.description-text {
    font-size: 18px;
}
</style>
