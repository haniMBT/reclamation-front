import { defineStore } from 'pinia'
import { api } from '../boot/axios'
const API_BASE_URL = process.env.API_BASE_URL
export const useEpaymentStore = defineStore('epayment', {
  state: () => ({
    factures: [],
    currentFacture: null,
    stats: null,
    loading: false
  }),

  getters: {
    isLoading: (state) => state.loading,
    facturesList: (state) => state.factures,
    currentFactureData: (state) => state.currentFacture,
    facturesStats: (state) => state.stats
  },

  actions: {
    // ***** Gestion des factures *****
    
    /**
     * Récupérer la liste des factures
     */
    async getFactures(params = {}) {
      this.loading = true
      try {
        const response = await api.get('api/epayment/factures', { params })
        
        if (response.data.success) {
          this.factures = response.data.data.data
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Erreur lors du chargement des factures')
        }
      } catch (error) {
        console.error('Erreur getFactures:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Récupérer une facture spécifique
     */
    async getFacture(id) {
      this.loading = true
      try {
        const response = await api.get(`api/epayment/factures/${id}`)
        
        if (response.data.success) {
          this.currentFacture = response.data.data
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Facture non trouvée')
        }
      } catch (error) {
        console.error('Erreur getFacture:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Récupérer les statistiques des factures
     */
    async getFacturesStats() {
      try {
        const response = await api.get('api/epayment/facturesStats')
        
        if (response.data.success) {
          this.stats = response.data.data
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Erreur lors du calcul des statistiques')
        }
      } catch (error) {
        console.error('Erreur getFacturesStats:', error)
        throw error
      }
    },

    // ***** Gestion des paiements *****

    /**
     * Initier un processus de paiement
     */
    async processPayment(factureId, data, Email) {
      this.loading = true
      try {
        // Créer un formulaire pour soumettre en POST vers la route web
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = `${API_BASE_URL}/payment/process/${factureId}/${Email}`
        
        // Ajouter le token CSRF (si disponible)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        if (csrfToken) {
          const csrfInput = document.createElement('input')
          csrfInput.type = 'hidden'
          csrfInput.name = '_token'
          csrfInput.value = csrfToken
          form.appendChild(csrfInput)
        }
        
        // Ajouter les données du formulaire
        Object.keys(data).forEach(key => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = data[key]
          form.appendChild(input)
        })
        
        document.body.appendChild(form)
        form.submit()
        
        return { success: true }
      } catch (error) {
        console.error('Erreur processPayment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Traiter le succès de paiement
     */
    async processPaymentSuccess(factureId, params) {
      try {
        // Construire l'URL avec les paramètres
        const urlParams = new URLSearchParams(params)
        const url = `/payment/success/${factureId}?${urlParams.toString()}`
        
        // Rediriger vers la page de succès Blade
        window.location.href = url
        
        return { success: true }
      } catch (error) {
        console.error('Erreur processPaymentSuccess:', error)
        throw error
      }
    },

    /**
     * Traiter l'échec de paiement
     */
    async processPaymentFailure(factureId, params) {
      try {
        // Construire l'URL avec les paramètres
        const urlParams = new URLSearchParams(params)
        const url = `/payment/failure/${factureId}?${urlParams.toString()}`
        
        // Rediriger vers la page d'échec Blade
        window.location.href = url
        
        return { success: true }
      } catch (error) {
        console.error('Erreur processPaymentFailure:', error)
        throw error
      }
    },

    /**
     * Récupérer un reçu de paiement
     */
    async getReceipt(recuId) {
      try {
        // Rediriger vers la page de reçu Blade
        window.location.href = `/receipt/${recuId}`
        
        return { success: true }
      } catch (error) {
        console.error('Erreur getReceipt:', error)
        throw error
      }
    },

    /**
     * Télécharger un reçu PDF
     */
    async downloadReceipt(recuId) {
      try {
        // Créer un lien de téléchargement direct vers la route web
        const link = document.createElement('a')
        link.href = `/receipt/${recuId}/download`
        link.setAttribute('download', `recu_paiement_${recuId}.pdf`)
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        link.remove()
        
        return true
      } catch (error) {
        console.error('Erreur downloadReceipt:', error)
        throw error
      }
    },

    /**
     * Envoyer un reçu par email
     */
    async sendReceiptByEmail(recuId, email) {
      try {
        const response = await api.post(`api/epayment/receipt/${recuId}/send-email`, { email })
        
        if (response.data.success) {
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors de l\'envoi')
        }
      } catch (error) {
        console.error('Erreur sendReceiptByEmail:', error)
        throw error
      }
    },

    // ***** Fonctionnalités pour invités *****

    /**
     * Rechercher une facture (invité)
     */
    async searchFactureGuest(facnum, domcod) {
      this.loading = true
      try {
        const response = await api.post('api/epayment/guest/search', {
          facnum,
          domcod
        })
        
        if (response.data.success) {
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Facture non trouvée')
        }
      } catch (error) {
        console.error('Erreur searchFactureGuest:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ***** Actions locales *****

    /**
     * Réinitialiser l'état
     */
    resetState() {
      this.factures = []
      this.currentFacture = null
      this.stats = null
      this.loading = false
    },

    /**
     * Mettre à jour une facture dans la liste
     */
    updateFactureInList(updatedFacture) {
      const index = this.factures.findIndex(f => f.id === updatedFacture.id)
      if (index !== -1) {
        this.factures[index] = updatedFacture
      }
    }
  }
})