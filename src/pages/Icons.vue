<template>
  <div>
    <v-card class="m-auto p-2" flat>
      <h4 class="ml-2" style="color: #66615b">Capturas de pantalla</h4>
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
              style="background: #66615b; color: #fff; border-radius: 10px"
              @click="search"
            >
              Buscar
            </button>
          </div>
          <div class="mx-auto" style="margin-top: 6rem" v-if="!screenshots.length">
            <div class="text-center">
              <i class="fas fa-folder-open fa-4x" style="color: #66615b"></i>
            </div>
            <p class="text-center mt-3 pb-5">No se encontraron registros.</p>
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
</template>
<script>
import ScreenshotProxy from "@/proxies/screenshot.proxy";
import EnlargeableImage from "@diracleo/vue-enlargeable-image";
import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import Button from "../components/Button.vue";

export default {
  components: {
    EnlargeableImage,
    Datepicker,
    Button,
  },
  data() {
    return {
      screenshots: [],
      dates: {
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    async getScreenshots() {
      if (this.currentUser) {
        await ScreenshotProxy.searchScreenshot(this.currentUser.id, null)
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
      if (this.currentUser) {
        if (!this.dates.startDate || !this.dates.endDate) {
          this.validateDates();
        } else {
          await ScreenshotProxy.searchScreenshot(this.currentUser.id, null)
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
    this.getScreenshots();
  },
};
</script>