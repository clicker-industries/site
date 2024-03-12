<template>
  <div class="amazon-form__component">
    <div class="amazon-form__wrapper">
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
          <sup>/ {{ selectedProduct.recurring ? 'month' : 'one-time' }}</sup>
        </div>
        <div class="price-ntf">
          {{ selectedProduct.recurring ? 'Cancel anytime' : 'No monthly payments' }}
        </div>
      </div>
      <div class="submit-form__button">
        <button class="btn" @click.prevent="buyWithAmazon">
          Pay with Amazon
        </button>
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
  props: {
    selectedProduct: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('vapeV4', ['selectedProduct'])
  },
  methods: {
    buyWithAmazon() {
      const prodId = this.selectedProduct.product;
      const sub = this.selectedProduct.productId;
      window.location.href = `/amazon-pay?product=${prodId}&sub=${sub}`;
    }
  }
};
</script>
