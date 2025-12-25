<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-2">
          <q-icon name="stacked_bar_chart" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Tableau de bord des réclamations</h1>
            <p class="text-gray-600 text-sm">Chronologie des tickets et durées par statut</p>
          </div>
        </div>
      </div>

      <!-- Toolbar Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <q-input outlined dense v-model="filters.date_from" type="date" label="Date début" class="min-w-[200px]" @update:model-value="loadData" />
            <q-input outlined dense v-model="filters.date_to" type="date" label="Date fin" class="min-w-[200px]" @update:model-value="loadData" />

            <q-select outlined dense v-model="filters.bticket_ids" :options="baseTickets" label="Type de réclamation"
              multiple emit-value map-options use-chips class="min-w-[280px]" @update:model-value="onSelectBaseTicket" />

            <q-select outlined dense v-model="filters.statuses" :options="statusOptions" label="Statuts"
              multiple emit-value map-options use-chips class="min-w-[280px]" @update:model-value="loadData" />

           </div>

          <div class="flex gap-3">
            <q-btn flat color="grey-8" no-caps class="px-6" label="Réinitialiser" :disable="loading" @click="resetFilters" />
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="timeline" class="text-indigo-600 mr-2" />
            <div class="text-lg font-semibold text-gray-800">Chronologie des réclamations</div>
          </div>
          <div class="text-sm text-gray-500">Chaque barre = 1 ticket. Segments = statuts.</div>
        </div>
        <div ref="chartRef" style="height: 600px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'
import { api } from 'src/boot/axios'
import * as echarts from 'echarts'

const $q = useQuasar()

const loading = ref(false)
const items = ref([])
const baseTickets = ref([])

const statusOptions = [
  { label: 'ouvert', value: 'ouvert' },
  { label: 'En attente', value: 'En attente' },
  { label: 'En cours', value: 'En cours' },
  { label: 'clôturé', value: 'clôturé' },
  { label: 'Recours', value: 'Recours' },
  { label: 'Recours clôturé', value: 'Recours clôturé' }
]

const filters = ref({
  date_from: '',
  date_to: '',
  statuses: [],
  bticket_ids: [],
  bticket_id: null,
  bticket_label: null
})

function resetFilters() {
  filters.value = { date_from: '', date_to: '', bticket_id: null, bticket_ids: [], bticket_label: null, statuses: [] }
  loadData()
}

async function loadData () {
  loading.value = true
  try {
    const params = {}
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    if (filters.value.statuses && filters.value.statuses.length > 0) params.statuses = filters.value.statuses
    if (filters.value.bticket_ids && filters.value.bticket_ids.length > 0) {
      params.bticket_ids = filters.value.bticket_ids
    } else if (filters.value.bticket_id) {
      params.bticket_id = filters.value.bticket_id
    }

    const { data } = await api.get('/api/rec/dashboard/timeline', { params })
    const payload = data?.data || {}
    const rawItems = payload.items
    items.value = Array.isArray(rawItems)
      ? rawItems
      : (rawItems && typeof rawItems === 'object' ? Object.values(rawItems) : [])

    const rawBaseTickets = payload.base_tickets
    baseTickets.value = Array.isArray(rawBaseTickets)
      ? rawBaseTickets.map(t => ({ label: t.libelle || `Ticket ${t.id}`, value: t.id }))
      : (rawBaseTickets && typeof rawBaseTickets === 'object'
          ? Object.values(rawBaseTickets).map(t => ({ label: t.libelle || `Ticket ${t.id}`, value: t.id }))
          : [])

  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur de chargement des tickets' })
  } finally {
    loading.value = false
  }
}

async function loadBaseTickets () {
  // Fallback: si la réponse API n’a pas fourni de base_tickets, reconstruire via items
  if (!baseTickets.value || baseTickets.value.length === 0) {
    const map = new Map()
    items.value.forEach(t => {
      const id = t?.bticket_id || t?.baseTicket?.id || null
      const label = t?.type_name || t?.baseTicket?.libelle || (id ? `Ticket ${id}` : null)
      if (label && id !== null && !map.has(id)) {
        map.set(id, label)
      }
    })
    baseTickets.value = Array.from(map.entries()).map(([value, label]) => ({ label, value }))
  }
}

