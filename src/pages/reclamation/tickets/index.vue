``<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="confirmation_number" size="2rem" class="text-blue-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Tickets de Réclamation</h1>
              <p class="text-gray-600 text-sm">Gérez et consultez tous les tickets de réclamation</p>
            </div>
          </div>
          <q-btn
            color="blue-6"
            no-caps
            unelevated
            icon="add"
            class="px-6"
            @click="$router.push('/reclamation/tickets/create')"
          >
            Nouvelle réclamation
          </q-btn>
        </div>
      </div>

      <!-- Search Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <q-input
              v-model="searchQuery"
              placeholder="Rechercher un ticket..."
              outlined
              dense
              clearable
              debounce="500"
              class="w-full"
            >
              <template v-slot:prepend>
                <q-icon name="search" class="text-gray-500" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <q-spinner-dots size="3rem" color="blue-6" />
        <span class="ml-3 text-gray-600">Chargement des tickets...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="!tickets.length" class="text-center py-12">
        <q-icon name="confirmation_number" size="4rem" class="text-gray-300 mb-4" />
        <h3 class="text-xl font-medium text-gray-600 mb-2">Aucun ticket trouvé</h3>
        <p class="text-gray-500">{{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun ticket disponible' }}</p>
      </div>

      <!-- Tickets Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <q-card
          v-for="ticket in tickets"
          :key="ticket.id"
          class="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          @click="viewTicket(ticket)"
        >
          <q-card-section class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ ticket.libelle || 'Ticket sans libellé' }}</h3>
                <p class="text-gray-600 text-sm mb-3">
                  <q-icon name="tag" size="sm" class="mr-1" />
                  ID: {{ ticket.id }}
                </p>
              </div>
              <q-badge 
                :color="getStatusColor(ticket.status)"
                :label="ticket.status || 'OUVERT'"
                class="text-xs"
              />
            </div>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="space-y-2">
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Description:</span>
                  <span class="text-gray-600 ml-2">{{ ticket.description || 'N/A' }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-medium text-gray-700">Direction:</span>
                  <span class="text-gray-600 ml-2">{{ ticket.direction || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Types de réclamation -->
            <div v-if="ticket.types && ticket.types.length" class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Types de réclamation:</div>
              <div class="flex flex-wrap gap-1">
                <q-chip
                  v-for="type in ticket.types"
                  :key="type.id"
                  color="blue-1"
                  text-color="blue-8"
                  size="sm"
                  class="text-xs"
                >
                  {{ type.b_rec_type?.libelle || 'Type inconnu' }}
                </q-chip>
              </div>
            </div>

            <!-- Détails -->
            <div v-if="ticket.types && ticket.types.some(t => t.details && t.details.length)" class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Détails:</div>
              <div class="flex flex-wrap gap-1">
                <template v-for="type in ticket.types" :key="'details-' + type.id">
                  <q-chip
                    v-for="detail in type.details || []"
                    :key="detail.id"
                    color="green-1"
                    text-color="green-8"
                    size="sm"
                    class="text-xs"
                  >
                    {{ detail.b_rec_detail?.libelle || 'Détail inconnu' }}
                  </q-chip>
                </template>
              </div>
            </div>

            <!-- Informations générales -->
            <div v-if="ticket.infos_generales && ticket.infos_generales.length" class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Informations générales:</div>
              <div class="flex flex-wrap gap-1">
                <q-chip
                  v-for="info in ticket.infos_generales"
                  :key="info.id"
                  color="purple-1"
                  text-color="purple-8"
                  size="sm"
                  class="text-xs"
                >
                  {{ info.libelle || 'Info sans libellé' }}
                </q-chip>
              </div>
            </div>

            <!-- Dates -->
            <div class="bg-gray-50 rounded-lg p-3 mb-4">
              <div class="space-y-1">
                <div class="text-xs text-gray-600">
                  <q-icon name="schedule" size="xs" class="mr-1" />
                  Créé le {{ formatDate(ticket.created_at) }}
                </div>
                <div class="text-xs text-gray-600">
                  <q-icon name="update" size="xs" class="mr-1" />
                  Mis à jour le {{ formatDate(ticket.updated_at) }}
                </div>
                <div v-if="ticket.closed_at" class="text-xs text-gray-600">
                  <q-icon name="check_circle" size="xs" class="mr-1" />
                  Fermé le {{ formatDate(ticket.closed_at) }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-500">
                <q-icon name="info" size="sm" class="mr-1" />
                <span>{{ ticket.types?.length || 0 }} type(s)</span>
              </div>
              <div class="flex space-x-2">
                <q-btn
                  flat
                  round
                  color="blue-6"
                  icon="visibility"
                  size="sm"
                  @click.stop="viewTicket(ticket)"
                >
                  <q-tooltip>Voir le détail</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="orange-6"
                  icon="edit"
                  size="sm"
                  @click.stop="editTicket(ticket)"
                >
                  <q-tooltip>Modifier</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && tickets.length" class="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Affichage de {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }} à 
            {{ Math.min(pagination.page * pagination.rowsPerPage, pagination.rowsNumber) }} 
            sur {{ pagination.rowsNumber }} tickets
          </div>
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
            :max-pages="6"
            direction-links
            boundary-links
            color="blue-6"
            @update:model-value="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

// État réactif
const tickets = ref([])
const loading = ref(false)
const searchQuery = ref('')

const pagination = reactive({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0
})

// Méthodes
const fetchTickets = async (props = {}) => {
  loading.value = true
  try {
    const { page = 1, rowsPerPage = 15 } = props.pagination || pagination

    const response = await api.get('/api/rec/tickets/indexAll', {
      params: {
        page,
        per_page: rowsPerPage,
        q: searchQuery.value
      }
    })

    if (response.data.success) {
      tickets.value = response.data.data.items
      pagination.page = response.data.data.meta.current_page
      pagination.rowsPerPage = response.data.data.meta.per_page
      pagination.rowsNumber = response.data.data.meta.total
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tickets:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des tickets'
    })
  } finally {
    loading.value = false
  }
}

const onPageChange = (newPage) => {
  pagination.page = newPage
  fetchTickets({ pagination })
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const getStatusColor = (status) => {
  const statusColors = {
    'OUVERT': 'blue',
    'EN_COURS': 'orange',
    'FERME': 'green',
    'ANNULE': 'red',
    'En cours': 'orange',
    'Terminé': 'green',
    'En attente': 'blue',
    'Annulé': 'red'
  }
  return statusColors[status] || 'grey'
}

const viewTicket = (ticket) => {
  router.push(`/reclamation/tickets/${ticket.id}`)
}

const editTicket = (ticket) => {
  router.push(`/reclamation/tickets/${ticket.id}/edit`)
}

// Watchers
watch(searchQuery, () => {
  pagination.page = 1
  fetchTickets({ pagination })
}, { debounce: 500 })

// Lifecycle
onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
/* Styles personnalisés pour le design moderne */
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>