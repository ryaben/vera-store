import { createWebHistory, createRouter } from "vue-router";

//Views importadas
import Home from "/src/views/Home.vue";
import Store from "/src/views/Store.vue";
import AboutUs from "/src/views/AboutUs.vue";
import Cart from "/src/views/Cart.vue";
import Checkout from "/src/views/Checkout.vue";
import Order from "/src/views/Order.vue";

//Rutas
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/store",
    name: "Store",
    component: Store
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: AboutUs
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout
  },
  {
    path: "/order/:orderID",
    name: "Order",
    component: Order,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;