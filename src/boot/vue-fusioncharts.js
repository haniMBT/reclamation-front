import  VueFusionCharts from "vue-fusioncharts";
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.use(VueFusionCharts)
})
