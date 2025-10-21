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
          class="text-black text-lg menu-btn"
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
          <!-- Logo EPAL avec animations -->
          <div class="flex items-center logo-master">
            <div class="logo-spin-container mr-2">
              <q-img class="w-8 h-8" src="/logo-epal.png" />
              <div class="logo-orbits">
                <div class="orbit orbit-1"></div>
                <div class="orbit orbit-2"></div>
                <div class="orbit orbit-3"></div>
              </div>
            </div>
            <div class="hidden sm:block text-lg font-bold text-gray-800">
              EPAL
            </div>
          </div>

          <!-- Right side controls -->
          <div class="flex items-center gap-2">
            <q-btn-dropdown
              flat
              round
              class="text-gray-600 user-dropdown"
              dropdown-icon="none"
            >
              <template v-slot:label>
                <div class="flex items-center">
                  <div class="avatar-pulse-container mr-1 sm:mr-2">
                    <q-avatar size="32px" class="avatar-glow">
                      <img
                        v-if="userPhoto"
                        :src="userPhoto"
                        class="w-full h-full object-cover"
                      />
                    </q-avatar>
                    <div class="pulse-dot"></div>
                  </div>
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

              <q-list style="min-width: 200px" class="dropdown-menu">
                <q-item clickable to="/profil" v-close-popup class="menu-item-dropdown">
                  <q-item-section avatar>
                    <div class="dropdown-icon">
                      <q-icon name="person" />
                    </div>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Mon profil</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator class="dropdown-separator" />

                <q-item clickable v-close-popup @click="logout" class="menu-item-dropdown">
                  <q-item-section avatar>
                    <div class="dropdown-icon logout-icon">
                      <q-icon name="logout" />
                    </div>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-red-600">Déconnexion</q-item-label>
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
      class="bg-white flex flex-col cosmic-drawer"
      :breakpoint="768"
      elevated
      :mini-width="60"
      :width="300"
    >
      <!-- En-tête du drawer avec effet cosmique -->
      <q-item class="px-1 my-2 drawer-header cosmic-bg">
        <q-item-section avatar>
          <div class="cosmic-logo-container">
            <q-icon size="xl">
              <q-img src="/logo-epal.png" />
            </q-icon>
            <div class="cosmic-particles">
              <div v-for="i in 12" :key="i" class="particle" :style="particleStyle(i)"></div>
            </div>
          </div>
        </q-item-section>
        <q-item-section
          v-if="!miniState || !$q.screen.gt.sm"
          class="flex flex-col items-center font-black text-blue-800 cosmic-title"
        >
          <q-separator class="w-4/5 bg-blue-800 cosmic-line" />
          <p class="text-base lg:text-xl title-shine">Entreprise Portuaire</p>
          <q-separator class="w-1/2 bg-blue-800 cosmic-line" />
          <p class="text-sm lg:text-base title-shine">d'Alger | DPI</p>
          <q-separator class="w-4/5 bg-blue-800 cosmic-line" />
        </q-item-section>
      </q-item>
      
      <q-scroll-area class="flex-grow nebula-scroll" :horizontal-thumb-style="{ opacity: 1 }">
        <q-list padding class="stellar-list">
          <!-- Dashboard avec effet holographique -->
          <q-item to="/" clickable v-ripple class="stellar-menu-item nebula-card" data-category="dashboard">
            <q-item-section avatar>
              <div class="hologram-container">
                <div class="hologram-base hologram-blue">
                  <div class="hologram-grid"></div>
                  <div class="hologram-glow"></div>
                  <svg viewBox="0 0 24 24" class="hologram-icon">
                    <path fill="currentColor" d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.6 0 1-.4 1-1s-.4-1-1-1h-1V4c0-1.1-.9-2-2-2H6C4.9 2 4 2.9 4 4v7H3c-.6 0-1 .4-1 1s.4 1 1 1zM6 4h12v7H6V4z"/>
                  </svg>
                  <div class="energy-beam beam-1"></div>
                  <div class="energy-beam beam-2"></div>
                </div>
              </div>
            </q-item-section>
            <q-item-section>
              <div class="menu-text">
                <span class="text-dark">Dashboard</span>
                <div class="text-underline"></div>
              </div>
            </q-item-section>
            <div class="stellar-badge">✨</div>
          </q-item>

          <!-- E-Paiement avec effet quantique -->
          <q-expansion-item 
            expand-icon="0" 
            class="stellar-expansion nebula-card"
            data-category="payment"
          >
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <div class="quantum-container">
                  <div class="quantum-orb quantum-green">
                    <div class="quantum-core"></div>
                    <div class="quantum-ring ring-1"></div>
                    <div class="quantum-ring ring-2"></div>
                    <div class="quantum-ring ring-3"></div>
                    <svg viewBox="0 0 24 24" class="quantum-icon">
                      <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    <div class="quantum-particle" v-for="i in 6" :key="i" :style="quantumParticleStyle(i)"></div>
                  </div>
                </div>
              </q-item-section>
              <q-item-section>
                <div class="menu-text">
                  <span class="text-dark">E-Paiement</span>
                  <div class="text-underline"></div>
                </div>
              </q-item-section>
              <div class="stellar-badge">💳</div>
            </template>

            <q-item to="/epayment/factures" clickable v-ripple class="stellar-submenu nebula-subcard">
              <q-item-section avatar>
                <div class="submenu-icon">
                  <q-icon name="receipt" color="green" />
                </div>
              </q-item-section>
              <q-item-section>
                <div class="menu-text">
                  <span class="text-dark submenu-text">Factures</span>
                </div>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- Facture Proforma avec effet cristal -->
          <q-expansion-item class="stellar-expansion nebula-card" data-category="proforma">
            <template v-slot:header="{ expanded }">
              <q-item-section avatar>
                <div class="crystal-container">
                  <div class="crystal crystal-purple">
                    <div class="crystal-facet facet-1"></div>
                    <div class="crystal-facet facet-2"></div>
                    <div class="crystal-facet facet-3"></div>
                    <div class="crystal-facet facet-4"></div>
                    <svg viewBox="0 0 24 24" class="crystal-icon">
                      <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <div class="crystal-shine"></div>
                  </div>
                </div>
              </q-item-section>
              <q-item-section>
                <div class="menu-text">
                  <span class="text-dark">Facture Proforma</span>
                  <div class="text-underline"></div>
                </div>
              </q-item-section>
              <div class="stellar-badge">📄</div>
            </template>

            <q-item to="/proforma" clickable v-ripple class="stellar-submenu nebula-subcard">
              <q-item-section avatar>
                <div class="submenu-icon">
                  <q-icon name="calculate" color="purple" />
                </div>
              </q-item-section>
              <q-item-section>
                <div class="menu-text">
                  <span class="text-dark submenu-text">Calculer Proforma</span>
                </div>
              </q-item-section>
            </q-item>

            <q-item to="/proforma/history" clickable v-ripple class="stellar-submenu nebula-subcard">
              <q-item-section avatar>
                <div class="submenu-icon">
                  <q-icon name="history" color="purple" />
                </div>
              </q-item-section>
              <q-item-section>
                <div class="menu-text">
                  <span class="text-dark submenu-text">Historique</span>
                </div>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- Réclamation client avec effet néon -->
          <q-item to="/under-development" clickable v-ripple class="stellar-menu-item nebula-card" data-category="support">
            <q-item-section avatar>
              <div class="neon-container">
                <div class="neon-sign neon-orange">
                  <div class="neon-tube"></div>
                  <div class="neon-glow"></div>
                  <svg viewBox="0 0 24 24" class="neon-icon">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                  </svg>
                  <div class="neon-spark" v-for="i in 4" :key="i" :style="neonSparkStyle(i)"></div>
                </div>
              </div>
            </q-item-section>
            <q-item-section>
              <div class="menu-text">
                <span class="text-dark">Réclamation client</span>
                <div class="text-underline"></div>
              </div>
            </q-item-section>
            <div class="stellar-badge">📢</div>
          </q-item>

          <!-- Gestion des utilisateurs avec effet data-stream -->
          <q-item to="/under-development" clickable v-ripple class="stellar-menu-item nebula-card" data-category="management">
            <q-item-section avatar>
              <div class="datastream-container">
                <div class="datastream datastream-teal">
                  <div class="stream-line line-1"></div>
                  <div class="stream-line line-2"></div>
                  <div class="stream-line line-3"></div>
                  <svg viewBox="0 0 24 24" class="datastream-icon">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <div class="data-point" v-for="i in 8" :key="i" :style="dataPointStyle(i)"></div>
                </div>
              </div>
            </q-item-section>
            <q-item-section>
              <div class="menu-text">
                <span class="text-dark">Gestion des utilisateurs</span>
                <div class="text-underline"></div>
              </div>
            </q-item-section>
            <div class="stellar-badge">👥</div>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

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
import { computed, onMounted, ref, onBeforeMount } from "vue";
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

