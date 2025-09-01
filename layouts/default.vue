<script setup lang="ts">
  import { useAppStore } from '~/store/appStore';
</script>

<template>
  <ClientOnly>
    <main>
      <slot />
    </main>
  </ClientOnly>
</template>

<style lang="scss" scoped></style>
