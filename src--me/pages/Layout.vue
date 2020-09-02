<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <side></side>
      </el-aside>
      <el-container>
        <el-header>
          <span>{{user.username}}</span>
          <!-- <i class="el-icon-setting"></i> -->
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link el-icon-setting"></span>          
            <el-dropdown-menu slot="dropdown">
               <el-dropdown-item>
              <el-button type="text" @click="clearfn">退出</el-button>
               </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>    
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import side from "../components/side";
import {mapState,mapMutations} from "vuex";
export default {
  components: {
    side,
  },
  methods:{
    ...mapMutations(["clearInfo"]),
    clearfn(){
      sessionStorage.clear();
      this.clearInfo();
      this.$router.replace('/login')
    }
  },
  computed:{
    ...mapState(['user'])
  }
};
</script>
<style lang="stylus">
.layout {
  width: 100%;
  height: 100%;

  el-aside {
    // height: 100%;
  }

  .el-header {
    background-color: #b3c0d1;
    line-height: 60px;
    text-align: right;
  }

  .el-main {
    background-color: #e5e5e5;
  }

  .el-dropdown-link {
    width: 70px;
    text-align: center;
  }
}
</style>