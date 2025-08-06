<template>
  <div class="min-h-screen relative flex items-center justify-center overflow-hidden">
    <!-- Background Image - Plus visible -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/slider_bg02.jpg')"
    ></div>
    
    <!-- Léger overlay pour la lisibilité mais garde l'image visible -->
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-5xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <!-- Left Side - Branding -->
        <div class="text-center lg:text-left text-white order-2 lg:order-1">
          <!-- Logo et titre -->
          <div class="mb-8">
            <div class="flex items-center justify-center lg:justify-start mb-6">
              <q-img class="w-16 h-16 mr-4" src="/logo epal.png" />
              <div>
                <h1 class="text-3xl font-bold">EPAL</h1>
                <p class="text-lg opacity-90">Entreprise Portuaire d'Alger</p>
              </div>
            </div>
            
            <h2 class="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
              Bienvenue sur votre
              <span class="text-emerald-300">Plateforme Portuaire</span>
            </h2>
            <p class="text-lg opacity-90 leading-relaxed">
              Connectez-vous pour accéder à vos services : E-paiement, Factures et Réclamations.
            </p>
          </div>

          <!-- Features -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <q-icon name="security" class="text-emerald-300 text-xl" />
              </div>
              <p class="text-sm font-medium">Sécurisé</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <q-icon name="speed" class="text-orange-300 text-xl" />
              </div>
              <p class="text-sm font-medium">Rapide</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <q-icon name="support" class="text-teal-300 text-xl" />
              </div>
              <p class="text-sm font-medium">Support 24/7</p>
            </div>
          </div>

          <!-- Retour acceuil -->
          <div class="text-center lg:text-left">
            <q-btn 
              to="/acceuil" 
              outline 
              icon="home" 
              label="Retour à l'acceuil" 
              class="text-white border-white/60 hover:bg-white/10 hover:border-white"
              size="md"
            />
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="order-1 lg:order-2">
          <!-- Formulaire avec fond transparent/clair -->
          <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20">
            <!-- Header formulaire -->
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Connexion</h3>
              <p class="text-gray-600">Accédez à votre espace personnel EPAL</p>
            </div>

            <!-- Formulaire -->
            <form @submit.prevent="handleLogin" class="space-y-6">
              <!-- Nom d'utilisateur -->
              <div>
                <InputLabel for="username" value="Nom d'utilisateur" class="text-gray-700 font-medium mb-2">
                  <span class="text-red-500 ml-1">*</span>
                </InputLabel>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <q-icon name="person" class="text-gray-400" />
                  </div>
                  <TextInput 
                    id="username" 
                    type="text" 
                    placeholder="Votre nom d'utilisateur" 
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 shadow-sm" 
                    v-model="form.Email" 
                    required 
                    autofocus 
                    autocomplete="username" 
                  />
                </div>
              </div>

              <!-- Mot de passe -->
              <div>
                <InputLabel for="password" value="Mot de passe" class="text-gray-700 font-medium mb-2">
                  <span class="text-red-500 ml-1">*</span>
                </InputLabel>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <q-icon name="lock" class="text-gray-400" />
                  </div>
                  <TextInput 
                    id="password" 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="Votre mot de passe" 
                    class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 shadow-sm" 
                    v-model="form.password" 
                    required
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <q-icon 
                      :name="showPassword ? 'visibility_off' : 'visibility'" 
                      class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" 
                    />
                  </button>
                </div>
              </div>

              <!-- Message d'erreur -->
              <InputError 
                v-if="myErrors" 
                class="bg-red-50 border border-red-200 rounded-lg p-3" 
                message="Nom d'utilisateur et/ou mot de passe incorrect(s)" 
              />

              <!-- Bouton de connexion -->
              <div class="pt-2">
                <PrimaryButton 
                  class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center text-base" 
                  :class="{ 'opacity-75 cursor-not-allowed': submiting }" 
                  :disabled="submiting"
                >
                  <q-spinner-oval 
                    v-if="submiting" 
                    size="20px" 
                    class="mr-3 text-white" 
                  />
                  <q-icon 
                    v-else 
                    name="login" 
                    class="mr-2" 
                  />
                  {{ submiting ? "Connexion en cours..." : "Se connecter" }}
                </PrimaryButton>
              </div>

              <!-- Liens utiles -->
              <div class="text-center space-y-2 pt-4">
                <p class="text-sm text-gray-600">
                  <router-link to="/forgot-password" class="text-emerald-600 hover:text-emerald-700 transition-colors">
                    Mot de passe oublié ?
                  </router-link>
                </p>
                <p class="text-sm text-gray-600">
                  Besoin d'aide ? 
                  <a href="http://ged.epal.dz/" class="text-teal-600 hover:text-teal-700 transition-colors ml-1">
                    Contactez le support
                  </a>
                </p>
              </div>
            </form>

            <!-- Footer du formulaire -->
            <div class="text-center mt-8 pt-6 border-t border-gray-200">
              <p class="text-xs text-gray-500">
                © {{ currentYear }} EPAL - Entreprise Portuaire d'Alger
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Éléments décoratifs subtils -->
    <div class="absolute top-10 right-10 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl"></div>
    <div class="absolute bottom-20 left-10 w-24 h-24 bg-teal-400/10 rounded-full blur-xl"></div>
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

.order-1 {
  animation: slideInLeft 0.8s ease-out;
}

.order-2 {
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