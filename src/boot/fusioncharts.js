import { boot } from 'quasar/wrappers';
import VueFusionChartsComponent from 'vue-fusioncharts/component';
import FusionCharts from 'fusioncharts';
import  Gantt from "fusioncharts/fusioncharts.gantt";
import Charts from 'fusioncharts/fusioncharts.charts';

export default boot(({ app }) => {
  const VueFusionCharts = VueFusionChartsComponent(FusionCharts, Charts, Gantt);
  app.component('fusioncharts', VueFusionCharts);

});
