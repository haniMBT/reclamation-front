<template>
  <q-page class="flex justify-center bg-amber-50">
    <div class="flex flex-col w-full flex-grow-1 mx-8 my-4">
      <h1 class="text-header-text text-2xl font-[500] mx-4 px-4">
        Sécurité
      </h1>
      <div
        class="flex flex-col bg-white flex-grow rounded-xl m-4 p-4"
      >
        <div class="w-full flex justify-between items-end">
          <div class="flex flex-col gap-2">
            <q-btn icon="add" color="purple" no-caps @click="openAddModel" v-if="authStore.privileges.insertion=true">
              Ajouter un profil
            </q-btn>
            <q-input
              outlined
              v-model="searchProfils"
              label="Recherche"
              dense
            >
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="clearSearchProfils"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <!-- v-model="searchProfils" -->
          </div>
        </div>
        <Modal primaryIcon=""
          :show="addProfil"
          title="Ajouter un profil"
          @close="closeAddProfil"
          primaryBtnText="Enregistrer le nouveau profil"
          secondaryBtnText=""
          @click-primary-btn="sendData"
          @click-secondary-btn=""
        >
          <form class="h-96 overflow-auto">
            <div class="grid gap-2 mb-2 md:grid-cols-2">
              <div class="mb-2">
                <label
                  for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Code <span style="color: red">*</span></label>
                <input
                  type="text"
                  v-model="form.code"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="exemple:N"
                  required
                />
                <ErrorValidation
                  v-if="myerrors?.code"
                  :myerrors="myerrors?.code"
                />
              </div>
              <div class="mb-2">
                <label
                  for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Libelle <span style="color: red">*</span></label
                >
                <input
                  type="text"
                  v-model="form.libelle"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="libelle "
                  required
                />
                <ErrorValidation
                  v-if="myerrors?.libelle"
                  :myerrors="myerrors?.libelle"
                />
              </div>
              </div>
                  <div class="grid gap-2 mb-2 md:grid">

              <div class="mb-2">
                <label
                  for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Description</label
                >
                <input
                  type="text"
                  v-model="form.description"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="description "
                  required
                />
                <ErrorValidation
                  v-if="myerrors?.description"
                  :myerrors="myerrors?.description"
                />
              </div>
              </div>
              <div class="mb-2">
                <div class="w-full mb-2">
                  <label
                    for="countries"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Visibilité <span style="color: red">*</span></label
                  >
                  <DropDownButtonWithIcon
                    title="Visibilité"
                    keyName="code"
                    valName="value"
                    :items="limitations"
                    :selected="form.limitation"
                    @select-item="(val) => (form.limitation = val)"
                  />
                  <ErrorValidation
                    v-if="myerrors?.limitation"
                    :myerrors="myerrors?.limitation"
                  />
                </div>
              </div>
              <!-- <div class="mb-2">
                <div class="w-full mb-2">
                  <label
                    for="countries"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >fonction </label
                  >
                    <q-select
                      v-model="form.fonction"
                      use-input
                      input-debounce="0"
                      label="Fonction"
                      option-value="LibelleFct"
                      option-label="LibelleFct"
                      :options="options"
                      @filter="filterFn"
                      outlined
                      clearable
                    >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <ErrorValidation
                    v-if="myerrors?.fonction"
                    :myerrors="myerrors?.fonction"
                  />
                </div>
              </div> -->
              <div class="mb-2">
                <div class="w-full mb-2">
                  <label
                    for="countries"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Role <span style="color: red">*</span></label
                  >
                  <DropDownButtonWithIcon
                    title="Role"
                    keyName="code"
                    valName="value"
                    :items="Roles"
                    :selected="form.role"
                    @select-item="(val) => (form.role = val)"
                  />
                  <ErrorValidation
                    v-if="myerrors?.role"
                    :myerrors="myerrors?.role"
                  />
                </div>
              </div>
          </form>
        </Modal>
        <Modal primaryIcon=""
          :show="deleteProfil"
          :title="'Supprimer le profil :' + ' '+Code"
          @close="closeDeleteProfil"
          primaryBtnText="supprimer"
          secondaryBtnText=""
          @click-primary-btn="deleteData"
          @click-secondary-btn=""
        >
          <q-text class="text-h6"
            >Êtes-vous sûr de vouloir confirmer la suppression ?
          </q-text>
        </Modal>
        <q-table
          v-if="showProfilstable"
          class="my-4"
          :rows="profils"
          :columns="profilsCols"
          :pagination="initialPagination"
        >
          <template v-slot:body="props">
            <!--  -->
            <q-tr
              v-if="!loadingAffaires"
              :props="props"
              :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }"
            >
              <q-td key="Actions" :props="props">
                  <!-- v-if="authStore.user.privilege != props.row.code && authStore.privileges.suppression==1" -->
                <q-icon
                  class="p-1 cursor-pointer"
                  name="delete"
                  size="sm"
                  color="negative"
                  @click="openDeleteModel(props.row)"
                />
                  <!-- v-if="authStore.privileges.consultation==1" -->
                <q-icon
                  class="p-1 cursor-pointer"
                  name="key"
                  size="sm"
                  color="warning"
                  @click="ShowPrivilege(props.row)"
                />
              </q-td>

              <q-td key="code" :props="props">
                {{ props.row.code }}
              </q-td>
              <q-td key="libelle" :props="props">
                {{ props.row.libelle }}
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="role" :props="props">
                {{ props.row.role }}
              </q-td>
              <q-td key="limitation" :props="props">
                {{ props.row.limitation }}
              </q-td>
              <!-- <q-td key="fonction" :props="props">
                {{ props.row.fonction }}
              </q-td> -->
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

    <script setup>
