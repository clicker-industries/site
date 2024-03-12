<template>
  <div class="app__container">
    <transition enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" mode="out-in" appear>
      <div v-if="!pendingPaymentRequest && !successResponse" class="buy-app__header">
        <div class="logo_header">
          <a href="/" class="logo">
            <img src="/img/logo.png" alt="main-logo">
          </a>
        </div>
        <div class="steps_wrapper">
          <transition enter-active-class="fadeInCs" leave-active-class="fadeOutCs">
            <div v-if="step !== 1" class="nav-arrow">
              <a href="#" @click.prevent="goBack">
                <img src="/img/back.svg" alt="back-icon">
              </a>
            </div>
          </transition>
          <div class="step step-first step-finished">
            <a href="#" @click.prevent="changeStep(1)">
              <img v-if="step !== 1" src="/img/check_r_f.svg" alt="check-icon">
            </a>
            <span>Select Plan</span>
          </div>
          <div class="step-separator" :class="{ 'step-finished': step > 1 }"></div>
          <div class="step step-second" :class="{ 'step-finished': step > 1 }">
            <transition mode="out-in" appear>
              <a v-if="step < 2" href="#" @click.prevent="changeStep(2)">
                <img src="/img/check_r.svg" alt="check-icon">
              </a>
              <a v-else href="#" @click.prevent="changeStep(2)">
                <img src="/img/check_r_f.svg" alt="check-icon">
              </a>
            </transition>
            <span>Create account</span>
          </div>
          <div class="step-separator" :class="{ 'step-finished': step > 2 }"></div>
          <div class="step step-third" :class="{ 'step-finished': step > 2 }">
            <transition mode="out-in" appear>
              <a v-if="step < 3" href="#" @click.prevent="changeStep(3)">
                <img src="/img/check_r.svg" alt="check-icon">
              </a>
              <a v-else href="#" @click.prevent="changeStep(3)">
                <img src="/img/check_r_f.svg" alt="check-icon">
              </a>
            </transition>
            <span>Pay</span>
          </div>
        </div>
        <div class="close-btn">
          <a href="#" @click.prevent="cancelBuy">Cancel</a>
        </div>
      </div>
    </transition>
    <transition enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" mode="out-in" appear>
      <keep-alive>
        <component :is="appComponent"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import BuyComponent from './BuyComponent';
import PendingPaymentComponent from '../PendingPaymentComponent';
import SuccessScreenComponent from '../SuccessScreenComponent';
import { mapState } from 'vuex';

export default {
  props: ['user', 'recurringPrice', 'permanentPrice', 'recurringPriceOld', 'permanentPriceOld', 'showSuccess', 'notification', 'hasRenewal', 'hasPaused', 'hasPermanent'],
  components: {
    BuyComponent,
    PendingPaymentComponent,
    SuccessScreenComponent
  },
  created() {
    if (this.showSuccess) {
      this.$store.commit('vapeV4/successResponse');
    }
  },
  mounted() {
    if (this.recurringPrice) {
      this.$store.commit('vapeV4/updateSubsPrice', this.recurringPrice.toFixed(2));
    }
    if (this.permanentPrice) {
      this.$store.commit('vapeV4/updatePermanentPrice', this.permanentPrice.toFixed(2));
    }
    if (this.recurringPriceOld) {
      this.$store.commit('vapeV4/updateSubsPriceOld', this.recurringPriceOld.toFixed(2));
    }
    if (this.permanentPriceOld) {
      this.$store.commit('vapeV4/updatePermanentPriceOld', this.permanentPriceOld.toFixed(2));
    }
    if (this.user && this.user.id) {
      this.$store.commit('vapeV4/authenticateUser', {
        ...this.user,
        hasPermanent: this.hasPermanent,
        hasRenewal: this.hasRenewal
      });
    }
    if (this.notification) {
      this.$store.commit('setNotificationStatus', this.notification);
    }
    if (this.hasPaused) {
      this.$store.commit('vapeV4/setHasPaused', {});
    }
  },
  computed: {
    permanentPurchased() {
      return this.hasPermanent === true;
    },
    renewalPurchased() {
      return this.hasRenewal === true;
    },
    ...mapState({
      pendingPaymentRequest: state => state.vapeV4.pendingPaymentRequest,
      successResponse: state => state.vapeV4.successResponse,
      step: state => state.vapeV4.curStep,
      stateUser: state => state.vapeV4.user,
      disabledTopNav: state => state.vapeV4.disabledTopNav
    }),
    appComponent() {
      if (this.pendingPaymentRequest) {
        this.showHeaderFooter();
        return 'PendingPaymentComponent';
      } else if (this.successResponse) {
        this.showHeaderFooter();
        return 'SuccessScreenComponent';
      } else {
        return 'BuyComponent';
      }
    }
  },
  methods: {
    showHeaderFooter() {
      $('header').fadeIn(300);
      $('.buy__footer').fadeIn(300);
    },
    cancelBuy() {
      window.location.href = '/buy';
    },
    goBack() {
      this.$store.commit('vapeV4/goBack');
    },
    changeStep(toStep) {
      if (this.disabledTopNav === true) {
        return;
      }
      if (toStep > 1 && this.stateUser.id === '') {
        this.$store.commit('vapeV4/setStep', 2);
      } else if (toStep === 2 && this.stateUser.id !== '') {
        if (this.step === 3) {
          this.$store.commit('vapeV4/setStep', 1);
        } else {
          this.$store.commit('vapeV4/setStep', 3);
        }
      } else {
        this.$store.commit('vapeV4/setStep', toStep);
      }
    }
  }
};
</script>
