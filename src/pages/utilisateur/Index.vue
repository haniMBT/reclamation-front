<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="group" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Utilisateurs</h1>
            <p class="text-gray-600 text-sm">Administration des utilisateurs et attribution des privilèges</p>
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
              @click="openAddUser"
              v-if="privilege && privilege.insertion==1"
              class="px-6"
            >
              Nouvel utilisateur
            </q-btn>
            <q-input
              outlined
              dense
              v-model="searchUsers"
              label="Rechercher un utilisateur"
              class="min-w-[300px]"
            >
              <template #prepend>
                <q-icon name="search" class="text-blue-600" />
              </template>
              <template #append>
                <q-icon
                  name="close"
                  @click="clearSearchUsers"
                  class="cursor-pointer text-gray-500 hover:text-gray-700"
                />
              </template>
            </q-input>
          </div>

          <!-- Radio buttons section -->
          <!-- <div class="flex items-center gap-4">
            <div class="text-sm font-medium text-gray-700">Statut :</div>
            <div class="flex gap-3">
              <q-radio v-model="actif" val="1" label="Actif" color="green" />
              <q-radio v-model="actif" val="0" label="Inactif" color="grey" />
              <q-radio v-model="actif" :val="null" label="Tous" color="blue" />
            </div>
          </div> -->
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <q-table
          v-if="showuserstable"
          flat
          :rows="utilisateurs"
          :columns="utlisateursCols"
          :pagination="initialPagination"
          class="my-4"
        >
          <template v-slot:body="props">
            <q-tr v-if="!loadingAffaires" :props="props" :class="{ 'bg-gray-50': props.rowIndex % 2 == 0 }">
              <q-td key="Actions" :props="props">
                <div class="flex items-center gap-2">
                  <!--  -->
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="openDeleteUser(props.row)"
                    class="hover:bg-red-50"
                    v-if="authStore.user.id != props.row.id && privilege && privilege.suppression==1"
                  >
                    <q-tooltip>Supprimer l'utilisateur</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    size="sm"
                    color="warning"
                    v-if="privilege && privilege.modification==1"
                    @click="openEditModel(props.row)"
                    class="hover:bg-orange-50"
                  >
                    <q-tooltip>Modifier l'utilisateur</q-tooltip>
                  </q-btn>
