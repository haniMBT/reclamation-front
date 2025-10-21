<template>
  <div
    class="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-300 via-blue-400 to-blue-700"
  >
    <!-- Canvas pour le soleil réaliste -->
    <canvas ref="sunCanvas" class="absolute inset-0 z-5"></canvas>

    <!-- Canvas Three.js pour tous les autres éléments 3D -->
    <div ref="threeContainer" class="absolute inset-0 z-10"></div>


    <!-- Oiseaux en vol avec directions aléatoires -->
    <div
      v-for="bird in birds"
      :key="bird.id"
      :class="['bird-container', bird.directionClass]"
      :style="bird.style"
    >
      <div :class="['bird', `bird-${bird.id}`]"></div>
    </div>

    <!-- Phare animé -->
    <div class="lighthouse-container">
      <div class="lighthouse">
        <div class="lighthouse-tower"></div>
        <div class="lighthouse-light"></div>
        <div class="light-beam"></div>
      </div>
    </div>

    <!-- Dauphins -->
    <div
      v-for="dolphin in dolphins"
      :key="dolphin.id"
      class="dolphin-container"
      :style="dolphin.style"
    >
      <div class="dolphin" @click="dolphinJump(dolphin.id)">
        <div class="dolphin-body"></div>
        <div class="dolphin-fin"></div>
      </div>
    </div>

    <!-- Bouées flottantes -->
    <div
      v-for="buoy in buoys"
      :key="buoy.id"
      class="buoy-container"
      :style="buoy.style"
    >
      <div class="buoy" @mouseenter="buoyRing(buoy.id)">
        <div class="buoy-top"></div>
        <div class="buoy-body"></div>
        <div class="buoy-bell"></div>
      </div>
    </div>

    <!-- Bateau de pêche -->
    <div class="fishing-boat-container">
      <div class="fishing-boat">
        <div class="fishing-boat-body"></div>
        <div class="fishing-net"></div>
        <div class="fishing-crane"></div>
      </div>
    </div>

    <!-- Algues sous-marines -->
    <div
      v-for="seaweed in seaweeds"
      :key="seaweed.id"
      class="seaweed-container"
      :style="seaweed.style"
    >
      <div class="seaweed"></div>
    </div>

    <!-- Coquillages et étoiles de mer -->
    <div
      v-for="shell in shells"
      :key="shell.id"
      class="shell-container"
      :style="shell.style"
    >
      <div class="shell" @click="toggleShell(shell.id)">
        <div class="shell-top"></div>
        <div class="shell-bottom"></div>
      </div>
    </div>

    <!-- Étoiles de mer -->
    <div
      v-for="starfish in starfishes"
      :key="starfish.id"
      class="starfish-container"
      :style="starfish.style"
    >
      <div class="starfish" @mouseenter="starfishGlow(starfish.id)"></div>
    </div>

    <!-- Bulles interactives -->
    <div
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="bubble-container"
      :style="bubble.style"
    >
      <div class="bubble" @click="popBubble(bubble.id)"></div>
    </div>

    <!-- Arc-en-ciel -->
    <div class="rainbow-container" :class="{ active: showRainbow }">
      <div class="rainbow"></div>
    </div>

    <!-- Éclairs occasionnels -->
    <div class="lightning-container" :class="{ active: showLightning }">
      <div class="lightning"></div>
    </div>

    <!-- Brouillard -->
    <div class="fog-container" :class="{ active: showFog }">
      <div class="fog-layer-1"></div>
      <div class="fog-layer-2"></div>
    </div>

    <!-- Grue portuaire -->
    <div class="crane-container">
      <div class="crane">
        <div class="crane-base"></div>
        <div class="crane-tower"></div>
        <div class="crane-arm"></div>
        <div class="crane-hook"></div>
        <div class="container"></div>
      </div>
    </div>

    <!-- Conteneurs empilés -->
    <div class="containers-container">
      <div
        v-for="container in containers"
        :key="container.id"
        class="container-item"
        :style="container.style"
      >
        <div
          class="container"
          :style="{ backgroundColor: container.color }"
        ></div>
      </div>
    </div>



    <!-- Bateau SVG principal avec animation de flottement -->
    <div class="boat-container">
      <div class="boat-svg-wrapper">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1280.000000 640.000000"
          preserveAspectRatio="xMidYMid meet"
          class="boat-svg"
        >
          <g
            transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)"
            stroke="none"
          >
            <path
              d="M9577 4463 c-4 -3 -7 -66 -7 -140 0 -126 -1 -133 -20 -133 -18 0 -20
            7 -20 64 0 42 4 66 13 69 9 4 9 8 -2 15 -22 16 -22 44 0 49 36 10 19 23 -31
            23 -27 0 -50 -4 -50 -10 0 -5 11 -10 25 -10 20 0 25 -5 25 -25 0 -18 -5 -25
            -20 -25 -11 0 -20 -4 -20 -10 0 -5 9 -10 20 -10 18 0 20 -7 20 -64 0 -42 -4
            -66 -12 -69 -10 -4 -10 -7 0 -14 10 -7 7 -33 -13 -124 -14 -63 -28 -122 -31
            -131 -4 -13 0 -18 15 -18 16 0 22 11 31 58 31 153 31 153 48 150 10 -2 34 -39
            58 -89 68 -141 73 -129 -54 -129 -79 0 -112 4 -116 13 -3 8 -8 7 -16 -5 -7
            -12 -24 -18 -50 -18 l-40 0 0 69 c0 60 2 69 20 74 14 4 20 14 20 34 0 34 -16
            53 -43 53 -38 0 -65 -71 -32 -84 11 -4 15 -22 15 -76 0 -68 -1 -70 -25 -70
            -14 0 -25 -2 -25 -5 0 -16 30 -75 39 -75 5 0 19 -13 31 -29 20 -29 21 -43 23
            -315 1 -171 -2 -285 -7 -283 -5 2 -43 -16 -85 -40 -52 -30 -87 -43 -113 -43
            -31 0 -38 -4 -38 -19 0 -19 -43 -61 -61 -61 -5 0 -9 41 -9 90 l0 90 -30 0
            c-29 0 -30 2 -30 42 l0 41 -390 -6 -390 -7 0 215 0 215 -380 0 -380 0 0 -126
            c0 -111 -2 -125 -16 -120 -9 3 -40 6 -70 6 l-54 0 0 45 0 45 -102 0 c-57 0
            -228 -3 -380 -7 l-278 -6 0 -47 c0 -45 -1 -47 -25 -42 -19 3 -29 16 -43 54
            -11 32 -24 50 -37 53 -11 2 -186 1 -390 -3 l-370 -7 -6 -375 c-8 -494 -5 -450
            -28 -450 -23 0 -24 7 -46 494 -14 299 -18 333 -36 363 l-21 33 -369 0 -369 0
            0 -25 c0 -16 -6 -25 -15 -25 -13 0 -15 -52 -15 -409 0 -280 -3 -412 -11 -416
            -6 -4 -12 -5 -14 -4 -2 2 -7 159 -11 349 -6 297 -9 352 -25 399 -11 30 -19 62
            -19 73 0 17 -17 18 -380 18 l-380 0 -1 -317 c-1 -175 -4 -347 -8 -383 l-6 -65
            -7 75 c-4 41 -10 127 -13 190 -9 166 -6 158 -68 162 l-52 3 -3 168 -2 167
            -381 0 -380 0 2 -167 c0 -93 -2 -167 -5 -165 -3 1 -22 2 -41 2 l-35 0 0 90 0
            90 -380 0 -380 0 0 -90 0 -90 -65 0 -65 0 0 80 0 80 -185 0 -185 0 0 -80 c0
            -47 -4 -80 -10 -80 -6 0 -10 33 -10 80 l0 80 -187 -2 -188 -3 -2 -194 c-1
            -106 -4 -195 -6 -197 -2 -2 -68 117 -147 264 -78 147 -147 270 -153 274 -6 4
            -8 51 -3 132 5 86 4 126 -4 126 -5 0 -10 14 -10 32 0 43 -10 29 -25 -34 -13
            -56 -16 -54 -30 35 -10 65 -26 42 -23 -35 3 -67 5 -73 25 -76 22 -3 23 -7 23
            -102 0 -79 -3 -98 -13 -94 -9 3 -115 -119 -293 -337 l-279 -341 -167 6 c-93 3
            -168 4 -168 1 0 -15 38 -76 117 -188 48 -67 144 -207 215 -311 l128 -189 0
            -79 0 -78 -27 0 c-16 0 -46 -5 -68 -12 l-40 -11 30 -9 c65 -18 2198 -30 6530
            -35 4096 -5 4601 -4 5160 11 341 10 631 19 643 22 18 4 21 8 13 18 -15 18
            -124 40 -158 31 -27 -6 -27 -6 -9 13 9 11 31 27 48 35 32 15 221 238 210 247
            -4 3 -7 179 -7 392 l0 388 -260 0 c-143 0 -338 3 -432 7 l-173 6 0 279 0 278
            -380 0 -380 0 0 -30 c0 -28 -3 -30 -35 -30 -32 0 -35 2 -35 30 0 30 0 30 -57
            30 -32 0 -115 -3 -185 -7 -115 -5 -128 -8 -128 -25 0 -13 -7 -18 -25 -18 -18
            0 -25 5 -25 20 0 19 -7 20 -190 20 -183 0 -190 -1 -190 -20 0 -17 -7 -20 -50
            -20 -49 0 -50 -1 -50 -29 0 -29 -1 -29 -59 -33 l-58 -3 -6 125 c-4 69 -4 141
            -1 161 4 22 2 39 -5 43 -6 4 -11 26 -11 49 -1 44 -21 131 -33 143 -4 4 -7 27
            -7 51 0 -47 -8 51 -45 27 -19 -12 -25 -25 -25 -50 0 -32 -2 -34 -36 -34 l-37 0
            5 45 c5 42 3 47 -29 75 -18 17 -37 30 -41 30 -15 0 -52 -81 -52 -114 0 -29 -4
            -36 -19 -36 -21 0 -25 -10 -37 -80 l-7 -45 -38 80 c-37 77 -51 155 -29 155 6
            0 10 5 10 10 0 6 -9 10 -20 10 -13 0 -20 7 -20 20 0 13 7 20 20 20 11 0 20 5
            20 10 0 6 -9 10 -20 10 -11 0 -20 7 -20 15 0 10 10 15 30 15 17 0 30 5 30 10
            0 6 -13 10 -30 10 -20 0 -30 5 -30 15 0 11 11 15 40 15 22 0 40 5 40 10 0 6
            -18 10 -40 10 -33 0 -40 3 -40 20 0 15 7 20 25 20 14 0 25 5 25 10 0 6 -11 10
            -25 10 -18 0 -25 5 -25 20 0 16 7 20 30 20 17 0 30 5 30 10 0 11 -63 14 -73 3z
            m173 -493 c0 -44 -4 -60 -13 -60 -11 0 -12 11 -6 48 4 26 8 53 8 60 1 6 3 12
            6 12 3 0 5 -27 5 -60z m-7 -87 c-7 -2 -19 -2 -25 0 -7 3 -2 5 12 5 14 0 19 -2
            13 -5z m-8854 -659 c-7 -14 -18 -20 -30 -17 -13 4 -19 0 -19 -11 0 -10 9 -16
            24 -16 21 0 24 -5 28 -57 3 -31 10 -59 16 -61 8 -2 12 -42 12 -123 l0 -119
            -132 1 c-73 1 -158 4 -189 8 l-56 6 176 328 176 328 3 -123 c2 -78 -1 -131 -9
            -144z m191 11 c56 -126 110 -246 120 -265 25 -51 35 -84 21 -76 -6 4 -11 16
            -11 27 0 10 -4 19 -10 19 -5 0 -10 -18 -10 -40 0 -36 3 -40 25 -40 20 0 25 -5
            25 -25 l0 -25 -109 0 c-60 0 -123 3 -140 6 l-31 7 0 330 c0 190 4 327 9 322 5
            -6 55 -113 111 -240z m-278 118 c-20 -38 -91 -169 -157 -293 l-120 -225 -83
            -3 c-55 -2 -83 1 -80 8 4 12 468 580 474 580 2 0 -13 -30 -34 -67z m311 -115
            c36 -68 83 -157 105 -198 35 -64 39 -78 28 -92 -11 -15 -21 1 -73 120 -34 75
            -77 172 -97 215 -19 42 -34 77 -32 77 3 0 33 -55 69 -122z m217 -408 c0 -13
            -7 -20 -20 -20 -10 0 -24 9 -30 20 -10 18 -8 20 20 20 23 0 30 -4 30 -20z"
              fill="#2c3e50"
            />
          </g>
        </svg>
      </div>
    </div>

    <!-- Vagues animées avec écume -->
    <div class="waves-container">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
          <linearGradient id="sea-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a" />
            <stop offset="30%" stop-color="#1e40af" />
            <stop offset="70%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#1e3a8a" />
          </linearGradient>
        </defs>
        <g class="parallax">
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            fill="url(#sea-gradient)"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            fill="url(#sea-gradient)"
            fill-opacity="0.7"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            fill="url(#sea-gradient)"
            fill-opacity="0.5"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="7"
            fill="url(#sea-gradient)"
            fill-opacity="0.3"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="2"
            fill="rgba(255,255,255,0.1)"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="4"
            fill="rgba(255,255,255,0.05)"
          />
        </g>
      </svg>
      <!-- Écume sur les vagues -->
      <div class="foam">
        <div
          v-for="i in 20"
          :key="i"
          class="foam-bubble"
          :style="getFoamStyle(i)"
        ></div>
      </div>
    </div>

    <!-- Effet de traînée de souris -->
    <div class="mouse-trail" :style="mouseTrailStyle"></div>

    <!-- Formulaire de connexion -->
    <div class="relative z-40 w-full max-w-3xl mx-auto px-6 mb-40">
      <div
        class="bg-white/5 rounded-xl shadow-lg p-6 border border-white/45 flex"
      >
        <!-- Partie gauche - Logo et informations -->
        <div
          class="w-2/5 pr-6 flex flex-col justify-center border-r border-white/10"
        >
          <div class="text-center">
            <div class="flex items-center justify-center mb-4">
              <q-img class="w-12 h-12 mr-3" src="/logo-epal.png" />
              <h1 class="text-xl font-bold text-white drop-shadow-lg">EPAL</h1>
            </div>
            <h3 class="text-lg font-bold text-white drop-shadow-lg mb-2">
              Connexion
            </h3>
            <p class="text-white/70 text-xs drop-shadow-md mb-4">
              Accédez à votre espace personnel
            </p>

            <q-btn
              to="/acceuil"
              outline
              icon="anchor"
              label="Retour au port"
              class="w-full text-white border-white/30 hover:bg-white/10 hover:border-white/50 text-xs py-2 backdrop-blur-sm font-medium mt-3"
              size="xs"
            />
          </div>
        </div>

        <!-- Partie droite - Formulaire -->
       <div class="w-3/5 pl-6">
  <form @submit.prevent="handleLogin" class="space-y-4">
    <!-- Email -->
    <div>
      <InputLabel
        for="username"
        value="Email"
        class="text-white font-medium mb-1 text-xs"
      >
        <span class="text-red-400 ml-1">*</span>
      </InputLabel>
      <div class="relative">
        <TextInput
          id="username"
          type="text"
          placeholder="Votre adresse email"
          class="w-full px-3 py-2 border border-gray-400 bg-transparent rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="form.Email"
          required
          autofocus
          autocomplete="username"
        />
      </div>
    </div>

    <!-- Mot de passe -->
    <div>
      <InputLabel
        for="password"
        value="Mot de passe"
        class="text-white font-medium mb-1 text-xs"
      >
        <span class="text-red-400 ml-1">*</span>
      </InputLabel>
      <div class="relative">
        <TextInput
          id="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Votre mot de passe"
          class="w-full px-3 py-2 border border-gray-400 bg-transparent rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="form.password"
          required
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white transition-colors"
        >
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            size="16px"
          />
        </button>
      </div>
    </div>

    <!-- Message d'erreur -->
    <InputError
      v-if="myErrors"
      class="bg-red-500/20 border border-red-400/30 rounded-lg p-2 text-xs text-white font-medium"
      message="Nom d'utilisateur et/ou mot de passe incorrect(s)"
    />

    <!-- Lien mot de passe oublié -->
    <div class="text-right -mt-1">
      <router-link
        to="/forgot-password"
        class="text-blue-600 hover:text-white text-xs font-medium transition-colors underline"
      >
        Mot de passe oublié ?
      </router-link>
    </div>

    <!-- Bouton de connexion -->
    <div class="pt-1">
      <PrimaryButton
        class="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center text-sm border border-blue-400/40 shadow-md"
        :class="{
          'opacity-80 cursor-not-allowed from-blue-500 to-blue-600': submiting,
        }"
        :disabled="submiting"
      >
        <q-spinner-oval
          v-if="submiting"
          size="16px"
          class="mr-2 text-white"
        />
        <q-icon v-else name="sailing" class="mr-2" size="16px" />
        {{ submiting ? "Navigation..." : "Appareiller" }}
      </PrimaryButton>
    </div>
  </form>

  <!-- Footer -->
  <div class="text-center mt-4 pt-3 border-t border-white/10">
    <p class="text-xs text-white font-medium">
      © {{ currentYear }} EPAL - Entreprise Portuaire d'Alger
    </p>
  </div>
