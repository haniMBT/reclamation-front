<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="vpn_key" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Attribution des Privilèges</h1>
            <p class="text-gray-600 text-sm">Configurer les privilèges par profil et module</p>
          </div>
        </div>
      </div>

      <!-- Profile Info Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <label class="block text-sm font-medium text-gray-700 mb-2">Code</label>
            <q-input
              v-model="profil_privilege.code"
              outlined
              dense
              readonly
              class="text-center"
            >
              <template #prepend>
                <q-icon name="code" class="text-blue-600" />
              </template>
            </q-input>
          </div>

          <div class="text-center">
            <label class="block text-sm font-medium text-gray-700 mb-2">Libellé</label>
            <q-input
              v-model="profil_privilege.libelle"
              outlined
              dense
              readonly
              class="text-center"
            >
              <template #prepend>
                <q-icon name="label" class="text-blue-600" />
              </template>
            </q-input>
          </div>

          <div class="text-center">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <q-input
              v-model="profil_privilege.description"
              outlined
              dense
              readonly
              class="text-center"
            >
              <template #prepend>
                <q-icon name="description" class="text-blue-600" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="mt-6 text-center">
          <label class="block text-sm font-medium text-gray-700 mb-2">Visibilité</label>
          <q-input
            v-model="profil_privilege.limitation"
            outlined
            dense
            readonly
            class="max-w-xs mx-auto"
          >
            <template #prepend>
              <q-icon name="visibility" class="text-blue-600" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Toolbar Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <q-btn
              icon="vpn_key"
              color="blue-6"
              no-caps
              @click="Privilege()"
              class="px-6"
            >
              Liste des profils
            </q-btn>

            <q-btn
              v-if="authStore.privileges.modification=1"
              icon="edit"
              color="orange-6"
              no-caps
              @click="modifierPrivilege = !modifierPrivilege"
              class="px-6"
            >
              <div v-if="!modifierPrivilege">Modifier les privilèges</div>
              <div v-else>Annuler la modification</div>
            </q-btn>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <q-input
              outlined
              dense
              v-model="searchPrivileges"
              label="Rechercher un privilège"
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

            <q-btn
              icon="save"
              color="green-6"
              no-caps
              v-if="modifierPrivilege"
              @click="sendData"
              class="px-6"
            >
              Enregistrer
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <q-table
          v-if="showPrivilegestable"
          flat
          :rows="privileges"
          :columns="privilegesCols"
          :pagination="initialPagination"
          class="my-4"
        >
          <template v-slot:header="props">
            <q-tr :props="props" :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }">
              <q-th class="text-center" key="profil_code" :props="props">
                <span class="text-sm font-medium text-gray-700">Profile code</span>
              </q-th>
              <q-th class="text-center" key="module" :props="props">
                <span class="text-sm font-medium text-gray-700">Module</span>
              </q-th>
              <q-th class="text-center" key="volet" :props="props">
                <span class="text-sm font-medium text-gray-700">Application volet</span>
              </q-th>
              <q-th class="text-center" key="description" :props="props">
                <span class="text-sm font-medium text-gray-700">Description</span>
              </q-th>
              <q-th class="text-center" key="role" :props="props">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-sm font-medium text-gray-700">Rôle</span>
                  <template v-if="modifierPrivilege">
                    <q-select
                      v-model="roleGlobal"
                      :options="Roles"
                      option-label="code"
                      option-value="code"
                      outlined
                      dense
                      placeholder="Rôle global"
                      class="min-w-[150px]"
                    >
                      <template #prepend>
                        <q-icon name="admin_panel_settings" class="text-blue-600" />
                      </template>
                    </q-select>
                  </template>
                </div>
              </q-th>
              <q-th class="text-center" key="consultation" :props="props">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-sm font-medium text-gray-700">Consultation</span>
                  <template v-if="modifierPrivilege">
                    <q-checkbox
                      v-model="consultationGlobal"
                      :true-value="1"
                      :false-value="0"
                      color="blue-6"
                      class="mt-1"
                    />
                  </template>
                </div>
              </q-th>
              <q-th class="text-center" key="modification" :props="props">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-sm font-medium text-gray-700">Modification</span>
                  <template v-if="modifierPrivilege">
                    <q-checkbox
                      v-model="modificationGlobal"
                      :true-value="1"
                      :false-value="0"
                      color="blue-6"
                      class="mt-1"
                    />
                  </template>
                </div>
              </q-th>
              <q-th class="text-center" key="insertion" :props="props">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-sm font-medium text-gray-700">Insertion</span>
                  <template v-if="modifierPrivilege">
                    <q-checkbox
                      v-model="insertionGlobal"
                      :true-value="1"
                      :false-value="0"
                      color="blue-6"
                      class="mt-1"
                    />
                  </template>
                </div>
              </q-th>
              <q-th class="text-center" key="suppression" :props="props">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-sm font-medium text-gray-700">Suppression</span>
                  <template v-if="modifierPrivilege">
                    <q-checkbox
                      v-model="suppressionGlobal"
                      :true-value="1"
                      :false-value="0"
                      color="blue-6"
                      class="mt-1"
                    />
                  </template>
                </div>
              </q-th>
              <q-th class="text-center" key="visibilite" :props="props">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-sm font-medium text-gray-700">Visibilité</span>
                  <template v-if="modifierPrivilege">
                    <q-select
                      v-model="visibiliteGlobal"
                      :options="limitations"
                      option-label="code"
                      option-value="code"
                      outlined
                      dense
                      placeholder="Visibilité globale"
                      class="min-w-[150px]"
                    >
                      <template #prepend>
                        <q-icon name="visibility" class="text-blue-600" />
                      </template>
                    </q-select>
                  </template>
                </div>
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }">
              <q-td key="profil_code" :props="props">
                <span class="font-medium text-gray-900">{{ props.row.profil_code }}</span>
              </q-td>
              <q-td key="module" :props="props">
                <span class="text-gray-800">{{ props.row.module }}</span>
              </q-td>
              <q-td key="volet" :props="props">
                <span class="text-gray-800">{{ props.row.volet }}</span>
              </q-td>
              <q-td key="description" :props="props">
                <span class="text-gray-800">{{ props.row.description }}</span>
              </q-td>
              <q-td key="role" :props="props">
                <template v-if="!modifierPrivilege">
                  <span class="text-gray-800">{{ props.row.role }}</span>
                </template>
                <template v-else>
                <q-select
                  v-model="form[`${props.row.id}`].role"
                  :options="Roles"
                  option-label="code"
                  option-value="code"
                  outlined
                  dense
                  placeholder="Sélectionner le rôle"
                  @update:model-value="val => form[`${props.row.id}`].role = val.code"
                  >
                  <template #prepend>
                    <q-icon name="admin_panel_settings" class="text-blue-600" />
                  </template>
                </q-select>
                </template>
              </q-td>
              <q-td key="consultation" :props="props" class="text-center">
                <q-checkbox
                  v-model="form[props.row.id].consultation"
                  :true-value="1"
                  :false-value="0"
                  :disable="!modifierPrivilege"
                  color="blue-6"
                />
              </q-td>
              <q-td key="modification" :props="props" class="text-center">
                <q-checkbox
                  v-model="form[props.row.id].modification"
                  :true-value="1"
                  :false-value="0"
                  :disable="!modifierPrivilege"
                  color="blue-6"
                />
              </q-td>
              <q-td key="insertion" :props="props" class="text-center">
                <q-checkbox
                  v-model="form[props.row.id].insertion"
                  :true-value="1"
                  :false-value="0"
                  :disable="!modifierPrivilege"
                  color="blue-6"
                />
              </q-td>
              <q-td key="suppression" :props="props" class="text-center">
                <q-checkbox
                  v-model="form[props.row.id].suppression"
                  :true-value="1"
                  :false-value="0"
                  :disable="!modifierPrivilege"
                  color="blue-6"
                />
              </q-td>
              <q-td key="visibilite" :props="props">
                <template v-if="!modifierPrivilege">
                  <span class="text-gray-800">{{ props.row.visibilite }}</span>
                </template>
                <template v-else>
                  <q-select
                    v-model="form[`${props.row.id}`].visibilite"
                    :options="limitations"
                    option-label="code"
                    option-value="code"
                    outlined
                    dense
                    placeholder="Sélectionner la visibilité"
                    @update:model-value="val => form[`${props.row.id}`].visibilite = val.code"
                  >
                    <template #prepend>
                      <q-icon name="visibility" class="text-blue-600" />
                    </template>
                  </q-select>
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
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
  code: "G",
  value: "G – Visibilité au niveau global",
});
limitations.value.push({
   code: "L", value: "L – Visibilité au niveau direction"
  });