<!--
                  <q-icon class="p-1 cursor-pointer" name="toggle_off" size="sm" color="green"
                  v-if="authStore.user.Matricule != props.row.Matricule && privilege && privilege.modification==1 && (props.row.Actif=='1'|| props.row.Actif==null) "
                    @click="UserActivation(props.row)" />
                  <q-icon class="p-1 cursor-pointer" name="toggle_on" size="sm" color="grey"
                  v-if="authStore.user.Matricule != props.row.Matricule && privilege && privilege.modification==1 && props.row.Actif=='0' "
                    @click="UserActivation(props.row)" /> -->
                </div>
              </q-td>
              <q-td key="Matricule" :props="props">
                <span v-if="props.row.Matricule" class="font-medium text-gray-900">{{ props.row.Matricule }}</span>
                <span v-else class="text-gray-400 italic">non renseigné</span>
              </q-td>
              <q-td key="Nom" :props="props">
                <span class="text-gray-800">{{ props.row.Nom }}</span>
              </q-td>
              <q-td key="Prenom" :props="props">
                <span class="text-gray-800">{{ props.row.Prenom }}</span>
              </q-td>
              <q-td key="Email" :props="props">
                <span class="text-gray-800">{{ props.row.Email }}</span>
              </q-td>
              <q-td key="direction" :props="props">
                <span class="text-gray-800">{{ props.row.direction }}</span>
              </q-td>
              <q-td key="privilege" :props="props">
                <span class="text-gray-800">{{ props.row.privilege }}</span>
 <!-- v-if="props.row.privilege &&
                   props.row.privilege != authStore.user.privilege && privilege && privilege.consultation==1" -->
                <!-- Renvoi vers Gestion des Profils : masqué si l'utilisateur
                     n'y a pas accès, même condition que l'entrée de menu -->
                <q-icon
                    class="p-1 cursor-pointer" name="visibility" size="sm" @click="ShowPrivilege(props.row)" color="blue"
                   v-if="props.row.privilege &&
                   props.row.privilege != authStore.user.privilege && privilege && privilege.consultation==1
                   && privilegeProfils && privilegeProfils.role=='Admin'"
                   >
                  <q-tooltip>Consulter le profil</q-tooltip>
                </q-icon>


                <q-icon  class="p-1 cursor-pointer" name="delete" size="sm" color="negative"
                v-if="props.row.privilege &&
                  props.row.privilege != authStore.user.privilege && privilege && privilege.suppression==1"
                  @click="revokeProfile(props.row)" />

              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- Dialogs -->
      <!-- Add User Dialog -->
      <q-dialog v-model="addUser" persistent>
        <q-card class="w-full max-w-4xl">
          <q-card-section class="flex items-center bg-blue-50">
            <q-icon name="person_add" class="text-blue-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-blue-900">Ajouter un utilisateur</div>
              <div class="text-sm text-blue-700">Remplissez les informations de l'utilisateur</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg" style="max-height: 70vh;">
            <div class="overflow-auto">
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Matricule <span class="text-gray-400 font-normal">(facultatif)</span>
                    </label>
                    <q-input
                      v-model="form.Matricule"
                      outlined
                      dense
                      maxlength="6"
                      placeholder="6 caractères, ou laissez vide"
                      :rules="[val => !val || val.length === 6 || 'Le matricule doit faire 6 caractères']"
                    >
                      <template #prepend>
                        <q-icon name="badge" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.Matricule" :myerrors="myerrors?.Matricule" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.Nom"
                      outlined
                      dense
                      placeholder="Entrez le nom"
                      :rules="[val => !!val || 'Le nom est requis']"
                    >
                      <template #prepend>
                        <q-icon name="person" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.Nom" :myerrors="myerrors?.Nom" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.Prenom"
                      outlined
                      dense
                      placeholder="Entrez le prénom"
                      :rules="[val => !!val || 'Le prénom est requis']"
                    >
                      <template #prepend>
                        <q-icon name="person_outline" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.Prenom" :myerrors="myerrors?.Prenom" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Identifiant <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.email"
                      outlined
                      dense
                      placeholder="prenom.nom"
                      type="text"
                      :rules="[val => !val || regleIdentifiant.test(val) || messageIdentifiant]"
                    >
                      <template #prepend>
                        <q-icon name="email" class="text-blue-600" />
                      </template>
                    </q-input>
                    <div class="mt-2 text-xs text-gray-600">
                      Sert d'identifiant de connexion. Le « @ » n'est pas obligatoire.
                      Sans adresse complète, cet utilisateur ne pourra pas recevoir de
                      code de réinitialisation par mail.
                    </div>
                    <ErrorValidation v-if="myerrors?.email" :myerrors="myerrors?.email" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Direction <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.direction"
                      :options="drs"
                      outlined
                      dense
                      :readonly="drs.length === 1"
                      :bg-color="drs.length === 1 ? 'grey-2' : undefined"
                      placeholder="Sélectionnez la direction"
                      :rules="[val => !!val || 'La direction est requise']"
                    >
                      <template #prepend>
                        <q-icon name="business" :class="drs.length === 1 ? 'text-gray-500' : 'text-blue-600'" />
                      </template>
                    </q-select>
                    <div v-if="drs.length === 1" class="mt-2 text-xs text-gray-600">
                      Votre profil ne permet de rattacher un utilisateur qu'à votre direction.
                    </div>
                    <ErrorValidation v-if="myerrors?.direction" :myerrors="myerrors?.direction" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.password"
                      outlined
                      dense
                      placeholder="•••••••••"
                      type="password"
                      :rules="[val => !!val || 'Le mot de passe est requis']"
                    >
                      <template #prepend>
                        <q-icon name="lock" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.password" :myerrors="myerrors?.password" />
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
              @click="closeAddUser"
              class="px-6"
            />
            <q-btn
              color="blue-6"
              label="Enregistrer"
              @click="sendData"
              :loading="false"
              class="px-8"
            >
              <q-icon name="save" class="mr-2" />
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit User Dialog -->
      <q-dialog v-model="UpdateUser" persistent>
        <q-card class="w-full max-w-4xl">
          <q-card-section class="flex items-center bg-orange-50">
            <q-icon name="manage_accounts" class="text-orange-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-orange-900">
                {{ 'Attribution du privilège à' + (form?.Nom ? ' ' + form.Nom.toLowerCase() : '') + (form?.Prenom ? ' ' + form.Prenom.toLowerCase() : '') + (Matricule ? ' (' + Matricule + ')' : '') }}
              </div>
              <div class="text-sm text-orange-700">Modifier les informations et privilèges de l'utilisateur</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg" style="max-height: 70vh;">
            <div class="overflow-auto">
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Identifiant <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.email"
                      outlined
                      dense
                      placeholder="prenom.nom"
                      type="text"
                      :rules="[val => !val || regleIdentifiant.test(val) || messageIdentifiant]"
                    >
                      <template #prepend>
                        <q-icon name="email" class="text-blue-600" />
                      </template>
                    </q-input>
                    <div class="mt-2 text-xs text-gray-600">
                      Sert d'identifiant de connexion. Le « @ » n'est pas obligatoire.
                      Sans adresse complète, cet utilisateur ne pourra pas recevoir de
                      code de réinitialisation par mail.
                    </div>
                    <ErrorValidation v-if="myerrors?.email" :myerrors="myerrors?.email" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Profil <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.privilege"
                      :options="profils"
                      option-label="libelle"
                      option-value="code"
                      outlined
                      dense
                      :disable="profils.length === 0"
                      :placeholder="profils.length === 0 ? 'Aucun profil délégable' : 'Sélectionnez le profil'"
                      :rules="[val => profils.length === 0 || !!val || 'Le profil est requis']"
                    >
                      <template #prepend>
                        <q-icon name="admin_panel_settings" class="text-blue-600" />
                      </template>
                    </q-select>
                    <div v-if="profils.length === 0" class="mt-2 text-xs text-gray-600">
                      Votre profil n'a aucun profil délégable. La liste se configure depuis
                      Gestion des Profils, bouton « Profils délégables ».
                    </div>
                    <ErrorValidation v-if="myerrors?.privilege" :myerrors="myerrors?.privilege" />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Direction <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.direction"
                      :options="drs"
                      outlined
                      dense
                      :readonly="drs.length === 1"
                      :bg-color="drs.length === 1 ? 'grey-2' : undefined"
                      placeholder="Sélectionnez la direction"
                      :rules="[val => !!val || 'La direction est requise']"
                    >
                      <template #prepend>
                        <q-icon name="business" :class="drs.length === 1 ? 'text-gray-500' : 'text-blue-600'" />
                      </template>
                    </q-select>
                    <div v-if="drs.length === 1" class="mt-2 text-xs text-gray-600">
                      Votre profil ne permet de rattacher un utilisateur qu'à votre direction.
                    </div>
                    <ErrorValidation v-if="myerrors?.direction" :myerrors="myerrors?.direction" />
                  </div>

                  <div class="md:col-span-2">
                    <div class="flex items-center justify-between mb-2">
                      <label class="block text-sm font-medium text-gray-700">
                        Nouveau mot de passe
                      </label>
                      <q-toggle
                        v-model="showNewpasswordEdit"
                        color="blue-6"
                        size="sm"
                      />
                    </div>
                    <q-input
                      v-model="form.password"
                      outlined
                      dense
                      placeholder="•••••••••"
                      type="password"
                      :disable="!showNewpasswordEdit"
                      :rules="[val => !showNewpasswordEdit || !!val || 'Le mot de passe est requis']"
                    >
                      <template #prepend>
                        <q-icon name="lock" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.password" :myerrors="myerrors?.password" />
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
              @click="closeEditModel"
              class="px-6"
            />
            <q-btn
              color="orange-6"
              label="Enregistrer"
              @click="updateData"
              :loading="false"
              class="px-8"
            >
              <q-icon name="save" class="mr-2" />
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete User Dialog -->
      <q-dialog v-model="deleteUser" persistent>
        <q-card class="w-full max-w-md">
          <q-card-section class="flex items-center bg-red-50">
            <q-icon name="delete_forever" class="text-red-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-red-900">
                {{ 'Supprimer l\'utilisateur :' + (form?.Nom ? ' ' + form.Nom.toLowerCase() : '') + (form?.Prenom ? ' ' + form.Prenom.toLowerCase() : '') + (Matricule ? ' (' + Matricule + ')' : '') }}
              </div>
              <div class="text-sm text-red-700">Cette action est irréversible</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg">
            <div class="text-center">
              <q-icon name="warning" class="text-red-500 mb-4" size="4rem" />
              <div class="text-lg font-medium text-gray-900 mb-2">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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
              @click="closeDeleteUser"
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

