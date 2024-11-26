<script setup>
import LanguageSelector from './LanguageSelector.vue';
import DarkModeToggle from './DarkModeToggle.vue';
</script>

<template>
    <footer class="flex">
        <div class="flex column y-centered">
            <img class="logo-image" src="/img/logo.png" alt="Logo">
            <p class="centered-text">
                <span class="bold">Argentina Deli Shop © {{ new Date().getFullYear() }}</span>
                <br>
                <a class="author" href="https://github.com/ryaben" target="_blank">{{ $t("mobileBar.author") }}</a>
            </p>
        </div>
        <div class="flex column left">
            <p class="column-title bold">{{ $t('desktopFooter.contactUs') }}</p>
            <a class="anchor-button email flex y-centered x-centered color-transition" id="sendEmail"
                href="mailto:argentinadelishop@gmail.com" target="_blank">Email</a>
            <a class="anchor-button whatsapp flex y-centered x-centered color-transition" id="sendEmail"
                href="https://api.whatsapp.com/send?phone=5491132703200" target="_blank">WhatsApp</a>
        </div>
        <div class="flex column left">
            <p class="column-title bold">{{ $t('desktopFooter.sitemap') }}</p>
            <div class="sitemap-grid">
                <router-link class="sitemap-link" :to="{ name: 'Home' }">{{ $t('app.navBarHomeButton')
                    }}</router-link>
                <router-link class="sitemap-link" :to="{ name: 'Store' }">{{ $t('app.navBarProductsButton')
                    }}</router-link>
                <router-link class="sitemap-link" :to="{ name: 'Cart' }">{{ $t('app.navBarCartButton')
                    }}</router-link>
                <router-link class="sitemap-link" :to="{ name: 'FAQs' }">{{ $t('app.navBarFAQsButton')
                    }}</router-link>
                <router-link class="sitemap-link" :to="{ name: 'AboutUs' }">{{ $t('app.navBarAboutUsButton')
                    }}</router-link>
                <router-link class="sitemap-link" :to="{ name: 'AdminPanel' }">{{ $t('app.navBarAdminPanelButton')
                    }}</router-link>
            </div>
        </div>
        <div class="flex column left">
            <p class="column-title bold">{{ $t('desktopFooter.globalSettings') }}</p>
            <LanguageSelector class="bottom-margin" open-direction="above" />
            <DarkModeToggle @dark-mode-toggled="toggleDarkMode" />
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Desktop Footer',
    components: {
        LanguageSelector, DarkModeToggle
    },
    emits: ['darkModeToggled'],
    data() {
        return {
        }
    },
    methods: {
        toggleDarkMode(value) {
            this.$emit("darkModeToggled", value);
        },
    },
}
</script>

<style scoped>
footer {
    justify-content: space-around;
    padding-top: 15px;
    background: var(--intense-main-palette);
    color: var(--white-soft);
    min-height: 180px;
}

.logo-image {
    width: 72px;
    margin-bottom: 10px;
}

.author {
    font-size: 12px;
    color: var(--soft-beige);
}

.column-title {
    font-size: 18px;
    margin-left: 0;
}

.sitemap-grid {
    display: grid;
    grid-template-columns: max-content max-content;
    column-gap: 20px;
}

.sitemap-link {
    color: var(--soft-beige);
}

.anchor-button {
    width: 15dvw;
    height: 25px;
    text-decoration: none;
    border-radius: 15px;
    text-align: center;
    background: var(--dark-grey);
    color: var(--white-soft);
    padding: 3px 8px;
    margin-bottom: 5px;
}

.anchor-button::before {
    content: "";
    background-size: contain;
    width: 28px;
    height: 28px;
}

.anchor-button.whatsapp {
    background: var(--whatsapp-green);
}

.anchor-button.whatsapp::before {
    background-image: url("/img/whatsapp.png");
}

.anchor-button.email::before {
    margin-right: 5px;
    background-image: url("/img/email.png");
}
</style>
