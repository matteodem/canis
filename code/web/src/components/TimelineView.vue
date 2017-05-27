<template>
  <div style="max-width: 350px">
    <div class="mb3">
      <div class="dib v-mid">
        <h2 class="f3" v-text="timelineTitle"></h2>
      </div>
    </div>
    <div v-if="isLoading">Loading...</div>
    <div class="overflow-y-scroll" style="max-height: 60vh"
         ref="scrollView"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-immediate-check="false"
         infinite-scroll-distance="900">
      <div v-show="!isLoading" v-for="item in items" class="bb b--dark-gray">
        <toot :item="item"></toot>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../lib/Api'
  import Toot from './Toot.vue'

  const doNotLoadNewItems = scope => (!scope.items.length
  || !scope.$refs.scrollView
  || scope.$refs.scrollView.scrollTop > 30)

  const constantlyLoadNewerItems = (scope, timeoutTime) => {
    if (doNotLoadNewItems(scope)) {
      setTimeout(() => constantlyLoadNewerItems(scope, timeoutTime), timeoutTime)
    } else {
      setTimeout(() => {
        api(scope.$store.state.apiEndpoint)
          .callWithToken(
            scope.$store.state.accessToken,
            scope.view.path,
            { params: { since_id: scope.items[0].id , limit: 40 } }
          ).then(res => {
          if (doNotLoadNewItems(scope)) return null

          scope.items  = [
            ...res.data,
            ...scope.items,
          ]
          constantlyLoadNewerItems(scope, timeoutTime)
        })
      }, timeoutTime)
    }
  }

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

      setTimeout(
        () => constantlyLoadNewerItems(this, this.view.reloadSeconds),
        Math.random() * 4000,
      )
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
        this.busy = true

        if (this.isLoading) return null

        api(this.$store.state.apiEndpoint).callWithToken(
          this.$store.state.accessToken,
          this.view.path,
          { params: { max_id: this.items[this.items.length - 1].id } }
        ).then(res => {
          this.items  = [
            ...this.items,
            ...res.data,
          ]
          this.busy = false
        })
      }
    },
  }
</script>
