<template>
  <div v-if="currentUser" class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" name="Home" icon="ti-panel" />
        <sidebar-link to="/activities" name="Actividades" icon="ti-bar-chart" />
        <sidebar-link to="/team" name="Mi equipo" icon="ti-layout-grid2" />
        <sidebar-link to="/screenshots" name="Capturas" icon="ti-gallery" />
        <sidebar-link to="/programs" name="Programas" icon="ti-view-list-alt" />
        <sidebar-link to="/profile" name="Perfil" icon="ti-user" />
        <a class="logout_button mt-3" @click="logout"
          ><i class="ti-settings" style="margin: -.25rem .75rem 0 0"></i> CERRAR SESIÓN</a
        >
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>
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
  },
};
</script>

<style lang="scss">
.logout_button {
  display: none;
}
@media (max-width: 991px) {
  .logout_button {
    display: block;
    color: #B8B8B8;
    font-weight: 700;
    font-size: .75rem;
  }
}
</style>