limitations.value.push({
  code: "P",
  value: "P - Visibilité au niveau individuel",
});

const Roles = ref([]);
Roles.value.push({ code: "Rédacteur", value: "Rédacteur" });
Roles.value.push({ code: "Vérificateur", value: "Vérificateur" });
Roles.value.push({ code: "Consultation", value: "Consultation" });
Roles.value.push({ code: "Validateur", value: "Validateur" });
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
    form.value = {};
    response.data.privileges.forEach((item) => {
      form.value = {
        ...form.value,
        ...{
          [`${item.id}`]: {
            ["role"]: item.role,
            ["consultation"]: item.consultation ? 1 : 0,
            ["modification"]: item.modification ? 1 : 0,
            ["suppression"]: item.suppression ? 1 : 0,
            ["insertion"]: item.insertion ? 1 : 0,
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
      form.value[item.id].visibilite=newVal.code
    });
})
watch(roleGlobal,
async (newVal, oldVal) => {
    privileges.value.forEach((item) => {
      form.value[item.id].role=newVal.code
    });
})

 function Privilege() {
        router.push(`/privilege`);
}

let form = ref({});

onBeforeMount(async () => {
  // authStore.setProperty("volet", "Securites");
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
            ["consultation"]: item.consultation ? 1 : 0,
            ["modification"]: item.modification? 1 : 0,
            ["suppression"]: item.suppression? 1 : 0,
            ["insertion"]: item.insertion? 1 : 0,
            ["visibilite"]: item.visibilite,
          },
        },
      };
    });
    console.log(156, response.data.privileges);
    console.log(157, form.value);
    privileges.value = response.data.privileges;
    profil_privilege.value = response.data.profil_privilege;
    if (profil_privilege.value.limitation === "G") {
      profil_privilege.value.limitation =
        "G – Visibilité au niveau global";
    } else if (profil_privilege.value.limitation === "L") {
      profil_privilege.value.limitation = "L – Visibilité au niveau direction";
    } else if (profil_privilege.value.limitation === "P") {
      profil_privilege.value.limitation =
        "P - Visibilité au niveau individuel";
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
    name: "module",
    label: "Module",
    align: "left",
    field: (row) => row.module ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "volet",
    label: "Applicatoin volet",
    align: "left",
    field: (row) => row.volet ?? "//",
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
