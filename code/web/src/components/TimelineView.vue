<template>
  <div style="max-width: 350px">
    <div class="mb3">
      <div class="dib v-mid">
        <h2 class="f3" v-text="timelineTitle"></h2>
      </div>
      <div class="dib pl2 f2 v-mid" style="margin-top: 4px">
        <i class="ion pointer ion-ios-refresh" @click="loadItems"></i>
      </div>
    </div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="!isLoading" class="overflow-y-scroll" style="max-height: 60vh"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-immediate-check="false"
         infinite-scroll-distance="400">
      <div v-for="item in items" class="bb b--dark-gray">
        <toot :item="item"></toot>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../lib/Api'
  import Toot from './Toot.vue'

  export default {
    components: { Toot },
    props: {
      view: {
        type: Object,
      },
    },
    data() {
      return {
        items: [],
        busy: false,
        isLoading: false,
      }
    },
    mounted() {
      this.loadItems()

      const { EventSource } = window
      const streamingPath = this.view.streamingPath

      if (EventSource && streamingPath) {
        // TODO: fix
        /*api(this.$store.state.apiEndpoint).streamWithToken(
          this.$store.state.accessToken,
          streamingPath,
          msg => console.log(msg)
        )*/
      }
    },
    computed: {
      timelineTitle() {
        return this.view.title
      },
      typeData() {
        return this.view.data
      },
    },
    methods: {
      loadItems() {
        this.isLoading = true

        api(this.$store.state.apiEndpoint).callWithToken(
          this.$store.state.accessToken,
          this.view.path,
        ).then(res => {
          this.items = res.data
          this.isLoading = false
        })
      },
      loadMore() {
        console.log('loading more')

        api(this.$store.state.apiEndpoint).callWithToken(
          this.$store.state.accessToken,
          this.view.path,
          {
            params: { max_id: this.items[this.items.length - 1].id },
          }
        ).then(res => {
          this.items  = [
            ...this.items,
            ...res.data,
          ]
        })
      }
    },
  }
</script>
