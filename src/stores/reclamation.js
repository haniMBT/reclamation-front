import { defineStore } from 'pinia'
import { api } from "boot/axios";
import { LocalStorage, SessionStorage } from 'quasar'

export const useReclamationStore = defineStore('reclamation', {

  state: () => ({
    id: LocalStorage.getItem('id') ?? false,
    objet: LocalStorage.getItem('objet') ?? false,
    contenu: LocalStorage.getItem('contenu') ?? null,
    user_id: LocalStorage.getItem('user_id') ?? null,
    statut: LocalStorage.getItem('statut') ?? null,
    date_creation: LocalStorage.getItem('date_creation') ?? null,
    date_traitement: LocalStorage.getItem('date_traitement') ?? null,
    reponse: LocalStorage.getItem('reponse') ?? null,
    traite_par: LocalStorage.getItem('traite_par') ?? null,
  }),

  getters: {
  },

  actions: {
    setProperty(name, val) {
        this[name] = val;
        (val && val != 'null')
          ? LocalStorage.set(name, val)
          : LocalStorage.remove(name)
      },
  }
})
