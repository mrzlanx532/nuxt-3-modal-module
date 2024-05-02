<script setup>
import { watch, ref, defineAsyncComponent, onMounted, defineEmits } from 'vue'
import { useNuxtApp } from '#imports'

const modalContentComponentFilename = ref(null)
const modalContentComponent = shallowRef(null)
const isPreset = ref(false)
const modalContainerClassModifier = ref(null)
const modalContentComponentProps = ref({})

const { $modal } = useNuxtApp()

onMounted(() => {
  $modal.modalContentComponentFilename = modalContentComponentFilename
  $modal.modalContentComponentProps = modalContentComponentProps
  $modal.isPreset = isPreset
})

watch(modalContentComponentFilename, (name) => {

  if (name === null) {
    modalContentComponent.value = null
    window.onscroll = function () {}
    return
  }

  try {

    if (!isPreset.value) {
      const dynamicComponent = defineAsyncComponent( () => import(`@/modals/${name}.vue`))

      modalContainerClassModifier.value = dynamicComponent?.parentClassModifier
      modalContentComponent.value = dynamicComponent

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

const emit = defineEmits(['modal:close'])

function onOverlayClick() {
  modalContentComponentFilename.value = null
  emit('modal:close')
}

function onResolve(payload) {
  modalContentComponentFilename.value = null
  emit('modal:close')

  this.resolve(payload)
}

function onReject(payload) {
  modalContentComponentFilename.value = null
  emit('modal:close')

  this.reject(payload)
}
</script>

<template>
  <teleport to="#teleports">
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
  </teleport>
</template>
