<script setup>
import store from './store';
import MobileBar from './components/MobileBar.vue';
import NavBar from './components/NavBar.vue';
import DesktopFooter from './components/DesktopFooter.vue';
import RoundLink from './components/RoundLink.vue';
import { useWindowSize } from 'vue-window-size';
const { width } = useWindowSize();
const windowWidth = width;
</script>

<template>
  <div class="master-container flex column tall space-between" :class="{'dark': darkMode, 'light': !darkMode}">
    <div class="flex column start">
      <MobileBar v-if="windowWidth <= 750" :item-count="cartList.length" @dark-mode-toggled="applyDarkMode" :links="[
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
    </div>

    <DesktopFooter v-if="windowWidth > 750" @dark-mode-toggled="applyDarkMode" />
  </div>

  <RoundLink v-if="windowWidth <= 750" id="whatsappLink" :icon="'whatsapp'"
    :href="'https://api.whatsapp.com/send?phone=5491132703200'" :width="40" :height="40" />
  <notifications position="top center" width="350px" :speed="700" :pause-on-hover="true" />
</template>

<script>
export default {
  components: {
    MobileBar, NavBar, RoundLink
  },
  data() {
    return {
      darkMode: undefined
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
  methods: {
    applyDarkMode(value) {
      this.darkMode = value;
    }
  },
  beforeMount() {
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', JSON.stringify({ title: 'Welcome to our store!', image: '/img/english.png', value: 'en' }));
    }

    if (localStorage.getItem('shoppingCart')) {
      store.dispatch("addToCart", { addedToCart: JSON.parse(localStorage.getItem('shoppingCart')) });
    }
  }
}
</script>

<style scoped>
#whatsappLink {
  position: fixed;
  right: 3.5dvw;
  bottom: 3.5dvw;
}
</style>
