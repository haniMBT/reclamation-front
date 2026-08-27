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
              v-if="privilege && privilege.insertion==1"
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
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="openDeleteModel(props.row)"
                    class="hover:bg-red-50"
                    v-if="authStore.user.privilege != props.row.code && privilege && privilege.suppression==1"
                  >
                    <q-tooltip>Supprimer le profil</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    size="sm"
                    color="orange-8"
                    @click="openEditModel(props.row)"
                    class="hover:bg-orange-50"
                    v-if="privilege && privilege.modification==1"
                  >
                    <q-tooltip>Modifier le profil</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="vpn_key"
                    size="sm"
                    color="warning"
                    @click="ShowPrivilege(props.row)"
                    class="hover:bg-orange-50"
                    v-if="privilege && privilege.consultation==1"
                  >
                    <q-tooltip>Gérer les privilèges</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="group_add"
                    size="sm"
                    color="teal-7"
                    @click="openDelegations(props.row)"
                    class="hover:bg-teal-50"
                    v-if="privilege && privilege.modification==1"
                  >
                    <q-tooltip>Profils délégables</q-tooltip>
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
              <q-td key="delegations_count" :props="props">
                <q-chip
                  dense
                  square
                  :color="props.row.delegations_count > 0 ? 'teal-1' : 'grey-3'"
                  :text-color="props.row.delegations_count > 0 ? 'teal-9' : 'grey-7'"
                  class="font-medium"
                >
                  {{ props.row.delegations_count }}
                  <q-tooltip v-if="props.row.delegations_count > 0">
                    Ce profil peut attribuer {{ props.row.delegations_count }} profil(s)
                  </q-tooltip>
                  <q-tooltip v-else>
                    Ce profil ne peut attribuer aucun profil
                  </q-tooltip>
                </q-chip>
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

      <!-- Edit Profile Dialog -->
      <q-dialog v-model="editProfil" persistent>
        <q-card class="w-full max-w-4xl">
          <q-card-section class="flex items-center bg-orange-50">
            <q-icon name="edit" class="text-orange-700 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-orange-900">
                {{ 'Modifier le profil : ' + Code }}
              </div>
              <div class="text-sm text-orange-800">
                Le code n'est pas modifiable : il rattache les privilèges, les délégations et les utilisateurs
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg" style="max-height: 70vh;">
            <div class="overflow-auto">
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Code
                    </label>
                    <q-input
                      v-model="form.code"
                      outlined
                      dense
                      readonly
                      bg-color="grey-2"
                    >
                      <template #prepend>
                        <q-icon name="code" class="text-gray-500" />
                      </template>
                    </q-input>
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

                <div class="text-sm text-gray-600 border-l-4 border-gray-300 pl-4">
                  La visibilité et le rôle du profil ne sont pas reportés sur la matrice
                  des privilèges déjà enregistrée : elle se règle volet par volet depuis
                  « Gérer les privilèges ».
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
              @click="closeEditProfil"
              class="px-6"
            />
            <q-btn
              color="orange-8"
              label="Enregistrer"
              @click="updateData"
              :loading="editSaving"
              class="px-8"
            >
              <q-icon name="save" class="mr-2" />
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delegations Dialog -->
      <q-dialog v-model="showDelegations" persistent>
        <q-card class="w-full max-w-2xl">
          <q-card-section class="flex items-center bg-teal-50">
            <q-icon name="group_add" class="text-teal-700 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-teal-900">
                {{ 'Profils délégables : ' + delegationProfil.libelle }}
              </div>
              <div class="text-sm text-teal-800">
                Les profils qu'un utilisateur portant ce profil pourra attribuer à d'autres utilisateurs
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg" style="max-height: 60vh;">
            <div class="overflow-auto">
              <div v-if="delegationOptions.length === 0" class="text-sm text-gray-600">
                Aucun profil n'existe encore.
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <q-checkbox
                  v-for="option in delegationOptions"
                  :key="option.code"
                  v-model="delegationSelection"
                  :val="option.code"
                  color="teal-7"
                >
                  <div>
                    <div class="text-sm font-medium text-gray-800">{{ option.libelle }}</div>
                    <div class="text-xs text-gray-500">{{ option.code }}</div>
                  </div>
                </q-checkbox>
              </div>

              <div class="mt-6 text-sm text-gray-600 border-l-4 border-gray-300 pl-4">
                <span v-if="delegationSelection.length === 0">
                  Aucun profil sélectionné : les utilisateurs de ce profil ne pourront attribuer aucun profil.
                </span>
                <span v-else>
                  {{ delegationSelection.length }} profil(s) attribuable(s) par les utilisateurs de ce profil.
                </span>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-lg">
            <q-btn
              flat
              color="grey-7"
              label="Annuler"
              @click="closeDelegations"
              class="px-6"
            />
            <q-btn
              color="teal-7"
              label="Enregistrer"
              @click="saveDelegations"
              :loading="delegationSaving"
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

