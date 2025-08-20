<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="category" size="2rem" class="text-blue-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Natures</h1>
              <p class="text-gray-600 text-sm">Gérez les natures et sous-natures des réclamations</p>
            </div>
          </div>

          <!-- Bouton pour ajouter une nature -->
          <q-btn
            label="Ajouter une Nature"
            color="blue-6"
            icon="add"
            @click="openDialog()"
            class="px-4"
          />
        </div>

        <!-- Barre de recherche -->
        <div class="mt-4">
          <q-input
            v-model="searchQuery"
            placeholder="Rechercher dans les natures et sous-natures..."
            outlined
            dense
            clearable
            class="max-w-md"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="text-blue-600" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Liste des natures -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <q-icon name="list" color="blue-600" size="1.5rem" class="mr-2" />
          Liste des Natures
        </h2>

        <div v-if="loading" class="text-center py-8">
          <q-spinner-facebook size="2rem" color="blue-600" />
          <p class="text-gray-500 mt-2">Chargement...</p>
        </div>

        <div v-else-if="natures.length === 0" class="text-center py-8">
          <q-icon name="category" size="3rem" class="text-gray-400 mb-3" />
          <p class="text-gray-500">Aucune nature trouvée</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="nature in natures"
            :key="nature.NATID"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <h3 class="font-medium text-gray-800 mr-3">{{ nature.NATLIB }}</h3>
                  <q-chip
                    color="blue-6"
                    text-color="white"
                    :label="`ID: ${nature.NATID}`"
                    size="sm"
                  />
                </div>

                <!-- Sous-natures -->
                <div v-if="nature.sous_natures && nature.sous_natures.length > 0" class="mt-2">
                  <div class="text-sm text-gray-600 mb-1">Sous-natures :</div>
                  <div class="flex flex-wrap gap-1">
                    <q-chip
                      v-for="sousNature in nature.sous_natures"
                      :key="sousNature.SOUSID"
                      color="secondary"
                      text-color="white"
                      :label="sousNature.SOUSLIB"
                      size="sm"
                    />
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500 mt-2">
                  Aucune sous-nature
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <q-btn
                  label="Modifier"
                  color="blue-6"
                  outline
                  size="sm"
                  @click="openDialog(nature)"
                >
                  <q-icon name="edit" class="mr-1" />
                </q-btn>
                <q-btn
                  label="Supprimer"
                  color="negative"
                  outline
                  size="sm"
                  @click="confirmDelete(nature)"
                >
                  <q-icon name="delete" class="mr-1" />
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.rowsNumber > 0" class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <!-- Informations de pagination -->
            <div class="text-sm text-gray-600">
              Affichage de {{ ((pagination.page - 1) * pagination.rowsPerPage) + 1 }} à
              {{ Math.min(pagination.page * pagination.rowsPerPage, pagination.rowsNumber) }}
              sur {{ pagination.rowsNumber }} nature(s)
            </div>

            <!-- Contrôles de pagination -->
            <div class="flex items-center space-x-2">
              <!-- Bouton page précédente -->
              <q-btn
                icon="chevron_left"
                color="blue-6"
                flat
                round
                size="sm"
                :disable="pagination.page === 1"
                @click="goToPreviousPage"
                class="mr-2"
              >
                <q-tooltip>Page précédente</q-tooltip>
              </q-btn>

              <!-- Indicateur de page actuelle -->
              <span class="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-md">
                Page {{ pagination.page }} sur {{ Math.ceil(pagination.rowsNumber / pagination.rowsPerPage) }}
              </span>

              <!-- Bouton page suivante -->
              <q-btn
                icon="chevron_right"
                color="blue-6"
                flat
                round
                size="sm"
                :disable="pagination.page >= Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
                @click="goToNextPage"
                class="ml-2"
              >
                <q-tooltip>Page suivante</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Dialog pour ajouter/modifier une nature -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Modifier' : 'Ajouter' }} une Nature</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveNature" class="q-gutter-md">
            <q-input
              v-model="form.NATLIB"
              label="Nom de la Nature"
              :rules="[val => !!val || 'Le nom est requis']"
              outlined
            />

            <q-input
              v-model.number="form.ORDRE"
              label="Ordre (optionnel)"
              type="number"
              outlined
            />

            <div class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm">Sous-natures</div>

              <div v-for="(sousNature, index) in form.sous_natures" :key="index" class="row q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="sousNature.SOUSLIB"
                    :label="`Sous-nature ${index + 1}`"
                    outlined
                    dense
                    :rules="[val => !!val || 'Le nom est requis']"
                  />
                </div>
                <div class="col-auto q-ml-sm">
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    @click="removeSousNature(index)"
                  />
                </div>
              </div>

              <q-btn
                flat
                color="primary"
                icon="add"
                label="Ajouter une sous-nature"
                @click="addSousNature"
                class="q-mt-sm"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="grey" @click="closeDialog" />
          <q-btn
            label="Enregistrer"
            color="primary"
            @click="saveNature"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de confirmation de suppression -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmer la suppression</div>
        </q-card-section>
        <q-card-section>
          Êtes-vous sûr de vouloir supprimer la nature "{{ natureToDelete?.NATLIB }}" ?
          <br>
          <span class="text-negative">Toutes les sous-natures associées seront également supprimées.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="grey" @click="deleteDialog = false" />
          <q-btn
            label="Supprimer"
            color="negative"
            @click="deleteNature"
            :loading="deleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()

