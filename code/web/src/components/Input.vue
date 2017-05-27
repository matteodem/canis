<template>
  <input :type="type"
         :value="value"
         :placeholder="placeholder"
         @change="$emit('change', $event.target.value)"
         class="input-reset ba b--black-20 pa2 f5 bn db w-100" />
</template>
<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'text',
        required: false,
      },
      value: {
        type: String,
        required: false,
      },
      placeholder: {
        type: String,
        required: false,
      },
    }
  }
</script>
