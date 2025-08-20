<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col">
        <h4 class="q-my-none">Gestion des Natures et Sous-natures</h4>
      </div>
      <div class="col-auto q-gutter-sm">
        <q-input
          v-model="searchQuery"
          placeholder="Rechercher..."
          outlined
          dense
          clearable
          style="min-width: 250px"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="primary"
          icon="add"
          label="Ajouter une Nature"
          @click="openDialog()"
        />
      </div>
    </div>

    <q-table
      :rows="natures"
      :columns="columns"
      row-key="NATID"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="NATID" :props="props">
            {{ props.row.NATID }}
          </q-td>
          <q-td key="NATLIB" :props="props">
            {{ props.row.NATLIB }}
          </q-td>
          <q-td key="sous_natures" :props="props">
            <div v-if="props.row.sous_natures && props.row.sous_natures.length > 0">
              <q-chip
                v-for="sousNature in props.row.sous_natures"
                :key="sousNature.SOUSID"
                color="secondary"
                text-color="white"
                size="sm"
                class="q-ma-xs"
              >
                {{ sousNature.SOUSLIB }}
              </q-chip>
            </div>
            <span v-else class="text-grey-6">Aucune sous-nature</span>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              size="sm"
              @click="openDialog(props.row)"
            >
              <q-tooltip>Modifier</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Supprimer</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

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
  </q-page>
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

// Colonnes du tableau
const columns = [
  {
    name: 'NATID',
    required: true,
    label: 'ID',
    align: 'left',
    field: 'NATID',
    sortable: true
  },
  {
    name: 'NATLIB',
    required: true,
    label: 'Nom',
    align: 'left',
    field: 'NATLIB',
    sortable: true
  },

  {
    name: 'sous_natures',
    label: 'Sous-natures',
    align: 'left',
    field: 'sous_natures'
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center'
  }
]

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

const onRequest = (props) => {
  fetchNatures(props)
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
