<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="message" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Messages du Ticket</h1>
            <div v-if="hasCurrentTicket">
              <p class="text-gray-600 text-sm">
                <!-- Ticket ID: {{ currentTicketId }} -->
              </p>
              <!-- Affichage conditionnel du créateur -->
              <p class="text-blue-600 text-sm" v-if="createur">
                <q-icon name="person" size="sm" class="mr-1" />
                Créé par : {{ createur.nom_complet }}
              </p>
            </div>
            <p class="text-red-600 text-sm" v-else>
              Aucun ticket sélectionné .
            </p>
          </div>
        </div>
      </div>

      <!-- Alerte si aucun ticket sélectionné -->
      <div v-if="isNoTicketSelected" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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

      <!-- Alerte recours hors délai -->
      <q-banner v-if="isRecoursHorsDelai" class="bg-orange-50 border border-orange-200 rounded-lg mb-6" color="warning">
        <template #avatar>
          <q-icon name="warning" class="text-orange-600" size="1.5rem" />
        </template>
        <div class="text-orange-800">
          <p class="font-medium">⚠️ Ce recours a été effectué après la période autorisée (7 jours après la clôture).</p>
          <p class="text-sm mt-1">
            Date de clôture : {{ formatDate(ticket?.closed_at) }} |
            Date du recours : {{ formatDate(ticket?.date_recours) }}
          </p>
        </div>
      </q-banner>

      <!-- Section des directions du ticket -->        <!--condition si il est concerne par cet reclamation  -->
      <div v-if="showAssociatedDirections" class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="account_tree" size="1.5rem" class="text-green-600 mr-3" />
            <h2 class="text-lg font-semibold text-gray-800">Directions associées à ce ticket </h2>
          </div>
          <!-- confirmi conditioon v if essq ticket_direction.direction == cab ou commercial ou type orientation == ticket ou default -->
          <q-btn
            icon="add"
            color="green"
            size="sm"
            v-if="canAddDirection"
            round
            @click="openAddDirectionDialog"
            class="ml-auto"
          >
            <q-tooltip>Ajouter d'autres directions</q-tooltip>
          </q-btn>
          <!-- confirmi conditioon v if essq cab ou commercial ou type orientation == ticket ou default -->
          <q-btn
            icon="remove"
            color="red"
            size="sm"
            round
            v-if="canRemoveDirection"
            @click="openRemoveDirectionDialog"
            class="ml-2"
          >
            <q-tooltip>Supprimer des directions</q-tooltip>
          </q-btn>
        </div>
        <div class="flex flex-wrap gap-2">
          <q-chip
            v-for="direction in directionOptions"
            :key="direction.id"
            color="green"
            text-color="white"
            icon="business"
            class="text-sm"
          >
            {{ direction.label }}
          </q-chip>
        </div>
        <div v-if="isLoadingDirections" class="flex items-center justify-center py-4">
          <q-spinner color="green" size="2em" />
          <span class="ml-2 text-gray-600">Chargement des directions...</span>
        </div>
      </div>

      <!-- Liste des messages -->
      <div v-if="hasCurrentTicket">
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
              icon="assignment_turned_in"
              color="purple-6"
              no-caps
              v-if="canShowConclusionButton"
              @click="openConclusionDialog"
              :disable="!currentTicketId"
              class="px-6 q-ml-sm"
            >
              Voir Conclusion
            </q-btn>
            <q-btn
              icon="add"
              color="blue-6"
              no-caps
              v-if="canShowNewMessageButton"
              @click="openNewMessageDialog"
              :disable="!currentTicketId"
              class="px-6"
            >
              Nouveau Message
            </q-btn>
            <!-- ticket_direction.type_orientation=='ticket' a confimet -->
            <q-btn
              icon="reply"
              color="green-6"
              no-caps
              v-if="canShowReplyButton"
              @click="openReplyDialog"
              :disable="!currentTicketId"
              class="px-6 q-ml-sm"
            >
              Réponse
            </q-btn>
            <q-btn
              icon="gavel"
              color="blue-6"
              no-caps
               v-if="canShowRecourButton"
              @click="openRecourDialog"
              :disable="!currentTicketId"
              class="px-6 q-ml-sm"
            >
              Recour
            </q-btn>
            <!-- ticket a confirmet -->
            <q-btn
              icon="check_circle"
              color="red-6"
              no-caps
               v-if="canShowCloseButton"
              @click="openCloseDialog"
              :disable="!currentTicketId"
              class="px-6 q-ml-sm"
            >
              Clôturer la réclamation
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
            <!-- <q-btn
              flat
              round
              color="red"
              icon="delete"
              size="sm"
              v-if="(ticket_direction!=null && ticket_direction.statut_direction=='traitement'
              && ticket_direction.direction==props.row.direction_envoi
               && props.row.id == lastUserMessageId)
               && props.row.message_vers != 'client'
              && ticket.status!='clôturé' && ticket.status!='Recours clôturé'"
              @click="deleteMessage(props.row)"
              class="q-ml-xs"
            >
              <q-tooltip>Supprimer </q-tooltip>
            </q-btn> -->
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
          <div v-if="hasNewMessageAttachments" class="mt-3">
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

    <!-- Dialog Réponse -->
    <q-dialog v-model="showReplyDialog" persistent>
      <q-card class="w-full" style="min-width: 80vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-green-50">
          <q-icon name="reply" class="text-green-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-green-900">Réponse</div>
            <div class="text-sm text-green-700">Répondre au ticket {{ currentTicketId }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <q-form @submit="sendReplyMessage" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Titre -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Titre <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="replyMessage.subject"
                  outlined
                  dense
                  placeholder="Entrez le titre du message"
                  :rules="[val => !!val || 'Le titre est requis']"
                >
                  <template #prepend>
                    <q-icon name="title" class="text-green-600" />
                  </template>
                </q-input>
              </div>

              <!-- Description avec QEditor -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Description <span class="text-red-500">*</span>
                </label>
                <q-editor
                  v-model="replyMessage.content"
                  min-height="200px"
                  :toolbar="[
                    ['bold', 'italic', 'underline'],
                    ['unordered', 'ordered'],
                    ['undo', 'redo']
                  ]"
                  placeholder="Rédigez votre message..."
                />
              </div>

              <!-- Upload de fichiers -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Fichiers joints (optionnel)
                </label>

                <!-- Zone d'ajout de fichiers -->
                <div class="flex gap-3 mb-3">
                  <q-file
                    v-model="replyFiles"
                    multiple
                    outlined
                    dense
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                    max-file-size="10485760"
                    class="flex-1"
                    @rejected="onRejected"
                    @update:model-value="onReplyFilesSelected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" class="text-green-600" />
                    </template>
                    <template v-slot:hint>
                      Formats acceptés: Images, PDF, Word. Taille max: 10Mo par fichier
                    </template>
                  </q-file>

                  <q-btn
                    label="Ajouter"
                    color="green-6"
                    outline
                    :disable="!replyFiles || replyFiles.length === 0"
                    @click="addReplyFiles"
                    class="px-4"
                  >
                    <q-icon name="add" class="mr-1" />
                  </q-btn>
                </div>

                <!-- Liste des fichiers sélectionnés -->
          <div v-if="hasReplyAttachments" class="mt-3">
                  <div class="text-sm font-medium text-gray-700 mb-2">
                    Fichiers sélectionnés ({{ replyMessage.attachments.length }}) :
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(file, index) in replyMessage.attachments"
                      :key="index"
                      class="flex items-center justify-between bg-gray-50 p-3 rounded-md border"
                    >
                      <div class="flex items-center">
                        <q-icon
                          :name="getFileIcon(file.type)"
                          size="1.5rem"
                          class="text-green-600 mr-3"
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
                        @click="removeReplyFile(index)"
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
            @click="closeReplyDialog"
            color="grey-6"
            outline
            no-caps
            class="px-6"
          >
            Annuler
          </q-btn>
          <q-btn
            @click="sendReplyMessage"
            color="green-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            :loading="sendingReply"
            :disable="!replyMessage.subject || !replyMessage.content"
          >
            Envoyer la réponse
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Recour -->
    <q-dialog v-model="showRecourDialog" persistent>
      <q-card class="w-full" style="min-width: 80vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-blue-50">
          <q-icon name="gavel" class="text-blue-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-blue-900">Recour</div>
            <div class="text-sm text-blue-700">Envoyer un recour pour le ticket {{ currentTicketId }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <q-form @submit="sendRecourMessage" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Titre -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Titre <span class="text-red-500">*</span>
                </label>
                <q-input
                  v-model="recourMessage.subject"
                  outlined
                  dense
                  placeholder="Entrez le titre du recour"
                  :rules="[val => !!val || 'Le titre est requis']"
                >
                  <template #prepend>
                    <q-icon name="title" class="text-blue-600" />
                  </template>
                </q-input>
              </div>

              <!-- Description -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Description <span class="text-red-500">*</span>
                </label>
                <q-editor
                  v-model="recourMessage.content"
                  min-height="200px"
                  :toolbar="[
                    ['bold', 'italic', 'underline'],
                    ['unordered', 'ordered'],
                    ['undo', 'redo']
                  ]"
                  placeholder="Expliquez le recour..."
                />
              </div>

              <!-- Directions -->


              <!-- Fichiers -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Fichiers joints (optionnel)
                </label>

                <div class="flex gap-3 mb-3">
                  <q-file
                    v-model="recourFiles"
                    multiple
                    outlined
                    dense
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                    max-file-size="10485760"
                    class="flex-1"
                    @rejected="onRejected"
                    @update:model-value="onRecourFilesSelected"
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
                    :disable="!recourFiles || recourFiles.length === 0"
                    @click="addRecourFiles"
                    class="px-4"
                  >
                    <q-icon name="add" class="mr-1" />
                  </q-btn>
                </div>

          <div v-if="hasRecourAttachments" class="mt-3">
                  <div class="text-sm font-medium text-gray-700 mb-2">
                    Fichiers sélectionnés ({{ recourMessage.attachments.length }}) :
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(file, index) in recourMessage.attachments"
                      :key="index"
                      class="flex items-center justify-between bg-gray-50 p-3 rounded-md border"
                    >
                      <div class="flex items-center">
                        <q-icon
                          :name="getFileIcon(file.type)"
                          size="1.5rem"
                          class="text-orange-600 mr-3"
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
                        @click="removeRecourFile(index)"
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
          <q-btn @click="closeRecourDialog" color="grey-6" outline no-caps class="px-6">Annuler</q-btn>
          <q-btn
            @click="sendRecourMessage"
            color="orange-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            :loading="sendingRecour"
            :disable="!recourMessage.subject || !recourMessage.content"
          >
            Envoyer le recour
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Conclusion -->
    <q-dialog v-model="showConclusionDialog" persistent>
      <q-card class="w-full" style="min-width: 70vw; max-width: 85vw; max-height: 90vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-purple-50">
          <q-icon name="assignment_turned_in" class="text-purple-600 mr-3" size="2rem" />
          <div class="flex-1">
            <div class="text-xl font-semibold text-purple-900">Conclusion de la réclamation</div>
            <div class="text-sm text-purple-700 space-x-3 flex items-center">
      <span class="flex items-center" v-if="hasTicketClosedAt">
                <q-icon name="schedule" class="mr-1" size="sm" />
                {{ formatDate(ticket.closed_at) }}
              </span>
      <q-chip square color="purple-6" text-color="white" v-if="hasTicketStatus" class="q-ml-sm">
                {{ ticket.status }}
              </q-chip>
            </div>
          </div>
          <q-btn icon="close" flat round size="lg" class="text-purple-600" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="flex-1 overflow-auto p-0">
          <div class="p-6">
      <div v-if="hasTicketConclusion" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                <h3 class="text-lg font-semibold text-purple-800 flex items-center">
                  <q-icon name="text_snippet" class="mr-2" />
                  Conclusion enregistrée
                </h3>
              </div>
              <div class="p-6 prose max-w-none">
                <div v-html="ticket.conclusion"></div>
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-16">
              <div class="bg-purple-50 rounded-full p-6 mb-6">
                <q-icon name="info" size="4rem" class="text-purple-500" />
              </div>
              <h3 class="text-xl font-semibold text-purple-700 mb-2">Aucune conclusion disponible</h3>
              <p class="text-gray-600 text-center max-w-md">La réclamation ne contient pas de conclusion enregistrée pour le moment.</p>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn @click="closeConclusionDialog" color="grey-6" outline no-caps class="px-6">Fermer</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Détail Message -->
    <q-dialog v-model="showMessageDetail" persistent>
      <q-card class="w-full" style="min-width: 80vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;" v-if="hasSelectedMessage">
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
      <div v-if="hasSelectedMessageDestinataires" class="space-y-2">
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
            </div>

            <!-- Fichiers joints -->
      <div v-if="hasSelectedMessageFiles" class="space-y-2">
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
            @click="replyToMessage(selectedMessage)"
            color="green-6"
            v-if="(selectedMessage.destinataires[0].direction_destinataire!='client'
              && selectedMessage.destinataires[0].direction_destinataire!='directions' && ticket_direction!=null
              && ticket_direction.statut_direction=='traitement'
              && ticket.status!='clôturé' && ticket.status!='Recours clôturé')
            ||(selectedMessage.destinataires[0].direction_destinataire=='client'  && canClientReply
              && ticket.status!='clôturé' && ticket.status!='Recours clôturé' && ticket.user_id==authStore.user.id )
            ||(selectedMessage.destinataires[0].direction_destinataire=='directions'  && canClientReply
              && ticket.status!='clôturé' && ticket.status!='Recours clôturé' && ticket_direction!=null && ticket_direction.type_orientation=='ticket')
            "
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
    <q-dialog v-model="showTicketDetailDialog" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-gradient-to-br from-gray-50 to-gray-100" style="width: 90vw; height: 90vh; max-width: 90vw; max-height: 90vh;">
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
                  <!-- <span class="flex items-center">
                    <q-icon name="tag" class="mr-1" size="sm" />
                    Ticket #{{ currentTicketId }}
                  </span> -->
      <span v-if="hasTicketDetailsCreatedAt" class="flex items-center">
                    <q-icon name="schedule" class="mr-1" size="sm" />
                    {{ new Date(ticketDetails.created_at).toLocaleDateString('fr-FR') }}
                  </span>
      <span v-if="hasTicketDetailsStatut" class="flex items-center">
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
          <div v-if="isTicketDetailsLoading" class="flex flex-col items-center justify-center py-20">
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
      <div v-if="hasTicketDetailsTypes" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
      <div v-if="hasTicketDetailsInfosGenerales" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
      <div v-if="hasTicketDetailsDescription" v-html="ticketDetails.description" class="prose max-w-none text-gray-800"></div>
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
      <div v-if="hasTicketDetailsDocumentAFournir" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
      <div v-if="hasTicketDetailsFiles" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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

    <!-- Dialog pour ajouter d'autres directions -->
    <q-dialog v-model="showAddDirectionDialog" persistent>
      <q-card class="w-96">
        <q-card-section class="bg-green-600 text-white">
          <div class="text-h6">Ajouter d'autres directions</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-select
            v-model="selectedStatutDirection"
            :options="['traitement', 'consultation']"
            label="Statut de direction"
            outlined
            dense
            class="q-mb-md"
          />
          <q-select
            v-model="selectedAdditionalDirections"
            :options="directionsNonConcerneOptions"
            label="Sélectionner les directions"
            multiple
            use-chips
            stack-label
            option-value="value"
            option-label="label"
            emit-value
            map-options
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Annuler"
            color="grey-7"
            flat
            v-close-popup
            @click="selectedAdditionalDirections = []"
          />
          <q-btn
            label="Ajouter"
            color="green"
            unelevated
            @click="addAdditionalDirections"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog pour supprimer des directions -->
    <q-dialog v-model="showRemoveDirectionDialog" persistent>
      <q-card class="w-96">
        <q-card-section class="bg-red-600 text-white">
          <div class="text-h6">Supprimer des directions</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-select
            v-model="selectedRemoveDirections"
            :options="directionOptions"
            label="Sélectionner les directions à supprimer"
            multiple
            use-chips
            stack-label
            option-value="value"
            option-label="label"
            emit-value
            map-options
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Annuler"
            color="grey-7"
            flat
            v-close-popup
            @click="selectedRemoveDirections = []"
          />
          <q-btn
            label="Supprimer"
            color="red"
            unelevated
            @click="removeSelectedDirections"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de confirmation de clôture -->
    <q-dialog v-model="showCloseDialog" persistent>
      <q-card class="rounded-lg shadow-2 flex flex-col" style="width: 900px; max-width: 95vw; height: 70vh;">
        <q-card-section class="bg-red-600 text-white">
          <div class="text-h6">Clôturer la réclamation</div>
          <div class="text-caption">Cette action est irréversible.</div>
        </q-card-section>

        <q-card-section style="flex: 1; overflow: auto;">
          <p class="text-gray-700 q-mb-md">Veuillez saisir la conclusion de la clôture (obligatoire) :</p>
          <q-editor
            v-model="closeConclusion"
            min-height="20rem"
            :definitions="{}">
          </q-editor>
          <div class="text-negative text-caption q-mt-xs" v-if="!isConclusionValid">
            La conclusion est obligatoire.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Annuler"
            color="grey-7"
            flat
            v-close-popup
          />
          <q-btn
            label="Confirmer la clôture"
            color="red-6"
            :loading="isClosing"
            :disable="!isConclusionValid"
            @click="closeTicket"
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
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore()
const $q = useQuasar()
const router = useRouter()
const ticketStore = useTicketStore()

