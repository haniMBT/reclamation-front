<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="list" size="2rem" class="text-blue-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Toutes les Réclamations</h1>
              <p class="text-gray-600 text-sm">Consultez et gérez toutes vos réclamations</p>
            </div>
          </div>

          <!-- Bouton de retour -->
          <q-btn
            label="Retour"
            color="grey-6"
            outline
            icon="arrow_back"
            @click="goBack"
            class="px-4"
          />
        </div>
      </div>

      <!-- Filtres Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <q-icon name="filter_list" color="blue-600" size="1.5rem" class="mr-2" />
          Filtres de recherche
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Recherche par mot-clé -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Recherche</label>
            <q-input
              v-model="filters.search"
              placeholder="Objet ou contenu..."
              outlined
              dense
              clearable
              @update:model-value="applyFilters"
            >
              <template v-slot:prepend>
                <q-icon name="search" class="text-blue-600" />
              </template>
            </q-input>
          </div>

          <!-- Filtre par statut -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Statut</label>
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="applyFilters"
            >
              <template v-slot:prepend>
                <q-icon name="flag" class="text-blue-600" />
              </template>
            </q-select>
          </div>

          <!-- Filtre par date de début -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Date de début</label>
            <q-input
              v-model="filters.dateFrom"
              type="date"
              outlined
              dense
              clearable
              @update:model-value="applyFilters"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="text-blue-600" />
              </template>
            </q-input>
          </div>

          <!-- Filtre par date de fin -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Date de fin</label>
            <q-input
              v-model="filters.dateTo"
              type="date"
              outlined
              dense
              clearable
              @update:model-value="applyFilters"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="text-blue-600" />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Boutons d'action des filtres -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div class="flex gap-2">
            <q-btn
              label="Réinitialiser"
              color="grey-6"
              outline
              icon="refresh"
              @click="resetFilters"
              class="px-4"
            />
            <!-- <q-btn
              label="Appliquer"
              color="blue-6"
              icon="filter_alt"
              @click="applyFilters"
              class="px-4"
            /> -->
          </div>

          <div class="text-sm text-gray-600">
            {{ totalReclamations }} réclamation(s) trouvée(s)
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <q-spinner-facebook size="3rem" color="blue-6" />
        <span class="ml-3 text-gray-600">Chargement en cours...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <q-icon name="error" size="3rem" class="text-red-500 mb-4" />
        <h3 class="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <q-btn
          label="Réessayer"
          color="red-6"
          outline
          @click="loadReclamations"
          class="px-6"
        />
      </div>

      <!-- Liste des réclamations -->
      <div v-else-if="reclamations.length > 0" class="bg-white rounded-lg shadow-sm p-6">
        <div class="space-y-4">
          <div
            v-for="reclamation in reclamations"
            :key="reclamation.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
            @click="viewReclamation(reclamation.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- En-tête avec objet et statut -->
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-medium text-gray-800">{{ reclamation.objet }}</h3>
                  <q-chip
                    :color="getStatusColor(reclamation.statut)"
                    text-color="white"
                    :label="reclamation.statut_formatte"
                    class="font-medium"
                  />
                </div>

                <!-- Informations détaillées -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div class="flex items-center">
                    <q-icon name="schedule" size="1rem" class="text-blue-600 mr-2" />
                    <span>Créée le {{ formatDate(reclamation.date_creation) }}</span>
                  </div>

                  <div v-if="reclamation.date_traitement" class="flex items-center">
                    <q-icon name="check_circle" size="1rem" class="text-green-600 mr-2" />
                    <span>Traitée le {{ formatDate(reclamation.date_traitement) }}</span>
                  </div>

                  <div class="flex items-center">
                    <q-icon name="tag" size="1rem" class="text-green-600 mr-2" />
                    <span class="font-mono">#{{ reclamation.id }}</span>
                  </div>
                </div>

                <!-- Aperçu du contenu -->
                <div class="mt-3 p-3 bg-gray-50 rounded-md">
                  <p class="text-sm text-gray-700 line-clamp-2" v-html="getContentPreview(reclamation.contenu)"></p>
                </div>

                <!-- Fichiers joints -->
                <div v-if="reclamation.fichiers_count > 0" class="mt-3 flex items-center text-sm text-gray-500">
                  <q-icon name="attach_file" size="1rem" class="mr-1" />
                  <span>{{ reclamation.fichiers_count }} fichier(s) joint(s)</span>
                </div>
              </div>

              <!-- Bouton d'action -->
              <div class="flex-shrink-0 ml-4">
                <q-btn
                  icon="visibility"
                  color="blue-6"
                  flat
                  round
                  size="sm"
                  @click.stop="viewReclamation(reclamation.id)"
                >
                  <q-tooltip>Voir les détails</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <!-- Informations de pagination -->
            <div class="text-sm text-gray-600">
              Affichage de {{ paginationInfo.from }} à {{ paginationInfo.to }}
              sur {{ paginationInfo.total }} réclamation(s)
            </div>

            <!-- Contrôles de pagination -->
            <div class="flex items-center space-x-2">
              <!-- Bouton première page -->
              <q-btn
                icon="first_page"
                color="blue-6"
                flat
                round
                size="sm"
                :disable="pagination.current_page === 1"
                @click="goToPage(1)"
              >
                <q-tooltip>Première page</q-tooltip>
              </q-btn>

              <!-- Bouton page précédente -->
              <q-btn
                icon="chevron_left"
                color="blue-6"
                flat
                round
                size="sm"
                :disable="pagination.current_page === 1"
                @click="goToPage(pagination.current_page - 1)"
              >
                <q-tooltip>Page précédente</q-tooltip>
              </q-btn>

              <!-- Sélecteur de page -->
              <q-select
                v-model="pagination.current_page"
                :options="pageOptions"
                outlined
                dense
                class="w-20"
                @update:model-value="goToPage"
              />

              <!-- Bouton page suivante -->
              <q-btn
                icon="chevron_right"
                color="blue-6"
                flat
                round
                size="sm"
                :disable="pagination.current_page === pagination.last_page"
                @click="goToPage(pagination.current_page + 1)"
              >
                <q-tooltip>Page suivante</q-tooltip>
              </q-btn>

              <!-- Bouton dernière page -->
              <q-btn
                icon="last_page"
                color="blue-6"
                flat
                round
                size="sm"
                :disable="pagination.current_page === pagination.last_page"
                @click="goToPage(pagination.last_page)"
              >
                <q-tooltip>Dernière page</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Informations sur la pagination -->
          <div class="flex items-center justify-center mt-4">
            <span class="text-sm text-gray-600">
              Affichage de {{ pagination.per_page }} éléments par page
            </span>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6 text-center py-12">
        <q-icon name="inbox" size="4rem" class="text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-600 mb-2">Aucune réclamation trouvée</h3>
        <p class="text-gray-500 mb-4">
          Aucune réclamation ne correspond à vos critères de recherche
        </p>
        <q-btn
          label="Réinitialiser les filtres"
          color="blue-6"
          outline
          @click="resetFilters"
          class="px-6"
        />
      </div>

      <!-- Bouton d'action principal -->
      <div class="mt-6 text-center">
        <q-btn
          label="Nouvelle réclamation"
          color="green-6"
          size="lg"
          icon="add"
          @click="createNewReclamation"
          class="px-8"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const $q = useQuasar()
