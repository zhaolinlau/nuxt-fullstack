import Buefy from '@ntohq/buefy-next';
import '@ntohq/buefy-next/dist/buefy.css';
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Buefy)
})