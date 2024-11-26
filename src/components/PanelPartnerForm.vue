<script setup>
import store from '../store.js';
import { db } from '../firebase/init.js';
import { doc, updateDoc, addDoc, deleteDoc, collection, GeoPoint } from "firebase/firestore";
import { notify } from "@kyvg/vue3-notification";
import MapboxMap from '../components/MapboxMap.vue';

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
            {{ $t('panelForm.formTitle3') }}
            <br>
        <p v-if="!formAdd" class="bold" style="margin-bottom: 0;">
            {{ formInfo.id }}
        </p>
        <span v-if="formAdd">{{ $t('panelForm.newID') }}</span>
        </p>

        <form class="flex column wide" @submit.prevent="formAdd ? createPartner() : updatePartner()">
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
            formAdd: false
        }
    },
    methods: {
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
        toggleFormAdd() {
            this.formAdd = !this.formAdd;
        },
        async deleteElement() {
            if (confirm(this.$t("panelForm.deleteEntry"))) {
                await deleteDoc(doc(db, 'partners', this.formInfo.id));
                this.deleteNotification();
            }
        },
        draggedMarker(newPosition) {
            this.$emit('dragged-marker', newPosition);
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

#currencySelector {
    font-size: 16px;
    height: 25px;
    width: 60px;
}
</style>
