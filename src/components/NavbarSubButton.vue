<script setup>
defineProps({
  text: {
    type: String,
    required: true,
    default: 'Home'
  },
  route: {
    type: String,
    required: true,
    default: 'Home'
  }
})
</script>

<template>
  <router-link class="subbutton-router-link color-transition" :to="{ name: route }">
    <p class="subbutton-text">{{ text }}</p>
  </router-link>
</template>

<script>
export default {
  name: 'NavbarSubButton',
  data: () => {
    return {
    }
  }
}
</script>

<style scoped>
.subbutton-router-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: fit-content;
  color: var(--white-soft);
  background-color: var(--intense-main-palette);
  border: 2px solid var(--white-soft);
  z-index: 100;
}

.subbutton-router-link:not(:last-of-type ) {
  border-bottom: none;
}

.subbutton-router-link.router-link-active, .subbutton-router-link:hover {
  background-color: var(--reddish-main-palette);
  color: var(--black-soft);
}

.subbutton-text {
  text-align: center;
  margin: 4px auto 4px auto;
}
</style>
