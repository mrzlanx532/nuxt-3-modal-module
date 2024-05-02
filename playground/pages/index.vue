<script setup lang="ts">
import { useNuxtApp } from '#app'

const { $modal } = useNuxtApp()

definePageMeta({
  layout: 'default',
})

function openModal() {
  $modal.load('ExampleModal.vue')
}
</script>

<template>
  <div @click="openModal">
    Page 1
  </div>
</template>
