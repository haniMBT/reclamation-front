<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="message" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Messages du Ticket</h1>
            <p class="text-gray-600 text-sm" v-if="currentTicketId">
              Ticket ID: {{ currentTicketId }}
            </p>
            <p class="text-red-600 text-sm" v-else>
              Aucun ticket sélectionné
            </p>
          </div>
        </div>
      </div>

      <!-- Alerte si aucun ticket sélectionné -->
      <div v-if="!currentTicketId" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <q-icon name="warning" class="text-red-600 mr-3" size="1.5rem" />
          <div>
            <p class="text-red-800 font-medium">Aucun ticket sélectionné</p>
            <p class="text-red-600 text-sm">Veuillez retourner à la liste des tickets et sélectionner un ticket.</p>
          </div>
          <q-btn
            flat
            color="red"
            label="Retour aux tickets"
            @click="goBack"
            class="ml-auto"
          />
        </div>
      </div>

      <!-- Liste des messages -->
      <div v-if="currentTicketId">
        <!-- Toolbar Section -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex justify-end gap-3">
            <q-btn
              icon="arrow_back"
              color="grey-6"
              no-caps
              @click="goBack"
              class="px-6"
            >
              Retour
            </q-btn>
            <q-btn
              icon="visibility"
              color="orange-6"
              no-caps
              @click="openTicketDetails"
              :disable="!currentTicketId"
              class="px-6"
            >
              Voir Réclamation
            </q-btn>
            <q-btn
              icon="add"
              color="blue-6"
              no-caps
              @click="showNewMessageDialog = true"
              :disable="!currentTicketId"
              class="px-6"
            >
              Nouveau Message
            </q-btn>
          </div>
        </div>

        <!-- Table Section -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <q-table
            :rows="messages"
            :columns="columns"
            row-key="id"
            :loading="loading"
            :pagination="pagination"
            @request="onRequest"
            class="messages-table"
            flat
          >
        <!-- Slot pour les destinataires -->
        <template v-slot:body-cell-destinataires="props">
          <q-td :props="props">
            <div v-if="props.value && props.value.length > 0">
              <q-chip
                v-for="destinataire in props.value.slice(0, 2)"
                :key="destinataire.id"
                size="sm"
                color="blue"
                text-color="white"
                class="q-ma-xs"
              >
                {{ destinataire.direction_destinataire }}
              </q-chip>
              <q-chip
                v-if="props.value.length > 2"
                size="sm"
                color="grey"
                text-color="white"
                class="q-ma-xs"
              >
                +{{ props.value.length - 2 }}
              </q-chip>
            </div>
            <span v-else class="text-grey-5">-</span>
          </q-td>
        </template>

        <!-- Slot pour les actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              size="sm"
              @click="viewMessageDetail(props.row)"
            >
              <q-tooltip>Voir le détail</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="red"
              icon="delete"
              size="sm"
              @click="deleteMessage(props.row)"
              class="q-ml-xs"
            >
              <q-tooltip>Supprimer</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- Message quand aucune donnée -->
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-6 q-gutter-sm">
            <q-icon size="2em" name="message" />
            <span>Aucun message trouvé</span>
          </div>
        </template>
      </q-table>
        </div>

    <!-- Dialog Nouveau Message -->
    <q-dialog v-model="showNewMessageDialog" persistent>
      <q-card class="w-full" style="min-width: 80vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-blue-50">
          <q-icon name="message" class="text-blue-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-blue-900">Nouveau Message</div>
            <div class="text-sm text-blue-700">Créer un nouveau message pour le ticket {{ currentTicketId }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <q-form @submit="sendMessage" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Titre -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Titre <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="newMessage.subject"
                  outlined
                  dense
                  placeholder="Entrez le titre du message"
                  :rules="[val => !!val || 'Le titre est requis']"
                >
                  <template #prepend>
                    <q-icon name="title" class="text-blue-600" />
                  </template>
                </q-input>
              </div>

              <!-- Description avec QEditor -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Description <span class="text-red-500">*</span>
                </label>
                <q-editor
                  v-model="newMessage.content"
                  min-height="200px"
                  :toolbar="[
                    ['bold', 'italic', 'underline'],
                    ['unordered', 'ordered'],
                    ['undo', 'redo']
                  ]"
                  placeholder="Rédigez votre message..."
                />
              </div>

              <!-- Sélection multiple des directions -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Directions destinataires *
                </label>
                <q-select
                  v-model="newMessage.directions"
                  :options="directionOptions"
                  label="Sélectionnez une ou plusieurs directions"
                  multiple
                  outlined
                  use-chips
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  :loading="loadingDirections"
                  stack-label
                >
                  <template #prepend>
                    <q-icon name="business" class="text-blue-600" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Aucune direction disponible
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Upload de fichiers -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Fichiers joints (optionnel)
                </label>

                <!-- Zone d'ajout de fichiers -->
                <div class="flex gap-3 mb-3">
                  <q-file
                    v-model="newFiles"
                    multiple
                    outlined
                    dense
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                    max-file-size="10485760"
                    class="flex-1"
                    @rejected="onRejected"
                    @update:model-value="onNewFilesSelected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" class="text-blue-600" />
                    </template>
                    <template v-slot:hint>
                      Formats acceptés: Images, PDF, Word. Taille max: 10Mo par fichier
                    </template>
                  </q-file>

                  <q-btn
                    label="Ajouter"
                    color="blue-6"
                    outline
                    :disable="!newFiles || newFiles.length === 0"
                    @click="addFiles"
                    class="px-4"
                  >
                    <q-icon name="add" class="mr-1" />
                  </q-btn>
                </div>

                <!-- Liste des fichiers sélectionnés -->
                <div v-if="newMessage.attachments.length > 0" class="mt-3">
                  <div class="text-sm font-medium text-gray-700 mb-2">
                    Fichiers sélectionnés ({{ newMessage.attachments.length }}) :
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(file, index) in newMessage.attachments"
                      :key="index"
                      class="flex items-center justify-between bg-gray-50 p-3 rounded-md border"
                    >
                      <div class="flex items-center">
                        <q-icon
                          :name="getFileIcon(file.type)"
                          size="1.5rem"
                          class="text-blue-600 mr-3"
                        />
                        <div>
                          <div class="text-sm font-medium text-gray-800">{{ file.name }}</div>
                          <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                        </div>
                      </div>
                      <q-btn
                        icon="close"
                        size="sm"
                        flat
                        round
                        color="negative"
                        @click="removeFile(index)"
                        class="ml-2"
                      >
                        <q-tooltip>Supprimer le fichier</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeNewMessageDialog"
            color="grey-6"
            outline
            no-caps
            class="px-6"
          >
            Annuler
          </q-btn>
          <q-btn
            @click="sendMessage"
            color="blue-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            :loading="sending"
            :disable="!newMessage.subject || !newMessage.content"
          >
            Envoyer le message
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Détail Message -->
    <q-dialog v-model="showMessageDetail" persistent>
      <q-card class="w-full" style="min-width: 80vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;" v-if="selectedMessage">
        <q-card-section class="flex items-center bg-green-50">
          <q-icon name="visibility" class="text-green-600 mr-3" size="2rem" />
          <div class="flex-1">
            <div class="text-xl font-semibold text-green-900">{{ selectedMessage.titre }}</div>
            <div class="text-sm text-green-700 space-y-1">
              <div>
                <q-icon name="person" size="xs" class="q-mr-xs" />
                Direction d'envoi: {{ selectedMessage.direction_envoi }}
                <span class="q-mx-sm">•</span>
                <q-icon name="schedule" size="xs" class="q-mr-xs" />
                {{ formatDate(selectedMessage.date_envoie) }}
              </div>
              <div v-if="selectedMessage.destinataires && selectedMessage.destinataires.length">
                 <q-icon name="send" size="xs" class="q-mr-xs" />
                 Destinataires:
                 <span v-for="(destinataire, index) in selectedMessage.destinataires.slice(0, 2)" :key="destinataire.id || destinataire.direction">
                   {{ destinataire.direction_destinataire }}<span v-if="index < Math.min(selectedMessage.destinataires.length, 2) - 1">, </span>
                 </span>
                 <span v-if="selectedMessage.destinataires.length > 2" class="text-green-600 font-medium">
                   +{{ selectedMessage.destinataires.length - 2 }}
                 </span>
               </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <div class="space-y-6">
            <!-- Contenu du message -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Contenu du message
              </label>
              <div class="bg-gray-50 p-4 rounded-lg border">
                 <div class="message-content text-gray-800" v-html="selectedMessage.texte">
                 </div>
               </div>
            </div>

            <!-- Destinataires/Directions -->
            <!-- <div v-if="selectedMessage.destinataires && selectedMessage.destinataires.length" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                <q-icon name="send" class="text-green-600 mr-1" />
                Destinataires ({{ selectedMessage.destinataires.length }})
              </label>
              <div class="bg-gray-50 p-4 rounded-lg border">
                <div class="flex flex-wrap gap-2">
                  <q-chip
                    v-for="destinataire in selectedMessage.destinataires"
                    :key="destinataire.id || destinataire.direction"
                    size="md"
                    color="blue"
                    text-color="white"
                    icon="business"
                    class="q-ma-xs"
                  >
                    {{ destinataire.direction_destinataire }}
                  </q-chip>
                </div>
              </div>
            </div> -->

            <!-- Fichiers joints -->
            <div v-if="selectedMessage.fichiers && selectedMessage.fichiers.length" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                <q-icon name="attach_file" class="text-green-600 mr-1" />
                Fichiers joints ({{ selectedMessage.fichiers.length }})
              </label>
              <div class="bg-gray-50 p-4 rounded-lg border">
                <q-list class="space-y-2">
                  <q-item v-for="fichier in selectedMessage.fichiers" :key="fichier.id" class="bg-white rounded-lg shadow-sm">
                    <q-item-section avatar>
                      <q-icon name="description" class="text-blue-600" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="font-medium">{{ fichier.nom_fichier }}</q-item-label>
                      <q-item-label caption class="text-gray-500">{{ fichier.taille_fichier }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        round
                        icon="download"
                        color="green-6"
                        @click="downloadFichier(fichier)"
                        class="hover:bg-green-50"
                      >
                        <q-tooltip>Télécharger</q-tooltip>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeMessageDetail"
            color="grey-6"
            outline
            no-caps
            class="px-6"
          >
            Fermer
          </q-btn>
          <q-btn
            @click="replyToMessage"
            color="green-6"
            no-caps
            unelevated
            class="px-6 ml-3"
          >
            Répondre
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Voir Réclamation - Design Moderne -->
    <q-dialog v-model="showTicketDetailDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- En-tête moderne avec gradient -->
        <q-card-section class="bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-black opacity-10"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="bg-white bg-opacity-20 p-3 rounded-full">
                <q-icon name="visibility" size="2rem" class="text-white" />
              </div>
              <div>
                <h2 class="text-2xl font-bold mb-1">Détails de la Réclamation</h2>
                <div class="flex items-center space-x-4 text-orange-100">
                  <span class="flex items-center">
                    <q-icon name="tag" class="mr-1" size="sm" />
                    Ticket #{{ currentTicketId }}
                  </span>
                  <span v-if="ticketDetails?.created_at" class="flex items-center">
                    <q-icon name="schedule" class="mr-1" size="sm" />
                    {{ new Date(ticketDetails.created_at).toLocaleDateString('fr-FR') }}
                  </span>
                  <span v-if="ticketDetails?.statut" class="flex items-center">
                    <q-icon name="info" class="mr-1" size="sm" />
                    {{ ticketDetails.statut }}
                  </span>
                </div>
              </div>
            </div>
            <q-btn
              icon="close"
              flat
              round
              size="lg"
              class="text-white hover:bg-white hover:bg-opacity-20 transition-colors"
              v-close-popup
            />
          </div>
        </q-card-section>

        <!-- Contenu principal avec scroll -->
        <q-card-section class="flex-1 overflow-auto p-0">
          <!-- États de chargement et d'erreur -->
          <div v-if="ticketDetailsLoading" class="flex flex-col items-center justify-center py-20">
            <div class="bg-white rounded-full p-6 shadow-lg mb-6">
              <q-spinner-dots size="60px" color="orange-6" />
            </div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Chargement en cours...</h3>
            <p class="text-gray-500">Récupération des détails de la réclamation</p>
          </div>

          <div v-else-if="ticketDetailsError" class="flex flex-col items-center justify-center py-20">
            <div class="bg-red-50 rounded-full p-6 mb-6">
              <q-icon name="error_outline" size="4rem" class="text-red-500" />
            </div>
            <h3 class="text-xl font-semibold text-red-600 mb-2">Erreur de chargement</h3>
            <p class="text-gray-600 mb-6 text-center max-w-md">{{ ticketDetailsError }}</p>
            <q-btn
              label="Réessayer"
              color="orange-6"
              unelevated
              @click="loadTicketDetails"
              class="px-8"
              icon="refresh"
            />
          </div>

          <!-- Contenu des détails -->
          <div v-else-if="ticketDetails" class="p-6 space-y-6">
            <!-- Résumé rapide en haut -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                <h3 class="text-lg font-semibold text-orange-800 flex items-center">
                  <q-icon name="subject" class="mr-2" />
                  Objet de la réclamation
                </h3>
              </div>
              <div class="p-6">
                <p class="text-gray-800 text-lg leading-relaxed">
                  {{ ticketDetails.objet || 'Non spécifié' }}
                </p>
              </div>
            </div>

            <!-- Layout en grille pour les sections principales -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <!-- Types de réclamation -->
              <div v-if="ticketDetails.types && ticketDetails.types.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                  <h3 class="text-lg font-semibold text-blue-800 flex items-center">
                    <q-icon name="category" class="mr-2" />
                    Types de réclamation
                    <q-badge color="blue-6" class="ml-2">{{ ticketDetails.types.length }}</q-badge>
                  </h3>
                </div>
                <div class="p-6 space-y-4">
                  <div v-for="type in ticketDetails.types" :key="type.b_rec_type_id" class="bg-gradient-to-r from-blue-50 to-transparent border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start space-x-3">
                      <div class="bg-blue-500 rounded-full p-1 mt-1">
                        <q-icon name="check" class="text-white" size="sm" />
                      </div>
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 mb-1">{{ type.libelle }}</h4>
                        <p v-if="type.description" class="text-sm text-gray-600 mb-3">{{ type.description }}</p>

                        <!-- Détails sélectionnés -->
                        <div v-if="type.details && type.details.length > 0" class="mt-3">
                          <p class="text-sm font-medium text-gray-700 mb-2">Détails sélectionnés :</p>
                          <div class="flex flex-wrap gap-2">
                            <q-chip
                              v-for="detail in type.details"
                              :key="detail.b_rec_detail_id"
                              color="green-6"
                              text-color="white"
                              size="sm"
                              icon="check_circle"
                            >
                              {{ detail.libelle }}
                            </q-chip>
                          </div>
                        </div>

                        <!-- Autre précision -->
                        <div v-if="type.autre" class="mt-3">
                          <p class="text-sm font-medium text-gray-700 mb-2">Précision supplémentaire :</p>
                          <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p class="text-sm text-purple-800">{{ type.autre }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informations générales -->
              <div v-if="ticketDetails.infos_generales && ticketDetails.infos_generales.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 border-b border-yellow-200">
                  <h3 class="text-lg font-semibold text-yellow-800 flex items-center">
                    <q-icon name="info" class="mr-2" />
                    Informations générales
                  </h3>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-1 gap-4">
                    <div v-for="info in ticketDetails.infos_generales" :key="info.info_general_id" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        {{ info.libelle }}
                      </label>
                      <div class="bg-white rounded-md p-3 border">
                        <span class="text-gray-800">{{ info.value || 'Non renseigné' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description détaillée - Pleine largeur -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-indigo-200">
                <h3 class="text-lg font-semibold text-indigo-800 flex items-center">
                  <q-icon name="description" class="mr-2" />
                  Description détaillée
                </h3>
              </div>
              <div class="p-6">
                <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 min-h-[200px]">
                  <div v-if="ticketDetails.description" v-html="ticketDetails.description" class="prose max-w-none text-gray-800"></div>
                  <div v-else class="flex items-center justify-center h-32">
                    <div class="text-center">
                      <q-icon name="edit_note" size="2rem" class="text-gray-400 mb-2" />
                      <p class="text-gray-500 italic">Aucune description fournie</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Documents et fichiers -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <!-- Documents à fournir -->
              <div v-if="ticketDetails.documentAFournir" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-cyan-50 to-cyan-100 px-6 py-4 border-b border-cyan-200">
                  <h3 class="text-lg font-semibold text-cyan-800 flex items-center">
                    <q-icon name="assignment" class="mr-2" />
                    Documents requis
                  </h3>
                </div>
                <div class="p-6">
                  <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <div class="text-cyan-800" v-html="ticketDetails.documentAFournir"></div>
                  </div>
                </div>
              </div>

              <!-- Fichiers joints -->
              <div v-if="ticketDetails.files && ticketDetails.files.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                  <h3 class="text-lg font-semibold text-green-800 flex items-center">
                    <q-icon name="attach_file" class="mr-2" />
                    Fichiers joints
                    <q-badge color="green-6" class="ml-2">{{ ticketDetails.files.length }}</q-badge>
                  </h3>
                </div>
                <div class="p-6 space-y-3">
                  <div
                    v-for="file in ticketDetails.files"
                    :key="file.id"
                    class="bg-gradient-to-r from-green-50 to-transparent border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="bg-green-500 rounded-lg p-2">
                          <q-icon
                            :name="getFileIconVoir(file.type_fichier)"
                            size="1.5rem"
                            class="text-white"
                          />
                        </div>
                        <div>
                          <p class="font-medium text-gray-800">{{ file.nom_fichier }}</p>
                          <p class="text-sm text-gray-500">{{ formatFileSizeVoir(file.taille_fichier) }}</p>
                        </div>
                      </div>
                      <q-btn
                        icon="download"
                        color="green-6"
                        round
                        unelevated
                        @click="downloadTicketFile(file)"
                        class="hover:scale-105 transition-transform"
                      >
                        <q-tooltip class="bg-green-6">Télécharger {{ file.nom_fichier }}</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Pied de page moderne -->
        <q-card-actions class="bg-white border-t border-gray-200 px-6 py-4">
          <q-space />
          <q-btn
            label="Fermer"
            color="grey-7"
            unelevated
            v-close-popup
            class="px-8"
            icon="close"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useTicketStore } from 'src/stores/ticket'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const ticketStore = useTicketStore()

// État réactif
const loading = ref(false)
const messages = ref([])
const showNewMessageDialog = ref(false)
const showMessageDetail = ref(false)
const selectedMessage = ref(null)
const sending = ref(false)
const showTicketDetailDialog = ref(false)
const ticketDetails = ref(null)
const ticketDetailsLoading = ref(false)
const ticketDetailsError = ref(null)

// Nouveau message
const newMessage = ref({
  subject: '',
  content: '',
  directions: [],
  attachments: []
})

// Upload
const newFiles = ref(null)
const loadingDirections = ref(false)
const directionOptions = ref([])



// Configuration du tableau
const columns = [
  {
    name: 'date_envoie',
    label: 'Date Envoi',
    align: 'left',
    field: 'date_envoie',
    sortable: true,
    format: (val) => formatDate(val)
  },
  {
    name: 'direction_envoi',
    label: 'Direction Envoi',
    align: 'left',
    field: 'direction_envoi',
    sortable: true
  },
  {
    name: 'destinataires',
    label: 'Destinataires',
    align: 'center',
    field: 'destinataires',
    sortable: false
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: 'actions',
    sortable: false
  }
]

// Configuration de la pagination
const pagination = ref({
  sortBy: 'date_envoie',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

// Computed
const currentTicketId = computed(() => ticketStore.t_rec_ticket_id)





// Méthodes
const goBack = () => {
  ticketStore.clearTicket()
  router.push('/reclamations/allTicket')
}

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  loadMessages()
}

const loadMessages = async () => {
  if (!currentTicketId.value) return

  loading.value = true
  try {
    const response = await api.get(`/api/rec/tickets/${currentTicketId.value}/messages`)

    if (response.data.success) {
      messages.value = response.data.data || []
       console.log('Messages chargés:', messages.value);
      // Mettre à jour le nombre total de lignes pour la pagination
      pagination.value.rowsNumber = messages.value.length
    } else {
      messages.value = []
      pagination.value.rowsNumber = 0
      $q.notify({
        type: 'warning',
        message: response.data.message || 'Aucun message trouvé'
      })
    }
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
    messages.value = []
    pagination.value.rowsNumber = 0
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des messages'
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const viewMessageDetail = (message) => {
  selectedMessage.value = message
  showMessageDetail.value = true
  // Marquer comme lu
  if (!message.isRead) {
    message.isRead = true
  }
}

const closeMessageDetail = () => {
  showMessageDetail.value = false
  selectedMessage.value = null
}

const sendMessage = async () => {
  console.log('Envoi du message:', newMessage.value);

  if (!newMessage.value.subject || !newMessage.value.content) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez remplir tous les champs obligatoires'
    })
    return
  }

  sending.value = true
  try {
    // Créer un FormData pour inclure les fichiers
     const formData = new FormData()
     formData.append('titre', newMessage.value.subject)
     formData.append('description', newMessage.value.content)
     formData.append('directions', JSON.stringify(newMessage.value.directions))

    // Ajouter les fichiers au FormData
    newMessage.value.attachments.forEach((attachment, index) => {
      if (attachment.file) {
        formData.append(`attachments[${index}]`, attachment.file)
      }
    })

    const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Message envoyé avec succès'
      })

      // Réinitialiser le formulaire
       newMessage.value = {
         title: '',
         content: '',
         description: '',
         directions: [],
         attachments: []
       }
       newFiles.value = null

       // Fermer le dialog
       showNewMessageDialog.value = false

       // Recharger les messages
       await loadMessages()
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi du message'
    $q.notify({
      type: 'negative',
      message: errorMessage
    })
  } finally {
    sending.value = false
  }
}

const closeNewMessageDialog = () => {
  showNewMessageDialog.value = false
  newMessage.value = {
    subject: '',
    content: '',
    directions: [],
    attachments: []
  }
  newFiles.value = null
}

const replyToMessage = (message = null) => {
  const messageToReply = message || selectedMessage.value
  newMessage.value.directions = [selectedMessage.value.direction_envoi]
  newMessage.value.content = null
  if (messageToReply) {
    closeMessageDetail()
    // newMessage.value.subject = `Re: ${messageToReply.subject}`
    showNewMessageDialog.value = true
  }
}

const deleteMessage = async (message) => {
  $q.dialog({
    title: 'Confirmer la suppression',
    message: `Êtes-vous sûr de vouloir supprimer ce message ?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Supprimer',
      color: 'negative',
      unelevated: true
    },
    cancel: {
      label: 'Annuler',
      color: 'grey',
      outline: true
    }
  }).onOk(async () => {
    try {
      loading.value = true
      const response = await api.delete(`/api/rec/tickets/${currentTicketId.value}/messages/${message.id}`)

      if (response.data.success) {
        $q.notify({
          type: 'positive',
          message: 'Message supprimé avec succès'
        })

        // Recharger les messages
        await loadMessages()
      } else {
        $q.notify({
          type: 'negative',
          message: response.data.message || 'Erreur lors de la suppression'
        })
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Erreur lors de la suppression du message'
      })
    } finally {
      loading.value = false
    }
  })
}

const downloadFichier = async (fichier) => {
  try {
    const response = await api.get(`/api/rec/messages/attachments/${fichier.id}/download`, {
      responseType: 'blob'
    })

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fichier.nom_fichier)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    $q.notify({
      type: 'positive',
      message: 'Téléchargement démarré',
      position: 'top'
    })
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du téléchargement du fichier',
      position: 'top'
    })
  }
}

// Méthodes pour l'upload de fichiers
const onNewFilesSelected = (files) => {
  if (files && files.length > 0) {
    console.log('Nouveaux fichiers sélectionnés:', files)
  }
}

const addFiles = () => {
  if (newFiles.value && newFiles.value.length > 0) {
    const filesCount = newFiles.value.length

    newFiles.value.forEach(file => {
      // Vérifier si le fichier n'est pas déjà dans la liste
      const exists = newMessage.value.attachments.some(att =>
        att.name === file.name && att.size === file.size
      )

      if (!exists) {
        newMessage.value.attachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file // Garder une référence au fichier original
        })
      }
    })

    // Réinitialiser la sélection
    newFiles.value = null

    $q.notify({
      type: 'positive',
      message: `${filesCount} fichier(s) ajouté(s)`,
      position: 'top'
    })
  }
}

const removeFile = (index) => {
  newMessage.value.attachments.splice(index, 1)
  $q.notify({
    type: 'info',
    message: 'Fichier supprimé',
    position: 'top'
  })
}

const onRejected = (rejectedEntries) => {
  let message = 'Fichier(s) rejeté(s): '
  rejectedEntries.forEach(entry => {
    if (entry.failedPropValidation === 'max-file-size') {
      message += `${entry.file.name} (trop volumineux), `
    } else if (entry.failedPropValidation === 'accept') {
      message += `${entry.file.name} (format non supporté), `
    }
  })

  $q.notify({
    type: 'negative',
    message: message.slice(0, -2),
    position: 'top'
  })
}

const getFileIcon = (fileType) => {
  if (!fileType) return 'description'

  if (fileType.startsWith('image/')) {
    return 'image'
  } else if (fileType === 'application/pdf') {
    return 'picture_as_pdf'
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return 'description'
  } else if (fileType.includes('text')) {
    return 'text_snippet'
  } else {
    return 'attach_file'
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Charger les directions disponibles
 const openTicketDetails = () => {
   showTicketDetailDialog.value = true
   loadTicketDetails()
 }

 const loadDirections = async () => {
   loadingDirections.value = true
   try {
     const response = await api.get('/api/rec/directions')

     if (response.data.success) {
       directionOptions.value = response.data.data.map(direction => ({
         label: direction.label,
         value: direction.value,
         id: direction.id
       }))
     } else {
       throw new Error(response.data.message || 'Erreur lors du chargement des directions')
     }
   } catch (error) {
     console.error('Erreur lors du chargement des directions:', error)
     $q.notify({
       type: 'negative',
       message: 'Erreur lors du chargement des directions'
     })

     // Fallback avec des directions par défaut en cas d'erreur
     directionOptions.value = [
       { label: 'Direction Générale', value: 'DG', id: 1 },
       { label: 'Direction Technique', value: 'DT', id: 2 },
       { label: 'Direction Commerciale', value: 'DC', id: 3 },
       { label: 'Direction des Ressources Humaines', value: 'DRH', id: 4 },
       { label: 'Direction Financière', value: 'DF', id: 5 }
     ]
   } finally {
     loadingDirections.value = false
   }
 }

const loadTicketDetails = async () => {
   if (!currentTicketId.value) return

   ticketDetailsLoading.value = true
   ticketDetailsError.value = null
   try {
     const response = await api.get(`/api/rec/tickets/${currentTicketId.value}/edit`)

     if (response.data.success) {
       ticketDetails.value = response.data.data
     } else {
       throw new Error(response.data.message || 'Erreur lors du chargement des détails')
     }
   } catch (error) {
     console.error('Erreur lors du chargement des détails du ticket:', error)
     ticketDetailsError.value = error.response?.data?.message || 'Erreur lors du chargement des détails du ticket'
   } finally {
     ticketDetailsLoading.value = false
   }
 }

const downloadTicketFile = async (file) => {
   try {
     const response = await api.get(`/api/rec/tickets/files/${file.id}/download`, {
       responseType: 'blob'
     })

     // Créer un lien de téléchargement
     const url = window.URL.createObjectURL(new Blob([response.data]))
     const link = document.createElement('a')
     link.href = url
     link.setAttribute('download', file.nom_fichier)
     document.body.appendChild(link)
     link.click()
     link.remove()
     window.URL.revokeObjectURL(url)

     $q.notify({
       type: 'positive',
       message: 'Téléchargement démarré',
       position: 'top'
     })
   } catch (error) {
     console.error('Erreur lors du téléchargement:', error)
     $q.notify({
       type: 'negative',
       message: 'Erreur lors du téléchargement du fichier',
       position: 'top'
     })
   }
 }

 // Fonctions utilitaires pour les fichiers
 const getFileIconVoir = (fileType) => {
   if (!fileType) return 'description'

   const type = fileType.toLowerCase()
   if (type.includes('image')) return 'image'
   if (type.includes('pdf')) return 'picture_as_pdf'
   if (type.includes('word') || type.includes('doc')) return 'description'
   if (type.includes('excel') || type.includes('sheet')) return 'table_chart'
   if (type.includes('text')) return 'text_snippet'
   return 'description'
 }

 const formatFileSizeVoir = (bytes) => {
   if (!bytes) return '0 B'

   const k = 1024
   const sizes = ['B', 'KB', 'MB', 'GB']
   const i = Math.floor(Math.log(bytes) / Math.log(k))

   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
 }

// Watchers
watch(currentTicketId, (newId) => {
  if (newId) {
    loadMessages()
  }
})

// Lifecycle
onMounted(() => {
  if (currentTicketId.value) {
    loadMessages()
  }
  loadDirections()
})
</script>

<style scoped>
.messages-table {
  /* Style personnalisé pour le tableau des messages */
}

.messages-table .q-table__top,
.messages-table .q-table__bottom,
.messages-table thead tr:first-child th {
  background-color: #f5f5f5;
}

.message-preview {
  line-height: 1.4;
  max-height: 2.8em;
  overflow: hidden;
  word-break: break-word;
}

.message-content {
  white-space: pre-wrap;
  line-height: 1.6;
}

/* Style pour les lignes du tableau */
.messages-table tbody tr:hover {
  background-color: #f0f8ff;
}

/* Style pour les boutons d'action */
.messages-table .q-btn {
  margin: 0 2px;
}
</style>
