<template>
  <q-page class="q-pa-md bg-gray-50 min-h-screen">
    <!-- Interface utilisateur principale -->
    <div
      class="proforma-header bg-gradient-to-r from-white via-blue-50 to-blue-600 q-pa-lg rounded-xl shadow-lg mb-6"
    >
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center">
          <q-img src="/logo-epal.png" class="w-16 h-16 mr-4" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              Facture Proforma EPAL
            </h1>
            <p class="text-sm text-gray-600">
              Rechercher et calculer votre proforma
            </p>
          </div>
        </div>
        <q-btn
          v-if="proformaStore.hasCalculationResult"
          @click="downloadPdf"
          label="Télécharger PDF"
          color="purple-6"
          icon="picture_as_pdf"
          outline
          :loading="pdfLoading"
        />
      </div>
    </div>

    <!-- Formulaire de recherche -->
    <q-card class="mb-6 border-l-4 border-blue-600" flat bordered>
      <q-card-section>
        <div class="flex items-center mb-4">
          <q-icon name="search" size="md" class="text-blue-600 mr-2" />
          <h2 class="text-lg font-semibold text-gray-800">
            Recherche BL et Conteneur
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <q-input
            v-model="searchForm.bl"
            label="BL"
            outlined
            color="blue-6"
            :error="!!proformaStore.errors.bl"
            :error-message="proformaStore.errors.bl?.[0]"
            @keyup.enter="search"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>

          <q-input
            v-model="searchForm.conteneur"
            label="N° Conteneur"
            outlined
            color="blue-6"
            :error="!!proformaStore.errors.conteneur"
            :error-message="proformaStore.errors.conteneur?.[0]"
            @keyup.enter="search"
          >
            <template v-slot:prepend>
              <q-icon name="inventory_2" />
            </template>
          </q-input>
        </div>

        <q-banner
          v-if="proformaStore.errors.both || proformaStore.errors.general"
          class="text-red bg-red-1 mb-4"
          rounded
        >
          {{
            proformaStore.errors.both?.[0] || proformaStore.errors.general?.[0]
          }}
        </q-banner>

        <q-btn
          @click="search"
          label="Chercher"
          color="blue-6"
          icon="search"
          class="w-full"
          :loading="proformaStore.searchLoading"
          :disable="!searchForm.bl || !searchForm.conteneur"
          unelevated
        />
      </q-card-section>
    </q-card>

    <!-- Résultats de recherche -->
    <q-card
      v-if="proformaStore.hasSearchResult"
      class="mb-6 border-l-4 border-green-500"
      flat
      bordered
    >
      <q-card-section>
        <div class="flex items-center mb-4">
          <q-icon name="info" size="md" class="text-green-600 mr-2" />
          <h3 class="text-lg font-semibold text-gray-800">
            Informations de l'escale
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Numéro d'escale</p>
            <p class="font-semibold text-gray-800">
              {{ proformaStore.searchResult.escale }}
            </p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Navire</p>
            <p class="font-semibold text-gray-800">
              {{ proformaStore.searchResult.navire }}
            </p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Date de livraison</p>
            <p class="font-semibold text-gray-800">
              {{ formatDate(proformaStore.searchResult.date) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <q-input
            :model-value="proformaStore.searchResult.c20p"
            label="Nombre de conteneurs 20 pieds"
            outlined
            readonly
            class="bg-gray-50"
          >
            <template v-slot:prepend>
              <q-icon name="widgets" />
            </template>
          </q-input>

          <q-input
            :model-value="proformaStore.searchResult.c40p"
            label="Nombre de conteneurs 40 pieds"
            outlined
            readonly
            class="bg-gray-50"
          >
            <template v-slot:prepend>
              <q-icon name="widgets" />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>

    <!-- Formulaire de calcul -->
    <q-card
      v-if="proformaStore.hasSearchResult"
      class="mb-6 border-l-4 border-orange-500"
      flat
      bordered
    >
      <q-card-section>
        <div class="flex items-center mb-4">
          <q-icon name="calculate" size="md" class="text-orange-600 mr-2" />
          <h3 class="text-lg font-semibold text-gray-800">
            Calcul de la proforma
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <q-input
            v-model="calculationForm.dateFin"
            label="Date de livraison prévisionnelle"
            type="date"
            outlined
            color="orange-6"
            :error="!!proformaStore.errors.dateFin"
            :error-message="proformaStore.errors.dateFin?.[0]"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <div class="flex flex-col gap-2">
            <q-checkbox
              v-model="calculationForm.visite"
              label="Avec visite"
              color="orange-6"
              @update:model-value="onVisiteChange"
            />
            <q-checkbox
              v-model="calculationForm.scan"
              label="Avec scanner"
              color="orange-6"
              :disable="calculationForm.visite"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <q-input
            v-model.number="calculationForm.nbc20PV"
            label="Nombre de conteneurs 20p visités"
            type="number"
            :min="0"
            :max="proformaStore.searchResult.c20p"
            outlined
            color="orange-6"
            :error="!!proformaStore.errors.nbc20PV"
            :error-message="proformaStore.errors.nbc20PV?.[0]"
          >
            <template v-slot:prepend>
              <q-icon name="inventory" />
            </template>
          </q-input>

          <q-input
            v-model.number="calculationForm.nbc40PV"
            label="Nombre de conteneurs 40p visités"
            type="number"
            :min="0"
            :max="proformaStore.searchResult.c40p"
            outlined
            color="orange-6"
            :error="!!proformaStore.errors.nbc40PV"
            :error-message="proformaStore.errors.nbc40PV?.[0]"
          >
            <template v-slot:prepend>
              <q-icon name="inventory" />
            </template>
          </q-input>
        </div>

        <q-btn
          @click="calculate"
          label="Calculer la proforma"
          color="orange-6"
          icon="calculate"
          class="w-full"
          :loading="proformaStore.calculateLoading"
          :disable="!isCalculationFormValid"
          unelevated
        />
      </q-card-section>
    </q-card>

    <!-- Résultats du calcul -->
    <q-card
      v-if="proformaStore.hasCalculationResult"
      class="mb-6 border-l-4 border-purple-500"
      flat
      bordered
    >
      <q-card-section>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="receipt" size="md" class="text-purple-600 mr-2" />
            <h3 class="text-lg font-semibold text-gray-800">
              Détail de la facture
            </h3>
          </div>
          <q-btn
            @click="downloadPdf"
            label="Télécharger PDF"
            color="purple-6"
            icon="picture_as_pdf"
            outline
            :loading="pdfLoading"
          />
        </div>

        <div class="overflow-x-auto">
          <q-table
            :rows="proformaStore.calculationResult.facture.details"
            :columns="tableColumns"
            row-key="prscod"
            flat
            bordered
            class="proforma-table"
          >
            <template v-slot:body-cell-pu="props">
              <q-td :props="props">
                {{ proformaStore.formatMontant(props.value) }}
              </q-td>
            </template>
            <template v-slot:body-cell-montant="props">
              <q-td :props="props" class="font-semibold">
                {{ proformaStore.formatMontant(props.value) }}
              </q-td>
            </template>
          </q-table>
        </div>

        <div class="mt-6 bg-gray-50 p-4 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div></div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Frais d'impression:</span>
                <span class="font-semibold">100,00 DA</span>
              </div>
              <div class="flex justify-between">
                <span>Total HT:</span>
                <span class="font-semibold">{{
                  proformaStore.formattedTotalHT
                }}</span>
              </div>
              <div class="flex justify-between">
                <span>TVA (19%):</span>
                <span class="font-semibold">{{
                  proformaStore.formattedTVA
                }}</span>
              </div>
              <div
                class="flex justify-between bg-blue-600 text-white p-3 rounded-lg"
              >
                <span class="font-bold">Montant TTC:</span>
                <span class="font-bold text-xl">{{
                  proformaStore.formattedTTC
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Conditions générales -->
    <q-card class="border-l-4 border-gray-400" flat bordered>
      <q-card-section>
        <h3 class="text-lg font-semibold text-gray-800 mb-3">
          Conditions générales
        </h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          La présente facture proforma est émise à titre informatif et ne
          constitue pas une facture définitive. Elle permet d'estimer les frais
          portuaires liés à l'opération de manutention, de stockage, ou toute
          autre prestation demandée.
        </p>
      </q-card-section>
    </q-card>

    <!-- Contenu PDF temporaire (caché) -->
    <div
      v-if="proformaStore.hasCalculationResult"
      id="pdf-content"
      class="pdf-source"
      style="position: absolute; left: -9999px; top: -9999px"
    >
      <div class="pdf-page">
        <div class="pdf-header">
          <img src="/entete.png" alt="En-tête EPAL" class="header-image" />
        </div>

        <h1>Facture proforma</h1>

        <p class="client-info">
          Facture proforma établie au nom de (Madame / Monsieur)
          <span class="client-name">{{ authStore.getUserFullName }}</span>
          le
          {{
            formatDateTime(
              proformaStore?.calculationResult?.historique?.created_at
            )
          }}
        </p>

        <div id="info">
          <div class="info-column">
            <p><span>BL: </span>{{ proformaStore?.searchResult?.bl }}</p>
            <p>
              <span>N° Conteneur: </span
              >{{ proformaStore?.searchResult?.conteneur }}
            </p>
            <p>
              <span>Numéro d'escale: </span
              >{{ proformaStore?.searchResult?.escale }}
            </p>
            <p>
              <span>Navire: </span>{{ proformaStore?.searchResult?.navire }}
            </p>
          </div>
          <div class="info-column">
            <p>
              <span>Date de livraison: </span
              >{{ formatDate(proformaStore?.searchResult?.date) }}
            </p>
            <p><span>Nombre: </span>{{ nbrCont }}</p>
            <p>
              <span>Date livraison prévisionnelle: </span
              >{{ formatDate(datePrevisionnelle) }}
            </p>
            <p>
              <span>Visite: </span>{{ visite ? "Oui" : "Non" }}
              <span style="margin-right: 32px"></span>
              <span>Scanner: </span>{{ scanner ? "Oui" : "Non" }}
            </p>
          </div>
        </div>

        <div class="invoice-details">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Libellé prestation</th>
                <th>Durée</th>
                <th>Qte</th>
                <th>P.U</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(pre, index) in proformaStore.calculationResult.facture
                  .details"
                :key="index"
              >
                <td>{{ pre.prscod }}</td>
                <td>{{ pre.libelle }}</td>
                <td>{{ pre.duree }}</td>
                <td>{{ pre.quantite }}</td>
                <td>{{ formatter.format(pre.pu) }}</td>
                <td>{{ formatter.format(pre.montant) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section-imp">
            <div class="total-section">
              <p class="breakdown">
                <span>Frais imp:</span> 100,00 DA <br />
                <span>HT:</span>
                {{
                  formatter.format(
                    proformaStore.calculationResult.facture.totalHT
                  )
                }}
                <br />
                <span>TVA:</span>
                {{
                  formatter.format(proformaStore.calculationResult.facture.tva)
                }}
              </p>
              <div class="total-box">
                Montant TTC:
                {{
                  formatter.format(proformaStore.calculationResult.facture.ttc)
                }}
              </div>
            </div>
          </div>

          <div class="condition">
            La présente facture proforma est émise à titre informatif et ne
            constitue pas une facture définitive. Elle permet d'estimer les
            frais portuaires liés à l'opération de manutention, de stockage, ou
            toute autre prestation demandée.
          </div>
        </div>
      </div>
    </div>

    <q-inner-loading :showing="proformaStore.isLoading" color="blue-6" />
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useProformaStore } from "stores/proforma";
import { useAuthStore } from "stores/auth";
import { useQuasar } from "quasar";
import html2pdf from "html2pdf.js";

const $q = useQuasar();
const proformaStore = useProformaStore();
const authStore = useAuthStore();

const pdfLoading = ref(false);

// Formulaires
const searchForm = reactive({
  bl: "",
  conteneur: "",
});

const calculationForm = reactive({
  dateFin: new Date().toISOString().split("T")[0],
  scan: false,
  visite: false,
  nbc20PV: 0,
  nbc40PV: 0,
});

// Formatter pour les montants
const formatter = new Intl.NumberFormat("fr-DZ", {
  style: "currency",
  currency: "DZD",
});

// Computed properties
const nbrCont = computed(() => {
  const n20 =
    proformaStore.calculationResult?.nbc20PV ??
    proformaStore.searchResult?.c20p ??
    0;
  const n40 =
    proformaStore.calculationResult?.nbc40PV ??
    proformaStore.searchResult?.c40p ??
    0;
  return `${n20} (20 pieds) / ${n40} (40 pieds)`;
});

const visite = computed(() => {
  return (
    proformaStore.calculationResult?.visite ?? calculationForm.visite ?? false
  );
});

const scanner = computed(() => {
  return proformaStore.calculationResult?.scan ?? calculationForm.scan ?? false;
});

const datePrevisionnelle = computed(() => {
  return (
    proformaStore.calculationResult?.dateFin ?? calculationForm.dateFin ?? ""
  );
});

const isCalculationFormValid = computed(() => {
  return (
    calculationForm.dateFin &&
    calculationForm.nbc20PV >= 0 &&
    calculationForm.nbc40PV >= 0
  );
});

// Colonnes du tableau
const tableColumns = [
  {
    name: "prscod",
    required: true,
    label: "Code prestation",
    align: "left",
    field: "prscod",
    sortable: true,
  },
  {
    name: "libelle",
    required: true,
    label: "Libellé prestation",
    align: "left",
    field: "libelle",
    sortable: true,
  },
  {
    name: "duree",
    required: true,
    label: "Durée",
    align: "center",
    field: "duree",
    sortable: true,
  },
  {
    name: "quantite",
    required: true,
    label: "Qté",
    align: "center",
    field: "quantite",
    sortable: true,
  },
  {
    name: "pu",
    required: true,
    label: "P.U",
    align: "right",
    field: "pu",
    sortable: true,
  },
  {
    name: "montant",
    required: true,
    label: "Montant",
    align: "right",
    field: "montant",
    sortable: true,
  },
];

// Méthodes
const search = async () => {
  try {
    proformaStore.clearErrors();
    await proformaStore.searchProforma(searchForm);

    calculationForm.nbc20PV = proformaStore.searchResult.c20p;
    calculationForm.nbc40PV = proformaStore.searchResult.c40p;

    $q.notify({
      type: "positive",
      message: "Recherche effectuée avec succès",
      position: "top-right",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erreur lors de la recherche",
      position: "top-right",
    });
  }
};

const calculate = async () => {
  try {
    proformaStore.clearErrors();

    const calculationData = {
      ...searchForm,
      ...calculationForm,
      ...proformaStore.searchResult,
      dateDebut: proformaStore.searchResult.date,
      maxNbc20P: proformaStore.searchResult.c20p,
      maxNbc40P: proformaStore.searchResult.c40p,
    };

    await proformaStore.calculateProforma(calculationData);
    $q.notify({
      type: "positive",
      message: "Calcul effectué avec succès",
      position: "top-right",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erreur lors du calcul",
      position: "top-right",
    });
  }
};

const onVisiteChange = (newVal) => {
  if (newVal) {
    calculationForm.scan = true;
  } else {
    calculationForm.scan = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const downloadPdf = async () => {
  if (!proformaStore.hasCalculationResult) {
    $q.notify({
      type: 'warning',
      message: 'Aucun calcul disponible pour générer le PDF',
      position: 'top-right'
    })
    return
  }

  pdfLoading.value = true

  try {
    // Récupérer les valeurs directement depuis le store
    const n20 = proformaStore.calculationResult?.nbc20PV ?? proformaStore.searchResult?.c20p ?? 0
    const n40 = proformaStore.calculationResult?.nbc40PV ?? proformaStore.searchResult?.c40p ?? 0
    const nbrContValue = `${n20} (20 pieds) / ${n40} (40 pieds)`
    
    const visiteValue = proformaStore.calculationResult?.visite ?? false
    const scannerValue = proformaStore.calculationResult?.scan ?? false
    const datePrevisionnelleValue = proformaStore.calculationResult?.dateFin ?? ''

    const formatter = new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD'
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const [year, month, day] = dateString.split('-')
      return `${day}-${month}-${year}`
    }

    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return ''
      const date = new Date(dateTimeStr)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }

    // Créer le contenu HTML avec espace minimisé
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          
          body {
            font-family: 'Roboto', Arial, sans-serif;
            margin: 0;
            padding: 10px;
            background: white;
            font-size: 13px;
            line-height: 1.2;
            color: #333;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 8px;
            border-bottom: 2px solid #0e4ba1;
            padding-bottom: 8px;
          }
          .header img {
            max-width: 90%;
            height: auto;
            margin: 0 auto 5px;
            display: block;
          }
          h1 {
            font-size: 20px;
            text-decoration: underline;
            font-weight: bold;
            text-align: center;
            margin: 8px 0;
            color: #0e4ba1;
          }
          .client-info {
            text-align: center;
            margin-bottom: 10px;
            font-size: 13px;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
            border-left: 3px solid #0e4ba1;
          }
          .client-name {
            font-weight: bold;
            color: #0e4ba1;
          }
          .info-grid {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            gap: 10px;
            flex-wrap: wrap;
          }
          .info-column {
            flex: 1;
            min-width: 48%;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
          }
          .info-column p {
            margin: 4px 0;
            font-size: 12px;
          }
          .info-column span {
            font-weight: 600;
            color: #0e4ba1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 11px;
            table-layout: fixed;
          }
          thead {
            background: #0e4ba1 !important;
            color: white !important;
          }
          th, td {
            padding: 6px 4px;
            text-align: left;
            border: 1px solid #dee2e6;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          th {
            font-weight: 600;
            text-align: center;
          }
          td {
            text-align: center;
          }
          th:nth-child(1), td:nth-child(1) { width: 12%; }
          th:nth-child(2), td:nth-child(2) { 
            width: 35%; 
            text-align: left;
          }
          td:nth-child(2) { text-align: left; }
          th:nth-child(3), td:nth-child(3) { width: 10%; }
          th:nth-child(4), td:nth-child(4) { width: 8%; }
          th:nth-child(5), td:nth-child(5) { width: 15%; }
          th:nth-child(6), td:nth-child(6) { width: 15%; }
          tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .total-section {
            display: flex;
            justify-content: flex-end;
            margin: 10px 0;
          }
          .total-box {
            text-align: right;
            width: 280px;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #0e4ba1;
          }
          .breakdown {
            margin-bottom: 8px;
            font-size: 12px;
          }
          .breakdown p {
            margin: 4px 0;
          }
          .breakdown span {
            font-weight: 600;
            display: inline-block;
            width: 70px;
            color: #0e4ba1;
          }
          .total-amount {
            background: #0e4ba1;
            color: white;
            padding: 8px;
            font-weight: bold;
            border-radius: 4px;
            margin-top: 6px;
            font-size: 14px;
            text-align: center;
          }
          .condition {
            font-size: 11px;
            color: #666;
            margin-top: 10px;
            font-style: italic;
            text-align: justify;
            line-height: 1.3;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
            border-left: 3px solid #0e4ba1;
          }
          @media print {
            body { 
              margin: 0; 
              padding: 8px; 
              font-size: 12px;
            }
            .condition {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${window.location.origin}/entete.png" alt="En-tête EPAL">
          </div>
          
          <h1>Facture proforma</h1>
          
          <div class="client-info">
            Facture proforma établie au nom de (Madame / Monsieur)
            <span class="client-name">${authStore.getUserFullName}</span>
            le ${formatDateTime(proformaStore?.calculationResult?.historique?.created_at)}
          </div>
          
          <div class="info-grid">
            <div class="info-column">
              <p><span>BL:</span> ${proformaStore?.searchResult?.bl || ''}</p>
              <p><span>N° Conteneur:</span> ${proformaStore?.searchResult?.conteneur || ''}</p>
              <p><span>Numéro d'escale:</span> ${proformaStore?.searchResult?.escale || ''}</p>
              <p><span>Navire:</span> ${proformaStore?.searchResult?.navire || ''}</p>
            </div>
            <div class="info-column">
              <p><span>Date de livraison:</span> ${formatDate(proformaStore?.searchResult?.date)}</p>
              <p><span>Nombre:</span> ${nbrContValue}</p>
              <p><span>Date livraison prévisionnelle:</span> ${formatDate(datePrevisionnelleValue)}</p>
              <p>
                <span>Visite:</span> ${visiteValue ? 'Oui' : 'Non'}
                &nbsp;&nbsp;
                <span>Scanner:</span> ${scannerValue ? 'Oui' : 'Non'}
              </p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Libellé prestation</th>
                <th>Durée</th>
                <th>Qte</th>
                <th>P.U</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              ${proformaStore.calculationResult.facture.details.map(pre => `
                <tr>
                  <td><strong>${pre.prscod}</strong></td>
                  <td>${pre.libelle}</td>
                  <td>${pre.duree}</td>
                  <td>${pre.quantite}</td>
                  <td><strong>${formatter.format(pre.pu)}</strong></td>
                  <td><strong>${formatter.format(pre.montant)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div class="breakdown">
                <p>
                  <span>Frais imp:</span> 100,00 DA<br>
                  <span>HT:</span> ${formatter.format(proformaStore.calculationResult.facture.totalHT)}<br>
                  <span>TVA:</span> ${formatter.format(proformaStore.calculationResult.facture.tva)}
                </p>
              </div>
              <div class="total-amount">
                Montant TTC: ${formatter.format(proformaStore.calculationResult.facture.ttc)}
              </div>
            </div>
          </div>

          <div class="condition">
            La présente facture proforma est émise à titre informatif et ne constitue pas une facture définitive.
            Elle permet d'estimer les frais portuaires liés à l'opération de manutention, de stockage,
            ou toute autre prestation demandée.
          </div>
        </div>
      </body>
      </html>
    `

    // Créer un élément temporaire
    const element = document.createElement('div')
    element.innerHTML = htmlContent
    
    // Options optimisées pour html2pdf
    const options = {
      margin: [5, 5, 5, 5],
      filename: `proforma-${proformaStore.searchResult.bl}-${proformaStore.searchResult.conteneur}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        width: 794,
        windowWidth: 794
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    }

    // Générer le PDF
    await html2pdf().set(options).from(element).save()

    $q.notify({
      type: 'positive',
      message: 'PDF généré avec succès',
      position: 'top-right'
    })

  } catch (error) {
    console.error('Erreur génération PDF:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la génération du PDF: ' + error.message,
      position: 'top-right'
    })
  } finally {
    pdfLoading.value = false
  }
}


onMounted(() => {
  proformaStore.resetSearch();
});
</script>

<style scoped>
/* Styles pour l'interface utilisateur */
.proforma-table {
  @apply shadow-sm;
}

.proforma-table :deep(.q-table__top) {
  @apply bg-blue-600 text-white;
}

.proforma-table :deep(.q-table thead th) {
  @apply bg-blue-600 text-white font-semibold;
}

.proforma-table :deep(.q-table tbody tr:nth-child(even)) {
  @apply bg-gray-50;
}

/* Styles pour le contenu PDF */
.pdf-source {
  width: 794px; /* Largeur A4 */
  background: white;
  box-sizing: border-box;
}

.pdf-page {
  padding: 20px;
  font-family: "Arial", sans-serif;
  background: white;
  width: 100%;
  box-sizing: border-box;
}

.pdf-page * {
  font-size: 16px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

.pdf-page h1 {
  font-size: 32px;
  text-decoration: underline;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  page-break-after: avoid;
}

.pdf-header {
  text-align: center;
  margin-bottom: 20px;
}

.header-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.client-info {
  margin-bottom: 0px;
  text-align: center;
}

.client-name {
  font-weight: bold;
}

#info {
  display: flex;
  justify-content: space-between;
  margin: 0px 0;
  page-break-inside: avoid;
}

.info-column {
  width: 48%;
}

#info span {
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  page-break-inside: avoid;
}

table * {
  font-size: 14px !important;
}

thead {
  background: #0e4ba1 !important;
  color: white !important;
}

thead th {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
  font-weight: bold;
}

tbody td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

.total-section-imp {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
  page-break-inside: avoid;
}

.total-section {
  text-align: right;
  width: 300px;
}

.breakdown {
  margin-bottom: 10px;
}

.breakdown span {
  font-weight: bold;
  display: inline-block;
  width: 80px;
}

.total-box {
  background: #0e4ba1;
  color: white;
  padding: 12px;
  font-weight: bold;
  font-size: 18px;
  border-radius: 4px;
  margin-top: 10px;
}

.condition {
  font-size: 14px;
  color: #666;
  margin-top: 30px;
  font-style: italic;
  text-align: justify;
  page-break-before: avoid;
}
</style>
