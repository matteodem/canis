<template>
  <div class="mastodon-gray-bg pv3">
    <div class="cf">
      <div class="fl w-20">
        <img class="pointer"
             @click="openAccount"
             :src="item.account.avatar_static"
             style="max-width: 50px; border-radius: 50px" />
      </div>
      <div class="fl w-80 pr3 tl f6">
        <div v-if="boostedBy" class="mb2 gray">
          boosted by <span class="i pointer" @click="openBoosterAccount" v-text="boostedBy"></span>
        </div>
        <div>
          <div class="dib b mb1 pointer" @click="openAccount" v-text="item.account.username"></div>
          <div class="dib ml1 f7 mb1" v-text="formattedCreatedAt"></div>
        </div>

        <div class="pointer" @click.prevent="openToot">
          <div v-if="mediaImageUrl">
            <img class="mw-90 mx-auto" :src="mediaImageUrl" />
          </div>

          <div class="custom-toot-content" v-html="item.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'

  export default {
    props: {
      item: {
        type: Object,
      }
    },
    computed: {
      mediaAttachment() {
        if (this.item.media_attachments && this.item.media_attachments.length) {
          const [media] = this.item.media_attachments

          return media
        }
      },
      mediaImageUrl() {
        const media = this.mediaAttachment

        if (media && media.type === 'image') {
          return media.preview_url
        }
      },
      boostedBy() {
        return this.item.reblog && this.item.reblog.account.username
      },
      formattedCreatedAt() {
        return moment(this.item.created_at).fromNow()
      },
    },
    methods: {
      openToot() {
        window.open(`${this.$store.state.apiEndpoint}/web/statuses/${this.item.id}`)
      },
      openAccount() {
        window.open(`${this.$store.state.apiEndpoint}/web/accounts/${this.item.account.id}`)
      },
      openBoosterAccount() {
        window.open(`${this.$store.state.apiEndpoint}/web/accounts/${this.item.reblog.account.id}`)
      },
    },
  }
</script>
