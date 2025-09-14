<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="settings" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Tickets</h1>
            <p class="text-gray-600 text-sm">Administration des tickets de réclamation</p>
          </div>
        </div>
      </div>

      <!-- Toolbar Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <q-btn
              icon="add"
              color="blue-6"
              no-caps
              @click="openAddTicket"
              class="px-6"
            >
              Ajouter un ticket
            </q-btn>
            <q-input
              outlined
              dense
              v-model="searchTickets"
              label="Rechercher un ticket"
              class="min-w-[300px]"
            >
              <template #prepend>
                <q-icon name="search" class="text-blue-600" />
              </template>
              <template #append>
                <q-icon
                  name="close"
                  @click="clearSearchTickets"
                  class="cursor-pointer text-gray-500 hover:text-gray-700"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <!-- Liste des tickets avec affichage hiérarchisé -->
        <div class="space-y-4">
          <q-expansion-item
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            :label="ticket.libelle"
            :caption="`Direction: ${ticket.direction}`"
            icon="confirmation_number"
            class="bg-white shadow-sm rounded-lg overflow-hidden"
            header-class="bg-blue-50 text-blue-900 font-medium"
          >
            <template #header>
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <q-icon name="confirmation_number" class="text-blue-600" size="1.5rem" />
                  <div>
                    <div class="font-semibold text-gray-900">{{ ticket.libelle }}</div>
                    <div class="text-sm text-gray-600">Direction: {{ ticket.direction }}</div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <q-btn
                    icon="delete"
                    size="sm"
                    flat
                    round
                    color="negative"
                    @click.stop="openDeleteTicket(ticket)"
                  >
                    <q-tooltip>Supprimer</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="edit"
                    size="sm"
                    flat
                    round
                    color="primary"
                    @click.stop="openEditTicket(ticket)"
                  >
                    <q-tooltip>Modifier</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="add"
                    size="sm"
                    flat
                    round
                    color="green-6"
                    @click.stop="openAddTypeDetail(ticket)"
                  >
                    <q-tooltip>Ajouter un type et ses détails</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>

            <div class="p-6 bg-gray-50">
              <!-- Document à fournir -->
              <div v-if="ticket.documentAfornir" class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <q-icon name="description" class="mr-2 text-gray-500" />
                  Document à fournir
                </h4>
                <div class="bg-white p-3 rounded border text-sm" v-html="ticket.documentAfornir"></div>
              </div>

              <!-- Section Infos générales -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <q-icon name="info" class="mr-2 text-blue-500" />
                  Informations générales
                  <q-badge v-if="ticket.infos_generales?.length" :label="ticket.infos_generales.length" color="blue-6" class="ml-2" />
                </h4>
                <q-list v-if="ticket.infos_generales?.length" bordered separator class="rounded bg-white">
                  <q-item
                    v-for="info in ticket.infos_generales"
                    :key="info.id"
                    class="py-3"
                  >
                    <q-item-section avatar>
                      <q-icon
                        :name="info.key_attribut ? 'star' : 'info_outline'"
                        :color="info.key_attribut ? 'amber-6' : 'blue-grey-5'"
                        size="1.2rem"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="font-medium">{{ info.libelle }}</q-item-label>
                      <q-item-label v-if="info.key_attribut" caption class="text-amber-600">
                        <q-icon name="star" size="xs" class="mr-1" />
                        Information clé
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
                  <q-icon name="info_outline" size="1.5rem" class="mb-2" />
                  <p class="text-sm">Aucune information générale</p>
                </div>
              </div>

              <!-- Section Types -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <q-icon name="category" class="mr-2 text-green-500" />
                  Types
                  <q-badge v-if="ticket.types?.length" :label="ticket.types.length" color="green-6" class="ml-2" />
                </h4>
                <div v-if="ticket.types?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <q-card
                    v-for="type in ticket.types"
                    :key="type.id"
                    class="bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <q-card-section class="pb-2">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h5 class="font-semibold text-gray-900 mb-1">{{ type.libelle }}</h5>
                          <p class="text-sm text-gray-600 mb-2">
                            <q-icon name="business" size="xs" class="mr-1" />
                            {{ type.direction || 'Non spécifiée' }}
                          </p>
                          <q-badge
                            :color="getStatutColor(type.statut_direction)"
                            :label="type.statut_direction || 'Non défini'"
                            class="text-xs"
                          />
                        </div>
                      </div>
                    </q-card-section>

                    <!-- Section Détails du type -->
                    <q-card-section v-if="type.details?.length" class="pt-0">
                      <q-separator class="mb-3" />
                      <h6 class="text-xs font-medium text-gray-600 mb-2 flex items-center">
                        <q-icon name="list" size="xs" class="mr-1" />
                        Détails ({{ type.details.length }})
                      </h6>
                      <q-table
                        :rows="type.details"
                        :columns="detailColumns"
                        row-key="id"
                        flat
                        dense
                        :rows-per-page-options="[0]"
                        hide-pagination
                        class="text-xs"
                      >
                        <template #body-cell-statut_direction="props">
                          <q-td :props="props">
                            <q-badge
                              :color="getStatutColor(props.value)"
                              :label="props.value || 'Non défini'"
                              class="text-xs"
                            />
                          </q-td>
                        </template>
                      </q-table>
                    </q-card-section>
                    <q-card-section v-else class="pt-0">
                      <q-separator class="mb-3" />
                      <div class="text-center py-2 text-gray-400">
                        <q-icon name="list" size="1rem" class="mb-1" />
                        <p class="text-xs">Aucun détail</p>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div v-else class="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
                  <q-icon name="category" size="1.5rem" class="mb-2" />
                  <p class="text-sm">Aucun type défini</p>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </div>

      <!-- Add Ticket Dialog -->
      <q-dialog v-model="addTicket" persistent>
        <q-card class="w-full" style="min-width: 60vw; max-width: 80vw; max-height: 80vh; display: flex; flex-direction: column;">
          <q-card-section class="flex items-center bg-blue-50">
            <q-icon name="add" class="text-blue-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-blue-900">Ajouter un ticket</div>
              <div class="text-sm text-blue-700">Remplissez les informations du ticket</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
              <form class="space-y-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Formulaire ticket existant -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Libellé du ticket <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.libelle"
                      outlined
                      dense
                      placeholder="Entrez le libellé du ticket"
                      :rules="[val => !!val || 'Le libellé est requis']"
                    >
                      <template #prepend>
                        <q-icon name="label" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.libelle" :myerrors="myerrors?.libelle" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Direction <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.direction"
                      :options="directions"
                      option-value="DIRECTION"
                      option-label="DIRECTION"
                      emit-value
                      map-options
                      outlined
                      dense
                      placeholder="Sélectionnez une direction"
                      :rules="[val => !!val || 'La direction est requise']"
                    >
                      <template #prepend>
                        <q-icon name="business" class="text-blue-600" />
                      </template>
                    </q-select>
                    <ErrorValidation v-if="myerrors?.direction" :myerrors="myerrors?.direction" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Document à fournir
                    </label>
                    <q-editor
                      v-model="form.documentAfornir"
                      min-height="5rem"
                      :toolbar="[
                        ['bold', 'italic', 'underline'],
                        ['unordered', 'ordered'],
                        ['undo', 'redo']
                      ]"
                    />
                    <ErrorValidation v-if="myerrors?.documentAfornir" :myerrors="myerrors?.documentAfornir" />
                  </div>

                  <!-- Nouvelle section : Infos générales -->
                  <div class="border-t pt-6">
                    <div class="flex items-center justify-between mb-4">
                      <label class="block text-sm font-medium text-gray-700">
                        Infos générales
                      </label>
                      <q-btn
                        icon="add"
                        color="green-6"
                        size="sm"
                        outline
                        @click="addInfoGenerale"
                        class="px-4"
                      >
                        Ajouter une info générale
                      </q-btn>
                    </div>

                    <!-- Liste des infos générales -->
                    <div v-if="form.infos_generales.length > 0" class="space-y-3">
                      <div
                        v-for="(info, index) in form.infos_generales"
                        :key="index"
                        class="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div class="flex items-start space-x-3">
                          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Libellé -->
                            <div>
                              <label class="block text-xs font-medium text-gray-600 mb-1">
                                Libellé
                              </label>
                              <q-input
                                v-model="info.libelle"
                                outlined
                                dense
                                placeholder="Entrez le libellé"
                              >
                                <template #prepend>
                                  <q-icon name="text_fields" class="text-gray-500" size="sm" />
                                </template>
                              </q-input>
                            </div>

                            <!-- Key attribut -->
                            <div class="flex items-center">
                                <q-checkbox
                                      v-model="info.key_attribut"
                                      color="blue-6"
                                      label="Information clé"
                                      class="text-xs font-medium text-gray-600"
                                />
                            </div>
                          </div>

                          <!-- Bouton supprimer -->
                          <q-btn
                            icon="close"
                            size="sm"
                            flat
                            round
                            color="negative"
                            @click="removeInfoGenerale(index)"
                            class="mt-1"
                          >
                            <q-tooltip>Supprimer cette info générale</q-tooltip>
                          </q-btn>
                        </div>
                      </div>
                    </div>

                    <!-- Message si aucune info générale -->
                    <div v-else class="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                      <q-icon name="info" size="1.5rem" class="mb-2" />
                      <p class="text-sm">Aucune info générale ajoutée</p>
                    </div>
                  </div>
                </div>
              </form>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn
              flat
              label="Annuler"
              color="grey"
              @click="closeAddTicket"
              class="px-6"
            />
            <q-btn
              label="Enregistrer"
              color="blue-6"
              @click="sendData"
              :loading="loading"
              class="px-6"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Ticket Dialog -->
      <q-dialog v-model="deleteTicket" persistent>
        <q-card class="w-full max-w-md" style="display: flex; flex-direction: column;">
          <q-card-section class="flex items-center bg-red-50">
            <q-icon name="warning" class="text-red-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-red-900">Confirmer la suppression</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg" style="flex: 1;">
            <p class="text-gray-700">
              Êtes-vous sûr de vouloir supprimer le ticket "{{ selectedTicket?.libelle }}" ?
            </p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn
              flat
              label="Annuler"
              color="grey"
              @click="closeDeleteTicket"
              class="px-6"
            />
            <q-btn
              label="Supprimer"
              color="negative"
              @click="deleteData"
              :loading="loading"
              class="px-6"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
  <!-- Type Detail Dialog -->
  <TypeDetail
    v-model:show="showTypeDetail"
    :ticket-id="selectedTicket?.id"
    :ticket-libelle="selectedTicket?.libelle"
    :directions="directions"
    @saved="onTypeSaved"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import ErrorValidation from 'components/ErrorValidation.vue';
