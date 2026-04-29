import { defineStore } from 'pinia'
import {ref} from "vue";

export const useConstante =
  defineStore('constante', () => {

    const INFORMATIQUE = "informatique";
    const METIER = "metier";

    const EN_COUR = "en_cour";
    const TRAITE = "traite";
    const SOUMIS = "soumis";
    const FINI = "fini";
    const PUBLIE = "publie";

    const MODULES = [
      {label : "Veuillez choisir", value : ""},
      {label : "Document de référence", value : "Document_de_reference"},
      {label : "Corpus Normatif et Réglementaire", value : "Corpus_Normatif_et_Reglementaire"},
      {label : "Relation Client", value : "Relation_Client"},
      {label : "Affaire", value : "Affaire"},
      {label : "Planification", value : "Planification"},
      {label : "Dossier Technique", value : "Dossier_Technique"},
      {label : "Recevabilité", value : "Recevabilite"},
      {label : "Visite préliminaire", value : "Visite_preliminaire"},
      {label : "Analyse des risques", value : "Analyse_des_risques"},
      {label : "Livrable", value : "Livrable"},
      {label : "Archive", value : "Archive"},
      {label : "Essais", value : "Essais"},
      {label : "Assistance technique", value : "Assistance_technique"},
      {label : "Base de données techniques", value : "Base_de_donnees_techniques"},
      {label : "Gestion des utilisateurs", value : "Gestion_des_utilisateurs"},
    ];

    const TYPE_HELP_REQUEST_OPTIONS = [
      {label : "Veuillez choisir", value : ""},
      {label : "Informatique", value : INFORMATIQUE},
      {label : "Métier", value : METIER},
    ];

    const STATE_HELP_REQUEST_OPTIONS = [
      {label : "Veuillez choisir", value : ""},
      {label : 'En cours' , value: EN_COUR},
      {label : 'Traitées' , value: TRAITE},
      {label : 'Soumises' , value: SOUMIS},
      {label : 'Publiées' , value: PUBLIE},
    ];

    return {
      MODULES,
      STATE_HELP_REQUEST_OPTIONS,
      TYPE_HELP_REQUEST_OPTIONS,
      INFORMATIQUE,
      METIER,
      EN_COUR,
      TRAITE,
      SOUMIS,
      FINI,
      PUBLIE,
    };

  });