const router = useRouter()

// État réactif
const reclamations = ref([])
const loading = ref(false)
const error = ref(null)

// Filtres
const filters = ref({
  search: '',
  status: null,
  dateFrom: '',
  dateTo: ''
})

// Pagination - fixée à 10 éléments par page
const pagination = ref({
  current_page: 1,
  per_page: 10, // Fixé à 10 éléments par page
  total: 0,
  last_page: 1,
  from: 0,
  to: 0
})

// Options pour les filtres
const statusOptions = [
  { label: 'Nouvelle', value: 'nouvelle' },
  { label: 'En cours', value: 'en_cours' },
  { label: 'Traitée', value: 'traitee' },
  { label: 'Fermée', value: 'fermee' }
]

// Computed properties
const totalReclamations = computed(() => pagination.value.total)

const paginationInfo = computed(() => ({
  from: pagination.value.from,
  to: pagination.value.to,
  total: pagination.value.total
}))

const pageOptions = computed(() => {
  const options = []
  for (let i = 1; i <= pagination.value.last_page; i++) {
    options.push(i)
  }
  return options
})

// Méthodes utilitaires
const getStatusColor = (statut) => {
  const colors = {
    'nouvelle': 'blue',
    'en_cours': 'orange',
    'traitee': 'green',
    'fermee': 'grey'
  }
  return colors[statut] || 'grey'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifié'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getContentPreview = (content) => {
  if (!content) return 'Aucun contenu'
  // Nettoyer le HTML et limiter la longueur
  const textContent = content.replace(/<[^>]*>/g, '')
  return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent
}

// Navigation
const goBack = () => {
  router.go(-1)
}

const viewReclamation = (id) => {
  router.push(`/reclamation_client/${id}`)
}

const createNewReclamation = () => {
  router.push('/reclamation_client')
}

// Gestion des filtres
const applyFilters = () => {
  pagination.value.current_page = 1 // Retour à la première page
  loadReclamations()
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: null,
    dateFrom: '',
    dateTo: ''
  }
  pagination.value.current_page = 1
  loadReclamations()
}

// Gestion de la pagination
const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    loadReclamations()
  }
}



// Chargement des données
const loadReclamations = async () => {
  loading.value = true
  error.value = null

  try {
    // Construire les paramètres de requête - pagination fixe à 10
    const params = new URLSearchParams({
      page: pagination.value.current_page
      // per_page est fixé à 10 côté backend
    })

    // Ajouter les filtres
    if (filters.value.search) {
      params.append('search', filters.value.search)
    }
    if (filters.value.status) {
      params.append('status', filters.value.status)
    }
    if (filters.value.dateFrom) {
      params.append('date_from', filters.value.dateFrom)
    }
    if (filters.value.dateTo) {
      params.append('date_to', filters.value.dateTo)
    }

    const response = await api.get(`/api/reclamations/all?${params.toString()}`)

    if (response.data.success) {
      reclamations.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
        last_page: response.data.data.last_page,
        from: response.data.data.from,
        to: response.data.data.to
      }
    } else {
      throw new Error(response.data.message || 'Erreur lors du chargement')
    }
  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.response?.data?.message || err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

// Watchers pour la pagination
watch(() => pagination.value.current_page, () => {
  // Scroll vers le haut lors du changement de page
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Lifecycle
onMounted(() => {
  loadReclamations()
})
</script>

<style scoped>
/* Styles personnalisés */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation pour les cartes */
.border {
  transition: all 0.2s ease-in-out;
}

.border:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Styles pour la pagination */
.q-select {
  min-width: 80px;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .flex.justify-between {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
