<template>
  <q-page
    v-if="authStore.isLoggedIn"
    class="flex justify-center bg-amber-50"
  >
    <div
      class="flex flex-col w-full flex-grow-1 mx-8 my-4"
    >
      <h1
        class="text-header-text text-2xl font-[500] mx-4 px-4"
      >
        Journal d'activités
      </h1>
      <div
        class="flex flex-col bg-white flex-grow rounded-xl m-4 p-4"
      >
        <div
          class="w-full flex justify-between items-end"
        >
          <div
            class="flex flex-col gap-2"
          >
            <q-input
              outlined
              dense
              v-model="search"
              label="Recherche"
            >
              <template v-slot:append>
                <q-icon name="close" @click="clearSearch" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
          <div
            class="flex flex-col justify-end"
          >
            <label
              class="text-gray-500 text-center"
            >
              Filtrer par date (Début ~ Fin)
            </label>
            <div
              class="w-full flex mt-2 flex justify-center gap-2"
            >
              <q-input
                label="Début"
                filled
                dense
                v-model="dateFilter.start"
                mask="date"
                class="my-0 py-0"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="dateFilter.start" ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                  <q-icon v-if="dateFilter.start" name="close" @click="clearDateFilter('start')" class="hover:cursor-pointer hover:bg-gray-200 rounded-full" />
                </template>
              </q-input>
              <q-input
                label="Fin"
                filled
                dense
                v-model="dateFilter.end"
                mask="date"
                class="my-0 py-0"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="dateFilter.end" ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                  <q-icon v-if="dateFilter.end" name="close" @click="clearDateFilter('start')" class="hover:cursor-pointer hover:bg-gray-200 rounded-full" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <q-table
          v-if="forceRender"
          class="my-4"
          :rows="rows"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[pagination.per_page]"
          :loading="loading"
        >
          <template v-slot:pagination>
            <div class="flex items-center gap-2 mx-4">
              <label>Nombre d'affaires par page</label>
              <q-select
                v-model="pagination.per_page"
                :options="[5, 10, 15]"
                outlined
                dense
                flat
              />
            </div>
            <q-pagination
              v-model="pagination.page"
              color="black"
              :min="1"
              :max="pagination.lastPage"
              :max-pages="pagination.lastPage"
              :input="true"
            />
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>

import {nextTick, onBeforeMount, reactive, ref, watch} from "vue";
import {useAuthStore} from "stores/auth";
import moment from "moment/moment";
import {api} from "boot/axios";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()

const pagination = ref({
  page: null,
  per_page: null,
  lastPage: null
})

let dateFilter = reactive({
  start: null,
  end: null
})
let search = ref()

const clearDateFilter = async (field) => {
  dateFilter[field] = null
  await fetchData()
}
const clearSearch = async () => {
  search.value = null
  await fetchData()
}

watch(
  search,
  async (newVal, oldVal) => {
    if (newVal && newVal.length >=4){
      await fetchData()
    }
  }
)

watch(
  dateFilter,
  async (newVal, oldVal) => {
    if (newVal && (newVal.start.length >=4 || newVal.end.length >=4)){
      await fetchData()
    }
  }
)

watch(
  () => [pagination.value.page, pagination.value.per_page],
  async (newVal, oldVal) => {
    if((newVal[0] && newVal[1]) && (JSON.stringify(newVal) !== JSON.stringify(oldVal))){
      await fetchData()
    }
  },
  {
    deep: true,
  }
);

let columns = reactive([
  { name: 'id', label: 'ID', align: 'left', field: row => row.id, format: val => `${val}`, sortable: true },
  { name: 'Matricule', label: 'Matricule', align: 'left', field: row => row.Matricule, format: val => `${val}`, sortable: true },
  { name: 'name', label: 'Nom complet', align: 'left', field: row => row.user?.Nom +' '+ row.user?.Prénom, format: val => `${val}`, sortable: true },
  { name: 'agence', label: 'Direction/Agence', align: 'left', field: row => row.user?.agence?.Nom_DR +'/'+ row.user?.agence?.nom_ag, format: val => `${val}`, sortable: true },
  { name: 'ip', label: 'Adresse IP', align: 'left', field: row => row.ip, format: val => `${val}`, sortable: true },
  { name: 'route', label: 'Route', align: 'left', field: row => row.route, format: val => `${val}`, sortable: true, style: 'white-space: pre-wrap;' },
  { name: 'time', label: 'Date/Heure', align: 'left', field: row => moment(row.time).format('YYYY-MM-DD HH:mm'), format: val => `${val}`, sortable: true, style: 'white-space: pre-wrap;' },
]);
let rows = ref([])
let loading = ref(false)
let forceRender = ref(true)

const handleForceRender = async () => {
  forceRender.value = false
  await nextTick()
  forceRender.value = true
}

onBeforeMount(async () => {
  await fetchData()
})
const fetchData = async () => {
  loading.value = true
  await api
    .post(
      '/api/log-history',
      {
        startDate: dateFilter.start,
        endDate: dateFilter.end,
        search: search.value,
        page: pagination.value.page,
        per_page: pagination.value.per_page,
      }
    )
    .then(async (res) => {
      rows.value = res.data.data
      pagination.value.page = res.data.current_page
      pagination.value.per_page = res.data.per_page
      pagination.value.lastPage = res.data.last_page
      await handleForceRender()
    })
    .catch((error) => {
      console.log(error)
    })
  loading.value = false
}

</script>

<style scoped>

</style>