import { nextTick, onBeforeMount, reactive, ref, watch, onMounted } from "vue";
import { useAuthStore } from "stores/auth";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import Modal from "components/Modal.vue";
import DropDownButtonWithIcon from "components/DropDownButtonWithIcon.vue";
import ErrorValidation from "components/ErrorValidation.vue";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const router = useRouter()

let profils = ref([]);
// let fonctions = ref([]);
let drs = ref([]);

let addProfil = ref(false);
let deleteProfil = ref(false);
let Code = ref(false);
let showProfilstable = ref(true);

let searchProfils = ref(null);

const limitations = ref([]);

limitations.value.push({ code: 'G', value: 'L – Visibilité au niveau direction' });
// limitations.value.push({ code: 'R', value: 'R - Visibilité article échelle Régionale' });
limitations.value.push({ code: 'L', value: 'L – Visibilité au niveau direction' });
limitations.value.push({ code: 'P', value: 'P - Visibilité au niveau individuel' });

const Roles = ref([]);
Roles.value.push({ code: 'Rédacteur', value: 'Rédacteur' });
Roles.value.push({ code: 'Vérificateur', value: 'Vérificateur' });
Roles.value.push({ code: 'Consultation', value: 'Consultation' });
Roles.value.push({ code: 'Validateur', value: 'Validateur' });
Roles.value.push({ code: 'Admin', value: 'Admin' });

// const options = ref(fonctions.value);

// function filterFn(val, update) {
//   if (val === '') {
//     update(() => {
//       options.value = fonctions.value.map((option) => ({ ...option }));;
//     });
//     return;
//   }

//   update(() => {
//     const needle = val.toLowerCase();
//     options.value = fonctions.value.filter(v =>
//     v.LibelleFct.toLowerCase().indexOf(needle) > -1
//     ||
//     v.CodeFnt.toLowerCase().indexOf(needle) > -1
//   ).map((option) => ({ ...option }));
//   });
// }

const clearSearchProfils = async () => {
  searchProfils.value = null;
  await fetchData(searchProfils.value);
};

watch(searchProfils, async (newVal, oldVal) => {
  if (newVal && newVal.length >= 1) {
    // console.log(6666666666666666666);
    await fetchData(newVal);
  }
});

const fetchData = async (Search) => {
  try {
    const response = await api.get(`/api/gu/securite/recherche/${Search}`); // Replace with your backend API endpoint
    console.log(response.data.profils, 3);
    profils.value=response.data.profils;
    showProfilstable.value = false;
    await nextTick();
    showProfilstable.value = true;
    // console.log(fonctions.value);
  } catch (error) {
    // console.error(error);
  }
};

