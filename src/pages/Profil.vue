<template>
  <q-page class="bg-gray-50 min-h-screen">
    <div class="container mx-auto p-6 max-w-4xl">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Mon Profil</h1>
        <p class="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Sidebar - Informations utilisateur -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6">
            
            <!-- Avatar et info de base -->
            <div class="text-center mb-6">
              <div class="relative inline-block">
                <div class="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img 
                    v-if="userPhoto" 
                    :src="userPhoto" 
                    :alt="userFullName"
                    class="w-full h-full object-cover"
                  />
                  <q-icon 
                    v-else 
                    name="person" 
                    class="text-3xl text-emerald-600" 
                  />
                </div>
                
                <!-- Badge en ligne -->
                <div class="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              <h3 class="text-xl font-bold text-gray-800">{{ userFullName }}</h3>
              <p class="text-gray-600 mb-4">{{ userEmail }}</p>
              
              <div class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                <q-icon name="verified" class="mr-1 text-xs" />
                Compte actif
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Onglets -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <q-tabs
              v-model="activeTab"
              class="bg-gray-50"
              active-color="emerald-6"
              indicator-color="emerald-6"
              align="left"
            >
              <q-tab name="info" icon="person" label="Informations" />
              <q-tab name="security" icon="security" label="Sécurité" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" class="bg-white">
              
              <!-- Onglet Informations -->
              <q-tab-panel name="info" class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6">Informations personnelles</h3>
                
                <form @submit.prevent="updateProfile" class="space-y-6">
                  
                  <!-- Photo de profil -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Photo de profil
                    </label>
                    <div class="flex items-center space-x-4">
                      <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          v-if="profileForm.photoPreview || userPhoto" 
                          :src="profileForm.photoPreview || userPhoto" 
                          class="w-full h-full object-cover"
                        />
                        <q-icon v-else name="person" class="text-xl text-gray-400" />
                      </div>
                      
                      <div>
                        <q-btn
                          @click="$refs.photoInput.click()"
                          color="emerald-6"
                          outline
                          icon="photo_camera"
                          label="Changer la photo"
                          size="sm"
                        />
                        <input
                          ref="photoInput"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          class="hidden"
                          @change="onPhotoChange"
                        />
                        <p class="text-xs text-gray-500 mt-1">JPG, PNG max 2MB</p>
                      </div>
                    </div>
                  </div>

                  <!-- Nom -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nom <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="profileForm.nom"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Prénom <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="profileForm.prenom"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <!-- Email (lecture seule) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <input
                      :value="userEmail"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      readonly
                    />
                    <p class="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>

                  <!-- Messages -->
                  <div v-if="profileMessage" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p class="text-emerald-600 text-sm">{{ profileMessage }}</p>
                  </div>

                  <div v-if="profileError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-red-600 text-sm">{{ profileError }}</p>
                  </div>

                  <!-- Bouton sauvegarder -->
                  <div class="flex justify-end">
                    <q-btn
                      type="submit"
                      color="blue-10"
                      icon="save"
                      label="Sauvegarder"
                      :loading="profileLoading"
                      class="px-6"
                    />
                  </div>
                </form>
              </q-tab-panel>

              <!-- Onglet Sécurité -->
              <q-tab-panel name="security" class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6">Sécurité du compte</h3>
                
                <!-- Option 1: Changement classique -->
                <div class="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4">Changer le mot de passe</h4>
                  
                  <form @submit.prevent="changePassword" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="passwordForm.current_password"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau mot de passe <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="passwordForm.password"
                          type="password"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          minlength="8"
                          required
                        />
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le mot de passe <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="passwordForm.password_confirmation"
                          type="password"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          minlength="8"
                          required
                        />
                      </div>
                    </div>

                    <div v-if="passwordMessage" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <p class="text-emerald-600 text-sm">{{ passwordMessage }}</p>
                    </div>

                    <div v-if="passwordError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p class="text-red-600 text-sm">{{ passwordError }}</p>
                    </div>

                    <div class="flex justify-end">
                      <q-btn
                        type="submit"
                        color="blue-6"
                        icon="lock"
                        label="Changer le mot de passe"
                        :loading="passwordLoading"
                        class="px-6"
                      />
                    </div>
                  </form>
                </div>

                <!-- Option 2: Changement avec code email -->
                <div class="bg-blue-50 rounded-lg p-6">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4">
                    Changer le mot de passe avec code email
                  </h4>
                  <p class="text-gray-600 text-sm mb-4">
                    Plus sécurisé : recevez un code par email pour changer votre mot de passe.
                  </p>

                  <!-- Étape 1: Demander le code -->
                  <div v-if="!codeRequested">
                    <q-btn
                      @click="requestPasswordChangeCode"
                      color="blue-6"
                      icon="email"
                      label="Recevoir un code par email"
                      :loading="codeLoading"
                      outline
                    />
                  </div>

                  <!-- Étape 2: Saisir code + nouveau mot de passe -->
                  <form v-else @submit.prevent="changePasswordWithCode" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Code de vérification <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="codeForm.code"
                        type="text"
                        maxlength="6"
                        placeholder="123456"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono text-lg tracking-widest"
                        required
                      />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau mot de passe <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="codeForm.password"
                          type="password"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          minlength="8"
                          required
                        />
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le mot de passe <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="codeForm.password_confirmation"
                          type="password"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          minlength="8"
                          required
                        />
                      </div>
                    </div>

                    <div v-if="codeMessage" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p class="text-blue-600 text-sm">{{ codeMessage }}</p>
                    </div>

                    <div v-if="codeError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p class="text-red-600 text-sm">{{ codeError }}</p>
                    </div>

                    <div class="flex justify-between">
                      <q-btn
                        @click="resetCodeForm"
                        color="grey"
                        icon="refresh"
                        label="Nouveau code"
                        outline
                        size="sm"
                      />
                      
                      <q-btn
                        type="submit"
                        color="blue-6"
                        icon="verified_user"
                        label="Changer avec le code"
                        :loading="codePasswordLoading"
                        class="px-6"
                      />
                    </div>
                  </form>
                </div>

              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "stores/auth";
