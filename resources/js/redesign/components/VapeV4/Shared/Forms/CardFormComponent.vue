<template>
  <div class="card-form__component">
    <div class="card-form__wrapper">
      <div class="card-input">
        <label class="card-input__label" for="nameOnCard">Name on card</label>
        <input
            v-model.trim="$v.cardName.$model"
            ref="nameOnCard"
            class="card-input__input"
            autocomplete="off"
            id="nameOnCard"
            type="text"
            @input="$v.cardName.$model = $event.target.value.trim()"
            @blur="$forceUpdate()"
        >
      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-input">
            <label class="card-input__label" for="cardNumber">Card Number</label>
            <input
                v-mask="generateCardMask"
                v-model.trim="$v.cardNumber.$model"
                class="card-input__input"
                autocomplete="off"
                data-ref="cardNumber"
                id="cardNumber"
                type="text"
                @input="$v.cardNumber.$model = $event.target.value.trim()"
                @blur="$forceUpdate()"
            >
          </div>
        </div>
        <div class="card-form__col exp-date">
          <div ref="expDate" class="card-input">
            <label class="card-input__label" for="expDate">Exp Date</label>
            <input
                v-mask="expDateMask"
                v-model.trim="$v.expDate.$model"
                class="card-input__input"
                autocomplete="off"
                data-ref="expDate"
                id="expDate"
                placeholder="MM/YY"
                type="text"
                @focus="onExpDateFocus"
                @click="onExpDateFocus"
                @input="$v.expDate.$model = $event.target.value.trim()"
                @blur="$forceUpdate()"
            >
          </div>
        </div>
        <div class="card-form__col cvv">
          <div ref="cvv" class="card-input">
            <label class="card-input__label" for="cvv">CVV</label>
            <input
                v-model.trim="$v.cardCvv.$model"
                class="card-input__input"
                autocomplete="off"
                data-ref="cvv"
                id="cvv"
                type="text"
                @input="$v.cardCvv.$model = $event.target.value.trim()"
                @blur="$forceUpdate()"
            >
          </div>
        </div>
      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-input">
            <label class="card-input__label" for="country">Country</label>
            <select
                v-model.trim="$v.country.$model"
                id="country"
                class="card-input__input -select"
                @change="($event) => { const $$selectedVal = Array.prototype.filter.call($event.target.options, (o) => o.selected).map((o) => ('_value' in o ? o._value : o.value)); $set($v.country, '$model', $event.target.multiple ? $$selectedVal : $$selectedVal[0]); }"
            >
              <option
                  v-for="(country, index) in countries"
                  :key="index"
                  :value="country.value"
                  :selected="country.value === countryCode"
              >
                {{ country.option }}
              </option>
            </select>
          </div>
        </div>
        <div class="card-form__col zip">
          <div ref="zip" class="card-input">
            <label class="card-input__label" for="zip">Zip code</label>
            <input
                v-model.trim="$v.zip.$model"
                class="card-input__input"
                autocomplete="off"
                data-ref="cvv"
                id="zip"
                type="text"
                @input="$v.zip.$model = $event.target.value.trim()"
                @blur="$forceUpdate()"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="submit-form__wrapper">
      <div class="submit-form__price">
        <span v-if="selectedProduct.price_old" class="v_price_desc">
          <span class="v_price_old_line_through">
            <span class="v_price_old">$ {{ selectedProduct.price_old }}</span>
          </span>
        </span>
        <div class="product-price">
          $ {{ selectedProduct.price }}
          <sup>/ {{ selectedProduct.recurring ? 'month' : 'one-time' }}</sup>
        </div>
        <div class="price-ntf">
          {{ selectedProduct.recurring ? 'Cancel anytime' : 'No monthly payments' }}
        </div>
      </div>
      <div class="submit-form__button">
        <button class="btn" :disabled="!buyBtnEnabled" @click="sendPaymentRequest">Buy now</button>
      </div>
    </div>
    <div class="submit-form__error" :class="{ hidden: !hasServerError }">
      An error has occurred. Check card details.
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { validationMixin, required, minLength } from 'vuelidate';
import countries from './utils/countries.js';

