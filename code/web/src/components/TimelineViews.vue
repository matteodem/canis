<template>
  <div class="tc">
    <div :class="['dib v-top', (viewIndex > 0 ? 'ml3' : '')]"
         :key="view.title"
         v-for="(view, viewIndex) in this.$store.getters.enhancedViews">
      <timeline :view="view"></timeline>
    </div>
    <div class="dim" v-text="feedData"></div>
  </div>
</template>
<script>
  import api from '../lib/Api'
  import Timeline from './TimelineView.vue'

  export default {
    components: { Timeline },
    data() {
      return {
        feedData: '',
      }
    },
  }
</script>
