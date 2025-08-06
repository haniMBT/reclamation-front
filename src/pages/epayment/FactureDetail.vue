<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-dots size="xl" color="primary" />
    </div>

    <div v-else-if="facture">
      <!-- Header avec actions -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <q-btn
            flat
            icon="arrow_back"
            label="Retour"
            @click="$router.go(-1)"
          />
          <h4 class="text-h4 q-mb-none q-mt-sm">
            Facture {{ facture.facnum }}
          </h4>
        </div>
        <div class="col-auto">
          <q-btn
            v-if="!facture.isPaid"
            color="positive"
            icon="payment"
            label="Payer cette facture"
            @click="payFacture"
            class="q-mr-sm"
          />
          <q-btn
            v-if="paymentInfo"
            color="primary"
            icon="receipt"
            label="Voir le reçu"
            @click="viewReceipt"
          />
        </div>
      </div>

      <!-- Style de facture comme dans Blade -->
      <div class="invoice q-pa-md q-mb-md bg-white">
        <!-- Header row -->
        <div class="row q-mb-md">
          <div class="col-12">
            <div class="row items-center">
              <div class="col">
                <div class="row items-center">
                  <q-img
                    src="/logo-epal.png"
                    style="width: 60px; height: 60px"
                    class="q-mr-md"
                  />
                  <h4 class="text-h5 q-ma-none">
                    ENTREPRISE PORTUAIRE D'ALGER
                  </h4>
                </div>
              </div>
              <div class="col-auto">
                <small class="text-grey-6"
                  >Date: {{ formatDate(new Date()) }}</small
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Info row -->
        <div class="row q-gutter-md invoice-info">
          <!-- Informations Client -->
          <div class="col-12 col-md-4">
            <div
              class="text-weight-bold text-primary q-mb-sm text-decoration-underline"
            >
              Informations Client
            </div>
            <div class="text-body2">
              <div class="text-weight-bold">{{ facture.trsnom }}</div>
              <div>{{ facture.trsadr }}</div>
              <div>N.RC: {{ facture.trsnrc }} NIS: {{ facture.trsnis }}</div>
              <div>Tél: {{ facture.trstel }}</div>
              <div>Email: {{ facture.trseml }}</div>
            </div>
          </div>

          <!-- Informations ESCALE -->
          <div class="col-12 col-md-4">
            <div
              class="text-weight-bold text-primary q-mb-sm text-decoration-underline"
            >
              Informations ESCALE
            </div>
            <div class="text-body2">
              <div class="text-weight-bold">N°: {{ facture.escnum }}</div>
              <div class="text-weight-bold">Navire: {{ facture.navnom }}</div>
              <div>Arrivé le : {{ formatDate(facture.escdar) }}</div>
              <div>BL N°: {{ facture.cnsbld }}</div>
            </div>
          </div>

          <!-- Informations Facture -->
          <div class="col-12 col-md-4">
            <div class="text-body2">
              <div class="text-weight-bold q-mb-sm">
                Facture N° {{ facture.facnum }}
              </div>
              <div>
                <span class="text-weight-bold">Taxation N°:</span>
                {{ facture.taxnum }}
              </div>
              <div>
                <span class="text-weight-bold">Etablie le :</span>
                {{ formatDate(facture.facdat) }}
              </div>
              <div>
                <span class="text-weight-bold">Compte N°:</span>
                {{ facture.trscod }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des prestations -->
      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="text-h6 q-mb-md">Détail des prestations</div>

          <!-- Filtre de recherche -->
          <div class="row q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="prestationsFilter"
                outlined
                dense
                placeholder="Rechercher dans les prestations..."
                debounce="300"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6 text-right">
              <q-chip color="primary" text-color="white" icon="assignment">
                {{ filteredDetails.length }} prestation(s)
              </q-chip>
            </div>
          </div>

          <q-table
            :rows="filteredDetails"
            :columns="detailColumns"
            row-key="id"
            :pagination="detailPagination"
            :rows-per-page-options="[5, 10, 25, 50]"
            flat
            bordered
            class="table-responsive"
          >
            <template v-slot:body-cell-dfapun="props">
              <q-td :props="props">
                {{ formatCurrency(props.value) }}
              </q-td>
            </template>

            <template v-slot:body-cell-dfamnt="props">
              <q-td :props="props">
                {{ formatCurrency(props.value) }}
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-6 q-gutter-sm">
                <q-icon size="2em" name="sentiment_dissatisfied" />
                <span>Aucune prestation trouvée</span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Section Totaux -->
      <div class="row q-mt-lg">
        <div class="col-6"></div>
        <div class="col-6">
          <div class="text-h6 q-mb-md">A PAYER:</div>

          <q-table
            :rows="totauxRows"
            :columns="totauxColumns"
            hide-pagination
            hide-header
            flat
            bordered
            class="table-responsive"
          >
            <template v-slot:body-cell-valeur="props">
              <q-td :props="props">
                <span
                  v-if="props.row.type === 'total'"
                  class="text-weight-bold"
                >
                  {{ props.value }}
                </span>
                <span v-else>{{ props.value }}</span>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <!-- Actions -->
      <div class="row no-print q-mt-lg">
        <div class="col-12 text-right">
          <q-btn
            v-if="facture.status != 1"
            color="positive"
            icon="credit_card"
            label="Effectuer le paiement"
            @click="payFacture"
            class="q-mr-sm"
          />
          <q-btn
            color="primary"
            icon="download"
            label="Generer PDF"
            @click="printFacture"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center q-mt-xl">
      <q-icon name="error" size="xl" color="grey" />
      <div class="text-h6 q-mt-md">Facture non trouvée</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useEpaymentStore } from "../../stores/epayment";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const epaymentStore = useEpaymentStore();

