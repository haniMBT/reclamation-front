<template>
  <q-page class="bg-gray-50 min-h-screen">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          Tableau de bord EPAL
        </h1>
        <p class="text-gray-600">Vue d'ensemble de vos services portuaires</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Transactions -->
        <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">Total Transactions</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalTransactions }}</p>
            </div>
            <div class="p-3 bg-emerald-100 rounded-full">
              <q-icon name="trending_up" class="text-xl text-emerald-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-emerald-500 text-sm font-semibold">+12%</span>
            <span class="text-gray-500 text-sm ml-2">ce mois</span>
          </div>
        </div>

        <!-- E-paiements -->
        <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">E-paiements</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.epaiements }}</p>
            </div>
            <div class="p-3 bg-teal-100 rounded-full">
              <q-icon name="account_balance_wallet" class="text-xl text-teal-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-teal-500 text-sm font-semibold">+8%</span>
            <span class="text-gray-500 text-sm ml-2">ce mois</span>
          </div>
        </div>

        <!-- Factures -->
        <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">Factures</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.factures }}</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-full">
              <q-icon name="receipt_long" class="text-xl text-orange-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-orange-500 text-sm font-semibold">+15%</span>
            <span class="text-gray-500 text-sm ml-2">ce mois</span>
          </div>
        </div>

        <!-- Réclamations -->
        <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">Réclamations</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.reclamations }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <q-icon name="support_agent" class="text-xl text-red-600" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-red-500 text-sm font-semibold">-3%</span>
            <span class="text-gray-500 text-sm ml-2">ce mois</span>
          </div>
        </div>
      </div>

              <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- ApexCharts Bar Chart -->
          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-800">Transactions par Mois</h3>
              <q-btn 
                @click="refreshChart"
                icon="refresh"
                color="primary"
                flat
                round
                size="sm"
              >
                <q-tooltip>Actualiser avec nouvelles couleurs</q-tooltip>
              </q-btn>
            </div>
            <apexchart
              type="bar"
              height="300"
              :options="chartOptions"
              :series="chartSeries"
              ref="chart"
            />
          </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl p-16 shadow-lg">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Actions Rapides</h3>
          <div class="space-y-4">
            <q-btn 
              class="w-full justify-start" 
              color="orange-6" 
              icon="account_balance_wallet" 
              to="/epayment/factures"
              label="Paiements"
              flat
              size="lg"
            />

            <q-btn 
              class="w-full justify-start" 
              color="teal-6" 
              icon="support_agent" 
              label="Nouvelle Réclamation"
              flat
              size="lg"
            />
            <q-btn 
              class="w-full justify-start" 
              color="gray-6" 
              icon="bar_chart" 
              label="Voir Rapports"
              flat
              size="lg"
            />
          </div>
        </div>

      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h3 class="text-xl font-bold text-gray-800 mb-6">Activités Récentes</h3>
        <div class="space-y-4">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="flex items-center p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100"
          >
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center mr-4"
              :class="getActivityColor(activity.type)"
            >
              <q-icon :name="getActivityIcon(activity.type)" class="text-white" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-800">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
              <span 
                class="text-xs font-semibold px-2 py-1 rounded-full"
                :class="getStatusColor(activity.status)"
              >
                {{ activity.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAuthStore } from "stores/auth";
import VueApexCharts from "vue3-apexcharts";

// Enregistrer le composant ApexCharts
const apexchart = VueApexCharts;

const authStore = useAuthStore();

// Données fictives simplifiées
const stats = ref({
  totalTransactions: 1247,
  epaiements: 456,
  factures: 381,
  reclamations: 67
});

// Données du graphique avec couleurs aléatoires
const chartSeries = ref([
  {
    name: 'Transactions',
    data: [150, 230, 180, 290, 340, 420, 380, 510, 290, 380, 460, 320]
  }
]);

const chartOptions = reactive({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  colors: [], // Sera rempli par generateRandomColors()
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '60%',
      distributed: true // Couleur différente pour chaque barre
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: true,
    borderColor: '#e0e6ed',
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        colors: '#8b8b8b',
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#8b8b8b',
        fontSize: '12px'
      }
    }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function (val) {
        return val + ' transactions'
      }
    }
  }
});

const recentActivities = ref([
  {
    id: 1,
    type: 'payment',
    title: 'Paiement reçu',
    description: 'Paiement de 15,000 DA',
    time: 'Il y a 2h',
    status: 'Validé'
  },
  {
    id: 2,
    type: 'invoice',
    title: 'Facture générée',
    description: 'Facture #FP-2024-0156',
    time: 'Il y a 4h',
    status: 'En attente'
  },
  {
    id: 3,
    type: 'complaint',
    title: 'Nouvelle réclamation',
    description: 'Réclamation #RC-789',
    time: 'Il y a 6h',
    status: 'En cours'
  }
]);

const getActivityIcon = (type) => {
  switch (type) {
    case 'payment': return 'account_balance_wallet';
    case 'invoice': return 'receipt_long';
    case 'complaint': return 'support_agent';
    default: return 'info';
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'payment': return 'bg-emerald-500';
    case 'invoice': return 'bg-orange-500';
    case 'complaint': return 'bg-teal-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Validé': return 'bg-emerald-100 text-emerald-800';
    case 'En attente': return 'bg-orange-100 text-orange-800';
    case 'En cours': return 'bg-teal-100 text-teal-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Fonctions pour les couleurs aléatoires du graphique
const generateRandomColors = () => {
  const colors = [];
  const baseColors = [
    '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', 
    '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1',
    '#14b8a6', '#eab308', '#f43f5e', '#0ea5e9'
  ];
  
  // Générer 12 couleurs aléatoires pour les 12 mois
  for (let i = 0; i < 12; i++) {
    // Mélanger et choisir une couleur aléatoire
    const randomIndex = Math.floor(Math.random() * baseColors.length);
    let chosenColor = baseColors[randomIndex];
    
    // Ajouter une variation de luminosité aléatoire
    const variations = ['', '90', '80', '70', '60', '50'];
    const variationIndex = Math.floor(Math.random() * variations.length);
    
    if (variations[variationIndex]) {
      // Modifier légèrement la couleur pour plus de variété
      const r = parseInt(chosenColor.slice(1, 3), 16);
      const g = parseInt(chosenColor.slice(3, 5), 16);
      const b = parseInt(chosenColor.slice(5, 7), 16);
      
      const factor = parseInt(variations[variationIndex]) / 100;
      const newR = Math.floor(r * factor);
      const newG = Math.floor(g * factor);
      const newB = Math.floor(b * factor);
      
      chosenColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    colors.push(chosenColor);
  }
  
  return colors;
};

// Actualiser le graphique avec de nouvelles couleurs
const refreshChart = () => {
  chartOptions.colors = generateRandomColors();
  
  // Optionnellement, modifier aussi les données légèrement
  const baseData = [150, 230, 180, 290, 340, 420, 380, 510, 290, 380, 460, 320];
  const newData = baseData.map(value => {
    const variation = Math.floor(Math.random() * 50) - 25; // ±25
    return Math.max(50, value + variation); // Minimum 50
  });
  
  chartSeries.value = [{
    name: 'Transactions',
    data: newData
  }];
};

// Initialiser les couleurs au chargement
onMounted(() => {
  chartOptions.colors = generateRandomColors();
});
</script>

<style scoped>
/* Animations au hover pour les cartes stats */
.shadow-lg {
  transition: all 0.3s ease;
}

.shadow-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>