import TypeDetail from './TypeDetail.vue';

// Reactive variables
const tickets = ref([]);
const directions = ref([]);
const searchTickets = ref('');
const addTicket = ref(false);
const deleteTicket = ref(false);
const showTypeDetail = ref(false);
const selectedTicket = ref(null);
const loading = ref(false);
const loadingTickets = ref(false);
const myerrors = ref();
const message = ref();

// Form data
const form = ref({
  libelle: '',
  direction: '',
  documentAfornir: '',
  infos_generales: []
});

// Table configuration
const showTicketsTable = computed(() => tickets.value.length > 0);

const ticketsCols = ref([
  {
    name: 'Actions',
    label: 'Actions',
    field: 'Actions',
    align: 'center',
    sortable: false,
  },
  {
    name: 'libelle',
    required: true,
    label: 'Libellé',
    align: 'left',
    field: row => row.libelle,
    format: val => `${val}`,
    sortable: true,
  },
  {
    name: 'direction',
    label: 'Direction',
    align: 'left',
    field: row => row.direction,
    format: val => `${val}`,
    sortable: true,
  },
  {
    name: 'documentAfornir',
    label: 'Document à fournir',
    align: 'left',
    field: row => row.documentAfornir,
    format: val => `${val}`,
    sortable: true,
  },
]);