const loading = ref(false);
const facture = ref(null);
const details = ref([]);
const paymentInfo = ref(null);
const totauxRows = ref([]);
const prestationsFilter = ref("");
const BASE_URL = process.env.BASE_URL;

const detailPagination = ref({
  sortBy: "prscod",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const detailColumns = [
  {
    name: "prscod",
    label: "Code",
    align: "left",
    field: "prscod",
  },
  {
    name: "prslib",
    label: "Prestation",
    align: "left",
    field: "prslib",
  },
  {
    name: "dfaqte",
    label: "Quantité",
    align: "center",
    field: "dfaqte",
  },
  {
    name: "dfadur",
    label: "Durée",
    align: "center",
    field: "dfadur",
  },
  {
    name: "dfapun",
    label: "Prix Unitaire",
    align: "right",
    field: "dfapun",
  },
  {
    name: "dfamnt",
    label: "Montant",
    align: "right",
    field: "dfamnt",
  },
];

const totauxColumns = [
  {
    name: "libelle",
    align: "left",
    field: "libelle",
    style: "width: 50%",
  },
  {
    name: "valeur",
    align: "right",
    field: "valeur",
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
  }).format(amount || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR");
};

const getStatusColor = (status) => {
  return status === 1 ? "positive" : "warning";
};

const getStatusLabel = (status) => {
  return status === 1 ? "Payée" : "Impayée";
};

const loadFacture = async () => {
  loading.value = true;
  try {
    const factureId = route.params.id;
    const response = await epaymentStore.getFacture(factureId);

    facture.value = response.facture;
    details.value = response.details;
    paymentInfo.value = response.payment_info;

    // Calculer les totaux
    totauxRows.value = [
      {
        libelle: "Sous-total:",
        valeur: formatCurrency(facture.value.facmnt),
        type: "subtotal",
      },
      {
        libelle: `TVA (${facture.value.facttv} %)`,
        valeur: formatCurrency(facture.value.factva),
        type: "tva",
      },
      {
        libelle: "Frais d'impression:",
        valeur: formatCurrency(facture.value.facfix),
        type: "frais",
      },
      {
        libelle: "Total:",
        valeur: formatCurrency(facture.value.facttc),
        type: "total",
      },
    ];
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erreur lors du chargement de la facture",
      caption: error.message,
    });
  } finally {
    loading.value = false;
  }
};

const payFacture = () => {
  router.push(`/epayment/payment/${facture.value.id}`);
};

const viewReceipt = () => {
  router.push(`/epayment/receipt/${paymentInfo.value.recuId}`);
};

const printFacture = () => {
  const url = `${BASE_URL}/epayment/factures/${facture.value.id}/pdf`;
  window.open(url);
};

// Filtre computed pour les prestations
const filteredDetails = computed(() => {
  if (!prestationsFilter.value) {
    return details.value;
  }

  const filter = prestationsFilter.value.toLowerCase();
  return details.value.filter(
    (item) =>
      (item.prscod && item.prscod.toLowerCase().includes(filter)) ||
      (item.prslib && item.prslib.toLowerCase().includes(filter)) ||
      (item.dfaqte && item.dfaqte.toString().includes(filter)) ||
      (item.dfamnt && item.dfamnt.toString().includes(filter))
  );
});

onMounted(() => {
  loadFacture();
});
</script>

<style scoped>
.border-top {
  border-top: 1px solid #e0e0e0;
}

.invoice {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.text-decoration-underline {
  text-decoration: underline;
}

.table-responsive {
  overflow-x: auto;
}
</style>
