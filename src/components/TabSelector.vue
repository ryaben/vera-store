<script setup>
defineProps({
    tabList: {
        type: Array,
        required: true,
        default: [
            { identifier: 'items', tabTitle: 'Store items' }
        ]
    },
    defaultTab: {
        type: String,
        required: false,
        default: 'items'
    },
    small: {
        type: Boolean,
        required: false,
        default: false
    }
})
</script>

<template>
    <div class="section-selector-container wide" :style="{ 'grid-template-columns': `repeat(${tabList.length}, 1fr)` }"
        :class="{ 'small': small }">
        <div v-for="(tab, i) in tabList" :key="i" class="flex x-centered y-centered wide section-button"
            @click="selectTab(tab.identifier)">
            <input :id="`${tab.identifier}Tab`" class="hidden" type="radio" name="selected-tab" :value="tab.identifier"
                v-model="selectedTab">
            <label class="flex wide bold x-centered y-centered" :for="`${tab.identifier}Tab`"
                :class="{ 'selected': selectedTab === tab.identifier }">{{ tab.tabTitle }}</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Tab Selector',
    data() {
        return {
            selectedTab: 'items'
        }
    },
    methods: {
        selectTab(identifier) {
            this.selectedTab = identifier;
            this.$emit('tab-selected', this.selectedTab);
        }
    },
    mounted() {
        this.selectedTab = this.defaultTab;
    }
}
</script>

<style scoped>
.section-selector-container {
    display: grid;
    border-bottom: 2px solid var(--white-soft);
}

.section-button {
    height: 60px;
}

.section-button label {
    font-size: 22px;
    letter-spacing: 0.5px;
    height: 100%;
    cursor: pointer;
    transition: background-color 0.25s;
    text-align: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 0 2px;
}

.section-button label.selected {
    background-color: var(--intense-main-palette);
    color: var(--white-soft);
}

.section-selector-container.small {
    .section-button {
        height: 35px;
    }

    .section-button label {
        font-size: 18px;
        letter-spacing: 0px;
        padding: 0;
    }
}

@media only screen and (max-width: 500px) {
    .section-button label {
        font-size: 14px;
        letter-spacing: -0.4px;
    }
}

.master-container.light {
    .section-selector-container {
        border-color: var(--black-soft);
    }

    .card-container {
        border-color: var(--black-soft);
    }
}
</style>
