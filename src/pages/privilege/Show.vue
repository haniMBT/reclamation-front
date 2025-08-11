<template>
  <q-page class="flex justify-center bg-amber-50">
    <div class="flex flex-col w-full flex-grow-1 mx-8 my-4">
      <h1 class="text-header-text text-2xl font-[500] mx-4 px-4">
        Attribution des privilèges
      </h1>
      <div
        class="flex flex-col bg-white flex-grow rounded-xl m-4 p-4"
      >
        <div class="">
          <div class="flex gap-4 justify-between mx-32">
            <div class="w-full mb-2">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
                >Code
              </label>
              <input
                type="text"
                v-model="profil_privilege.code"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                readonly
              />
            </div>
            <div class="w-full mb-2">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
                >Libellé
              </label>
              <input
                type="text"
                v-model="profil_privilege.libelle"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                readonly
              />
            </div>
            <div class="w-full mb-2">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
                >Description
              </label>
              <input
                type="text"
                v-model="profil_privilege.description"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                readonly
              />
            </div>
          </div>
          <div class="flex gap-4 justify-between mx-40">
            <div class="w-full mb-2">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
                >Fonction
              </label>
              <input
                type="text"
                v-model="profil_privilege.fonction"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                readonly
              />
            </div>
            <div class="w-full mb-2">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center"
                >Visibilité
              </label>
              <input
                type="text"
                v-model="profil_privilege.limitation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="w-full flex justify-between items-end mt-2">
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
            <q-btn
              icon="key"
              color="purple"
              no-caps
              @click="Privilege()"
            >
              <div>Liste des profils</div>
            </q-btn>
            <q-btn
              v-if="authStore.privileges.modification==1"
              icon="edit"
              color="purple"
              no-caps
              @click="modifierPrivilege = !modifierPrivilege"
            >
              <div v-if="!modifierPrivilege">Modifier les privilèges</div>
              <div v-else>Annuler la modification</div>
            </q-btn>
          </div>
            <q-input
              outlined
              v-model="searchPrivileges"
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
          </div>
          <q-btn
            icon="save"
            color="purple"
            no-caps
            v-if="modifierPrivilege"
            @click="sendData"
          >
            Enregistrer
          </q-btn>
        </div>
        <q-table
          v-if="showPrivilegestable"
          class="my-4"
          :rows="privileges"
          :columns="privilegesCols"
          :pagination="initialPagination"
        >
              <!-- v-if="!loadingPrivileges" -->
        <template v-slot:header="props">
          <q-tr
              :props="props"
              :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }"
            >
              <q-th class="text-center" key="profil_code" :props="props">
               Profile code
              </q-th>
              <q-th class="text-center" key="module_app" :props="props">
               Module
              </q-th>
              <q-th class="text-center" key="volet_app" :props="props">
               Application volet
              </q-th>
              <q-th class="text-center" key="description" :props="props">
               Description
              </q-th>
              <q-th class="text-center" key="role" :props="props">
               <template v-if="!modifierPrivilege">
                Rôle
                </template>
                <template v-else>
                  Rôle
                  <DropDownButtonWithIcon
                    title="Role"
                    keyName="code"
                    valName="value"
                    :items="Roles"
                    :selected="roleGlobal"
                    @select-item="(val) => (roleGlobal = val)"
                  />
                </template>
              </q-th>
              <q-th class="text-center" key="consultation" :props="props" >
               Consultation
               <br v-if="modifierPrivilege">
               <div class="checkbox-wrapper-31" v-if="modifierPrivilege">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="
                      consultationGlobal == 1 ? true : false
                    "
                    @change="
                    consultationGlobal == 1
                        ? (consultationGlobal = 0)
                        : (consultationGlobal = 1)
                    "
                  />
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-th>
              <q-th class="text-center" key="modification" :props="props">
               Modification
               <br v-if="modifierPrivilege">
               <div class="checkbox-wrapper-31" v-if="modifierPrivilege">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="
                      modificationGlobal == 1 ? true : false
                    "
                    @change="
                    modificationGlobal == 1
                        ? (modificationGlobal = 0)
                        : (modificationGlobal = 1)
                    "
                  />
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-th>
              <q-th class="text-center" key="insertion" :props="props">
               Insertion
               <br v-if="modifierPrivilege">
               <div class="checkbox-wrapper-31" v-if="modifierPrivilege">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="
                      insertionGlobal == 1 ? true : false
                    "
                    @change="
                    insertionGlobal == 1
                        ? (insertionGlobal = 0)
                        : (insertionGlobal = 1)
                    "
                  />
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-th>
              <q-th class="text-center" key="suppression" :props="props">
               Suppression
               <br v-if="modifierPrivilege">
               <div class="checkbox-wrapper-31" v-if="modifierPrivilege">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="
                      suppressionGlobal == 1 ? true : false
                    "
                    @change="
                    suppressionGlobal == 1
                        ? (suppressionGlobal = 0)
                        : (suppressionGlobal = 1)
                    "
                  />
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-th>
              <q-th class="text-center" key="visibilite" :props="props">
               <template v-if="!modifierPrivilege">
                Visibilite
                </template>
                <template v-else>
                  Visibilite
                  <DropDownButtonWithIcon
                    title="Visibilité"
                    keyName="code"
                    valName="code"
                    :items="limitations"
                    :selected="visibiliteGlobal"
                    @select-item="
                      (val) => (visibiliteGlobal = val)
                    "
                  />
                </template>
              </q-th>
          </q-tr>
        </template>
          <template v-slot:body="props">
            <!--  -->
              <!-- v-if="!loadingPrivileges" -->
            <q-tr
              :props="props"
              :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }"
            >
              <q-td key="profil_code" :props="props">
                {{ props.row.profil_code }}
              </q-td>
              <q-td key="module_app" :props="props">
                {{ props.row.module_app }}
              </q-td>
              <q-td key="volet_app" :props="props">
                {{ props.row.volet_app }}
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="role" :props="props">
                <template v-if="!modifierPrivilege">
                  {{ props.row.role }}
                </template>
                <template v-else>
                  <DropDownButtonWithIcon
                    title="Role"
                    keyName="code"
                    valName="value"
                    :items="Roles"
                    :selected="form[`${props.row.id}`].role"
                    @select-item="(val) => (form[`${props.row.id}`].role = val)"
                  />
                </template>
              </q-td>
              <q-td key="consultation" :props="props" class="text-center">
                <div class="checkbox-wrapper-31">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="
                      form[props.row.id].consultation == 1 ? true : false
                    "
                    @change="
                      form[props.row.id].consultation == 1
                        ? (form[props.row.id].consultation = 0)
                        : (form[props.row.id].consultation = 1)
                    "
                  />
                  <!-- v-model="form[props.row.id].consultation" -->
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-td>
              <q-td key="modification" :props="props" class="text-center">
                <div class="checkbox-wrapper-31">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="
                      form[props.row.id].modification == 1 ? true : false
                    "
                    @change="
                      form[props.row.id].modification == 1
                        ? (form[props.row.id].modification = 0)
                        : (form[props.row.id].modification = 1)
                    "
                  />
                  <!-- v-model="form[props.row.id].modification" -->
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-td>
              <q-td key="insertion" :props="props" class="text-center">
                <div class="checkbox-wrapper-31">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="form[props.row.id].insertion == 1 ? true : false"
                    @change="
                      form[props.row.id].insertion == 1
                        ? (form[props.row.id].insertion = 0)
                        : (form[props.row.id].insertion = 1)
                    "
                  />
                  <!-- v-model="form[props.row.id].insertion" -->
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-td>
              <q-td key="suppression" :props="props" class="text-center">
                <div class="checkbox-wrapper-31">
                  <input
                    type="checkbox"
                    :disabled="!modifierPrivilege"
                    :checked="
                      form[props.row.id].suppression == 1 ? true : false
                    "
                    @change="
                      form[props.row.id].suppression == 1
                        ? (form[props.row.id].suppression = 0)
                        : (form[props.row.id].suppression = 1)
                    "
                  />
                  <!-- v-model="form[props.row.id].suppression" -->
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      class="background"
                      cx="17.8"
                      cy="17.8"
                      r="17.8"
                    ></circle>
                    <circle
                      class="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      class="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              </q-td>
              <q-td key="visibilite" :props="props">
                <template v-if="!modifierPrivilege">
                  {{ props.row.visibilite }}
                </template>
                <template v-else>
                  <DropDownButtonWithIcon
                    title="Visibilité"
                    keyName="code"
                    valName="code"
                    :items="limitations"
                    :selected="form[props.row.id].visibilite"
                    @select-item="
                      (val) => (form[props.row.id].visibilite = val)
                    "
                  />
                </template>
              </q-td>
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
import DropDownButtonWithIcon from "components/DropDownButtonWithIcon.vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

