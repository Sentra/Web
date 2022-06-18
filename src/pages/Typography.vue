<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex">
        <h4 class="ml-3">Actividades de las páginas</h4>
        <v-card-actions style="margin: 1rem 2rem 0 auto">
          <v-btn
            elevation="0"
            @click="getUrls"
            style="border: 1px solid #c4c4c4"
            >Actualizar</v-btn
          >
        </v-card-actions>
      </div>
      <v-tabs centered class="pt-8" v-if="hasData">
        <v-tab
          v-for="item in model"
          :key="item.index"
          v-if="item.data.length"
          >{{ item.name }}</v-tab
        >
        <v-tab-item
          v-for="item in model"
          :key="item.index"
          style="table-layout: fixed !important"
        >
          <v-card class="mx-auto mt-8 p-1" flat>
            <h4 class="ml-4">{{ item.title }}</h4>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="item.data"
              :items-per-page="5"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="search"
                  label="Busca por título o url"
                  class="mx-4"
                  append-icon="mdi-magnify"
                ></v-text-field>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
      </v-tabs>
      <div class="mx-auto mt-5" v-if="!hasData">
        <div class="text-center">
          <i class="fas fa-folder-open fa-4x"></i>
        </div>
        <p class="text-center mt-2">No se encontraron registros.</p>
      </div>
    </div>
  </div>
</template>
<script>
import UrlProxy from "@/proxies/url.proxy";

export default {
  data() {
    return {
      search: "",
      headers: [
        { text: "Titulo", value: "title", width: "250px" },
        { text: "Url", value: "uri", width: "400px" },
        { text: "Fecha", value: "date", width: "150px" },
        { text: "Hora", value: "time", width: "100px" },
      ],
      hasData: false,
      model: [
        {
          name: "Chrome",
          title: "Historial de navegación de Chrome",
          data: [],
        },
        {
          name: "Opera",
          title: "Historial de navegación de Opera",
          data: [],
        },
        {
          name: "Firefox",
          title: "Historial de navegación de Firefox",
          data: [],
        },
        {
          name: "Edge",
          title: "Historial de navegación de Edge",
          data: [],
        },
      ],
    };
  },
  methods: {
    async getUrls() {
      if (this.currentUser) {
        await UrlProxy.searchUrl(null, this.currentUser.id)
          .then((response) => {
            const result = [];
            if (response.data.length && !this.hasData) this.hasData = true;
            response.data.forEach((element) => {
              element.date = this.fixDates(element.date);
              element.time = this.fixTime(element.time);
              result.push(element);
            });
            this.model.find((x) => x.name === "Chrome").data = result.filter(
              (x) => x.browser === "Chrome"
            );
            this.model.find((x) => x.name === "Opera").data = result.filter(
              (x) => x.browser === "Opera"
            );
            this.model.find((x) => x.name === "Firefox").data = result.filter(
              (x) => x.browser === "Firefox"
            );
            this.model.find((x) => x.name === "Edge").data = result.filter(
              (x) => x.browser === "Edge"
            );
          })
          .catch((e) => {
            if (e.response.status === 401) {
              this.logout();
            }
            console.log(e);
          });
      }
    },
    fixDates(date) {
      if (!date) return date;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    fixTime(time) {
      if (!time) return time;
      return time.slice(0, time.length - 3);
    },
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
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
    this.getUrls();
  },
};
</script>
<style lang="scss">
</style>