</div>

      </div>
    </div>

    <q-inner-loading
      :showing="visible"
      label-class="text-white"
      label-style="font-size: 1.1em"
      color="white"
    />
  </div>
</template>

<script setup>
import InputError from "components/InputError.vue";
import InputLabel from "components/InputLabel.vue";
import PrimaryButton from "components/PrimaryButton.vue";
import TextInput from "components/TextInput.vue";
import {
  computed,
  reactive,
  ref,
  watch,
  onBeforeMount,
  onMounted,
  onUnmounted,
} from "vue";
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";
import { useMeta } from "quasar";
import { api } from "boot/axios";

// Three.js imports
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import gsap from "gsap";

const visible = ref(false);
const threeContainer = ref(null);
const sunCanvas = ref(null);
const isMobile = ref(false);
let scene, camera, renderer;
let clouds = [];
let bgClouds = [];
let rain;
let oceanMesh;
let fishes = [];
let jetPlanes = [];
let raycaster, mouse;
let animationId;
let sunAnimationId;

// Configuration du soleil
const sunConfig = ref({
  amountOfBeams: 80,
  minLength: 0,
  maxLength: 0,
  gradientStartOpacity: 0.12,
  gradientEndOpacity: 0,
  circleRadius: 150,
  blurStrength: 12,
  fadeInOutTime: 25,
  rotationSpeed: -0.002,
  lineWidth: 60,
  beamOrigin: { x: 0, y: 0 },
  beamColor: 0,
});