// Styles dynamiques pour les particules
const particleStyle = (index) => {
  const angle = (index / 12) * 360;
  const delay = index * 0.1;
  return {
    '--particle-angle': `${angle}deg`,
    '--particle-delay': `${delay}s`
  };
};

const quantumParticleStyle = (index) => {
  const angle = (index / 6) * 360;
  const delay = index * 0.2;
  return {
    '--quantum-angle': `${angle}deg`,
    '--quantum-delay': `${delay}s`
  };
};

const neonSparkStyle = (index) => {
  const positions = ['10%', '30%', '70%', '90%'];
  const delays = [0, 0.3, 0.6, 0.9];
  return {
    left: positions[index],
    'animation-delay': `${delays[index]}s`
  };
};

const dataPointStyle = (index) => {
  const left = (index / 8) * 100;
  const delay = index * 0.15;
  return {
    left: `${left}%`,
    'animation-delay': `${delay}s`
  };
};

const toggleTheme = () => {
  $q.dark.toggle();
  localStorage.setItem("epal_dark_mode", $q.dark.isActive);
};

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
  const isDarkMode = localStorage.getItem("epal_dark_mode") === "true";
  $q.dark.set(isDarkMode);
  authStore.initializeFromStorage();
});

onMounted(async () => {
  setTimeout(() => {
    visible.value = false;
  }, 1000);
});
</script>

