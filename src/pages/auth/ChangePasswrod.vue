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
import { LocalStorage } from 'quasar'

const visible = ref(false);

const metaData = {
  title: "Contrôle Technique",
};
useMeta(metaData);

onBeforeMount(async () => {
  // visible.value = true;
  // await api.post("/api/allPrivileges").then((res) => {
  //   privileges.value = res.data;
  // }) .catch((errors) => {
  //   visible.value = false;
  //   });

  // if (authStore.isLoggedIn != null && privileges.value != "Unauthenticated.") {
  //   router.push("/");
  // }
  // localStorage.clear();
  // visible.value = false;
});

const authStore = useAuthStore();
const router = useRouter();
const privileges = ref('Unauthenticated.');

let form = reactive({
  new_password: null,
  new_password_confirmation: null,
});

let message = ref();
let showPassword = ref(false);
let showConfirmePassword = ref(false);
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
  // Prepare the data to be sent
  const data = {
    new_password: form.new_password,
    new_password_confirmation: form.new_password_confirmation,
  };
  await api
    .post("/api/new_password", data)
    .then(async (response) => {
      authStore.setProperty('changePassword','')
      authStore.logout()
      router.push("/");
      // message.value = response.data.message;
      // // Handle the response from the Laravel controller
      // $q.notify({
      //   type: "positive",
      //   message: message.value,
      // });
      // myerrors.value = null;
     
    })
    .catch((errors) => {
     
      if (errors.response && errors.response.status === 422) {
        //errors.value = Object.values(errors.response.data.errors).flat();
        console.log(errors.response.data.errors);
        myErrors.value = errors.response.data.errors;
      }
      // Handle any errors that occur during the request
    });

};
</script>



<template>
  <div class="tw-flex tw-h-screen">
    <div class="tw-flex tw-flex-col tw-w-full tw-items-center tw-justify-center">
      <div class="tw-grow-1"></div>
      <form class="tw-w-1/2" @submit.prevent="handleLogin">
        <div class="tw-mb-12">
          <h1 class="tw-text-red-600 tw-font-black tw-text-2xl text-center">
            Vous devez changer votre mot de passe
          </h1>
          <!-- <div class="tw-mt-2 tw-text-xs tw-text-blue-login-410">
            Entrez votre matricule et mot de passe pour se connecter!
          </div> -->
        </div>

        <div>
          <InputLabel for="matricule" value="Nouveau mot de passe">
            <span class="tw-text-blue-login-430">*</span>
          </InputLabel>
          <TextInput id="password" show-password="logMessage" placeholder="Mot de passe.."
            :type="showPassword ? 'text' : 'password'" class="tw-mt-1 tw-rounded-lg tw-block tw-w-full"
            v-model="form.new_password" required>
            <button class="tw-mx-2" type="button" @click="showPassword = !showPassword">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="tw-w-5 tw-h-5 tw-text-blue-login-410">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="tw-w-5 tw-h-5 tw-text-blue-login-410">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </TextInput>
        </div>

        <div class="tw-mt-4">
          <InputLabel for="password" value="Retapez nouveau mot de passe">
            <span class="tw-text-blue-login-430">*</span>
          </InputLabel>
          <TextInput id="password" show-password="logMessage" placeholder="Mot de passe.."
            :type="showConfirmePassword ? 'text' : 'password'" class="tw-mt-1 tw-rounded-lg tw-block tw-w-full"
            v-model="form.new_password_confirmation" required>
            <button class="tw-mx-2" type="button" @click="showConfirmePassword = !showConfirmePassword">
              <svg v-if="showConfirmePassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="tw-w-5 tw-h-5 tw-text-blue-login-410">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="tw-w-5 tw-h-5 tw-text-blue-login-410">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </TextInput>
        </div>

        <InputError v-if="myErrors" class="tw-mt-4" :message="myErrors.new_password[0]" />
        <InputError v-if="form.new_password == '123456'|| form.new_password_confirmation == '123456'" class="tw-mt-4" message="Vous devez changer votre mot de passe" />

        <div class="tw-w-full tw-items-center tw-mt-12" v-if="form.new_password != '123456'&& form.new_password_confirmation != '123456'">
          <PrimaryButton class="tw-w-full tw-py-3 tw-rounded-lgg tw-justify-center"
            :class="{ 'tw-opacity-25': form.processing }" :disabled="submiting">
            <svg v-if="submiting" class="tw-animate-spin -tw-ml-1 tw-mr-3 tw-h-5 tw-w-5 tw-text-white"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="tw-opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ submiting ? "Chargement.." : "Changer le mot de passe" }}
          </PrimaryButton>
        </div>
      </form>
      <div class="tw-grow-2 tw-flex tw-flex-col tw-justify-end tw-mb-4">
        <label class="tw-text-xs">
          © {{ currentYear }} EPAL - Entreprise Portuaire d'Alger. Tous droits réservés.</label>
      </div>
    </div>
    <!-- <div
      class="tw-flex tw-flex-col tw-justify-center tw-w-1/2 tw-bg-purple-900 tw-items-center tw-rounded-bl-large tw-bg-[url('loginBG.png')] tw-bg-cover tw-bg-no-repeat">
      <div class="tw-grow-1"></div>

      <img class="tw-flex-none tw-scale-50 tw-h-1/2" src="/logo epal.png" alt="Logo EPAL" />
      <div class="tw-grow-3">
        <div class="tw-flex tw-flex-col tw-items-center tw-text-white tw-border tw-rounded-medium tw-px-24 tw-py-6">
          <label class="tw-text-xs">En savoir plus sur EPAL</label>
          <a href="https://epal.dz/" class="tw-justify-center tw-font-black tw-text-xl">
            EPAL.DZ
          </a>
        </div>
        <div class="tw-flex tw-flex-col tw-items-center tw-text-white tw-px-24 tw-py-6">
          <a href="/acceuil"><q-btn class="tw-ml-6 tw-mt-8" outline icon="home" color="" label="Accueil"
              @click="acceuil" />
          </a>
        </div>
      </div>
    </div> -->
  </div>
  <q-inner-loading :showing="visible" label-class="text-teal" label-style="font-size: 1.1em" color="purple" />
</template>
