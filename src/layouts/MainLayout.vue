<template>

  <q-layout view="hHh LpR LFR">



    <q-header elevated class="tw-bg-white">
      <q-toolbar class="tw-px-2">

        <q-btn flat round dense :icon="drawer ? 'close' : 'menu'" @click="drawer = !drawer" class="tw-text-black tw-text-lg">
          <q-tooltip transition-show="flip-right" transition-hide="flip-left" anchor="center left" self="center right" class="tw-text-sm tw-bg-gray-800 shadow-4">
            {{ drawer ? 'Masquer' : 'Afficher' }}
          </q-tooltip>
        </q-btn>

        <div class="tw-w-full tw-flex tw-justify-between tw-items-center">
          <!-- Logo/Title -->
          <div class="tw-flex tw-items-center">
            <q-img class="tw-w-8 tw-h-8 tw-mr-2" src="/logo epal.png" />
          </div>

          <!-- Right side controls -->
          <div class="tw-flex tw-items-center tw-gap-2">
          
            <!-- User Profile Dropdown -->
            <q-btn-dropdown 
              flat 
              round 
              class="tw-text-gray-600"
              dropdown-icon="none"
            >
              <template v-slot:label>
                <div class="tw-flex tw-items-center">
                  <q-avatar size="32px" class="tw-mr-2">
                    <img src="https://i.pravatar.cc/150?img=3" alt="User Avatar" />
                  </q-avatar>
                  <div class="tw-text-left tw-hidden md:tw-block">
                    <div class="tw-text-sm tw-font-semibold tw-text-gray-800">{{ authStore.userProfile?.fullName || 'Utilisateur' }}</div>
                    <div class="tw-text-xs">{{ authStore.userProfile?.email || 'user@epal.dz' }}</div>
                  </div>
                </div>
              </template>

              <q-list style="min-width: 200px">
                <q-item clickable v-close-popup @click="$router.push('/profil')">
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Mon profil</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
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
                    <q-item-label class="tw-text-red-600">Déconnexion</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>


      </q-toolbar>
    </q-header>





    <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" class="tw-bg-white tw-flex tw-flex-col" :breakpoint="500" elevated :mini-width="50">
      <q-item class="tw-px-1 tw-my-2 tw-shadow">
        <q-item-section avatar>
          <q-icon size="xl">
            <q-img src="/logo epal.png" />
          </q-icon>
        </q-item-section>
        <q-item-section class="tw-flex tw-flex-col tw-items-center tw-font-black tw-text-blue-800">
          <q-separator class="tw-w-4/5 tw-bg-blue-800" />
          <p class="tw-text-xl">Entreprise Portuaire</p>
          <q-separator class="tw-w-1/2 tw-bg-blue-800" />
          <p> d'Alger | DPI</p>
          <q-separator class="tw-w-4/5 tw-bg-blue-800" />
        </q-item-section>
      </q-item>
      <q-scroll-area class="tw-flex-grow" :horizontal-thumb-style="{ opacity: 1 }">
        <q-list padding>
          <!--    Dashboard    -->
          <q-item to="/" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="md">
                <img src="/images/menu/dashboard.png" />
              </q-icon>
            </q-item-section>
            <q-item-section>
              Dashboard
            </q-item-section>
          </q-item>
      
          <q-separator />


    

          <q-expansion-item>
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <q-icon size="md">
                  <img src="/images/menu/digital-wallet.png" />
                </q-icon>
              </q-item-section>
              <q-item-section>
                E-Paiement
              </q-item-section>
            </template>


            <q-expansion-item :header-inset-level="1" expand-icon="0" to="/essais/dashboardP">
              <template v-slot:header="{ expanded }">
                <q-item-section>
                  <q-item-section-label>Dashboard</q-item-section-label>
                </q-item-section>
              </template>
            </q-expansion-item>

          </q-expansion-item>

          <!--    Assistance technique   -->


          <q-expansion-item>
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <q-icon size="lg">
                  <img src="/images/menu/invoice.png" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                Facture Proforma
              </q-item-section>
            </template>
            <q-expansion-item :header-inset-level="1" expand-icon="0" to="/assistance-technique/demande_assistanceP">
              <template v-slot:header="{ expanded }">
                <q-item-section>
                  <q-item-section-label>Facture proforma</q-item-section-label>
                </q-item-section>
              </template>
            </q-expansion-item>
           
            </q-expansion-item>


          <!--    Base de données technique   -->

          <q-expansion-item>
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
         

            <q-expansion-item :header-inset-level="1" label="Dashboard" expand-icon="0" to="/base-de-donnees-technique/fiches_rpp" />
          </q-expansion-item>



          <!--    Gestion des utilisateurs   -->
          <q-expansion-item>
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <q-icon size="md">
                  <img src="/images/menu/gestion_des_utilisateurs.png" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                Gestion des utilisateurs
              </q-item-section>
            </template>
            <q-expansion-item :header-inset-level="1" label="Utilisateurs" expand-icon="0" to="/utilisateur" />
            <q-expansion-item :header-inset-level="1" label="Privilèges" expand-icon="0" to="/privilege" />
            <q-expansion-item :header-inset-level="1" label="Mon profil" expand-icon="0" to="/profile" />
          </q-expansion-item>
          <!--    Log History   -->
          <!-- <q-item v-if="authStore?.privileges?.role == 'Admin'" to="/log-history" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="md">
                <img src="/images/menu/log_history.png" />
              </q-icon>
            </q-item-section>
            <q-item-section>
              Journal d'activités
            </q-item-section>
          </q-item> -->

      
        </q-list>
      </q-scroll-area>
    </q-drawer>
    
    <!-- PAGE CONTAINER - OBLIGATOIRE POUR QUASAR -->
    <q-page-container>
      <router-view />
    </q-page-container>
    
    <q-footer elevated class="tw-bg-white tw-text-gray-600 tw-text-xxs tw-text-center tw-py-2">
      {{ currentYear }} © Entreprise Portuaire d'Alger / D.P.I
    </q-footer>
   
  </q-layout>

  <q-inner-loading :showing="visible" label-class="text-teal" label-style="font-size: 1.1em" color="purple" />

</template>

<script setup>
import { computed, onMounted, ref, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth";
import moment from "moment/moment";
import { api } from "boot/axios";
import { useMeta, useQuasar } from "quasar";
let drawer = ref(false);
let visible = ref(true);
let miniState = ref(true);
const currentYear = computed(() => moment().year());
const metaData = {
  title: 'EPAL - Entreprise Portuaire d\'Alger'
}
useMeta(metaData)

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const visibilite = computed(() => authStore.privileges?.visibilite);

// Theme management - Version simplifiée
const toggleTheme = () => {
  $q.dark.toggle();
  localStorage.setItem('epal_dark_mode', $q.dark.isActive);
};

// Logout function
const logout = async () => {
  try {
    await authStore.logout();
    router.push('/acceuil');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    router.push('/acceuil');
  }
};

onBeforeMount(async () => {
  // Load saved theme preference
  const isDarkMode = localStorage.getItem('epal_dark_mode') === 'true';
  $q.dark.set(isDarkMode);
  
  // Initialiser l'AuthStore depuis localStorage
  authStore.initializeFromStorage();
});

onMounted(async () => {
  setTimeout(() => {
    visible.value = false;
  }, 500);
});

</script>

<style>
/* Transitions fluides */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
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
</style>
