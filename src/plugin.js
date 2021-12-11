import VSComponentWrapper from '@/components/VSComponentWrapper.vue'

export default {
  install (Vue, opts = {}) {
    Vue.component('VSComponentWrapper', VSComponentWrapper)
  }
}
