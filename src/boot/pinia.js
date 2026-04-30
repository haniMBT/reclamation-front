import { boot } from 'quasar/wrappers'
import {createPinia} from "pinia";



// register VueFusionCharts component


export default boot(({ app }) => {

  const pinia = createPinia()
  app.use(pinia)


})