let sunBeams = [];

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const optimizeForMobile = () => {
  if (!isMobile.value) return;

  // Réduire le nombre d'éléments sur mobile
  if (birds.value.length > 3) {
    birds.value = birds.value.slice(0, 3);
  }

  if (bubbles.value.length > 8) {
    bubbles.value = bubbles.value.slice(0, 8);
  }

  if (fishes.length > 8) {
    fishes = fishes.slice(0, 8);
  }

  // Réduire les particules Three.js
  if (rain && rain.geometry) {
    const positions = rain.geometry.attributes.position.array;
    // Garder seulement 1/3 des particules de pluie
    for (let i = positions.length / 3; i < positions.length; i += 3) {
      positions[i + 1] = -100; // Cacher les particules excédentaires
    }
  }
};

// Configuration des oiseaux avec directions aléatoires
const birds = ref([]);

// États des nouveaux éléments
const showRainbow = ref(false);
const showLightning = ref(false);
const showFog = ref(false);
const trafficLightState = ref("red");
const mousePosition = ref({ x: 0, y: 0 });
const mouseTrailStyle = ref({});
const bubbles = ref([]);
const shells = ref([]);
const starfishes = ref([]);
const seaweeds = ref([]);
const buoys = ref([]);
const dolphins = ref([]);
const containers = ref([]);

const metaData = {
  title: "EPAL - Connexion",
};
useMeta(metaData);

// Initialiser le soleil réaliste
const initSun = () => {
  if (!sunCanvas.value) return;

  const canvas = sunCanvas.value;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  sunConfig.value.beamOrigin.x = window.innerWidth + 80;
  sunConfig.value.beamOrigin.y = -50;
  sunConfig.value.minLength = window.innerHeight * 0.6;
  sunConfig.value.maxLength =
    Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 0.7;

  const generateBeams = () => {
    let beams = [];
    for (let i = 0; i < sunConfig.value.amountOfBeams; i++) {
      let length =
        Math.random() *
          (sunConfig.value.maxLength - sunConfig.value.minLength) +
        sunConfig.value.minLength;
      let angle = Math.random() * Math.PI * 1.5 + Math.PI / 4;

      let widthRandomness = Math.random();
      let biasedWidth = widthRandomness * widthRandomness;
      let width =
        biasedWidth *
          (sunConfig.value.lineWidth - sunConfig.value.lineWidth / 8) +
        sunConfig.value.lineWidth / 8;
      let opacityPhase = Math.random() * Math.PI * 2;

      beams.push({ length, angle, width, opacityPhase });
    }
    return beams;
  };

  sunBeams = generateBeams();

  const animateSun = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(
      sunConfig.value.beamOrigin.x,
      sunConfig.value.beamOrigin.y,
      sunConfig.value.circleRadius,
      0,
      Math.PI * 2,
      false
    );

    let sunGradient = ctx.createRadialGradient(
      sunConfig.value.beamOrigin.x,
      sunConfig.value.beamOrigin.y,
      0,
      sunConfig.value.beamOrigin.x,
      sunConfig.value.beamOrigin.y,
      sunConfig.value.circleRadius
    );
    sunGradient.addColorStop(0, "rgba(255, 255, 150, 1)");
    sunGradient.addColorStop(0.4, "rgba(255, 200, 50, 0.95)");
    sunGradient.addColorStop(0.7, "rgba(255, 150, 0, 0.9)");
    sunGradient.addColorStop(1, "rgba(255, 100, 0, 0.85)");

    ctx.fillStyle = sunGradient;
    ctx.fill();
    ctx.closePath();

    ctx.filter = `blur(${sunConfig.value.blurStrength}px)`;

    sunBeams.forEach((beam) => {
      beam.angle += sunConfig.value.rotationSpeed;
      const time = performance.now() / 1000;
      const opacity =
        (Math.sin(
          (time * Math.PI) / sunConfig.value.fadeInOutTime + beam.opacityPhase
        ) +
          1) /
        2;

      const endX =
        sunConfig.value.beamOrigin.x + Math.cos(beam.angle) * beam.length;
      const endY =
        sunConfig.value.beamOrigin.y + Math.sin(beam.angle) * beam.length;

      if (endX > 0 && endY > 0) {
        drawSunBeam(ctx, beam, opacity);
      }
    });

    ctx.filter = "none";
    sunAnimationId = requestAnimationFrame(animateSun);
  };

  const drawSunBeam = (ctx, beam, opacity) => {
    let x0 = sunConfig.value.beamOrigin.x;
    let y0 = sunConfig.value.beamOrigin.y;
    let x1 = x0 + Math.cos(beam.angle) * beam.length;
    let y1 = y0 + Math.sin(beam.angle) * beam.length;

    let gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(
      0,
      `rgba(255, 255, 200, ${sunConfig.value.gradientStartOpacity * opacity})`
    );
    gradient.addColorStop(
      0.2,
      `rgba(255, 255, 150, ${
        sunConfig.value.gradientStartOpacity * opacity * 0.8
      })`
    );
    gradient.addColorStop(
      0.5,
      `rgba(255, 255, 100, ${
        sunConfig.value.gradientStartOpacity * opacity * 0.6
      })`
    );
    gradient.addColorStop(
      1,
      `rgba(255, 255, 50, ${sunConfig.value.gradientEndOpacity * opacity})`
    );

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = beam.width;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  animateSun();
};

// Redimensionner le canvas du soleil
const handleSunResize = () => {
  if (sunCanvas.value) {
    sunCanvas.value.width = window.innerWidth;
    sunCanvas.value.height = window.innerHeight;
    sunConfig.value.beamOrigin.x = window.innerWidth + 80;
    sunConfig.value.beamOrigin.y = -50;
    sunConfig.value.minLength = window.innerHeight * 0.6;
    sunConfig.value.maxLength =
      Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 0.7;
  }
};

