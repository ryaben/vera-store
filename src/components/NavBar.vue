<script setup>
defineProps({
    logo: {
        type: String,
        required: false,
        default: '/img/logo.png'
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
    <nav class="navbar flex column">
        <div class="bar-elements flex">
            <h1 class="bar-title">{{ title }}</h1>
            <img class="logo-image" :src="logo" alt="Logo">

        </div>
        <div class="links-container flex x-centered">
            <div class="flex">
                <router-link class="link-button flex x-centered y-centered" v-for="(link, i) in links" :key="i"
                    :to="{ name: link.route }" @click="toggleMore">
                    <p>{{ link.text }}</p>
                </router-link>
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
    data() {
        return {
            activeMore: false,
            height: 0
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.navbar {
    width: 95%;
    margin: auto;
}

.links-container {
    position: relative;
    background: var(--intense-brown);
    border-radius: 12px;
    border: 2px solid var(--pale-tone);
}

.link-button {
    height: 60px;
    padding: 0 15px 0 15px;
}

.link-button p {
    font-size: 20px;
    margin-bottom: 0;
}

.extra-links-container {
    position: absolute;
    right: 10px;
    top: 12px;
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
    background-color: var(--light-brown);
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
    background-color: var(--intense-brown);
    color: var(--pale-tone);
}

.cart-count-container label {
    font-size: 12px;
}

@media (prefers-color-scheme: light) {
    .links-container {
        border-color: var(--black-soft);
    }
}
</style>
