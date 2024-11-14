<script setup>
import store from './store';
import MobileBar from './components/MobileBar.vue';
import NavBar from './components/NavBar.vue';
import { useWindowSize } from 'vue-window-size';
const { width } = useWindowSize();
const windowWidth = width;
</script>

<template>
  <MobileBar v-if="windowWidth <= 750" :item-count="cartList.length" :links="[
    { text: $t('app.navBarHomeButton'), route: 'Home' },
    { text: $t('app.navBarStoreButton'), route: 'Store' },
    { text: $t('app.navBarCartButton'), route: 'Cart' },
    { text: $t('app.navBarFAQsButton'), route: 'FAQs' },
    { text: $t('app.navBarAboutUsButton'), route: 'AboutUs' }
  ]" />
  <NavBar v-if="windowWidth > 750" :item-count="cartList.length" :buttons="[
    { text: $t('app.navBarHomeButton'), icon: 'home.png', route: 'Home' },
    { text: $t('app.navBarStoreButton'), icon: 'store.png', route: 'Store', subButtons: [{ text: $t('app.navBarProductsButton'), route: 'Store' }, { text: $t('app.navBarCartButton'), route: 'Cart' }] },
    { text: $t('app.navBarInfoButton'), icon: 'info.png', route: 'FAQs', subButtons: [{ text: $t('app.navBarFAQsButton'), route: 'FAQs' }, { text: $t('app.navBarAboutUsButton'), route: 'AboutUs' }] }
  ]" />

  <main>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <KeepAlive :include="['Store', 'Cart', 'Admin Panel']">
          <component :is="Component" :items-list="itemsList" :orders-list="ordersList" :cart-list="cartList"
            :partners-list="partnersList" :coupons-list="couponsList" :checkout-amount="checkoutAmount" />
        </KeepAlive>
      </Transition>
    </router-view>
  </main>

  <footer class="flex" v-if="windowWidth > 750">

  </footer>

  <notifications position="top center" width="350px" :speed="700" :pause-on-hover="true" />
</template>

<script>
export default {
  components: {
    MobileBar, NavBar
  },
  data() {
    return {
      
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
    couponsList() {
      return store.getters.coupons;
    },
    checkoutAmount() {
      return Number(store.getters.checkout);
    }
  },
  async beforeCreate() {
    await store.dispatch('getItems');
    await store.dispatch('getPartners');
    await store.dispatch('getCoupons');
  },
  beforeMount() {
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', JSON.stringify({ title: 'Welcome to our store!', image: '/img/english.png', value: 'en' }));
    }
  }
}
</script>

<style scoped></style>