// Générer les oiseaux avec directions aléatoires
const generateBirds = () => {
  const birdConfigs = [];

  for (let i = 1; i <= 7; i++) {
    const direction = Math.random() > 0.5 ? "left-to-right" : "right-to-left";
    const top = Math.random() * 30 + 5;
    const delay = Math.random() * 15;
    const duration = Math.random() * 5 + 12;

    birdConfigs.push({
      id: i,
      directionClass: direction,
      style: {
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      },
    });
  }

  return birdConfigs;
};

// Initialisation des nouveaux éléments
const initializeSceneElements = () => {
  birds.value = generateBirds();
  generateDolphins();
  generateBuoys();
  generateSeaweeds();
  generateShells();
  generateStarfish();
  generateBubbles();
  generateContainers();
  startWeatherEffects();
  startTrafficAnimations();
};

const generateDolphins = () => {
  for (let i = 0; i < 3; i++) {
    dolphins.value.push({
      id: i,
      style: {
        left: `${20 + i * 25}%`,
        bottom: `${15 + i * 5}%`,
        animationDelay: `${i * 2}s`,
      },
    });
  }
};

const generateBuoys = () => {
  for (let i = 0; i < 4; i++) {
    buoys.value.push({
      id: i,
      style: {
        left: `${10 + i * 20}%`,
        bottom: `${8}%`,
        animationDelay: `${i * 1.5}s`,
      },
    });
  }
};

const generateSeaweeds = () => {
  for (let i = 0; i < 8; i++) {
    seaweeds.value.push({
      id: i,
      style: {
        left: `${5 + i * 12}%`,
        bottom: `${0}%`,
        animationDelay: `${i * 0.5}s`,
      },
    });
  }
};

const generateShells = () => {
  for (let i = 0; i < 6; i++) {
    shells.value.push({
      id: i,
      style: {
        left: `${8 + i * 15}%`,
        bottom: `${2}%`,
        animationDelay: `${i * 0.7}s`,
      },
      isOpen: false,
    });
  }
};

const generateStarfish = () => {
  for (let i = 0; i < 5; i++) {
    starfishes.value.push({
      id: i,
      style: {
        left: `${12 + i * 18}%`,
        bottom: `${1}%`,
        animationDelay: `${i * 0.9}s`,
      },
    });
  }
};

const generateBubbles = () => {
  for (let i = 0; i < 15; i++) {
    bubbles.value.push({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        bottom: `${5}%`,
        animationDelay: `${Math.random() * 10}s`,
      },
    });
  }
};

const generateContainers = () => {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFEAA7", "#DDA0DD"];
  for (let i = 0; i < 5; i++) {
    containers.value.push({
      id: i,
      style: {
        left: `${70 + i * 6}%`,
        bottom: `${8 + i * 3}%`,
      },
      color: colors[i % colors.length],
    });
  }
};

// Animations interactives
const dolphinJump = (id) => {
  const dolphin = document.querySelector(
    `.dolphin-container:nth-child(${id + 1})`
  );
  if (dolphin) {
    dolphin.style.animation = "none";
    setTimeout(() => {
      dolphin.style.animation = "dolphinJump 2s ease-in-out";
    }, 10);
  }
};

const buoyRing = (id) => {
  const buoy = document.querySelector(`.buoy-container:nth-child(${id + 1})`);
  if (buoy) {
    buoy.style.animation = "none";
    setTimeout(() => {
      buoy.style.animation = "buoyRing 0.5s ease-in-out";
    }, 10);
  }
};

const toggleShell = (id) => {
  const shell = shells.value[id];
  shell.isOpen = !shell.isOpen;
  const shellElement = document.querySelector(
    `.shell-container:nth-child(${id + 1}) .shell`
  );
  if (shellElement) {
    shell.isOpen
      ? shellElement.classList.add("open")
      : shellElement.classList.remove("open");
  }
};

const starfishGlow = (id) => {
  const starfish = document.querySelector(
    `.starfish-container:nth-child(${id + 1}) .starfish`
  );
  if (starfish) {
    starfish.classList.add("glow");
    setTimeout(() => starfish.classList.remove("glow"), 1000);
  }
};

const popBubble = (id) => {
  const bubble = document.querySelector(
    `.bubble-container:nth-child(${id + 1}) .bubble`
  );
  if (bubble) {
    bubble.classList.add("pop");
    setTimeout(() => {
      bubbles.value = bubbles.value.filter((b) => b.id !== id);
    }, 300);
  }
};

// Effets météorologiques
const startWeatherEffects = () => {
  setInterval(() => {
    if (Math.random() < 0.1) {
      showRainbow.value = true;
      setTimeout(() => (showRainbow.value = false), 5000);
    }
  }, 15000);

  setInterval(() => {
    if (Math.random() < 0.05) {
      showLightning.value = true;
      setTimeout(() => (showLightning.value = false), 200);
    }
  }, 10000);

  setInterval(() => {
    if (Math.random() < 0.2) {
      showFog.value = true;
      setTimeout(() => (showFog.value = false), 8000);
    }
  }, 30000);
};

// Animations de trafic
const startTrafficAnimations = () => {
  setInterval(() => {
    const states = ["red", "yellow", "green"];
    const currentIndex = states.indexOf(trafficLightState.value);
    trafficLightState.value = states[(currentIndex + 1) % states.length];
  }, 3000);
};

// Gestion de la souris
const handleMouseMove = (event) => {
  mousePosition.value = { x: event.clientX, y: event.clientY };
  mouseTrailStyle.value = {
    left: `${event.clientX}px`,
    top: `${event.clientY}px`,
    opacity: "1",
  };
};

const getFoamStyle = (index) => {
  return {
    left: `${(index * 5) % 100}%`,
    animationDelay: `${(index * 0.2) % 3}s`,
    animationDuration: `${2 + (index % 3)}s`,
  };
};

// Créer les poissons réalistes
const createFishes = () => {
  const fishColors = [
    0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0x98fb98,
    0xffd700,
  ];

  for (let i = 0; i < 15; i++) {
    const fishGroup = new THREE.Group();

    const bodyGeometry = new THREE.SphereGeometry(0.35, 16, 12);
    bodyGeometry.scale(2.2, 0.8, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: fishColors[Math.floor(Math.random() * fishColors.length)],
      transparent: true,
      opacity: 0.85,
      shininess: 40,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    fishGroup.add(body);

    const tailGeometry = new THREE.ConeGeometry(0.22, 0.5, 8);
    tailGeometry.rotateZ(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(-0.7, 0, 0);
    tail.scale.set(1, 1.4, 1);
    fishGroup.add(tail);

    const dorsalFinGeometry = new THREE.PlaneGeometry(0.12, 0.35);
    const dorsalFin = new THREE.Mesh(dorsalFinGeometry, bodyMaterial);
    dorsalFin.position.set(0, 0.35, 0);
    dorsalFin.rotation.x = Math.PI / 2;
    fishGroup.add(dorsalFin);

    const pectoralFinGeometry = new THREE.PlaneGeometry(0.18, 0.12);

    const leftPectoralFin = new THREE.Mesh(pectoralFinGeometry, bodyMaterial);
    leftPectoralFin.position.set(0.25, 0, 0.25);
    leftPectoralFin.rotation.set(Math.PI / 4, 0, -Math.PI / 6);
    fishGroup.add(leftPectoralFin);

    const rightPectoralFin = new THREE.Mesh(pectoralFinGeometry, bodyMaterial);
    rightPectoralFin.position.set(0.25, 0, -0.25);
    rightPectoralFin.rotation.set(-Math.PI / 4, 0, Math.PI / 6);
    fishGroup.add(rightPectoralFin);

    const eyeGeometry = new THREE.SphereGeometry(0.07, 12, 12);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.5, 0.12, 0.22);
    fishGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.5, 0.12, -0.22);
    fishGroup.add(rightEye);

    const depth = -3.5 - Math.random() * 3.5;
    fishGroup.position.set(
      Math.random() * 35 - 17.5,
      depth,
      Math.random() * 18 - 9
    );

    const scale = 0.25 + Math.random() * 0.25;
    fishGroup.scale.set(scale, scale, scale);

    scene.add(fishGroup);

    fishes.push({
      mesh: fishGroup,
      speed: 0.006 + Math.random() * 0.012,
      direction: new THREE.Vector3(
        Math.random() - 0.5,
        (Math.random() - 0.5) * 0.2,
        Math.random() - 0.5
      ).normalize(),
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      tailSpeed: Math.random() * 0.08 + 0.04,
      finSpeed: Math.random() * 0.15 + 0.08,
      originalScale: scale,
      depth: depth,
    });
  }
};

