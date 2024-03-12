<template>
  <div class="g-auth">
    <button @click="authWithGoogle">
      Sign in with Google
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    authWithGoogle() {
      window.location.href = '/login/google-auth';
    }
  }
};
</script>
