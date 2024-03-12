<template>
  <div class="wechat-form__component">
    <div class="wechat-form__wrapper">
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
      <div class="submit-form__button">
        <button class="btn" @click.prevent="buyWithWeChat">Pay with WeChat</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters('vapeV4', ['selectedProduct'])
  },
  methods: {
    buyWithWeChat() {
      const self = this;
      const params = {
        product: self.selectedProduct.product,
        sub: self.selectedProduct.productId,
        vendor: 'wechatpay'
      };
      window.axios.get('/citcon', { params })
          .then((res) => {
            if (res.data.result === 'success') {
              window.location.href = res.data.url;
            } else {
              console.log(res.data);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
    }
  }
};
</script>
