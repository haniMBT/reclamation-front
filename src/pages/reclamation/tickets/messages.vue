<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="message" size="2rem" class="text-blue-600 mr-3" />
          <div>
<h1 class="text-2xl font-bold text-gray-800 mb-1 flex items-center flex-wrap gap-2">
  Messages du Ticket
  <q-chip
    v-if="hasTicketStatus"
    square
    dense
    color="blue-6"
    text-color="white"
    class="ml-3"
  >
    {{ ticket.status }}
  </q-chip>
  <q-chip
    v-if="hasCurrentTicket && ticket?.priorite"
    square
    dense
    :color="getPrioriteColor(ticket.priorite)"
    text-color="white"
    icon="flag"
  >
    {{ getPrioriteLabel(ticket.priorite) }}
    <q-tooltip>Priorité actuelle</q-tooltip>
  </q-chip>
  <q-btn
    v-if="canChangePriorite"
    icon="tune"
    color="amber-8"
    size="sm"
    dense
    no-caps
    label="Changer la priorité"
    @click="openPrioriteDialog"
    class="ml-2"
  >
    <q-tooltip>Modifier la priorité (pilote uniquement)</q-tooltip>
  </q-btn>
  <q-chip
    v-if="hasCurrentTicket && ticket?.reference"
    square
    dense
    color="teal-6"
    text-color="white"
    icon="tag"
  >
    Réf : {{ ticket.reference }}
    <q-tooltip>Référence de la réclamation</q-tooltip>
  </q-chip>
  <q-btn
    v-if="canChangeReference"
    icon="tag"
    color="teal-7"
    size="sm"
    dense
    no-caps
    :label="ticket?.reference ? 'Modifier la référence' : 'Ajouter une référence'"
    @click="openReferenceDialog"
    class="ml-2"
  >
    <q-tooltip>Renseigner la référence de la réclamation (pilote uniquement)</q-tooltip>
  </q-btn>
