<script setup>
import store from './store';
import MobileBar from './components/MobileBar.vue';
</script>

<template>
  <MobileBar :links="mobileBarLinks" :item-count="cartList" />

  <main>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <KeepAlive :include="['Store', 'Checkout']">
          <component :is="Component" :items-list="itemsList" :orders-list="ordersList" :cart-list="cartList" />
        </KeepAlive>
      </Transition>
    </router-view>
  </main>
</template>

<script>
export default {
  components: {
    MobileBar
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
  },
  async beforeCreate() {
    await store.dispatch('getItems');
  }
}
</script>

<style scoped></style>
