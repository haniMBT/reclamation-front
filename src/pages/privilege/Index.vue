<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="admin_panel_settings" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Profils</h1>
            <p class="text-gray-600 text-sm">Administration des profils et attribution des privilèges</p>
          </div>
        </div>
      </div>

      <!-- Toolbar Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <q-btn
              icon="person_add"
              color="blue-6"
              no-caps
              @click="openAddModel"
              v-if="authStore.privileges.insertion=true"
              class="px-6"
            >
              <!-- <q-icon name="person_add" class="mr-2" /> -->
              Ajouter un profil
            </q-btn>
            <q-input
              outlined
              dense
              v-model="searchProfils"
              label="Rechercher un profil"
              class="min-w-[300px]"
            >
              <template #prepend>
                <q-icon name="search" class="text-blue-600" />
              </template>
              <template #append>
                <q-icon
                  name="close"
                  @click="clearSearchProfils"
                  class="cursor-pointer text-gray-500 hover:text-gray-700"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <q-table
          v-if="showProfilstable"
          flat
          :rows="profils"
          :columns="profilsCols"
          :pagination="initialPagination"
          class="my-4"
        >
          <template v-slot:body="props">
            <q-tr v-if="!loadingAffaires" :props="props" :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }">
              <q-td key="Actions" :props="props">
                <div class="flex items-center gap-2">
                  <!-- v-if="authStore.user.privilege != props.row.code && authStore.privileges.suppression==1" -->
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="openDeleteModel(props.row)"
                    class="hover:bg-red-50"
                  >
                    <q-tooltip>Supprimer le profil</q-tooltip>
                  </q-btn>
                  <!-- v-if="authStore.privileges.consultation==1" -->
                  <q-btn
                    flat
                    round
                    dense
                    icon="vpn_key"
                    size="sm"
                    color="warning"
                    @click="ShowPrivilege(props.row)"
                    class="hover:bg-orange-50"
                  >
                    <q-tooltip>Gérer les privilèges</q-tooltip>
                  </q-btn>
                </div>
              </q-td>

              <q-td key="code" :props="props">
                <span class="font-medium text-gray-900">{{ props.row.code }}</span>
              </q-td>
              <q-td key="libelle" :props="props">
                <span class="text-gray-800">{{ props.row.libelle }}</span>
              </q-td>
              <q-td key="description" :props="props">
                <span class="text-gray-800">{{ props.row.description }}</span>
              </q-td>
              <q-td key="role" :props="props">
                <span class="text-gray-800">{{ props.row.role }}</span>
              </q-td>
              <q-td key="limitation" :props="props">
                <span class="text-gray-800">{{ props.row.limitation }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- Dialogs -->
      <!-- Add Profile Dialog -->
      <q-dialog v-model="addProfil" persistent>
        <q-card class="w-full max-w-4xl">
          <q-card-section class="flex items-center bg-blue-50">
            <q-icon name="person_add" class="text-blue-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-blue-900">Ajouter un profil</div>
              <div class="text-sm text-blue-700">Créez un nouveau profil avec ses attributs</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg" style="max-height: 70vh;">
            <div class="overflow-auto">
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Code <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.code"
                      outlined
                      dense
                      placeholder="exemple:N"
                      :rules="[val => !!val || 'Le code est requis']"
                    >
                      <template #prepend>
                        <q-icon name="code" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.code" :myerrors="myerrors?.code" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Libellé <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.libelle"
                      outlined
                      dense
                      placeholder="Entrez le libellé"
                      :rules="[val => !!val || 'Le libellé est requis']"
                    >
                      <template #prepend>
                        <q-icon name="label" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.libelle" :myerrors="myerrors?.libelle" />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <q-input
                      v-model="form.description"
                      outlined
                      dense
                      placeholder="Entrez la description"
                      type="textarea"
                      autogrow
                    >
                      <template #prepend>
                        <q-icon name="description" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.description" :myerrors="myerrors?.description" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Visibilité <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.limitation"
                      :options="limitations"
                      option-label="value"
                      option-value="code"
                      outlined
                      dense
                      placeholder="Sélectionnez la visibilité"
                      :rules="[val => !!val || 'La visibilité est requise']"
                    >
                      <template #prepend>
                        <q-icon name="visibility" class="text-blue-600" />
                      </template>
                    </q-select>
                    <ErrorValidation v-if="myerrors?.limitation" :myerrors="myerrors?.limitation" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Rôle <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.role"
                      :options="Roles"
                      option-label="value"
                      option-value="code"
                      outlined
                      dense
                      placeholder="Sélectionnez le rôle"
                      :rules="[val => !!val || 'Le rôle est requis']"
                    >
                      <template #prepend>
                        <q-icon name="admin_panel_settings" class="text-blue-600" />
                      </template>
                    </q-select>
                    <ErrorValidation v-if="myerrors?.role" :myerrors="myerrors?.role" />
                  </div>
                </div>
              </form>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-lg">
            <q-btn
              flat
              color="grey-7"
              label="Annuler"
              @click="closeAddProfil"
              class="px-6"
            />
            <q-btn
              color="blue-6"
              label="Enregistrer le nouveau profil"
              @click="sendData"
              :loading="false"
              class="px-8"
            >
              <q-icon name="save" class="mr-2" />
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Profile Dialog -->
      <q-dialog v-model="deleteProfil" persistent>
        <q-card class="w-full max-w-md">
          <q-card-section class="flex items-center bg-red-50">
            <q-icon name="delete_forever" class="text-red-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-red-900">
                {{ 'Supprimer le profil :' + ' ' + Code }}
              </div>
              <div class="text-sm text-red-700">Cette action est irréversible</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg">
            <div class="text-center">
              <q-icon name="warning" class="text-red-500 mb-4" size="4rem" />
              <div class="text-lg font-medium text-gray-900 mb-2">
                Êtes-vous sûr de vouloir confirmer la suppression ?
              </div>
              <div class="text-sm text-gray-600">
                Toutes les données associées seront définitivement supprimées.
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center" class="q-pa-lg">
            <q-btn
              flat
              color="grey-7"
              label="Annuler"
              @click="closeDeleteProfil"
              class="px-6"
            />
            <q-btn
              color="red-6"
              label="Supprimer définitivement"
              @click="deleteData"
              class="px-6"
            >
              <q-icon name="delete_forever" class="mr-2" />
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

    <script setup>
import { nextTick, onBeforeMount, reactive, ref, watch, onMounted } from "vue";
import { useAuthStore } from "stores/auth";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
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

limitations.value.push({ code: 'G', value: 'G – Visibilité au niveau global' });
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
    role: form.role.code,
    // fonction: form.fonction.LibelleFct,
    limitation: form.limitation.code,
  };

  console.log(data);

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
