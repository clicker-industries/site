<template>
  <div class="paypal-form__component">
    <div class="paypal-form__wrapper">
      <img src="/img/pay-icon.svg" alt="pay-icon">
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
          <sup>/  {{ selectedProduct.recurring ? 'month' : 'one-time' }}</sup>
        </div>
        <div class="price-ntf">
          {{ selectedProduct.recurring ? 'Cancel anytime' : 'No monthly payments' }}
        </div>
      </div>
      <div v-if="selectedProduct.productId == 1" class="submit-form__button">
        <button class="btn" @click.prevent="buyWithPayPal">Pay with PayPal</button>
      </div>
      <div v-if="paypalSdkLoaded === false" class="paypal_buttons_loader">
        <img width="55" src="/img/loader.svg">
      </div>
      <div v-if="selectedProduct.productId == 5" v-show="paypalSdkLoaded" id="paypal-button-container"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { loadScript } from '@paypal/paypal-js';

export default {
  data() {
    return {
      paypalSdkLoaded: false,
      paypalSdk: null,
      paypalButtonOptions: null
    };
  },
  computed: {
    ...mapState({
      user: state => state.vapeV4.user
    }),
    ...mapGetters('vapeV4', ['selectedProduct'])
  },
  created() {
    const self = this;
    const clientId = "AeZQE9io0RiA2xEvJ_tX6x224ZESgU4yJzyW7Q9iA1__dAt3m05pZ82bIhQPgk5k_ujz99jMkVEcypry";
    if (clientId) {
      loadScript({
        'client-id': clientId,
        'currency': 'USD',
        'enable-funding': 'venmo,paylater',
        //'buyer-country': 'US',
        'disable-funding': 'card',
        'components': 'buttons,funding-eligibility'
      }).then((paypalSdk) => {
        self.paypalSdk = paypalSdk;
        self.paypalButtonOptions = {
          createOrder(data, actions) {
            const formData = new FormData();
            formData.append('email', self.user.email);
            formData.append('subscr_type', self.selectedProduct.productId);
            formData.append('product', self.selectedProduct.product);
            return window.axios.post('/paypal/create-order', formData).then((res) => {
              if (res.data.invoice_id) {
                const invoice_id = res.data.invoice_id;
                return actions.order.create({
                  purchase_units: [{
                    reference_id: invoice_id,
                    amount: {
                      currency_code: 'USD',
                      value: res.data.price
                    },
                    custom_id: invoice_id,
                    invoice_id: invoice_id
                  }]
                });
              }
            });
          },
          onApprove(data, actions) {
            const paypalId = data.orderID;
            const formData2 = new FormData();
            formData2.append('paypal_id', paypalId);
            window.axios.post('/paypal/approve-order', formData2).then((res) => {
              console.log(res.data);
              if (res.data) {
                if (res.data.redirect) {
                  window.location.assign(res.data.redirect);
                  return;
                }
              }
              window.location.assign('/buy/success');
            }).catch((err) => {
              console.log(err.message);
            });
          },
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
            tagline: false
          }
        };
        self.paypalSdkLoaded = true;
        self.paypalSdk.Buttons(self.paypalButtonOptions).render('#paypal-button-container');
      });
    } else {
      console.error('PayPal Client ID is not set');
    }
  },
  methods: {
    buyWithPayPal() {
      const self = this;
      const formData = new FormData();
      formData.append('email', self.user.email);
      formData.append('subscr_type', self.selectedProduct.productId);
      formData.append('product', self.selectedProduct.product);
      window.axios.post('/authorize/paypal-payment', formData).then((res) => {
        if (res.data.approve_link) {
          window.location.assign(res.data.approve_link);
        }
      });
    }
  },
  activated() {
    if (this.paypalSdk) {
      this.paypalSdk.Buttons(this.paypalButtonOptions).render('#paypal-button-container');
    }
  }
};
</script>