import { useQuasar } from "quasar";

const authStore = useAuthStore();
const $q = useQuasar();

const activeTab = ref('info');

// Données utilisateur depuis le store
const userFullName = computed(() => authStore.getUserFullName);
const userEmail = computed(() => authStore.getUserEmail);
const userPhoto = computed(() => authStore.getUserPhoto);

// Formulaires
const profileForm = reactive({
  nom: '',
  prenom: '',
  photo: null,
  photoPreview: null
});

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
});

const codeForm = reactive({
  code: '',
  password: '',
  password_confirmation: ''
});

// États de chargement et messages
const profileLoading = ref(false);
const profileMessage = ref('');
const profileError = ref('');

const passwordLoading = ref(false);
const passwordMessage = ref('');
const passwordError = ref('');

const codeLoading = ref(false);
const codePasswordLoading = ref(false);
const codeMessage = ref('');
const codeError = ref('');
const codeRequested = ref(false);

// Initialiser les données du formulaire
onMounted(() => {
  profileForm.nom = authStore.userProfile.nom;
  profileForm.prenom = authStore.userProfile.prenom;
});

// Gestion de la photo
const onPhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Vérifier la taille (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      $q.notify({
        type: 'negative',
        message: 'La photo ne doit pas dépasser 2MB'
      });
      return;
    }

    profileForm.photo = file;
    
    // Prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      profileForm.photoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Mettre à jour le profil
const updateProfile = async () => {
  profileLoading.value = true;
  profileMessage.value = '';
  profileError.value = '';

  const formData = new FormData();
  formData.append('nom', profileForm.nom);
  formData.append('prenom', profileForm.prenom);
  formData.append('id', authStore.user.id);
  
  if (profileForm.photo) {
    formData.append('photo', profileForm.photo);
  }

  const result = await authStore.updateProfile(formData);
  
  if (result.success) {
    profileMessage.value = 'Profil mis à jour avec succès';
    
    // Actualiser les données du formulaire avec les nouvelles valeurs
    profileForm.nom = authStore.userProfile.nom;
    profileForm.prenom = authStore.userProfile.prenom;
    profileForm.photo = null;
    profileForm.photoPreview = null;
    
    // Recharger les données utilisateur pour synchroniser
    await authStore.getUser();
    
    $q.notify({
      type: 'positive',
      message: 'Profil mis à jour avec succès'
    });
  } else {
    profileError.value = result.error;
  }
  
  profileLoading.value = false;
};

// Changer mot de passe (méthode classique)
const changePassword = async () => {
  if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordError.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  passwordLoading.value = true;
  passwordMessage.value = '';
  passwordError.value = '';

  const result = await authStore.changePasswordd({
    current_password: passwordForm.current_password,
    password: passwordForm.password,
    password_confirmation: passwordForm.password_confirmation
  });
  
  if (result.success) {
    passwordMessage.value = 'Mot de passe changé avec succès';
    passwordForm.current_password = '';
    passwordForm.password = '';
    passwordForm.password_confirmation = '';
    
    $q.notify({
      type: 'positive',
      message: 'Mot de passe changé avec succès'
    });
  } else {
    passwordError.value = result.error;
  }
  
  passwordLoading.value = false;
};

// Demander code pour changement de mot de passe
const requestPasswordChangeCode = async () => {
  codeLoading.value = true;
  codeMessage.value = '';
  codeError.value = '';

  const result = await authStore.requestPasswordChangeCode();
  
  if (result.success) {
    codeRequested.value = true;
    codeMessage.value = 'Code envoyé à votre adresse email';
    
    $q.notify({
      type: 'positive',
      message: 'Code envoyé à votre adresse email'
    });
  } else {
    codeError.value = result.error;
  }
  
  codeLoading.value = false;
};

// Changer mot de passe avec code
const changePasswordWithCode = async () => {
  if (codeForm.password !== codeForm.password_confirmation) {
    codeError.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  codePasswordLoading.value = true;
  codeMessage.value = '';
  codeError.value = '';

  const result = await authStore.changePasswordWithCode({
    code: codeForm.code,
    password: codeForm.password,
    password_confirmation: codeForm.password_confirmation
  });
  
  if (result.success) {
    codeMessage.value = 'Mot de passe changé avec succès';
    resetCodeForm();
    
    $q.notify({
      type: 'positive',
      message: 'Mot de passe changé avec succès'
    });
  } else {
    codeError.value = result.error;
  }
  
  codePasswordLoading.value = false;
};

// Réinitialiser le formulaire code
const resetCodeForm = () => {
  codeRequested.value = false;
  codeForm.code = '';
  codeForm.password = '';
  codeForm.password_confirmation = '';
  codeMessage.value = '';
  codeError.value = '';
};
</script>

<style scoped>
/* Transitions fluides */
input, button {
  transition: all 0.2s ease;
}

/* Focus states */
input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>