// Animation des poissons
const animateFishes = () => {
  fishes.forEach((fish) => {
    fish.mesh.position.add(fish.direction.clone().multiplyScalar(fish.speed));
    fish.mesh.rotation.y += fish.rotationSpeed;

    const tail = fish.mesh.children[1];
    if (tail) {
      tail.rotation.y = Math.sin(Date.now() * fish.tailSpeed) * 0.4;
    }

    const leftFin = fish.mesh.children[3];
    const rightFin = fish.mesh.children[4];
    const dorsalFin = fish.mesh.children[2];

    if (leftFin && rightFin) {
      const finMovement = Math.sin(Date.now() * fish.finSpeed) * 0.25;
      leftFin.rotation.z = -Math.PI / 6 + finMovement;
      rightFin.rotation.z = Math.PI / 6 - finMovement;
    }

    if (dorsalFin) {
      const finMovement = Math.sin(Date.now() * fish.finSpeed * 1.5) * 0.15;
      dorsalFin.rotation.x = Math.PI / 2 + finMovement;
    }

    fish.mesh.rotation.z = Math.sin(Date.now() * fish.tailSpeed * 1.8) * 0.08;

    if (Math.random() < 0.003) {
      fish.direction
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.08,
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.08
          )
        )
        .normalize();
    }

    const bounds = 16;
    const depthBounds = { min: -7, max: -2 };

    if (Math.abs(fish.mesh.position.x) > bounds) {
      fish.direction.x *= -1;
      fish.mesh.rotation.y += Math.PI * 0.5;
    }
    if (Math.abs(fish.mesh.position.z) > bounds) {
      fish.direction.z *= -1;
      fish.mesh.rotation.y += Math.PI * 0.5;
    }
    if (
      fish.mesh.position.y < depthBounds.min ||
      fish.mesh.position.y > depthBounds.max
    ) {
      fish.direction.y *= -0.5;
    }

    const depthFactor =
      (fish.mesh.position.y - depthBounds.min) /
      (depthBounds.max - depthBounds.min);
    const targetScale = fish.originalScale * (0.7 + depthFactor * 0.5);
    const targetOpacity = 0.6 + depthFactor * 0.4;

    fish.mesh.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    );

    fish.mesh.children.forEach((child) => {
      if (child.material && child.material.transparent) {
        child.material.opacity = Math.min(targetOpacity, 0.85);
      }
    });
  });
};

// Création de l'océan réaliste
const createRealisticOcean = () => {
  const oceanGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
  const oceanMaterial = new THREE.MeshPhongMaterial({
    color: 0x1e3a8a,
    transparent: true,
    opacity: 0.75,
    shininess: 60,
    specular: 0x222222,
    side: THREE.DoubleSide,
  });

  oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
  oceanMesh.rotation.x = -Math.PI / 2;
  oceanMesh.position.y = -6;
  scene.add(oceanMesh);

  return oceanMesh;
};

// Animations
const animateOcean = (time) => {
  if (!oceanMesh) return;

  const vertices = oceanMesh.geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];

    const wave1 = Math.sin(x * 0.04 + time * 0.001) * 0.6;
    const wave2 = Math.sin(z * 0.025 + time * 0.0015) * 0.3;
    const wave3 = Math.sin((x + z) * 0.015 + time * 0.0008) * 0.2;
    const wave4 =
      Math.sin(Math.sqrt(x * x + z * z) * 0.08 + time * 0.002) * 0.15;

    vertices[i + 1] = wave1 + wave2 + wave3 + wave4;
  }

  oceanMesh.geometry.attributes.position.needsUpdate = true;
  oceanMesh.geometry.computeVertexNormals();
};

// Créer les avions à réaction - VERSION CORRIGÉE
const createJetPlanes = () => {
  for (let i = 0; i < 3; i++) {
    const planeGroup = new THREE.Group();

    // Corps de l'avion
    const bodyGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      shininess: 30,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    planeGroup.add(body);

    // Ailes
    const wingGeometry = new THREE.BoxGeometry(0.6, 0.015, 0.12);
    const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    planeGroup.add(wings);

    // Queue
    const tailGeometry = new THREE.BoxGeometry(0.08, 0.15, 0.04);
    const tail = new THREE.Mesh(tailGeometry, wingMaterial);
    tail.position.set(-0.25, 0.08, 0);
    planeGroup.add(tail);

    // Empennage horizontal
    const horizontalStabGeometry = new THREE.BoxGeometry(0.2, 0.01, 0.08);
    const horizontalStab = new THREE.Mesh(horizontalStabGeometry, wingMaterial);
    horizontalStab.position.set(-0.25, 0, 0);
    planeGroup.add(horizontalStab);

    // Position initiale aléatoire - PLUS HAUTE
    planeGroup.position.set(
      Math.random() * 60 - 30, // Position X aléatoire
      Math.random() * 8 + 20, // Hauteur entre 20 et 28 (PLUS HAUT)
      Math.random() * 20 - 40 // Position Z aléatoire
    );

    // Échelle plus grande pour mieux voir
    const scale = 0.4 + Math.random() * 0.3;
    planeGroup.scale.set(scale, scale, scale);

    // Orientation initiale
    if (planeGroup.position.x > 0) {
      planeGroup.rotation.y = Math.PI;
    }

    scene.add(planeGroup);

    jetPlanes.push({
      mesh: planeGroup,
      speed: 0.03 + Math.random() * 0.02, // Plus rapide
      direction: planeGroup.position.x > 0 ? -1 : 1,
      originalY: planeGroup.position.y,
    });
  }
};

// Animation des avions - VERSION CORRIGÉE
const animateJetPlanes = () => {
  jetPlanes.forEach((plane) => {
    // Déplacement
    plane.mesh.position.x += plane.speed * plane.direction;

    // Rebond sur les bords
    if (Math.abs(plane.mesh.position.x) > 35) {
      plane.direction *= -1;
      plane.mesh.rotation.y += Math.PI;
    }

    // Animation de flottement
    plane.mesh.position.y =
      plane.originalY +
      Math.sin(Date.now() * 0.001 + plane.mesh.position.x * 0.1) * 0.8;

    // Inclinaison dans les virages
    plane.mesh.rotation.z = Math.sin(plane.mesh.position.x * 0.05) * 0.15;

    // Légère oscillation de tangage
    plane.mesh.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
  });
};

