<template>
  <div class="navy-bg white" style="min-height: 100vh">
    <div class="open-sans">
      <div class="mw8 ph2 ph0-ns mx-auto" v-if="!$store.state.accessToken">
        <div>
          <div class="tc pt4 mb6-ns mb5">
            <h1 class="f-headline-ns f1 mv1 b">mastoviewr</h1>

            <div class="f1-ns f3 mv3">Flexible timeline views. For Mastodon.</div>
          </div>

          <form class="tc ph3-ns mw6 mx-auto"
                @submit.prevent="$store.dispatch('adjustMastodonUri', usernameWithDomain)"
                v-if="!$store.state.apiEndpoint">
            <div class="cf">
              <div class="fl w-60">
                <input-component
                        type="text"
                        @change="usernameWithDomain = arguments[0]"
                        placeholder="username@mstdn.instance"></input-component>
              </div>
              <div class="fl w-40 pl2">
                <button-component>Continue</button-component>
              </div>
            </div>
          </form>

          <div v-if="$store.state.apiEndpoint" class="tc">
            <div class="f3-ns f5">You will sign in over <a :href="$store.state.apiEndpoint"
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
        <div class="mw6 mx-auto pt3">
          <div class="cf">
            <div class="fl w-50 pt2">
              <span v-if="$store.state.user.acct" v-text="$store.state.user.acct"></span>
            </div>
            <div class="fl w-20">
              <div class="ml3">
                <button-component @click="$store.dispatch('logOut')">Logout</button-component>
              </div>
            </div>
            <div class="fl w-30">
              <div class="ml3">
                <button-component :backgroundColor="manageViewsMode ? 'bg-red' : undefined"
                                  @click="manageViewsMode = !manageViewsMode">
                  <div v-if="!manageViewsMode">Manage views</div>
                  <div v-if="manageViewsMode">Close mode</div>
                </button-component>
              </div>
            </div>
          </div>
        </div>

        <div class="mt4 mw6 mx-auto" v-if="manageViewsMode">
          <h2 class="h2">Your configured views</h2>

          <div class="mb2">
            <button-component @click="$store.dispatch('addView', { type: 'home' })">Add Home View</button-component>
          </div>
          <div class="mb2">
            <button-component @click="$store.dispatch('addView', { type: 'public' })">Add Public View</button-component>
          </div>
          <div class="mb2">
            <form @submit.prevent="addHashtagView" class="cf">
              <div class="fl w-50">
                <input-component :value="hashtag" placeholder="#some-hashtag" @change="hashtag = arguments[0]" />
              </div>
              <div class="fl w-50 pl3">
                <button-component>Add Hashtag View</button-component>
              </div>
            </form>
          </div>

          <div v-for="(view, viewIndex) in $store.getters.enhancedViews">
            <div v-text="view.title" class="mt2 dib"></div>
            <div class="dib v-mid">
              <i class="ion ion-ios-close f2 ml2 pointer" @click="$store.dispatch('removeView', viewIndex)"></i>
            </div>
          </div>
        </div>

        <div class="mt4">
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
        hashtag: '',
        manageViewsMode: false,
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
      },
      addHashtagView() {
        let { hashtag } = this

        hashtag = hashtag.replace(/#/g, '').trim()

        if (!hashtag) return alert('Please add a hashtag')


        this.$store.dispatch('addView', {
          type: 'hashtag',
          data: { hashtag } })

        this.hashtag = ''
      },
    },
  }
</script>
