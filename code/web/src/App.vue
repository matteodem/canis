<template>
  <div class="navy-bg white" style="min-height: 100vh">
    <div class="open-sans mw8 mx-auto">
      <div v-if="!$store.state.accessToken">
        <div>
          <div class="tc pt4">
            <h1 class="f1 mv0 b">Mastoviewr</h1>

            <ul>
              <li>Open source</li>
              <li>Custom views</li>
            </ul>
          </div>

          <form @submit.prevent="$store.dispatch('adjustMastodonUri', usernameWithDomain)" v-if="!$store.state.apiEndpoint">
            Your mastodon username
            <input type="text" @change="usernameWithDomain = $event.target.value" placeholder="username@mastodon.instance" />
          </form>

          <div v-if="$store.state.apiEndpoint">
            Mastodon Instance: <span v-text="$store.state.apiEndpoint"></span>
            <button @click="$store.dispatch('resetMastodonUri')">Change instance</button>

            <div>
              <button @click="openRegisterSite">Sign in</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$store.state.accessToken">
        You're logged in!
        <button @click="$store.dispatch('logOut')">Logout again!</button>

        <timeline-views></timeline-views>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './lib/Api'
  import TimelineViews from './components/TimelineViews.vue'

  export default {
    components: { TimelineViews },
    data() {
      return {
        usernameWithDomain: '',
      }
    },
    methods: {
      openRegisterSite() {
        const { apiEndpoint, clientId, clientSecret } = this.$store.state
        const params = `response_type=code&client_id=${clientId}&client_secret=${
          clientSecret
        }&redirect_uri=${window.location.href}`

        window.open(
          `${apiEndpoint}/oauth/authorize?${params}`,
          '_self'
        )
      }
    },
  }
</script>
