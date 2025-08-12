<template>
  <q-page class="flex justify-center bg-amber-50">
    <div class="flex flex-col w-full flex-grow-1 mx-8 my-4">
      <h1 class="text-header-text text-2xl font-[500] mx-4 px-4">
        Utilisateurs
      </h1>
      <div class="flex flex-col bg-white flex-grow rounded-xl m-4 p-4">
        <div class="w-full flex justify-between items-end">
          <div class="flex flex-col gap-2">
              <q-btn icon="add" color="purple" no-caps @click="openAddUser" v-if="authStore.privileges.insertion=1">
                Nouvel utilisateur
              </q-btn>
            <q-input outlined v-model="searchUsers" label="Recherche Utilisateur" dense>
              <template v-slot:append>
                <q-icon name="close" @click="clearSearchUsers" class="cursor-pointer" />
              </template>
            </q-input>
            <!-- v-model="searchUsers" -->
          </div>
          <div class="q-pa-md">
    <div class="q-gutter-sm">
      <!-- <q-radio v-model="actif" val="1" label="Actif" color="green" />
      <q-radio v-model="actif" val="0" label="Innactif" color="grey" />
      <q-radio v-model="actif" :val="null" label="Tous" color="blue" /> -->
    </div>
  </div>
        </div>
        <Modal primaryIcon="" :show="addUser" title="Ajouter un utilisateur" @close="closeAddUser"
          primaryBtnText="Enregistrer" secondaryBtnText="" @click-primary-btn="sendData" @click-secondary-btn="">
          <form class="h-96 overflow-auto">
            <div class="grid gap-2 mb-2 md:grid-cols-2">
              <div class="mb-2">
                <label for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Matricule <span
                    style="color: red">*</span></label>
                <input type="text" v-model="form.Matricule"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Matricule " required />
                <ErrorValidation v-if="myerrors?.Matricule" :myerrors="myerrors?.Matricule" />
              </div>
              <div class="mb-2">
                <label for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom <span
                    style="color: red">*</span></label>
                <input type="text" v-model="form.Nom"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nom " required />
                <ErrorValidation v-if="myerrors?.Nom" :myerrors="myerrors?.Nom" />
              </div>
              <div class="mb-2">
                <label for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom <span
                    style="color: red">*</span></label>
                <input type="text" v-model="form.Prenom"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Prenom " required />
                <ErrorValidation v-if="myerrors?.Prenom" :myerrors="myerrors?.Prenom" />
              </div>
              <div class="mb-2">
                <label for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                </label>
                <input type="text" v-model="form.email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="exemple@exemple.exemple " required />
                <ErrorValidation v-if="myerrors?.email" :myerrors="myerrors?.email" />
              </div>
              <div class="flex gap-4 justify-between">
                <div class="w-full mb-2">
                  <label for="countries"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direction <span
                      style="color: red">*</span></label>

                  <DropDownButtonWithIcon title="Direction" :items="drs" :selected="form.direction"
                    @select-item="(val) => (form.direction = val)" />
                  <ErrorValidation v-if="myerrors?.direction" :myerrors="myerrors?.direction" />
                </div>
              </div>
              <div class="mb-2">
                <label for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password <span
                    style="color: red">*</span></label>

                <input type="password" v-model="form.password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="•••••••••" required />
                <ErrorValidation v-if="myerrors?.password" :myerrors="myerrors?.password" />
              </div>
            </div>
          </form>
        </Modal>
        <Modal primaryIcon="" :show="UpdateUser" :title="'Attribution du privilège à' +
              (form?.Nom ? ' ' + form.Nom.toLowerCase() : '') +
              (form?.Prenom ? ' ' + form.Prenom.toLowerCase() : '') +
              (Matricule ? ' (' + Matricule + ')' : '')" @close="closeEditModel"
          primaryBtnText="Enregistrer" secondaryBtnText="" @click-primary-btn="updateData" @click-secondary-btn="">
          <form class="overflow-auto">
            <div class="grid gap-2 mb-2 md:grid-cols-2">
              <div class="mb-2">
                <label for="first_name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                </label>
                <input type="text" v-model="form.email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="exemple@exemple.exemple " required />
                <ErrorValidation v-if="myerrors?.email" :myerrors="myerrors?.email" />
              </div>
              <div class="w-full mb-2">
                <label for="countries"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Profil <span style="color: red">*</span></label>
                <DropDownButtonWithIcon title="Profil" keyName="code" valName="libelle" :selected="form.privilege"
                  :items="profils" @select-item="(val) => (form.privilege = val)" />
                <!--  -->
                <ErrorValidation v-if="myerrors?.privilege" :myerrors="myerrors?.privilege" />
              </div>
              <div class="flex gap-4 justify-between mb-2">
                <div class="w-full mb-2">
                  <label for="countries"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direction <span
                      style="color: red">*</span></label>

                  <DropDownButtonWithIcon title="Direction" :items="drs" :selected="form.direction"
                    @select-item="(val) => (form.direction = val)" />
                  <ErrorValidation v-if="myerrors?.direction" :myerrors="myerrors?.direction" />
                </div>

              </div>

              <div class="mb-2">
                <label @click="showNewpasswordEdit = !showNewpasswordEdit" for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white m-4">
                  <input type="checkbox" v-model="showNewpasswordEdit" />
                  Nouveau mot de passe
                </label>

                <input :disabled="!showNewpasswordEdit" type="password" v-model="form.password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="•••••••••" required />
                <ErrorValidation v-if="myerrors?.password" :myerrors="myerrors?.password" />
              </div>
            </div>
          </form>
        </Modal>
        <Modal primaryIcon="" :show="deleteUser" :title="'Supprimer l\'utilisateur :' +
            (form?.Nom ? ' ' + form.Nom.toLowerCase() : '') +
            (form?.Prenom ? ' ' + form.Prenom.toLowerCase() : '') +
            (Matricule ? ' (' + Matricule + ')' : '')"
          @close="closeDeleteUser" primaryBtnText="supprimer" secondaryBtnText="" @click-primary-btn="deleteData"
          @click-secondary-btn="">
          <q-text class="text-h6">Êtes-vous sûr de vouloir supprimer ?
          </q-text>
        </Modal>
        <q-table v-if="showuserstable" class="my-4" :rows="utilisateurs" :columns="utlisateursCols" :pagination="initialPagination">
          <template v-slot:body="props">
            <q-tr v-if="!loadingAffaires" :props="props" :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }">
              <q-td key="Actions" :props="props">
                <!-- v-if="authStore.user.Matricule != props.row.Matricule && authStore.privileges.suppression==1" -->
                <q-icon  class="p-1 cursor-pointer"
                  name="delete" size="sm" color="negative" @click="openDeleteUser(props.row)" />
                <q-icon class="p-1 cursor-pointer" name="edit" size="sm" color="warning" v-if="authStore.privileges.modification=1"
                  @click="openEditModel(props.row)" />
                  <!--
                <q-icon class="p-1 cursor-pointer" name="toggle_off" size="sm" color="green"
                v-if="authStore.user.Matricule != props.row.Matricule && authStore.privileges.modification==1 && (props.row.Actif=='1'|| props.row.Actif==null) "
                  @click="UserActivation(props.row)" />
                <q-icon class="p-1 cursor-pointer" name="toggle_on" size="sm" color="grey"
                v-if="authStore.user.Matricule != props.row.Matricule && authStore.privileges.modification==1 && props.row.Actif=='0' "
                  @click="UserActivation(props.row)" /> -->
              </q-td>
              <q-td key="Nom" :props="props">
                {{ props.row.Matricule }}
              </q-td>
              <q-td key="Nom" :props="props">
                {{ props.row.Nom }}
              </q-td>
              <q-td key="Nom" :props="props">
                {{ props.row.Prenom }}
              </q-td>
              <q-td key="Nom" :props="props">
                {{ props.row.Email }}
              </q-td>
              <q-td key="Nom" :props="props">
                {{ props.row.direction }}
              </q-td>
              <q-td key="Nom" :props="props">
                {{ props.row.privilege }}
 <!--
               <q-icon
                   class="p-1 cursor-pointer" name="visibility" size="sm" @click="ShowPrivilege(props.row)" color="blue"
                   v-if="props.row.privilege &&
                  props.row.privilege != authStore.user.privilege && authStore.privileges.consultation==1 "/>
                  -->
                <!--
                <q-icon  class="p-1 cursor-pointer" name="delete" size="sm" color="negative"
                v-if="props.row.privilege &&
                  props.row.privilege != authStore.user.privilege && authStore.privileges.suppression==1"
                  @click="revokeProfile(props.row)" />
                  -->
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
import Modal from "components/Modal.vue";
import DropDownButtonWithIcon from "components/DropDownButtonWithIcon.vue";
import ErrorValidation from "components/ErrorValidation.vue";
import {useRouter} from "vue-router";

