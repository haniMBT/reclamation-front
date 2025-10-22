<template>
  <q-btn
    flat
    round
    icon="notifications"
    color="grey-7"
    size="md"
    class="notification-btn"
  >
    <!-- Badge pour le nombre de notifications non lues -->
    <q-badge
      v-if="unreadCount > 0"
      :label="unreadCount > 99 ? '99+' : unreadCount"
      color="red"
      floating
      rounded
      class="notification-badge"
    />

    <q-menu
      v-model="menuVisible"
      class="notification-menu"
      style="min-width: 380px; max-width: 420px;"
      transition-show="scale"
      transition-hide="scale"
      @show="fetchNotifications"
    >
      <!-- Header du menu -->
      <div class="notification-header bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <q-icon name="notifications" size="1.5rem" class="text-blue-600 mr-3" />
            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-0">Notifications</h3>
              <p class="text-gray-600 text-sm mb-0">Restez informé de vos activités</p>
            </div>
          </div>
          <!-- <q-btn
            v-if="notifications.length > 0"
            flat
            dense
            size="sm"
            color="blue-6"
            label="Tout marquer"
            @click="markAllAsRead"
            class="text-xs px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            no-caps
          /> -->
        </div>
      </div>

      <!-- Contenu du menu -->
      <div class="notification-content bg-gray-50" style="max-height: 400px; overflow-y: auto;">
        <!-- État de chargement -->
        <div v-if="loading" class="text-center py-8">
          <div class="bg-white rounded-full p-4 shadow-sm inline-block mb-4">
            <q-spinner-dots size="32px" color="blue-6" />
          </div>
          <h4 class="text-sm font-medium text-gray-800 mb-1">Chargement...</h4>
          <p class="text-gray-500 text-xs">Récupération des notifications</p>
        </div>

        <!-- État vide -->
        <div v-else-if="notifications.length === 0" class="text-center py-8">
          <div class="bg-white rounded-full p-4 shadow-sm inline-block mb-4">
            <q-icon name="notifications_none" size="32px" color="grey-5" />
          </div>
          <h4 class="text-sm font-medium text-gray-800 mb-1">Aucune notification disponible</h4>
          <p class="text-gray-500 text-xs">Vous êtes à jour !</p>
        </div>

        <!-- Liste des notifications -->
        <q-list v-else class="p-4 space-y-2">
          <q-item
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            :class="{
              'border-l-4 border-l-blue-500 bg-blue-50 border-blue-200': notification.is_read == 0,
              'border-gray-200 hover:bg-gray-50': notification.is_read == 1
            }"
            clickable
            @click="markAsRead(notification)"
          >
            <!-- Avatar de l'expéditeur -->
            <q-item-section avatar>
              <div class="flex flex-col items-center">
                <q-avatar
                  size="40px"
                  :color="notification.is_read == 0 ? 'blue-6' : 'grey-5'"
                  text-color="white"
                  class="mb-1"
                >
                  {{ getSenderInitials(notification.sender) }}
                </q-avatar>
                <div
                  class="w-2 h-2 rounded-full"
                  :class="notification.is_read == 0 ? 'bg-blue-500' : 'bg-gray-300'"
                ></div>
              </div>
            </q-item-section>

            <!-- Contenu de la notification -->
            <q-item-section>
              <!-- Nom de l'expéditeur -->
              <q-item-label
                class="text-sm font-medium text-gray-900 mb-1"
                :class="notification.is_read == 0 ? 'font-semibold text-blue-900' : ''"
              >
                🧍‍♂️ {{ getSenderName(notification.sender) }}
              </q-item-label>

              <!-- Message court -->
              <q-item-label
                class="text-sm text-gray-700 mb-2"
                :class="notification.is_read == 0 ? 'font-medium' : ''"
              >
                💬 {{ truncateMessage(notification.message) }}
              </q-item-label>

              <!-- Date relative et direction -->
              <q-item-label
                caption
                class="text-xs text-gray-500 flex items-center"
              >
                <q-icon name="schedule" size="12px" class="mr-1" />
                🕒 {{ getRelativeTime(notification.created_at) }}
                <!-- <span class="mx-2">•</span> -->
                <!-- {{ notification.direction }}  -->
              </q-item-label>
            </q-item-section>

            <!-- Indicateur de statut -->
            <q-item-section side>
              <div class="flex flex-col items-center">
                <q-icon
                  v-if="notification.is_read == 0"
                  name="fiber_manual_record"
                  color="blue-6"
                  size="8px"
                  class="mb-1"
                />
                <q-chip
                  :color="notification.is_read == 0 ? 'blue-1' : 'grey-3'"
                  :text-color="notification.is_read == 0 ? 'blue-8' : 'grey-6'"
                  size="xs"
                  :label="notification.is_read == 0 ? 'Nouveau' : 'Lu'"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api } from 'boot/axios'
