import { defineStore } from 'pinia'
import { api } from "boot/axios";
import { LocalStorage, SessionStorage } from 'quasar'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    isLoggedIn: LocalStorage.getItem('isLoggedIn') ?? false,
    access_token: LocalStorage.getItem('access_token') ?? null,
    user: LocalStorage.getItem('user') ?? {},
    loginErrors: false,
    changePassword: LocalStorage.getItem('changePassword'),
    profile: LocalStorage.getItem('profile'),
    // Nouvelles données utilisateur
    userProfile: LocalStorage.getItem('userProfile') ?? {
      nom: '',
      prenom: '',
      email: '',
      photo: null,
      fullName: ''
    },
    volet: (LocalStorage.getItem('volet') != null && LocalStorage.getItem('volet') != 'null') ? LocalStorage.getItem('volet') : null,
    privileges: LocalStorage.getItem('privileges') ?? {},
    dr_id: (LocalStorage.getItem('dr_id') != null && LocalStorage.getItem('dr_id') != 'null') ? LocalStorage.getItem('dr_id') : null,
    dr_name: (LocalStorage.getItem('str_name') != null && LocalStorage.getItem('str_name') != 'null') ? LocalStorage.getItem('str_name') : null,
    directions: LocalStorage.getItem('directions') ?? [],
    selectedDirection: (LocalStorage.getItem('selectedDirection') != null && LocalStorage.getItem('selectedDirection') != 'null') ? LocalStorage.getItem('selectedDirection') : null,

  }),

  getters: {
    // Getters pour les données utilisateur
    getUserFullName: (state) => {
      console.log('Données utilisateur:', state.user);

      // Si les données sont dans userProfile, les utiliser
      if (state.userProfile?.fullName && state.userProfile?.fullName.trim() !== '') {
        return state.userProfile.fullName;
      }

      // Sinon, construire depuis les données user
      if (state.user?.Prenom && state.user?.Nom) {
        return `${state.user.Prenom} ${state.user.Nom}`;
      }

      // Fallback pour d'autres formats possibles
      if (state.user?.prenom && state.user?.nom) {
        return `${state.user.prenom} ${state.user.nom}`;
      }

      return 'Utilisateur';
    },

    getUserPhoto: (state) => {
      const photo = state.userProfile?.photo || state.user?.photo;
      if (photo) {
        // Si la photo contient déjà une URL complète, la retourner telle quelle
        if (photo.startsWith('http')) {
          return photo;
        }
        // Sinon, construire l'URL complète vers le backend
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
        return `${baseUrl}/storage/photos/${photo}`;
      }
      return null;
    },

    getUserEmail: (state) => {
      return state.userProfile?.email || state.user?.Email || state.user?.email || '';
    },
  },

  actions: {
    async login(credentials) {
      await api.post("/api/login", credentials)
        .then(async (res) => {

          this.changePassword =  res.data.message
          LocalStorage.set('changePassword', res.data.message)
          this.access_token = res.data.access_token
          LocalStorage.set('access_token',this.access_token)
          this.loginErrors = false
          // Récupérer les informations utilisateur complètes depuis l'API
          await api.get("/api/user")
            .then((res) => {
              this.isLoggedIn = true
              this.user = res.data.user
              console.log('abdouabdou', res.data);

              // Stocker les nouvelles données utilisateur
              this.userProfile = {
                id: res.data.user.id || '',
                nom: res.data.user.Nom || '',
                prenom: res.data.user.Prenom || '',
                email: res.data.user.Email || '',
                photo: res.data.user.photo || null,
                fullName: `${res.data.user.Prenom || ''} ${res.data.user.Nom || ''}`.trim()
              }
              this.profile = res.data.profile
              this.dr_id = res.data.dr_id
              this.dr_name = res.data.dr_name
              this.selectedDirection = res.data.selectedDirection
              this.dr_name = res.data.dr_name

              LocalStorage.set('isLoggedIn', true)
              LocalStorage.set('user', res.data.user)
              LocalStorage.set('userProfile', this.userProfile)

              LocalStorage.set('dr_id', res.data.dr_id)
              LocalStorage.set('dr_name', res.data.dr_name)
              LocalStorage.set('profile', res.data.profile)
              LocalStorage.set('selectedDirection', res.data.selectedDirection)
            })
        })
        .catch(error => {
          this.loginErrors = true
        })
    },
    // LOGOUT
    async logout() {
      await api.post("/api/logout",this.access_token);
      localStorage.clear();
      this.isLoggedIn = null
      this.user = {}
      this.userProfile = {
        nom: '',
        prenom: '',
        email: '',
        photo: null,
        fullName: ''
      }



      LocalStorage.clear()
    },

    // GESTION PROFIL - Mot de passe oublié
    async forgotPassword(email) {
      try {
        const response = await api.post("/api/forgot-password", { email });
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors de l\'envoi du code'
        };
      }
    },

    // GESTION PROFIL - Réinitialiser mot de passe avec code
    async resetPassword(data) {
      try {
        const response = await api.post("/api/reset-password", data);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors de la réinitialisation'
        };
      }
    },

    // GESTION PROFIL - Mettre à jour le profil utilisateur
    async updateProfile(formData) {
      try {
        const response = await api.post("/api/profile/update", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Mettre à jour les données locales - IMPORTANT: synchroniser user ET userProfile
        this.user = {
          ...this.user,  // Conserver les données existantes
          Nom: response.data.user.nom,
          Prenom: response.data.user.prenom,
          Email: response.data.user.email || this.user.Email,  // Préserver l'email si absent
          photo: response.data.user.photo
        };

        this.userProfile = {
          nom: response.data.user.nom,
          prenom: response.data.user.prenom,
          email: response.data.user.email || this.user.Email,  // Préserver l'email si absent
          photo: response.data.user.photo,
          fullName: `${response.data.user.prenom} ${response.data.user.nom}`.trim()
        };

        // Sauvegarder les deux structures
        LocalStorage.set('user', this.user);
        LocalStorage.set('userProfile', this.userProfile);

        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors de la mise à jour'
        };
      }
    },

    // GESTION PROFIL - Changer mot de passe (méthode classique)
    async changePasswordd(data) {
      try {
        const response = await api.post("/api/profile/change-password", data);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
        };
      }
    },

    // GESTION PROFIL - Demander code pour changer mot de passe
    async requestPasswordChangeCode() {
      try {
        const response = await api.post("/api/profile/request-password-change-code");
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors de l\'envoi du code'
        };
      }
    },

    // GESTION PROFIL - Changer mot de passe avec code email
    async changePasswordWithCode(data) {
      try {
        const response = await api.post("/api/profile/change-password-with-code", data);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
        };
      }
    },

    // Récupérer les informations utilisateur complètes
    async getUser() {
      if (!this.isLoggedIn || !this.access_token) return;

      try {
        const response = await api.get("/api/user");

        // Synchroniser les deux structures de données
        this.user = response.data.user;

        this.userProfile = {
          nom: response.data.user.Nom || '',
          prenom: response.data.user.Prenom || '',
          email: response.data.user.Email || '',
          photo: response.data.user.photo || null,
          fullName: `${response.data.user.Prenom || ''} ${response.data.user.Nom || ''}`.trim()
        };

        this.dr_id = res.data.dr_id
        this.dr_name = res.data.dr_name
        this.selectedDirection = res.data.selectedDirection

        // Sauvegarder dans localStorage
        LocalStorage.set('user', this.user);
        LocalStorage.set('userProfile', this.userProfile);

        LocalStorage.set('dr_id', res.data.dr_id)
        LocalStorage.set('dr_name', res.data.dr_name)
        LocalStorage.set('selectedDirection', res.data.selectedDirection)

        return { success: true, data: response.data };
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        return { success: false, error: error.response?.data?.message || 'Erreur de récupération' };
      }
    },

    // get privileges
    async getPrivileges() {
      if (this.isLoggedIn)
        await api
          .post('/api/privileges', {
            volet: this.volet
          })
          .then((res) => {
            this.privileges = res.data?.privileges
            this.dr_id = res.data.data.dr_id
            this.dr_name = res.data.data.dr_name
            this.selectedDirection = res.data.data.selectedDirection

            LocalStorage.set('privileges', this.privileges)
            LocalStorage.set('dr_id', res.data.data.dr_id)
            LocalStorage.set('dr_name', res.data.data.dr_name)
            LocalStorage.set('selectedDirection', res.data.data.selectedDirection)
          })
    },

    async getPrivilegesPerVolet(volet) {
      let privileges
      if (this.isLoggedIn)
        await api
          .post('/api/privileges', {
            volet: volet,
          })
          .then((res) => {
            privileges = res.data?.privileges
          })
      return privileges
    },

    async getAllPrivileges() {
      let privileges
      if (this.isLoggedIn)
        await api
          .post('/api/allPrivileges')
          .then((res) => {
            privileges = res.data;
          })
          return privileges
    },

    // get directions
    async getDirections() {
      if (this.isLoggedIn)
        await api
          .post('/api/directions', {
            volet: this.volet
          })
          .then((res) => {
            this.directions = res.data?.directions?.map(item => item.DIRECTION)
            LocalStorage.set('directions', this.directions)
          })
    },

    // Initialiser l'AuthStore depuis localStorage
    initializeFromStorage() {
      this.isLoggedIn = LocalStorage.getItem('isLoggedIn') ?? false
      this.access_token = LocalStorage.getItem('access_token') ?? null
      this.user = LocalStorage.getItem('user') ?? {}
      this.userProfile = LocalStorage.getItem('userProfile') ?? {
        nom: '',
        prenom: '',
        email: '',
        photo: null,
        fullName: ''
      }
      this.changePassword = LocalStorage.getItem('changePassword')
      this.profile = LocalStorage.getItem('profile')

      // Si l'utilisateur est connecté mais que userProfile est vide, le reconstruire
      if (this.isLoggedIn && this.user && Object.keys(this.user).length > 0 && !this.userProfile.fullName) {
        this.userProfile = {
          nom: this.user.Nom || '',
          prenom: this.user.Prenom || '',
          email: this.user.Email || '',
          photo: this.user.photo || null,
          fullName: `${this.user.Prenom || ''} ${this.user.Nom || ''}`.trim()
        }
        LocalStorage.set('userProfile', this.userProfile)
      }
    },
      setProperty(name, val) {
      this[name] = val;
      (val && val != 'null')
        ? LocalStorage.set(name, val)
        : LocalStorage.remove(name)
    },
  }
})
