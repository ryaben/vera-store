<script setup>
import store from '../store';
import { db, storage } from '../firebase/init.js';
import { doc, updateDoc, setDoc, addDoc, deleteDoc, collection, GeoPoint } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { notify } from "@kyvg/vue3-notification";
import MapboxMap from '../components/MapboxMap.vue';

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
            <label>Delete</label>
        </div>
        <div class="form-view-container-right flex column x-centered y-centered" v-if="formType !== 'order'">
            <button class="action-button corner-button" :class="{ 'selected': formAdd }"
                @click="toggleFormAdd">➕</button>
            <label>New</label>
        </div>

        <p class="id-title">
            <span v-if="formType === 'order'">Order</span>
            <span v-if="formType === 'item'">Item</span>
            <span v-if="formType === 'partner'">Partner</span>:
            <br>
            <router-link v-if="formType === 'order' && !formAdd" class="bold" :to="'/order/' + formInfo.id">{{
                formInfo.id
            }}</router-link>
            <router-link v-if="formType === 'item' && !formAdd" class="bold" :to="'/store/' + formInfo.id">{{
                formInfo.id
            }}</router-link>
            <p v-if="formType === 'partner' && !formAdd" class="bold" style="margin-bottom: 0;">{{ formInfo.id }}</p>
            <span v-if="formAdd">New ID will be generated.</span>
        </p>

        <form class="flex column wide" v-if="formType === 'order'" @submit.prevent="updateOrder">
            <div class="flex column y-centered">
                <label for="orderStatus" class="field-label flex x-centered wide">Status:&nbsp;
                    <select name="orderStatus" id="orderStatus" class="form-field" v-model="formInfo.orderStatus">
                        <option value="0">Issued</option>
                        <option value="1">Ready</option>
                        <option value="2">Paid</option>
                        <option value="3">Delivered</option>
                    </select>
                </label>
            </div>
            <label class="flex column wide y-centered top-margin">
                Internal notes:
                <textarea rows="6" class="field-textarea" name="orderNotes" v-model="formInfo.orderNotes"></textarea>
            </label>
            <p class="form-subtitle bold">Items included:</p>
            <div class="flex column">
                <p class="item-count" v-for="(item, i) in differentItemsInCart" :key="i">
                    • {{ item.amount }} x {{ itemsList.find((el) => { return el.id === item.id }).title }}
                </p>
            </div>
            <label class="flex x-centered" for="orderPrice">
                Total:&nbsp;
                <select name="orderCurrency" id="currencySelector" v-model="formInfo.orderCurrency">
                    <option value="usd">USD</option>
                    <option value="ars">ARS</option>
                </select>
                <input v-model="formInfo.orderPrice" id="orderPrice" class="form-field number" type="number" step=".01">
            </label>
            <p class="form-subtitle bold">Customer info:</p>
            <div class="flex column y-centered">
                <label for="customerName" class="field-label flex x-centered wide">Name:&nbsp;<input
                        v-model="formInfo.customer.name" id="customerName" class="form-field" type="text"></label>
                <label for="customerEmail" class="field-label flex x-centered wide">Email:&nbsp;<input
                        v-model="formInfo.customer.email" id="customerEmail" class="form-field" type="text"></label>
            </div>
            <p class="form-subtitle bold">Payment:</p>
            <div class="flex column y-centered">
                <label for="paymentMethod" class="field-label flex x-centered wide">Method:&nbsp;
                    <select name="paymentMethod" id="paymentMethod" class="form-field" v-model="formInfo.paymentMethod">
                        <option value="cash">Cash</option>
                        <option value="card">Payoneer</option>
                    </select>
                </label>
                <label for="paymentLink" class="field-label flex x-centered wide">Link:&nbsp;<input
                        v-model="formInfo.paymentLink" id="paymentLink" class="form-field" type="url"></label>
            </div>
            <input type="submit" class="submit-button action-button large" :class="{ 'disabled': !formInfo.id }"
                value="Update order">
        </form>

        <form class="flex column wide" v-if="formType === 'item'"
            @submit.prevent="formAdd ? createItem() : updateItem()">
            <label class="flex wide x-centered bottom-margin" for="itemTitle">
                Title:&nbsp;
                <input v-model="formInfo.title" id="itemTitle" class="form-field" type="text">
            </label>
            <div class="flex column wide y-centered">
                <img class="item-photo" :src="formInfo.photo" alt="Photo">
                <input id="photoFile" type="file" @input="previewImage" accept="image/png">
            </div>
            <label class="flex x-centered top-margin bottom-margin" for="itemPrice">Price:&nbsp;<input
                    v-model="formInfo.price" id="itemPrice" class="form-field number" type="number" step=".01"></label>
            <label class="flex column wide y-centered">
                Short description:
                <textarea rows="3" class="field-textarea" name="shortDescription"
                    v-model="formInfo.shortDescription"></textarea>
            </label>
            <label class="flex column wide y-centered top-margin bottom-margin">
                Long description:
                <textarea rows="6" class="field-textarea" name="longDescription"
                    v-model="formInfo.longDescription"></textarea>
            </label>
            <label class="flex wide x-centered" for="itemAvailability">
                <input id="itemAvailability" type="checkbox" v-model="formInfo.itemAvailability">
                Available
            </label>
            <input type="submit" class="submit-button action-button large"
                :class="{ 'disabled': !formInfo.id && !formAdd }" :value="formAdd ? 'Add new item' : 'Update item'">
        </form>

        <form class="flex column wide" v-if="formType === 'partner'"
            @submit.prevent="formAdd ? createPartner() : updatePartner">
            <div class="flex column y-centered">
                <p class="bold">Property:</p>
                <label class="field-label flex x-centered" for="partnerPropertyName">Name:&nbsp;<input
                    v-model="formInfo.partnerPropertyName" id="partnerPropertyName" class="form-field" type="text"></label>
                <label class="flex x-centered bottom-margin" for="partnerAddress">Address:&nbsp;<input
                    v-model="formInfo.partnerAddress" id="partnerAddress" class="form-field" type="text"></label>
                <MapboxMap :height="'40vh'" :width="'90%'" :mode="'picker'" :marker-position="markerPosition" @dragged-marker="draggedMarker" />
            </div>
            <p class="form-subtitle bold">Owner's contact:</p>
            <div class="flex column y-centered">
                <label for="partnerName" class="field-label flex x-centered wide">Name:&nbsp;<input
                        v-model="formInfo.partnerName" id="partnerName" class="form-field" type="text"></label>
                <label for="partnerEmail" class="field-label flex x-centered wide">Email:&nbsp;<input
                        v-model="formInfo.partnerEmail" id="partnerEmail" class="form-field" type="email"></label>
                <label for="partnerPhone" class="field-label flex x-centered wide">Phone:&nbsp;<input
                        v-model="formInfo.partnerPhone" id="partnerPhone" class="form-field" type="tel"></label>
            </div>
            <div class="flex x-centered top-margin space-evenly">
                <label class="flex x-centered" for="partnerActivity">
                    <input id="partnerActivity" type="checkbox" v-model="formInfo.partnerActivity">
                    Active
                </label>
                <label class="flex x-centered" for="partnerPrivacy">
                    <input id="partnerPrivacy" type="checkbox" v-model="formInfo.partnerPrivacy">
                    Private
                </label>
            </div>

            <input type="submit" class="submit-button action-button large"
                :class="{ 'disabled': !formInfo.id && !formAdd }"
                :value="formAdd ? 'Add new partner' : 'Update partner'">
        </form>
    </div>
