<script setup lang="ts">
import { watch, ref, defineAsyncComponent, onMounted, defineEmits, getCurrentInstance, shallowRef } from 'vue'
import { useNuxtApp } from '#imports'

const componentFilename = ref(null)
const component = shallowRef(null)
const isPreset = ref(false)
const modalContainerClassModifier = ref(null)
const componentProps = ref({})

const { $modal } = useNuxtApp()

onMounted(() => {
  $modal.componentFilename = componentFilename
  $modal.componentProps = componentProps
  $modal.isPreset = isPreset
  $modal.instance = getCurrentInstance()
})

watch(componentFilename, (name) => {

  if (name === null) {
    component.value = null
    window.onscroll = function () {}
    return
  }

  try {
    const dynamicComponent = defineAsyncComponent( () => isPreset.value ? import(`./presets/${name}.vue`) : import(`@/modals/${name}.vue`))

    modalContainerClassModifier.value = dynamicComponent?.parentClassModifier
    component.value = dynamicComponent

    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft

    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop)
    }
  }
  catch (e) {
    console.error(e)
  }
})

const emit = defineEmits(['modal:close'])

const onOverlayClick = () => {
  componentFilename.value = null
  emit('modal:close')
}

const onResolve = (payload: unknown) => {

  componentFilename.value = null
  emit('modal:close')

  $modal.instance.resolve(payload)
}

const onReject = (payload: unknown) => {
  componentFilename.value = null
  emit('modal:close')

  $modal.instance.reject(payload)
}
</script>

<template>
  <teleport to="#teleports">
    <div
      v-if="componentFilename"
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
          :is="component"
          :data="componentProps"
          @modal:close="onOverlayClick"
          @modal:resolve="onResolve"
          @modal:reject="onReject"
        />
      </div>
    </div>
  </teleport>
</template>