let privileges = ref([]);
let profil_privilege = ref([]);
let Code = ref(false);
let showPrivilegestable = ref(true);
let modifierPrivilege = ref(false);
let searchPrivileges = ref(null);
const limitations = ref([]);

limitations.value.push({
  code: "N",
  value: "N - Visibilité article échelle Entreprise",
});
limitations.value.push({
  code: "R",
  value: "R - Visibilité article échelle Régionale",
});
limitations.value.push({
   code: "L", value: "L - Visibilité article échelle"
  });
limitations.value.push({
  code: "P",
  value: "P - Visibilité article échelle Individuelle",
});

const Roles = ref([]);
Roles.value.push({ code: "Rédacteur", value: "Rédacteur" });
Roles.value.push({ code: "Vérificateur", value: "Vérificateur" });
Roles.value.push({ code: "Consultation", value: "Consultation" });
Roles.value.push({ code: "Validateur", value: "Validateur" });
Roles.value.push({ code: "Validateur_N1", value: "Validateur_N1" });
Roles.value.push({ code: "Validateur_N2", value: "Validateur_N2" });
Roles.value.push({ code: "Labo_itinérant", value: "Labo_itinérant" });
Roles.value.push({ code: "Labo_fixe_resp", value: "Labo_fixe_resp" });
Roles.value.push({ code: "Labo_fixe_agent", value: "Labo_fixe_agent" });
Roles.value.push({ code: "Admin", value: "Admin" });