// État réactif
const loading = ref(false)
const ticket_direction = ref(false)
const ticket = ref(false)
const privilege = ref(false)
const messages = ref([])
const createur = ref(null) // Informations du créateur du ticket
const showNewMessageDialog = ref(false)
const showMessageDetail = ref(false)
const selectedMessage = ref(null)
const sending = ref(false)
const sendingRecour = ref(false)
const showTicketDetailDialog = ref(false)
const ticketDetails = ref(null)
const ticketDetailsLoading = ref(false)
const ticketDetailsError = ref(null)
// Conclusion du ticket
const showConclusionDialog = ref(false)

// Nouveau message
const newMessage = ref({
  subject: '',
  content: '',
  directions: [],
  attachments: []
})

// Recour message
const showRecourDialog = ref(false)
const recourFiles = ref(null)
const recourMessage = ref({
  subject: '',
  content: '',
  attachments: []
})

// Upload
const newFiles = ref(null)
const loadingDirections = ref(false)
const directionOptions = ref([])
const directionsNonConcerneOptions = ref([])
const showAddDirectionDialog = ref(false)
const selectedAdditionalDirections = ref([])
const selectedStatutDirection = ref('traitement')
// Suppression de directions
const showRemoveDirectionDialog = ref(false)
const selectedRemoveDirections = ref([])
// Clôture
const showCloseDialog = ref(false)
const isClosing = ref(false)
const closeConclusion = ref('')




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
  rowsPerPage: 10
})

