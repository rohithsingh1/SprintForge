<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="name in localNames" :key="name">
        {{ name }}
      </li>
    </ul>
    <button @click="deleteItem">Delete</button>
    <card-component>
      <!-- <p>This is injected by the parent!</p> -->
    </card-component>
    <page-layout>
      <template v-slot:header>
        <h1>My Page Title</h1>
      </template>
      <p>This is the main body content.</p>
      <template v-slot:footer>
        <p>© 2024 My App</p>
      </template>
    </page-layout>
  </div>
</template>

<script>
import CardComponent from './Card.vue';
import PageLayout from './PageLayout.vue';
export default {
  name: 'HelloWorld',
  components: {
    CardComponent,
    PageLayout
  },
  data() {
    return {
      localNames: [...this.names]
    }
  },
  methods: {
    deleteItem() {
      if (this.localNames.length > 0) {
        this.localNames.pop();
      } else {
        alert('No more names to delete!');
      }
    }
  },
  props: {
    msg: {
      type: String,
      default: ''
    },
    names: {
      type: Array,
      default: () => []
    }
  },
  // lifecycle hooks
  // beforeCreate() {
  //   alert('HelloWorld component beforeCreate hook called!');
  // },
  // created() {
  //   alert('HelloWorld component created!');
  // },
  // beforeMount() {
  //   alert('HelloWorld component beforeMount hook called!');
  // },
  // mounted() {
  //   alert('HelloWorld component mounted!');
  // },
  // beforeUpdate() {
  //   alert('HelloWorld component beforeUpdate hook called!');
  // },
  // updated() {
  //   alert('HelloWorld component updated!');
  // },
  // beforeDestroy() {
  //   alert('HelloWorld component beforeDestroy hook called!');
  // },
  // destroyed() {
  //   alert('HelloWorld component destroyed!');
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
