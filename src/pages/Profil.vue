<template>
  <q-page class="tw-bg-gray-50 tw-min-h-screen">
    <div class="tw-container tw-mx-auto tw-p-6 tw-max-w-4xl">
      
      <!-- Header -->
      <div class="tw-mb-8">
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">Mon Profil</h1>
        <p class="tw-text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-8">
        
        <!-- Sidebar - Informations utilisateur -->
        <div class="lg:tw-col-span-1">
          <div class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-p-6">
            
            <!-- Avatar et info de base -->
            <div class="tw-text-center tw-mb-6">
              <div class="tw-relative tw-inline-block">
                <div class="tw-w-24 tw-h-24 tw-bg-gradient-to-br tw-from-emerald-100 tw-to-teal-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4 tw-overflow-hidden">
                  <img 
                    v-if="userPhoto" 
                    :src="userPhoto" 
                    :alt="userFullName"
                    class="tw-w-full tw-h-full tw-object-cover"
                  />
                  <q-icon 
                    v-else 
                    name="person" 
                    class="tw-text-3xl tw-text-emerald-600" 
                  />
                </div>
                
                <!-- Badge en ligne -->
                <div class="tw-absolute tw-bottom-1 tw-right-1 tw-w-6 tw-h-6 tw-bg-emerald-500 tw-border-2 tw-border-white tw-rounded-full tw-flex tw-items-center tw-justify-center">
                  <div class="tw-w-2 tw-h-2 tw-bg-white tw-rounded-full"></div>
                </div>
              </div>
              
              <h3 class="tw-text-xl tw-font-bold tw-text-gray-800">{{ userFullName }}</h3>
              <p class="tw-text-gray-600 tw-mb-4">{{ userEmail }}</p>
              
              <div class="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-bg-emerald-100 tw-text-emerald-800 tw-text-sm tw-font-medium">
                <q-icon name="verified" class="tw-mr-1 tw-text-xs" />
                Compte actif
              </div>
            </div>

            <!-- Stats rapides -->
            <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-pt-4 tw-border-t tw-border-gray-200">
              <div class="tw-text-center">
                <div class="tw-text-2xl tw-font-bold tw-text-gray-800">127</div>
                <div class="tw-text-xs tw-text-gray-600">Connexions</div>
              </div>
              <div class="tw-text-center">
                <div class="tw-text-2xl tw-font-bold tw-text-gray-800">45</div>
                <div class="tw-text-xs tw-text-gray-600">Actions</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:tw-col-span-2 tw-space-y-6">
          
          <!-- Onglets -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-overflow-hidden">
            <q-tabs
              v-model="activeTab"
              class="tw-bg-gray-50"
              active-color="emerald-6"
              indicator-color="emerald-6"
              align="left"
            >
              <q-tab name="info" icon="person" label="Informations" />
              <q-tab name="security" icon="security" label="Sécurité" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" class="tw-bg-white">
              
              <!-- Onglet Informations -->
              <q-tab-panel name="info" class="tw-p-6">
                <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-6">Informations personnelles</h3>
                
                <form @submit.prevent="updateProfile" class="tw-space-y-6">
                  
                  <!-- Photo de profil -->
                  <div>
                    <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                      Photo de profil
                    </label>
                    <div class="tw-flex tw-items-center tw-space-x-4">
                      <div class="tw-w-16 tw-h-16 tw-bg-gray-100 tw-rounded-lg tw-overflow-hidden tw-flex tw-items-center tw-justify-center">
                        <img 
                          v-if="profileForm.photoPreview || userPhoto" 
                          :src="profileForm.photoPreview || userPhoto" 
                          class="tw-w-full tw-h-full tw-object-cover"
                        />
                        <q-icon v-else name="person" class="tw-text-xl tw-text-gray-400" />
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
                          class="tw-hidden"
                          @change="onPhotoChange"
                        />
                        <p class="tw-text-xs tw-text-gray-500 tw-mt-1">JPG, PNG max 2MB</p>
                      </div>
                    </div>
                  </div>

                  <!-- Nom -->
                  <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>
                      <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Nom <span class="tw-text-red-500">*</span>
                      </label>
                      <input
                        v-model="profileForm.nom"
                        type="text"
                        class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-emerald-500 tw-focus:border-emerald-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Prénom <span class="tw-text-red-500">*</span>
                      </label>
                      <input
                        v-model="profileForm.prenom"
                        type="text"
                        class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-emerald-500 tw-focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <!-- Email (lecture seule) -->
                  <div>
                    <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                      Adresse email
                    </label>
                    <input
                      :value="userEmail"
                      type="email"
                      class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 tw-text-gray-600"
                      readonly
                    />
                    <p class="tw-text-xs tw-text-gray-500 tw-mt-1">L'email ne peut pas être modifié</p>
                  </div>

                  <!-- Messages -->
                  <div v-if="profileMessage" class="tw-bg-emerald-50 tw-border tw-border-emerald-200 tw-rounded-lg tw-p-3">
                    <p class="tw-text-emerald-600 tw-text-sm">{{ profileMessage }}</p>
                  </div>

                  <div v-if="profileError" class="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-3">
                    <p class="tw-text-red-600 tw-text-sm">{{ profileError }}</p>
                  </div>

                  <!-- Bouton sauvegarder -->
                  <div class="tw-flex tw-justify-end">
                    <q-btn
                      type="submit"
                      color="blue-10"
                      icon="save"
                      label="Sauvegarder"
                      :loading="profileLoading"
                      class="tw-px-6"
                    />
                  </div>
                </form>
              </q-tab-panel>

              <!-- Onglet Sécurité -->
              <q-tab-panel name="security" class="tw-p-6">
                <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-6">Sécurité du compte</h3>
                
                <!-- Option 1: Changement classique -->
                <div class="tw-bg-gray-50 tw-rounded-lg tw-p-6 tw-mb-6">
                  <h4 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">Changer le mot de passe</h4>
                  
                  <form @submit.prevent="changePassword" class="tw-space-y-4">
                    <div>
                      <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Mot de passe actuel <span class="tw-text-red-500">*</span>
                      </label>
                      <input
                        v-model="passwordForm.current_password"
                        type="password"
                        class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-emerald-500 tw-focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                      <div>
                        <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                          Nouveau mot de passe <span class="tw-text-red-500">*</span>
                        </label>
                        <input
                          v-model="passwordForm.password"
                          type="password"
                          class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-emerald-500 tw-focus:border-emerald-500"
                          minlength="8"
                          required
                        />
                      </div>
                      
                      <div>
                        <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                          Confirmer le mot de passe <span class="tw-text-red-500">*</span>
                        </label>
                        <input
                          v-model="passwordForm.password_confirmation"
                          type="password"
                          class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-emerald-500 tw-focus:border-emerald-500"
                          minlength="8"
                          required
                        />
                      </div>
                    </div>

                    <div v-if="passwordMessage" class="tw-bg-emerald-50 tw-border tw-border-emerald-200 tw-rounded-lg tw-p-3">
                      <p class="tw-text-emerald-600 tw-text-sm">{{ passwordMessage }}</p>
                    </div>

                    <div v-if="passwordError" class="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-3">
                      <p class="tw-text-red-600 tw-text-sm">{{ passwordError }}</p>
                    </div>

                    <div class="tw-flex tw-justify-end">
                      <q-btn
                        type="submit"
                        color="blue-6"
                        icon="lock"
                        label="Changer le mot de passe"
                        :loading="passwordLoading"
                        class="tw-px-6"
                      />
                    </div>
                  </form>
                </div>

                <!-- Option 2: Changement avec code email -->
                <div class="tw-bg-blue-50 tw-rounded-lg tw-p-6">
                  <h4 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-4">
                    Changer le mot de passe avec code email
                  </h4>
                  <p class="tw-text-gray-600 tw-text-sm tw-mb-4">
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
                  <form v-else @submit.prevent="changePasswordWithCode" class="tw-space-y-4">
                    <div>
                      <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                        Code de vérification <span class="tw-text-red-500">*</span>
                      </label>
                      <input
                        v-model="codeForm.code"
                        type="text"
                        maxlength="6"
                        placeholder="123456"
                        class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:border-blue-500 tw-text-center tw-font-mono tw-text-lg tw-tracking-widest"
                        required
                      />
                    </div>

                    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                      <div>
                        <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                          Nouveau mot de passe <span class="tw-text-red-500">*</span>
                        </label>
                        <input
                          v-model="codeForm.password"
                          type="password"
                          class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:border-blue-500"
                          minlength="8"
                          required
                        />
                      </div>
                      
                      <div>
                        <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                          Confirmer le mot de passe <span class="tw-text-red-500">*</span>
                        </label>
                        <input
                          v-model="codeForm.password_confirmation"
                          type="password"
                          class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:border-blue-500"
                          minlength="8"
                          required
                        />
                      </div>
                    </div>

                    <div v-if="codeMessage" class="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-lg tw-p-3">
                      <p class="tw-text-blue-600 tw-text-sm">{{ codeMessage }}</p>
                    </div>

                    <div v-if="codeError" class="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-3">
                      <p class="tw-text-red-600 tw-text-sm">{{ codeError }}</p>
                    </div>

                    <div class="tw-flex tw-justify-between">
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
                        class="tw-px-6"
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