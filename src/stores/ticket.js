import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

export const useTicketStore = defineStore('ticket', {

  state: () => ({
    t_rec_ticket_id: LocalStorage.getItem('t_rec_ticket_id') ?? null,
    b_rec_ticket_id: LocalStorage.getItem('b_rec_ticket_id') ?? null,
    ticketData: LocalStorage.getItem('ticketData') ?? null,
    isTicketCreated: LocalStorage.getItem('isTicketCreated') ?? false,
  }),

  getters: {
    hasTicket: (state) => {
      return state.t_rec_ticket_id !== null && state.b_rec_ticket_id !== null;
    },
    
    getTicketInfo: (state) => {
      return {
        t_rec_ticket_id: state.t_rec_ticket_id,
        b_rec_ticket_id: state.b_rec_ticket_id,
        ticketData: state.ticketData,
        isCreated: state.isTicketCreated
      };
    }
  },

  actions: {
    /**
     * Sauvegarde l'ID du ticket, l'ID de b_rec_tickets et les données envoyées
     * @param {Object} data - Les données de réponse de l'API
     */
    saveTicket(data) {
      try {
        // Extraire les données de la réponse API
        this.t_rec_ticket_id = data.t_rec_ticket_id;
        this.b_rec_ticket_id = data.b_rec_ticket_id;
        this.ticketData = data.ticket_data;
        this.isTicketCreated = true;

        // Persister dans LocalStorage
        LocalStorage.set('t_rec_ticket_id', this.t_rec_ticket_id);
        LocalStorage.set('b_rec_ticket_id', this.b_rec_ticket_id);
        LocalStorage.set('ticketData', this.ticketData);
        LocalStorage.set('isTicketCreated', this.isTicketCreated);

        console.log('Ticket sauvegardé:', {
          t_rec_ticket_id: this.t_rec_ticket_id,
          b_rec_ticket_id: this.b_rec_ticket_id,
          ticketData: this.ticketData
        });

        return { success: true };
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du ticket:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * Réinitialise les données locales et nettoie le LocalStorage
     */
    clearTicket() {
      try {
        // Réinitialiser les données du state
        this.t_rec_ticket_id = null;
        this.b_rec_ticket_id = null;
        this.ticketData = null;
        this.isTicketCreated = false;

        // Nettoyer le LocalStorage
        LocalStorage.remove('t_rec_ticket_id');
        LocalStorage.remove('b_rec_ticket_id');
        LocalStorage.remove('ticketData');
        LocalStorage.remove('isTicketCreated');

        console.log('Données du ticket nettoyées');
        return { success: true };
      } catch (error) {
        console.error('Erreur lors du nettoyage du ticket:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * Recharge les données depuis LocalStorage au démarrage
     */
    initializeFromStorage() {
      try {
        const t_rec_ticket_id = LocalStorage.getItem('t_rec_ticket_id');
        const b_rec_ticket_id = LocalStorage.getItem('b_rec_ticket_id');
        const ticketData = LocalStorage.getItem('ticketData');
        const isTicketCreated = LocalStorage.getItem('isTicketCreated');

        if (t_rec_ticket_id) {
          this.t_rec_ticket_id = t_rec_ticket_id;
        }
        if (b_rec_ticket_id) {
          this.b_rec_ticket_id = b_rec_ticket_id;
        }
        if (ticketData) {
          this.ticketData = ticketData;
        }
        if (isTicketCreated !== null) {
          this.isTicketCreated = isTicketCreated;
        }

        console.log('Données du ticket rechargées depuis LocalStorage:', {
          t_rec_ticket_id: this.t_rec_ticket_id,
          b_rec_ticket_id: this.b_rec_ticket_id,
          hasData: !!this.ticketData,
          isCreated: this.isTicketCreated
        });

        return { success: true };
      } catch (error) {
        console.error('Erreur lors du rechargement des données du ticket:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * Met à jour les données du ticket (utile pour les modifications)
     * @param {Object} newData - Nouvelles données à sauvegarder
     */
    updateTicketData(newData) {
      try {
        this.ticketData = { ...this.ticketData, ...newData };
        LocalStorage.set('ticketData', this.ticketData);
        
        console.log('Données du ticket mises à jour:', this.ticketData);
        return { success: true };
      } catch (error) {
        console.error('Erreur lors de la mise à jour des données du ticket:', error);
        return { success: false, error: error.message };
      }
    }
  }
});