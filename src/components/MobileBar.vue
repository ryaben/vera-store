<script setup>
import LanguageSelector from './LanguageSelector.vue';
import DarkModeToggle from './DarkModeToggle.vue';

defineProps({
    title: {
        type: String,
        required: false,
        default: 'Argentina Deli Shop'
    },
    links: {
        type: Array,
        required: true,
        default: [{
            text: "Home", route: "Home"
        }]
    },
    itemCount: {
        type: Number,
        required: true,
        default: 0
    }
})
</script>

<template>
    <nav class="navbar flex column wide">
        <div class="bar-elements flex">
            <div class="toggle-more" :class="{ 'active': activeMore }" @click="toggleMore(); updateHeight()"></div>
            <div class="title-container flex">
                <img class="logo-image" src="/img/logo.png" alt="Logo">
                <h1 class="bar-title">{{ title }}</h1>
            </div>
            <router-link class="cart-container flex" :to="{ name: 'Cart' }">
                <div class="flex">
                    <Transition name="fade">
                        <div v-if="itemCount > 0" class="cart-count-container flex x-centered y-centered">
                            <label>{{ itemCount }}</label>
                        </div>
                    </Transition>
                </div>
            </router-link>
        </div>

        <Transition name="slide-left">
            <div class="buttons-container flex column space-between" v-show="activeMore"
                :class="{ 'active': activeMore }">
                <div class="flex column">
                    <div class="buttons-container-title flex y-centered x-centered">
                        <label>{{ $t('mobileBar.title') }}</label>
                    </div>
                    <router-link class="link-button flex" v-for="(link, i) in links" :key="i" :to="{ name: link.route }"
                        @click="toggleMore">
                        <p class="auto-margin">{{ link.text }}</p>
                    </router-link>
                </div>
                <div class="flex column y-centered x-centered">
                    <div class="flex column y-centered x-centered">
                        <LanguageSelector :open-direction="'above'" class="bottom-margin" />
                        <DarkModeToggle @dark-mode-toggled="toggleDarkMode" />
                    </div>
                    <p class="software-info top-margin">{{ $t('mobileBar.softwareInfo') }}<br>{{ $t('mobileBar.author')
                        }}</p>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script>
export default {
    name: 'MobileBar',
    emits: ['toggledBar', 'darkModeToggled'],
    components: {
        LanguageSelector, DarkModeToggle
    },
    data() {
        return {
            activeMore: false,
            height: 0
        }
    },
    methods: {
        toggleMore() {
            this.activeMore = !this.activeMore;
            this.$emit("toggled-bar", this.activeMore);
        },
        updateHeight() {
            return this.height = this.height === 0 ? 'auto' : 0;
        },
        toggleDarkMode(value) {
            this.$emit("darkModeToggled", value);
        }
    }
}
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    border-bottom: 3px solid var(--white-soft);
    height: 50px;
    margin-bottom: 15px;
    background: var(--intense-main-palette);
    z-index: 47;
}

.title-container {
    align-items: flex-end;
}

.bar-elements {
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px 6px 8px;
}

.bar-elements>.toggle-more {
    width: 35px;
    height: 35px;
    cursor: pointer;
    background-image: url("/img/more-white.png");
    background-size: cover;
    z-index: 47;
}

.bar-elements>.toggle-more.active {
    border-radius: 8px;
    background-color: var(--intense-main-palette);
    transition: linear background-color 0.3s;
}

.logo-image {
    width: 32px;
}

.bar-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 0 2px;
    color: var(--white-soft);
}

.cart-container {
    padding: 3px;
    align-items: center;
    border-radius: 5px;
    transition: background-color 0.2s;
}

.cart-container>div {
    position: relative;
    width: 32px;
    height: 32px;
    background-image: url("/img/cart-white.png");
    background-size: cover;
}

.cart-container.router-link-active {
    background-color: var(--reddish-main-palette);
}

.cart-count-container {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--indigo-dark);
    color: var(--white-soft);
}

.cart-count-container label {
    font-size: 12px;
}

.buttons-container {
    background-color: var(--soft-beige);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    color: var(--black-soft);
    position: fixed;
    left: 0;
    top: 0;
    width: 50%;
    max-width: 400px;
    height: 100%;
    z-index: 46;
}

.buttons-container-title {
    height: 50px;
    border-top-right-radius: 10px;
    background-color: var(--soft-beige);
    color: var(--black-mute);
}

.buttons-container-title label {
    font-size: 17px;
    font-weight: bold;
}

.link-button {
    height: 55px;
    transition: background-color 0.2s;
}

.link-button.router-link-active {
    color: var(--pale-tone);
    background-color: var(--soft-main-palette);
    border: 2px inset var(--indigo-dark);
    border-radius: 4px;
    font-weight: bold;
}

.software-info {
    font-size: 12px;
    text-align: center;
}

.master-container.light {
    .navbar {
        border-color: var(--black-soft);
    }

    /* .bar-elements>div {
        background-image: url("/img/more-black.png");
    }

    .cart-container>div {
        background-image: url("/img/cart-black.png");
    } */
}
</style>
