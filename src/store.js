import { createStore } from 'vuex';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from './firebase/init.js';

const store = createStore({
    state: {
        items: [],
        orders: [],
        cart: [],
        partners: [],
        coupons: [],
        checkout: 0
    },
    getters: {
        items(state) {
            return state.items;
        },
        orders(state) {
            return state.orders;
        },
        cart(state) {
            return state.cart;
        },
        partners(state) {
            return state.partners;
        },
        coupons(state) {
            return state.coupons;
        },
        checkout(state) {
            return state.checkout;
        }
    },
    mutations: {
        SET_ITEMS(state, value) {
            state.items = value;
        },
        SET_ORDERS(state, value) {
            state.orders = value;
        },
        SET_PARTNERS(state, value) {
            state.partners = value;
        },
        SET_COUPONS(state, value) {
            state.coupons = value;
        },
        SET_CHECKOUT_AMOUNT(state, value) {
            state.checkout = value;
        },
        ADD_CART(state, value) {
            state.cart = state.cart.concat(value);
        },
        CLEAR_CART(state) {
            state.cart.length = 0;
        }
    },
    actions: {
        async getItems(context) {
            const q = query(collection(db, "items"));
            let itemsList = [];

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                itemsList.push({ id: doc.id, pageDisplay: false, searchDisplay: true, categoryDisplay: true, priceDisplay: true, availabilityDisplay: true, ...doc.data() });
            });

            context.commit('SET_ITEMS', itemsList);
        },
        async getOrders(context) {
            const q = query(collection(db, "orders"));
            let ordersList = [];

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                ordersList.push({ id: doc.id, ...doc.data() });
            });

            context.commit('SET_ORDERS', ordersList);
        },
        async getPartners(context) {
            const q = query(collection(db, "partners"));
            let partnersList = [];

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                partnersList.push({ id: doc.id, ...doc.data() });
            });

            context.commit('SET_PARTNERS', partnersList);
        },
        async getCoupons(context) {
            const q = query(collection(db, "coupons"));
            let couponsList = [];

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                couponsList.push({ id: doc.id, redeemed: false, ...doc.data() });
            });

            context.commit('SET_COUPONS', couponsList);
        },
        setCheckoutAmount(context, payload) {
            context.commit('SET_CHECKOUT_AMOUNT', payload.amount);
        },
        addToCart(context, payload) {
            context.commit('ADD_CART', payload.addedToCart);
        },
        clearCart(context) {
            context.commit('CLEAR_CART');
        }
    }
});

// export the store
export default store;