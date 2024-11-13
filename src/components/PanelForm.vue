<script setup>
import store from '../store';
import { db, storage } from '../firebase/init.js';
import { doc, updateDoc, setDoc, addDoc, deleteDoc, collection, GeoPoint } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { notify } from "@kyvg/vue3-notification";
import MapboxMap from '../components/MapboxMap.vue';
import SelectedValue from './SelectedValue.vue';

defineProps({
    formInfo: {
        type: Object,
        required: false,
        default: {}
    },
    formType: {
        type: String,
        required: false,
        default: 'order'
    },
    itemsList: {
        type: Array,
        required: false,
        default: store.getters.items
    },
    markerPosition: {
        type: Array,
        require: false,
        default: [-58.4360043295337, -34.60653558169007]
    }
})
</script>

<template>
    <div class="form-container flex column y-centered">
        <div class="form-view-container-left flex column x-centered y-centered" v-if="formType !== 'order'">
            <button class="action-button corner-button" :class="{ 'disabled': !formInfo.id }"
                @click="deleteElement">❌</button>
            <label>{{ $t('panelForm.delete') }}</label>
        </div>
        <div class="form-view-container-right flex column x-centered y-centered" v-if="formType !== 'order'">
            <button class="action-button corner-button" :class="{ 'selected': formAdd }"
                @click="toggleFormAdd">➕</button>
            <label>{{ $t('panelForm.new') }}</label>
        </div>

        <p class="id-title">
            <span v-if="formType === 'order'">{{ $t('panelForm.formTitle1') }}</span>
            <span v-if="formType === 'item'">{{ $t('panelForm.formTitle2') }}</span>
            <span v-if="formType === 'partner'">{{ $t('panelForm.formTitle3') }}</span>
            <span v-if="formType === 'coupon'">{{ $t('panelForm.formTitle4') }}</span>
            <br>
            <router-link v-if="formType === 'order' && !formAdd" class="bold" :to="'/order/' + formInfo.id">
                {{ formInfo.id }}
            </router-link>
            <router-link v-if="formType === 'item' && !formAdd" class="bold" :to="'/store/' + formInfo.id">
                {{ formInfo.id }}
            </router-link>
        <p v-if="(formType === 'partner' || formType === 'coupon') && !formAdd" class="bold" style="margin-bottom: 0;">
            {{ formInfo.id }}
        </p>
        <span v-if="formAdd">{{ $t('panelForm.newID') }}</span>
        </p>

        <form class="flex column wide" v-if="formType === 'order'" @submit.prevent="updateOrder">
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
                <p class="item-count" v-for="(item, i) in differentItemsInCart" :key="i">
                    • {{ item.amount }} x {{ itemsList.find((el) => { return el.id === item.id }).itemTitle }}
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

        <form class="flex column wide" v-if="formType === 'item'"
            @submit.prevent="formAdd ? createItem() : updateItem()">
            <label class="flex wide x-centered bottom-margin" for="itemTitle">
                {{ $t('panelForm.title') }}&nbsp;
                <input v-model="formInfo.itemTitle" id="itemTitle" class="form-field" type="text" required>
            </label>
            <div class="flex column wide y-centered">
                <img class="item-photo" :src="formInfo.itemPhoto" alt="Photo">
                <input id="photoFile" type="file" @input="previewImage" accept="image/png">
            </div>
            <div class="flex x-centered top-margin bottom-margin">
                <label class="flex right right-margin" for="itemPrice">{{ $t('panelForm.price')
                    }}&nbsp;<input v-model="formInfo.itemPrice" id="itemPrice" class="form-field number" type="number"
                        step=".01" required>
                </label>
                <label class="flex left" for="itemPriceSale">{{ $t('panelForm.priceSale')
                    }}&nbsp;<input v-model="formInfo.itemPriceSale" id="itemPriceSale" class="form-field number"
                        type="number" step=".01">
                </label>
            </div>
            <label class="flex column wide y-centered bottom-margin">
                {{ $t('panelForm.categories') }}
                <div class="flex">
                    <input type="text" v-model="categoryValue" :placeholder="$t('panelForm.categoriesPlaceholder')">
                    <div class="action-button flex x-centered y-centered" style="margin-left: 10px;"
                        @click.native.stop="addValue(categoryValue, formInfo.itemCategories); categoryValue = ''">{{
                            $t('panelForm.add') }}</div>
                </div>
                <div class="flex">
                    <SelectedValue class="selection margin-top" v-for="(value, i) in formInfo.itemCategories" :key="i"
                        :lang-text="value" @remove-value="removeValue(value, formInfo.itemCategories)" />
                </div>
            </label>
            <label class="flex column wide y-centered">
                {{ $t('panelForm.shortDescription') }}
                <textarea rows="3" class="field-textarea" name="shortDescription"
                    v-model="formInfo.itemShortDescription"></textarea>
            </label>
            <label class="flex column wide y-centered top-margin bottom-margin">
                {{ $t('panelForm.longDescription') }}
                <textarea rows="6" class="field-textarea" name="longDescription"
                    v-model="formInfo.itemLongDescription"></textarea>
            </label>
            <div class="flex space-evenly">
                <label class="flex x-centered" for="itemAvailability">
                    <input id="itemAvailability" type="checkbox" v-model="formInfo.itemAvailability">
                    {{ $t('panelForm.available') }}
                </label>
                <label class="flex x-centered" for="itemOnSale">
                    <input id="itemOnSale" type="checkbox" v-model="formInfo.itemOnSale">
                    {{ $t('panelForm.onSale') }}
                </label>
                <label class="flex x-centered" for="itemHidden">
                    <input id="itemHidden" type="checkbox" v-model="formInfo.itemHidden">
                    {{ $t('panelForm.hidden') }}
                </label>
            </div>
            <input type="submit" class="submit-button action-button large"
                :class="{ 'disabled': !formInfo.id && !formAdd }"
                :value="formAdd ? $t('panelForm.addNewItem') : $t('panelForm.updateItem')">
        </form>

        <form class="flex column wide" v-if="formType === 'partner'"
            @submit.prevent="formAdd ? createPartner() : updatePartner()">
            <div class="flex column y-centered">
                <p class="bold">{{ $t('panelForm.property') }}</p>
                <label class="field-label flex x-centered" for="partnerPropertyName">{{ $t('panelForm.propertyName')
                    }}&nbsp;<input v-model="formInfo.partnerPropertyName" id="partnerPropertyName" class="form-field"
                        type="text" required></label>
                <label class="flex x-centered bottom-margin" for="partnerAddress">{{ $t('panelForm.address')
                    }}&nbsp;<input v-model="formInfo.partnerAddress" id="partnerAddress" class="form-field" type="text"
                        required></label>
                <label class="flex column wide y-centered">
                    {{ $t('panelForm.location') }}
                    <MapboxMap :height="'40vh'" :width="'90%'" :mode="'picker'" :marker-position="markerPosition"
                        @dragged-marker="draggedMarker" />
                </label>
            </div>
            <p class="form-subtitle bold">{{ $t('panelForm.ownerContact') }}</p>
            <div class="flex column y-centered">
                <label for="partnerName" class="field-label flex x-centered wide">{{ $t('panelForm.ownerName')
                    }}&nbsp;<input v-model="formInfo.partnerName" id="partnerName" class="form-field"
                        type="text"></label>
                <label for="partnerEmail" class="field-label flex x-centered wide">{{ $t('panelForm.ownerEmail')
                    }}&nbsp;<input v-model="formInfo.partnerEmail" id="partnerEmail" class="form-field"
                        type="email"></label>
                <label for="partnerPhone" class="field-label flex x-centered wide">{{ $t('panelForm.phone')
                    }}&nbsp;<input v-model="formInfo.partnerPhone" id="partnerPhone" class="form-field"
                        type="tel"></label>
            </div>
            <div class="flex x-centered top-margin space-evenly">
                <label class="flex x-centered" for="partnerActivity">
                    <input id="partnerActivity" type="checkbox" v-model="formInfo.partnerActivity">
                    {{ $t('panelForm.active') }}
                </label>
                <label class="flex x-centered" for="partnerPrivacy">
                    <input id="partnerPrivacy" type="checkbox" v-model="formInfo.partnerPrivacy">
                    {{ $t('panelForm.private') }}
                </label>
            </div>

            <input type="submit" class="submit-button action-button large"
                :class="{ 'disabled': !formInfo.id && !formAdd }"
                :value="formAdd ? $t('panelForm.addNewPartner') : $t('panelForm.updatePartner')">
        </form>

        <form class="flex column wide" v-if="formType === 'coupon'"
            @submit.prevent="formAdd ? createCoupon() : updateCoupon()">
            <label class="flex wide x-centered" for="couponCode">
                {{ $t('panelForm.code') }}&nbsp;
                <input v-model="formInfo.couponCode" id="couponCode" class="form-field" type="text" required>
            </label>

            <div class="flex column y-centered x-centered">
                <p class="form-subtitle bold">{{ $t('panelForm.discount') }}</p>

                <div class="flex wide x-centered y-centered bottom-margin">
                    <label class="flex right" for="couponType">
                        {{ $t('panelForm.type') }}&nbsp;
                        <select v-model="formInfo.couponType" class="right-margin" name="couponType" id="couponType"
                            required>
                            <option value="fixed">{{ $t('panelForm.couponType1') }}</option>
                            <option value="percentage">{{ $t('panelForm.couponType2') }}</option>
                        </select>
                    </label>
                    <label class="flex left" for="couponAmount">
                        <span class="left-margin">{{ $t('panelForm.amount') }}&nbsp;</span>
                        <span v-if="formInfo.couponType === 'fixed'">$&nbsp;</span>
                        <span v-if="formInfo.couponType === 'percentage'">%&nbsp;</span>
                        <input v-model="formInfo.couponAmount" id="couponAmount" min="1" max="99" class="form-field"
                            type="number" required>
                    </label>
                </div>
                <div class="flex column wide x-centered y-centered">
                    <label class="flex left bottom-margin" for="couponAppliesOn">
                        <span>{{ $t('panelForm.appliesOn') }}&nbsp;</span>
                        <select v-model="formInfo.couponAppliesOn" name="couponAppliesOn" id="couponAppliesOn" required>
                            <option value="cart">{{ $t('panelForm.couponDiscountOn1') }}</option>
                            <option value="itemsByID">{{ $t('panelForm.couponDiscountOn2') }}</option>
                            <option value="itemsByCategory">{{ $t('panelForm.couponDiscountOn3') }}</option>
                        </select>
                    </label>
                    <label
                        v-if="formInfo.couponAppliesOn === 'itemsByID' || formInfo.couponAppliesOn === 'itemsByCategory'"
                        class="flex column wide y-centered bottom-margin">
                        <div class="flex">
                            <input type="text" v-model="couponApplyValue"
                                :placeholder="$t('panelForm.applyPlaceholder')">
                            <div class="action-button flex x-centered y-centered" style="margin-left: 10px;"
                                @click.native.stop="addValue(couponApplyValue, formInfo.couponAppliesOnItems); couponApplyValue = ''">
                                {{ $t('panelForm.add') }}
                            </div>
                        </div>
                        <div class="flex">
                            <SelectedValue class="selection margin-top"
                                v-for="(value, i) in formInfo.couponAppliesOnItems" :key="i" :lang-text="value"
                                @remove-value="removeValue(value, formInfo.couponAppliesOnItems)" />
                        </div>
                    </label>
                    <p class="form-subtitle bold">{{ $t('panelForm.otherProperties') }}&nbsp;</p>
                    <label class="flex wide x-centered bottom-margin" for="couponMinimumSpend">
                        {{ $t('panelForm.minimumSpend') }}&nbsp;
                        <input v-model="formInfo.couponMinimumSpend" id="couponMinimumSpend" class="form-field number"
                            min="0" type="number" required>
                    </label>
                    <div class="flex x-centered y-centered">
                        <label class="flex x-centered y-centered right-margin" for="couponIncludeSaleItems">
                            <input id="couponIncludeSaleItems" type="checkbox"
                                v-model="formInfo.couponIncludeSaleItems">
                            {{ $t('panelForm.includeSaleItems') }}
                        </label>
                        <label class="flex x-centered y-centered" for="couponActive">
                            <input id="couponActive" type="checkbox" v-model="formInfo.couponActive">
                            {{ $t('panelForm.couponActive') }}
                        </label>
                    </div>
                </div>
            </div>
            <input type="submit" class="submit-button action-button large"
                :class="{ 'disabled': !formInfo.id && !formAdd }"
                :value="formAdd ? $t('panelForm.addNewCoupon') : $t('panelForm.updateCoupon')">
        </form>
    </div>
