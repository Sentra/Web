<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex">
        <h4 class="ml-3">Actividad de los programas</h4>
        <v-card-actions style="margin: 1rem 2rem 0 auto">
          <v-btn @click="getPrograms">Actualizar</v-btn>
        </v-card-actions>
      </div>
      <div v-if="programs.length">
        <v-data-table
          :headers="headersTeamMembers"
          :items="programs"
          :items-per-page="5"
        >
        </v-data-table>
      </div>
      <div class="mx-auto mt-5" v-if="!programs.length">
        <div class="text-center">
          <i class="fas fa-folder-open fa-4x"></i>
        </div>
        <p class="text-center mt-2">No se encontraron registros.</p>
      </div>
    </div>
  </div>
</template>
<script>
import ProgramProxy from "@/proxies/program.proxy";
export default {
  data() {
    return {
      headersTeamMembers: [
        { text: "Aplicación", value: "description" },
        { text: "Fecha de inicio", value: "startDate" },
        { text: "Fecha de fin", value: "endDate" },
        { text: "Tiempo utilizado (en minutos)", value: "timeUsed" },
      ],
      programs: [],
    };
  },
  methods: {
    async getPrograms() {
      if (this.currentUser) {
        await ProgramProxy.searchProgram(null, this.currentUser.id)
          .then(async (response) => {
            const result = [];
            response.data.forEach((element) => {
              element.startDate = new Date(element.startDate).toLocaleString();
              element.endDate = new Date(element.endDate).toLocaleString();
              if (
                element.description.trim() &&
                element.startDate &&
                element.endDate
              )
                result.push(element);
            });
            this.programs = result;
          })
          .catch((e) => {
            console.log(e);
          });
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
    this.getPrograms();
  },
};
</script>
<style>
</style>
