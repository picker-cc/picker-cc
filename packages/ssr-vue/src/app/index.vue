<template>
  <div v-cloak class="app-root">
      Hello world!
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'App',
    components: {
    },
    setup() {
      // const { isMobile } = useEnhancer()
      // return { isMobile }
    }
  })
</script>

<style lang="scss">
  .app-root {
    &[v-cloak] {
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
  }
</style>