const router = useRouter()
const authStore = useAuthStore();

let utilisateurs = ref([]);
let profils = ref([]);
let fonctions = ref([]);
let drs = ref([]);

let privilege = ref(null);
// Privilège sur le volet « privileges », pour savoir si l'utilisateur a accès
// à Gestion des Profils et donc si le renvoi vers cet écran a un sens.
let privilegeProfils = ref(null);

// Identifiant de connexion : prenom.nom, ou une adresse complète pour les
// comptes déjà en base. Doit rester aligné sur UserController::REGLE_EMAIL.
const regleIdentifiant = /^(?:[^\s@.]+(?:\.[^\s@.]+)+|[^\s@]+@[^\s@]+)$/;
const messageIdentifiant =
  "L'identifiant doit être de la forme prenom.nom (ou une adresse complète), sans espace.";
let actif = ref(null);
let addUser = ref(false);
let deleteUser = ref(false);
let UpdateUser = ref(false);
let Matricule = ref(false);   // affichage seul (titres des dialogues)
let userId = ref(null);       // cle d adressage des appels API
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
    privilege.value = response.data.privilege;
    privilegeProfils.value = response.data.privilege_profils;
    profils.value = response.data.profils.map(item => item.code);
    drs.value = response.data.drs?.map(item => item.DIRECTION);
    console.log(profils.value,'drs');
    showuserstable.value = false;
    await nextTick();
    showuserstable.value = true;
    if (authStore.user.id == userId.value && UpdateUser == true) {
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

  userId.value = data.id;
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
  userId.value = null;
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
  // Une seule direction proposée (visibilité L ou P) : le champ est verrouillé,
  // autant le pré-remplir plutôt que d'exiger un choix qui n'en est pas un.
  form.direction = drs.value.length === 1 ? drs.value[0] : "";
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
  userId.value = data.id;
  Matricule.value = data.Matricule;
  form.Nom = data.Nom;
  form.Prenom = data.Prenom;
}
function closeDeleteUser() {
  deleteUser.value = false;
  userId.value = null;
  Matricule.value = "";
  form.Nom = "";
  form.Prenom = "";
}

