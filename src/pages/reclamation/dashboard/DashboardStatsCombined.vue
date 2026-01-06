<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-2">
          <q-icon name="pie_chart" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Statistiques Globales des Réclamations</h1>
            <p class="text-gray-600 text-sm">Vue d'ensemble par état (En attente, En cours, Traité, Recours)</p>
          </div>
        </div>
      </div>

      <!-- Main Content (Filters + Chart Side-by-Side) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Filters Section (Left) -->
        <div class="lg:col-span-4 xl:col-span-3">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <q-icon name="filter_alt" class="mr-2 text-blue-600" />
              Filtres
            </h2>

            <div class="flex flex-col gap-4">
              <q-input outlined dense v-model="filters.date_from" type="date" label="Date début" class="w-full" @update:model-value="loadData" />
              <q-input outlined dense v-model="filters.date_to" type="date" label="Date fin" class="w-full" @update:model-value="loadData" />

              <q-select outlined dense v-model="filters.bticket_ids" :options="baseTickets" label="Type de réclamation"
                multiple emit-value map-options use-chips class="w-full" @update:model-value="loadData" />

              <q-select outlined dense v-model="filters.statuses" :options="statusOptions" label="Statuts"
                multiple emit-value map-options use-chips class="w-full" @update:model-value="loadData" />

              <q-separator class="my-2" />

              <q-btn flat color="grey-8" no-caps class="w-full border border-gray-300" label="Réinitialiser" :disable="loading" @click="resetFilters" icon="refresh" />
            </div>
          </div>
        </div>

        <!-- Chart Section (Right) -->
        <div class="lg:col-span-8 xl:col-span-9">
          <div class="bg-white rounded-lg shadow-sm p-6 h-full">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <q-icon name="pie_chart" class="text-indigo-600 mr-2" />
                <div class="text-lg font-semibold text-gray-800">Répartition par État</div>
              </div>
            </div>
            <div ref="chartRef" style="height: 600px;"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import * as echarts from 'echarts'

const $q = useQuasar()
const loading = ref(false)
const items = ref([])
const statsPrecomputed = ref(null)
const baseTickets = ref([])

// Options pour le filtre de statut (identique à l'existant pour cohérence)
const statusOptions = [
  { label: 'Ouvert', value: 'ouvert' },
  { label: 'En attente', value: 'En attente' },
  { label: 'En cours', value: 'En cours' },
  { label: 'Clôturé', value: 'clôturé' },
  { label: 'Recours', value: 'Recours' },
  { label: 'Recours clôturé', value: 'Recours clôturé' }
]

const filters = ref({
  date_from: '',
  date_to: '',
  statuses: [],
  bticket_ids: []
})

const chartRef = ref(null)
let chartInstance = null

function resetFilters() {
  filters.value = { date_from: '', date_to: '', bticket_ids: [], statuses: [] }
  loadData()
}

async function loadData() {
  loading.value = true
  try {
    const params = {}
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to
    if (filters.value.statuses && filters.value.statuses.length > 0) params.statuses = filters.value.statuses
    if (filters.value.bticket_ids && filters.value.bticket_ids.length > 0) {
      params.bticket_ids = filters.value.bticket_ids
    }

    // Indiquer la source pour différencier (ici on veut tout, y compris les traités)
    params.source = 'combined'

    // Réutilisation de l'endpoint existant pour garantir la cohérence des données
    const { data } = await api.get('/api/rec/dashboard/timeline', { params })
    const payload = data?.data || {}

    // Stats pré-calculées (optimisation backend)
    statsPrecomputed.value = payload.stats_precomputed || null

    // Traitement des items
    const rawItems = payload.items
    items.value = Array.isArray(rawItems)
      ? rawItems
      : (rawItems && typeof rawItems === 'object' ? Object.values(rawItems) : [])

    // Traitement des types de tickets (base_tickets)
    const rawBaseTickets = payload.base_tickets
    baseTickets.value = Array.isArray(rawBaseTickets)
      ? rawBaseTickets.map(t => ({ label: t.libelle || `Ticket ${t.id}`, value: t.id }))
      : (rawBaseTickets && typeof rawBaseTickets === 'object'
          ? Object.values(rawBaseTickets).map(t => ({ label: t.libelle || `Ticket ${t.id}`, value: t.id }))
          : [])

    // Si baseTickets vide, fallback
    if (baseTickets.value.length === 0 && items.value.length > 0) {
        const map = new Map()
        items.value.forEach(t => {
            const id = t?.bticket_id || t?.baseTicket?.id
            const label = t?.type_name || t?.baseTicket?.libelle || (id ? `Ticket ${id}` : 'Inconnu')
            if (id && !map.has(id)) map.set(id, label)
        })
        baseTickets.value = Array.from(map.entries()).map(([value, label]) => ({ label, value }))
    }

    renderChart()

  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur de chargement des données' })
  } finally {
    loading.value = false
  }
}

