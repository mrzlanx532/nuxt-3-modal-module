import { defineNuxtPlugin } from '#app'

class ModalManager {
  public modalContentComponentFilename = null
  public modalContentComponentProps = null
  public isPreset = null

  #load(name: string, props = {}, isPreset = false) {

    const promise = new Promise((resolve, reject) => {
      //this.instance.resolve = resolve
      //this.instance.reject = reject
    })

    if (
      this.modalContentComponentFilename === null ||
      this.modalContentComponentProps === null ||
      this.isPreset === null
    ) {
      throw new Error()
    }

    this.modalContentComponentFilename.value = name
    this.modalContentComponentProps.value = props
    this.isPreset.value = isPreset

    return promise
  }

  confirm(props = {}) {
    return this.#load('confirm', props, true)
  }

  load(name: string, props = {}) {
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
