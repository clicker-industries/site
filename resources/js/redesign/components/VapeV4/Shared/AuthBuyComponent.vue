<template>
  <div class="buy-auth__wrapper">
    <div class="buy-auth__title">
      Create your account:
    </div>
    <register-buy-component></register-buy-component>
  </div>
</template>

<script>
import GAuthComponent from './GAuthComponent';
import Separator from './Separator';
import RegisterBuyComponent from './RegisterBuyComponent';

export default {
  components: {
    GAuthComponent,
    Separator,
    RegisterBuyComponent
  },
  data() {
    return {};
  }
};
</script>
