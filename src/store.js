import { createStore } from 'vuex';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from './firebase/init.js';

const store = createStore({
    state: {
        items: [],
        orders: [],
        cart: []
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
        }
    },
    mutations: {
        SET_ITEMS(state, value) {
            state.items = value;
        },
        SET_ORDERS(state, value) {
            state.orders = value;
        },
        ADD_CART(state, value) {
            state.cart = state.cart.concat(value);
        },
        CLEAR_CART(state, value) {
            state.cart = value;
        }
    },
    actions: {
        async getItems(context) {
            const q = query(collection(db, "items"));
            let itemsList = [];

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                itemsList.push({ id: doc.id, ...doc.data() });
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
        addToCart(context, payload) {
            context.commit('ADD_CART', payload.addedToCart);
        },
        clearCart(context) {
            context.commit('CLEAR_CART', []);
        }
    }
});

// export the store
export default store;