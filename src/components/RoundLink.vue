<script setup>
defineProps({
    icon: {
        type: String,
        required: false,
        default: 'email'
    },
    href: {
        type: String,
        required: true,
        default: '/'
    },
    width: {
        type: Number,
        required: false,
        default: 46
    },
    height: {
        type: Number,
        required: false,
        default: 28
    }
})
</script>

<template>
    <a :href="href" class="source-container" :class="icon"
        :style="[{ 'width': width + 'px' }, { 'height': height + 'px' }]">
        <img :src="'/img/' + icon + '.png'" alt="icon">
    </a>
</template>

<script>
export default {
    name: 'Round Link',
    data() {
        return {
        }
    }
}
</script>

<style scoped>
.source-container {
    display: block;
    cursor: pointer;
    overflow: hidden;
    margin-left: 2px;
    margin-right: 2px;
    border-radius: 50%;
    outline: 2px solid var(--black-soft);
    padding: 5px;
    z-index: 100;
}

.source-container.whatsapp {
    background-color: var(--whatsapp-green);
}

.source-container img {
    width: 100%;
    height: 100%;
}
</style>