// Computed
const isConclusionValid = computed(() => {
  const text = closeConclusion.value || ''
  const stripped = text.replace(/<[^>]*>/g, '').trim()
  return stripped.length > 0
})

const currentTicketId = computed(() => ticketStore.t_rec_ticket_id)


const clientMessages = computed(() => {
  return messages.value.filter(message =>
    message.destinataires?.some(d => (d.direction_destinataire == 'client' || d.direction_destinataire == 'directions'))
  );
});

// Détermine si le client peut envoyer une réponse
const canClientReply = computed(() => {
  let reponse=null;
if(ticket.value.reply_permission=='employe_Répondeur'){
  if(ticket.value.user_id==authStore.user.id){
      reponse= false;
  }else{
      reponse= true;
  }
}else{
  if(ticket.value.user_id==authStore.user.id){
      reponse= true;
  }else{
      reponse= false;
  }
}

  return reponse;
});

const lastUserMessageId = computed(() => {
  if (!messages.value || messages.value.length === 0) return null;

  // Filtrer les messages envoyés par la direction courante
  const userMessages = messages.value.filter(
    m => m.direction_envoi === ticket_direction.value?.direction
  );

  if (userMessages.length === 0) return null;

  // Trier les messages selon la date d'envoi (ou ID si auto-incrémenté)
  const lastMessage = [...userMessages].sort((a, b) => b.id - a.id)[0];

  return lastMessage ? lastMessage.id : null;
});