</template>

<script>
export default {
    name: 'Panel Form',
    components: {
        MapboxMap, SelectedValue
    },
    data() {
        return {
            photoSource: '',
            categoryValue: "",
            couponApplyValue: "",
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
        previewImage(event) {
            this.photoSource = event.target.files[0];
            this.formInfo.itemPhoto = URL.createObjectURL(this.photoSource);
            this.formAdd === false ? this.updateItemPhoto() : console.log("Image not uploaded because it's new item.");
        },
        async updateItem() {
            const that = this;
            const itemRef = doc(db, "items", this.formInfo.id);

            await updateDoc(itemRef, {
                itemAvailability: that.formInfo.itemAvailability,
                itemCategories: that.formInfo.itemCategories,
                itemLongDescription: that.formInfo.itemLongDescription,
                itemOnSale: that.formInfo.itemOnSale,
                itemHidden: that.formInfo.itemHidden,
                itemPrice: that.formInfo.itemPrice,
                itemPriceSale: that.formInfo.itemPriceSale,
                itemShortDescription: that.formInfo.itemShortDescription,
                itemTitle: that.formInfo.itemTitle
            });

            that.updateNotification();
        },
        async updateItemPhoto() {
            const that = this;
            const itemRef = doc(db, "items", this.formInfo.id);

            this.uploadPhoto(this.formInfo.id, 'items', function (fileName) {
                that.generatePhotoReference(fileName, 'items', async function (photoReference) {
                    await updateDoc(itemRef, {
                        itemPhoto: photoReference,
                    });

                    that.updatePhotoNotification();
                });
            });
        },
        async createItem() {
            const that = this;
            const autoID = this.generateFirestoreId();

            this.uploadPhoto(autoID, 'items', function (fileName) {
                that.generatePhotoReference(fileName, 'items', async function (photoReference) {
                    await setDoc(doc(db, "items", autoID), {
                        itemPurchases: 0,
                        itemAvailability: that.formInfo.itemAvailability,
                        itemCategories: that.formInfo.itemCategories,
                        itemLongDescription: that.formInfo.itemLongDescription,
                        itemPhoto: photoReference,
                        itemOnSale: that.formInfo.itemOnSale,
                        itemHidden: that.formInfo.itemHidden,
                        itemPrice: that.formInfo.itemPrice,
                        itemPriceSale: that.formInfo.itemPriceSale,
                        itemShortDescription: that.formInfo.itemShortDescription,
                        itemTitle: that.formInfo.itemTitle
                    });

                    that.addNotification();
                });
            });
        },
        async createPartner() {
            await addDoc(collection(db, "partners"), {
                partnerPropertyName: this.formInfo.partnerPropertyName,
                partnerAddress: this.formInfo.partnerAddress,
                partnerLocation: new GeoPoint(this.markerPosition[1], this.markerPosition[0]),
                partnerName: this.formInfo.partnerName,
                partnerEmail: this.formInfo.partnerEmail,
                partnerPhone: this.formInfo.partnerPhone,
                partnerActivity: this.formInfo.partnerActivity,
                partnerPrivacy: this.formInfo.partnerPrivacy
            });

            this.addNotification();
        },
        async updatePartner() {
            const that = this;
            const partnerRef = doc(db, "partners", this.formInfo.id);

            await updateDoc(partnerRef, {
                partnerPropertyName: that.formInfo.partnerPropertyName,
                partnerAddress: that.formInfo.partnerAddress,
                partnerLocation: new GeoPoint(that.markerPosition[1], that.markerPosition[0]),
                partnerName: that.formInfo.partnerName,
                partnerEmail: that.formInfo.partnerEmail,
                partnerPhone: that.formInfo.partnerPhone,
                partnerActivity: that.formInfo.partnerActivity,
                partnerPrivacy: that.formInfo.partnerPrivacy
            });

            this.updateNotification();
        },
        async createCoupon() {
            await addDoc(collection(db, "coupons"), {
                couponCode: this.formInfo.couponCode,
                couponType: this.formInfo.couponType,
                couponAmount: this.formInfo.couponAmount,
                couponAppliesOn: this.formInfo.couponAppliesOn,
                couponAppliesOnItems: this.formInfo.couponAppliesOnItems,
                couponIncludeSaleItems: this.formInfo.couponIncludeSaleItems,
                couponActive: this.formInfo.couponActive,
                couponMinimumSpend: this.formInfo.couponMinimumSpend
            });

            this.addNotification();
        },
        async updateCoupon() {
            const that = this;
            const couponRef = doc(db, "coupons", this.formInfo.id);

            await updateDoc(couponRef, {
                couponCode: that.formInfo.couponCode,
                couponType: that.formInfo.couponType,
                couponAmount: that.formInfo.couponAmount,
                couponAppliesOn: that.formInfo.couponAppliesOn,
                couponAppliesOnItems: that.formInfo.couponAppliesOnItems,
                couponIncludeSaleItems: that.formInfo.couponIncludeSaleItems,
                couponActive: that.formInfo.couponActive,
                couponMinimumSpend: that.formInfo.couponMinimumSpend
            });

            this.updateNotification();
        },
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
        async uploadPhoto(fileName, folder, callback) {
            const storage = getStorage();
            const storageRef = ref(storage, 'images/' + folder + '/' + fileName + '.png');

            uploadBytes(storageRef, this.photoSource).then((snapshot) => {
                console.log('Flag file uploaded with ID ' + fileName);
                callback(fileName);
            });
        },
        async generatePhotoReference(fileName, folder, callback) {
            const storage = getStorage();

            getDownloadURL(ref(storage, 'images/' + folder + '/' + fileName + '.png'))
                .then((url) => {
                    console.log('Reference link for ' + fileName + ' is:' + url);
                    callback(url);
                })
                .catch((error) => {
                    notify({
                        title: this.$t("panelForm.getImageError"),
                        text: error,
                        type: "error"
                    });
                });
        },
        toggleFormAdd() {
            this.formAdd = !this.formAdd;
        },
        async deleteElement() {
            const that = this;

            if (confirm(this.$t("panelForm.deleteEntry"))) {
                await deleteDoc(doc(db, `${this.formType}s`, this.formInfo.id));

                if (this.formType === 'item') {
                    const photoRef = ref(storage, "images/" + `${this.formType}s` + "/" + this.formInfo.id + ".png");

                    deleteObject(photoRef)
                        .then(() => {
                            return that.deleteNotification();
                        }).catch((error) => {
                            return notify({
                                title: this.$t("panelForm.deleteNotificationTitle"),
                                text: error,
                                type: 'error'
                            })
                        });
                }

                this.deleteNotification();
            }
        },
        draggedMarker(newPosition) {
            this.$emit('dragged-marker', newPosition);
        },
        generateFirestoreId() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            return Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => chars[b % chars.length]).join('');
        },
        addValue(value, array) {
            if (array.find(e => e === value) === undefined) {
                array.push(value);
            }
        },
        removeValue(value, array) {
            array.splice(array.indexOf(value), 1);
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
        },
        updatePhotoNotification() {
            notify({
                title: this.$t("panelForm.updatePhotoNotificationTitle"),
                text: this.$t("panelForm.updatePhotoNotificationText"),
                type: "success"
            });
        },
        addNotification() {
            notify({
                title: this.$t("panelForm.addNotificationTitle"),
                text: this.$t("panelForm.addNotificationText"),
                type: "success"
            });
        },
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
    outline: 2px solid var(--soft-brown);
}

.id-title {
    font-size: 18px;
    margin: 0 auto 10px auto;
    text-align: center;
}

.form-subtitle {
    margin: 15px auto 15px auto;
}

.item-count {
    margin: auto;
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

#photoFile {
    width: fit-content;
}

.submit-button {
    width: 60%;
    margin: 20px auto 0 auto;
}

.item-photo {
    width: 60%;
    max-height: 200px;
    border: 1px solid var(--soft-brown);
    border-radius: 6px;
    margin-bottom: 8px;
}

.field-textarea {
    width: 70%;
    overflow-y: scroll;
}

#currencySelector {
    font-size: 16px;
    height: 25px;
    width: 60px;
}

@media (prefers-color-scheme: light) {}
</style>