function getTicketStatus(t) {
    // Logique de détermination du statut actuel
    // Priorité inverse de l'avancement
    if (t.date_cloture_recours) return 'Recours clôturé'
    if (t.date_recours) return 'Recours'
    if (t.closed_at) return 'Clôturé'
    if (t.date_en_cours) return 'En cours'
    if (t.date_validation_createur) return 'En attente'
    return 'En attente' // 'Ouvert' mappé à 'En attente' pour simplifier selon la demande, ou on peut compter à part
}

function processStats() {
    const stats = {
        'En attente': 0,
        'En cours': 0,
        'Traité': 0,
        'Recours': 0
    }

    if (statsPrecomputed.value) {
        const s = statsPrecomputed.value
        // Mapping des statuts DB vers statuts Dashboard
        // 'En attente'
        stats['En attente'] = (s['Ouvert'] || 0) + (s['ouvert'] || 0) +
                              (s['En attente'] || 0) + (s['en attente'] || 0)

        // 'En cours'
        stats['En cours'] = (s['En cours'] || 0) + (s['en cours'] || 0)

        // 'Traité' (Clôturé + Recours clôturé)
        stats['Traité'] = (s['clôturé'] || 0) + (s['Clôturé'] || 0) +
                          (s['Recours clôturé'] || 0) + (s['recours clôturé'] || 0)

        // 'Recours' (actif)
        stats['Recours'] = (s['Recours'] || 0) + (s['recours'] || 0)

        return stats
    }

    items.value.forEach(t => {
        // Appliquer filtres frontend si nécessaire (ex: filtrer par type si pas géré backend parfaitement)
        // Mais ici on fait confiance au backend pour le filtrage principal.

        const status = getTicketStatus(t)

        if (status === 'Recours clôturé' || status === 'Clôturé') {
            stats['Traité']++
        } else if (status === 'Recours') {
            stats['Recours']++
        } else if (status === 'En cours') {
            stats['En cours']++
        } else if (status === 'En attente' || status === 'Ouvert') {
            stats['En attente']++
        }
    })

    return stats
}

function renderChart() {
    if (!chartRef.value) return
    if (!chartInstance) chartInstance = echarts.init(chartRef.value)

    const stats = processStats()
    const categories = ['En attente', 'En cours', 'Traité', 'Recours']

    // Couleurs personnalisées
    const colors = {
        'En attente': '#FBC02D',
        'En cours': '#43A047',
        'Traité': '#757575',
        'Recours': '#E53935'
    }

    const data = categories.map(cat => ({
        value: stats[cat],
        name: cat,
        itemStyle: { color: colors[cat] }
    })).filter(item => item.value > 0) // Optionnel: filtrer les valeurs à 0 pour un camembert plus propre

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        legend: {
            top: '0%',
            left: 'center',
            orient: 'horizontal'
        },
        series: [
            {
                name: 'Répartition des réclamations',
                type: 'pie',
                radius: '65%', // Style Camembert (Pie Chart) standard
                center: ['50%', '55%'], // Décalé légèrement vers le bas pour laisser place à la légende
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {c} ({d}%)',
                    fontWeight: 'bold'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        show: true,
                        fontSize: 14
                    }
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10,
                    smooth: true
                },
                data: data
            }
        ]
    }

    chartInstance.setOption(option)
}

function handleResize() {
    if (chartInstance) chartInstance.resize()
}

onMounted(() => {
    loadData()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
})

watch(() => filters.value.bticket_ids, (val) => {
    // Si changement de filtre, recharger
    // loadData est appelé par @update:model-value, donc pas besoin de watcher explicite si tout est lié
    // Mais pour bticket_ids qui est un tableau, le watcher peut être utile si la mutation est profonde, mais ici on remplace le tableau
})

</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>
