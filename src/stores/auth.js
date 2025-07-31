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
      return state.userProfile?.photo || state.user?.photo || null;
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
                nom: res.data.user.Nom || '',
                prenom: res.data.user.Prenom || '',
                email: res.data.user.Email || '',
                photo: res.data.user.photo || null,
                fullName: `${res.data.user.Prenom || ''} ${res.data.user.Nom || ''}`.trim()
              }
              
              LocalStorage.set('isLoggedIn', true)
              LocalStorage.set('user', res.data.user)
              LocalStorage.set('userProfile', this.userProfile)
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
        
        // Mettre à jour les données locales
        this.userProfile = {
          nom: response.data.user.nom,
          prenom: response.data.user.prenom,
          email: response.data.user.email,
          photo: response.data.user.photo,
          fullName: `${response.data.user.prenom} ${response.data.user.nom}`.trim()
        };
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
    async changePassword(data) {
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

    // get privileges
    async getUser() {
      if (this.isLoggedIn)
      await api.get("/api/user")
      .then((res) => {
        this.user = res.data.user
        
        // Mettre à jour userProfile aussi
        this.userProfile = {
          nom: res.data.user.Nom || '',
          prenom: res.data.user.Prenom || '',
          email: res.data.user.Email || '',
          photo: res.data.user.photo || null,
          fullName: `${res.data.user.Prenom || ''} ${res.data.user.Nom || ''}`.trim()
        }
        
        LocalStorage.set('user', res.data.user)
        LocalStorage.set('userProfile', this.userProfile)
      });
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
  }
})
