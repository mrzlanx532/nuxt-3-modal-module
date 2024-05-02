import { defineNuxtModule, addPlugin, createResolver, addComponent } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-3-modal-module',
    configKey: 'modal',
  },
  defaults: {},
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    await addComponent({
      name: 'Modal',
      filePath: resolver.resolve('./runtime/components/Modal.vue'),
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
