<script setup>
defineProps({
    langText: {
        type: String,
        required: true,
        default: 'Value'
    },
    deletable: {
        type: Boolean,
        required: false,
        default: true
    }
});
</script>

<template>
    <div class="selected-value-container">
        <label class="value-text">{{ langText }}</label>
        <label v-if="deletable" class="remove-value" @click="removeValue">❌</label>
    </div>
</template>
  
<script>
export default {
    name: 'SelectedValue',
    methods: {
       removeValue() {
        this.$emit('remove-value', this.langText);
       }
    }
}
</script>

<style scoped> 
.selected-value-container {
    display: flex;
    align-items: center;
    border-radius: 13px;
    width: fit-content;
    background-color: var(--light-main-palette);
    padding: 3px 8px 3px 8px;
    margin: 6px 3px 0 0;
}

.value-text {
    font-size: 13px;
}

.remove-value {
    margin-left: 3px;
    color: var(--failure-tone);
    cursor: pointer;
}
</style>