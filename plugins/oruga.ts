import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import '@oruga-ui/theme-bulma/dist/bulma.min.css'
import '@mdi/font/css/materialdesignicons.min.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Oruga, bulmaConfig)
})