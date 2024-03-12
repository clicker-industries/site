<template>
  <div class="app__container">
    <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
        mode="out-in"
        appear
    >
      <div v-if="!pendingPaymentRequest && !successResponse" class="buy-app__header">
        <div class="logo_header">
          <a class="logo" href="/">
            <img src="/img/logo.png" alt="main-logo">
          </a>
        </div>
        <div class="steps_wrapper">
          <transition
              enter-active-class="fadeInCs"
              leave-active-class="fadeOutCs"
          >
            <div v-if="step !== 1" class="nav-arrow">
              <a href="#" @click.prevent="goBack">
                <img src="/img/back.svg" alt="back-icon">
              </a>
            </div>
          </transition>
          <div class="step step-first step-finished">
            <a href="#" @click.prevent="changeStep(1)">
              <img src="/img/check_r_f.svg" alt="check-icon">
            </a>
            <span>Select Plan</span>
          </div>
          <div class="step-separator" :class="{ 'step-finished': step > 1 }"></div>
          <div class="step step-second" :class="{ 'step-finished': step > 1 }">
            <transition
                enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut"
                mode="out-in"
            >
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
            <transition
                enter-active-class="animate__animated animate__fadeIn"
                leave-active-class="animate__animated animate__fadeOut"
                mode="out-in"
            >
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
    <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
        mode="out-in"
        appear
    >
      <keep-alive>
        <component :is="appComponent" :permanent-disable="litePermanentDisable" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    appComponent: {
      type: String,
      required: true
    },
    step: {
      type: Number,
      required: true
    },
    pendingPaymentRequest: {
      type: Boolean,
      required: true
    },
    successResponse: {
      type: Boolean,
      required: true
    },
    litePermanentDisable: {
      type: Boolean,
      required: true
    }
  }
};
</script>