const lastMessageVersClient = computed(() => {
  if (!messages.value || messages.value.length === 0) return false;

  // Prendre le dernier message selon l'ID (ou created_at si tu préfères)
  const lastMessage = [...messages.value].sort((a, b) => b.id - a.id)[0];
  // Vérifie s'il est destiné au client
  return lastMessage && lastMessage.message_vers == 'direction vers client' && lastMessage.direction_envoi=='client';
});

const hasMessageVersClient = computed(() => {
  if (!messages.value || messages.value.length === 0) return false;
  return messages.value.some(m => m.message_vers === 'direction vers client');
});

// Visibilité UI (computed) — garde la logique inchangée
const hasCurrentTicket = computed(() => !!currentTicketId.value)
const isNoTicketSelected = computed(() => !currentTicketId.value)
const showAssociatedDirections = computed(() => !!currentTicketId.value && directionOptions.value.length > 0 && privilege.value?.role=='employe_Répondeur' && ticket_direction.value!=null)
const canAddDirection = computed(() => ticket_direction.value?.statut_direction=='traitement' && ticket_direction.value?.type_orientation=='ticket' && ticket.value?.status!='clôturé' && ticket.value?.status!='Recours clôturé')
const canRemoveDirection = computed(() => ticket_direction.value?.statut_direction=='traitement' && ticket_direction.value?.type_orientation=='ticket' && ticket.value?.status!='clôturé' && ticket.value?.status!='Recours clôturé')
const isLoadingDirections = computed(() => loadingDirections.value)

