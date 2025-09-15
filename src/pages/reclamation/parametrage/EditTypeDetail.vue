<template>
  <div>
    <!-- Dialog pour modifier un type et ses détails -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="w-full" style="min-width: 60vw; max-width: 80vw; max-height: 80vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center" :class="isEditMode ? 'bg-orange-50' : 'bg-blue-50'">
          <q-icon :name="isEditMode ? 'edit' : 'add'" :class="isEditMode ? 'text-orange-600' : 'text-blue-600'" class="mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold" :class="isEditMode ? 'text-orange-900' : 'text-blue-900'">
              {{ isEditMode ? 'Modifier le type et ses détails' : 'Ajouter un type et ses détails' }}
            </div>
            <div class="text-sm" :class="isEditMode ? 'text-orange-700' : 'text-blue-700'">Pour le ticket: {{ ticketLibelle }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <form class="space-y-6">
            <!-- Section Types -->
            <draggable
              v-model="form.types"
              :item-key="'uid'"
              handle=".drag-handle"
              ghost-class="ghost"
              chosen-class="chosen"
              drag-class="drag"
            >
              <template #item="{ element: type, index: typeIndex }">
                <div class="mb-8 p-4 border border-gray-200 rounded-lg">
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                  <q-icon name="drag_indicator" class="drag-handle text-gray-400 mr-2 cursor-move" size="sm" />
                  <h3 class="text-lg font-medium text-gray-800">Type #{{ typeIndex + 1 }}</h3>
                </div>
                <q-btn
                  v-if="form.types.length > 1 && !isEditMode"
                  icon="delete"
                  color="red-6"
                  flat
                  round
                  dense
                  @click.stop="removeType(type.uid)"
                  @mousedown.prevent
                >
                  <q-tooltip>Supprimer ce type</q-tooltip>
                </q-btn>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Libellé du type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Libellé du type <span class="text-red-500">*</span>
                  </label>
                  <q-input
                    v-model="type.libelle"
                    outlined
                    dense
                    placeholder="Entrez le libellé du type"
                    :rules="[val => !!val || 'Le libellé est requis']"
                  >
                    <template #prepend>
                      <q-icon name="label" class="text-blue-600" />
                    </template>
                  </q-input>
                </div>

                <!-- Direction -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Direction
                  </label>
                  <q-select
                    v-model="type.direction"
                    :options="directions"
                    option-value="DIRECTION"
                    option-label="DIRECTION"
                    emit-value
                    map-options
                    outlined
                    dense
                    placeholder="Sélectionnez une direction"
                    clearable
                  >
                    <template #prepend>
                      <q-icon name="business" class="text-blue-600" />
                    </template>
                  </q-select>
                </div>

                <!-- Statut Direction (apparaît uniquement si une direction est sélectionnée) -->
                <div v-if="type.direction">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Statut Direction <span class="text-red-500">*</span>
                  </label>
                  <q-select
                    v-model="type.statut_direction"
                    :options="statutOptions"
                    outlined
                    dense
                    placeholder="Sélectionnez un statut"
                  >
                    <template #prepend>
                      <q-icon name="assignment" class="text-blue-600" />
                    </template>
                  </q-select>
                </div>
              </div>

              <!-- Section Détails -->
              <div class="mt-6">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-md font-medium text-gray-800 flex items-center">
                    <q-icon name="list" class="mr-2 text-green-600" />
                    Détails du type
                    <q-badge v-if="type.details.length" :label="type.details.length" color="green-6" class="ml-2" />
                  </h4>
                  <q-btn
                    icon="add"
                    color="green-6"
                    size="sm"
                    flat
                    round
                    @click="addDetail(typeIndex)"
                  >
                    <q-tooltip>Ajouter un détail</q-tooltip>
                  </q-btn>
                </div>

                <div v-if="type.details.length" class="space-y-4">
                  <draggable
                    v-model="type.details"
                    :item-key="'uid'"
                    handle=".detail-drag-handle"
                    ghost-class="ghost"
                    chosen-class="chosen"
                    drag-class="drag"
                  >
                    <template #item="{ element: detail, index: detailIndex }">
                      <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center">
                            <q-icon name="drag_indicator" class="detail-drag-handle text-gray-400 mr-2 cursor-move" size="xs" />
                            <span class="text-sm font-medium text-gray-700">Détail #{{ detailIndex + 1 }}</span>
                          </div>
                          <q-btn
                            icon="delete"
                            color="red-6"
                            size="xs"
                            flat
                            round
                            @click.stop="removeDetail(typeIndex, detail.uid)"
                            @mousedown.prevent
                          >
                            <q-tooltip>Supprimer ce détail</q-tooltip>
                          </q-btn>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <!-- Libellé du détail -->
                          <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">
                              Libellé <span class="text-red-500">*</span>
                            </label>
                            <q-input
                              v-model="detail.libelle"
                              outlined
                              dense
                              placeholder="Libellé du détail"
                              :rules="[val => !!val || 'Le libellé est requis']"
                            >
                              <template #prepend>
                                <q-icon name="label" class="text-blue-600" size="xs" />
                              </template>
                            </q-input>
                          </div>

                          <!-- Direction du détail -->
                          <div>
                            <label class="block text-xs font-medium text-gray-600 mb-1">
                              Direction
                            </label>
                            <q-select
                              v-model="detail.direction"
                              :options="directions"
                              option-value="DIRECTION"
                              option-label="DIRECTION"
                              emit-value
                              map-options
                              outlined
                              dense
                              placeholder="Direction"
                              clearable
                            >
                              <template #prepend>
                                <q-icon name="business" class="text-blue-600" size="xs" />
                              </template>
                            </q-select>
                          </div>

                          <!-- Statut Direction du détail -->
                          <div v-if="detail.direction">
                            <label class="block text-xs font-medium text-gray-600 mb-1">
                              Statut <span class="text-red-500">*</span>
                            </label>
                            <q-select
                              v-model="detail.statut_direction"
                              :options="statutOptions"
                              outlined
                              dense
                              placeholder="Sélectionnez un statut"
                            >
                              <template #prepend>
                                <q-icon name="assignment" class="text-blue-600" />
                              </template>
                            </q-select>
                          </div>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>

                <!-- Message si aucun détail -->
                <div v-else class="text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                  <q-icon name="info" size="1.5rem" class="text-gray-400 mb-1" />
                  <p class="text-gray-500 text-sm">Aucun détail ajouté. Cliquez sur "Ajouter un détail" pour commencer.</p>
                </div>
              </div>
                </div>
              </template>
            </draggable>

            <!-- Bouton pour ajouter un nouveau type (masqué en mode édition) -->
            <div v-if="!isEditMode" class="flex justify-center">
              <q-btn
                icon="add"
                color="blue-6"
                label="Ajouter un nouveau type"
                flat
                @click="addType"
                class="text-sm"
              />
            </div>
          </form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-white">
          <q-btn
            flat
            label="Annuler"
            color="grey"
            @click="closeDialog"
            class="px-6"
          />
          <q-btn
            :label="isEditMode ? 'Modifier' : 'Créer'"
            :color="isEditMode ? 'orange-6' : 'blue-6'"
            @click="updateTypeAndDetails"
            :loading="loading"
            :disable="!isFormValid"
            class="px-6"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import draggable from 'vuedraggable';

const props = defineProps({
  typeId: {
    type: [Number, String],
    required: true
  },
  typeData: {
    type: Object,
    required: true
  },
  ticketId: {
    type: [Number, String],
    required: true
  },
  ticketLibelle: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  },
  directions: {
    type: Array,
    default: () => []
  },
  isEditMode: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:show', 'saved']);

const $q = useQuasar();
const loading = ref(false);
const showDialog = ref(false);

// Options pour le statut de direction
const statutOptions = [
  'consultation',
  'traitement'
];

// Fonction pour générer un uid unique
const generateUid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Formulaire
const form = ref({
  id_btickes: props.ticketId,
  types: [
    {
      uid: generateUid(),
      libelle: '',
      direction: null,
      statut_direction: null,
      details: []
    }
  ]
});

// Validation du formulaire
const isFormValid = computed(() => {
  // Vérifier que chaque type a au moins un libellé
  for (const type of form.value.types) {
    if (!type.libelle) {
      return false;
    }

    // Si une direction est spécifiée, le statut est obligatoire
    if (type.direction && !type.statut_direction) {
      return false;
    }

    // Vérifier les champs obligatoires de chaque détail
    for (const detail of type.details) {
      if (!detail.libelle) {
        return false;
      }

      // Si une direction est spécifiée, le statut est obligatoire
      if (detail.direction && !detail.statut_direction) {
        return false;
      }
    }
  }

  return true;
});

// Watcher pour synchroniser la prop show avec showDialog
watch(() => props.show, (newVal) => {
  showDialog.value = newVal;
  if (newVal) {
    // Préremplir le formulaire avec les données du type existant
    populateForm();
  }
});

watch(showDialog, (newVal) => {
  emit('update:show', newVal);
});

// Watcher pour mettre à jour l'id du ticket si il change
watch(() => props.ticketId, (newVal) => {
  if (newVal) {
    form.value.id_btickes = newVal;
  }
});

// Méthodes
const populateForm = () => {
  if (props.typeData) {
    form.value = {
      id_btickes: props.ticketId,
      types: [
        {
          uid: generateUid(),
          libelle: props.typeData.libelle || '',
          direction: props.typeData.direction || null,
          statut_direction: props.typeData.statut_direction || null,
          details: (props.typeData.details || []).map(detail => ({
            uid: generateUid(),
            libelle: detail.libelle || '',
            direction: detail.direction || null,
            statut_direction: detail.statut_direction || null
          }))
        }
      ]
    };
  }
};

const addType = () => {
  form.value.types.push({
    uid: generateUid(),
    libelle: '',
    direction: null,
    statut_direction: null,
    details: []
  });
};

const removeType = (typeUid) => {
  const index = form.value.types.findIndex(type => type.uid === typeUid);
  if (index !== -1) {
    form.value.types.splice(index, 1);
  }
};

const addDetail = (typeIndex) => {
  form.value.types[typeIndex].details.push({
    uid: generateUid(),
    libelle: '',
    direction: null,
    statut_direction: null
  });
};

const removeDetail = (typeIndex, detailUid) => {
  const detailIndex = form.value.types[typeIndex].details.findIndex(detail => detail.uid === detailUid);
  if (detailIndex !== -1) {
    form.value.types[typeIndex].details.splice(detailIndex, 1);
  }
};

const resetForm = () => {
  form.value = {
    id_btickes: props.ticketId,
    types: [
      {
        uid: generateUid(),
        libelle: '',
        direction: null,
        statut_direction: null,
        details: []
      }
    ]
  };
};

const closeDialog = () => {
  showDialog.value = false;
};

const updateTypeAndDetails = async () => {
  if (!isFormValid.value) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez remplir tous les champs obligatoires'
    });
    return;
  }

  loading.value = true;

  try {
    console.log('Envoi des données de modification:', form.value);
    
    const response = await api.put(`/api/rec/type/${props.typeId}`, form.value);
    
    console.log('Réponse du serveur:', response.data);
    
    $q.notify({
      type: 'positive',
      message: response.data.message || 'Type modifié avec succès',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000
    });
    
    // Émettre l'événement saved avec les données
    emit('saved', response.data);
    
    // Fermer le dialog
    closeDialog();
    
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    
    let errorMessage = 'Erreur lors de la modification du type';
    
    if (error.response) {
      switch (error.response.status) {
        case 422:
          errorMessage = 'Données invalides. Veuillez vérifier les champs.';
          if (error.response.data.messages) {
            console.error('Erreurs de validation:', error.response.data.messages);
          }
          break;
        case 404:
          errorMessage = 'Le type à modifier n\'existe plus';
          break;
        case 500:
          errorMessage = error.response.data.message || 'Erreur serveur lors de la modification';
          break;
        default:
          errorMessage = error.response.data.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'Impossible de contacter le serveur';
    }
    
    $q.notify({
      type: 'negative',
      message: errorMessage,
      icon: 'error',
      position: 'top',
      timeout: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Styles pour le drag & drop */
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  border: 2px dashed #2196f3;
}

.chosen {
  transform: rotate(5deg);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.drag {
  transform: rotate(5deg);
  opacity: 0.8;
}
</style>