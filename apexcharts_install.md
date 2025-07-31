# Installation ApexCharts pour Vue 3 + Quasar

## Installation via npm

```bash
npm install vue3-apexcharts apexcharts
```

## Configuration dans quasar.config.js

Ajouter dans `build.vitePlugins` :

```javascript
// quasar.config.js
module.exports = configure(function (ctx) {
  return {
    // ...
    build: {
      vitePlugins: [
        // ... autres plugins
      ]
    },
    // ...
  }
})
```

## Configuration globale (optionnelle)

Si vous voulez enregistrer ApexCharts globalement, ajoutez dans `src/boot/apexcharts.js` :

```javascript
import { boot } from 'quasar/wrappers'
import VueApexCharts from 'vue3-apexcharts'

export default boot(({ app }) => {
  app.component('apexchart', VueApexCharts)
})
```

Et dans `quasar.config.js` :

```javascript
boot: [
  'axios',
  'apexcharts' // ajouter cette ligne
]
```

## Usage dans les composants

```vue
<template>
  <apexchart
    type="bar"
    height="300"
    :options="chartOptions"
    :series="chartSeries"
  />
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts'
const apexchart = VueApexCharts
</script>
```

## Vérification

Après installation, redémarrez le serveur de développement :

```bash
npm run dev
```