function onSelectBaseTicket (val) {
  // val is now an array of ids for multi-select
  const arr = Array.isArray(val) ? val : (val != null ? [val] : [])
  filters.value.bticket_ids = arr
  // Clear single-select fallback when multi is used
  filters.value.bticket_id = arr.length === 1 ? arr[0] : null
  const labels = baseTickets.value.filter(o => arr.includes(o.value)).map(o => o.label)
  // Keep a single label for legacy client-side filter fallback only when one selected
  filters.value.bticket_label = labels.length === 1 ? labels[0] : null
}

function toTs (d) {
  if (!d) return null
  const x = dayjs(d)
  return x.isValid() ? x.valueOf() : null
}

const chartOptions = computed(() => ({
  chart: {
    stacked: false,
    toolbar: { show: true },
    animations: { enabled: true }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '70%',
      rangeBarGroupRows: true
    }
  },
  xaxis: {
    type: 'datetime',
    labels: { datetimeUTC: false }
  },
  yaxis: {
    labels: {
      minWidth: 160,
      maxWidth: 300,
      formatter: (val) => (typeof val === 'string' ? val.split('¬')[0].trim() : val)
    }
  },
  dataLabels: { enabled: false },
  legend: { position: 'bottom' },
  tooltip: {
    shared: false,
    x: { formatter: (val) => (typeof val === 'string' ? val.split('¬')[0].trim() : val) },
    custom: function({ seriesIndex, dataPointIndex, w }) {
      try {
        const name = w?.globals?.seriesNames?.[seriesIndex] || ''
        const pointCfg = w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex]
        const pointInit = w?.globals?.initialSeries?.[seriesIndex]?.data?.[dataPointIndex]
        const point = pointCfg ?? pointInit ?? {}
        const y = point?.y
        if (!Array.isArray(y) || y.length < 2) return `<div class="px-3 py-2 text-sm"><strong>Statut:</strong> ${name}</div>`
        const start = y[0]
        const end = y[1]
        const ms = Math.max(0, end - start)
        // Calcul lisible: jours, heures, minutes, secondes
        let rest = ms
        const d = Math.floor(rest / 86400000); rest %= 86400000
        const h = Math.floor(rest / 3600000); rest %= 3600000
        const m = Math.floor(rest / 60000); rest %= 60000
        const s = Math.floor(rest / 1000)
        const parts = []
        if (d > 0) parts.push(`${d} ${d > 1 ? 'jours' : 'jour'}`)
        if (h > 0) parts.push(`${h} ${h > 1 ? 'heures' : 'heure'}`)
        if (m > 0) parts.push(`${m} ${m > 1 ? 'minutes' : 'minute'}`)
        if (parts.length === 0) parts.push(s > 0 ? `${s} ${s > 1 ? 'secondes' : 'seconde'}` : '< 1 minute')
        const duree = parts.join(' ')
        // Récupération robuste des métadonnées
        const xVal = point?.x
        const firstSeg = (typeof xVal === 'string') ? (xVal.split('¬')[0] || '').trim() : ''
        const fromXObj = (typeof xVal === 'string' && xVal.includes('¬')) ? (xVal.split('¬')[2] || '').trim() : ''
        let typeLabel = point?.type || ''
        let ownerLabel = point?.owner || ''
        if ((!typeLabel || !ownerLabel) && firstSeg) {
          const dashParts = firstSeg.split('—')
          const parsedType = (dashParts[0] || '').trim()
          const parsedOwner = (dashParts[1] || '').trim()
          if (!typeLabel) typeLabel = parsedType
          if (!ownerLabel) ownerLabel = parsedOwner
        }
        const rawObj = point?.obj || fromXObj || ''
        const esc = (s) => String(s).replace(/[&<>\"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]))
        const typePart = typeLabel ? `<div><strong>Type:</strong> ${esc(typeLabel)}</div>` : ''
        const ownerPart = ownerLabel ? `<div><strong>Créateur:</strong> ${esc(ownerLabel)}</div>` : ''
        const objetPart = rawObj ? `<div class="text-xs text-gray-700 mt-1"><strong>Objet:</strong> ${esc(rawObj)}</div>` : ''
        const divider = `<div class="my-2 border-t border-gray-200"></div>`
        // Acteurs concernés selon le cas et la période de statut
        const renderList = (title, arr) => {
          const list = (Array.isArray(arr) ? arr : []).filter(x => !!x)
          if (list.length === 0) return ''
          const itemsHtml = list.map(v => `<li class="ml-4">• ${esc(v)}</li>`).join('')
          return `<div class="mt-1"><strong>${esc(title)}:</strong><ul class="mt-1">${itemsHtml}</ul></div>`
        }
        const pilotNormal = point?.pilot_direction || ''
        const treatDirs = Array.isArray(point?.treatment_directions) ? point.treatment_directions : []
        const consultDirs = Array.isArray(point?.consultation_directions) ? point.consultation_directions : []
        const pilotRecours = point?.recours_pilot || ''
        const commission = Array.isArray(point?.recours_commission) ? point.recours_commission : []

        let actorsHtml = ''
        if (name === 'Recours' || name === 'Recours clôturé') {
          const head = pilotRecours ? `<div><strong>Pilot du recours:</strong> ${esc(pilotRecours)}</div>` : ''
          actorsHtml = head + renderList('Membres de la commission de recours', commission)
        } else if (name === 'En cours') {
          const head = pilotNormal ? `<div><strong>Direction pilot:</strong> ${esc(pilotNormal)}</div>` : ''
          actorsHtml = head + renderList('Directions en traitement', treatDirs) + renderList('Directions en consultation', consultDirs)
        } else if (name === 'Ouvert' || name === 'En attente' || name === 'Clôturé') {
          // Pendant Ouvert / En attente / Clôturé, on ne montre que le pilot si disponible
          const head = pilotNormal ? `<div><strong>Direction pilot:</strong> ${esc(pilotNormal)}</div>` : ''
          actorsHtml = head
        }

        return `<div class=\"px-3 py-2 text-sm\"><div><strong>Statut:</strong> ${name}</div>${typePart}${ownerPart}${divider}<div><strong>Durée du statut:</strong> ${duree}</div>${objetPart}${divider}${actorsHtml}</div>`
      } catch (e) {
        return ''
      }
    }
  },
  colors: [
    '#1E88E5', // Ouvert
    '#FBC02D', // En attente
    '#43A047', // En cours
    '#757575', // Clôturé
    '#E53935', // Recours
    '#8E24AA'  // Recours clôturé
  ]
}))

