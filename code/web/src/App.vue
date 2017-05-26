<template>
  <div class="navy-bg white" style="min-height: 100vh">
    <div class="open-sans mw8 mx-auto">
      <div v-if="!$store.state.isLoggedIn">
        <div class="tc pt4">
          <h1 class="f1 mv0 b">Mastoviewr</h1>

          <ul>
            <li>Open source</li>
            <li>Custom Feeds</li>
          </ul>
        </div>

        <form action="" @submit.prevent="doLogin">
          <input type="text" placeholder="Email" @change="email = $event.target.value" />
          <input type="password" placeholder="password"  @change="password = $event.target.value" />
          <button>Login</button>
        </form>
      </div>

      <div v-if="$store.state.isLoggedIn">
        You're logged in!
        <button @click="$store.dispatch('logOut')">Logout again!</button>

        <main-view></main-view>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './lib/Api'
  import MainView from './components/MainView.vue'

  export default {
    components: { MainView },
    data() {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      doLogin() {
        const { email, password } = this
        api(this.mastodonApiEndpoint).getToken(email, password).then(res => {
          const { data } =  res
          const accessToken = data.access_token

          console.log(data)
          if (!accessToken) {
            return alert('Invalid credentials')
          }

          this.$store.dispatch('finishLogin', accessToken)
        })
      },
    },
  }
</script>
