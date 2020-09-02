<template>
  <div class="sidepage">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :default-active="$route.path" 
    >
      <el-menu-item>后台管理系统</el-menu-item>
      <el-menu-item index="/index">
        <router-link to="/index">
          <i class="el-icon-s-home"></i>
          首页
        </router-link>
      </el-menu-item>
      <!-- 一级菜单 -->
      <el-submenu v-for="(item, index) in menus" :key="index" :index="(index+1).toString()">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>

        <el-menu-item-group>
          <el-menu-item  v-for="(info, index) in item.children" :key="index" :index="(index+1).toString()">
            <router-link :to="info.url">{{info.title}}</router-link>
        </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.$store.state.user.menus);
  },
  computed: {
    menus() {
      return this.$store.state.user.menus;
    },
  },
};
</script>

<style>
.el-menu .is-active a.router-link-active,
.is-opened .is-active a.router-link-active {
  color: #ffd04b;
}

.el-container{
    height: 100%;
}
.el-menu{
    height: 100%;
}
.sidepage{
  height: 100%;
}
</style>