const series = computed(() => {
  // Exclure toute réclamation non validée
  let base = (Array.isArray(items.value) ? items.value : []).filter(t => !!t?.date_validation_createur)

  // Fallback client-side filter by base tickets when backend filter not applied
  if (filters.value.bticket_ids && filters.value.bticket_ids.length > 0) {
    const set = new Set(filters.value.bticket_ids)
    base = base.filter(t => set.has(t?.bticket_id ?? t?.baseTicket?.id))
  } else if (!filters.value.bticket_id && filters.value.bticket_label) {
    base = base.filter(t => (t?.type_name || '').toLowerCase() === filters.value.bticket_label.toLowerCase())
  }

  const now = Date.now()

  function ticketLabel (t) {
    const type = t?.libelle || t?.type_name || 'Ticket'
    const owner = t?.owner_display || ''
    return owner ? `${type} — ${owner}` : `${type}`
  }
  function ticketLabelKey (t) {
    return `${ticketLabel(t)} ¬${t?.id} ¬${(t?.objet ?? '').toString().trim()}`
  }

  function makeDataForStatus (getRange) {
    return base.map(t => {
      const rng = getRange(t)
      const start = Array.isArray(rng) ? rng[0] : null
      const end = Array.isArray(rng) ? rng[1] : null
      if (!start || !end || end < start) return null
      return { x: ticketLabelKey(t), y: [start, end], obj: t?.objet ?? '', type: (t?.libelle || t?.type_name || 'Ticket'), owner: (t?.owner_display || ''), pilot_direction: t?.pilot_direction || null, treatment_directions: Array.isArray(t?.treatment_directions) ? t.treatment_directions : [], consultation_directions: Array.isArray(t?.consultation_directions) ? t.consultation_directions : [], recours_pilot: t?.recours_pilot || null, recours_commission: Array.isArray(t?.recours_commission) ? t.recours_commission : [] }
    }).filter(Boolean)
  }

  // Règles d’affichage normalisées
  const ouvert = makeDataForStatus(t => {
    const s = toTs(t?.created_at)
    const e = toTs(t?.date_validation_createur)
    if (!s || !e) return null
    return [s, e]
  })

  const attente = makeDataForStatus(t => {
    const s = toTs(t?.date_validation_createur)
    const e = t?.date_en_cours ? toTs(t?.date_en_cours) : now
    if (!s || !e) return null
    return [s, e]
  })

  const encours = makeDataForStatus(t => {
    // Afficher "En cours" uniquement si l’original date_en_cours existe
    if (!t?.date_en_cours) return null
    const s = toTs(t?.date_en_cours)
    const e = t?.closed_at ? toTs(t?.closed_at) : now
    if (!s || !e) return null
    return [s, e]
  })

  const cloture = makeDataForStatus(t => {
    // Segment de clôture seulement si closed_at existe
    const s = toTs(t?.closed_at)
    const e = toTs(t?.date_recours)
    if (!s) return null
    // Si pas de recours, cycle s’arrête à la clôture: afficher un marqueur court
    return [s, e || s]
  })

  const recours = makeDataForStatus(t => {
    const s = toTs(t?.date_recours)
    const e = t?.date_cloture_recours ? toTs(t?.date_cloture_recours) : now
    if (!s || !e) return null
    return [s, e]
  })

  const recoursCloture = makeDataForStatus(t => {
    // Afficher uniquement si la date de clôture du recours existe réellement
    const s = toTs(t?.date_cloture_recours)
    if (!s) return null
    return [s, s]
  })

  return [
    { name: 'Ouvert', data: ouvert },
    { name: 'En attente', data: attente },
    { name: 'En cours', data: encours },
    { name: 'Clôturé', data: cloture },
    { name: 'Recours', data: recours },
    { name: 'Recours clôturé', data: recoursCloture }
  ]
})

