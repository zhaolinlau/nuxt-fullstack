import Buefy from '@ntohq/buefy-next';
import '@/assets/custom.scss';
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Buefy)
})