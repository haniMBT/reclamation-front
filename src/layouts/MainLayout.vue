<template>
  <q-layout view="hHh LpR LFR">
    <q-header elevated class="bg-white">
      <q-toolbar class="px-2">
        <q-btn
          flat
          round
          dense
          :icon="drawer ? 'close' : 'menu'"
          @click="drawer = !drawer"
          class="text-black text-lg"
        >
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            anchor="center left"
            self="center right"
            class="text-sm bg-gray-800 shadow-4"
          >
            {{ drawer ? "Masquer" : "Afficher" }}
          </q-tooltip>
        </q-btn>

        <div class="w-full flex justify-between items-center">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <q-img class="w-8 h-8 mr-2" src="/logo-epal.png" />
            <!-- Masquer le titre sur mobile très petit -->
            <div class="hidden sm:block text-lg font-semibold text-gray-800">
              EPAL
            </div>
          </div>

          <!-- Right side controls -->
          <div class="flex items-center gap-2">

            <!-- User Profile Dropdown -->
            <q-btn-dropdown
              flat
              round
              class="text-gray-600"
              dropdown-icon="none"
            >
              <template v-slot:label>
                <div class="flex items-center">
                  <q-avatar size="32px" class="mr-1 sm:mr-2">
                    <img
                      v-if="userPhoto"
                      :src="userPhoto"
                      class="w-full h-full object-cover"
                    />
                  </q-avatar>
                  <!-- Masquer les infos texte sur petit mobile -->
                  <div class="text-left">
                    <div class="text-sm font-semibold text-gray-800 capitalize">
                      {{ authStore.userProfile?.fullName || "Utilisateur" }}
                    </div>
                    <div class="text-xs lowercase">
                      {{ authStore.userProfile?.email || "user@epal.dz" }}
                    </div>
                  </div>
                </div>
              </template>

              <q-list style="min-width: 200px">
                <q-item
                  clickable
                  v-close-popup
                  @click="$router.push('/profil')"
                >
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Mon profil</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="$router.push('/under-development')">
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Paramètres</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-close-popup @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-red-600"
                      >Déconnexion</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState && $q.screen.gt.sm"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      class="bg-white flex flex-col"
      :breakpoint="768"
      elevated
      :mini-width="60"
      :width="300"
    >
      <q-item
        class="px-1 my-2 shadow"
        :class="{ 'text-center': miniState && $q.screen.gt.sm }"
      >
        <q-item-section avatar>
          <q-icon size="xl">
            <q-img src="/logo-epal.png" />
          </q-icon>
        </q-item-section>
        <q-item-section
          v-if="!miniState || !$q.screen.gt.sm"
          class="flex flex-col items-center font-black text-blue-800"
        >
          <q-separator class="w-4/5 bg-blue-800" />
          <p class="text-base lg:text-xl">Entreprise Portuaire</p>
          <q-separator class="w-1/2 bg-blue-800" />
          <p class="text-sm lg:text-base">d'Alger | DPI</p>
          <q-separator class="w-4/5 bg-blue-800" />
        </q-item-section>
      </q-item>
      <q-scroll-area class="flex-grow" :horizontal-thumb-style="{ opacity: 1 }">
        <q-list padding>
          <!--    Dashboard    -->
          <q-item to="/" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="md">
                <img src="/images/menu/dashboard.png" />
              </q-icon>
            </q-item-section>
            <q-item-section> Dashboard </q-item-section>
          </q-item>
          <q-separator />

          <q-expansion-item expand-icon="0" to="/epayment/factures">
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <q-icon size="md">
                  <img src="/images/menu/digital-wallet.png" />
                </q-icon>
              </q-item-section>
              <q-item-section> E-Paiement </q-item-section>
            </template>
          </q-expansion-item>

          <!--    Module Proforma   -->
          <q-expansion-item>
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <q-icon size="lg">
                  <img src="/images/menu/invoice.png" />
                </q-icon>
              </q-item-section>

              <q-item-section> Facture Proforma </q-item-section>
            </template>
            <q-expansion-item
              :header-inset-level="1"
              label="Calculer Proforma"
              expand-icon="0"
              to="/proforma"
            />
            <q-expansion-item
              :header-inset-level="1"
              label="Historique"
              expand-icon="0"
              to="/proforma/history"
            />
          </q-expansion-item>


          <!--    Base de données technique   -->

          <q-expansion-item >
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <q-icon size="lg">
                  <img src="/images/menu/complain.png" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                <q-item-section-label>Réclamation client</q-item-section-label>
              </q-item-section>
            </template>
            <q-expansion-item :header-inset-level="1" label="Liste des réclamations" expand-icon="0" to="/reclamations/all" />
            <q-expansion-item :header-inset-level="1" label="Nouvelle réclamation" expand-icon="0" to="/reclamations/client" />
            <q-expansion-item :header-inset-level="1" label="Nature" expand-icon="0" to="/reclamations/nature" />
            <q-expansion-item :header-inset-level="1" label="Parametrage" expand-icon="0" to="/reclamations/parametrage" />

          </q-expansion-item>


          <!--    Gestion des utilisateurs   -->
          <q-expansion-item>
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <q-icon size="md">
                  <img src="/images/menu/gestion_des_utilisateurs.png" />
                </q-icon>
              </q-item-section>

              <q-item-section> Gestion des utilisateurs </q-item-section>
            </template>
            <q-expansion-item
              :header-inset-level="1"
              label="Utilisateurs"
              expand-icon="0"
              to="/utilisateur"
            />
            <q-expansion-item
              :header-inset-level="1"
              label="Privilèges"
              expand-icon="0"
              to="/privilege"
            />
            <q-expansion-item
              :header-inset-level="1"
              label="Volet d'application"
              expand-icon="0"
              to="/volets"
            />
          </q-expansion-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>


    <!-- PAGE CONTAINER - OBLIGATOIRE POUR QUASAR -->
    <q-page-container>
      <router-view />
    </q-page-container>


    <q-footer elevated class="bg-white text-gray-600 text-xxs text-center py-2">
      {{ currentYear }} © Entreprise Portuaire d'Alger / D.P.I
    </q-footer>

  </q-layout>

  <q-inner-loading
    :showing="visible"
    label-class="text-teal"
    label-style="font-size: 1.1em"
    color="purple"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth";