// Three.js initialization
const initThreeJS = () => {
  if (!threeContainer.value) return;

  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeContainer.value.appendChild(renderer.domElement);

  // Éclairage
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(30, 40, 30);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  // Nuages
  const textureLoader = new THREE.TextureLoader();
  const cloudTexture = textureLoader.load(
    "https://cdn.pixabay.com/photo/2022/03/20/17/50/clouds-7081496_960_720.png"
  );

  const cloudMaterial = new THREE.SpriteMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.8,
  });

  const createCloud = (scaleSize, depthRange, spread, yPosition) => {
    const cloud = new THREE.Sprite(cloudMaterial.clone());
    cloud.scale.set(scaleSize, scaleSize * 0.67, 1);
    cloud.position.set(
      Math.random() * spread - spread / 2,
      yPosition,
      Math.random() * depthRange - depthRange / 2
    );
    return cloud;
  };

  // Nuages TRÈS HAUT
  for (let i = 0; i < 8; i++) {
    const cloud = createCloud(4, 8, 60, 18);
    scene.add(cloud);
    clouds.push(cloud);
  }

  // Nuages HAUT
  for (let i = 0; i < 10; i++) {
    const cloud = createCloud(5, 12, 70, 15);
    scene.add(cloud);
    bgClouds.push(cloud);
  }

  // Nuages MOYEN
  for (let i = 0; i < 8; i++) {
    const cloud = createCloud(3.5, 6, 50, 12);
    scene.add(cloud);
    bgClouds.push(cloud);
  }

  if (isMobile.value) {
    renderer.setPixelRatio(1); // Réduire la qualité sur mobile
    // Réduire la qualité des matériaux
    oceanMaterial.shininess = 30;
    // Moins de géométrie pour l'océan
    oceanGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
  }

  // Créer l'océan réaliste
  createRealisticOcean();

  // Créer les poissons
  createFishes();

  // Créer les avions - AJOUT IMPORTANT
  createJetPlanes();

  // Create rain particles
  const rainGeometry = new THREE.BufferGeometry();
  const rainCount = 5000;
  const rainVertices = [];

  for (let i = 0; i < rainCount; i++) {
    rainVertices.push(
      Math.random() * 50 - 25,
      Math.random() * 30 + 10,
      Math.random() * -50 + 5
    );
  }
  rainGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(rainVertices, 3)
  );

  const rainMaterial = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.015,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  rain = new THREE.Points(rainGeometry, rainMaterial);
  scene.add(rain);

  // Position de la caméra
  camera.position.z = 20;
  camera.position.y = 10;
  camera.position.x = -2;

  // Raycaster for interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const onMouseClick = (event) => {
    if (!threeContainer.value) return;

    const rect = threeContainer.value.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clouds);

    if (intersects.length > 0) {
      const clickedCloud = intersects[0].object;

      const burstParticles = [];
      for (let i = 0; i < 6; i++) {
        const particle = new THREE.Sprite(
          new THREE.SpriteMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
          })
        );
        particle.scale.set(0.3, 0.3, 0.3);
        particle.position.copy(clickedCloud.position);
        scene.add(particle);
        burstParticles.push(particle);

        gsap.to(particle.position, {
          x: particle.position.x + (Math.random() - 0.5) * 1.2,
          y: particle.position.y + (Math.random() - 0.5) * 1.2,
          z: particle.position.z + (Math.random() - 0.5) * 1.2,
          duration: 0.8,
          onComplete: () => scene.remove(particle),
        });

        gsap.to(particle.material, { opacity: 0, duration: 0.8 });
      }

      gsap.to(clickedCloud.scale, {
        x: 0,
        y: 0,
        duration: 0.4,
        onComplete: () => {
          scene.remove(clickedCloud);
          clouds.splice(clouds.indexOf(clickedCloud), 1);
        },
      });
    }
  };

  window.addEventListener("click", onMouseClick);
  animate();
};

// Animation function
const animate = (time = 0) => {
  animationId = requestAnimationFrame(animate);
  TWEEN.update();

  animateOcean(time);
  animateFishes();
  animateJetPlanes(); // AJOUT IMPORTANT

  // Animation de la pluie
  if (rain && rain.geometry) {
    const positions = rain.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= 0.1;
      if (positions[i] < -10) {
        positions[i] = 30;
        positions[i - 1] = Math.random() * 50 - 25;
        positions[i + 1] = Math.random() * -50 + 5;
      }
    }
    if (rain.geometry.attributes.position) {
      rain.geometry.attributes.position.needsUpdate = true;
    }
  }

  // Move background clouds
  bgClouds.forEach((cloud) => {
    cloud.position.x += 0.003;
    if (cloud.position.x > 15) cloud.position.x = -15;
  });

  // Floating animation for clickable clouds
  clouds.forEach((cloud, index) => {
    cloud.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0015;
  });

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

const handleResize = () => {
  if (camera && renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  handleSunResize();
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  optimizeForMobile();

  initializeSceneElements();
  initSun();
  initThreeJS();
  window.addEventListener("resize", handleResize);
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (sunAnimationId) cancelAnimationFrame(sunAnimationId);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("click", handleResize);
  window.removeEventListener("resize", checkMobile);
  if (renderer && threeContainer.value) {
    threeContainer.value.removeChild(renderer.domElement);
    renderer.dispose();
  }
});

// Code d'authentification
onBeforeMount(async () => {
  visible.value = true;
  if (authStore.isLoggedIn != null) {
    await api
      .post("/api/allPrivileges")
      .then((res) => {
        privileges.value = res.data;
      })
      .catch((errors) => {
        visible.value = false;
      });

    if (
      authStore.isLoggedIn != null &&
      privileges.value != "Unauthenticated." &&
      authStore.isResponsable == true
    ) {
      router.push("/essais/essaisPV");
    } else if (
      authStore.isLoggedIn != null &&
      privileges.value != "Unauthenticated." &&
      authStore.isOperateur == true
    ) {
      router.push("/essais/ecrasements");
    } else if (
      authStore.isLoggedIn != null &&
      privileges.value != "Unauthenticated."
    ) {
      router.push("/");
    }
  }
  localStorage.clear();
  visible.value = false;
});

const authStore = useAuthStore();
const router = useRouter();
const privileges = ref("Unauthenticated.");

let form = reactive({
  Email: null,
  password: null,
});

let showPassword = ref(false);
let submiting = ref(false);
let myErrors = ref();
const currentYear = computed(() => new Date().getFullYear());

watch(
  () => authStore.loginErrors,
  (newVal) => {
    myErrors.value = newVal;
  }
);

watch(form, (newVal, oldVal) => {
  myErrors.value = false;
  submiting.value = false;
});

const handleLogin = async () => {
  submiting.value = true;
  try {
    await authStore.login(form);
    submiting.value = false;
    myErrors.value = authStore.loginErrors;

    if (
      authStore.changePassword ==
      "Vous devez changer votre mot de passe pour continuer!"
    ) {
      router.push("/changePasswrod");
    } else if (!authStore.loginErrors && authStore.isResponsable == true) {
      router.push("/essais/essaisPV");
    } else if (!authStore.loginErrors && authStore.isOperateur == true) {
      router.push("/essais/ecrasements");
    } else if (!authStore.loginErrors) {
      router.push("/");
    }
  } catch (error) {
    submiting.value = false;
    console.error("Login error:", error);
  }
};
</script>

<style scoped>
/* Tous les styles CSS précédents restent exactement les mêmes */
/* ... (tous les styles CSS que vous aviez avant) */

/* Canvas du soleil - bien visible */
canvas {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.absolute.inset-0.z-10 {
  pointer-events: none;
}

.absolute.inset-0.z-10 canvas {
  pointer-events: auto;
  opacity: 1;
}

.fixed.top-4.right-4 {
  z-index: 50;
}

/* Styles pour les oiseaux */
.bird {
  background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg");
  filter: invert(34%) sepia(55%) saturate(427%) hue-rotate(141deg)
    brightness(93%) contrast(91%);
  background-size: auto 100%;
  width: 88px;
  height: 125px;
  will-change: background-position;
  animation-name: fly-cycle;
  animation-timing-function: steps(10);
  animation-iteration-count: infinite;
}

.bird-1 {
  animation-duration: 1s;
  animation-delay: -0.5s;
}
.bird-2 {
  animation-duration: 0.9s;
  animation-delay: -0.75s;
}
.bird-3 {
  animation-duration: 1.25s;
  animation-delay: -0.25s;
}
.bird-4 {
  animation-duration: 1.1s;
  animation-delay: -0.5s;
}
.bird-5 {
  animation-duration: 0.95s;
  animation-delay: -0.3s;
}
.bird-6 {
  animation-duration: 1.15s;
  animation-delay: -0.6s;
}
.bird-7 {
  animation-duration: 1.05s;
  animation-delay: -0.4s;
}

.bird-container {
  position: absolute;
  transform: scale(0) translateX(-10vw);
  will-change: transform;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  z-index: 15;
}

.bird-container.left-to-right {
  left: -3%;
  animation-name: fly-right;
}

.bird-container.right-to-left {
  right: -3%;
  animation-name: fly-left;
  transform: scale(0) translateX(10vw) scaleX(-1);
}

@keyframes fly-cycle {
  100% {
    background-position: -900px 0;
  }
}

@keyframes fly-right {
  0% {
    transform: scale(0.3) translateX(-10vw);
  }
  10% {
    transform: translateY(2vh) translateX(10vw) scale(0.4);
  }
  20% {
    transform: translateY(0vh) translateX(30vw) scale(0.5);
  }
  30% {
    transform: translateY(4vh) translateX(50vw) scale(0.6);
  }
  40% {
    transform: translateY(2vh) translateX(70vw) scale(0.6);
  }
  50% {
    transform: translateY(0vh) translateX(90vw) scale(0.6);
  }
  60% {
    transform: translateY(0vh) translateX(110vw) scale(0.6);
  }
  100% {
    transform: translateY(0vh) translateX(110vw) scale(0.6);
  }
}

@keyframes fly-left {
  0% {
    transform: scale(0.3) translateX(10vw) scaleX(-1);
  }
  10% {
    transform: translateY(2vh) translateX(-10vw) scale(0.4) scaleX(-1);
  }
  20% {
    transform: translateY(0vh) translateX(-30vw) scale(0.5) scaleX(-1);
  }
  30% {
    transform: translateY(4vh) translateX(-50vw) scale(0.6) scaleX(-1);
  }
  40% {
    transform: translateY(2vh) translateX(-70vw) scale(0.6) scaleX(-1);
  }
  50% {
    transform: translateY(0vh) translateX(-90vw) scale(0.6) scaleX(-1);
  }
  60% {
    transform: translateY(0vh) translateX(-110vw) scale(0.6) scaleX(-1);
  }
  100% {
    transform: translateY(0vh) translateX(-110vw) scale(0.6) scaleX(-1);
  }
}

/* Bateau */
.boat-container {
  position: absolute;
  bottom: -19vh;
  left: 10%;
  width: 80%;
  z-index: 25;
  animation: boat-float 4s ease-in-out infinite;
}

.boat-svg-wrapper {
  position: relative;
  width: 100%;
  filter: drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.3));
}

