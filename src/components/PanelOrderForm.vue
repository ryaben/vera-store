<script setup>
import store from '../store.js';
import { db } from '../firebase/init.js';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { notify } from "@kyvg/vue3-notification";

defineProps({
    formInfo: {
        type: Object,
        required: false,
        default: {}
    },
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    }
})
</script>

<template>
    <div class="form-container flex column y-centered">
        <p class="id-title">
            {{ $t('panelForm.formTitle1') }}
            <br>
            <router-link v-if="!formAdd" class="bold" :to="'/order/' + formInfo.id">
                {{ formInfo.id }}
            </router-link>
            <span v-if="formAdd">{{ $t('panelForm.newID') }}</span>
        </p>

        <form class="flex column wide" @submit.prevent="updateOrder">
            <div class="flex column y-centered">
                <label for="orderStatus" class="field-label flex x-centered wide">{{ $t('panelForm.status') }}&nbsp;
                    <select name="orderStatus" id="orderStatus" class="form-field" v-model="formInfo.orderStatus">
                        <option value="0">{{ $t('global.status0Title') }}</option>
                        <option value="1">{{ $t('global.status1Title') }}</option>
                        <option value="2">{{ $t('global.status2Title') }}</option>
                        <option value="3">{{ $t('global.status3Title') }}</option>
                    </select>
                </label>
            </div>
            <label class="flex column wide y-centered top-margin">
                {{ $t('panelForm.internalNotes') }}
                <textarea rows="6" class="field-textarea" name="orderNotes" v-model="formInfo.orderNotes"></textarea>
            </label>
            <p class="form-subtitle bold">{{ $t('panelForm.itemsIncluded') }}</p>
            <div class="flex column">
                <p class="item-count auto-margin" v-for="(item, i) in differentItemsInCart" :key="i">
                    • {{ item.amount }} x {{ itemsList.find((el) => {
                        return el.id === item.id
                    }).itemTitle[$i18n.locale] }}
                </p>
            </div>
            <label class="flex x-centered" for="orderPrice">
                {{ $t('panelForm.total') }}&nbsp;
                <select name="orderCurrency" id="currencySelector" v-model="formInfo.orderCurrency">
                    <option value="usd">USD</option>
                    <option value="ars">ARS</option>
                </select>
                <input v-model="formInfo.orderPrice" id="orderPrice" class="form-field number" type="number" step=".01">
            </label>
            <p class="form-subtitle bold">{{ $t('panelForm.customerInfo') }}</p>
            <div class="flex column y-centered">
                <label for="customerName" class="field-label flex x-centered wide">{{ $t('panelForm.name')
                    }}&nbsp;<input v-model="formInfo.customer.name" id="customerName" class="form-field"
                        type="text"></label>
                <label for="customerEmail" class="field-label flex x-centered wide">{{ $t('panelForm.email')
                    }}&nbsp;<input v-model="formInfo.customer.email" id="customerEmail" class="form-field"
                        type="text"></label>
            </div>
            <p class="form-subtitle bold">{{ $t('panelForm.payment') }}</p>
            <div class="flex column y-centered">
                <label for="paymentMethod" class="field-label flex x-centered wide">{{ $t('panelForm.method') }}&nbsp;
                    <select name="paymentMethod" id="paymentMethod" class="form-field" v-model="formInfo.paymentMethod">
                        <option value="cash">{{ $t('panelForm.cash') }}</option>
                        <option value="card">Payoneer</option>
                    </select>
                </label>
                <label for="paymentLink" class="field-label flex x-centered wide">{{ $t('panelForm.link') }}&nbsp;<input
                        v-model="formInfo.paymentLink" id="paymentLink" class="form-field" type="url"></label>
            </div>
            <input type="submit" class="submit-button action-button large" :class="{ 'disabled': !formInfo.id }"
                :value="$t('panelForm.updateOrder')">
        </form>
    </div>
</template>

<script>
export default {
    name: 'Panel Form',
    data() {
        return {
            formAdd: false
        }
    },
    computed: {
        differentItemsInCart() {
            let items = [];

            this.formInfo.orderItems.forEach(function (orderItem) {
                const itemCheck = items.find(function (item) {
                    return item.id === orderItem;
                });

                if (itemCheck === undefined) {
                    items.push({ id: orderItem, amount: 1 });
                } else {
                    itemCheck.amount++;
                }
            });

            return items;
        }
    },
    methods: {
        async updateOrder() {
            const that = this;
            const orderRef = doc(db, "orders", this.formInfo.id);

            await updateDoc(orderRef, {
                customer: {
                    email: that.formInfo.customer.email,
                    name: that.formInfo.customer.name
                },
                orderCurrency: that.formInfo.orderCurrency,
                orderItems: that.formInfo.orderItems,
                orderNotes: that.formInfo.orderNotes,
                orderPrice: that.formInfo.orderPrice,
                orderStatus: Number(that.formInfo.orderStatus),
                paymentLink: that.formInfo.paymentLink,
                paymentMethod: that.formInfo.paymentMethod
            });

            this.updateNotification();
        },
        async deleteElement() {
            if (confirm(this.$t("panelForm.deleteEntry"))) {
                await deleteDoc(doc(db, 'orders', this.formInfo.id));
                this.deleteNotification();
            }
        },
        deleteNotification() {
            notify({
                title: this.$t("panelForm.deleteNotificationTitle"),
                text: this.$t("panelForm.deleteNotificationText"),
                type: 'success'
            });
        },
        updateNotification() {
            notify({
                title: this.$t("panelForm.updateNotificationTitle"),
                text: this.$t("panelForm.updateNotificationText"),
                type: "success"
            });
        }
    }
}
</script>

<style scoped>
.form-container {
    position: relative;
    padding: 15px;
}

.form-view-container-left {
    position: absolute;
    left: 5px;
    top: 5px;
}

.form-view-container-right {
    position: absolute;
    right: 5px;
    top: 5px;
}

.corner-button {
    height: 29px;
    padding: 2px;
}

.corner-button~label {
    font-size: 11px;
    margin-top: 1px;
}

.action-button {
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
}

.action-button.selected {
    outline: 2px solid var(--soft-main-palette);
}

.id-title {
    font-size: 18px;
    margin: 0 auto 10px auto;
    text-align: center;
}

.form-subtitle {
    margin: 15px auto 15px auto;
}

div>.item-count:last-of-type {
    margin-bottom: 15px;
}

.form-field {
    width: 60%;
}

.form-field.number {
    width: 30%;
}

.field-label {
    margin-bottom: 4px;
}

.field-label:last-child {
    margin-bottom: 0;
}

.submit-button {
    width: 60%;
    margin: 20px auto 0 auto;
}

.field-textarea {
    width: 70%;
    overflow-y: scroll;
}
</style>
