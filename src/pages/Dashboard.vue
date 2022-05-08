<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div
        class="col-md-6 col-xl-3"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card>
          <div
            class="icon-big text-center"
            :class="`icon-${stats.type}`"
            slot="header"
          >
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{ stats.title }}</p>
            {{ stats.value }}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{ stats.footerText }}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-12">
        <chart-card
          title="Actividad de los programas utilizados"
          sub-title="Ultimas 24 horas de programas utilizados"
          :chart-data="usersChart.data"
          :chart-options="usersChart.options"
        >
          <span slot="footer">
            <i class="ti-timer"></i>Actualizado recientemente</span
          >
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Click
            <i class="fa fa-circle text-warning"></i> Click Second Time
          </div>
        </chart-card>
      </div>

      <div class="col-md-6 col-12" v-if="data.labels.length">
        <chart-card
          title="Páginas más visitadas"
          sub-title="Las últimas páginas más visitadas"
          :chart-data="data"
          chart-type="Pie"
        >
          <span slot="footer">
            <i class="ti-timer"></i>Actualizado recientemente</span
          >
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> {{ visitedPages[1].name }}
            <i class="fa fa-circle text-warning"></i>{{ visitedPages[2].name }}
            <i class="fa fa-circle text-danger"></i> {{ visitedPages[0].name }}
          </div>
        </chart-card>
      </div>

      <div
        class="col-md-6 col-12 bg-white"
        style="margin: 0.75rem 0 2rem 0"
        v-if="screenshots.length"
      >
        <h5 style="font-size: 1.5em; font-weight: 300; color: #252422">
          Capturas de pantalla
        </h5>
        <h6
          style="
            color: #9a9a9a;
            margin-top: -1rem;
            display: block;
            font-size: 14px;
            text-transform: none;
            font-weight: 400;
          "
        >
          Capturas realizadas en las últimas 24 horas
        </h6>
        <v-row class="mt-2">
          <v-col v-for="screenshot in screenshots" :key="screenshot.id">
            <enlargeable-image
              :src="screenshot.blob"
              :src_large="screenshot.blob"
              style="width: 200px; height: 130px; margin: auto"
            />
          </v-col>
        </v-row>
        <hr class="d-block" style="margin-top: 3.5rem; display: block" />
        <span
          style="color: #a9a9a9; margin-top: -0.25rem; display: block"
          slot="footer"
        >
          <i class="ti-timer ml-2"></i>Actualizado recientemente</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import Chartist from "chartist";
import InvitationProxy from "@/proxies/invitation.proxy";
import UrlProxy from "@/proxies/url.proxy";
import ScreenshotProxy from "@/proxies/screenshot.proxy";
import EnlargeableImage from "@diracleo/vue-enlargeable-image";
export default {
  components: {
    StatsCard,
    ChartCard,
    EnlargeableImage,
  },
  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "ti-server",
          title: "Equipo",
          value: 0,
          footerText: "Actualizado ahora",
          footerIcon: "ti-reload",
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Invitaciones",
          value: 0,
          footerText: "Actualizado ahora",
          footerIcon: "ti-reload",
        },
        {
          type: "danger",
          icon: "ti-pulse",
          title: "Actividades",
          value: 0,
          footerText: "Actualizado ahora",
          footerIcon: "ti-reload",
        },
        {
          type: "info",
          icon: "ti-twitter-alt",
          title: "Capturas",
          value: 0,
          footerText: "Actualizado ahora",
          footerIcon: "ti-reload",
        },
      ],
      usersChart: {
        data: {
          labels: [
            "9:00AM",
            "12:00AM",
            "3:00PM",
            "6:00PM",
            "9:00PM",
            "12:00PM",
            "3:00AM",
            "6:00AM",
          ],
          series: [
            [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410],
          ],
        },
        options: {
          low: 0,
          high: 1000,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3,
          }),
          showLine: true,
          showPoint: false,
        },
      },
      activityChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [
            [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
            [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795],
          ],
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false,
          },
          height: "245px",
        },
      },
      data: {
        labels: [],
        series: [],
      },
      visitedPages: [{ name: "" }, { name: "" }, { name: "Otros" }],
      screenshots: [],
    };
  },
  methods: {
    async getTeamMembers() {
      if (this.currentUser) {
        await InvitationProxy.searchInvitation()
          .then(async (response) => {
            const filter = response.data.filter(
              (x) => x.managerId == this.currentUser.id && x.status
            );
            this.statsCards[0].value = filter.length;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async getUserInvitations() {
      if (this.currentUser) {
        await InvitationProxy.searchInvitation(null, null, this.currentUser.email)
          .then((response) => {
            this.statsCards[1].value = response.data.filter(
              (x) => !x.status
            ).length;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async getUrls() {
      if (this.currentUser) {
        await UrlProxy.searchUrl(null, this.currentUser.id)
          .then((response) => {
            this.statsCards[2].value = response.data.length;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async getScreenshots() {
      if (this.currentUser) {
        await ScreenshotProxy.searchScreenshot(this.currentUser.id, null)
          .then(async (response) => {
            this.screenshots = response.data.slice(0, 6);
            this.statsCards[3].value = response.data.length;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async getMostVisitedPages() {
      if (this.currentUser) {
        await UrlProxy.searchUrl(null, this.currentUser.id)
          .then((response) => {
            const uris = [];
            response.data.forEach((page) => {
              const host = new URL(page.uri).host;
              if (host != "" && host != null && host != undefined) {
                uris.push(host);
              }
            });

            const groups = (arr) => {
              return arr.reduce(
                (acc, val) => {
                  const { data, map } = acc;
                  const ind = map.get(val);
                  if (map.has(val)) {
                    data[ind][1]++;
                  } else {
                    map.set(val, data.push([val, 1]) - 1);
                  }
                  return { data, map };
                },
                {
                  data: [],
                  map: new Map(),
                }
              ).data;
            };

            var sortedArray = groups(uris).sort((a, b) => {
              return a[1] - b[1];
            });

            const secondToLastPagePercentage = Math.round(
              (sortedArray[sortedArray.length - 2][1] / uris.length) * 100
            );
            const lastPagePercentage = Math.round(
              (sortedArray[sortedArray.length - 1][1] / uris.length) * 100
            );
            const otherPagesPercentage =
              100 - secondToLastPagePercentage - lastPagePercentage;

            this.visitedPages[0].name = sortedArray[sortedArray.length - 1][0];
            this.visitedPages[1].name = sortedArray[sortedArray.length - 2][0];

            this.data.labels = [
              `${lastPagePercentage}%`,
              `${secondToLastPagePercentage}%`,
              `${otherPagesPercentage}%`,
            ];
            this.data.series = [
              lastPagePercentage,
              secondToLastPagePercentage,
              otherPagesPercentage,
            ];
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
    this.getUserInvitations();
    this.getUrls();
    this.getMostVisitedPages();
    this.getScreenshots();
  },
};
</script>
<style>
</style>
