<template>
  <div class="tw-min-h-screen tw-relative tw-flex tw-items-center tw-justify-center tw-overflow-hidden">
    <!-- Background Image - Plus visible -->
    <div 
      class="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center tw-bg-no-repeat"
      style="background-image: url('/slider_bg02.jpg')"
    ></div>
    
    <!-- Léger overlay pour la lisibilité mais garde l'image visible -->
    <div class="tw-absolute tw-inset-0 tw-bg-black/30"></div>

    <!-- Main Container -->
    <div class="tw-relative tw-z-10 tw-w-full tw-max-w-5xl tw-mx-auto tw-px-6">
      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-12 tw-items-center">
        
        <!-- Left Side - Branding -->
        <div class="tw-text-center lg:tw-text-left tw-text-white tw-order-2 lg:tw-order-1">
          <!-- Logo et titre -->
          <div class="tw-mb-8">
            <div class="tw-flex tw-items-center tw-justify-center lg:tw-justify-start tw-mb-6">
              <q-img class="tw-w-16 tw-h-16 tw-mr-4" src="/logo-epal.png" />
              <div>
                <h1 class="tw-text-3xl tw-font-bold">EPAL</h1>
                <p class="tw-text-lg tw-opacity-90">Entreprise Portuaire d'Alger</p>
              </div>
            </div>
            
            <h2 class="tw-text-2xl lg:tw-text-3xl tw-font-bold tw-mb-4 tw-leading-tight">
              Bienvenue sur votre
              <span class="tw-text-emerald-300">Plateforme Portuaire</span>
            </h2>
            <p class="tw-text-lg tw-opacity-90 tw-leading-relaxed">
              Connectez-vous pour accéder à vos services : E-paiement, Factures et Réclamations.
            </p>
          </div>

          <!-- Features -->
          <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-6 tw-mb-8">
            <div class="tw-text-center">
              <div class="tw-w-12 tw-h-12 tw-bg-emerald-500/20 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3">
                <q-icon name="security" class="tw-text-emerald-300 tw-text-xl" />
              </div>
              <p class="tw-text-sm tw-font-medium">Sécurisé</p>
            </div>
            <div class="tw-text-center">
              <div class="tw-w-12 tw-h-12 tw-bg-orange-500/20 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3">
                <q-icon name="speed" class="tw-text-orange-300 tw-text-xl" />
              </div>
              <p class="tw-text-sm tw-font-medium">Rapide</p>
            </div>
            <div class="tw-text-center">
              <div class="tw-w-12 tw-h-12 tw-bg-teal-500/20 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3">
                <q-icon name="support" class="tw-text-teal-300 tw-text-xl" />
              </div>
              <p class="tw-text-sm tw-font-medium">Support 24/7</p>
            </div>
          </div>

          <!-- Retour acceuil -->
          <div class="tw-text-center lg:tw-text-left">
            <q-btn 
              to="/acceuil" 
              outline 
              icon="home" 
              label="Retour à l'acceuil" 
              class="tw-text-white tw-border-white/60 hover:tw-bg-white/10 hover:tw-border-white"
              size="md"
            />
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="tw-order-1 lg:tw-order-2">
          <!-- Formulaire avec fond transparent/clair -->
          <div class="tw-bg-white/95 tw-backdrop-blur-sm tw-rounded-3xl tw-shadow-2xl tw-p-8 lg:tw-p-10 tw-border tw-border-white/20">
            <!-- Header formulaire -->
            <div class="tw-text-center tw-mb-8">
              <h3 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-2">Connexion</h3>
              <p class="tw-text-gray-600">Accédez à votre espace personnel EPAL</p>
            </div>

            <!-- Formulaire -->
            <form @submit.prevent="handleLogin" class="tw-space-y-6">
              <!-- Nom d'utilisateur -->
              <div>
                <InputLabel for="username" value="Nom d'utilisateur" class="tw-text-gray-700 tw-font-medium tw-mb-2">
                  <span class="tw-text-red-500 tw-ml-1">*</span>
                </InputLabel>
                <div class="tw-relative">
                  <div class="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                    <q-icon name="person" class="tw-text-gray-400" />
                  </div>
                  <TextInput 
                    id="username" 
                    type="text" 
                    placeholder="Votre nom d'utilisateur" 
                    class="tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-gray-900 focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-emerald-500 tw-transition-all tw-duration-200 tw-shadow-sm" 
                    v-model="form.Email" 
                    required 
                    autofocus 
                    autocomplete="username" 
                  />
                </div>
              </div>

              <!-- Mot de passe -->
              <div>
                <InputLabel for="password" value="Mot de passe" class="tw-text-gray-700 tw-font-medium tw-mb-2">
                  <span class="tw-text-red-500 tw-ml-1">*</span>
                </InputLabel>
                <div class="tw-relative">
                  <div class="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                    <q-icon name="lock" class="tw-text-gray-400" />
                  </div>
                  <TextInput 
                    id="password" 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="Votre mot de passe" 
                    class="tw-w-full tw-pl-10 tw-pr-12 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-gray-900 focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-emerald-500 tw-transition-all tw-duration-200 tw-shadow-sm" 
                    v-model="form.password" 
                    required
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center"
                  >
                    <q-icon 
                      :name="showPassword ? 'visibility_off' : 'visibility'" 
                      class="tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors tw-cursor-pointer" 
                    />
                  </button>
                </div>
              </div>

              <!-- Message d'erreur -->
              <InputError 
                v-if="myErrors" 
                class="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-3" 
                message="Nom d'utilisateur et/ou mot de passe incorrect(s)" 
              />

              <!-- Bouton de connexion -->
              <div class="tw-pt-2">
                <PrimaryButton 
                  class="tw-w-full tw-py-3 tw-px-4 tw-bg-gradient-to-r tw-from-emerald-600 tw-to-teal-600 hover:tw-from-emerald-700 hover:tw-to-teal-700 tw-text-white tw-font-semibold tw-rounded-xl tw-shadow-lg tw-transition-all tw-duration-200 tw-transform hover:tw-scale-[1.02] tw-flex tw-items-center tw-justify-center tw-text-base" 
                  :class="{ 'tw-opacity-75 tw-cursor-not-allowed': submiting }" 
                  :disabled="submiting"
                >
                  <q-spinner-oval 
                    v-if="submiting" 
                    size="20px" 
                    class="tw-mr-3 tw-text-white" 
                  />
                  <q-icon 
                    v-else 
                    name="login" 
                    class="tw-mr-2" 
                  />
                  {{ submiting ? "Connexion en cours..." : "Se connecter" }}
                </PrimaryButton>
              </div>

              <!-- Liens utiles -->
              <div class="tw-text-center tw-space-y-2 tw-pt-4">
                <p class="tw-text-sm tw-text-gray-600">
                  <router-link to="/forgot-password" class="tw-text-emerald-600 hover:tw-text-emerald-700 tw-transition-colors">
                    Mot de passe oublié ?
                  </router-link>
                </p>
                <p class="tw-text-sm tw-text-gray-600">
                  Besoin d'aide ? 
                  <a href="http://ged.epal.dz/" class="tw-text-teal-600 hover:tw-text-teal-700 tw-transition-colors tw-ml-1">
                    Contactez le support
                  </a>
                </p>
              </div>
            </form>

            <!-- Footer du formulaire -->
            <div class="tw-text-center tw-mt-8 tw-pt-6 tw-border-t tw-border-gray-200">
              <p class="tw-text-xs tw-text-gray-500">
                © {{ currentYear }} EPAL - Entreprise Portuaire d'Alger
              </p>
              <p class="tw-text-xs tw-text-gray-500 tw-mt-1">
                Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Éléments décoratifs subtils -->
    <div class="tw-absolute tw-top-10 tw-right-10 tw-w-20 tw-h-20 tw-bg-emerald-400/10 tw-rounded-full tw-blur-xl"></div>
    <div class="tw-absolute tw-bottom-20 tw-left-10 tw-w-24 tw-h-24 tw-bg-teal-400/10 tw-rounded-full tw-blur-xl"></div>
  </div>
  
  <q-inner-loading :showing="visible" label-class="text-teal" label-style="font-size: 1.1em" color="emerald" />
