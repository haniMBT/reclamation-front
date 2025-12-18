<template>
  <div class="q-pa-md column q-gutter-md">
    <div class="row q-col-gutter-md items-center">
      <div class="col-12 col-md-3">
        <q-input v-model="filters.date_from" type="date" label="Date début" dense />
      </div>
      <div class="col-12 col-md-3">
        <q-input v-model="filters.date_to" type="date" label="Date fin" dense />
      </div>
      <div class="col-12 col-md-3">
        <q-select v-model="filters.statuses" :options="availableStatuses" label="Statuts" dense use-chips multiple emit-value map-options />
      </div>
      <div class="col-12 col-md-3">
        <q-select v-model="filters.direction" :options="directions" label="Direction / Service" dense emit-value map-options />
      </div>
      <div class="col-12 col-md-3">
        <q-select v-model="filters.type_id" :options="types" label="Type de réclamation" dense emit-value map-options />
      </div>
      <div class="col-12 col-md-3">
        <q-select v-model="filters.recours" :options="recoursOptions" label="Recours" dense emit-value map-options />
      </div>
      <div class="col-12 col-md-3">
        <q-btn color="primary" label="Appliquer les filtres" @click="loadData" :loading="loading" />
        <q-btn flat color="grey-8" class="q-ml-sm" label="Réinitialiser" @click="resetFilters" :disable="loading" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="text-h6">Chronologie des réclamations par périodes de statut</div>
        <div class="text-caption text-grey-7">Chaque barre = un ticket. Segments colorés par statut.</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <apexchart type="rangeBar" height="600" :options="chartOptions" :series="series" />
      </q-card-section>
    </q-card>
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