import ECharts from 'vue-echarts'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.use(ECharts)
})
