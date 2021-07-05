<template>
  <span class="example">
    <el-button type="primary">sdsds</el-button>
    <about-view></about-view>
  </span>
</template>
<script>
export default {
  name: 'Container',
  components: {
    'about-view': window.loadComponent('about.vue')
  },
  data() {
    return {
      value: "world!",
    };
  },
};
</script>

<style scoped>
.example {
  color: red;
}
</style>