const clearSearchProfils = async () => {
  searchPrivileges.value = null;
  await fetchData(searchPrivileges.value);
};

watch(searchPrivileges, async (newVal, oldVal) => {
  if (newVal && newVal.length >= 1) {
    await fetchData(newVal);
  }
});

const fetchData = async (Search) => {
  try {
    const response = await api.get(
      `/api/gu/securite/recherche/${Search}/${Code.value}`
    );
    // console.log(response.data.privileges, 3);
    form.value = {};
    response.data.privileges.forEach((item) => {
      form.value = {
        ...form.value,
        ...{
          [`${item.id}`]: {
            ["role"]: item.role,
            ["consultation"]: item.consultation,
            ["modification"]: item.modification,
            ["suppression"]: item.suppression,
            ["insertion"]: item.insertion,
            ["visibilite"]: item.visibilite,
          },
        },
      };
    });
    privileges.value = response.data.privileges;
    showPrivilegestable.value = false;
    await nextTick();
    showPrivilegestable.value = true;
  } catch (error) {
    // console.error(error);
  }
};

let roleGlobal = ref(null);
let consultationGlobal = ref(0);
let modificationGlobal = ref(0);
let visibiliteGlobal = ref(null);
let insertionGlobal = ref(0);
let suppressionGlobal = ref(0);

watch(consultationGlobal,
async (newVal, oldVal) => {
    privileges.value.forEach((item) => {
      form.value[item.id].consultation=newVal
    });
})
watch(modificationGlobal,
async (newVal, oldVal) => {
    privileges.value.forEach((item) => {
      form.value[item.id].modification=newVal
    });
})
watch(insertionGlobal,
async (newVal, oldVal) => {
    privileges.value.forEach((item) => {
      form.value[item.id].insertion=newVal
    });
})
watch(suppressionGlobal,
async (newVal, oldVal) => {
    privileges.value.forEach((item) => {
      form.value[item.id].suppression=newVal
    });
})
watch(visibiliteGlobal,
async (newVal, oldVal) => {
    privileges.value.forEach((item) => {
      form.value[item.id].visibilite=newVal
    });
})
watch(roleGlobal,
async (newVal, oldVal) => {
    privileges.value.forEach((item) => {
      form.value[item.id].role=newVal
    });
})

 function Privilege() {
        router.push(`/privilege`);
}

let form = ref({});