const router = useRouter()
const authStore = useAuthStore();

let utilisateurs = ref([]);
let profils = ref([]);
let fonctions = ref([]);
let drs = ref([]);

let actif = ref(null);
let addUser = ref(false);
let deleteUser = ref(false);
let UpdateUser = ref(false);
let Matricule = ref(false);
let showNewpasswordEdit = ref(false);
let showuserstable = ref(true);

let searchUsers = ref(null);

const clearSearchUsers = async () => {
  searchUsers.value = null;
  await fetchData(searchUsers.value);
};

watch(searchUsers, async (newVal, oldVal) => {
  if (newVal && newVal.length >= 1) {

    await fetchData(newVal);
  }
});

watch(
  () => [actif.value],
  async () => {
      await fetchData();
  }
);

async function ShowPrivilege(data) {
    router.push(`/privilege/${data.privilege}`)
}

const fetchData = async (search) => {
  try {

    const data = {
      actif: actif.value,
      search: search,
      dr_id: authStore.dr_id,
    };
    const response = await api.post(`/api/gu/utilisateur/recherche`,data); // Replace with your backend API endpoint
    utilisateurs.value = response.data.utilisateurs;
    console.log(utilisateurs.value,'utilisateurs');
    profils.value = response.data.profils;
    drs.value = response.data.drs?.map(item => item.DIRECTION);
    showuserstable.value = false;
    await nextTick();
    showuserstable.value = true;
    if (authStore.user.Matricule == Matricule.value && UpdateUser == true) {
      await authStore.getUser();
      await authStore.getPrivileges();
      await authStore.getDirections();
    }
  } catch (error) {
    // console.error(error);
  }
};

