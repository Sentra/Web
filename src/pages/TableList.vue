<template>
  <div class="row">
    <div class="col-12">
      <h4>Actividad de los programas</h4>
      <v-data-table
        :headers="headersTeamMembers"
        :items="programs"
        :items-per-page="5"
      >
      </v-data-table>
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
        { text: "Tiempo utilizado (en horas)", value: "timeUsed" },
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
