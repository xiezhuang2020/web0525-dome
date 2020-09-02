<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  padding: 0;margin: 0;
}
html,body, #app {
  width: 100%;
  height: 100%;
}
a{
  text-decoration: none;
  color: #fff;
}
.router-plus{
  margin: 20px 0;
}
</style>
