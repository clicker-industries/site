<template>
  <div :class="mainAppClassList">
    <div class="buy-app__title">
      <h1>Let's get started</h1>
    </div>

    <div class="buy-app__variations-section">
      <transition enter-active-class="animate_animated animate__fadeInDown" appear @leave="velFadeOut">
        <div v-if="curStep === 1" class="buy-app__variations-title">
          Choose your payment plan
        </div>
      </transition>

      <div class="buy-app__variations-wrapper">
        <div :class="subscriptionVariationClassList" @click="toggleVariation(subscription)">
          <transition appear @leave="velFadeOut">
            <div v-if="curStep === 1" class="variation__icon">
              <img class="buy-app__recurring-icon" src="/img/recurring.svg" alt="recurring-icon">
            </div>
          </transition>
          <div class="variation__title">Monthly Subscription</div>
          <div class="variation__price v_sale">
            <span v-if="hasPaused" class="on-pause">
              You have this subscription on pause. Resume or cancel your current subscription.
            </span>
            <template v-else-if="!subscription.purchased">
              <span v-if="subscription.price_old" class="v_price_desc">
                <span class="v_price_old_line_through">
                  <span class="v_price_old">{{ subscription.price_old }}$</span>
                </span>
              </span>
              {{ subscription.price }}$ / month
            </template>
            <span v-else>Already purchased</span>
          </div>
        </div>

        <div :class="permanentVariationClassList" @click="toggleVariation(permanent)">
          <transition appear @leave="velFadeOut">
            <div v-if="curStep === 1" class="variation__icon">
              <img class="buy-app__permanent-icon" src="/img/one-time.svg" alt="permanent-icon">
            </div>
          </transition>
          <div class="variation__title">Permanent Purchase</div>
          <div class="variation__price v_sale">
            <template v-if="!permanent.purchased">
              <span v-if="permanent.price_old" class="v_price_desc">
                <span class="v_price_old_line_through">
                  <span class="v_price_old">{{ permanent.price_old }}$</span>
                </span>
              </span>
              {{ permanent.price }}$ one-time
            </template>
            <span v-else>Already purchased</span>
          </div>
        </div>
      </div>
    </div>

    <div class="buy-app__content-section" :class="{ 'content-mb': curStep === 3 }">
      <template v-if="curStep === 1 && isNotificationEnabled === true">
        <notificationComponent type="warning" @confirmed="enableContinueBtn">
          <template v-slot:notification>
            <span class="notification__highlighted-text">Wait...</span>
            It appears that you're visiting our site from an OS X browser. Be aware that Vape is only compatible with Windows.
          </template>
          <template v-slot:labelText>
            I understand, proceed anyways
          </template>
        </notificationComponent>
      </template>

      <transition enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" mode="out-in" appear enter-appear-class="fadeInUp">
        <component v-if="curStep !== 1" :is="stepComponent" />
      </transition>
    </div>

    <div v-if="curStep !== 3" class="buy-app__footer">
      <transition enter-active-class="fadeInUp" leave-active-class="fadeOutDown">
        <button v-if="!isContinueBtnDisabled" class="next-step" :disabled="isContinueBtnDisabled" @click="nextStep">
          <span class="next-step__text">Continue</span>
          <span class="next-step__icon">
            <img src="/img/arrow_right_white.svg" alt="arrow-icon">
          </span>
        </button>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mainAppClassList: {
      type: String,
      required: true
    },
    curStep: {
      type: Number,
      required: true
    },
    subscription: {
      type: Object,
      required: true
    },
    permanent: {
      type: Object,
      required: true
    },
    stepComponent: {
      type: String,
      required: true
    },
    isContinueBtnDisabled: {
      type: Boolean,
      required: true
    },
    isNotificationEnabled: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggleVariation(variation) {

    },
    enableContinueBtn() {

    },
    nextStep() {

    },
    velFadeOut() {

    }
  }
};
</script>