let form = reactive({
  code: "",
  libelle: "",
  description: "",
  role: "",
  limitation: "",
  fonction: "",
});

async function ShowPrivilege(data) {
    router.push(`/privilege/${data.code}`)

}
async function openAddModel() {
  addProfil.value = true;
  form.code = "";
  Code.value = "";
  form.libelle = "";
  form.role = "";
  form.fonction = "";
  form.description = "";
  form.limitation = "";
}
function closeAddProfil() {
  addProfil.value = false;
  myerrors.value = false;
  form.code = "";
  Code.value = "";
  form.libelle = "";
  form.role = "";
  form.fonction = "";
  form.description = "";
  form.limitation = "";
}
async function openDeleteModel(data) {
  deleteProfil.value = true;
  Code.value = data.code;
}
function closeDeleteProfil() {
  deleteProfil.value = false;
}

async function afterAddDelete(search) {
  try {
    const response = await api.get(`/api/gu/securite/recherche/${search}`); // Replace with your backend API endpoint
    // const response = await api.get("/api/gu/securite"); // Replace with your backend API endpoint
    profils.value = response.data.profils;
    // profils.value = response.data.profils;
    showProfilstable.value = false;
    await nextTick();
    showProfilstable.value = true;
    // console.log(profils.value);
  } catch (error) {
    // console.error(error);
  }
}

onBeforeMount(async () => {
  // authStore.setProperty("volet", "securites");
  // console.log(authStore.privileges);
  drs.value = authStore.directions;
});
onMounted(async () => {
  try {
         await fetchData(searchProfils.value);

  } catch (error) {
    // console.error(error);
  }
});

let initialPagination = ref({
        // sortBy: 'desc',
        // descending: false,
        // page: 2,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      })

// profils cols
let profilsCols = reactive([
  { name: "Actions", label: "Actions", align: "left" },
  {
    name: "code",
    label: "Code",
    align: "left",
    field: (row) => row.code ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "libelle",
    label: "Libellé",
    align: "left",
    field: (row) => row.libelle ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: (row) => row.description ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "role",
    label: "Rôle",
    align: "left",
    field: (row) => row.role ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "limitation",
    label: "Limitation",
    align: "left",
    field: (row) => row.limitation ?? "//",
    format: (val) => `${val}`,
    sortable: true,
    style: "white-space: pre-wrap;",
  },
  // {
  //   name: "fonction",
  //   label: "Fonction",
  //   align: "left",
  //   field: (row) => row.fonction ?? "//",
  //   format: (val) => `${val}`,
  //   sortable: true,
  // },
]);

let myerrors = ref();
let message = ref();
const $q = useQuasar();

const sendData = async () => {
  // Prepare the data to be sent
  const data = {
    code: form.code,
    libelle: form.libelle,
    description: form.description,
    role: form.role,
    // fonction: form.fonction.LibelleFct,
    limitation: form.limitation,
  };

  // console.log(data);

  // Make a POST request to the Laravel API endpoint
  await api
    .post("/api/gu/securite", data)
    .then(async (response) => {
        console.log(searchProfils.value);
      await fetchData(searchProfils.value);
      message.value = response.data.message;
      $q.notify({
        type: "positive",
        message: message.value,
      });
      closeAddProfil();
    })
    .catch((errors) => {
      console.log(errors);
      // console.log(errors.response.status);
      if (errors.response && errors.response.status === 422) {
        //errors.value = Object.values(errors.response.data.errors).flat();
        // console.log(errors.response.data.errors);
        myerrors.value = errors.response.data.errors;
      }
      // Handle any errors that occur during the request
    });
};

const deleteData = async () => {
  // Make a POST request to the Laravel API endpoint
  await api
    .get(`/api/gu/securite/delete/${Code.value}`)
    .then(async (response) => {
      await fetchData(searchProfils.value);
      message.value = response.data.message;
      $q.notify({
        type: "negative",
        message: message.value,
      });
      closeDeleteProfil();
    })
    .catch((errors) => {
      console.log(errors);
    });
};
</script>
