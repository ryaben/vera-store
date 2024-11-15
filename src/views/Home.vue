<script setup>
import 'vue-flux/style.css';
import { shallowReactive } from 'vue';
import { VueFlux, FluxCaption, FluxControls, FluxIndex, FluxPagination, FluxPreloader, Img, Fade } from 'vue-flux';
import LanguageSelector from '../components/LanguageSelector.vue';
import { useWindowSize } from 'vue-window-size';
const { width } = useWindowSize();
const windowWidth = width;
</script>

<template>
    <section class="page-section">
        <div class="content-container flex x-centered y-centered"
            :class="{ 'column': windowWidth < 1050, 'space-evenly': windowWidth > 1050 }">
            <VueFlux class="bottom-margin" :options="galleryOptions" :rscs="galleryImages"
                :transitions="shallowReactive([Fade])">
                <template #preloader="preloaderProps">
                    <FluxPreloader v-bind="preloaderProps" />
                </template>
                <template #caption="captionProps">
                    <FluxCaption v-bind="captionProps" />
                </template>
                <template #controls="controlsProps">
                    <FluxControls v-bind="controlsProps" />
                </template>
                <template #pagination="paginationProps">
                    <FluxPagination v-bind="paginationProps" />
                </template>
                <template #index="indexProps">
                    <FluxIndex v-bind="indexProps" />
                </template>
            </VueFlux>
            <div class="texts-container flex column y-centered" :class="{ 'top-margin': windowWidth < 1050 }">
                <LanguageSelector :title-value="true" :transparent="true" />
                <p class="home-text wide">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim
                    metus. Donec augue elit, rhoncus ac sodales id, porttitor vitae est. Donec laoreet rutrum libero sed
                    pharetra.
                    Duis a arcu convallis, gravida purus eget, mollis diam. Praesent non urna non mauris laoreet
                    ultricies eget
                    at enim. Phasellus lacus odio, ullamcorper ac ipsum in, tincidunt tincidunt massa. Suspendisse ut
                    malesuada sapien, vitae mollis diam.
                    <br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim
                    metus. Donec augue elit, rhoncus ac sodales id, porttitor vitae est. Donec laoreet rutrum libero sed
                    pharetra.
                    Duis a arcu convallis, gravida purus eget, mollis diam. Praesent non urna non mauris laoreet
                    ultricies eget
                    at enim. Phasellus lacus odio, ullamcorper ac ipsum in, tincidunt tincidunt massa. Suspendisse ut
                    malesuada sapien, vitae mollis diam.
                </p>
                <router-link class="action-button large flex x-centered y-centered top-margin bottom-margin" :to="{ name: 'Store' }">
                    {{ $t("home.store") }}
                </router-link>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Home',
    components: {
        LanguageSelector
    },
    data() {
        return {
            galleryImages: shallowReactive([
                new Img('/img/photo1.png', 'Photo 1'),
                new Img('/img/photo2.png', 'Photo 2')
            ]),
            galleryOptions: {
                autoplay: true,
                autohideTime: 1500,
                delay: 10000
            }
        }
    }
}
</script>

<style scoped>
.content-container {
    /* padding: 0 0 0 1.5%; */
}

.vue-flux {
    width: 95%;
    height: 300px;
}

.home-text {
    width: 95%;
    margin: 10px auto auto auto;
}

div.multiselect.language-selector {
    width: 100%;
}

@media (prefers-color-scheme: light) {}

@media only screen and (max-width: 750px) {
    .home-text {
        width: 95%;
    }
}

@media only screen and (min-width: 750px) {
    .vue-flux {
        width: 60%;
        max-width: 650px;
        height: 430px;
    }
}

@media only screen and (min-width: 1050px) {
    .vue-flux {
        width: 50%;
        height: 450px;
    }

    .texts-container {
        width: 45%;
    }
}
</style>
