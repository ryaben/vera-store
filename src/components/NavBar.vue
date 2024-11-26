<script setup>
import NavbarButton from './NavbarButton.vue';

defineProps({
    logo: {
        type: String,
        required: false,
        default: '/img/logo.png'
    },
    itemCount: {
        type: Number,
        required: true,
        default: 0
    },
    buttons: {
        type: Array,
        required: true,
        default: [{
            text: "Home", icon: "home.png", route: "Home", subButtons: []
        }]
    }
})
</script>

<template>
    <nav class="navbar flex column auto-margin">
        <div class="bar-elements flex x-centered bottom-margin top-margin">
            <img class="logo-image" :src="logo" alt="Logo">
            <div class="flex column y-centered bottom-margin" style="justify-content: flex-end;">
                <h1 class="store-title bold">Argentina Deli Shop</h1>
                <p class="slogan-text centered-text">Bring back home a taste of Argentina!</p>
            </div>
        </div>
        <div class="links-container flex x-centered">
            <div class="flex">
                <NavbarButton v-for="(item, i) in buttons" :key="i" :text="item.text" :icon="item.icon"
                    :route="item.route" :sub-buttons="item.subButtons" />
            </div>
            <div class="extra-links-container flex">
                <router-link class="cart-container flex" :to="{ name: 'Cart' }">
                    <div class="flex">
                        <Transition name="fade">
                            <div v-if="itemCount > 0" class="cart-count-container flex"><label>{{ itemCount }}</label>
                            </div>
                        </Transition>
                    </div>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'NavBar',
    components: {
        NavbarButton
    },
    data() {
        return {
            activeMore: false,
            height: 0
        }
    }
}
</script>

<style scoped>
.navbar {
    width: 95%;
    margin-top: 20px;
    background: var(--intense-main-palette);
    border-radius: 8px;
}

.logo-image {
    width: 120px;
}

.store-title {
    font-size: 28px;
    margin: 0;
}

.slogan-text {
    font-size: 16px;
    margin: 0;
}

div.multiselect.language-selector {
    position: absolute;
    left: 10px;
    top: calc(50% - 27px);
}

.links-container {
    position: relative;
    background: var(--intense-main-palette);
    padding: 8px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    /* border: 2px solid var(--pale-tone); */
}

.link-button {
    height: 60px;
    width: 80px;
    padding: 0 15px 0 15px;
    transition: all 0.2s;
    margin: 2px 0 2px 0;
}

.link-button p {
    font-size: 20px;
    margin-bottom: 0;
}

.link-button.router-link-active {
    background: var(--light-main-palette);
    color: var(--black-soft);
    border-radius: 4px;
}

.extra-links-container {
    position: absolute;
    right: 10px;
    top: calc(50% - 19px);
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
    justify-content: center;
    align-items: center;
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

.master-container.light {
    .links-container {
        border-color: var(--black-soft);
    }
}
</style>