const initialPagination = ref({
  rowsPerPage: 10
});

const $q = useQuasar();

// Methods
const fetchData = async () => {
  loadingTickets.value = true;
  try {
    const response = await api.get('/api/rec/parametrage');
    tickets.value = response.data.tickets || [];
    directions.value = response.data.directions || [];
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des données'
    });
  } finally {
    loadingTickets.value = false;
  }
};

const openAddTicket = () => {
  form.value = {
    libelle: '',
    direction: '',
    documentAfornir: '',
    infos_generales: []
  };
  myerrors.value = null;
  addTicket.value = true;
};

const closeAddTicket = () => {
  addTicket.value = false;
  form.value = {
    libelle: '',
    direction: '',
    documentAfornir: '',
    infos_generales: []
  };
  myerrors.value = null;
};

const openDeleteTicket = (ticket) => {
  selectedTicket.value = ticket;
  deleteTicket.value = true;
};

const closeDeleteTicket = () => {
  deleteTicket.value = false;
  selectedTicket.value = null;
};

const openEditTicket = (ticket) => {
  // TODO: Implement edit functionality
  console.log('Edit ticket:', ticket);
};

const clearSearchTickets = () => {
  searchTickets.value = '';
};

const sendData = async () => {
  loading.value = true;
  myerrors.value = null;

  const data = {
    libelle: form.value.libelle,
    direction: form.value.direction,
    documentAfornir: form.value.documentAfornir,
    infos_generales: form.value.infos_generales
  };

  try {
    const response = await api.post('/api/rec/parametrage', data);
    message.value = response.data.message;
    $q.notify({
      type: 'positive',
      message: message.value
    });
    closeAddTicket();
    await fetchData(); // Refresh the list
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    if (error.response && error.response.status === 422) {
      myerrors.value = error.response.data.errors;
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erreur lors de l\'enregistrement du ticket'
      });
    }
  } finally {
    loading.value = false;
  }
};

