import { defineNuxtPlugin } from '#app'

class ModalManager {
  constructor() {
    this.instance = null
  }

  setInstance(instance) {
    this.instance = instance
  }

  getComponentData() {
    return {
      extends: Modal,
      created() {
        Vue.prototype.$modal.setInstance(this)
      },
    }
  }

  #load(name, props = {}, isPreset = false) {
    const promise = new Promise((resolve, reject) => {
      this.instance.resolve = resolve
      this.instance.reject = reject
    })

    this.instance.modalContentComponentProps = props
    this.instance.modalContentComponentFilename = name
    this.instance.isPreset = isPreset

    return promise
  }

  confirm(props = {}) {
    return this.#load('confirm', props, true)
  }

  load(name, props = {}) {
    return this.#load(name, props)
  }
}

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      modal: new ModalManager(),
    },
  }
})