const chartRef = ref(null)
let chartInstance = null
let lastCategories = []
onMounted(() => {
  if (chartRef.value && !chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  loadData()
  loadBaseTickets()
})

// Auto resize on container size change
function handleResize () {
  if (chartInstance) chartInstance.resize()
}
window.addEventListener('resize', handleResize)

// Destroy chart on unmount
// onUnmounted(() => {
//   window.removeEventListener('resize', handleResize)
//   if (chartInstance) {
//     chartInstance.dispose()
//     chartInstance = null
//   }
// })

// Refresh chart when items change
watch(items, () => {
  renderChart()
})

watch(() => filters.value.bticket_ids, (val) => {
  if (Array.isArray(val)) {
    loadData()
  }
})

watch(() => filters.value.bticket_id, (val) => {
  if (val !== null && val !== undefined) {
    loadData()
  }
})

function buildEchartsOption () {
  const base = (Array.isArray(items.value) ? items.value : []).filter(t => !!t?.date_validation_createur)
  // Map tickets to categories
  const categories = base.map(t => (t?.owner_display ? `${t?.libelle || t?.type_name || 'Ticket'} — ${t.owner_display}` : (t?.libelle || t?.type_name || 'Ticket')))
  // Flatten segments
  const segments = []
  base.forEach((t, idx) => {
    const segs = Array.isArray(t?.segments) ? t.segments : []
    segs.forEach(s => {
      const start = dayjs(s.start).valueOf()
      const end = dayjs(s.end).valueOf()
      if (!start || !end || end < start) return
      segments.push({
        ticketIndex: idx,
        status: s.status,
        start,
        end,
        meta: {
          type: t?.libelle || t?.type_name || 'Ticket',
          owner: t?.owner_display || '',
          obj: t?.objet || '',
          pilot_direction: t?.pilot_direction || null,
          treatment_directions: Array.isArray(t?.treatment_directions) ? t.treatment_directions : [],
          consultation_directions: Array.isArray(t?.consultation_directions) ? t.consultation_directions : [],
          recours_pilot: t?.recours_pilot || null,
          recours_commission: Array.isArray(t?.recours_commission) ? t.recours_commission : []
        }
      })
    })
  })

  const colorMap = {
    'Ouvert': '#1E88E5',
    'En attente': '#FBC02D',
    'En cours': '#43A047',
    'Clôturé': '#757575',
    'Recours': '#E53935',
    'Recours clôturé': '#8E24AA'
  }

  const option = {
    animation: false,
    grid: { left: 180, right: 20, top: 80, bottom: 40 },
    xAxis: {
      type: 'time',
      axisLabel: { formatter: (value) => dayjs(value).format('DD/MM/YYYY') }
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { width: 160, overflow: 'truncate' }
    },
    toolbox: {
      show: true,
      right: 10,
      top: 0,
      feature: {
        dataZoom: { xAxisIndex: 0, yAxisIndex: 0 },
        brush: { type: ['rect', 'clear'] },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [
      { type: 'slider', yAxisIndex: 0, filterMode: 'weakFilter', right: 0 },
      { type: 'inside', yAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseWheel: true, moveOnMouseMove: true, preventDefaultMouseWheel: true },
      { type: 'slider', xAxisIndex: 0, filterMode: 'weakFilter', bottom: 10 },
      { type: 'inside', xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseWheel: true, moveOnMouseMove: true, preventDefaultMouseWheel: true }
    ],
    brush: {
      toolbox: ['rect', 'clear'],
      xAxisIndex: 'none',
      yAxisIndex: 0,
      brushMode: 'single',
      transformable: true,
      throttleType: 'debounce',
      throttle: 100
    },
    graphic: [
      (function() {
        const statusList = ['Ouvert','En attente','En cours','Clôturé','Recours','Recours clôturé']
        const children = []
        const itemWidth = 16
        const itemHeight = 16
        const gapX = 12
        const blockWidth = 100
        statusList.forEach((name, i) => {
          const x = i * blockWidth
          children.push(
            { type: 'rect', left: x, top: 0, shape: { x: 0, y: 0, width: itemWidth, height: itemHeight }, style: { fill: colorMap[name] || '#888888', stroke: '#cccccc' } },
            { type: 'text', left: x + itemWidth + 6, top: itemHeight - 2, style: { text: name, fill: '#333', fontSize: 12 } }
          )
        })
        return { type: 'group', right: 10, top: 36, children }
      })()
    ],
    tooltip: {
      trigger: 'item',
      renderMode: 'html',
      formatter: (params) => {
        const v = Array.isArray(params.value) ? params.value : []
        const start = v[1]
        const end = v[2]
        const status = v[3]
        const meta = v[4] || {}
        if (!start || !end) return ''
        const days = Math.max(0, (end - start) / 86400000)
        const daysInt = Math.round(days)
        const startStr = dayjs(start).format('DD/MM/YYYY HH:mm')
        const endStr = dayjs(end).format('DD/MM/YYYY HH:mm')
        const esc = (s) => String(s || '').replace(/[&<>\"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]))
        const typePart = meta.type ? `<div><strong>Type:</strong> ${esc(meta.type)}</div>` : ''
        const ownerPart = meta.owner ? `<div><strong>Créateur:</strong> ${esc(meta.owner)}</div>` : ''
        const objetPart = meta.obj ? `<div class="text-xs text-gray-700 mt-1"><strong>Objet:</strong> ${esc(meta.obj)}</div>` : ''
        const divider = `<div class="my-2 border-t border-gray-200"></div>`
        const renderList = (title, arr) => {
          const list = (Array.isArray(arr) ? arr : []).filter(x => !!x)
          if (list.length === 0) return ''
          const itemsHtml = list.map(v => `<li class="ml-4">• ${esc(v)}</li>`).join('')
          return `<div class="mt-1"><strong>${esc(title)}:</strong><ul class="mt-1">${itemsHtml}</ul></div>`
        }
        let actorsHtml = ''
        if (status === 'Recours' || status === 'Recours clôturé') {
          const head = meta.recours_pilot ? `<div><strong>Pilot du recours:</strong> ${esc(meta.recours_pilot)}</div>` : ''
          actorsHtml = head + renderList('Membres de la commission de recours', meta.recours_commission)
        } else if (status === 'En cours') {
          const head = meta.pilot_direction ? `<div><strong>Direction pilot:</strong> ${esc(meta.pilot_direction)}</div>` : ''
          actorsHtml = head + renderList('Directions en traitement', meta.treatment_directions) + renderList('Directions en consultation', meta.consultation_directions)
        } else if (status === 'Ouvert' || status === 'En attente' || status === 'Clôturé') {
          const head = meta.pilot_direction ? `<div><strong>Direction pilot:</strong> ${esc(meta.pilot_direction)}</div>` : ''
          actorsHtml = head
        }
        return `<div class=\"px-3 py-2 text-sm\"><div><strong>Statut:</strong> ${esc(status)}</div>${typePart}${ownerPart}${divider}<div><strong>Début:</strong> ${startStr}</div><div><strong>Fin:</strong> ${endStr}</div><div><strong>Durée (jours):</strong> ${daysInt}</div>${objetPart}${divider}${actorsHtml}</div>`
      }
    },
    series: [{
      type: 'custom',
      clip: true,
       renderItem: (params, api) => {
         const ticketIndex = api.value(0)
         const start = api.value(1)
         const end = api.value(2)
         const status = api.value(3)
         const meta = api.value(4)
         const categoryIndex = ticketIndex
         const startCoord = api.coord([start, categoryIndex])
         const endCoord = api.coord([end, categoryIndex])
         const height = api.size([0, 1])[1] * 0.6
         const x = startCoord[0]
         const y = startCoord[1] - height / 2
         const width = endCoord[0] - startCoord[0]
         return {
           type: 'rect',
           shape: { x, y, width, height },
           style: api.style({ fill: colorMap[status] || '#888888' })
         }
       },
       encode: { x: [1,2], y: 0 },
       data: segments.map(s => [s.ticketIndex, s.start, s.end, s.status, s.meta])
     }]
   }
  // Mémoriser les catégories pour le zoom vertical via brush (bar chart uniquement)
  lastCategories = categories
  return option
}

function renderChart () {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  const option = buildEchartsOption()
  chartInstance.setOption(option)
  // Double‑clic pour réinitialiser le zoom (Y uniquement)
  chartInstance.off('dblclick')
  chartInstance.on('dblclick', () => {
    try {
      chartInstance.dispatchAction({ type: 'dataZoom', start: 0, end: 100, yAxisIndex: 0 })
      chartInstance.dispatchAction({ type: 'dataZoom', start: 0, end: 100, xAxisIndex: 0 })
     } catch (e) {}
   })
  // Zoom par sélection rectangulaire (brush) sur Y uniquement
  chartInstance.off('brushSelected')
  chartInstance.on('brushSelected', (evt) => {
    try {
      const batch = Array.isArray(evt?.batch) ? evt.batch : []
      const area = batch[0]?.areas?.[0]
      const yr = area?.coordRange?.[1] // [yStart, yEnd] en indices/valeurs catégorie
      if (Array.isArray(yr) && yr.length === 2 && lastCategories.length > 0) {
        const startIdx = Math.max(0, Math.floor(yr[0]))
        const endIdx = Math.min(lastCategories.length - 1, Math.ceil(yr[1]))
        const startVal = lastCategories[startIdx]
        const endVal = lastCategories[endIdx]
        chartInstance.dispatchAction({ type: 'dataZoom', yAxisIndex: 0, startValue: startVal, endValue: endVal })
      }
    } catch (e) {}
  })
}
</script>