const canShowConclusionButton = computed(() => ['clôturé','Recours clôturé'].includes(ticket.value?.status))
const canShowNewMessageButton = computed(() => ticket_direction.value!=null && ticket_direction.value.statut_direction=='traitement' && ticket.value?.status!='clôturé' && ticket.value?.status!='Recours clôturé')
const canShowReplyButton = computed(() => (
  ticket.value?.user_id==authStore.user.id && canClientReply.value && ticket_direction.value==null &&
  ticket.value?.status!='clôturé' && ticket.value?.status!='Recours clôturé'
) || (
  ticket_direction.value!=null && ticket_direction.value.statut_direction=='traitement' &&
  ticket_direction.value.type_orientation=='ticket' && canClientReply.value &&
  (ticket.value?.privilege_crateur?.role!='employe_Répondeur' || ticket.value?.ticket_direction_crateur==null) &&
  ticket.value?.status!='clôturé' && ticket.value?.status!='Recours clôturé'
))
const canShowRecourButton = computed(() => ticket.value?.user_id==authStore.user.id && ticket.value?.status=='clôturé' && (ticket.value?.privilege_crateur?.role!='employe_Répondeur' || ticket.value?.ticket_direction_crateur==null))
const canShowCloseButton = computed(() => (
  ticket_direction.value!=null && ticket_direction.value.statut_direction=='traitement' &&
  ticket_direction.value.type_orientation=='ticket' &&
  (hasMessageVersClient.value || ticket.value?.status=='Recours' || (ticket.value?.privilege_crateur?.role=='employe_Répondeur' && ticket.value?.ticket_direction_crateur!=null))
) && ticket.value?.status!='clôturé' && ticket.value?.status!='Recours clôturé')

// Attachments
const hasNewMessageAttachments = computed(() => (newMessage.value.attachments?.length || 0) > 0)
const hasReplyAttachments = computed(() => (replyMessage.value.attachments?.length || 0) > 0)
const hasRecourAttachments = computed(() => (recourMessage.value.attachments?.length || 0) > 0)

// Ticket chips
const hasTicketClosedAt = computed(() => !!ticket.value?.closed_at)
const hasTicketStatus = computed(() => !!ticket.value?.status)
const hasTicketConclusion = computed(() => !!ticket.value?.conclusion)

// Vérification recours hors délai
const isRecoursHorsDelai = computed(() => {
  // Vérifier si le ticket est en statut "Recours"
  if (ticket.value?.status !== 'Recours') {
    return false
  }

  // Vérifier si les dates nécessaires sont présentes
  if (!ticket.value?.closed_at || !ticket.value?.date_recours) {
    return false
  }

  try {
    // Convertir les dates
    const dateCloture = new Date(ticket.value.closed_at)
    const dateRecours = new Date(ticket.value.date_recours)

    // Calculer la date limite (date de clôture + 7 jours)
    const dateLimite = new Date(dateCloture)
    dateLimite.setDate(dateLimite.getDate() + 7)

    // Vérifier si le recours a été effectué après la période autorisée
    return dateRecours > dateLimite
  } catch (error) {
    console.error('Erreur lors du calcul du délai de recours:', error)
    return false
  }
})

