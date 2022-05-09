<template>
  <v-card flat>
    <v-card-actions>
      <v-btn @click="$router.push(`/team`)">
        <i class="fas fa-arrow-left" style="color: rgb(102, 97, 91)"></i>
      </v-btn>
    </v-card-actions>
    <v-tabs centered class="pt-8">
      <v-tab> Historial de navegación </v-tab>
      <v-tab> Capturas de pantalla </v-tab>
      <v-tab> Programas utilizados </v-tab>
      <v-tab-item>
        <div class="row">
          <div class="col-12">
            <div class="d-flex">
              <v-card-actions style="margin: 1rem 2rem 0 auto">
                <v-btn @click="getUrls">Actualizar</v-btn>
              </v-card-actions>
            </div>
            <v-tabs centered class="pt-8">
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
                    :search="searchUrls"
                    :headers="headers"
                    :items="item.data"
                    :items-per-page="5"
                  >
                    <template v-slot:top>
                      <v-text-field
                        v-model="searchUrls"
                        label="Busca por título o url"
                        class="mx-4"
                        append-icon="mdi-magnify"
                      ></v-text-field>
                    </template>
                  </v-data-table>
                </v-card>
              </v-tab-item>
            </v-tabs>
            <div class="mx-auto" v-if="!hasData">
              <div class="text-center">
                <i
                  class="fas fa-folder-open fa-4x"
                  style="color: rgb(102, 97, 91)"
                ></i>
              </div>
              <p class="mt-2 text-center" style="color: rgb(102, 97, 91)">
                No se encontraron registros.
              </p>
            </div>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div>
          <v-card class="m-auto p-2" flat>
            <v-container fluid>
              <div>
                <div class="d-flex">
                  <h6 style="margin: 0.8rem 1rem 0 0">
                    Filtra las capturas por fecha:
                  </h6>
                  <div
                    class="p-2"
                    style="border: 1px solid #66615b; border-radius: 10px"
                  >
                    <datepicker
                      placeholder="Ingresa la fecha de inicio"
                      v-model="dates.startDate"
                      ref="startDatePicker"
                      name="startDate"
                      :monday-first="true"
                    />
                  </div>
                  <div
                    class="ml-4 p-2"
                    style="border: 1px solid #66615b; border-radius: 10px"
                  >
                    <datepicker
                      placeholder="Ingresa la fecha de fin"
                      v-model="dates.endDate"
                      ref="endDatePicker"
                      name="endDate"
                      :monday-first="true"
                      :disabled-dates="{ to: new Date(dates.startDate) }"
                    />
                  </div>
                  <button
                    class="ml-4 p-2"
                    style="
                      background: #66615b;
                      color: #fff;
                      border-radius: 10px;
                    "
                    @click="search"
                  >
                    Buscar
                  </button>
                </div>
                <div
                  class="mx-auto"
                  style="margin-top: 6rem"
                  v-if="!screenshots.length"
                >
                  <div class="text-center">
                    <i
                      class="fas fa-folder-open fa-4x"
                      style="color: #66615b"
                    ></i>
                  </div>
                  <p class="text-center mt-3" style="color: rgb(102, 97, 91)">
                    No se encontraron registros.
                  </p>
                </div>
                <v-row class="mt-3" v-else>
                  <v-col v-for="screenshot in screenshots" :key="screenshot.id">
                    <enlargeable-image
                      :src="screenshot.blob"
                      :src_large="screenshot.blob"
                    />
                    <h6 class="mt-2 ml-4">{{ screenshot.name }}</h6>
                  </v-col>
                </v-row>
              </div>
            </v-container>
          </v-card>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="row">
          <div class="col-12">
            <div class="d-flex">
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
                <i
                  class="fas fa-folder-open fa-4x"
                  style="color: rgb(102, 97, 91)"
                ></i>
              </div>
              <p class="text-center mt-2" style="color: rgb(102, 97, 91)">
                No se encontraron registros.
              </p>
            </div>
          </div>
        </div>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import ScreenshotProxy from "@/proxies/screenshot.proxy";
import EnlargeableImage from "@diracleo/vue-enlargeable-image";
import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import Button from "../components/Button.vue";
import ProgramProxy from "@/proxies/program.proxy";
import UrlProxy from "@/proxies/url.proxy";
export default {
  components: {
    EnlargeableImage,
    Datepicker,
    Button,
  },
  data() {
    return {
      id: this.$route.params.id,
      searchUrls: "",
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
      headersTeamMembers: [
        { text: "Aplicación", value: "description" },
        { text: "Fecha de inicio", value: "startDate" },
        { text: "Fecha de fin", value: "endDate" },
        { text: "Tiempo utilizado (en minutos)", value: "timeUsed" },
      ],
      programs: [],
      screenshots: [],
      dates: {
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    async getUrls() {
      if (this.id !== undefined && this.id !== null) {
        await UrlProxy.searchUrl(null, this.id)
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
            console.log(e);
          });
      }
    },
    async getPrograms() {
      if (this.id !== undefined && this.id !== null) {
        await ProgramProxy.searchProgram(null, this.id)
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
    async getScreenshots() {
      if (this.id !== undefined && this.id !== null) {
        await ScreenshotProxy.searchScreenshot(this.id, null)
          .then(async (response) => {
            this.screenshots = response.data;
          })
          .catch((e) => {
            this.$notify({
              title: "Surgió un problema al cargar las imágenes",
              icon: "fa-solid fa-circle-exclamation",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "warning",
            });
            console.log(e);
          });
      }
    },
    async search() {
      if (this.id !== undefined && this.id !== null) {
        if (!this.dates.startDate || !this.dates.endDate) {
          this.validateDates();
        } else {
          await ScreenshotProxy.searchScreenshot(this.id, null)
            .then(async (response) => {
              const result = [];
              for (const screenshot of response.data) {
                if (
                  screenshot.date >=
                    new Date(this.dates.startDate).toISOString() &&
                  screenshot.date <= new Date(this.dates.endDate).toISOString()
                ) {
                  result.push(screenshot);
                }
              }
              this.screenshots = result;
            })
            .catch((e) => {
              this.$notify({
                title:
                  "Surgió un problema al buscar las imágenes entre esos rangos de tiempo",
                icon: "fa-solid fa-circle-exclamation",
                horizontalAlign: "center",
                verticalAlign: "top",
                type: "warning",
              });
              console.log(e);
            });
        }
      }
    },
    validateDates() {
      if (!this.dates.startDate) {
        this.$notify({
          title: "Debe ingresar una fecha de inicio para poder buscar",
          icon: "fa-solid fa-circle-exclamation",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
        });
      }
      if (!this.dates.endDate) {
        this.$notify({
          title: "Debe ingresar una fecha de fin para poder buscar",
          icon: "fa-solid fa-circle-exclamation",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
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
    this.getScreenshots();
    this.getPrograms();
  },
};
</script>
