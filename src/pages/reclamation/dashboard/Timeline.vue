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
            <q-input outlined dense v-model="filters.date_from" type="date" label="Date début" class="min-w-[200px]" />
            <q-input outlined dense v-model="filters.date_to" type="date" label="Date fin" class="min-w-[200px]" />

            <q-select outlined dense v-model="filters.statuses" :options="availableStatuses" label="Statuts"
              use-chips multiple emit-value map-options class="min-w-[260px]" />

            <q-select outlined dense v-model="filters.direction" :options="directions" label="Direction / Service"
              emit-value map-options class="min-w-[240px]" />

            <q-select outlined dense v-model="filters.type_id" :options="types" label="Type de réclamation"
              emit-value map-options class="min-w-[240px]" />

            <q-select outlined dense v-model="filters.recours" :options="recoursOptions" label="Recours"
              emit-value map-options class="min-w-[200px]" />
          </div>

          <div class="flex gap-3">
            <q-btn icon="tune" color="blue-6" no-caps :loading="loading" class="px-6" label="Appliquer les filtres" @click="loadData" />
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
        <apexchart type="rangeBar" height="600" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'
import { api } from 'src/boot/axios'

const $q = useQuasar()

const loading = ref(false)
const items = ref([])
const availableStatuses = ref([])
const directions = ref([])
const types = ref([])

const recoursOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Avec recours', value: 'with' },
  { label: 'Sans recours', value: 'without' }
]

const filters = ref({
  date_from: '',
  date_to: '',
  statuses: [],
  direction: null,
  type_id: null,
  recours: 'all'
})

function resetFilters() {
  filters.value = { date_from: '', date_to: '', statuses: [], direction: null, type_id: null, recours: 'all' }
  loadData()
}

async function loadData () {
  loading.value = true
  try {
    const params = {}
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    if (filters.value.statuses && filters.value.statuses.length) params.statuses = filters.value.statuses.join(',')
    if (filters.value.direction) params.direction = filters.value.direction
    if (filters.value.type_id) params.type_id = filters.value.type_id

    const { data } = await api.get('/api/rec/tickets/indexAll', { params })
    const payload = data?.data || {}
    items.value = (payload.items || [])
    availableStatuses.value = (payload.available_statuses || []).map(s => ({ label: s, value: s }))

    // Collecter les directions et types depuis les items
    const dirSet = new Set()
    const typeMap = new Map()
    items.value.forEach(t => {
      if (t?.direction) dirSet.add(t.direction)
      if (Array.isArray(t.types)) {
        t.types.forEach(tp => {
          const id = tp?.b_rec_type_id
          const label = tp?.type_info?.libelle || tp?.libelle || `Type ${id}`
          if (id) typeMap.set(id, label)
        })
      }
    })
    directions.value = Array.from(dirSet).map(d => ({ label: d, value: d }))
    types.value = Array.from(typeMap.entries()).map(([value, label]) => ({ label, value }))

  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur de chargement des tickets' })
  } finally {
    loading.value = false
  }
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
      maxWidth: 300
    }
  },
  dataLabels: { enabled: false },
  legend: { position: 'bottom' },
  tooltip: { shared: true },
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
  // Filtre Recours côté client
  let base = items.value
  if (filters.value.recours === 'with') {
    base = base.filter(t => !!t.date_recours)
  } else if (filters.value.recours === 'without') {
    base = base.filter(t => !t.date_recours)
  }

  const categories = base.map(t => `${t.libelle || 'Ticket'} #${t.id}`)

  function makeDataForStatus (label, getRange) {
    return base.map(t => {
      const [start, end] = getRange(t) || [null, null]
      if (!start || !end || end < start) return null
      return { x: `${t.libelle || 'Ticket'} #${t.id}`, y: [start, end] }
    }).filter(Boolean)
  }

  // Segments par règles métier
  const ouvert = makeDataForStatus('Ouvert', t => {
    const s = toTs(t.created_at)
    const e = toTs(t.date_validation_createur)
    if (!s) return null
    return [s, e || s] // si pas de validation, segment minimal
  })

  const attente = makeDataForStatus('En attente', t => {
    const s = toTs(t.date_validation_createur)
    const e = toTs(t.date_en_cours)
    if (!s || !e) return null
    return [s, e]
  })

  const encours = makeDataForStatus('En cours', t => {
    const s = toTs(t.date_en_cours)
    const e = toTs(t.closed_at)
    if (!s || !e) return null
    return [s, e]
  })

  const cloture = makeDataForStatus('Clôturé', t => {
    const s = toTs(t.closed_at)
    const e = toTs(t.date_recours)
    if (!s) return null
    // Si pas de recours, afficher un marqueur court
    return [s, e || s]
  })

  const recours = makeDataForStatus('Recours', t => {
    const s = toTs(t.date_recours)
    const e = toTs(t.date_cloture_recours)
    if (!s || !e) return null
    return [s, e]
  })

  const recoursCloture = makeDataForStatus('Recours clôturé', t => {
    const s = toTs(t.date_cloture_recours)
    if (!s) return null
    // Fin de cycle: afficher un marqueur court à la date de clôture du recours
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

onMounted(() => {
  loadData()
})
</script>

<style scoped>
</style>