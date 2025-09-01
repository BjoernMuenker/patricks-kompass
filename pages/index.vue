<script setup lang="ts">
  import AppButton from '~/components/AppButton.vue';
</script>

<template>
  <div class="wrapper">Hello</div>
</template>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: spacing('xl');
    text-align: center;
    text-transform: uppercase;
    font-size: 100px;
    font-variation-settings: 'wght' 500, 'wdth' 50;
  }

  a {
    padding: 15px 30px;
    border: 6px solid white;

    &:hover {
      color: color('dark');
      background: white;
    }
  }
</style>
