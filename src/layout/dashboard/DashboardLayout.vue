<template>
  <div v-if="currentUser" class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" name="Home" icon="ti-panel" />
        <sidebar-link to="/activities" name="Actividades" icon="ti-text" />
        <sidebar-link to="/team" name="Mi equipo" icon="ti-bell" />
        <sidebar-link to="/screenshots" name="Capturas" icon="ti-settings" />
        <sidebar-link to="/programs" name="Programas" icon="ti-view-list-alt" />
        <sidebar-link to="/profile" name="Perfil" icon="ti-user" />
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <!-- <content-footer></content-footer> -->
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
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
  },
};
</script>
