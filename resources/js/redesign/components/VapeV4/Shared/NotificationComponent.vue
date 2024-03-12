<template>
  <transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp" appear>
    <div v-if="notChecked" class="buy-app__notification-wrapper">
      <div :class="ntfClassList" class="buy-app__notification">
        <div class="buy-app__notification__text-wrapper">
          <div class="buy-app__notification__icon">
            <img src="/img/info.svg" alt="buy-app__notification-info-icon">
          </div>
          <div class="buy-app__notification__text">
            <slot name="notification"></slot>
          </div>
        </div>
        <div class="buy-app__notification__action">
          <label class="checkbox-container">
            <slot name="labelText"></slot>
            <input type="checkbox" @change="runCallbackFn">
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['type'],
  data() {
    return {
      defClassList: 'buy-app__notification',
      notChecked: true
    };
  },
  computed: {
    ntfClassList() {
      if (typeof this.type === 'undefined') {
        return this.defClassList + ' info-ntf';
      }
      if (this.type === 'warning') {
        return this.defClassList + ' warning-ntf';
      }
    }
  },
  methods: {
    runCallbackFn() {
      this.notChecked = false;
      this.$emit('confirmed');
    }
  }
};
</script>
