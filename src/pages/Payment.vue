<template>
  <div class="" style="background-color: #324755; height: 100vh">
    <h4
      class="text-center mt-0 pt-5"
      style="color: #fff; font-weight: 400; font-size: 2rem"
    >
      Complete su suscripción
    </h4>
    <div>
      <VCreditCard
        direction="row"
        :trans="translations"
        @cardChanged="cardChanged"
        @change="creditInfoChanged"
      />
      <div class="mx-auto text-center mt-2">
        <h5 style="color: #fff">Ingrese su email</h5>
        <div style="display: flex; justify-content: center">
          <v-text-field
            v-model="email"
            id="email"
            label="Email"
            type="email"
            dark
            outlined
            style="max-width: 400px"
          ></v-text-field>
          <v-card-actions style="width: 100px">
            <v-btn
              :disabled="!isValid"
              block
              style="
                margin: -1.75rem 0 0 2rem;
                position: relative;
                border-radius: 10px;
                max-width: 200px;
                padding: 1.5rem 1rem;
              "
              color="#D97D54"
              dark
              @click="send"
              >Enviar</v-btn
            >
          </v-card-actions>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VCreditCard from "v-credit-card";
import "v-credit-card/dist/VCreditCard.css";
import InvitationProxy from "@/proxies/invitation.proxy";

export default {
  name: "payment",
  components: {
    VCreditCard,
  },
  data() {
    return {
      translations: {
        name: {
          label: "Nombre",
          placeholder: "Nombre completo",
        },
        card: {
          label: "Número de tarjeta",
          placeholder: "Número de tarjeta",
        },
        card: {
          label: "Número de tarjeta",
          placeholder: "Número de tarjeta",
        },
        expiration: {
          label: "Fecha de expiración",
        },
        security: {
          label: "Código de seguridad",
          placeholder: "Código",
        },
      },
      name: null,
      cardNumber: null,
      expiration: null,
      security: null,
      email: null,
      cardName: null,
      isValid: false,
      suscription: new URLSearchParams(window.location.search).get(
        "suscripcion"
      ),
    };
  },
  computed: {},
  created() {},
  methods: {
    creditInfoChanged(values) {
      for (const key in values) {
        this[key] = values[key];
      }
    },
    cardChanged(cardName) {
      this.cardName = cardName;
    },
    async send() {
      if (this.isValid) {
        if (!this.suscription) this.suscription = "mensual";
        await InvitationProxy.confirmPayment(
          this.name,
          this.email,
          this.suscription
        )
          .then(async (response) => {
            this.$notify({
              title: `Se le enviará un email de confirmación apenas su pago sea procesado.`,
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
            setTimeout(() => {
              window.location.href = "https://web-delta-dun.vercel.app/#/login";
            }, 5000);
          })
          .catch((e) => {
            this.$notify({
              title: `Ocurrió un problema al procesar el pago. Intentelo nuevamente más tarde.`,
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "warning",
            });
          });
      }
    },
  },
  watch: {
    security() {
      if (
        this.name &&
        this.cardNumber &&
        this.expiration &&
        this.security &&
        this.email
      ) {
        this.isValid = true;
      }
    },
    email() {
      if (
        this.name &&
        this.cardNumber &&
        this.expiration &&
        this.security &&
        this.email
      ) {
        this.isValid = true;
      }
    },
  },
};
</script>

<style lang="scss">
.credit-card-form {
  label,
  input {
    color: #fff !important;
  }
}
</style>