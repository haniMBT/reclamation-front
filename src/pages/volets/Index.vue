<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="view_list" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Volets</h1>
            <p class="text-gray-600 text-sm">Administration des volets applicatifs et modules</p>
          </div>
        </div>
      </div>

      <!-- Toolbar Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <q-btn
              color="blue-6"
              icon="add"
              no-caps
              size="md"
              dense
              @click="showAddModalVolet = true"
              v-if="authStore.privileges.insertion=1"
              class="px-6"
            >
              Ajouter un volet
            </q-btn>
            <q-input
              v-model="search"
              placeholder="Rechercher un volet..."
              dense
              outlined
              class="min-w-[300px]"
              :debounce="500"
            >
              <template #prepend>
                <q-icon name="search" class="text-blue-600" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <q-table
          flat
          :rows="volets"
          :columns="columns"
          :rows-per-page-options="[0]"
          row-key="id"
          separator="cell"
          :pagination="paginationOptions"
          class="my-4"
        >
          <template v-slot:pagination>
            <div class="flex items-center gap-2 mx-4">
              <label class="text-sm font-medium text-gray-700">Lignes par page</label>
              <q-select
                v-model="pagination.per_page"
                :options="[10, 15, 25, 50]"
                outlined
                dense
                flat
              />
            </div>
            <q-pagination
              v-model="pagination.page"
              color="blue-6"
              :min="1"
              :max="pagination.lastPage"
              :input="true"
            />
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="flex justify-center gap-1">
                <q-btn
                  flat
                  dense
                  icon="delete"
                  color="red"
                  @click="deleteVolet(props.row.id)"
                  v-if="authStore.privileges.suppression=1"
                  class="hover:bg-red-50"
                >
                  <q-tooltip class="text-sm" :offset="[5, 5]">Supprimer le volet</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Add Volet Dialog -->
      <q-dialog v-model="showAddModalVolet" persistent>
        <q-card class="w-full max-w-2xl">
          <q-card-section class="flex items-center bg-blue-50">
            <q-icon name="add" class="text-blue-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-blue-900">{{ titleModal }}</div>
              <div class="text-sm text-blue-700">Créez un nouveau volet applicatif</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg">
            <q-form @submit.prevent="addNewVolet" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Module <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="volet.module"
                  label="Module"
                  maxlength="250"
                  outlined
                  autogrow
                  autofocus
                  :rules="[(val) => (val && val.length > 0) || 'Remplir le module']"
                  placeholder="Entrez le nom du module"
                >
                  <template #prepend>
                    <q-icon name="apps" class="text-blue-600" />
                  </template>
                </q-input>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Volet <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="volet.volet"
                  label="Volet"
                  maxlength="250"
                  outlined
                  autogrow
                  :rules="[(val) => (val && val.length > 0) || 'Remplir le volet']"
                  placeholder="Entrez le nom du volet"
                >
                  <template #prepend>
                    <q-icon name="view_list" class="text-blue-600" />
                  </template>
                </q-input>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="volet.description"
                  label="Description"
                  maxlength="250"
                  outlined
                  autogrow
                  :rules="[(val) => (val && val.length > 0) || 'Remplir la description']"
                  placeholder="Entrez la description du volet"
                >
                  <template #prepend>
                    <q-icon name="description" class="text-blue-600" />
                  </template>
                </q-input>
              </div>

              <div class="flex justify-end gap-3">
                <q-btn
                  flat
                  color="grey-7"
                  label="Annuler"
                  @click="showAddModalVolet = false"
                  class="px-6"
                />
                <q-btn
                  type="submit"
                  icon="save"
                  color="blue-6"
                  class="px-8"
                >
                  Enregistrer
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive, watch } from "vue";
// ModalV2 remplacé par q-dialog
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";
const router = useRouter();

const volets = ref([])
const pagination = reactive({
  per_page: 10,
  page: 1,
  lastPage: 1
});
const paginationOptions = ref({ page: pagination.page, per_page: pagination.per_page });
const search = ref('')
const showAddModalVolet = ref(false)
const titleModal = ref('Ajouter un volet')
const $q = useQuasar()
const volet = reactive({
  volet: '',
  module: '',
  description: ''
});

const initialVolet = { ...volet };
const authStore = useAuthStore();


const columns = [
  { name: 'action', label: 'Action', align: 'center' },
  { name: 'module', label: 'Module', field: (row) => row.module, align: 'center', sortable: true },
  { name: 'volet', label: 'Volet', field: (row) => row.volet, align: 'center', sortable: true },
  { name: 'description', label: 'Description', field: (row) => row.description, align: 'center', sortable: true },
];

const fetchVolets = async () => {
  try {
    const res = await api.get('/api/volets', {
      params: {
        page: pagination.page,
        per_page: pagination.per_page,
        lastPage: pagination.lastPage,
        search: search.value
      }
    });

      console.log('volets :', res.data.volets);
      volets.value = res.data.volets;
      Object.assign(pagination, res.data.pagination);

  } catch (err) {
    console.error('error :', err);
  }
};



onBeforeMount(() => {
  // authStore.setProperty('volet', 'utilisateurs');
  // if(authStore.privileges.consultation == false) {
  //   router.push('/unathorized');
  // }
   fetchVolets()
});

const addNewVolet = async () => {
  await api.post('/api/volets', volet)
    .then(res => {
      showAddModalVolet.value = false;
      // showNotification($q, 'positive', 'check', res.data.message, 'center', '500');
      Object.assign(volet, initialVolet);
      fetchVolets()
    })
    .catch(err => {
      console.error('err :', err);
      showAddModalVolet.value = false;
    });

};

const deleteVolet = (id) => {
  $q.dialog({
    title: 'Confirmation',
    message: 'Voulez vous supprimer ce volet ?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await api.delete(`/api/volets/${id}`)
      .then(res => {
        // showNotification($q, 'positive', 'check', res.data.message, 'center', '500');
        fetchVolets()
      })
      .catch(err => {
        console.error('err :', err)
      })
  });

};

watch(
  () => [
    pagination.page,
    search.value,
    pagination.per_page
  ],
  () => {
    fetchVolets();
  }
);


</script>
