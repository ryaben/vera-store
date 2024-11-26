<script setup>
import store from '../store.js';
import { db, storage } from '../firebase/init.js';
import { doc, updateDoc, setDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { notify } from "@kyvg/vue3-notification";
import SelectedValue from './SelectedValue.vue';
import TabSelector from './TabSelector.vue';

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
        <div class="form-view-container-left flex column x-centered y-centered">
            <button class="action-button corner-button" :class="{ 'disabled': !formInfo.id }"
                @click="deleteElement">❌</button>
            <label>{{ $t('panelForm.delete') }}</label>
        </div>
        <div class="form-view-container-right flex column x-centered y-centered">
            <button class="action-button corner-button" :class="{ 'selected': formAdd }"
                @click="toggleFormAdd">➕</button>
            <label>{{ $t('panelForm.new') }}</label>
        </div>

        <p class="id-title">
            {{ $t('panelForm.formTitle2') }}
            <br>
            <router-link v-if="!formAdd" class="bold" :to="'/store/' + formInfo.id">
                {{ formInfo.id }}
            </router-link>
            <span v-if="formAdd">{{ $t('panelForm.newID') }}</span>
        </p>

        <form class="flex column wide" @submit.prevent="formAdd ? createItem() : updateItem()">
            <p class="bold centered-text">{{ $t('panelForm.languageProfiles') }}</p>
            <TabSelector class="bottom-margin" :tab-list="getLocalesTabs()" :default-tab="'en'" :small="true"
                @tab-selected="selectTab" />
            <label class="flex wide x-centered bottom-margin" for="itemTitle">
                {{ $t('panelForm.title') }}&nbsp;
                <input v-model="formInfo.itemTitle[selectedLanguageProfile]" id="itemTitle" class="form-field"
                    type="text" required>
            </label>
            <label class="flex column wide y-centered bottom-margin">
                {{ $t('panelForm.categories') }}
                <div class="flex">
                    <input type="text" v-model="categoryValue" :placeholder="$t('panelForm.categoriesPlaceholder')">
                    <div class="action-button flex x-centered y-centered" style="margin-left: 10px;"
                        @click.native.stop="addValue(categoryValue, formInfo.itemCategories[selectedLanguageProfile]); categoryValue = ''">
                        {{
                            $t('panelForm.add') }}</div>
                </div>
                <div class="flex">
                    <SelectedValue class="selection top-margin"
                        v-for="(value, i) in formInfo.itemCategories[selectedLanguageProfile]" :key="i"
                        :lang-text="value"
                        @remove-value="removeValue(value, formInfo.itemCategories[selectedLanguageProfile])" />
                </div>
            </label>
            <div class="flex column wide y-centered">
                <div class="photos-container flex y-centered space-evenly">
                    <img v-for="(photo, i) in formInfo.itemPhoto" :key="i" class="item-photo" :src="photo" alt="Photo">
                </div>
                <input id="photoFile" type="file" @input="previewImage" accept="image" multiple>
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
            <div>

            </div>
            <label class="flex column wide y-centered">
                {{ $t('panelForm.shortDescription') }}
                <textarea rows="3" class="field-textarea" name="shortDescription"
                    v-model="formInfo.itemShortDescription[selectedLanguageProfile]"></textarea>
            </label>
            <label class="flex column wide y-centered top-margin bottom-margin">
                {{ $t('panelForm.longDescription') }}
                <textarea rows="6" class="field-textarea" name="longDescription"
                    v-model="formInfo.itemLongDescription[selectedLanguageProfile]"></textarea>
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
    </div>
</template>

<script>
export default {
    name: 'Panel Form',
    components: {
        SelectedValue, TabSelector
    },
    data() {
        return {
            categoryValue: "",
            formAdd: false,
            selectedLanguageProfile: 'en',
            photoSources: []
        }
    },
    methods: {
        previewImage(event) {
            if (event.target.files.length > 10) {
                return alert("Only 10 files accepted.");
            } else {
                const that = this;
                this.photoSources = [];
                let objectURLs = [];

                Array.from(event.target.files).forEach(photo => {
                    that.photoSources.push(photo);
                    objectURLs.push(URL.createObjectURL(photo));
                });

                this.formInfo.itemPhoto = objectURLs;
                this.formAdd === false ? this.updateItemPhoto() : console.log("Image not uploaded because it's new item.");
            }
        },
        selectTab(value) {
            this.selectedLanguageProfile = value;
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

            this.formInfo.itemPhoto.forEach(function (photo, index) {
                that.uploadPhoto(index, 'items/' + that.formInfo.id, index, function (fileName) {
                    that.generatePhotoReference(fileName, 'items/' + that.formInfo.id, async function (photoReference) {
                        await updateDoc(itemRef, {
                            itemPhoto: arrayUnion(photoReference)
                        });
                    });
                });
            });

            this.updatePhotoNotification();
        },
        async createItem() {
            const that = this;
            const autoID = this.generateFirestoreId();
            const itemRef = doc(db, "items", autoID);

            await setDoc(doc(db, "items", autoID), {
                itemAvailability: that.formInfo.itemAvailability,
                itemCategories: that.formInfo.itemCategories,
                itemLongDescription: that.formInfo.itemLongDescription,
                itemPhoto: [],
                itemOnSale: that.formInfo.itemOnSale,
                itemHidden: that.formInfo.itemHidden,
                itemPrice: that.formInfo.itemPrice,
                itemPriceSale: that.formInfo.itemPriceSale,
                itemShortDescription: that.formInfo.itemShortDescription,
                itemTitle: that.formInfo.itemTitle
            });

            this.formInfo.itemPhoto.forEach(function (photo, index) {
                that.uploadPhoto(index, 'items/' + autoID, index, function (fileName) {
                    that.generatePhotoReference(fileName, 'items/' + autoID, async function (photoReference) {
                        await updateDoc(itemRef, {
                            itemPhoto: arrayUnion(photoReference)
                        });
                    });
                });
            });

            this.addNotification();
        },
        async uploadPhoto(fileName, folder, index, callback) {
            const storage = getStorage();
            const storageRef = ref(storage, 'images/' + folder + '/' + fileName + '.png');

            uploadBytes(storageRef, this.photoSources[index]).then((snapshot) => {
                console.log('Photo file uploaded with ID ' + fileName);
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
            const photosAmount = this.formInfo.itemPhoto.length;

            if (confirm(this.$t("panelForm.deleteEntry"))) {
                await deleteDoc(doc(db, 'items', this.formInfo.id));

                for (let index = 0; index < photosAmount; index++) {
                    const photoRef = ref(storage, "images/items/" + this.formInfo.id + "/" + index + ".png");

                    deleteObject(photoRef)
                        .then(() => {
                            if (index === photosAmount.length - 1) return that.deleteNotification();
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
        getLocalesTabs() {
            let localesTabs = [];

            this.$i18n.availableLocales.forEach(locale => {
                localesTabs.push({
                    identifier: locale,
                    tabTitle: locale.toUpperCase()
                })
            });

            return localesTabs;
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

#photoFile {
    width: fit-content;
}

.submit-button {
    width: 60%;
    margin: 20px auto 0 auto;
}

.photos-container {
    width: 80%;
    min-height: 96px;
    padding: 5px;
    flex-wrap: nowrap;
    border: 2px solid var(--light-main-palette);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow-x: auto;
    margin-bottom: 5px;
}

.item-photo {
    width: 96px;
    border-radius: 6px;
    margin-right: 4px;
    cursor: pointer;
}

.item-photo:last-of-type {
    margin-right: 0;
}

.item-photo.main {
    position: relative;
    outline: 3px solid var(--intense-main-palette);
}

.item-photo.main::after {
    position: absolute;
    content: 'Main photo';
    width: min-content;
    height: min-content;
    top: 0;
    left: 0;
}

.field-textarea {
    width: 70%;
    overflow-y: scroll;
}
</style>
