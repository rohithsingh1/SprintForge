<template>
  <header>
    <h1>{{ title }}</h1>
    <p>This is the header component.</p>
    <button @click="changeTitle">Change Title</button>

  </header>
</template>

<script>
export default {
    name: 'AppHeader',
    props: {
        title: {
            type: String,
            default: 'Default Header Title'
        }
    },
    methods: {
        changeTitle() {
            this.$emit('changeTitle', 'New Header Title');
        }
    }
}

</script>

<style scoped>

</style>