import { useAuthStore } from 'stores/auth'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import { useTicketStore } from 'src/stores/ticket'
import { useRouter } from 'vue-router'

// Configuration de dayjs en français
dayjs.extend(relativeTime)
dayjs.locale('fr')

const authStore = useAuthStore()
const ticketStore = useTicketStore()
const router = useRouter()

// Données réactives
const notifications = ref([])
const loading = ref(false)
const menuVisible = ref(false)

// Variables pour l'optimisation des performances
let notificationInterval = null
let lastFetchTime = 0
const FETCH_COOLDOWN = 5000 // 5 secondes de cooldown minimum entre les appels
const POLLING_INTERVAL = 30000 // 30 secondes d'intervalle de polling

// Utilisateur connecté
const currentUser = computed(() => authStore.userProfile)

// Nombre de notifications non lues
const unreadCount = computed(() => {
  return notifications.value.filter(notification => notification.is_read == 0).length
})

// Méthode pour récupérer les notifications avec optimisation
const fetchNotifications = async (showLoading = true, forceRefresh = false) => {
  console.log('🔔 Déclenchement de fetchNotifications')
  console.log('👤 Utilisateur connecté:', currentUser.value)

  if (!currentUser.value?.id) {
    console.warn('❌ Utilisateur non connecté')
    return
  }

  // Vérifier le cooldown pour éviter les appels trop fréquents
  const now = Date.now()
  if (!forceRefresh && (now - lastFetchTime) < FETCH_COOLDOWN) {
    console.log('⏳ Cooldown actif, appel ignoré')
    return
  }

  if (showLoading) {
    loading.value = true
  }

  try {
    console.log('📡 Appel API vers /api/rec/notifications avec id_recepteur:', currentUser.value.id)

    const response = await api.get('/api/rec/notifications', {
      params: {
        id_recepteur: currentUser.value.id
      }
    })

    console.log('✅ Réponse API reçue:', response.data)
    notifications.value = response.data.data
    lastFetchTime = now

    console.log('📋 Notifications stockées:', notifications.value)
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des notifications:', error)
    console.error('📄 Détails de l\'erreur:', error.response?.data)
    notifications.value = []
  } finally {
    if (showLoading) {
      loading.value = false
    }
  }
}

// Méthode pour démarrer l'actualisation périodique optimisée
const startNotificationPolling = () => {
  // Charger les notifications immédiatement
  fetchNotifications(true, true) // Force le premier chargement

  // Puis actualiser à intervalle régulier
  notificationInterval = setInterval(() => {
    // Vérifier si l'utilisateur est toujours connecté
    if (currentUser.value?.id) {
      fetchNotifications(false) // Ne pas afficher le loading pour les mises à jour automatiques
    } else {
      console.warn('⚠️ Utilisateur déconnecté, arrêt du polling')
      stopNotificationPolling()
    }
  }, POLLING_INTERVAL)

  console.log(`🔄 Polling démarré avec un intervalle de ${POLLING_INTERVAL/1000} secondes`)
}

// Méthode pour arrêter l'actualisation périodique
const stopNotificationPolling = () => {
  if (notificationInterval) {
    clearInterval(notificationInterval)
    notificationInterval = null
    console.log('🛑 Polling arrêté')
  }
}

// Méthode pour obtenir le nom de l'expéditeur
const getSenderName = (sender) => {
  if (!sender) return 'Système'
  return sender.name || sender.Nom || sender.Prenom || 'Utilisateur inconnu'
}