// Message sélectionné
const hasSelectedMessage = computed(() => !!selectedMessage.value)
const hasSelectedMessageDestinataires = computed(() => !!selectedMessage.value?.destinataires && selectedMessage.value.destinataires.length > 0)
const hasSelectedMessageFiles = computed(() => !!selectedMessage.value?.fichiers && selectedMessage.value.fichiers.length > 0)

// Détails du ticket
const isTicketDetailsLoading = computed(() => !!ticketDetailsLoading.value)
const hasTicketDetailsCreatedAt = computed(() => !!ticketDetails.value?.created_at)
const hasTicketDetailsStatut = computed(() => !!ticketDetails.value?.statut)
const hasTicketDetailsTypes = computed(() => !!ticketDetails.value?.types && ticketDetails.value.types.length > 0)
const hasTicketDetailsInfosGenerales = computed(() => !!ticketDetails.value?.infos_generales && ticketDetails.value.infos_generales.length > 0)
const hasTicketDetailsDescription = computed(() => !!ticketDetails.value?.description)
const hasTicketDetailsDocumentAFournir = computed(() => !!ticketDetails.value?.documentAFournir)
const hasTicketDetailsFiles = computed(() => !!ticketDetails.value?.files && ticketDetails.value.files.length > 0)

// Méthodes
const goBack = () => {
  ticketStore.clearTicket()
  router.push('/reclamations/allTicket')
}



// Clôturer la réclamation
const closeTicket = async () => {
  if (!currentTicketId.value) return
  // Sécurité: rafraîchir et revalider la condition de clôture
  await loadMessages()
  await loadDirections()
  if (!canShowCloseButton.value) {
    $q.notify({ type: 'warning', message: 'Clôture non autorisée dans l’état actuel du ticket', position: 'top' })
    // Fermer le q-dialog
    showCloseDialog.value = false
    return
  }
  isClosing.value = true
  try {
    const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/close`, {
      conclusion: closeConclusion.value,
      status: 'clôturé'
    })
    if (response.data && response.data.success) {
      $q.notify({ type: 'positive', message: 'Réclamation clôturée avec succès', position: 'top' })
      showCloseDialog.value = false
      closeConclusion.value = ''
      // Nettoyer le store et rediriger vers la liste
      ticketStore.clearTicket()
      router.push('/reclamations/allTicket')
    } else {
      throw new Error(response.data?.message || 'Échec de la clôture du ticket')
    }
  } catch (error) {
    console.error('Erreur de clôture:', error)
    $q.notify({ type: 'negative', message: 'Erreur lors de la clôture de la réclamation', position: 'top' })
  } finally {
    isClosing.value = false
  }
}
const loadMessages = async () => {
  if (!currentTicketId.value) return

  loading.value = true
  try {
    const response = await api.get(`/api/rec/tickets/${currentTicketId.value}/messages`)

    if (response.data.success) {
      messages.value = response.data.data || []
      ticket_direction.value = response.data.ticket_direction || null
      ticket.value = response.data.ticket || null
      privilege.value = response.data.privilege || null
      createur.value = response.data.createur || null // Récupérer les infos du créateur
      if(!showCloseDialog.value){
        closeConclusion.value = ticket.value.conclusion
      }
    } else {
      messages.value = []
      $q.notify({
        type: 'warning',
        message: response.data.message || 'Aucun message trouvé'
      })
    }
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
    messages.value = []
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

  // Rafraîchir et revalider avant envoi
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
    // Fermer le q-dialog pour éviter les actions ultérieures
    showNewMessageDialog.value = false
    return
  }
  await loadMessages()
  await loadDirections()
  if (!canShowNewMessageButton.value) {
    $q.notify({ type: 'warning', message: 'Création de message non autorisée dans cet état', position: 'top' })
    // Fermer le q-dialog
    showNewMessageDialog.value = false
    return
  }

  if (!newMessage.value.subject || !newMessage.value.content) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez remplir tous les champs obligatoires'
    })
    return
  }

  sending.value = true
  try {
    // Ajouter les fichiers sélectionnés avant l'envoi même si les fichiers n'ont pas été ajoutés
    addFiles()

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

// État et logique pour le dialogue de réponse
const showReplyDialog = ref(false)
const sendingReply = ref(false)
const replyFiles = ref(null)
const replyMessage = ref({
  subject: '',
  content: '',
  attachments: []
})

const closeReplyDialog = () => {
  showReplyDialog.value = false
  replyMessage.value = { subject: '', content: '', attachments: [] }
  replyFiles.value = null
}

const closeRecourDialog = () => {
  showRecourDialog.value = false
  recourMessage.value = { subject: '', content: '', attachments: [] }
  recourFiles.value = null
}

const onReplyFilesSelected = (files) => {
  replyFiles.value = files
}

const addReplyFiles = () => {
  if (!replyFiles.value || replyFiles.value.length === 0) return
  replyFiles.value.forEach(file => {
    replyMessage.value.attachments.push({
      name: file.name,
      size: file.size,
      type: file.type,
      file
    })
  })
  replyFiles.value = null
}

const onRecourFilesSelected = (files) => {
  recourFiles.value = files
}

const addRecourFiles = () => {
  if (!recourFiles.value || recourFiles.value.length === 0) return
  recourFiles.value.forEach(file => {
    recourMessage.value.attachments.push({
      name: file.name,
      size: file.size,
      type: file.type,
      file
    })
  })
  recourFiles.value = null
}

const removeRecourFile = (index) => {
  recourMessage.value.attachments.splice(index, 1)
}

const removeReplyFile = (index) => {
  replyMessage.value.attachments.splice(index, 1)
}

const sendReplyMessage = async () => {
  // Rafraîchir et revalider avant envoi
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
    // Fermer le q-dialog
    closeReplyDialog()
    return
  }
  await loadMessages()
  await loadDirections()
  if (!canShowReplyButton.value) {
    $q.notify({ type: 'warning', message: 'Réponse non autorisée pour l’état actuel du ticket', position: 'top' })
    // Fermer le q-dialog
    closeReplyDialog()
    return
  }

  if (!replyMessage.value.subject || !replyMessage.value.content) {
    $q.notify({ type: 'negative', message: 'Veuillez remplir tous les champs obligatoires' })
    return
  }

  sendingReply.value = true
  try {
    // Ajouter les fichiers sélectionnés avant l'envoi même si les fichiers n'ont pas été ajoutés
    addReplyFiles()

    const formData = new FormData()
    formData.append('titre', replyMessage.value.subject)
    formData.append('description', replyMessage.value.content)
    // Pas de directions dans la réponse

    replyMessage.value.attachments.forEach((attachment, index) => {
      if (attachment.file) {
        formData.append(`attachments[${index}]`, attachment.file)
      }
    })

    const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/messages/reply  `, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data.success) {
      $q.notify({ type: 'positive', message: 'Réponse envoyée avec succès' })
      closeReplyDialog()
      await loadMessages()
    } else {
      $q.notify({ type: 'warning', message: response.data.message || 'Échec de l’envoi de la réponse' })
    }
  } catch (error) {
    console.error('Erreur lors de l’envoi de la réponse:', error)
    $q.notify({ type: 'negative', message: 'Erreur lors de l’envoi de la réponse' })
  } finally {
    sendingReply.value = false
  }
}