let form = reactive({
  Matricule: "",
  Nom: "",
  Prenom: "",
  email: "",
  Nom_DR: "",
  Structure: "",
  Fonction: "",
  password: "",
  privilege: "",
});

async function openEditModel(data) {
  console.log(data, 'data');

  Matricule.value = data.Matricule;
  form.Nom = data.Nom;
  form.Prenom = data.Prenom;
  form.email = data.Email;
  form.privilege = data.privilege;
  form.password = "";
  form.direction = data.direction;
  UpdateUser.value = true;
}

function closeEditModel() {
  form.direction = "";
  Matricule.value = "";
  form.Nom = "";
  form.Prenom = "";
  form.email = "";
  form.privilege = "";
  showNewpasswordEdit.value = false;
  UpdateUser.value = false;
  myerrors.value = false;
}

async function openAddUser() {
  form.Matricule = "";
  form.Nom = "";
  form.Prenom = "";
  form.email = "";
  form.direction = "";
  form.password = "";
  form.Fonction = "";
  addUser.value = true;
}

function closeAddUser() {
  addUser.value = false;
  myerrors.value = false;
  form.Matricule = "";
  form.Nom = "";
  form.Prenom = "";
  form.email = "";
  form.direction = "";
  form.password = "";
  form.Fonction = "";
}
async function openDeleteUser(data) {
  deleteUser.value = true;
  Matricule.value = data.Matricule;
  form.Nom = data.Nom;
  form.Prenom = data.Prenom;
}
function closeDeleteUser() {
  deleteUser.value = false;
  Matricule.value = "";
  form.Nom = "";
  form.Prenom = "";
}

watch([() => authStore.dr_id],
async () => {
  await fetchData(null);
})

onBeforeMount(async () => {
  // authStore.setProperty("volet", "utilisateurs");
  drs.value = authStore.directions;
  await fetchData(null);
});
onMounted(async () => {
});