</h1>
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
          <!-- Nouveau bouton: Ajouter un motif pour une direction (mêmes conditions) -->
          <q-btn
            icon="edit_note"
            color="green"
            size="sm"
            v-if="canAddDirection"
            round
            @click="openAddMotifDirectionDialog"
            class="ml-2"
          >
            <q-tooltip>Changer la direction pilote</q-tooltip>
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
            <q-btn
              icon="delete"
              color="negative"
              no-caps
              v-if="canShowDeleteSelfDirectionButton"
              @click="openDeleteSelfDirectionDialog"
              :disable="!currentTicketId"
              class="px-6"
            >
              Supprimer
            </q-btn>
            <q-btn
              icon="info"
              color="red-6"
              no-caps
              v-if="canShowRefusalMotifButton"
              @click="openRefusalMotifDialog"
              :disable="!currentTicketId"
              class="px-6"
            >
              Motif refus pilote
            </q-btn>
            <q-btn
              icon="swap_horiz"
              color="blue-8"
              no-caps
              v-if="canShowOrientationDecisionButton"
              @click="openOrientationDecisionDialog"
              :disable="!currentTicketId"
              class="px-6"
            >
              Décision pilote
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

        <!-- Slot pour suivi de lecture (directions: Lu/Non lu, sinon X/Y) + détails -->
        <template v-slot:body-cell-reading_progress="props">
          <q-td :props="props" class="items-center">
            <div class="flex items-center justify-center gap-2">
              <span v-if="isClientTarget(props.row)" class="text-gray-700">
                {{ getClientReadLabel(props.row) }}
              </span>
              <span v-else-if="isDirectionsBroadcast(props.row)" class="text-gray-700">
                {{ getDirectionsReadLabel(props.row) }}
              </span>
              <span v-else class="text-gray-700">
                {{ getReadCount(props.row) }}/{{ getTotalDirectionRecipients(props.row) }}
              </span>
              <q-btn
                v-if="authStore.user.direction!=null"
                flat
                round
                dense
                icon="more_horiz"
               @click="openReadStatusDialog(props.row)"
              >
                <q-tooltip>Détails lecture</q-tooltip>
              </q-btn>
            </div>
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

    <!-- Dialog Motif Direction (q-select simple + q-editor) -->
    <q-dialog v-model="showAddMotifDirectionDialog" persistent>
      <q-card class="w-full" style="min-width: 60vw; max-width: 70vw; max-height: 80vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-green-50">
          <q-icon name="edit_note" class="text-green-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-green-900">Changer la direction pilote </div>
            <div class="text-sm text-green-700">Sélectionner une direction et saisir un motif lié</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <div class="space-y-6">
            <!-- Sélection simple de la direction -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Direction</label>
              <q-select
                v-model="selectedDirectionMotif"
                :options="allDirectionsOptions"
                label="Sélectionner une direction"
                outlined
                dense
                option-label="label"
                option-value="value"
                emit-value
                map-options
                :loading="loadingDirections"
                stack-label
              >
                <template #prepend>
                  <q-icon name="business" class="text-green-600" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Aucune direction disponible</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Motif via QEditor -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Motif</label>
              <q-editor
                v-model="motifDirectionContent"
                min-height="160px"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered'],
                  ['undo', 'redo']
                ]"
                placeholder="Expliquez le motif lié à la direction sélectionnée..."
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeAddMotifDirectionDialog"
            color="grey-6"
            outline
            no-caps
            class="px-6"
          >
            Annuler
          </q-btn>
          <q-btn
            @click="sendDirectionMotif"
            color="green-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            :disable="!selectedDirectionMotif || !isMotifValid"
          >
            Envoyer le motif
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Décision Orientation (accept/refuse changement pilote) -->
    <q-dialog v-model="showOrientationDecisionDialog" persistent>
      <q-card class="w-full" style="min-width: 60vw; max-width: 70vw; max-height: 80vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-blue-50">
          <q-icon name="gavel" class="text-blue-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-blue-900">Décision changement de pilote</div>
            <div class="text-sm text-blue-700">Valider la demande de changement de direction pilote</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <div class="space-y-6">
            <!-- Informations sur la demande -->
            <div class="space-y-2 bg-blue-50 border border-blue-100 p-4 rounded-md">
              <div class="text-sm text-blue-800">
                <span class="font-medium">Direction demandeuse:</span>
                {{ requesting_direction || ticket_direction?.direction || '—' }}
              </div>
              <div class="text-sm text-blue-800">
                <span class="font-medium">Motif du changement:</span>
                <span v-html="(ticket?.motif_changement || ticketDetails?.motif_changement || '—')"></span>
              </div>
            </div>

            <!-- Choix de décision -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">Décision</label>
              <div class="flex items-center space-x-6">
                <q-radio v-model="orientationDecision.decision" val="accept" label="Accepter" color="green-6" />
                <q-radio v-model="orientationDecision.decision" val="refuse" label="Refuser" color="negative" />
              </div>
            </div>

            <!-- Motif de refus -->
            <div class="space-y-2" v-if="orientationDecision.decision === 'refuse'">
              <label class="block text-sm font-medium text-gray-700">Motif du refus</label>
              <q-input
                v-model="orientationDecision.motifRefus"
                type="textarea"
                outlined
                dense
                placeholder="Expliquez la raison du refus"
                :rules="[val => !!val && val.trim().length > 2 || 'Le motif est requis']"
                autogrow
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn
            @click="closeOrientationDecisionDialog"
            color="grey-6"
            outline
            no-caps
            class="px-6"
          >
            Annuler
          </q-btn>
          <q-btn
            @click="submitOrientationDecision"
            color="blue-6"
            no-caps
            unelevated
            class="px-6 ml-3"
            :disable="!orientationDecision.decision || (orientationDecision.decision === 'refuse' && (!orientationDecision.motifRefus || orientationDecision.motifRefus.trim().length < 3))"
          >
            Confirmer la décision
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Motif de refus du changement de pilote -->
    <q-dialog v-model="showRefusalMotifDialog" persistent>
      <q-card class="w-full" style="min-width: 50vw; max-width: 60vw; max-height: 70vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-red-50">
          <q-icon name="info" class="text-red-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-red-900">Motif du refus du changement de pilote</div>
            <div class="text-sm text-red-700">Affichage du motif consigné par la direction pilote</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <div class="prose max-w-none">
            <div v-html="ticket?.motif_refu_changement || ticketDetails?.motif_refu_changement || '—'"></div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn @click="closeRefusalMotifDialog" color="grey-6" outline no-caps class="px-6">Fermer</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Confirmation Suppression de la direction (changement_accepter) -->
    <q-dialog v-model="showDeleteSelfDirectionDialog" persistent>
      <q-card class="w-full" style="min-width: 50vw; max-width: 60vw; max-height: 60vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-red-50">
          <q-icon name="warning" class="text-red-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-red-900">Confirmer la suppression</div>
            <!-- <div class="text-sm text-red-700">Supprimer votre direction liée au ticket (type_orientation = 'changement_accepter')</div> -->
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
          <div class="space-y-3 text-gray-800">
            <p>
              Si vous confirmez la suppression, vous ne serez plus concerné par cette réclamation.
            </p>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn @click="closeDeleteSelfDirectionDialog" color="grey-6" outline no-caps class="px-6">Annuler</q-btn>
          <q-btn @click="confirmDeleteSelfDirection" color="negative" no-caps unelevated class="px-6 ml-3">Confirmer la suppression</q-btn>
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
          <div class="p-6 space-y-6">
      <div v-if="hasTicketConclusion" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                <h3 class="text-lg font-semibold text-purple-800 flex items-center">
                  <q-icon name="text_snippet" class="mr-2" />
                  Conclusion pilote
                </h3>
              </div>
              <div class="p-6 prose max-w-none">
                <div v-html="ticket.conclusion"></div>
              </div>

              <!-- Fichiers de conclusion -->
              <div v-if="hasTicketConclusionFiles" class="px-6 pb-6">
                <div class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <q-icon name="attach_file" class="text-purple-600 mr-2" />
                  Pièces jointes de conclusion ({{ ticket.files.length }})
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <q-list class="space-y-2">
                    <q-item v-for="file in ticket.files" :key="file.id" class="bg-white rounded-lg shadow-sm">
                      <q-item-section avatar>
                        <q-icon :name="getFileIconVoir(file.type_fichier)" class="text-purple-600" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-medium">{{ file.nom_fichier }}</q-item-label>
                        <q-item-label caption class="text-gray-500">{{ formatFileSizeVoir(file.taille_fichier) }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          round
                          icon="download"
                          color="purple-6"
                          @click="downloadTicketFile(file)"
                          class="hover:bg-purple-50"
                        >
                          <q-tooltip>Télécharger</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>

            <!-- Conclusion du recours (section distincte) -->
            <div v-if="hasTicketConclusionRecours" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-indigo-200">
                <h3 class="text-lg font-semibold text-indigo-800 flex items-center">
                  <q-icon name="gavel" class="mr-2" />
                  Conclusion du recours
                </h3>
              </div>
              <div class="p-6 prose max-w-none">
                <div v-html="ticket.conclusion_recours"></div>
              </div>

              <!-- Fichiers de conclusion du recours -->
              <div v-if="hasTicketConclusionRecoursFiles" class="px-6 pb-6">
                <div class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <q-icon name="attach_file" class="text-indigo-600 mr-2" />
                  Pièces jointes du recours ({{ ticket.files_recours.length }})
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <q-list class="space-y-2">
                    <q-item v-for="file in ticket.files_recours" :key="file.id" class="bg-white rounded-lg shadow-sm">
                      <q-item-section avatar>
                        <q-icon :name="getFileIconVoir(file.type_fichier)" class="text-indigo-600" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-medium">{{ file.nom_fichier }}</q-item-label>
                        <q-item-label caption class="text-gray-500">{{ formatFileSizeVoir(file.taille_fichier) }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          round
                          icon="download"
                          color="indigo-6"
                          @click="downloadTicketFile(file)"
                          class="hover:bg-indigo-50"
                        >
                          <q-tooltip>Télécharger</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>

            <div v-if="!hasTicketConclusion && !hasTicketConclusionRecours" class="flex flex-col items-center justify-center py-16">
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

    <!-- Dialog Suivi de lecture -->
    <q-dialog v-model="showReadStatusDialog" persistent>
      <q-card class="w-full" style="min-width: 50vw; max-width: 60vw; max-height: 70vh; display: flex; flex-direction: column;">
        <q-card-section class="flex items-center bg-indigo-50">
          <q-icon name="more_horiz" class="text-indigo-600 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-indigo-900">Suivi de lecture</div>
            <div class="text-sm text-indigo-700">{{ readStatusMessageTitle }}</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg overflow-auto relative" style="flex: 1;">
          <div v-if="readStatusEntries && readStatusEntries.length" class="space-y-2">
            <q-list bordered separator>
              <q-item v-for="entry in readStatusEntries" :key="entry.code" class="bg-white rounded-lg shadow-sm">
                <q-item-section avatar>
                  <q-icon name="business" class="text-indigo-600" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="font-medium">{{ entry.label }}</q-item-label>
                  <q-item-label caption class="text-gray-500">Lecture: {{ formatDateTime(entry.date) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else class="text-gray-600">Aucune direction n’a lu ce message pour le moment.</div>

          <q-inner-loading :showing="readStatusRefreshing">
            <q-spinner-dots size="50px" color="indigo-6" />
          </q-inner-loading>
        </q-card-section>

        <q-separator />

        <q-card-actions class="p-6 bg-gray-50">
          <q-space />
          <q-btn @click="closeReadStatusDialog" color="grey-6" outline no-caps class="px-6">Fermer</q-btn>
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
                          <p v-if="file.libelle" class="text-sm text-gray-600">Demande : {{ file.libelle }}</p>
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
            :options="directionOptionsForRemoval"
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

          <!-- Upload de fichiers de conclusion -->
          <div class="space-y-2 q-mt-lg">
            <label class="block text-sm font-medium text-gray-700">
              Fichiers de conclusion (optionnel)
            </label>

            <!-- Zone d'ajout de fichiers -->
            <div class="flex gap-3 mb-3">
              <q-file
                v-model="closeFiles"
                multiple
                outlined
                dense
                accept="image/*,application/pdf,.doc,.docx,.txt"
                max-file-size="10485760"
                class="flex-1"
                @rejected="onRejected"
                @update:model-value="onCloseFilesSelected"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" class="text-red-600" />
                </template>
                <template v-slot:hint>
                  Formats acceptés: Images, PDF, Word. Taille max: 10Mo par fichier
                </template>
              </q-file>

              <q-btn
                label="Ajouter"
                color="red-6"
                outline
                :disable="!closeFiles || closeFiles.length === 0"
                @click="addCloseFiles"
                class="px-4"
              >
                <q-icon name="add" class="mr-1" />
              </q-btn>
            </div>

            <!-- Liste des fichiers sélectionnés -->
            <div v-if="hasCloseAttachments" class="mt-3">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Fichiers sélectionnés ({{ closeAttachments.length }}) :
              </div>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in closeAttachments"
                  :key="index"
                  class="flex items-center justify-between bg-gray-50 p-3 rounded-md border"
                >
                  <div class="flex items-center">
                    <q-icon
                      :name="getFileIcon(file.type)"
                      size="1.5rem"
                      class="text-red-600 mr-3"
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
                    @click="removeCloseFile(index)"
                    class="ml-2"
                  >
                    <q-tooltip>Supprimer le fichier</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
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

    <!-- Dialog: changement de priorité (pilote uniquement) -->
    <q-dialog v-model="showPrioriteDialog" persistent>
      <q-card class="w-full" style="min-width: 420px; max-width: 520px;">
        <q-card-section class="flex items-center bg-amber-50">
          <q-icon name="flag" class="text-amber-700 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-amber-900">Changer la priorité</div>
            <div class="text-sm text-amber-700">Choisissez le nouveau niveau de priorité de la réclamation</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-lg">
          <q-select
            v-model="prioriteForm.priorite"
            :options="prioriteOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            outlined
            dense
            label="Priorité"
          >
            <template #prepend>
              <q-icon name="flag" class="text-amber-700" />
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-badge :color="scope.opt.color" :label="scope.opt.label" />
                </q-item-section>
                <q-item-section>{{ scope.opt.label }}</q-item-section>
              </q-item>
            </template>
            <template #selected>
              <q-badge
                v-if="prioriteForm.priorite"
                :color="getPrioriteColor(prioriteForm.priorite)"
                :label="getPrioriteLabel(prioriteForm.priorite)"
              />
            </template>
          </q-select>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md bg-white">
          <q-btn flat label="Annuler" color="grey-7" @click="closePrioriteDialog" :disable="prioriteSaving" />
          <q-btn
            label="Enregistrer"
            color="amber-8"
            :loading="prioriteSaving"
            :disable="!prioriteForm.priorite || prioriteSaving"
            @click="savePriorite"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: référence de la réclamation (pilote uniquement) -->
    <q-dialog v-model="showReferenceDialog" persistent>
      <q-card class="w-full" style="min-width: 420px; max-width: 520px;">
        <q-card-section class="flex items-center bg-teal-50">
          <q-icon name="tag" class="text-teal-700 mr-3" size="2rem" />
          <div>
            <div class="text-xl font-semibold text-teal-900">Référence de la réclamation</div>
            <div class="text-sm text-teal-700">Saisissez la référence de la réclamation (obligatoire avant la clôture)</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-lg">
          <q-input
            v-model="referenceForm.reference"
            outlined
            dense
            maxlength="255"
            counter
            label="Référence"
            @keyup.enter="saveReference"
          >
            <template #prepend>
              <q-icon name="tag" class="text-teal-700" />
            </template>
          </q-input>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md bg-white">
          <q-btn flat label="Annuler" color="grey-7" @click="closeReferenceDialog" :disable="referenceSaving" />
          <q-btn
            label="Enregistrer"
            color="teal-8"
            :loading="referenceSaving"
            :disable="!referenceForm.reference || !referenceForm.reference.trim() || referenceSaving"
            @click="saveReference"
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
import { PRIORITE_OPTIONS, getPrioriteLabel, getPrioriteColor } from 'src/composables/usePriorite';

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

// Changement de priorité (pilote uniquement)
const prioriteOptions = PRIORITE_OPTIONS
const showPrioriteDialog = ref(false)
const prioriteForm = ref({ priorite: null })
const prioriteSaving = ref(false)

// Pilote = role 'employe_Répondeur' + direction == direction du ticket avec type_orientation='ticket'
const isPilot = computed(() => {
  if (!privilege.value || privilege.value?.role !== 'employe_Répondeur') return false
  if (!authStore.user?.direction) return false
  return ticket_direction.value?.type_orientation === 'ticket'
    && ticket_direction.value?.direction === authStore.user.direction
})

const canChangePriorite = computed(() => {
  if (!isPilot.value) return false
  const status = ticket.value?.status
  if (status === 'clôturé' || status === 'Recours clôturé') return false
  return true
})

// Référence de la réclamation (pilote uniquement)
const showReferenceDialog = ref(false)
const referenceForm = ref({ reference: '' })
const referenceSaving = ref(false)

const canChangeReference = computed(() => {
  if (!isPilot.value) return false
  const status = ticket.value?.status
  if (status === 'clôturé' || status === 'Recours clôturé') return false
  return true
})

const openReferenceDialog = () => {
  referenceForm.value.reference = ticket.value?.reference || ''
  showReferenceDialog.value = true
}

const closeReferenceDialog = () => {
  showReferenceDialog.value = false
}

const saveReference = async () => {
  const value = (referenceForm.value.reference || '').trim()
  if (!currentTicketId.value || !value) return
  referenceSaving.value = true
  try {
    const resp = await api.put(`/api/rec/tickets/${currentTicketId.value}/reference`, {
      reference: value
    })
    if (resp.data?.success) {
      if (ticket.value) ticket.value.reference = resp.data.data.reference
      $q.notify({ type: 'positive', message: resp.data.message || 'Référence mise à jour' })
      closeReferenceDialog()
    } else {
      $q.notify({ type: 'negative', message: resp.data?.message || 'Échec de la mise à jour' })
    }
  } catch (error) {
    console.error('Erreur mise à jour référence:', error)
    const msg = error.response?.data?.message || 'Erreur lors de la mise à jour de la référence'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    referenceSaving.value = false
  }
}

const openPrioriteDialog = () => {
  prioriteForm.value.priorite = ticket.value?.priorite || 'normal'
  showPrioriteDialog.value = true
}

const closePrioriteDialog = () => {
  showPrioriteDialog.value = false
}

const savePriorite = async () => {
  if (!currentTicketId.value || !prioriteForm.value.priorite) return
  prioriteSaving.value = true
  try {
    const resp = await api.put(`/api/rec/tickets/${currentTicketId.value}/priorite`, {
      priorite: prioriteForm.value.priorite
    })
    if (resp.data?.success) {
      if (ticket.value) ticket.value.priorite = resp.data.data.priorite
      $q.notify({ type: 'positive', message: resp.data.message || 'Priorité mise à jour' })
      closePrioriteDialog()
    } else {
      $q.notify({ type: 'negative', message: resp.data?.message || 'Échec de la mise à jour' })
    }
  } catch (error) {
    console.error('Erreur mise à jour priorité:', error)
    const msg = error.response?.data?.message || 'Erreur lors de la mise à jour de la priorité'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    prioriteSaving.value = false
  }
}

// Upload
const newFiles = ref(null)
const loadingDirections = ref(false)
const requesting_direction = ref(null)
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
// Fichiers de conclusion (UI)
const closeFiles = ref(null)
const closeAttachments = ref([])


// Motif par direction — nouvel état
const showAddMotifDirectionDialog = ref(false)
const selectedDirectionMotif = ref(null)
const motifDirectionContent = ref('')

// Décision orientation pilote
const showOrientationDecisionDialog = ref(false)
const orientationDecision = ref({ decision: null, motifRefus: '' })
const hasChangeRequestForUserDirection = computed(() => {
  if (!authStore.user?.direction) return false
  return directionOptions.value?.some(d => d.value === authStore.user.direction && d.type_orientation === 'changement')
})
const canShowOrientationDecisionButton = computed(() => {
  return  hasChangeRequestForUserDirection.value
  // return canShowNewMessageButton.value && hasChangeRequestForUserDirection.value
})




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
    name: 'reading_progress',
    label: 'Suivi de lecture',
    align: 'center',
    field: 'reading_progress',
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

// Options combinées (directions associées + non concernées), sans duplications
const allDirectionsOptions = computed(() => {
  const list = [...(directionOptions.value || []), ...(directionsNonConcerneOptions.value || [])]
  const byValue = new Map()
  list.forEach(d => {
    if (d && !byValue.has(d.value)) byValue.set(d.value, d)
  })
  return Array.from(byValue.values())
})

// Validation du contenu de motif (texte non vide après stripping HTML)
const isMotifValid = computed(() => {
  const text = motifDirectionContent.value || ''
  const stripped = text.replace(/<[^>]*>/g, '').trim()
  return stripped.length > 0
})

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

// Directions disponibles pour suppression (exclut la direction de l'utilisateur connecté)
const directionOptionsForRemoval = computed(() => {
  if (!authStore.user.direction) {
    return directionOptions.value
  }

  return directionOptions.value.filter(direction =>
    direction.value !== authStore.user.direction
  )
})

// Attachments
const hasNewMessageAttachments = computed(() => (newMessage.value.attachments?.length || 0) > 0)
const hasReplyAttachments = computed(() => (replyMessage.value.attachments?.length || 0) > 0)
const hasRecourAttachments = computed(() => (recourMessage.value.attachments?.length || 0) > 0)

// Ticket chips
const hasTicketClosedAt = computed(() => !!ticket.value?.closed_at)
const hasTicketStatus = computed(() => !!ticket.value?.status)
const hasTicketConclusion = computed(() => !!ticket.value?.conclusion)
const hasTicketConclusionFiles = computed(() => !!ticket.value?.files && ticket.value.files.length > 0)
// Conclusion du recours (séparée de la conclusion pilote)
const hasTicketConclusionRecours = computed(() => !!ticket.value?.conclusion_recours)
const hasTicketConclusionRecoursFiles = computed(() => !!ticket.value?.files_recours && ticket.value.files_recours.length > 0)

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
const hasCloseAttachments = computed(() => !!closeAttachments.value && closeAttachments.value.length > 0)

// Bouton "Motif refus pilote" — conditions combinées
const hasMotifRefus = computed(() => {
  const m = ticket.value?.motif_refu_changement || ticketDetails.value?.motif_refu_changement
  // Accepte HTML; présence non nulle
  return m != null && String(m).trim().length > 0
})
const canShowRefusalMotifButton = computed(() => {
  // Seul le pilote (type_orientation == 'ticket') voit ce bouton, et uniquement
  // si un motif de refus existe. À l'acceptation le backend remet
  // motif_refu_changement = null, donc la présence du motif suffit à indiquer un refus.
  return isPilot.value && hasMotifRefus.value
})

// Bouton "Supprimer" — visible si l’utilisateur possède type_orientation == 'changement_accepter'
const hasAcceptedChangeForUserDirection = computed(() => {
  if (!authStore.user?.direction) return false
  // Doit être un traiteur réellement concerné par la réclamation (répondeur de la
  // direction), pas le réclamant/créateur du ticket — même critère que showAssociatedDirections.
  if (privilege.value?.role !== 'employe_Répondeur' || !ticket_direction.value) return false
  if (ticket.value?.user_id === authStore.user?.id) return false
  // L'ancien pilote dont le changement a été accepté a sa direction marquée
  // type_orientation === 'changement_accepter' : il peut alors supprimer sa direction.
  return (directionOptions.value || []).some(d => d?.value === authStore.user.direction && d?.type_orientation === 'changement_accepter')
})
const canShowDeleteSelfDirectionButton = computed(() => hasAcceptedChangeForUserDirection.value)

// Méthodes
const goBack = () => {
  ticketStore.clearTicket()
  router.push('/reclamations/allTicket')
}



// Clôturer la réclamation
const closeTicket = async () => {
  if (!currentTicketId.value) return
  // Sécurité: rafraîchir et revalider la condition de clôture
  await loadMessagesDirections()
  if (!canShowCloseButton.value) {
    $q.notify({ type: 'warning', message: 'Clôture non autorisée dans l’état actuel du ticket', position: 'top' })
    // Fermer le q-dialog
    showCloseDialog.value = false
    return
  }
  isClosing.value = true
  try {
    // Ajouter les fichiers sélectionnés si présents
    addCloseFiles()

    const formData = new FormData()
    formData.append('conclusion', closeConclusion.value)
    formData.append('status', 'clôturé')

    // Ajouter les fichiers de conclusion au FormData
    closeAttachments.value.forEach((attachment) => {
      if (attachment.file) {
        formData.append('files[]', attachment.file)
      }
    })

    const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/close`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.data && response.data.success) {
      $q.notify({ type: 'positive', message: 'Réclamation clôturée avec succès', position: 'top' })
      showCloseDialog.value = false
      closeConclusion.value = ''
      closeAttachments.value = []
      closeFiles.value = null
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

// Méthodes pour l'upload des fichiers de conclusion
const onCloseFilesSelected = (files) => {
  if (files && files.length > 0) {
    console.log('Fichiers de conclusion sélectionnés:', files)
  }
}

// Supprimer la direction de l’utilisateur lorsque type_orientation == 'changement_accepter'
const deleteSelfDirection = async () => {
  await loadMessagesDirections()
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
    return
  }
  if (!canShowDeleteSelfDirectionButton.value) {
    $q.notify({ type: 'warning', message: "Suppression non disponible: la direction n'est pas en état 'changement_accepter'", position: 'top' })
    return
  }

  try {
    const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/directions/self/delete`)
    if (response.data?.success) {
      $q.notify({ type: 'positive', message: 'Direction supprimée avec succès', position: 'top' })
      await loadMessagesDirections()
    } else {
      throw new Error(response.data?.message || 'Échec de la suppression de la direction')
    }
  } catch (error) {
    console.error('Erreur suppression direction (self):', error)
    $q.notify({ type: 'negative', message: 'Erreur lors de la suppression de la direction', position: 'top' })
  }
}

// Modale affichage du motif de refus de changement de pilote
const showRefusalMotifDialog = ref(false)
const showDeleteSelfDirectionDialog = ref(false)
const openRefusalMotifDialog = async () => {
  await loadMessagesDirections()
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
    return
  }
  if (canShowRefusalMotifButton.value) {
    showRefusalMotifDialog.value = true
  } else {
    $q.notify({ type: 'warning', message: 'Affichage du motif de refus non autorisé dans cet état', position: 'top' })
  }
}
const closeRefusalMotifDialog = () => {
  showRefusalMotifDialog.value = false
}

const openDeleteSelfDirectionDialog = () => {
  showDeleteSelfDirectionDialog.value = true
}
const closeDeleteSelfDirectionDialog = () => {
  showDeleteSelfDirectionDialog.value = false
}
const confirmDeleteSelfDirection = async () => {
  try {
    await deleteSelfDirection()
    showDeleteSelfDirectionDialog.value = false
    $q.notify({ type: 'positive', message: 'Direction supprimée. Redirection en cours…' })
    router.push({ path: '/reclamations/allTicket' })
  } catch (e) {
    // L’erreur est notifiée dans deleteSelfDirection(); on laisse le modal ouvert
  }
}

const addCloseFiles = () => {
  if (closeFiles.value && closeFiles.value.length > 0) {
    const filesCount = closeFiles.value.length

    closeFiles.value.forEach(file => {
      // Vérifier si le fichier n'est pas déjà dans la liste
      const exists = closeAttachments.value.some(att =>
        att.name === file.name && att.size === file.size
      )

      if (!exists) {
        closeAttachments.value.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        })
      }
    })

    // Réinitialiser la sélection
    closeFiles.value = null

    $q.notify({
      type: 'positive',
      message: `${filesCount} fichier(s) ajouté(s) à la conclusion`,
      position: 'top'
    })
  }
}

