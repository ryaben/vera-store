<script setup>
import store from './store';
import MobileBar from './components/MobileBar.vue';
import NavBar from './components/NavBar.vue';
import { useWindowSize } from 'vue-window-size';
const { width, height } = useWindowSize();
const windowWidth = width;
const windowHeight = height;
</script>

<template>
  <MobileBar v-if="windowWidth <= 750" :links="mobileBarLinks" :item-count="cartList.length" />
  <NavBar v-if="windowWidth > 750" :links="mobileBarLinks" :item-count="cartList.length" />

  <main>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <KeepAlive :include="['Store', 'Cart', 'Admin Panel']">
          <component :is="Component" :items-list="itemsList" :orders-list="ordersList" :cart-list="cartList" :partners-list="partnersList" />
        </KeepAlive>
      </Transition>
    </router-view>
  </main>

  <notifications position="top center" width="350px" :speed="700" :pause-on-hover="true" />
</template>

<script>
export default {
  components: {
    MobileBar, NavBar
  },
  data() {
    return {
      mobileBarLinks: [
        { text: "Home", route: "Home" },
        { text: "Store", route: "Store" },
        { text: "Cart", route: "Cart" },
        { text: "FAQs", route: "Home" },
        { text: "About us", route: "AboutUs" }
      ]
    }
  },
  computed: {
    itemsList() {
      return store.getters.items;
    },
    ordersList() {
      return store.getters.orders;
    },
    cartList() {
      return store.getters.cart;
    },
    partnersList() {
      return store.getters.partners;
    },
  },
  async beforeCreate() {
    await store.dispatch('getItems');
    await store.dispatch('getPartners');
  }
}
</script>

<style scoped></style>