watch([() => authStore.dr_id],
async () => {
  await fetchData(null);
})

onBeforeMount(async () => {
  authStore.setProperty("volet", "utilisateurs");
  drs.value = authStore.directions;
  console.log(authStore, 'authStore.privileges');
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
    label: "Identifiant",
    align: "left",
    // La colonne DB est « Email » : le champ lisait row.email, donc undefined,
    // et le tri portait sur du vide pendant que la cellule affichait la valeur.
    field: (row) => row.Email ?? "//",
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
    password: form.password,
  };
  console.log('data :', data);

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
      // Direction refusée par la visibilité : le message vient du serveur
      if (errors.response && errors.response.status === 403) {
        $q.notify({
          type: "negative",
          message: errors.response.data.message,
        });
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
console.log('data :', data);

  // Make a POST request to the Laravel API endpoint
  await api
    .patch(`/api/gu/utilisateur/${userId.value}`, data)
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
      // Profil refusé par la délégation : le message vient du serveur
      if (errors.response && errors.response.status === 403) {
        $q.notify({
          type: "negative",
          message: errors.response.data.message,
        });
      }
      // Handle any errors that occur during the request
    });
};
const deleteData = async () => {
  // Make a POST request to the Laravel API endpoint
  await api
    .get(`/api/gu/utilisateur/delete/${userId.value}`)
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
// async function UserActivation(data) {
//   Matricule.value = data.Matricule;
//   form.Nom = data.Nom;
//   form.Prenom = data.Prenom;

//   await api
//     .get(`/api/gu/utilisateur/activation/${Matricule.value}`)
//     .then(async (response) => {
//       await fetchData(searchUsers.value);
//       message.value = response.data.message;
//       $q.notify({
//         type: "positive",
//         message: message.value,
//       });
//       closeDeleteUser()
//     })
//     .catch((errors) => {
//       console.log(errors);
//     });
// };

const revokeProfile = async (data) => {
  userId.value = data.id;
  // Make a POST request to the Laravel API endpoint
  await api
    .get(`/api/gu/utilisateur/revoke-profile/${userId.value}`)
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
