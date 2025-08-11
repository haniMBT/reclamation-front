<template>
  <div class="w-full flex justify-center h-full mt-20 mb-20 items-center">
    <div class="w-[95%] lg:w-[90%]">
      <q-table title="Volets" :rows="volets" :columns="columns" :rows-per-page-options="[0]" row-key="id" separator="cell"
      :pagination="paginationOptions">
        <template v-slot:pagination>
          <div class="flex items-center gap-2 mx-4">
            <label>Lignes par page</label>
            <q-select v-model="pagination.per_page" :options="[10, 15, 25, 50]" outlined dense flat />
          </div>
          <q-pagination v-model="pagination.page" color="black" :min="1" :max="pagination.lastPage" :input="true" />
        </template>
        <template v-slot:top>
          <div class="w-full flex justify-center">
            <q-btn color="primary" icon="add" no-caps size="md" dense @click="showAddModalVolet = true"
              class="w-fit h-fit" v-if="authStore.privileges.insertion">
              <q-tooltip class="text-sm" :offset="[5, 5]"> Ajouter un volet </q-tooltip>
            </q-btn>
            <p class="text-md self-center flex flex-1 justify-center">Les volets</p>
            <q-input v-model="search" placeholder="Rechercher..." dense outlined label-color="black"
              class="w-[30%] lg:w-[25%]" :debounce="500" />
          </div>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="flex justify-center gap-1">
              <!-- <q-btn flat dense icon="edit" color="warning" @click="updateVolet(props.row.id)">
              <q-tooltip class="text-sm" :offset="[5, 5]"> Modifier le volet </q-tooltip>
              </q-btn> -->
              <q-btn flat dense icon="delete" color="red" @click="deleteVolet(props.row.id)" v-if="authStore.privileges.suppression">
                <q-tooltip class="text-sm" :offset="[5, 5]"> Supprimer le volet </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>


  <ModalV2 :show="showAddModalVolet" :title="titleModal" @close="showAddModalVolet = false">
    <template v-slot:body>
      <q-form @submit.prevent="addNewVolet" class="px-1 py-1 pl-2 pr-2 m-2">
        <q-input v-model="volet.module" label="Module" maxlength="250" outlined label-color="black" autogrow autofocus
        :rules="[(val) => (val && val.length > 0) || 'Remplir le module']" />
        <q-input v-model="volet.volet" label="Volet" maxlength="250" outlined label-color="black" autogrow
          :rules="[(val) => (val && val.length > 0) || 'Remplir le volet']" />
        <q-input v-model="volet.description" label="Description" maxlength="250" outlined label-color="black" autogrow
          :rules="[(val) => (val && val.length > 0) || 'Remplir la description']" />
        <div class="flex justify-end">
          <q-btn type="submit" icon="save" color="green">
            <q-tooltip class="text-sm" :offset="[5, 5]"> Enregistrer </q-tooltip>
          </q-btn>
        </div>
      </q-form>
    </template>
  </ModalV2>
</template>

<script setup>
import { onBeforeMount, ref, reactive, watch } from "vue";
import ModalV2 from 'src/components/ModalV2.vue';
import { api } from "src/boot/axios";
import { showNotification } from "src/js/helpers";
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
  await api.get('/api/volets',
    {
      params: {
        page: pagination.page,
        per_page: pagination.per_page,
        lastPage: pagination.lastPage,
        search: search.value
      }
    })
    .then(res => {
      volets.value = res.data.data.volets;
      Object.assign(pagination, res.data.data.pagination);
    })
    .catch(err => {
      console.error('error :', err);
    });
}

onBeforeMount(() => {
  authStore.setProperty('volet', 'utilisateurs');
  if(authStore.privileges.consultation == false) {
    router.push('/unathorized');
  }
  fetchVolets()
});

const addNewVolet = async () => {
  await api.post('/api/volets', volet)
    .then(res => {
      showAddModalVolet.value = false;
      showNotification($q, 'positive', 'check', res.data.message, 'center', '500');
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
        showNotification($q, 'positive', 'check', res.data.message, 'center', '500');
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
