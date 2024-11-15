<script setup>
import DropdownBox from '../components/DropdownBox.vue';
</script>

<template>
    <section class="page-section">
        <h2 class="page-title bottom-margin">{{ $t("faqs.title") }}</h2>
        <DropdownBox v-for="(question, i) in [
                { title: $t('faqs.questionTitle1'), content: $t('faqs.questionContent1') },
                { title: $t('faqs.questionTitle2'), content: $t('faqs.questionContent2') }
            ]" :key="i" :box-title="question.title"
            :box-content="question.content" />

        <p class="top-margin centered-text">
            {{ $t("faqs.missingQuestion") }}
            <br>
            <a href="https://api.whatsapp.com/send?phone=5491132703200" target="_blank">
                {{ $t("faqs.reachOut") }}
            </a>
        </p>
    </section>
</template>

<script>
export default {
    name: 'FAQs',
    components: {
        DropdownBox
    },
    data() {
        return {
           
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