<style scoped>
/* === ANIMATIONS COSMIQUES GLOBALES === */
@keyframes cosmicFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes energyPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes hologramFlicker {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.3); }
}

@keyframes quantumSpin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes neonFlicker {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px currentColor); }
  50% { opacity: 0.7; filter: drop-shadow(0 0 15px currentColor); }
}

@keyframes dataFlow {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

/* === HEADER BLANC CONSERVÉ === */
.menu-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-btn:hover {
  transform: scale(1.1);
  background: rgba(0, 0, 0, 0.1) !important;
}

/* === LOGO SANS ROTATION === */
.logo-master {
  position: relative;
}

.logo-spin-container {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-orbits {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: quantumSpin 4s linear infinite;
}

.orbit-1 {
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  animation-duration: 6s;
}

.orbit-2 {
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  animation-duration: 4s;
  animation-direction: reverse;
}

.orbit-3 {
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  animation-duration: 8s;
}

/* === AVATAR ANIMÉ === */
.avatar-pulse-container {
  position: relative;
}

.avatar-glow {
  animation: energyPulse 3s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.pulse-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.7; }
}

/* === DROPDOWN ANIMÉ === */
.dropdown-menu {
  background: white !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.menu-item-dropdown {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.menu-item-dropdown::before {
  content: '';
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.menu-item-dropdown:hover::before {
  left: 100%;
}

.dropdown-icon {
  transition: all 0.3s ease;
}

.menu-item-dropdown:hover .dropdown-icon {
  transform: scale(1.2);
}

.logout-icon:hover {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* === DRAWER AVEC FOND CLAIR === */
.cosmic-drawer {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%) !important;
  position: relative;
  overflow: hidden;
}

.cosmic-drawer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.03) 0%, transparent 50%);
  animation: cosmicFloat 20s ease-in-out infinite;
}

.drawer-header {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cosmic-logo-container {
  position: relative;
  width: 50px;
  height: 50px;
}

.cosmic-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #3b82f6;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform-origin: center;
  animation: particleOrbit 4s linear infinite;
  animation-delay: var(--particle-delay);
}

@keyframes particleOrbit {
  0% {
    transform: rotate(var(--particle-angle)) translateX(25px) rotate(calc(-1 * var(--particle-angle)));
    opacity: 1;
  }
  100% {
    transform: rotate(calc(var(--particle-angle) + 360deg)) translateX(25px) rotate(calc(-1 * var(--particle-angle) - 360deg));
    opacity: 0;
  }
}

.cosmic-title {
  position: relative;
  z-index: 2;
}

.title-shine {
  color: #1e40af;
  font-weight: bold;
}

.cosmic-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent) !important;
  animation: lineFlow 2s ease-in-out infinite;
}