// Méthode pour obtenir les initiales de l'expéditeur
const getSenderInitials = (sender) => {
  if (!sender) return 'S'
  const name = getSenderName(sender)
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Méthode pour tronquer le message
const truncateMessage = (message) => {
  if (!message) return ''
  const maxLength = 80
  return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
}

// Méthode pour obtenir le temps relatif
const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  return dayjs(dateString).fromNow()
}

// Méthode pour marquer une notification comme lue
const markAsRead = async (notif) => {
  try {
    const id = notif.id
    const tticket_id = notif.tticket_id
    await api.put(`/api/rec/notifications/${id}/mark-as-read`)

    // Mettre à jour localement
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.is_read = 1
    }
     // Enregistrer l'ID du ticket dans le store Pinia
      ticketStore.setTicketForMessages(tticket_id)
      // Naviguer vers la page des messages
      router.push('/reclamations/tickets/messages')
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
}

// Méthode pour marquer toutes les notifications comme lues
const markAllAsRead = async () => {
  try {
    await api.put('/api/rec/notifications/mark-all-as-read')

    // Mettre à jour toutes les notifications localement
    notifications.value.forEach(n => n.is_read = 1)
  } catch (error) {
    console.error('Erreur lors du marquage de toutes comme lues:', error)
  }
}

// Formatage de la date (conservé pour compatibilité)
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (notificationDate.getTime() === today.getTime()) {
    // Aujourd'hui - afficher seulement l'heure
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    // Autre jour - format court DD/MM à HH:MM
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    }) + ' à ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Hooks de cycle de vie
onMounted(() => {
  console.log('🚀 Composant NotificationsMenu monté - Démarrage de l\'actualisation périodique')
  startNotificationPolling()
})

onUnmounted(() => {
  console.log('🛑 Composant NotificationsMenu démonté - Arrêt de l\'actualisation périodique')
  stopNotificationPolling()
})
</script>

<style scoped>
/* Bouton de notification principal */
.notification-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.notification-btn:hover {
  transform: scale(1.05);
  background-color: rgba(59, 130, 246, 0.1) !important;
}

/* Badge de notification */
.notification-badge {
  animation: pulse-badge 2s infinite;
  font-weight: bold;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
}

@keyframes pulse-badge {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Menu des notifications */
.notification-menu {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
}

/* Header du menu */
.notification-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
}

.notification-header h3 {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Contenu du menu */
.notification-content {
  background: #f8fafc;
}

.notification-content::-webkit-scrollbar {
  width: 6px;
}

.notification-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.notification-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.notification-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Items de notification */
.notification-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.notification-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.notification-item:hover::before {
  opacity: 1;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #3b82f6;
}

.notification-item:active {
  transform: translateY(-1px);
  transition: transform 0.1s ease;
}

/* Indicateur de statut animé */
.notification-item .w-2.h-2 {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.notification-item .bg-blue-500 {
  animation: pulse-blue 2s infinite;
  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
}

@keyframes pulse-blue {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* Bouton "Tout marquer" */
.notification-header .q-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.notification-header .q-btn:hover {
  transform: scale(1.05);
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* États de chargement et vide */
.text-center .bg-white {
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Animation d'apparition des notifications */
.notification-item {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 480px) {
  .notification-menu {
    min-width: 320px !important;
    max-width: 350px !important;
  }

  .notification-header {
    padding: 1rem;
  }

  .notification-content .p-4 {
    padding: 0.75rem;
  }

  .notification-item {
    padding: 0.75rem;
  }
}

/* Amélioration des couleurs Tailwind */
.bg-blue-50 {
  background-color: #eff6ff;
}

.border-l-blue-500 {
  border-left-color: #3b82f6;
}

.text-blue-600 {
  color: #2563eb;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-400 {
  color: #9ca3af;
}

.hover\:bg-blue-100:hover {
  background-color: #dbeafe;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\:-translate-y-0\.5:hover {
  transform: translateY(-0.125rem);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-x-3 > * + * {
  margin-left: 0.75rem;
}
</style>