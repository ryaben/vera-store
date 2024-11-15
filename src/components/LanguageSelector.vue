<script setup>
import Multiselect from 'vue-multiselect';

defineProps({
    titleValue: {
        type: Boolean,
        required: false,
        default: false
    },
    transparent: {
        type: Boolean,
        required: false,
        default: false
    },
    openDirection: {
        type: Boolean,
        required: false,
        default: "below"
    }
});
</script>

<template>
    <Multiselect v-model="displayLanguage" :options="languageOptions" :select-label="''" :deselect-label="''"
        :open-direction="openDirection" :show-labels="false" :allow-empty="false" :searchable="false"
        @select="updatei18n(displayLanguage.value); saveLanguageOption()" class="language-selector"
        :class="{ 'transparent': transparent }">
        <template #singleLabel="props">
            <div class="label-container flex x-centered y-centered">
                <img class="option-image right-margin" :src="props.option.image" alt="Flag" />
                <span v-if="titleValue" class="option-title">{{ props.option.title }}</span>
            </div>
        </template>
        <template #option="props">
            <div class="option-container flex y-centered">
                <img class="option-image right-margin" :src="props.option.image" alt="Flag" />
                <span v-if="titleValue" class="option-title">{{ props.option.title }}</span>
            </div>
        </template>
    </Multiselect>
</template>

<script>
export default {
    name: 'Language Selector',
    components: {
        Multiselect
    },
    data() {
        return {
            languageOptions: [
                { title: 'Welcome to our store!', image: '/img/english.png', value: 'en' },
                { title: '¡Bienvenidos/as a nuestra tienda!', image: '/img/spanish.png', value: 'es' }
            ],
            displayLanguage: undefined
        }
    },
    methods: {
        updatei18n(value) {
            this.$i18n.locale = value;
        },
        saveLanguageOption() {
            return localStorage.setItem('lang', JSON.stringify(this.displayLanguage));
        },
        loadLanguageOption() {
            return localStorage.getItem('lang');
        }
    },
    mounted() {
        this.displayLanguage = JSON.parse(this.loadLanguageOption());
        this.updatei18n(this.displayLanguage.value);
    }
}
</script>

<style scoped>
.language-selector {
    width: min-content;
}

div.multiselect.language-selector:deep(div.multiselect__tags) {
    display: flex;
    align-items: center;
    height: 100%;
}

div.multiselect.language-selector:deep(div.multiselect__select) {
    margin-top: 6px;
}

.option-container {
    background: transparent;
}

.language-selector .option-image {
    width: 48px;
    height: 32px;
}

/* Transparent styles */

div.multiselect.language-selector.transparent {
    border: none;
}

div.multiselect.language-selector.transparent:deep(div.multiselect__tags),
div.multiselect.language-selector.transparent:deep(span.multiselect__input),
div.multiselect.language-selector.transparent:deep(span.multiselect__single) {
    border: none;
    background: transparent;
}

div.multiselect.language-selector.transparent:deep(div.label-container > span.option-title) {
    color: var(--white-soft);
}

@media (prefers-color-scheme: light) {
    div.multiselect.language-selector.transparent:deep(div.label-container > span.option-title) {
        color: var(--black-soft);
    }
}
</style>
