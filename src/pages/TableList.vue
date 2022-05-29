<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex">
        <h4 class="ml-3">Actividad de los programas</h4>
        <v-card-actions style="margin: 1rem 2rem 0 auto">
          <v-btn
            elevation="0"
            @click="getPrograms"
            style="border: 1px solid #c4c4c4"
            >Actualizar</v-btn
          >
        </v-card-actions>
      </div>
      <div v-if="programs.length">
        <v-data-table
          :headers="headersTeamMembers"
          :items="programs"
          :items-per-page="10"
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
            const groups = {};

            for (const element of response.data) {
              const list = groups[element.description];
              if (list) {
                list.push(element);
              } else {
                groups[element.description] = [element];
              }
            }
            const a = 5;

            for (const group of Object.values(groups)) {
              result.push({
                description: group[0].description,
                startDate: new Date(group[0].startDate).toLocaleString(),
                endDate: new Date(group[group.length - 1].endDate).toLocaleString(),
                timeUsed: this.sum(group, 'timeUsed'),
              });
            }

            this.programs = result;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    sum(items, prop) {
        return items.reduce((a, b) => {
            return a + b[prop];
        }, 0);
    }
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
