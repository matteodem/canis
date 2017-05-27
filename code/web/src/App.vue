<template>
  <div class="navy-bg white" style="min-height: 100vh">
    <div class="open-sans">
      <div class="mw8 mx-auto" v-if="!$store.state.accessToken">
        <div>
          <div class="tc pt4 mb6">
            <h1 class="f-headline mv1 b">mastoviewr</h1>

            <div class="f1 mv3">Flexible timeline views. For Mastodon.</div>
          </div>

          <form class="tc ph3-ns mw6 mx-auto"
                @submit.prevent="$store.dispatch('adjustMastodonUri', usernameWithDomain)"
                v-if="!$store.state.apiEndpoint">
            <div class="cf">
              <div class="fl w-60">
                <input-component
                        type="text"
                        @change="usernameWithDomain = arguments[0]"
                        placeholder="username@mastodon.instance"></input-component>
              </div>
              <div class="fl w-40 pl2">
                <button-component>Continue</button-component>
              </div>
            </div>
          </form>

          <div v-if="$store.state.apiEndpoint" class="tc">
            <div class="f3">You are signing into <a :href="$store.state.apiEndpoint"
                                                    class="b no-underline light-blue"
                                                    v-text="$store.state.apiEndpoint"></a></div>

            <div class="cf mw6 mx-auto mt4">
              <div class="fl w-50">
                <button-component :prevent="true" @click="openRegisterSite">Sign In</button-component>
              </div>
              <div class="fl w-50">
                <button-component backgroundColor="bg-dark-green"
                                  :prevent="true"
                                  @click="$store.dispatch('resetMastodonUri')">Change Instance</button-component>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$store.state.accessToken" class="tc">
        <div class="mw5 mx-auto pt3">
          <div class="cf">
            <div class="fl w-50">
              <span v-if="$store.state.user.acct" v-text="$store.state.user.acct"></span>
            </div>
            <div class="fl w-50">
              <div class="ml3">
                <button-component @click="$store.dispatch('logOut')">Logout</button-component>
              </div>
            </div>
          </div>
        </div>

        <div class="mt3">
          <timeline-views></timeline-views>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './lib/Api'
  import TimelineViews from './components/TimelineViews.vue'
  import InputComponent from './components/Input.vue'
  import ButtonComponent from './components/Button.vue'

  export default {
    components: {
      TimelineViews,
      InputComponent,
      ButtonComponent,
    },
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
