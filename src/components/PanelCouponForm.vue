<script setup>
import store from '../store.js';
import { db, storage } from '../firebase/init.js';
import { doc, updateDoc, setDoc, addDoc, deleteDoc, collection, GeoPoint } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { notify } from "@kyvg/vue3-notification";
import MapboxMap from '../components/MapboxMap.vue';
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
            {{ $t('panelForm.formTitle4') }}
            <br>
        <p v-if="!formAdd" class="bold" style="margin-bottom: 0;">
            {{ formInfo.id }}
        </p>
        <span v-if="formAdd">{{ $t('panelForm.newID') }}</span>
        </p>

        <form class="flex column wide" @submit.prevent="formAdd ? createCoupon() : updateCoupon()">
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
                    <label class="flex wide x-centered bottom-margin" for="couponMaximumDiscount">
                        {{ $t('panelForm.maximumDiscount') }}&nbsp;
                        <input v-model="formInfo.couponMaximumDiscount" id="couponMaximumDiscount"
                            class="form-field number" min="0" type="number" required>
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
        MapboxMap, SelectedValue, TabSelector
    },
    data() {
        return {
            couponApplyValue: "",
            formAdd: false
        }
    },
    methods: {
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
        toggleFormAdd() {
            this.formAdd = !this.formAdd;
        },
        async deleteElement() {
            if (confirm(this.$t("panelForm.deleteEntry"))) {
                await deleteDoc(doc(db, 'coupons', this.formInfo.id));
                this.deleteNotification();
            }
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

.submit-button {
    width: 60%;
    margin: 20px auto 0 auto;
}

.field-textarea {
    width: 70%;
    overflow-y: scroll;
}
</style>