.boat-svg {
  width: 100%;
  height: auto;
}

@keyframes boat-float {
  0%,
  100% {
    transform: translateY(0px) rotate(0.5deg);
  }
  25% {
    transform: translateY(-6px) rotate(0.8deg);
  }
  50% {
    transform: translateY(-10px) rotate(0.3deg);
  }
  75% {
    transform: translateY(-3px) rotate(-0.2deg);
  }
}

/* Vagues */
.waves-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20vh;
  margin-bottom: -7px;
  min-height: 100px;
  max-height: 150px;
  z-index: 20;
}

.waves {
  position: relative;
  width: 100%;
  height: 100%;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
.parallax > use:nth-child(5) {
  animation-delay: -1s;
  animation-duration: 15s;
  animation-name: move-forever-reflect;
}
.parallax > use:nth-child(6) {
  animation-delay: -6s;
  animation-duration: 18s;
  animation-name: move-forever-reflect;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

@keyframes move-forever-reflect {
  0% {
    transform: translate3d(-90px, 0, 0) scaleY(0.8);
    opacity: 0.3;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    transform: translate3d(85px, 0, 0) scaleY(0.8);
    opacity: 0.3;
  }
}

/* Formulaire */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.relative.z-40 {
  animation: slideInUp 0.8s ease-out;
}

input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  border-color: rgb(96 165 250);
  background-color: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .waves-container {
    height: 40px;
    min-height: 40px;
  }

  .boat-container {
    bottom: 15vh;
    left: 5%;
    width: 90%;
  }

  .relative.z-40 {
    max-width: 95%;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-bottom: 20vh;
  }

  .bird-container {
    transform: scale(0.7) translateX(-10vw);
  }

  .bird {
    width: 66px;
    height: 94px;
  }

  .flex {
    flex-direction: column;
  }

  .w-2\/5,
  .w-3\/5 {
    width: 100%;
  }

  .pr-6,
  .pl-6 {
    padding-left: 0;
    padding-right: 0;
  }

  .border-r {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .boat-container {
    bottom: 12vh;
  }

  .bird-container {
    transform: scale(0.6) translateX(-10vw);
  }

  .bird {
    width: 53px;
    height: 75px;
  }
}

.lighthouse-container {
  position: absolute;
  right: 10%;
  bottom: 20%;
  z-index: 20;
  width: 40px;
  height: 120px;
}

.lighthouse {
  position: relative;
  width: 100%;
  height: 100%;
}

.lighthouse-tower {
  width: 20px;
  height: 100px;
  background: linear-gradient(45deg, #8b4513, #a0522d);
  margin: 0 auto;
  border-radius: 10px 10px 0 0;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.lighthouse-light {
  width: 30px;
  height: 20px;
  background: #ffd700;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  animation: lightRotate 4s linear infinite;
}

.light-beam {
  position: absolute;
  top: -5px;
  left: 50%;
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  transform-origin: left center;
  animation: beamSweep 4s linear infinite;
}

/* Dauphins */
.dolphin-container {
  position: absolute;
  z-index: 15;
  animation: dolphinSwim 8s ease-in-out infinite;
}

.dolphin {
  position: relative;
  width: 60px;
  height: 20px;
  cursor: pointer;
}

.dolphin-body {
  width: 60px;
  height: 20px;
  background: linear-gradient(45deg, #1e90ff, #87ceeb);
  border-radius: 50% 40% 40% 50%;
  position: relative;
}

.dolphin-fin {
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 20px;
  background: #1e90ff;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}

/* Bouées */
.buoy-container {
  position: absolute;
  z-index: 18;
  animation: buoyFloat 3s ease-in-out infinite;
}

.buoy {
  position: relative;
  width: 25px;
  height: 40px;
  cursor: pointer;
}

.buoy-top {
  width: 25px;
  height: 10px;
  background: #ff6b6b;
  border-radius: 50% 50% 0 0;
}

.buoy-body {
  width: 25px;
  height: 25px;
  background: #ff6b6b;
  border-radius: 0 0 40% 40%;
}

.buoy-bell {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 5px;
  background: #ffd700;
  border-radius: 50%;
}

/* Algues */
.seaweed-container {
  position: absolute;
  z-index: 5;
}

.seaweed {
  width: 8px;
  height: 40px;
  background: linear-gradient(to top, #228b22, #32cd32);
  border-radius: 4px;
  animation: seaweedSway 4s ease-in-out infinite;
  position: relative;
}

.seaweed::before,
.seaweed::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 25px;
  background: #32cd32;
  border-radius: 3px;
}

.seaweed::before {
  top: -15px;
  left: -8px;
  transform: rotate(-25deg);
}

.seaweed::after {
  top: -20px;
  right: -8px;
  transform: rotate(25deg);
}

/* Coquillages */
.shell-container {
  position: absolute;
  z-index: 10;
}

.shell {
  width: 30px;
  height: 20px;
  position: relative;
  cursor: pointer;
  transition: all 0.5s ease;
}

.shell-top,
.shell-bottom {
  position: absolute;
  width: 30px;
  height: 15px;
  background: linear-gradient(45deg, #ffe4e1, #ffb6c1);
  border-radius: 50%;
  transition: all 0.5s ease;
}

.shell-top {
  top: 0;
  transform-origin: bottom center;
}

.shell-bottom {
  bottom: 0;
}

.shell.open .shell-top {
  transform: rotate(-45deg);
}

.pearl {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.shell.open .pearl {
  opacity: 1;
}

/* Étoiles de mer */
.starfish-container {
  position: absolute;
  z-index: 12;
}

.starfish {
  width: 25px;
  height: 25px;
  background: #ff6b6b;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  cursor: pointer;
  transition: all 0.3s ease;
}

.starfish.glow {
  filter: drop-shadow(0 0 10px #ff6b6b);
  transform: scale(1.2);
}

/* Bulles */
.bubble-container {
  position: absolute;
  z-index: 25;
  animation: bubbleRise 6s ease-in infinite;
}

.bubble {
  width: 15px;
  height: 15px;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.8),
    rgba(173, 216, 230, 0.4)
  );
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bubble.pop {
  transform: scale(1.5);
  opacity: 0;
}

/* Arc-en-ciel */
.rainbow-container {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 1s ease;
  z-index: 5;
  pointer-events: none;
}

.rainbow-container.active {
  opacity: 0.7;
}

.rainbow {
  width: 300px;
  height: 150px;
  border-radius: 150px 150px 0 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    #ff0000 15%,
    #ff7f00 30%,
    #ffff00 45%,
    #00ff00 60%,
    #0000ff 75%,
    #4b0082 90%,
    #8b00ff 100%
  );
  opacity: 0.6;
}

/* Éclairs */
.lightning-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  z-index: 30;
  transition: opacity 0.1s ease;
}

.lightning-container.active {
  opacity: 1;
}

.lightning {
  position: absolute;
  top: 0;
  left: 30%;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #ffffff, transparent);
  animation: lightningFlash 0.2s ease-out;
}

/* Brouillard */
.fog-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 2s ease;
  z-index: 8;
}

.fog-container.active {
  opacity: 0.4;
}

.fog-layer-1,
.fog-layer-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
}

.fog-layer-1 {
  animation: fogMove 20s linear infinite;
}

.fog-layer-2 {
  animation: fogMove 25s linear infinite reverse;
}

/* Grue portuaire */
.crane-container {
  position: absolute;
  right: 5%;
  bottom: 25%;
  z-index: 15;
}

.crane {
  position: relative;
  width: 80px;
  height: 120px;
}

.crane-base {
  width: 60px;
  height: 10px;
  background: #555;
  position: absolute;
  bottom: 0;
  left: 10px;
}

.crane-tower {
  width: 15px;
  height: 100px;
  background: #777;
  position: absolute;
  bottom: 10px;
  left: 32.5px;
}

.crane-arm {
  width: 80px;
  height: 8px;
  background: #666;
  position: absolute;
  top: 20px;
  left: -30px;
  animation: craneSwing 8s ease-in-out infinite;
}

.crane-hook {
  width: 5px;
  height: 30px;
  background: #333;
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  animation: craneLift 8s ease-in-out infinite;
}

.cargo-container {
  width: 20px;
  height: 15px;
  background: #4ecdc4;
  position: absolute;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
  animation: containerLift 8s ease-in-out infinite;
}

/* Conteneurs */
.containers-container {
  position: absolute;
  right: 15%;
  bottom: 10%;
  z-index: 12;
}

.container-item {
  position: absolute;
}

.container-box {
  width: 25px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Feux de signalisation */
.traffic-light-container {
  position: absolute;
  right: 8%;
  bottom: 40%;
  z-index: 18;
}

.traffic-light {
  width: 20px;
  height: 60px;
  background: #333;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.light {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.light.active {
  opacity: 1;
}

.light.red {
  background: #ff4444;
}
.light.yellow {
  background: #ffaa00;
}
.light.green {
  background: #44ff44;
}

/* Bateau de pêche */
.fishing-boat-container {
  position: absolute;
  left: 5%;
  bottom: 18%;
  z-index: 18;
}

.fishing-boat {
  position: relative;
  width: 80px;
  height: 30px;
}

.fishing-boat-body {
  width: 80px;
  height: 20px;
  background: #8b4513;
  border-radius: 10px 10px 0 0;
  position: absolute;
  bottom: 0;
}

.jet-plane {
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

/* Animation de traînée de réacteur (optionnelle) */
@keyframes jetTrail {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

.jet-trail {
  position: absolute;
  width: 20px;
  height: 8px;
  background: linear-gradient(90deg, #ffa500, transparent);
  border-radius: 50%;
  animation: jetTrail 1s ease-out infinite;
}

.fishing-net {
  width: 40px;
  height: 30px;
  background: linear-gradient(
    45deg,
    transparent 70%,
    rgba(255, 255, 255, 0.3) 100%
  );
  position: absolute;
  bottom: -25px;
  right: 10px;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
}

.fishing-crane {
  width: 4px;
  height: 25px;
  background: #666;
  position: absolute;
  top: -20px;
  right: 30px;
  transform: rotate(-10deg);
}

/* Écume sur les vagues */
.foam {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  pointer-events: none;
}

.foam-bubble {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: foamFloat 3s ease-in-out infinite;
}

/* Traînée de souris */
.mouse-trail {
  position: fixed;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* ANIMATIONS */

@keyframes lightRotate {
  0%,
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
  50% {
    transform: translateX(-50%) rotate(180deg);
  }
}

@keyframes beamSweep {
  0%,
  100% {
    transform: translateX(-50%) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: translateX(-50%) rotate(45deg);
    opacity: 1;
  }
}

@keyframes dolphinSwim {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(-5deg);
  }
  50% {
    transform: translateY(-5px) rotate(0deg);
  }
  75% {
    transform: translateY(-8px) rotate(5deg);
  }
}

@keyframes dolphinJump {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes buoyFloat {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(2deg);
  }
}

@keyframes buoyRing {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes seaweedSway {
  0%,
  100% {
    transform: skewX(0deg);
  }
  50% {
    transform: skewX(10deg);
  }
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1.5);
    opacity: 0;
  }
}

@keyframes lightningFlash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fogMove {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes craneSwing {
  0%,
  100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

@keyframes craneLift {
  0%,
  100% {
    height: 30px;
    bottom: -40px;
  }
  50% {
    height: 50px;
    bottom: -60px;
  }
}

@keyframes containerLift {
  0%,
  100% {
    bottom: -70px;
  }
  50% {
    bottom: -90px;
  }
}

@keyframes foamFloat {
  0%,
  100% {
    transform: translateY(0) translateX(0);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-5px) translateX(2px);
    opacity: 1;
  }
}

/* ===== RESPONSIVE MOBILE ===== */
@media (max-width: 768px) {
  /* Ajustement général de la mise en page */
  .min-h-screen {
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Canvas et conteneurs Three.js */
  .absolute.inset-0.z-5,
  .absolute.inset-0.z-10 {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }

  /* Formulaire de connexion */
  .relative.z-40 {
    position: relative;
    width: 95%;
    max-width: none;
    margin: 0 auto 20vh;
    padding: 0 10px;
  }

  .flex {
    flex-direction: column;
  }

  .w-2\/5,
  .w-3\/5 {
    width: 100% !important;
  }

  .pr-6,
  .pl-6 {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .border-r {
    border-right: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* Bateau SVG */
  .boat-container {
    bottom: 15vh;
    left: 5%;
    width: 90%;
    transform: scale(0.9);
  }

  /* Vagues */
  .waves-container {
    height: 60px;
    min-height: 60px;
  }

  /* Animations réduites pour mobile */
  .bird-container {
    transform: scale(0.6);
  }

  .bird {
    width: 44px;
    height: 63px;
  }

  /* Éléments décoratifs réduits */
  .lighthouse-container {
    right: 5%;
    bottom: 25%;
    transform: scale(0.7);
  }

  .dolphin-container {
    transform: scale(0.7);
  }

  .buoy-container {
    transform: scale(0.8);
  }

  /* Texte plus lisible */
  .text-xl {
    font-size: 1.1rem;
  }

  .text-lg {
    font-size: 1rem;
  }

  .text-xs {
    font-size: 0.7rem;
  }

  /* Inputs plus grands pour le tactile */
  input,
  button {
    min-height: 44px; /* Taille minimale pour le tactile */
  }

  .py-2 {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}

@media (max-width: 480px) {
  /* Ajustements supplémentaires pour petits écrans */
  .boat-container {
    bottom: 12vh;
    transform: scale(0.8);
  }

  .waves-container {
    height: 40px;
    min-height: 40px;
  }

  .bird-container {
    transform: scale(0.5);
  }

  .relative.z-40 {
    margin-bottom: 15vh;
  }

  /* Réduire encore certains éléments décoratifs */
  .lighthouse-container,
  .dolphin-container,
  .buoy-container {
    transform: scale(0.6);
  }

  /* Cacher certains éléments sur très petits écrans */
  .rainbow-container,
  .crane-container,
  .traffic-light-container {
    display: none;
  }

  /* Ajustement du padding */
  .p-6 {
    padding: 1rem;
  }

  .mb-40 {
    margin-bottom: 10vh;
  }
}

/* Orientation paysage sur mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .relative.z-40 {
    margin-bottom: 10vh;
    transform: scale(0.9);
  }

  .boat-container {
    bottom: 20vh;
  }

  .waves-container {
    height: 30px;
  }
}

/* Support tactile amélioré */
@media (hover: none) and (pointer: coarse) {
  /* Désactiver les effets hover sur mobile */
  .dolphin:hover,
  .buoy:hover,
  .shell:hover,
  .starfish:hover,
  .bubble:hover {
    transform: none !important;
  }

  /* Agrandir les zones cliquables */
  .dolphin,
  .buoy,
  .shell,
  .starfish,
  .bubble {
    min-width: 44px;
    min-height: 44px;
  }
}

/* Performance mobile - réduire les animations */
@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
  .bird-container,
  .dolphin-container,
  .buoy-container,
  .bubble-container {
    animation-duration: calc(var(--original-duration, 1s) * 1.5);
  }
}

/* Mode économie d'énergie */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
