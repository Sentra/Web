import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import Information from "@/pages/Information.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";
import Payment from "@/pages/Payment.vue";
import Privacy from "@/pages/Privacy.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "profile",
        name: "profile",
        component: UserProfile
      },
      {
        path: "team",
        name: "team",
        component: Notifications
      },
      {
        path: "/team/:id/information",
        name: "/team/:id/information",
        component: Information
      },
      {
        path: "screenshots",
        name: "screenshots",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "activities",
        name: "activities",
        component: Typography
      },
      {
        path: "programs",
        name: "programs",
        component: TableList
      }
    ]
  },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/payment", name: "payment", component: Payment },
  { path: "/privacy", name: "privacy", component: Privacy },
  { path: "*", component: NotFound }
];

export default routes;
