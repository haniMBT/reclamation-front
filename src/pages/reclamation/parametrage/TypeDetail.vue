<template>
  <div>
    <!-- Dialog pour ajouter un type et ses détails -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="w-full" style="min-width: 60vw; max-width: 80vw; max-height: 80vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-blue-50">
          <q-icon name="add" class="text-blue-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-blue-900">Ajouter des types et leurs détails</div>
            <div class="text-sm text-blue-700">Pour le ticket: {{ ticketLibelle }}</div>
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
                  v-if="form.types.length > 1"
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
              <div class="mt-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-md font-medium text-gray-700">Détails</h4>
                  <q-btn
                    icon="add"
                    color="green-6"
                    label="Ajouter un détail"
                    flat
                    @click="addDetail(typeIndex)"
                    class="text-sm"
                  />
                </div>

                <!-- Liste des détails -->
                <div v-if="type.details.length > 0" class="space-y-4">
                  <draggable
                    v-model="type.details"
                    :item-key="'uid'"
                    handle=".detail-drag-handle"
                    ghost-class="ghost"
                    chosen-class="chosen"
                    drag-class="drag"
                  >
                    <template #item="{ element: detail, index: detailIndex }">
                      <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div class="flex justify-between items-center mb-3">
                      <div class="flex items-center">
                        <q-icon name="drag_indicator" class="detail-drag-handle text-gray-400 mr-2 cursor-move" size="xs" />
                        <h5 class="text-sm font-medium text-gray-700">Détail #{{ detailIndex + 1 }}</h5>
                      </div>
                      <q-btn
                        icon="delete"
                        color="red-6"
                        flat
                        round
                        dense
                        @click.stop="removeDetail(typeIndex, detail.uid)"
                        @mousedown.prevent
                      >
                        <q-tooltip>Supprimer ce détail</q-tooltip>
                      </q-btn>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- Libellé du détail -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Libellé <span class="text-red-500">*</span>
                        </label>
                        <q-input
                          v-model="detail.libelle"
                          outlined
                          dense
                          placeholder="Entrez le libellé du détail"
                          :rules="[val => !!val || 'Le libellé est requis']"
                        >
                          <template #prepend>
                            <q-icon name="label" class="text-blue-600" />
                          </template>
                        </q-input>
                      </div>

                      <!-- Direction du détail -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
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
                          placeholder="Sélectionnez une direction"
                          clearable
                        >
                          <template #prepend>
                            <q-icon name="business" class="text-blue-600" />
                          </template>
                        </q-select>
                      </div>

                      <!-- Statut Direction du détail (apparaît uniquement si une direction est sélectionnée) -->
                      <div v-if="detail.direction">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Statut Direction <span class="text-red-500">*</span>
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

            <!-- Bouton pour ajouter un nouveau type -->
            <div class="flex justify-center">
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
            label="Enregistrer"
            color="blue-6"
            @click="saveTypeAndDetails"
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

// Watcher pour synchroniser ticketId avec form.id_btickes
watch(() => props.ticketId, (newVal) => {
  console.log('TypeDetail: ticketId changed to:', newVal);
  form.value.id_btickes = newVal;
}, { immediate: true });

// Synchroniser le prop show avec la variable locale showDialog
watch(() => props.show, (newVal) => {
  showDialog.value = newVal;
  // Réinitialiser le formulaire à chaque ouverture
  if (newVal) {
    resetForm();
  }
});

watch(() => showDialog.value, (newVal) => {
  emit('update:show', newVal);
  if (!newVal) {
    resetForm();
  }
});

// Méthodes
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
    id_btickes: props.ticketId, // Utilise toujours la valeur actuelle du prop
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

const saveTypeAndDetails = async () => {
  if (!isFormValid.value) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez remplir tous les champs obligatoires'
    });
    return;
  }

  loading.value = true;

  try {
    const response = await api.post('/api/rec/type', form.value);

    $q.notify({
      type: 'positive',
      message: 'Types et détails enregistrés avec succès'
    });

    emit('saved', response.data);
    closeDialog();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);

    let errorMessage = 'Erreur lors de l\'enregistrement';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0];
      errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
    }

    $q.notify({
      type: 'negative',
      message: errorMessage
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.chosen {
  background: #e3f2fd;
}

.drag {
  background: #bbdefb;
}

.drag-handle {
  cursor: move;
}

.detail-drag-handle {
  cursor: move;
}
</style>