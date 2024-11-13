<script setup>
import { MapboxMap, MapboxMarker, MapboxNavigationControl, MapboxGeolocateControl } from '@studiometa/vue-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

defineProps({
    visible: {
        type: Boolean,
        required: false,
        default: true
    },
    width: {
        type: String,
        required: true,
        default: '100%'
    },
    height: {
        type: String,
        required: true,
        default: '200px'
    },
    mode: {
        type: String,
        require: true,
        default: 'picker'
    },
    collection: {
        type: Array,
        require: false,
        default: []
    },
    markerPosition: {
        type: Array,
        require: false,
        default: [-58.4360043295337, -34.60653558169007]
    }
});
</script>

<template>
    <div class="mapbox-container" :style="{ 'height': height, 'width': width }" :class="{ 'hidden': !visible }">
        <MapboxMap :style="{ 'width': '100%', 'height': 'auto' }" :access-token="mapboxToken" ref="mapbox"
            map-style="mapbox://styles/ramayaben/cm2c8ni72001l01ql451q8xoc"
            @mb-created="(mapboxInstance) => map = mapboxInstance">

            <MapboxMarker v-if="mode === 'picker'" id="mapboxMarker" :color="'#000'" :lng-lat="markerPosition" popup
                draggable @mb-dragend="updatePosition">
                <template v-slot:popup>
                    <p style="color: black; font-size: 12px; text-align: center;">
                        {{ $t('mapboxMap.partnerLocation') }}
                    </p>
                </template>
            </MapboxMarker>

            <MapboxMarker v-if="mode === 'locationMap'" v-for="(marker, i) in collection" :key="i"
                :lng-lat="[marker.partnerLocation.longitude, marker.partnerLocation.latitude]" :color="'#000'" popup>
                <template v-slot:popup>
                    <p class="marker-name centered-text bold">{{ marker.partnerPropertyName }}</p>
                    <p class="marker-address centered-text">{{ marker.partnerAddress }}</p>
                    <label v-if="!marker.partnerActivity" class="negative-text small-text">
                        {{ $t('mapboxMap.currentlyUnavailable') }}
                    </label>
                    <div v-if="selectedHost !== i" class="action-button flex x-centered y-centered"
                        :class="{ 'disabled': !marker.partnerActivity }" @click="selectHost(i, marker.id)">
                        {{ $t('mapboxMap.select') }}
                    </div>
                    <label v-if="selectedHost === i" class="selected bold positive-text">{{ $t('mapboxMap.selected') }}</label>
                </template>
            </MapboxMarker>

            <MapboxNavigationControl position="bottom-right" />
            <MapboxGeolocateControl position="top-right" />
        </MapboxMap>
    </div>
</template>

<script>
export default {
    name: 'MapboxMap',
    components: {

    },
    data: () => {
        return {
            layerOptions: {},
            selectedHost: undefined
        };
    },
    methods: {
        updatePosition(e) {
            this.$emit('dragged-marker', [e.target._lngLat.lat, e.target._lngLat.lng]);
        },
        selectHost(index, markerID) {
            this.selectedHost = index;
            this.$emit('host-selected', markerID);
        }
    }
}
</script>

<style scoped>
.mapbox-container {
    display: flex;
    justify-content: center;
    min-width: 240px;
    max-width: 700px;
    border: 1px solid var(--white);
    border-radius: 1px;
}

.mapbox-container.hidden {
    display: none;
}

.marker-name {
    color: var(--black);
    margin-bottom: 3px;
}

.marker-address {
    color: var(--black);
    font-size: 12px;
}

.action-button {
    width: min-content;
    padding: 0 8px;
}

label.selected {
    font-size: 14px;
}

@media (prefers-color-scheme: light) {
    .mapbox-container {
        border-color: var(--black);
    }
}
</style>