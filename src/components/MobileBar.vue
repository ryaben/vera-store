<script setup>
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
    <nav class="navbar flex column">
        <div class="bar-elements flex">
            <div :class="{ 'active': activeMore }" @click="toggleMore(); updateHeight()"></div>
            <h1 class="bar-title">{{ title }}</h1>
            <router-link class="cart-container flex" :to="{ name: 'Cart' }">
                <div class="flex">
                    <Transition name="fade">
                        <div v-if="itemCount > 0" class="cart-count-container flex"><label>{{ itemCount }}</label></div>
                    </Transition>
                </div>
            </router-link>
        </div>

        <Transition name="slide-left">
            <div class="buttons-container flex column space-between" v-if="activeMore"
                :class="{ 'active': activeMore }">
                <div class="flex column">
                    <div class="buttons-container-title flex y-centered x-centered">
                        <label>Menu</label>
                    </div>
                    <router-link class="link-button flex" v-for="(link, i) in links" :key="i" :to="{ name: link.route }"
                        @click="toggleMore">
                        <p>{{ link.text }}</p>
                    </router-link>
                </div>
                <div class="flex">
                    <p class="software-info">Argentina Deli Shop ver. 1.0<br>made by Ramiro Yaben</p>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script>
export default {
    name: 'MobileBar',
    data() {
        return {
            activeMore: false,
            theme: '-white',
            height: 0
        }
    },
    methods: {
        toggleMore() {
            this.activeMore = !this.activeMore;
        },
        updateHeight() {
            return this.height = this.height === 0 ? 'auto' : 0;
        }
    }
}
</script>

<style scoped>
.navbar {
    border-bottom: 3px solid var(--white-soft);
    height: 50px;
    margin-bottom: 15px;
}

.bar-elements {
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px 6px 8px;
}

.bar-elements>div {
    width: 35px;
    height: 35px;
    cursor: pointer;
    background-image: url("/img/more-white.png");
    background-size: cover;
    z-index: 3;
}

.bar-elements>div.active {
    border-radius: 8px;
    background-color: var(--intense-brown);
    transition: linear background-color 0.3s;
}

.bar-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
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

.buttons-container {
    background-color: var(--intense-brown);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    position: fixed;
    left: 0;
    top: 0;
    width: 50%;
    max-width: 350px;
    height: 100%;
    z-index: 2;
}

.buttons-container-title {
    height: 50px;
    border-top-right-radius: 10px;
    background-color: var(--light-brown);
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
    background-color: var(--soft-brown);
    border: 2px inset var(--indigo-dark);
    border-radius: 4px;
    font-weight: bold;
}

.link-button p {
    margin: auto;
}

.software-info {
    font-size: 12px;
    color: var(--pale-tone);
    text-align: center;
}

@media (prefers-color-scheme: light) {
    .navbar {
        border-color: var(--indigo-dark);
    }

    .bar-elements>div {
        background-image: url("/img/more-black.png");
    }

    .cart-container>div {
        background-image: url("/img/cart-black.png");
    }
}
</style>
