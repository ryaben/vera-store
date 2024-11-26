<script setup>
import VueToggle from "vue-toggle-component";
</script>

<template>
  <VueToggle name="darkMode" :title="$t('desktopFooter.darkMode')" active-color="var(--reddish-main-palette)"
    font-size="16px" :toggled="darkMode" @toggle="toggleDarkMode" ref="darkModeToggle" />
</template>

<script>
export default {
  name: "Dark Mode Toggle",
  components: {
    VueToggle
  },
  emits: ['darkModeToggled'],
  data() {
    return {
      darkMode: false
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;

      if (this.darkMode) {
        this.$emit("darkModeToggled", true);
      } else {
        this.$emit("darkModeToggled", false);
      }

      this.saveDarkModeOption();
    },
    saveDarkModeOption() {
      return localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    },
    loadDarkModeOption() {
      return JSON.parse(localStorage.getItem('darkMode'));
    }
  },
  mounted() {
    try {
      this.darkMode = this.loadDarkModeOption();
    } catch {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.toggleDarkMode();
        this.$refs.darkModeToggle.toggleState = true;
      } else {
        this.$emit("darkModeToggled", false);
      }
    }
  }
}
</script>

<style scoped></style>
