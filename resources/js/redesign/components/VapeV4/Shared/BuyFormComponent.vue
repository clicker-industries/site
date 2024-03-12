<template>
  <div class="buy-form__wrapper">
    <div class="buy-form__title">
      Enter Payment Details
    </div>
    <div class="buy-form__options-wrapper options-wrapper">
      <label v-for="paymentType in paymentOptions" :key="paymentType.name" :class="{ selected: selectedForm === paymentType.name }">
        {{ paymentType.name === "Stripe" ? "Card" : paymentType.name }}
        <input type="radio" v-model="selectedForm" :value="paymentType.name" @change="selectedForm = paymentType.name">
      </label>
    </div>
    <div class="buy-form__selected-option">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="formComponent"></component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CardFormComponent from './Forms/CardFormComponent';
import PayPalFormComponent from './Forms/PayPalFormComponent';
import StripeFormComponent from './Forms/StripeFormComponent';
import AmazonFormComponent from './Forms/AmazonFormComponent';
import AliPayFormComponent from './Forms/AliPayFormComponent';
import WeChatFormComponent from './Forms/WeChatFormComponent';

export default {
  components: {
    CardFormComponent,
    PayPalFormComponent,
    StripeFormComponent,
    AmazonFormComponent,
    AliPayFormComponent,
    WeChatFormComponent
  },
  mounted() {
    //this.selectedForm = "Card";
  },
  data() {
    return {
      selectedForm: ''
    };
  },
  methods: {},
  computed: {
    ...mapState({
      paymentOptions: state => state.vapeV4.possiblePaymentTypes
    }),
    formComponent() {
      if (this.selectedForm.length) {
        return `${this.selectedForm}FormComponent`;
      } else {
        const opts = [];
        Object.keys(this.paymentOptions).forEach(key => {
          if (this.paymentOptions[key].enabled) {
            opts.push(this.paymentOptions[key].name);
          }
        });
        if (opts.length) {
          this.selectedForm = opts[0];
          return `${opts[0]}FormComponent`;
        }
      }
    }
  }
};
</script>