@keyframes lineFlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* === SCROLL AREA === */
.nebula-scroll {
  position: relative;
  z-index: 2;
}

.stellar-list {
  position: relative;
  z-index: 2;
}

/* === CARTES AVEC FOND CLAIR === */
.nebula-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  margin-bottom: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nebula-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.nebula-card:hover::before {
  left: 100%;
}

.nebula-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* === SOUS-MENUS === */
.nebula-subcard {
  background: rgba(255, 255, 255, 0.7) !important;
  margin-left: 20px;
  margin-right: 8px;
  margin-bottom: 4px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.nebula-subcard:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.9) !important;
}

.submenu-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
}

.submenu-text {
  font-size: 13px;
  font-weight: 500;
}

/* === EXPANSION ITEMS === */
.stellar-expansion {
  background: rgba(255, 255, 255, 0.9) !important;
}

.stellar-expansion :deep(.q-item) {
  border-radius: 16px !important;
}

.stellar-expansion :deep(.q-focus-helper) {
  border-radius: 16px !important;
}

/* === TEXTE NOIR POUR MEILLEURE LISIBILITÉ === */
.menu-text {
  position: relative;
}

.text-dark {
  color: #1f2937 !important;
  font-weight: 600;
  font-size: 14px;
}

.text-underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  transition: width 0.3s ease;
}

.nebula-card:hover .text-underline {
  width: 100%;
}

/* === EFFET HOLOGRAMME (Dashboard) === */
.hologram-container {
  position: relative;
  width: 45px;
  height: 45px;
}

.hologram-base {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: hologramFlicker 3s ease-in-out infinite;
}

.hologram-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.hologram-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.3) 50%, transparent 51%),
    linear-gradient(transparent 49%, rgba(255,255,255,0.3) 50%, transparent 51%);
  background-size: 10px 10px;
  animation: quantumSpin 4s linear infinite;
}

.hologram-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: conic-gradient(from 0deg, #3b82f6, #60a5fa, #3b82f6, #1d4ed8, #3b82f6);
  border-radius: 16px;
  filter: blur(20px);
  opacity: 0.5;
  animation: quantumSpin 3s linear infinite;
}

.hologram-icon {
  width: 22px;
  height: 22px;
  color: white;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 5px rgba(255,255,255,0.5));
}

.energy-beam {
  position: absolute;
  width: 2px;
  height: 20px;
  background: rgba(255, 255, 255, 0.8);
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  animation: dataFlow 2s linear infinite;
}

.beam-1 { animation-delay: 0s; }
.beam-2 { animation-delay: 1s; }

/* === EFFET QUANTIQUE (E-Paiement) === */
.quantum-container {
  position: relative;
  width: 45px;
  height: 45px;
}

.quantum-orb {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: quantumSpin 6s linear infinite;
}

