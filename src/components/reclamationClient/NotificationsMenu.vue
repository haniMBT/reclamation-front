<template>
  <q-btn
    flat
    round
    icon="notifications"
    color="grey-7"
    size="md"
    class="notification-btn"
  >
    <q-menu 
      class="notification-menu"
      style="min-width: 380px; max-width: 420px;"
      transition-show="scale"
      transition-hide="scale"
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
          <q-btn
            v-if="notifications.length > 0"
            flat
            dense
            size="sm"
            color="blue-6"
            label="Tout marquer"
            @click="markAllAsRead"
            class="text-xs px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            no-caps
          />
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
        <div v-else-if="notifications.length === 0" class="text-center py-8 px-6">
          <div class="bg-white rounded-full p-4 shadow-sm inline-block mb-4">
            <q-icon name="notifications_none" size="2rem" class="text-gray-400" />
          </div>
          <h4 class="text-sm font-medium text-gray-800 mb-1">Aucune notification</h4>
          <p class="text-gray-500 text-xs">Vous êtes à jour !</p>
        </div>

        <!-- Liste des notifications -->
        <div v-else class="p-4 space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            :class="{
              'border-l-4 border-l-blue-500 bg-blue-50': notification.is_read == 0,
              'hover:bg-gray-50': notification.is_read == 1
            }"
            @click="markAsRead(notification.id)"
          >
            <div class="flex items-start space-x-3">
              <!-- Indicateur de statut -->
              <div class="flex-shrink-0 mt-1">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="notification.is_read == 0 ? 'bg-blue-500' : 'bg-gray-300'"
                ></div>
              </div>
              
              <!-- Contenu de la notification -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h5 
                    class="text-sm font-medium text-gray-900 truncate"
                    :class="notification.is_read == 0 ? 'font-semibold' : ''"
                  >
                    {{ notification.user_name }}
                  </h5>
                  <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {{ formatDate(notification.created_at) }}
                  </span>
                </div>
                <p 
                  class="text-sm text-gray-700 leading-relaxed"
                  :class="notification.is_read == 0 ? 'font-medium' : ''"
                >
                  {{ notification.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

// Données réactives
const notifications = ref([])
const loading = ref(false)

// Méthode pour récupérer les notifications
const fetchNotifications = async () => {
  loading.value = true
  try {
    const response = await api.get('api/rec/notifications')
    notifications.value = response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
    notifications.value = []
  } finally {
    loading.value = false
  }
}

// Méthode pour marquer une notification comme lue
const markAsRead = async (id) => {
  try {
    await api.post(`api/rec/notifications/${id}/read`)

    // Mettre à jour localement
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.is_read = 1
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
}

// Méthode pour marquer toutes les notifications comme lues
const markAllAsRead = async () => {
  try {
    await api.post('api/rec/notifications/mark-all-read')

    // Mettre à jour toutes les notifications localement
    notifications.value.forEach(n => n.is_read = 1)
  } catch (error) {
    console.error('Erreur lors du marquage de toutes comme lues:', error)
  }
}

// Formatage de la date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonction de rechargement automatique pendant les heures de travail
const startAutoRefresh = () => {
  setInterval(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const isWorkingTime = (hours > 8 && hours < 16) || (hours === 8 && minutes >= 0) || (hours === 16 && minutes <= 30)

    if (isWorkingTime) {
      fetchNotifications()
    }
  }, 60 * 60 * 1000) // toutes les 60 minutes
}

// Appel automatique au montage du composant
onMounted(() => {
  fetchNotifications()
  startAutoRefresh()
})
</script>

<style scoped>
/* Bouton de notification principal */
.notification-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-btn:hover {
  transform: scale(1.05);
  background-color: rgba(59, 130, 246, 0.1) !important;
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