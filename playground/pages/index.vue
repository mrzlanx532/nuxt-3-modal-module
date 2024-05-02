<script setup lang="ts">
import { useNuxtApp } from '#app'

const { $modal } = useNuxtApp()

definePageMeta({
  layout: 'default',
})

async function openModal() {
  await $modal.load('ExampleModal')
}
</script>

<template>
  <div>
    <button type="button" @click="openModal">Открыть модалку</button>
  </div>
</template>
