<script setup>
import AnimateHeight from 'vue-animate-height';

defineProps({
  boxTitle: {
    type: String,
    required: true,
    default: "root"
  },
  boxContent: {
    type: String,
    required: true,
    default: "content"
  }
})
</script>

<template>
  <div class='dropdown-box'>
    <h2 class="box-title bold" :class="{ 'active': contentHeight === 'auto' }" @click="updateHeight">{{ boxTitle }}</h2>
    <AnimateHeight :duration="300" :height="contentHeight" :animate-opacity="true">
      <p class="box-content">{{ boxContent }}</p>
    </AnimateHeight>
  </div>
</template>

<script>
export default {
  components: {
    AnimateHeight
  },
  data() {
    return {
      contentHeight: 0
    }
  },
  methods: {
    updateHeight() {
      return this.contentHeight = this.contentHeight === 0 ? 'auto' : 0;
    },
  }
}
</script>

<style scoped>
.dropdown-box {
  width: 93%;
  max-width: 800px;
  border: 3px solid var(--soft-main-palette);
  border-radius: 8px;
  margin-block-end: 0;
  margin-block-start: 0;
  padding-inline-start: 0;
  margin: 0 auto 10px auto;
  padding: 3px;
}

.box-title {
  padding: 6px;
  margin: 4px;
  min-height: 22px;
  font-size: 16px;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
}

.box-title:hover, .box-title.active {
  background-color: var(--soft-main-palette);
  color: var(--white-soft);
  transition: 200ms;
  cursor: pointer;
}

.box-content {
  font-size: 14px;
  margin: 0 4px 4px 4px;
  padding: 6px;
}

@media only screen and (min-width: 1050px) {
  .dropdown-box {
    width: 75%;
  }

  .box-title {
    font-size: 20px;
  }

  .box-content {
    font-size: 16px;
  }
}
</style>