onBeforeMount(async () => {
  authStore.setProperty("volet", "Securites");
});
onMounted(async () => {
  try {
    Code.value = router.currentRoute.value.params.code;
    const response = await api.post(`/api/gu/securite/privilege/${Code.value}`); // Replace with your backend API endpoint
    response.data.privileges.forEach((item) => {
      form.value = {
        ...form.value,
        ...{
          [`${item.id}`]: {
            ["role"]: item.role,
            ["consultation"]: item.consultation,
            ["modification"]: item.modification,
            ["suppression"]: item.suppression,
            ["insertion"]: item.insertion,
            ["visibilite"]: item.visibilite,
          },
        },
      };
    });
    console.log(157, form.value);
    privileges.value = response.data.privileges;
    profil_privilege.value = response.data.profil_privilege;
    if (profil_privilege.value.limitation === "N") {
      profil_privilege.value.limitation =
        "N - Visibilité article échelle Entreprise";
    } else if (profil_privilege.value.limitation === "R") {
      profil_privilege.value.limitation =
        "R - Visibilité article échelle Régionale";
    } else if (profil_privilege.value.limitation === "L") {
      profil_privilege.value.limitation = "L - Visibilité article échelle";
    } else if (profil_privilege.value.limitation === "P") {
      profil_privilege.value.limitation =
        "P - Visibilité article échelle Individuelle";
    }
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
// privileges cols
let privilegesCols = reactive([
  {
    name: "profil_code",
    label: "Profil code",
    align: "left",
    field: (row) => row.profil_code ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "module_app",
    label: "Module",
    align: "left",
    field: (row) => row.module_app ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "volet_app",
    label: "Applicatoin volet",
    align: "left",
    field: (row) => row.volet_app ?? "//",
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
    style: "white-space: pre-wrap;",
  },
  {
    name: "consultation",
    label: "Consultation",
    align: "left",
    field: (row) => row.consultation ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "modification",
    label: "Modification",
    align: "left",
    field: (row) => row.modification ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "insertion",
    label: "Insertion",
    align: "left",
    field: (row) => row.insertion ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "suppression",
    label: "Suppression",
    align: "left",
    field: (row) => row.suppression ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "visibilite",
    label: "Visibilite",
    align: "left",
    field: (row) => row.visibilite ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
]);

let myerrors = ref();
let message = ref();
const $q = useQuasar();

const sendData = async () => {
  const data = form;
  await api
    .post(`/api/gu/securite/privilege/update/${Code.value}`, {
      id: data.value,
    })
    .then(async (response) => {
      await fetchData(searchPrivileges.value);
      message.value = response.data.message;
      console.log(message.value);
      $q.notify({
        type: "positive",
        message: message.value,
      });
    })
    .catch((errors) => {
      console.log(errors);
      console.log(errors.response.status);
      if (errors.response && errors.response.status === 422) {
        console.log(errors.response.data.errors);
        myerrors.value = errors.response.data.errors;
      }
      // Handle any errors that occur during the request
    });
};
</script>

<style>
.checkbox-wrapper-31:hover .check {
  stroke-dashoffset: 0;
}

.checkbox-wrapper-31 {
  position: relative;
  display: inline-block;
  width: 25px;
  height: 25px;
}
.checkbox-wrapper-31 .background {
  fill: #ccc;
  transition: ease all 0.6s;
  -webkit-transition: ease all 0.6s;
}
.checkbox-wrapper-31 .stroke {
  fill: none;
  stroke: #fff;
  stroke-miterlimit: 10;
  stroke-width: 2px;
  stroke-dashoffset: 100;
  stroke-dasharray: 100;
  transition: ease all 0.6s;
  -webkit-transition: ease all 0.6s;
}
.checkbox-wrapper-31 .check {
  fill: none;
  stroke: #fff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
  stroke-dashoffset: 22;
  stroke-dasharray: 22;
  transition: ease all 0.6s;
  -webkit-transition: ease all 0.6s;
}
.checkbox-wrapper-31 input[type="checkbox"] {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  margin: 0;
  opacity: 0;
  -appearance: none;
  -webkit-appearance: none;
}
.checkbox-wrapper-31 input[type="checkbox"]:hover {
  cursor: pointer;
}
.checkbox-wrapper-31 input[type="checkbox"]:checked + svg .background {
  fill: #5562da;
}
.checkbox-wrapper-31 input[type="checkbox"]:checked + svg .stroke {
  stroke-dashoffset: 0;
}
.checkbox-wrapper-31 input[type="checkbox"]:checked + svg .check {
  stroke-dashoffset: 0;
}
</style>
