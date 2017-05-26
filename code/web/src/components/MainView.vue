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
      api(this.mastodonApiEndpoint).callAuthorized(
        this.$store.state.accessToken,
        {
          endpoint: '/api/v1/timelines/home',
          method: 'get',
          data: { limit: 25 },
        },
      ).then(res => console.log(res.data))
    },
  }
</script>
