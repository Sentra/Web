<template>
  <v-card class="m-auto p-2" flat>
    <h4 class="ml-2">Capturas de pantalla</h4>
    <v-container fluid>
      <div v-if="!screenshots.length">
        Por el momento no cuenta con capturas de pantalla registradas
      </div>
      <div v-else>
        <v-row>
          <v-col v-for="screenshot in screenshots" :key="screenshot.id">
            <enlargeable-image :src="screenshot.blob" :src_large="screenshot.blob"  />
            <!-- <v-img
              :src="screenshot.blob"
              :lazy-src="screenshot.blob"
              width="300px"
              :alt="screenshot.name"
              aspect-ratio="1"
            ></v-img> -->
            <h6 class="mt-2 ml-4">{{ screenshot.name }}</h6>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-card>
</template>
<script>
import ScreenshotProxy from "@/proxies/screenshot.proxy";
import EnlargeableImage from '@diracleo/vue-enlargeable-image';
export default {
    components: {
    EnlargeableImage
  },
  data() {
    return {
      screenshots: [],
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