const sendRecourMessage = async () => {
  // Rafraîchir et revalider avant envoi
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
    // Fermer le q-dialog
   closeRecourDialog()
    return
  }
  await loadMessages()
  await loadDirections()
  if (!canShowRecourButton.value) {
    $q.notify({ type: 'warning', message: 'Recour non disponible pour l’état actuel du ticket', position: 'top' })
    // Fermer le q-dialog
   closeRecourDialog()
    return
  }

  if (!recourMessage.value.subject || !recourMessage.value.content) {
    $q.notify({ type: 'negative', message: 'Veuillez remplir tous les champs obligatoires' })
    return
  }

  sendingRecour.value = true
  try {
    // Ajouter les fichiers sélectionnés avant l'envoi même si les fichiers n'ont pas été ajoutés
    addRecourFiles()

    const formData = new FormData()
    formData.append('titre', recourMessage.value.subject)
    formData.append('description', recourMessage.value.content)

    recourMessage.value.attachments.forEach((attachment, index) => {
      if (attachment.file) {
        formData.append(`attachments[${index}]`, attachment.file)
      }
    })

    const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/messages/recour`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data.success) {
      $q.notify({ type: 'positive', message: 'Recour envoyé avec succès' })
      closeRecourDialog()
      await loadMessages()
    } else {
      $q.notify({ type: 'warning', message: response.data.message || 'Échec de l’envoi du recour' })
    }
  } catch (error) {
    console.error('Erreur lors de l’envoi du recour:', error)
    $q.notify({ type: 'negative', message: 'Erreur lors de l’envoi du recour' })
  } finally {
    sendingRecour.value = false
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
  if (messageToReply.destinataires[0].direction_destinataire!='directions'&& messageToReply.destinataires[0].direction_destinataire!='client')  {
    closeMessageDetail()
    // newMessage.value.subject = `Re: ${messageToReply.subject}`
    showNewMessageDialog.value = true;
  }else {
    showReplyDialog.value = true;
        closeMessageDetail();

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

 // Ouvrir/fermer le dialogue de conclusion (sécurisé)
 const openConclusionDialog = async () => {
   await loadMessages()
   await loadDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canShowConclusionButton.value) {
     showConclusionDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Conclusion non disponible pour l’état actuel du ticket', position: 'top' })
   }
 }

 const closeConclusionDialog = () => {
   showConclusionDialog.value = false
 }

 // Ouverture des autres dialogues via fonctions dédiées (sécurisées)
 const openNewMessageDialog = async () => {
   await loadMessages()
   await loadDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canShowNewMessageButton.value) {
     showNewMessageDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Création de message non autorisée dans cet état', position: 'top' })
   }
 }

 const openReplyDialog = async () => {
   await loadMessages()
   await loadDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canShowReplyButton.value) {
     showReplyDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Réponse non autorisée pour l’état actuel du ticket', position: 'top' })
   }
 }

 const openRecourDialog = async () => {
   await loadMessages()
   await loadDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canShowRecourButton.value) {
     showRecourDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Recour non disponible pour l’état actuel du ticket', position: 'top' })
   }
 }

 const openCloseDialog = async () => {
   await loadMessages()
   await loadDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canShowCloseButton.value) {
     showCloseDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Clôture non autorisée dans l’état actuel du ticket', position: 'top' })
   }
 }

 const openAddDirectionDialog = async () => {
   await loadMessages()
   await loadDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canAddDirection.value) {
     showAddDirectionDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Ajout de directions non autorisé dans cet état', position: 'top' })
   }
 }

 const openRemoveDirectionDialog = async () => {
   await loadMessages()
   await loadDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canRemoveDirection.value) {
     showRemoveDirectionDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Suppression de directions non autorisée dans cet état', position: 'top' })
   }
 }

 const loadDirections = async () => {
   loadingDirections.value = true
   try {
     const response = await api.get(`/api/rec/directions_ticket/${currentTicketId.value}`)

     if (response.data.success) {
       directionOptions.value = response.data.data.map(direction => ({
         label: direction.label,
         value: direction.value,
         id: direction.id
       }))

       directionsNonConcerneOptions.value = response.data.directionsNonConcerne.map(direction => ({
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

 // Fonction pour ajouter des directions supplémentaires (envoi au backend)
const addAdditionalDirections = async () => {
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné' })
    // Fermer le q-dialog
    showAddDirectionDialog.value = false
    return
  }

  // Rafraîchir et revalider avant envoi depuis le q-dialog d'ajout
  await loadMessages()
  await loadDirections()
  if (!canAddDirection.value) {
    $q.notify({ type: 'warning', message: 'Ajout de directions non autorisé dans cet état', position: 'top' })
    // Fermer le q-dialog
    showAddDirectionDialog.value = false
    return
  }

  if (selectedAdditionalDirections.value.length === 0) {
    $q.notify({ type: 'warning', message: 'Sélectionnez au moins une direction' })
    // Fermer le q-dialog
    showAddDirectionDialog.value = false
    return
  }

  try {
     let addedCount = 0
     for (const dirValue of selectedAdditionalDirections.value) {
       await api.post(`/api/rec/directions_ticket/${currentTicketId.value}`, {
         direction: dirValue,
         statut_direction: selectedStatutDirection.value
       })
       addedCount++
     }

     // Rafraîchir les listes depuis le backend
     await loadDirections()

     $q.notify({
       type: 'positive',
       message: `${addedCount} direction(s) ajoutée(s) avec succès`,
       position: 'top'
     })
   } catch (error) {
     console.error('Erreur lors de l\'ajout des directions:', error)
     $q.notify({
       type: 'negative',
       message: 'Erreur lors de l\'ajout des directions',
       position: 'top'
     })
   } finally {
     // Réinitialiser et fermer le dialog
     selectedAdditionalDirections.value = []
     selectedStatutDirection.value = 'traitement'
     showAddDirectionDialog.value = false
   }
 }

 // Fonction pour supprimer des directions (envoi au backend)
const removeSelectedDirections = async () => {
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné' })
    // Fermer le q-dialog
    showRemoveDirectionDialog.value = false
    return
  }

  // Rafraîchir et revalider avant envoi depuis le q-dialog de suppression
  await loadMessages()
  await loadDirections()
  if (!canRemoveDirection.value) {
    $q.notify({ type: 'warning', message: 'Suppression de directions non autorisée dans cet état', position: 'top' })
    // Fermer le q-dialog
    showRemoveDirectionDialog.value = false
    return
  }

  if (selectedRemoveDirections.value.length === 0) {
    $q.notify({ type: 'warning', message: 'Sélectionnez au moins une direction à supprimer' })
    // Fermer le q-dialog
    showRemoveDirectionDialog.value = false
    return
  }

  try {
     const response = await api.post(`/api/rec/directions_ticket/${currentTicketId.value}/delete`, {
       directions: selectedRemoveDirections.value
     })

     // Rafraîchir les listes depuis le backend
     await loadDirections()

     const deletedCount = response?.data?.data?.deleted_count ?? selectedRemoveDirections.value.length
     $q.notify({
       type: 'positive',
       message: `${deletedCount} direction(s) supprimée(s) avec succès`,
       position: 'top'
     })
   } catch (error) {
     console.error('Erreur lors de la suppression des directions:', error)
     $q.notify({
       type: 'negative',
       message: 'Erreur lors de la suppression des directions',
       position: 'top'
     })
   } finally {
     // Réinitialiser et fermer le dialog
     selectedRemoveDirections.value = []
     showRemoveDirectionDialog.value = false
   }
 }

 // Initialiser les options de directions non concernées
 onMounted(() => {

   if (currentTicketId.value) {
     loadMessages()
   }
   loadDirections()
 })

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

// Lifecycle hook déjà défini plus haut avec l'initialisation des directions
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
