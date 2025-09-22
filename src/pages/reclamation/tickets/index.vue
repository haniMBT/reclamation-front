<template>
  <div class="q-pa-md">
    <!-- En-tête avec titre et bouton -->
    <div class="row items-center justify-between q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-none">Gestion des Tickets de Réclamation</h4>
        <p class="text-grey-6 q-mt-sm">Gérez et consultez tous les tickets de réclamation</p>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Nouvelle réclamation"
          @click="$router.push('/reclamation/tickets/create')"
          class="q-px-lg"
        />
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchQuery"
          placeholder="Rechercher un ticket..."
          outlined
          dense
          clearable
          debounce="500"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Contenu principal -->
    <q-card class="q-mb-md">
      <!-- État de chargement -->
      <div v-if="loading" class="q-pa-xl text-center">
        <q-spinner-dots size="50px" color="primary" />
        <div class="q-mt-md text-grey-6">Chargement des tickets...</div>
      </div>

      <!-- Aucun ticket trouvé -->
      <div v-else-if="!tickets.length" class="q-pa-xl text-center">
        <q-icon name="inbox" size="64px" color="grey-4" />
        <div class="q-mt-md text-h6 text-grey-6">Aucun ticket trouvé</div>
        <div class="text-grey-5">{{ searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun ticket disponible' }}</div>
      </div>

      <!-- Liste des tickets -->
      <div v-else>
        <q-list separator>
          <q-item
            v-for="ticket in tickets"
            :key="ticket.id"
            class="q-py-md"
            clickable
            v-ripple
          >
            <q-item-section>
              <div class="row items-start q-gutter-md">
                <!-- Informations principales -->
                <div class="col-12 col-md-4">
                  <div class="text-h6 text-primary q-mb-xs">
                    {{ ticket.libelle || 'Ticket sans libellé' }}
                  </div>
                  <div class="text-caption text-grey-6">
                    ID: {{ ticket.id }}
                  </div>
                  <div class="q-mt-sm">
                    <div class="text-body2">
                      <strong>Description:</strong> {{ ticket.description || 'N/A' }}
                    </div>
                    <div class="text-body2">
                      <strong>Direction:</strong> {{ ticket.direction || 'N/A' }}
                    </div>
                    <div class="text-body2">
                      <strong>Statut:</strong> 
                      <q-badge 
                        :color="getStatusColor(ticket.status)"
                        :label="ticket.status || 'OUVERT'"
                      />
                    </div>
                  </div>
                </div>

                <!-- Types et détails -->
                <div class="col-12 col-md-4">
                  <div class="text-subtitle2 q-mb-sm">Types de réclamation:</div>
                  <div v-if="ticket.types && ticket.types.length" class="q-gutter-xs">
                    <q-chip
                      v-for="type in ticket.types"
                      :key="type.id"
                      color="blue-1"
                      text-color="blue-8"
                      size="sm"
                      class="q-mb-xs"
                    >
                      {{ type.b_rec_type?.libelle || 'Type inconnu' }}
                    </q-chip>
                  </div>
                  <div v-else class="text-grey-5 text-caption">
                    Aucun type défini
                  </div>

                  <div v-if="ticket.types && ticket.types.some(t => t.details && t.details.length)" class="q-mt-sm">
                    <div class="text-subtitle2 q-mb-sm">Détails:</div>
                    <div class="q-gutter-xs">
                      <template v-for="type in ticket.types" :key="'details-' + type.id">
                        <q-chip
                          v-for="detail in type.details || []"
                          :key="detail.id"
                          color="green-1"
                          text-color="green-8"
                          size="sm"
                          class="q-mb-xs"
                        >
                          {{ detail.b_rec_detail?.libelle || 'Détail inconnu' }}
                        </q-chip>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Informations supplémentaires -->
                <div class="col-12 col-md-4">
                  <div class="q-gutter-sm">
                    <div class="text-body2">
                      <strong>Date création:</strong> {{ formatDate(ticket.created_at) }}
                    </div>
                    <div class="text-body2">
                      <strong>Date mise à jour:</strong> {{ formatDate(ticket.updated_at) }}
                    </div>
                    <div v-if="ticket.closed_at" class="text-body2">
                      <strong>Date fermeture:</strong> {{ formatDate(ticket.closed_at) }}
                    </div>
                    <div v-if="ticket.infos_generales && ticket.infos_generales.length" class="q-mt-sm">
                      <div class="text-subtitle2 q-mb-sm">Informations générales:</div>
                      <div class="q-gutter-xs">
                        <q-chip
                          v-for="info in ticket.infos_generales"
                          :key="info.id"
                          color="purple-1"
                          text-color="purple-8"
                          size="sm"
                          class="q-mb-xs"
                        >
                          {{ info.libelle || 'Info sans libellé' }}
                        </q-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-item-section>

            <q-item-section side>
              <div class="q-gutter-sm">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="visibility"
                  size="sm"
                  @click.stop="viewTicket(ticket)"
                >
                  <q-tooltip>Voir le détail</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="orange"
                  icon="edit"
                  size="sm"
                  @click.stop="editTicket(ticket)"
                >
                  <q-tooltip>Modifier</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>

    <!-- Pagination -->
    <div v-if="!loading && tickets.length" class="row items-center justify-between q-mt-md">
      <div class="col-auto">
        <div class="text-body2 text-grey-6">
          Affichage de {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }} à 
          {{ Math.min(pagination.page * pagination.rowsPerPage, pagination.rowsNumber) }} 
          sur {{ pagination.rowsNumber }} tickets
        </div>
      </div>
      <div class="col-auto">
        <q-pagination
          v-model="pagination.page"
          :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
          :max-pages="6"
          direction-links
          boundary-links
          @update:model-value="onPageChange"
        />
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
.q-chip {
  font-size: 0.75rem;
}
</style>