// Utilisateurs cols
let utlisateursCols = reactive([
  { name: "Actions", label: "Actions", align: "left" },
  {
    name: "Matricule",
    label: "Matricule",
    align: "left",
    field: (row) => row.Matricule ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Nom",
    label: "Nom",
    align: "left",
    field: (row) => row.Nom ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Prenom",
    label: "Prenom",
    align: "left",
    field: (row) => row.Prenom ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Email",
    label: "Email",
    align: "left",
    field: (row) => row.email ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "direction",
    label: "Direction",
    align: "left",
    field: (row) => row.Nom_DR ?? "//",
    format: (val) => `${val}`,
    sortable: true,
    style: "white-space: pre-wrap;",
  },
  {
    name: "privilege",
    label: "Profil",
    align: "left",
    field: (row) => row.privilege ?? "//",
    format: (val) => `${val}`,
    sortable: true,
  },

]);

let myerrors = ref();
let message = ref();
let initialPagination = ref({
        // sortBy: 'desc',
        // descending: false,
        // page: 2,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      })
const $q = useQuasar();

const options = ref(fonctions.value);

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      options.value = fonctions.value.map((option) => ({ ...option }));;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = fonctions.value.filter(v =>
    v?.LibelleFct?.toLowerCase().indexOf(needle) > -1
    ||
    v?.CodeFnt?.toLowerCase().indexOf(needle) > -1
  ).map((option) => ({ ...option }));
  });
}

const sendData = async () => {
  // Prepare the data to be sent
  const data = {
    Matricule: form.Matricule,
    Nom: form.Nom,
    Prenom: form.Prenom,
    email: form.email,
    direction: form.direction,
    Structure: form.Structure,
    password: form.password,
  };
  await api
    .post("/api/gu/utilisateur", data)
    .then(async (response) => {
      await fetchData(searchUsers.value);
      message.value = response.data.message;
      $q.notify({
        type: "positive",
        message: message.value,
      });
      closeAddUser()
    })
    .catch((errors) => {
      console.log(errors);
      if (errors.response && errors.response.status === 422) {

        myerrors.value = errors.response.data.errors;
      }
      // Handle any errors that occur during the request
    });
};
const updateData = async () => {
  // Prepare the data to be sent
  const data = {
    email: form.email,
    privilege: form.privilege,
    direction: form.direction,
    password: form.password,
  };

  // Make a POST request to the Laravel API endpoint
  await api
    .patch(`/api/gu/utilisateur/${Matricule.value}`, data)
    .then(async (response) => {
      await fetchData(searchUsers.value);
      message.value = response.data.message;
      $q.notify({
        type: "positive",
        message: message.value,
      });
      closeEditModel()
    })
    .catch((errors) => {
      console.log(errors);
      if (errors.response && errors.response.status === 422) {

        myerrors.value = errors.response.data.errors;
      }
      // Handle any errors that occur during the request
    });
};
const deleteData = async () => {
  // Make a POST request to the Laravel API endpoint
  await api
    .get(`/api/gu/utilisateur/delete/${Matricule.value}`)
    .then(async (response) => {
      await fetchData(searchUsers.value);
      message.value = response.data.message;
      $q.notify({
        type: "negative",
        message: message.value,
      });
      closeDeleteUser()
    })
    .catch((errors) => {
      console.log(errors);
    });
};
async function UserActivation(data) {
  Matricule.value = data.Matricule;
  form.Nom = data.Nom;
  form.Prenom = data.Prenom;

  await api
    .get(`/api/gu/utilisateur/activation/${Matricule.value}`)
    .then(async (response) => {
      await fetchData(searchUsers.value);
      message.value = response.data.message;
      $q.notify({
        type: "positive",
        message: message.value,
      });
      closeDeleteUser()
    })
    .catch((errors) => {
      console.log(errors);
    });
};

const revokeProfile = async (data) => {
  Matricule.value = data.Matricule;
  // Make a POST request to the Laravel API endpoint
  await api
    .get(`/api/gu/utilisateur/revoke-profile/${Matricule.value}`)
    .then(async (response) => {
      console.log(searchUsers.value);
      await fetchData(searchUsers.value);
      message.value = response.data.message;
      $q.notify({
        type: "positive",
        message: message.value,
      });
    })
    .catch((errors) => {
      console.log(errors);
    });
};
</script>
