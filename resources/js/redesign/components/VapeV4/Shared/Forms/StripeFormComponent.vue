<template>
  <div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      user: state => state.vapeV4.user
    }),
    ...mapGetters('vapeV4', ['selectedProduct'])
  },
  methods: {
    buyWithStripe() {
      const self = this;
      const formData = new FormData();
      formData.append('email', self.user.email);
      formData.append('subscr_type', self.selectedProduct.productId);
      formData.append('product', self.selectedProduct.product);
      window.axios.post('/stripe/create-order', formData).then((res) => {
        if (res.data.approve_link) {
          window.location.assign(res.data.approve_link);
        }
      });
    }
  }
};
</script>