</template>

<script>
export default {
    name: 'Panel Form',
    components: {
        MapboxMap
    },
    data() {
        return {
            photoSource: '',
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
            this.formInfo.photo = URL.createObjectURL(this.photoSource);
            this.updateItemPhoto();
        },
        async updateItem() {
            const that = this;
            const itemRef = doc(db, "items", this.formInfo.id);

            await updateDoc(itemRef, {
                itemAvailability: that.formInfo.itemAvailability,
                longDescription: that.formInfo.longDescription,
                price: that.formInfo.price,
                shortDescription: that.formInfo.shortDescription,
                title: that.formInfo.title
            });

            that.updateNotification();
        },
        async updateItemPhoto() {
            const that = this;
            const itemRef = doc(db, "items", this.formInfo.id);

            this.uploadPhoto(this.formInfo.id, 'items', function (fileName) {
                that.generatePhotoReference(fileName, 'items', async function (photoReference) {
                    await updateDoc(itemRef, {
                        photo: photoReference,
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
                        itemAvailability: that.formInfo.itemAvailability,
                        longDescription: that.formInfo.longDescription,
                        photo: photoReference,
                        price: that.formInfo.price,
                        shortDescription: that.formInfo.shortDescription,
                        title: that.formInfo.title
                    });

                    that.addNotification();
                });
            });
        },
        async createPartner() {
            await addDoc(collection(db, "partners"), {
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
        async updateOrder() {
            const orderRef = doc(db, "orders", this.formInfo.id);

            await updateDoc(orderRef, {
                customer: {
                    email: this.formInfo.customer.email,
                    name: this.formInfo.customer.name
                },
                orderItems: this.formInfo.orderItems,
                orderNotes: this.formInfo.orderNotes,
                orderPrice: this.formInfo.orderPrice,
                orderStatus: Number(this.formInfo.orderStatus),
                paymentLink: this.formInfo.paymentLink,
                paymentMethod: this.formInfo.paymentMethod
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
                        title: "Error on getting image",
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

            if (confirm("This will permanently delete the entry and everything related to it. Do you want to proceed?")) {
                await deleteDoc(doc(db, `${this.formType}s`, this.formInfo.id));
                const photoRef = ref(storage, "images/" + `${this.formType}s` + "/" + this.formInfo.id + ".png");
                deleteObject(photoRef).then(() => {
                    remoteDirectory.splice(entryIndex, 1);
                    that.deleteNotification();
                }).catch((error) => {
                    notify({
                        title: 'Element deletion',
                        text: error,
                        type: 'error'
                    })
                });
            }
        },
        draggedMarker(newPosition) {
            this.$emit('dragged-marker', newPosition);
        },
        generateFirestoreId() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            return Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => chars[b % chars.length]).join('');
        },
        deleteNotification() {
            notify({
                title: 'Element deletion',
                text: 'The element was successfully deleted from the database.',
                type: 'success'
            });
        },
        updateNotification() {
            notify({
                title: "Update successful",
                text: "The database entry was successfully updated!",
                type: "success"
            });
        },
        updatePhotoNotification() {
            notify({
                title: "Photo update successful",
                text: "The item's photo was successfully updated!",
                type: "success"
            });
        },
        addNotification() {
            notify({
                title: "Creation successful",
                text: "The new item was successfully added to the database!",
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
    width: 20%;
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
