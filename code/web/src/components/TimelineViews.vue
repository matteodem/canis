<template>
  <div>
    logged in

    <div v-text="feedData"></div>
  </div>
</template>
<script>
  import api from '../lib/Api'

  export default {
    data() {
      return {
        feedData: '',
      }
    },
    mounted() {
      // TODO: loop through $store.state.views and display them in frontend as separate TimelineView.vue
      /*api(this.$store.state.apiEndpoint).callWithToken(
        this.$store.state.accessToken,
        '/api/v1/timelines/home'
      ).then(res => this.feedData = JSON.stringify(res.data))*/
    },
  }
</script>