export default {
  mixins: [validationMixin],
  props: ['countryCode'],
  mounted() {
    if (document.getElementById("nameOnCard") !== null) {
      document.getElementById("nameOnCard").focus();
    }
    this.country = this.countryCode ? this.countryCode : '';
    $.get("https://ipinfo.io", (response) => {
      this.country = response.country;
      this.$v.country.$touch();
    }, "jsonp");
  },
  data() {
    return {
      cardName: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
      cardCvv: "",
      zip: "",
      country: "",
      countries: countries,
      minCardYear: new Date().getFullYear(),
      amexCardMask: "#### ###### #####",
      otherCardMask: "#### #### #### ####",
      expDateMask: "##/##",
      hasServerError: false
    };
  },
  validations: {
    cardName: {
      required,
      minLength: minLength(5)
    },
    cardNumber: {
      required,
      minLength: minLength(17)
    },
    expDate: {
      required,
      minLength: minLength(5)
    },
    cardCvv: {
      required,
      minLength: minLength(3)
    },
    zip: {
      required
    },
    country: {
      required
    }
  },
  watch: {
    cardYear(val) {
      if (this.cardMonth < this.minCardMonth) {
        this.cardMonth = '';
      }
      if (val.toString().length > 2) {
        this.cardYear = '';
      }
      if (val.toString().length === 2 && +val < +this.minCardYear.toString().substr(2)) {
        this.cardYear = '';
      }
    },
    cardMonth(val) {
      if (val.toString().length > 2) {
        this.cardMonth = '';
      }
      if (val.toString().length === 2 && (+val < this.minCardMonth || +val > 12)) {
        this.cardMonth = '';
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.vapeV4.user
    }),
    ...mapGetters('vapeV4', ['selectedProduct']),
    buyBtnEnabled() {
      return this.formErrorList.length === 0 && this.$v.$dirty;
    },
    minCardMonth() {
      return this.cardYear === this.minCardYear ? new Date().getMonth() + 1 : 1;
    },
    expDate: {
      get() {
        return `${this.cardMonth}${this.cardMonth || this.cardYear ? '/' : ''}${this.cardYear}`;
      },
      set(val) {
        const data = val.split('/');
        this.cardMonth = data[0];
        if (data.length > 1) {
          this.cardYear = data[data.length - 1];
        }
      }
    },
    getCardType() {
      const number = this.cardNumber;
      let re = new RegExp("^4");
      if (number.match(re) != null) return "visa";
      re = new RegExp("^(34|37)");
      if (number.match(re) != null) return "amex";
      re = new RegExp("^5[1-5]");
      if (number.match(re) != null) return "mastercard";
      re = new RegExp("^6011");
      if (number.match(re) != null) return "discover";
      re = new RegExp('^9792');
      if (number.match(re) != null) return 'troy';
      return "visa"; // default type
    },
    generateCardMask() {
      return this.getCardType === "amex" ? this.amexCardMask : this.otherCardMask;
    },
    formErrorList() {
      const errorList = [];
      /*Card Name*/
      if (!this.$v.cardName.required && this.$v.cardName.$dirty) {
        errorList.push({ cardNameRequired: 'Name is required' });
      } else {
        if (errorList.hasOwnProperty('cardNameRequired')) {
          delete errorList.cardNameRequired;
        }
      }
      if (!this.$v.cardName.minLength && this.$v.cardName.$dirty) {
        errorList.push({ cardNameMinLength: `Name must have at least ${this.$v.cardName.$params.minLength.min} letters.` });
      } else {
        if (errorList.hasOwnProperty('cardNameMinLength')) {
          delete errorList.cardNameMinLength;
        }
      }

      /*Card Number*/
      if (!this.$v.cardNumber.required && this.$v.cardNumber.$dirty) {
        errorList.push({ cardNumberRequired: 'Card number is required' });
      } else {
        if (errorList.hasOwnProperty('cardNameRequired')) {
          delete errorList.cardNumberRequired;
        }
      }
      if (!this.$v.cardNumber.minLength && this.$v.cardNumber.$dirty) {
        errorList.push({ cardNumberMinLength: `Card number must have at least ${this.$v.cardNumber.$params.minLength.min} characters.` });
      } else {
        if (errorList.hasOwnProperty('cardNameMinLength')) {
          delete errorList.cardNumberMinLength;
        }
      }

      /*Card Cvv*/
      if (!this.$v.cardCvv.required && this.$v.cardCvv.$dirty) {
        errorList.push({ cardCvvRequired: 'Card number is required' });
      } else {
        if (errorList.hasOwnProperty('cardNameRequired')) {
          delete errorList.cardCvvRequired;
        }
      }
      if (!this.$v.cardCvv.minLength && this.$v.cardCvv.$dirty) {
        errorList.push({ cardCvvMinLength: `Card number must have at least ${this.$v.cardCvv.$params.minLength.min} characters.` });
      } else {
        if (errorList.hasOwnProperty('cardNameMinLength')) {
          delete errorList.cardCvvMinLength;
        }
      }
      return errorList;
    }
  },
  methods: {
    onExpDateFocus() {
      this.cardMonth = '';
      this.cardYear = '';
    },
    sendPaymentRequest() {
      const formData = new FormData();
      formData.append('email', this.user.email);
      formData.append('product_id', this.selectedProduct.authorizeCode);
      formData.append('cardNumber', this.cardNumber);
      formData.append('expire', this.expDate);
      formData.append('ccv', this.cardCvv);
      formData.append('name', this.cardName);
      formData.append('country', this.country);
      formData.append('zip', this.zip);
      formData.append('s_type_id', this.selectedProduct.productId); // subscription_type_id
      window.axios.post('/authorize/payment', formData)
          .then((res) => {
            window.location.assign('/buy/processing');
          })
          .catch((err) => {
            console.log(err.message);
            this.hasServerError = true;
          });
    }
  }
};
</script>
