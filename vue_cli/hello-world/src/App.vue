<template>
  <div id="app">
    <hello-world></hello-world>
    <!-- <app-header></app-header>
    <todo-list /> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from './components/Header.vue'
// import Footer from './components/Footer.vue'
import TodoList from './components/TodoList.vue';


export default {
  name: 'App',
  components: {
    // AppHeader,
    // TodoList,
    HelloWorld
  },
  data() {
    return {
      msg: 'Hello Vue1111111111!',
      names: ['Rohith', 'Rohith1', 'Rohith2', 'Rohith3'],
      headerTitle: 'Welcome to Vue.js!'
    }
  },
  methods: {
    updateHeaderTitle(newTitle) {
      this.headerTitle = newTitle;
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
