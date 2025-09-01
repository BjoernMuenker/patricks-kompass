<template>
  <button><slot></slot></button>
</template>

<style lang="scss" scoped>
  button {
    border: 3px solid white;
    padding: 14px 20px;
    text-transform: uppercase;
    font-variation-settings: 'wght' 500, 'wdth' 60;
  }
</style>
