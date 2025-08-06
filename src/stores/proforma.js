import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useProformaStore = defineStore('proforma', {
  state: () => ({
    searchResult: null,
    calculationResult: null,
    loading: false,
    searchLoading: false,
    calculateLoading: false,
    errors: {},
    history: [],
    historyLoading: false
  }),

  getters: {
    hasSearchResult: (state) => !!state.searchResult,
    hasCalculationResult: (state) => !!state.calculationResult?.facture,
    isLoading: (state) => state.loading || state.searchLoading || state.calculateLoading,
    
    // Formatage des montants
    formattedTotalHT: (state) => {
      if (!state.calculationResult?.facture?.totalHT) return '0,00 DA'
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD',
      }).format(state.calculationResult.facture.totalHT)
    },
    
    formattedTVA: (state) => {
      if (!state.calculationResult?.facture?.tva) return '0,00 DA'
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD',
      }).format(state.calculationResult.facture.tva)
    },
    
    formattedTTC: (state) => {
      if (!state.calculationResult?.facture?.ttc) return '0,00 DA'
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD',
      }).format(state.calculationResult.facture.ttc)
    }
  },

  actions: {
    // Recherche BL et conteneur
    async searchProforma(searchData) {
      this.searchLoading = true
      this.errors = {}
      
      try {
        const response = await api.post('/api/proforma/search', searchData)
        
        if (response.data.status === 'success') {
          this.searchResult = response.data.data
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors de la recherche')
        }
      } catch (error) {
        this.errors = error.response?.data?.errors || {}
        if (error.response?.data?.message) {
          this.errors.general = [error.response.data.message]
        }
        throw error
      } finally {
        this.searchLoading = false
      }
    },

    // Calcul de la facture proforma
    async calculateProforma(calculationData) {
      this.calculateLoading = true
      this.errors = {}
      
      try {
        const response = await api.post('/api/proforma/calculate', calculationData)
        
        if (response.data.status === 'success') {
          this.calculationResult = response.data.data
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors du calcul')
        }
      } catch (error) {
        this.errors = error.response?.data?.errors || {}
        if (error.response?.data?.message) {
          this.errors.general = [error.response.data.message]
        }
        throw error
      } finally {
        this.calculateLoading = false
      }
    },

    // Récupérer l'historique
    async fetchHistory() {
      this.historyLoading = true
      
      try {
        const response = await api.get('/api/proforma/history')
        
        if (response.data.status === 'success') {
          this.history = response.data.data.data || []
          return response.data
        } else {
          throw new Error(response.data.message || 'Erreur lors de la récupération de l\'historique')
        }
      } catch (error) {
        console.error('Erreur historique:', error)
        throw error
      } finally {
        this.historyLoading = false
      }
    },

    // Reset des données
    resetSearch() {
      this.searchResult = null
      this.calculationResult = null
      this.errors = {}
    },

    resetCalculation() {
      this.calculationResult = null
      this.errors = {}
    },

    clearErrors() {
      this.errors = {}
    },

    // Formatage des montants pour l'affichage
    formatMontant(montant) {
      if (!montant) return '0,00 DA'
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD',
      }).format(montant)
    }
  }
})