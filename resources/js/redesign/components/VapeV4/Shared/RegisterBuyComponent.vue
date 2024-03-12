<template>
  <div class="register-form register-form__wrapper">
    <div :class="{ 'register-form__input-wrapper__error': $v.username.$error }">
      <label for="username">Username</label>
      <input type="text" id="username" v-model.trim="$v.username.$model" ref="username" @input="$v.username.$touch()" @blur="$forceUpdate()">
      <span v-if="$v.username.$error" class="error-message">{{ $v.username.$errorMessage }}</span>
    </div>
    <div :class="{ 'register-form__input-wrapper__error': $v.email.$error }" class="email-input">
      <label for="email">Email</label>
      <input type="text" id="email" v-model.trim="$v.email.$model" @input="$v.email.$touch()" @blur="$forceUpdate()">
      <span v-if="$v.email.$error" class="error-message">{{ $v.email.$errorMessage }}</span>
    </div>
    <div :class="{ 'register-form__input-wrapper__error': $v.confirmEmail.$error }" class="email-input">
      <label for="confirm-email">Confirm Email</label>
      <input type="text" id="confirm-email" v-model="$v.confirmEmail.$model" @input="$v.confirmEmail.$touch()" @blur="$forceUpdate()">
      <span v-if="$v.confirmEmail.$error" class="error-message">{{ $v.confirmEmail.$errorMessage }}</span>
    </div>
    <div :class="{ 'register-form__input-wrapper__error': $v.password.$error }">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="$v.password.$model" @input="$v.password.$touch()" @blur="$forceUpdate()">
      <span v-if="$v.password.$error" class="error-message">{{ $v.password.$errorMessage }}</span>
    </div>
    <div :class="{ 'register-form__input-wrapper__error': $v.confirmPassword.$error }">
      <label for="confirm-password">Confirm Password</label>
      <input type="password" id="confirm-password" v-model="$v.confirmPassword.$model" @input="$v.confirmPassword.$touch()" @blur="$forceUpdate()">
      <span v-if="$v.confirmPassword.$error" class="error-message">{{ $v.confirmPassword.$errorMessage }}</span>
    </div>
    <div class="register-form__sign-in-link">
      or <a href="/login">sign in</a> instead
    </div>
    <transition-group name="staggered-fade" tag="ul" class="register-form__error-list" appear css="false">
      <li v-for="(error, index) in formErrorList" :key="index + 1" v-for="prop in error">
        {{ prop }}
      </li>
    </transition-group>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      username: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: ''
    };
  },
  validations: {
    username: {
      required,
      minLength: minLength(5)
    },
    email: {
      required,
      email
    },
    confirmEmail: {
      sameAsEmail: sameAs('email')
    },
    password: {
      required,
      minLength: minLength(8)
    },
    confirmPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  mounted: function mounted() {
    this.$refs.username.focus();
    if (this.$store.state.vapeV4.registerObj.length) {
      this.username = this.$store.state.vapeV4.registerObj.username;
      this.email = this.$store.state.vapeV4.registerObj.email;
      this.$store.commit('vapeV4/clearRegisterObjPassword');
    }
  },
  watch: {
    formErrorList: function formErrorList(val) {
      if (!val.length && this.$v.$dirty) {
        this.$store.commit('vapeV4/bindRegisterInputsToRegisterObject', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        this.$store.commit('vapeV4/enableNextStep');
      }
    }
  },
  computed: {
    formErrorList() {
      const errorList = [];

      if (!this.$v.username.required && this.$v.username.$dirty) {
        errorList.push('Username is required');
      }
      if (!this.$v.username.minLength && this.$v.username.$dirty) {
        errorList.push('Username must have at least 5 letters');
      }
      if (!this.$v.email.required && this.$v.email.$dirty) {
        errorList.push('Email is required');
      }
      if (!this.$v.email.email && this.$v.email.$dirty) {
        errorList.push('Email address not valid');
      }
      if (!this.$v.confirmEmail.sameAsEmail && this.$v.confirmEmail.$dirty) {
        errorList.push('Emails must be identical');
      }
      if (!this.$v.password.required && this.$v.password.$dirty) {
        errorList.push('Password is required');
      }
      if (!this.$v.password.minLength && this.$v.password.$dirty) {
        errorList.push('Password must have at least 8 characters');
      }
      if (!this.$v.confirmPassword.sameAsPassword && this.$v.confirmPassword.$dirty) {
        errorList.push('Passwords must be identical');
      }

      return errorList;
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter(el, done) {
      Velocity(el, { opacity: 1, height: '24px' }, { duration: 300, easing: 'ease', complete: done });
    },
    leave(el, done) {
      Velocity(el, { opacity: 0, height: 0 }, { duration: 300, easing: 'ease', complete: done });
    }
  }
};
</script>
