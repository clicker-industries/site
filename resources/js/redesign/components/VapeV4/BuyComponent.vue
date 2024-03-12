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
        <div class="subscriptionVariationClassList" @click="toggleVariation(subscription)">
          <transition appear @leave="velFadeOut">
            <div v-if="curStep === 1" class="variation__icon">
              <img class="buy-app__recurring-icon" src="/img/recurring.svg" alt="recurring-icon">
            </div>
          </transition>
          <div class="variation__title">
            Monthly Subscription
          </div>
          <div class="variation__price v_sale">
            <span v-if="hasPaused" class="on-pause">
              You have this subscription on pause. Resume or cancel your current subscription.
            </span>
            <span v-else-if="!subscription.purchased">
              <span v-if="subscription.price_old" class="v_price_desc">
                <span class="v_price_old_line_through">
                  <span class="v_price_old">{{ subscription.price_old }}$</span>
                </span>
              </span>
              {{ subscription.price }}$ / month
            </span>
            <span v-else>
              Already purchased
            </span>
          </div>
        </div>

        <div class="permanentVariationClassList" @click="toggleVariation(permanent)">
          <transition appear @leave="velFadeOut">
            <div v-if="curStep === 1" class="variation__icon">
              <img class="buy-app__permanent-icon" src="/img/one-time.svg" alt="recurring-icon">
            </div>
          </transition>
          <div class="variation__title">
            Permanent Purchase
          </div>
          <div class="variation__price v_sale">
            <span v-if="!permanent.purchased">
              <span v-if="permanent.price_old" class="v_price_desc">
                <span class="v_price_old_line_through">
                  <span class="v_price_old">{{ permanent.price_old }}$</span>
                </span>
              </span>
              {{ permanent.price }}$ one-time
            </span>
            <span v-else>
              Already purchased
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="buy-app__content-section" :class="{ 'content-mb': curStep === 3 }">
      <notificationComponent v-if="curStep === 1 && isNotificationEnabled === true"
                             type="warning"
                             @confirmed="enableContinueBtn"
                             v-slot="{ notification, labelText }">
        <span class="notification__highlighted-text">Wait...</span>
        {{ notification }}
        {{ labelText }}
      </notificationComponent>

      <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" appear enter-appear-class="fadeInUp">
        <component v-if="curStep !== 1" :is="stepComponent"></component>
      </transition>
    </div>

    <div class="buy-app__footer">
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
import NotificationComponent from './Shared/NotificationComponent';
import AuthBuyComponent from './Shared/AuthBuyComponent';
import BuyFormComponent from './Shared/BuyFormComponent';
import { mapState } from 'vuex';

export default {
  props: ['permanentDisable'],
  components: {
    NotificationComponent,
    AuthBuyComponent,
    BuyFormComponent
  },
  mounted() {
    if (!this.isNotificationEnabled) {
      this.enableContinueBtn();
    }
    if (this.stateUser.hasPermanent) {
      this.$store.commit('vapeLite/setHasPermanent');
      this.$store.commit('vapeLite/disableNextStep');
    } else if (this.stateUser.hasRenewal && !this.stateUser.hasPermanent) {
      this.$store.commit('vapeLite/setSubscriberStatus');
    }
    console.log(this.permanentDisable);
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      stateUser: state => state.vapeLite.user,
      subscription: state => state.vapeLite.liteSubscription,
      permanent: state => state.vapeLite.litePermanent,
      curStep: state => state.vapeLite.curStep,
      isContinueBtnDisabled: state => state.vapeLite.isContinueDisabled,
      isNotificationEnabled: state => state.isNotificationEnabled,
      hasPaused: state => state.vapeLite.liteSubscription.paused
    }),
    subscriptionVariationClassList() {
      let classList = 'variation';
      if (this.subscription.purchased || this.subscription.paused) {
        classList += ' disabled';
      }
      return this.subscription.selected ? classList + ' selected' : classList;
    },
    permanentVariationClassList() {
      let classList = 'variation';
      if (this.permanent.purchased) {
        classList += ' disabled';
      }
      if (this.permanentDisable) {
        classList += ' hide-permanent';
      }
      return this.permanent.selected ? classList + ' selected' : classList;
    },
    mainAppClassList() {
      const defClassList = 'buy-app buy-app__container';
      return this.curStep > 1 ? `${defClassList} init step-${this.curStep}` : defClassList;
    },
    stepComponent() {
      return this.curStep === 2 ? 'AuthBuyComponent' : this.curStep === 3 ? 'BuyFormComponent' : null;
    }
  },
  methods: {
    velFadeOut(el, done) {
      Velocity(el, {
        opacity: 0,
        height: '-30px',
        marginBottom: '-5px'
      }, {
        duration: 300,
        easing: 'ease',
        complete: done
      });
    },
    toggleVariation(plan) {
      if (plan.selected || this.curStep !== 1 || plan.purchased) return;
      if (plan.name === 'sub') {
        this.$store.commit('vapeLite/selectSubscription');
      } else if (plan.name === 'perm') {
        this.$store.commit('vapeLite/selectPermanent');
      }
      this.$store.commit('vapeLite/setPaymentOptions');
    },
    nextStep() {
      if (this.curStep === 1) {
        this.$store.commit('vapeLite/proceedToNextStep');
      } else if (this.curStep === 2) {
        this.registerUser();
      }
      this.$store.commit('vapeLite/disableNextStep');
    },
    enableContinueBtn() {
      this.$store.commit('vapeLite/enableNextStep');
    },
    registerUser() {
      const url = '/api/v2/user/register';
      window.axios.post(url, this.$store.state.vapeLite.registerObj)
          .then(res => {
            if (res.data.status === 'success') {
              const user = res.data.user;
              this.$store.commit('vapeLite/authenticateUser', user);
              this.$store.commit('vapeLite/proceedToNextStep');
            } else {
              console.log(res.data.message);
            }
          })
          .catch(err => {
            console.log(err.message);
          });
    }
  }
};
</script>