// État réactif
const natures = ref([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const saving = ref(false)
const deleting = ref(false)
const isEditing = ref(false)
const natureToDelete = ref(null)
const searchQuery = ref('')
let searchTimeout = null

// Pagination
const pagination = ref({
  sortBy: 'NATID',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

// Formulaire
const form = ref({
  NATID: null,
  NATLIB: '',
  ORDRE: null,
  sous_natures: []
})

// Colonnes du tableau (conservées pour compatibilité)
const columns = []

// Méthodes
const fetchNatures = async (props = {}) => {
  loading.value = true
  try {
    const { page = 1, rowsPerPage = 10 } = props.pagination || pagination.value

    const response = await api.get('/api/nature', {
       params: {
         page,
         per_page: rowsPerPage,
         search: searchQuery.value
       }
     })

    if (response.data.success) {
      natures.value = response.data.data
      pagination.value.page = response.data.pagination.current_page
      pagination.value.rowsPerPage = response.data.pagination.per_page
      pagination.value.rowsNumber = response.data.pagination.total
    }
  } catch (error) {
    console.error('Erreur lors du chargement des natures:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des natures'
    })
  } finally {
    loading.value = false
  }
}

// Fonction onRequest supprimée - remplacée par la pagination manuelle

const goToPreviousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchNatures()
  }
}

const goToNextPage = () => {
  const maxPage = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
  if (pagination.value.page < maxPage) {
    pagination.value.page++
    fetchNatures()
  }
}

const openDialog = (nature = null) => {
  if (nature) {
    isEditing.value = true
    form.value = {
      NATID: nature.NATID,
      NATLIB: nature.NATLIB,
      ORDRE: nature.ORDRE,
      sous_natures: nature.sous_natures ? [...nature.sous_natures] : []
    }
  } else {
    isEditing.value = false
    resetForm()
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    NATID: null,
    NATLIB: '',
    ORDRE: null,
    sous_natures: []
  }
}

const addSousNature = () => {
  form.value.sous_natures.push({
    SOUSID: null,
    SOUSLIB: ''
  })
}

const removeSousNature = (index) => {
  form.value.sous_natures.splice(index, 1)
}

const saveNature = async () => {
  if (!form.value.NATLIB.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Le nom de la nature est requis'
    })
    return
  }

  // Vérifier que toutes les sous-natures ont un nom
  const invalidSousNatures = form.value.sous_natures.filter(sn => !sn.SOUSLIB.trim())
  if (invalidSousNatures.length > 0) {
    $q.notify({
      type: 'negative',
      message: 'Toutes les sous-natures doivent avoir un nom'
    })
    return
  }

  saving.value = true
  try {
    const payload = {
      NATLIB: form.value.NATLIB,
      ORDRE: form.value.ORDRE,
      sous_natures: form.value.sous_natures.filter(sn => sn.SOUSLIB.trim())
    }

    let response
    if (isEditing.value) {
       response = await api.put(`/api/nature/${form.value.NATID}`, payload)
     } else {
       response = await api.post('/api/nature', payload)
     }

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: isEditing.value ? 'Nature modifiée avec succès' : 'Nature créée avec succès'
      })
      closeDialog()
      fetchNatures()
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la sauvegarde'
    })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (nature) => {
  natureToDelete.value = nature
  deleteDialog.value = true
}

const deleteNature = async () => {
  if (!natureToDelete.value) return

  deleting.value = true
  try {
    const response = await api.delete(`/api/nature/${natureToDelete.value.NATID}`)

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Nature supprimée avec succès'
      })
      deleteDialog.value = false
      natureToDelete.value = null
      fetchNatures()
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la suppression'
    })
  } finally {
    deleting.value = false
  }
}

// Watch pour la recherche avec debounce
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1 // Reset à la première page lors d'une recherche
    fetchNatures()
  }, 300)
})

// Lifecycle
onMounted(() => {
  fetchNatures()
})
</script>

<style scoped>
.q-chip {
  margin: 2px;
}
</style>
