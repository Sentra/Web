<template>
  <v-card flat>
    <v-tabs centered class="pt-8">
      <v-tab v-if="currentUser.email === 'admin@montrac.com'"> Equipo </v-tab>
      <v-tab v-if="currentUser.email === 'admin@montrac.com'">
        Invitaciones
      </v-tab>
      <v-tab> Solicitudes </v-tab>
      <v-tab-item v-if="currentUser.email === 'admin@montrac.com'">
        <v-card class="mx-auto mt-8" flat>
          <v-data-table
            :headers="headersTeamMembers"
            :items="members"
            :items-per-page="5"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                elevation="0"
                @click="$router.push(`/team/${item.id}/information`)"
              >
                <i class="fas fa-search" style="color: rgb(102, 97, 91)"></i>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <v-tab-item v-if="currentUser.email === 'admin@montrac.com'">
        <v-card class="mx-auto mt-8" flat max-width="800">
          <h4>Invita a tus colaboradores</h4>
          <v-form class="pt-2" @submit.prevent v-model="isValid">
            <div class="row">
              <div class="col-md-6">
                <v-text-field
                  type="text"
                  label="Nombre"
                  :rules="nameRules"
                  v-model="model.fullName"
                >
                </v-text-field>
              </div>
              <div class="col-md-6">
                <v-text-field
                  label="Email"
                  type="email"
                  :rules="emailRules"
                  v-model="model.email"
                >
                </v-text-field>
              </div>
            </div>
            <div class="text-center mt-3">
              <p-button
                type="info"
                round
                @click.native.prevent="sendInvitation"
                :disabled="!isValid"
                :style="!isValid ? { cursor: 'not-allowed' } : ''"
              >
                Enviar
              </p-button>
            </div>
            <div class="clearfix pb-4"></div>
          </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="mx-auto mt-8" flat>
          <h4 class="ml-4">Solicitudes recibidas</h4>
          <v-data-table
            :headers="headersInvitationRequest"
            :items="invitations"
            :items-per-page="5"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="resolveInvitation(item.id, true)"
              >
                mdi-check
              </v-icon>
              <v-icon small @click="resolveInvitation(item.id, false)">
                mdi-cancel
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import UserProxy from "@/proxies/user.proxy";
import InvitationProxy from "@/proxies/invitation.proxy";
export default {
  data() {
    return {
      isValid: true,
      headersTeamMembers: [
        { text: "Código", value: "id" },
        { text: "Nombre", value: "firstName" },
        { text: "Apellido", value: "lastName" },
        { text: "Email", value: "email" },
        { text: "Ver", value: "actions", sortable: false },
      ],
      headersInvitationRequest: [
        { text: "Código", value: "id" },
        { text: "Nombre", value: "firstName" },
        { text: "Apellido", value: "lastName" },
        { text: "Email", value: "email" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      members: [],
      invitations: [],
      nameRules: [(v) => !!v || "Nombre es requerido"],
      emailRules: [
        (v) => !!v || "Email es requerido",
        (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "E-mail inválido.",
      ],
      model: {
        fullName: "",
        email: "",
        managerId: 0,
      },
    };
  },
  methods: {
    async getTeamMembers() {
      if (this.currentUser) {
        await InvitationProxy.searchInvitation()
          .then(async (response) => {
            const filteredData = response.data.filter(
              (x) => x.managerId == this.currentUser.id && x.status
            );
            for (let index = 0; index < filteredData.length; index++) {
              let user = await UserProxy.searchUser(
                filteredData[index].email,
                null,
                null
              );
              const code = user.data[0].identification || user.data[0].id;
              this.members.push({
                id: code,
                firstName: user.data[0].firstName,
                lastName: user.data[0].lastName,
                email: user.data[0].email,
              });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async sendInvitation() {
      if (this.currentUser) {
        const model = {
          managerId: this.currentUser.id,
          fullName: this.model.fullName,
          email: this.model.email,
        };
        await InvitationProxy.createInvitation(model)
          .then((response) => {
            this.$notify({
              title: `La invitación fue enviada a ${response.data.email} satisfactoriamente`,
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
          })
          .catch((e) => {
            this.$notify({
              title: this.getErrorMessage(e.response.data),
              icon: "fa-solid fa-circle-exclamation",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "warning",
            });
          });
      }
    },
    async getInvitacions() {
      if (this.currentUser) {
        await InvitationProxy.searchInvitation()
          .then(async (response) => {
            const filteredData = response.data.filter(
              (x) => x.email == this.currentUser.email && !x.status
            );
            for (let index = 0; index < filteredData.length; index++) {
              let user = await UserProxy.searchUser(
                null,
                filteredData[index].managerId,
                null
              );
              this.invitations.push({
                id: filteredData[index].id,
                firstName: user.data[0].firstName,
                lastName: user.data[0].lastName,
                email: user.data[0].email,
              });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async resolveInvitation(invitationId, status) {
      if (this.currentUser) {
        await InvitationProxy.updateInvitation(
          invitationId,
          this.currentUser.id,
          status
        )
          .then(async (response) => {
            this.$notify({
              title: `La invitación fue ${
                status ? "aceptada" : "rechazada"
              } correctamente`,
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
            window.location.reload();
          })
          .catch((e) => {
            this.$notify({
              title: `La invitación fue ${
                status ? "aceptada" : "rechazada"
              } correctamente`,
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "warning",
            });
            window.location.reload();
          });
      }
    },
    getErrorMessage(e) {
      switch (e) {
        case (e = "The guest that you try to invite doesnt exist"):
          return "El usuario que tratas de invitar no existe.";
        case (e =
          "Cannot send another invitation to this guest user because you have an existing one"):
          return "No se puede volver a invitar a este usuario porque tiene una invitación pendiente.";
        case (e = "Cannot send an invite to yourself"):
          return "No puedes invitarte a ti mismo.";
        case (e =
          "Cannot send an invitation to this guest user because its already on your team"):
          return "No se puede volver a invitar a este usuario porque ya se encuentra en tu equipo.";
        default:
          return e;
      }
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.getTeamMembers();
    this.getInvitacions();
  },
};
</script>
<style>
</style>