let privilege = ref(null);
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
Roles.value.push({ code: 'client', value: 'client' });/// pour reclamation clien peut cree les reclamation sont niveau de visisilbilite toujour P
Roles.value.push({ code: 'employe', value: 'employe' });/// pour reclamation clien peut cree les reclamation avec 3 niveau de visisilbilite
Roles.value.push({ code: 'employe_Répondeur', value: 'employe_Répondeur' });/// pour reclamation clien peut cree les reclamation avec 3 niveau de visisilbilite et peur repondre recalmaiton concern ca direction
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
    privilege.value=response.data.privilege;
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

// --- Profils délégables ---------------------------------------------------
// Définit, pour un profil donné, la liste des profils que ses utilisateurs
// pourront attribuer depuis l'écran Gestion des Utilisateurs.
let showDelegations = ref(false);
let delegationProfil = ref({});
let delegationOptions = ref([]);
let delegationSelection = ref([]);
let delegationSaving = ref(false);

async function openDelegations(data) {
  delegationProfil.value = data;
  delegationOptions.value = [];
  delegationSelection.value = [];
  showDelegations.value = true;

  try {
    const response = await api.get(`/api/gu/securite/delegations/${data.code}`);
    delegationOptions.value = response.data.profils;
    delegationSelection.value = response.data.delegations;
  } catch (error) {
    showDelegations.value = false;
    $q.notify({
      type: "negative",
      message: "Impossible de charger les profils délégables.",
    });
  }
}

function closeDelegations() {
  showDelegations.value = false;
  delegationProfil.value = {};
  delegationOptions.value = [];
  delegationSelection.value = [];
}

const saveDelegations = async () => {
  delegationSaving.value = true;
  try {
    const response = await api.post(
      `/api/gu/securite/delegations/${delegationProfil.value.code}`,
      { delegations: delegationSelection.value }
    );
    $q.notify({
      type: "positive",
      message: response.data.message,
    });
    closeDelegations();
    // Rafraîchit la colonne « Profils délégables »
    await fetchData(searchProfils.value);
  } catch (errors) {
    $q.notify({
      type: "negative",
      message:
        errors.response?.data?.message ??
        "L'enregistrement des profils délégables a échoué.",
    });
  }
  delegationSaving.value = false;
};
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
// --- Modification d'un profil ---------------------------------------------
let editProfil = ref(false);
let editSaving = ref(false);

async function openEditModel(data) {
  Code.value = data.code;
  form.code = data.code;
  form.libelle = data.libelle;
  form.description = data.description;
  // Les q-select travaillent sur les objets { code, value } : on retrouve
  // l'option correspondant à la valeur stockée en base.
  form.limitation = limitations.value.find((o) => o.code === data.limitation) ?? null;
  form.role = Roles.value.find((o) => o.code === data.role) ?? null;
  myerrors.value = false;
  editProfil.value = true;
}

function closeEditProfil() {
  editProfil.value = false;
  myerrors.value = false;
  form.code = "";
  Code.value = "";
  form.libelle = "";
  form.role = "";
  form.description = "";
  form.limitation = "";
}

const updateData = async () => {
  editSaving.value = true;
  try {
    const response = await api.put(`/api/gu/securite/${Code.value}`, {
      libelle: form.libelle,
      description: form.description,
      role: form.role?.code,
      limitation: form.limitation?.code,
    });
    $q.notify({
      type: "positive",
      message: response.data.message,
    });
    closeEditProfil();
    await fetchData(searchProfils.value);
  } catch (errors) {
    if (errors.response && errors.response.status === 422) {
      myerrors.value = errors.response.data.errors;
    } else {
      $q.notify({
        type: "negative",
        message:
          errors.response?.data?.message ?? "La modification du profil a échoué.",
      });
    }
  }
  editSaving.value = false;
};

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
  {
    name: "delegations_count",
    label: "Profils délégables",
    align: "left",
    field: (row) => row.delegations_count ?? 0,
    format: (val) => `${val}`,
    sortable: true,
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
      message.value = response.data.message;
      // privilege.value = response.data.privilege;
      $q.notify({
        type: "positive",
        message: message.value,
      });
      closeAddProfil();
            await fetchData(searchProfils.value);

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
