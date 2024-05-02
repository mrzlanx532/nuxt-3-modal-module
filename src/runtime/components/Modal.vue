<script setup>
import { watch, ref, defineAsyncComponent, onMounted, getCurrentInstance } from 'vue'
import { useNuxtApp } from '#imports'

const { $modal } = useNuxtApp()

onMounted(() => {
  $modal.setInstance(getCurrentInstance())
})

const modalContentComponentFilename = ref(null)
const modalContentComponent = ref(null)
const isPreset = ref(false)
const modalContainerClassModifier = ref(null)
const modalContentComponentProps = ref({})

watch(modalContentComponentFilename, (name) => {
  if (name === null) {
    modalContentComponent.value = null
    window.onscroll = function () {}
    return
  }

  try {
    if (!isPreset.value) {
      const dynamicComponent = defineAsyncComponent(async () => {
        return new Promise((resolve) => {
          resolve(`@/modals/${name}`)
        })
      })

      console.log(dynamicComponent)

      this.modalContainerClassModifier = dynamicComponent.default?.parentClassModifier
      this.modalContentComponent = dynamicComponent.default

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop)
      }
    }
  }
  catch (e) {
    console.error(e)
  }
})

function onOverlayClick() {
  this.modalContentComponentFilename = null
  this.$emit('modal:close')
}

function onResolve(payload) {
  this.modalContentComponentFilename = null
  this.$emit('modal:close')

  this.resolve(payload)
}

function onReject(payload) {
  this.modalContentComponentFilename = null
  this.$emit('modal:close')

  this.reject(payload)
}
</script>

<template>
  <div
    v-if="modalContentComponentFilename"
    class="modal"
  >
    <div
      class="modal__overlay"
      @click="onOverlayClick"
    />
    <div
      :class="['modal__container', modalContainerClassModifier]"
      @click.stop
    >
      <component
        :is="modalContentComponent"
        :data="modalContentComponentProps"
        @modal:close="onOverlayClick"
        @modal:resolve="onResolve"
        @modal:reject="onReject"
      />
    </div>
  </div>
</template>