import moment from "moment/moment";
import { api } from "boot/axios";
import { useMeta, useQuasar } from "quasar";
const userPhoto = computed(() => authStore.getUserPhoto);
let drawer = ref(false);
let visible = ref(true);
let miniState = ref(true);
const currentYear = computed(() => moment().year());
const metaData = {
  title: "EPAL - Entreprise Portuaire d'Alger",
};
useMeta(metaData);

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const visibilite = computed(() => authStore.privileges?.visibilite);

// Theme management - Version simplifiée
const toggleTheme = () => {
  $q.dark.toggle();
  localStorage.setItem("epal_dark_mode", $q.dark.isActive);
};

// Logout function
const logout = async () => {
  try {
    await authStore.logout();
    router.push("/acceuil");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    router.push("/acceuil");
  }
};

onBeforeMount(async () => {
  // Load saved theme preference
  const isDarkMode = localStorage.getItem("epal_dark_mode") === "true";
  $q.dark.set(isDarkMode);


  // Initialiser l'AuthStore depuis localStorage
  authStore.initializeFromStorage();
});

onMounted(async () => {
  setTimeout(() => {
    visible.value = false;
  }, 500);
});


// watch(
//   () => authStore.volet,
//   async (newVal, oldVal) => {
//     if (newVal && newVal != "null" && newVal != oldVal) {
//       await authStore.getPrivileges();
//       await authStore.getDirections();
//     }
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );

</script>

<style>
/* Transitions fluides */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* Styles pour le mode sombre */
body.body--dark {
  /* Quasar gère automatiquement le dark mode */
}

/* Scrollbar personnalisé pour le mode sombre */
body.body--dark ::-webkit-scrollbar {
  width: 8px;
}

body.body--dark ::-webkit-scrollbar-track {
  background: #1e1e1e;
}

body.body--dark ::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 4px;
}

body.body--dark ::-webkit-scrollbar-thumb:hover {
  background: #616161;
}

@media print {
  body * {
    visibility: hidden;
  }

  .q-page-container {
    padding-left: 0px !important;
    padding-top: 0px !important;
  }
}
</style>