</template>

<script setup>
import InputError from "components/InputError.vue";
import InputLabel from "components/InputLabel.vue";
import PrimaryButton from "components/PrimaryButton.vue";
import TextInput from "components/TextInput.vue";
import { computed, reactive, ref, watch, onBeforeMount } from "vue";
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";
import { useMeta } from "quasar";
import { api } from "boot/axios";

const visible = ref(false);

const metaData = {
  title: "EPAL - Connexion",
};
useMeta(metaData);

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
const privileges = ref('Unauthenticated.');

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
  await authStore.login(form);
  submiting.value = false;
  myErrors.value = authStore.loginErrors;
  if (authStore.changePassword == 'Vous devez changer votre mot de passe pour continuer!') {
    router.push("/changePasswrod");
  }
  else if (!authStore.loginErrors && authStore.isResponsable == true) {
    router.push("/essais/essaisPV");
  }
  else if (!authStore.loginErrors && authStore.isOperateur == true) {
    router.push("/essais/ecrasements");
  }
  else if (!authStore.loginErrors) {
    router.push("/");
  }
};
</script>

<style scoped>
/* Transitions fluides pour tous les éléments interactifs */
input, button, a {
  transition: all 0.2s ease;
}

/* Animation d'entrée pour le formulaire */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tw-order-1 {
  animation: slideInLeft 0.8s ease-out;
}

.tw-order-2 {
  animation: slideInRight 0.8s ease-out;
}

/* Focus states améliorés */
input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Hover effects pour les liens */
a:hover {
  text-decoration: none;
}
</style>