// Méthodes pour la gestion des infos générales
const addInfoGenerale = () => {
  form.value.infos_generales.push({
    libelle: '',
    key_attribut: false
  });
};

const removeInfoGenerale = (index) => {
  form.value.infos_generales.splice(index, 1);
};

const deleteData = async () => {
  loading.value = true;

  try {
    const response = await api.delete(`/api/rec/parametrage/${selectedTicket.value.id}`);
    message.value = response.data.message;
    $q.notify({
      type: 'positive',
      message: message.value
    });
    closeDeleteTicket();
    await fetchData(); // Refresh the list
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la suppression du ticket'
    });
  } finally {
    loading.value = false;
  }
};

// Computed property for filtered tickets
const filteredTickets = computed(() => {
  if (!searchTickets.value) {
    return tickets.value;
  }
  const needle = searchTickets.value.toLowerCase();
  return tickets.value.filter(ticket =>
    ticket.libelle?.toLowerCase().includes(needle) ||
    ticket.direction?.toLowerCase().includes(needle)
  );
});

// Méthode pour ouvrir le dialog d'ajout de type et détails
const openAddTypeDetail = (ticket) => {
  selectedTicket.value = ticket;
  showTypeDetail.value = true;
};

// Méthode appelée après l'enregistrement d'un type et ses détails
const onTypeSaved = (data) => {
  // Vous pouvez ajouter ici une logique supplémentaire si nécessaire
  // Par exemple, rafraîchir les données
  fetchData();
};

// Méthode pour obtenir la couleur du statut
const getStatutColor = (statut) => {
  switch (statut) {
    case 'Actif':
      return 'green-6';
    case 'Inactif':
      return 'red-6';
    case 'En attente':
      return 'orange-6';
    default:
      return 'grey-6';
  }
};

// Colonnes pour les détails des types
const detailColumns = ref([
  {
    name: 'libelle',
    label: 'Libellé',
    field: 'libelle',
    align: 'left',
    sortable: true
  },
  {
    name: 'direction',
    label: 'Direction',
    field: 'direction',
    align: 'left',
    sortable: true
  },
  {
    name: 'statut_direction',
    label: 'Statut',
    field: 'statut_direction',
    align: 'center',
    sortable: true
  }
]);

// Watch for search changes
watch(searchTickets, () => {
  // Update table data when search changes
  // This could be implemented with a computed property or by updating the table directly
});

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
