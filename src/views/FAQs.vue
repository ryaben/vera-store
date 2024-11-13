<script setup>
import DropdownBox from '../components/DropdownBox.vue';
</script>

<template>
    <section class="page-section">
        <h2 class="page-title bottom-margin">{{ $t("faqs.title") }}</h2>
        <DropdownBox v-for="(question, i) in FAQs" :key="i" :box-title="question.title"
            :box-content="question.content" />

        <!-- <DropdownBox :box-title="$t('faqs.questionTitle1')" :box-content="$t('faqs.questionContent1')" />
        <DropdownBox :box-title="$t('faqs.questionTitle2')" :box-content="$t('faqs.questionContent2')" /> -->
        <p class="top-margin centered-text">
            {{ $t("faqs.missingQuestion") }}<br><router-link>{{ $t("faqs.reachOut") }}</router-link>
        </p>
    </section>
</template>

<script>
export default {
    name: 'Home',
    components: {
        DropdownBox
    },
    data() {
        return {
            FAQs: [
                { title: this.$t('faqs.questionTitle1'), content: this.$t('faqs.questionContent1') },
                { title: this.$t('faqs.questionTitle2'), content: this.$t('faqs.questionContent2') }
            ]
        }
    }
}
</script>

<style scoped>
.page-title {
    margin-top: 0;
}

@media (prefers-color-scheme: light) {}
</style>
