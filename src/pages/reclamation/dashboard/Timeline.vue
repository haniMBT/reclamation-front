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

            <q-select outlined dense v-model="filters.bticket_ids" :options="baseTickets" label="Type de réclamation"
              multiple emit-value map-options use-chips class="min-w-[280px]" @update:model-value="onSelectBaseTicket" />

            <q-select outlined dense v-model="filters.statuses" :options="statusOptions" label="Statuts"
              multiple emit-value map-options use-chips class="min-w-[280px]" @update:model-value="loadData" />

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
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'
import { api } from 'src/boot/axios'

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
  bticket_id: null, // compat single-select
  bticket_ids: [], // multi-select values
  bticket_label: null,
  statuses: []
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
    if (filters.value.bticket_ids && filters.value.bticket_ids.length > 0) {
      params.bticket_ids = filters.value.bticket_ids
    } else if (filters.value.bticket_id) {
      params.bticket_id = filters.value.bticket_id
    }
    if (filters.value.statuses && filters.value.statuses.length > 0) params.statuses = filters.value.statuses

    const { data } = await api.get('/api/rec/dashboard/timeline', { params })
    const payload = data?.data || {}
    items.value = (payload.items || [])
    // Alimenter les options de filtre b_rec_ticket à partir de la même réponse
    baseTickets.value = (payload.base_tickets || []).map(t => ({ label: t.libelle || `Ticket ${t.id}`, value: t.id }))

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
  tooltip: { shared: true, x: { formatter: (val) => (typeof val === 'string' ? val.split('¬')[0].trim() : val) } },
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
  let base = items.value

  // Fallback client-side filter by base tickets when backend filter not applied
  if (filters.value.bticket_ids && filters.value.bticket_ids.length > 0) {
    const set = new Set(filters.value.bticket_ids)
    base = base.filter(t => set.has(t.bticket_id || t?.baseTicket?.id))
  } else if (!filters.value.bticket_id && filters.value.bticket_label) {
    base = base.filter(t => (t.type_name || '').toLowerCase() === filters.value.bticket_label.toLowerCase())
  }

  // Construire une étiquette enrichie: libelle du type de réclamation + direction ou Nom Prénom
  function ticketLabel (t) {
    const type = t.libelle || t.type_name || 'Ticket'
    const owner = t.owner_display || ''
    return owner ? `${type} — ${owner}` : `${type}`
  }
  // Clé interne unique (inclut ID) non affichée visuellement grâce aux formatters
  function ticketLabelKey (t) {
    return `${ticketLabel(t)} ¬${t.id}`
  }

  const categories = base.map(ticketLabelKey)

  function makeDataForStatus (label, getRange) {
    return base.map(t => {
      const [start, end] = getRange(t) || [null, null]
      if (!start || !end || end < start) return null
      return { x: ticketLabelKey(t), y: [start, end] }
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
  // Charger les libellés b_rec_ticket pour le filtre (fallback sans appel réseau)
  loadBaseTickets()
})

// Rafraîchir automatiquement quand des types (b_rec_ticket) sont sélectionnés
watch(() => filters.value.bticket_ids, (val) => {
  if (Array.isArray(val)) {
    loadData()
  }
})
// Compatibilité: déclenchement sur single-select si utilisé
watch(() => filters.value.bticket_id, (val) => {
  if (val !== null && val !== undefined) {
    loadData()
  }
})
</script>

<style scoped>
</style>