const removeCloseFile = (index) => {
  closeAttachments.value.splice(index, 1)
  $q.notify({
    type: 'info',
    message: 'Fichier supprimé',
    position: 'top'
  })
}


const loadMessages = async () => {
  if (!currentTicketId.value) return

  loading.value = true
  try {
    const response = await api.get(`/api/rec/tickets/${currentTicketId.value}/messages`)

    if (response.data.success) {
      messages.value = response.data.data || []
      ticket_direction.value = response.data.ticket_direction || null
      requesting_direction.value = response.data.requesting_direction || null
      ticket.value = response.data.ticket || null
      privilege.value = response.data.privilege || null
      createur.value = response.data.createur || null // Récupérer les infos du créateur
      if(!showCloseDialog.value){
        // Clôture recours -> conclusion_recours ; sinon conclusion pilote
        closeConclusion.value = ticket.value.status === 'Recours'
          ? (ticket.value.conclusion_recours || '')
          : (ticket.value.conclusion || '')
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

// Nouvelle fonction combinée: charge messages + directions en une seule requête
const loadMessagesDirections = async () => {
  if (!currentTicketId.value) return

  loading.value = true
  loadingDirections.value = true
  try {
    const response = await api.get(`/api/rec/tickets/${currentTicketId.value}/messages-directions`)

    if (response.data.success) {
      // Messages et méta
      messages.value = response.data.messages || response.data.data || []
      ticket_direction.value = response.data.ticket_direction || null
      requesting_direction.value = response.data.requesting_direction || null
      ticket.value = response.data.ticket || null
      privilege.value = response.data.privilege || null
      createur.value = response.data.createur || null
      if (!showCloseDialog.value && ticket.value) {
        // Clôture recours -> conclusion_recours ; sinon conclusion pilote
        closeConclusion.value = ticket.value.status === 'Recours'
          ? (ticket.value.conclusion_recours || '')
          : (ticket.value.conclusion || '')
      }

      // Directions (même mapping que loadDirections)
      const dirs = response.data.directions || []
      directionOptions.value = dirs.map(direction => ({
        label: direction.label,
        value: direction.value,
        id: direction.id,
        type_orientation: direction.type_orientation,
        statut_direction: direction.statut_direction
      }))

      const nonConcerne = response.data.directionsNonConcerne || []
      directionsNonConcerneOptions.value = nonConcerne.map(direction => ({
        label: direction.label,
        value: direction.value,
        id: direction.id
      }))
    } else {
      messages.value = []
      $q.notify({ type: 'warning', message: response.data.message || 'Aucun message trouvé' })

      // Fallback directions en cas d’erreur logique
      directionOptions.value = [
        { label: 'Direction Générale', value: 'DG', id: 1 },
        { label: 'Direction Technique', value: 'DT', id: 2 },
        { label: 'Direction Commerciale', value: 'DC', id: 3 },
        { label: 'Direction des Ressources Humaines', value: 'DRH', id: 4 },
        { label: 'Direction Financière', value: 'DF', id: 5 }
      ]
      directionsNonConcerneOptions.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement combiné messages/directions:', error)
    messages.value = []
    $q.notify({ type: 'negative', message: 'Erreur lors du chargement des messages/directions' })

    // Fallback directions en cas d’erreur réseau
    directionOptions.value = [
      { label: 'Direction Générale', value: 'DG', id: 1 },
      { label: 'Direction Technique', value: 'DT', id: 2 },
      { label: 'Direction Commerciale', value: 'DC', id: 3 },
      { label: 'Direction des Ressources Humaines', value: 'DRH', id: 4 },
      { label: 'Direction Financière', value: 'DF', id: 5 }
    ]
    directionsNonConcerneOptions.value = []
  } finally {
    loading.value = false
    loadingDirections.value = false
  }
}

const parseDate = (value) => {
  if (!value) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  const raw = String(value).trim()
  if (!raw) return null
  let d = new Date(raw)
  if (!isNaN(d.getTime())) return d
  d = new Date(raw.replace(' ', 'T'))
  if (!isNaN(d.getTime())) return d
  d = new Date(raw.replace(' ', 'T') + 'Z')
  if (!isNaN(d.getTime())) return d
  return null
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = parseDate(dateString)
  if (!date) return dateString
  try {
    return date.toLocaleDateString('fr-FR', {
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

const formatDateTime = (dateString) => {
  if (!dateString) return '—'
  const date = parseDate(dateString)
  if (!date) return dateString
  try {
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return dateString
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const viewMessageDetail = async (message) => {
  selectedMessage.value = message
  showMessageDetail.value = true

  // Vérifier si la direction de l'utilisateur est destinataire du message
  const userDirection = authStore.user?.direction
  const isUserRecipient = Array.isArray(message?.destinataires)
    && message.destinataires.some(d => d?.direction_destinataire === userDirection && d?.statut !== 'lu'
    // || d?.direction_destinataire === 'directions'
    )

  if (isUserRecipient && userDirection) {
    try {
      await api.put(`/api/rec/messages/${message.id}/mark-as-read`, { direction: userDirection })
      // Mettre à jour localement le statut du destinataire correspondant
      const idx = message.destinataires.findIndex(d => d?.direction_destinataire === userDirection)
      if (idx !== -1) {
        message.destinataires[idx].statut = 'lu'
        message.destinataires[idx].lu = 1
        message.destinataires[idx].date_lecture = new Date().toISOString()
      }
    } catch (error) {
      console.error('Erreur lors du marquage du message comme lu:', error)
    }
  }

  // Si destinataire = client et l'utilisateur a une direction, marquer comme lu côté client
  // const hasNoDirection = !authStore.user?.direction //n'a pas de direction
  const clientIdx = Array.isArray(message?.destinataires)
    ? message.destinataires.findIndex(d => d?.direction_destinataire === 'client' && d?.statut !== 'lu' && !d?.date_lecture)
    : -1

  if (clientIdx !== -1) {
    try {
      await api.put(`/api/rec/messages/${message.id}/mark-as-read`, { recipient: 'client' })
      // Mettre à jour localement le destinataire client
      message.destinataires[clientIdx].statut = 'lu'
      message.destinataires[clientIdx].lu = 1
      message.destinataires[clientIdx].date_lecture = new Date().toISOString()
    } catch (error) {
      console.error('Erreur lors du marquage client comme lu:', error)
    }
  }

  // Si destinataire = client et l'utilisateur n'a pas de direction, marquer comme lu côté client
  const pilotIdx = Array.isArray(message?.destinataires)
    ? message.destinataires.findIndex(d => d?.direction_destinataire === 'directions' && d?.statut !== 'lu' && !d?.date_lecture)
    : -1

  if (pilotIdx !== -1 && ticket_direction.value!=null && ticket_direction.value?.type_orientation=='ticket') {
    try {
      await api.put(`/api/rec/messages/${message.id}/mark-as-read`, { recipient: 'directions' })
      // Mettre à jour localement le destinataire client
      message.destinataires[pilotIdx].statut = 'lu'
      message.destinataires[pilotIdx].lu = 1
      message.destinataires[pilotIdx].date_lecture = new Date().toISOString()
    } catch (error) {
      console.error('Erreur lors du marquage directions comme lu:', error)
    }
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
  await loadMessagesDirections()
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
  await loadMessagesDirections()
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
  await loadMessagesDirections()
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

// Suivi de lecture (compteurs et détails)
const isDirectionRecipient = (d) => !!d?.direction_destinataire && d.direction_destinataire !== 'client' && d.direction_destinataire !== 'directions'
const getTotalDirectionRecipients = (message) => Array.isArray(message?.destinataires) ? message.destinataires.filter(isDirectionRecipient).length : 0
const getReadCount = (message) => Array.isArray(message?.destinataires) ? message.destinataires.filter(d => isDirectionRecipient(d) && (d?.statut === 'lu' || d?.lu === 1 || !!d?.date_lecture)).length : 0

// Helpers pour 'client': Lu/Non lu et date depuis t_rec_destinataires_messages
const isClientTarget = (message) => Array.isArray(message?.destinataires)
  ? message.destinataires.some(d => d?.direction_destinataire === 'client')
  : false
const getClientRecipient = (message) => Array.isArray(message?.destinataires)
  ? message.destinataires.find(d => d?.direction_destinataire === 'client')
  : null
const isClientRead = (message) => {
  const d = getClientRecipient(message)
  return !!d && (d?.statut === 'lu' || d?.lu === 1 || !!d?.date_lecture)
}
const getClientReadLabel = (message) => isClientRead(message) ? 'Lu' : 'Non lu'

// Helpers pour 'directions': Lu/Non lu pour la direction de l'utilisateur
const isDirectionsBroadcast = (message) => Array.isArray(message?.destinataires)
  ? message.destinataires.some(d => d?.direction_destinataire === 'directions')
  : false
const getDirectionsRecipient = (message) => Array.isArray(message?.destinataires)
  ? message.destinataires.find(d => d?.direction_destinataire === 'directions')
  : null
const isDirectionsRead = (message) => {
  const d = getDirectionsRecipient(message)
  return !!d && (d?.statut === 'lu' || d?.lu === 1 || !!d?.date_lecture)
}
const getDirectionsReadLabel = (message) => isDirectionsRead(message) ? 'Lu' : 'Non lu'

const showReadStatusDialog = ref(false)
const readStatusEntries = ref([])
const readStatusMessageTitle = ref('')
const readStatusRefreshing = ref(false)
const openReadStatusDialog = async (message) => {
  try {
    readStatusRefreshing.value = true
    await loadMessagesDirections()
    const fresh = Array.isArray(messages.value) ? messages.value.find(m => m.id === message?.id) : null
    const source = fresh || message
  if (isClientTarget(source)) {
    const d = getClientRecipient(source)
    readStatusEntries.value = [{
      code: 'client',
      label: 'Client',
      date: d?.date_lecture ? formatDateTime(d.date_lecture) : null
    }]
    } else if (isDirectionsBroadcast(source)) {
    const d = getDirectionsRecipient(source)
    readStatusEntries.value = [{
      code: 'directions',
      label: 'Directions',
      date: d?.date_lecture ? formatDateTime(d.date_lecture) : null
    }]
    } else {
      const recipients = Array.isArray(source?.destinataires) ? source.destinataires.filter(d => isDirectionRecipient(d)) : []
      readStatusEntries.value = recipients
        .filter(d => d?.statut === 'lu' || d?.lu === 1 || !!d?.date_lecture)
        .map(d => ({
          code: d.direction_destinataire,
          label: getDirectionLabel(d.direction_destinataire),
          date: d.date_lecture ? formatDateTime(d.date_lecture) : null
        }))
    }
    readStatusMessageTitle.value = source?.titre || source?.subject || 'Suivi de lecture'
    showReadStatusDialog.value = true
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des données de lecture:', error)
    $q.notify({ type: 'negative', message: 'Impossible de rafraîchir les données de lecture', position: 'top' })
  } finally {
    readStatusRefreshing.value = false
  }
}
const closeReadStatusDialog = () => {
  showReadStatusDialog.value = false
  readStatusEntries.value = []
  readStatusMessageTitle.value = ''
}
const getDirectionLabel = (code) => {
  const found = allDirectionsOptions.value?.find(d => d.value === code)
  return found?.label || code
}

// Charger les directions disponibles
 const openTicketDetails = () => {
   showTicketDetailDialog.value = true
   loadTicketDetails()
 }

 // Ouvrir/fermer le dialogue de conclusion (sécurisé)
 const openConclusionDialog = async () => {
   await loadMessagesDirections()
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
   await loadMessagesDirections()
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
   await loadMessagesDirections()
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
   await loadMessagesDirections()
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
   await loadMessagesDirections()
   if (!currentTicketId.value) {
     $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
     return
   }
   if (canShowCloseButton.value) {
     // Clôture pilote (hors recours) : la référence de la réclamation est obligatoire.
     const isRecoursClosure = ticket.value?.status === 'Recours'
     if (!isRecoursClosure && !(ticket.value?.reference || '').trim()) {
       $q.notify({
         type: 'warning',
         message: 'Veuillez renseigner la référence de la réclamation avant de pouvoir la clôturer.',
         position: 'top'
       })
       openReferenceDialog()
       return
     }
     showCloseDialog.value = true
   } else {
     $q.notify({ type: 'warning', message: 'Clôture non autorisée dans l’état actuel du ticket', position: 'top' })
   }
 }

 const openAddDirectionDialog = async () => {
   await loadMessagesDirections()
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

  // Ouvrir la modale de motif par direction
  const openAddMotifDirectionDialog = async () => {
    await loadMessagesDirections()
    if (!currentTicketId.value) {
      $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
      return
    }
    if (canAddDirection.value) {
      showAddMotifDirectionDialog.value = true
    } else {
      $q.notify({ type: 'warning', message: 'Ajout de motif non autorisé dans cet état', position: 'top' })
    }
  }

  const closeAddMotifDirectionDialog = () => {
    showAddMotifDirectionDialog.value = false
    selectedDirectionMotif.value = null
    motifDirectionContent.value = ''
  }

  // Envoyer le motif comme message vers la direction sélectionnée
  const sendDirectionMotif = async () => {
    if (!currentTicketId.value) {
      $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
      showAddMotifDirectionDialog.value = false
      return
    }

    // await loadMessages()
    await loadMessagesDirections()
    if (!canAddDirection.value) {
      $q.notify({ type: 'warning', message: 'Création de motif non autorisée dans cet état', position: 'top' })
      showAddMotifDirectionDialog.value = false
      return
    }

    if (!selectedDirectionMotif.value || !isMotifValid.value) {
      $q.notify({ type: 'negative', message: 'Veuillez sélectionner une direction et saisir un motif' })
      return
    }

    try {
      const payload = {
        direction: selectedDirectionMotif.value,
        motif: motifDirectionContent.value
      }

      const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/orientation-changement`, payload)

      if (response.data?.success) {
        $q.notify({ type: 'positive', message: 'Motif enregistré et direction mise à jour', position: 'top' })
        closeAddMotifDirectionDialog()
        await loadDirections()
      } else {
        throw new Error(response.data?.message || 'Erreur lors de l\'envoi du motif')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du motif:', error)
      $q.notify({ type: 'negative', message: 'Erreur lors de l\'envoi du motif', position: 'top' })
    }
  }

 const openRemoveDirectionDialog = async () => {
   await loadMessagesDirections()
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
         id: direction.id,
         type_orientation: direction.type_orientation,
         statut_direction: direction.statut_direction
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
  await loadMessagesDirections()
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
  await loadMessagesDirections()
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
     loadMessagesDirections()
   }
   // directions intégrées dans loadMessagesDirections()
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
    loadMessagesDirections()
  }
})

// Modale de décision orientation pilote
const openOrientationDecisionDialog = async () => {
  await loadMessagesDirections()
  if (!currentTicketId.value) {
    $q.notify({ type: 'warning', message: 'Aucun ticket sélectionné', position: 'top' })
    return
  }
  if (!hasChangeRequestForUserDirection.value) {
    $q.notify({ type: 'warning', message: 'Aucune demande de changement pour votre direction', position: 'top' })
    return
  }
  orientationDecision.value = { decision: null, motifRefus: '' }
  showOrientationDecisionDialog.value = true
}

const closeOrientationDecisionDialog = () => {
  showOrientationDecisionDialog.value = false
}

const submitOrientationDecision = async () => {
  try {
    const payload = {
      decision: orientationDecision.value.decision,
      direction: authStore.user?.direction,
      motif_refus: orientationDecision.value.motifRefus || null,
    }
console.log(payload);

    if (!payload.decision || (payload.decision === 'refuse' && !payload.motif_refus)) {
      $q.notify({ type: 'warning', message: 'Sélectionnez une décision et renseignez le motif de refus', position: 'top' })
      return
    }

    const response = await api.post(`/api/rec/tickets/${currentTicketId.value}/orientation-changement/decision`, payload)
    if (response.data.success) {
      $q.notify({ type: 'positive', message: response.data.message || 'Décision enregistrée', position: 'top' })
      await loadMessagesDirections()
      showOrientationDecisionDialog.value = false
      if (payload.decision === 'refuse') {
        router.push({ name: 'tickets-all' })
      }
    } else {
      throw new Error(response.data.message || 'Erreur lors de l\'enregistrement de la décision')
    }
  } catch (error) {
    console.error('Erreur décision orientation:', error)
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Erreur lors de l\'enregistrement de la décision', position: 'top' })
  }
}
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