.quantum-green {
  background: radial-gradient(circle at 30% 30%, #10b981, #059669);
}

.quantum-core {
  position: absolute;
  width: 15px;
  height: 15px;
  background: white;
  border-radius: 50%;
  filter: blur(1px);
  animation: energyPulse 2s ease-in-out infinite;
}

.quantum-ring {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: quantumSpin 4s linear infinite reverse;
}

.ring-1 { top: 5px; left: 5px; right: 5px; bottom: 5px; animation-duration: 3s; }
.ring-2 { top: 2px; left: 2px; right: 2px; bottom: 2px; animation-duration: 5s; }
.ring-3 { top: 8px; left: 8px; right: 8px; bottom: 8px; animation-duration: 7s; }

.quantum-icon {
  width: 20px;
  height: 20px;
  color: white;
  position: relative;
  z-index: 2;
}

.quantum-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform-origin: center;
  animation: quantumOrbit 3s linear infinite;
  animation-delay: var(--quantum-delay);
}

@keyframes quantumOrbit {
  0% {
    transform: rotate(var(--quantum-angle)) translateX(20px) rotate(calc(-1 * var(--quantum-angle)));
  }
  100% {
    transform: rotate(calc(var(--quantum-angle) + 360deg)) translateX(20px) rotate(calc(-1 * var(--quantum-angle) - 360deg));
  }
}

/* === EFFET CRISTAL (Facture Proforma) === */
.crystal-container {
  position: relative;
  width: 45px;
  height: 45px;
}

.crystal {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: rotate(45deg);
}

.crystal-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.crystal-facet {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.facet-1 { width: 30px; height: 30px; top: 0; left: 0; }
.facet-2 { width: 25px; height: 25px; bottom: 0; right: 0; transform: rotate(180deg); }
.facet-3 { width: 20px; height: 20px; top: 5px; right: 5px; transform: rotate(90deg); }
.facet-4 { width: 15px; height: 15px; bottom: 5px; left: 5px; transform: rotate(270deg); }

.crystal-icon {
  width: 20px;
  height: 20px;
  color: white;
  transform: rotate(-45deg);
  position: relative;
  z-index: 2;
}

.crystal-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shine 4s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% { transform: translateX(-100%) translateY(-100%); }
  50% { transform: translateX(100%) translateY(100%); }
}

/* === EFFET NEON (Réclamation client) === */
.neon-container {
  position: relative;
  width: 45px;
  height: 45px;
}

.neon-sign {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: neonFlicker 1.5s ease-in-out infinite;
}

.neon-orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 
    0 0 10px #f59e0b,
    0 0 20px #f59e0b,
    0 0 40px #f59e0b,
    inset 0 0 10px rgba(245, 158, 11, 0.5);
}

.neon-tube {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

.neon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.4), transparent 70%);
  border-radius: 8px;
}

.neon-icon {
  width: 22px;
  height: 22px;
  color: white;
  filter: drop-shadow(0 0 5px white);
  position: relative;
  z-index: 2;
}

.neon-spark {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  top: 5px;
  animation: sparkJump 1s ease-in-out infinite;
}

@keyframes sparkJump {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-8px); opacity: 0; }
}

/* === EFFET DATA STREAM (Gestion utilisateurs) === */
.datastream-container {
  position: relative;
  width: 45px;
  height: 45px;
}

.datastream {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.datastream-teal {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
}

.stream-line {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, white, transparent);
  left: 0;
  right: 0;
  animation: dataFlow 2s linear infinite;
}

.line-1 { top: 25%; animation-delay: 0s; }
.line-2 { top: 50%; animation-delay: 0.7s; }
.line-3 { top: 75%; animation-delay: 1.4s; }

.datastream-icon {
  width: 22px;
  height: 22px;
  color: white;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 3px white);
}

.data-point {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  top: 30%;
  animation: dataPointMove 3s ease-in-out infinite;
}

@keyframes dataPointMove {
  0%, 100% { transform: translateY(0); opacity: 0; }
  50% { transform: translateY(10px); opacity: 1; }
}

/* === BADGES STELLAIRES === */
.stellar-badge {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 12px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.nebula-card:hover .stellar-badge {
  opacity: 1;
  transform: scale(1);
  animation: badgeFloat 2s ease-in-out infinite;
}

@keyframes badgeFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.1); }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .stellar-badge {
    display: none;
  }
  
  .nebula-card:hover {
    transform: translateY(-2px);
  }
}

/* Désactiver les animations pour les utilisateurs qui les préfèrent réduites */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

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


</style>