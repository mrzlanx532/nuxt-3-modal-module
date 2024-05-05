<script setup>
import { Modal } from '#components'
</script>

<template>
  <div>
    <slot />
    <Modal />
  </div>
</template>

<style scoped>
 div {
   height: 100%;
   width: 100%;
 }
</style>
