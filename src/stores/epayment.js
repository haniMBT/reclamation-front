import { defineStore } from 'pinia'
import { api } from '../boot/axios'

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
    async processPayment(factureId, data) {
      this.loading = true
      try {
        const response = await api.post(`api/epayment/payment/process/${factureId}`, data)
        
        if (response.data.success) {
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors du traitement du paiement')
        }
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
      this.loading = true
      try {
        const response = await api.get(`api/epayment/payment/success/${factureId}`, { params })
        
        if (response.data.success) {
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors de la validation du paiement')
        }
      } catch (error) {
        console.error('Erreur processPaymentSuccess:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Traiter l'échec de paiement
     */
    async processPaymentFailure(factureId, params) {
      this.loading = true
      try {
        const response = await api.get(`api/epayment/payment/failure/${factureId}`, { params })
        return response.data
      } catch (error) {
        console.error('Erreur processPaymentFailure:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Récupérer un reçu de paiement
     */
    async getReceipt(recuId) {
      try {
        const response = await api.get(`api/epayment/receipt/${recuId}`)
        
        if (response.data.success) {
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Reçu non trouvé')
        }
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
        const response = await api.get(`api/epayment/receipt/${recuId}/download`, {
          responseType: 'blob'
        })
        
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `recu_paiement_${recuId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
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

    /**
     * Initier un paiement (invité)
     */
    async processGuestPayment(factureId, data) {
      this.loading = true
      try {
        const response = await api.post(`api/epayment/guest/payment/process/${factureId}`, data)
        
        if (response.data.success) {
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors du traitement du paiement')
        }
      } catch (error) {
        console.error('Erreur processGuestPayment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Traiter le succès de paiement (invité)
     */
    async processGuestPaymentSuccess(factureId, params) {
      this.loading = true
      try {
        const response = await api.get(`api/epayment/guest/payment/success/${factureId}`, { params })
        
        if (response.data.success) {
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors de la validation du paiement')
        }
      } catch (error) {
        console.error('Erreur processGuestPaymentSuccess:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Traiter l'échec de paiement (invité)
     */
    async processGuestPaymentFailure(factureId, params) {
      this.loading = true
      try {
        const response = await api.get(`api/epayment/guest/payment/failure/${factureId}`, { params })
        return response.data
      } catch (error) {
        console.error('Erreur processGuestPaymentFailure:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Récupérer un reçu (invité)
     */
    async getGuestReceipt(id) {
      try {
        const response = await api.get(`api/epayment/guest/receipt/${id}`)
        
        if (response.data.success) {
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Reçu non trouvé')
        }
      } catch (error) {
        console.error('Erreur getGuestReceipt:', error)
        throw error
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