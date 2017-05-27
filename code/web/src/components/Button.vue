<template>
  <button
          @click="handleClick($event)"
          :class="['f5 white button-reset bn tc w-100 pv2 pointer', backgroundColor]"><slot></slot></button>
</template>
<script>
  export default {
    props: {
      prevent: {
        type: Boolean,
        required: false,
      },
      backgroundColor: {
        type: String,
        default: 'bg-green',
      },
    },
    methods: {
      handleClick(e) {
        if (this.prevent) e.preventDefault()
        this.$emit('click', e)
      },
    },
  }
</script>
