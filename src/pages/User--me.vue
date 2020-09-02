<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:voad(0)">管理员管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="router-plus">
      <el-button type="primary" @click="handleEditAdd">添加</el-button>
    </div>
    <!--表格    -->
    <el-table
      :data="tableData1.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="uid" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="rolename" label="角色" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>

      <el-table-column prop="status" label="状态" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <el-tag type="success" v-if="scope.row.status=='1'" effect="dark">启用</el-tag>
            <el-tag type="info" v-if="scope.row.status=='2'" effect="dark">禁用</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totals"
      :page-size="pagesize"
      @current-change="currentChange"
    ></el-pagination>
    <!-- 添加弹出框 -->
    <el-dialog
      :title="'管理员'+tip"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleCancel"
    >
      <!-- 提交的表单 -->
      <el-form :model="ruleForm" ref="f1" :rules="rules" class="demo-ruleForm" label-width="16%">
        <el-form-item label="角色">
          <el-select v-model="ruleForm.roleid" placeholder="请选择" @change="changeuser">
            <el-option v-for="item in menu" :key="item.id" :label="item.rolename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 用户名称 -->
        <el-form-item prop="username" label="用户名">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="pass" label="密码">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>

        <el-form-item prop="status" label="状态">
          <el-switch
            v-model="status"
            active-color="#409eff"
            inactive-color="#ccc"
            @change="changestatus"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //列表数据
      tableData1: [],
      //是否显示弹窗
      dialogVisible: false,
      //提交的数据
      ruleForm: {
        roleid: "", //角色编号
        username: "", //管理员名称
        password: "", //密码
        status: "1", //状态1正常2禁用
      },
      tip: "",
      //验证规则
      rules: {
        username: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      //弹窗列表数据
      menu: [],
      // 状态开关
      status: true,
      //总条数
      totals: 0,
      pagesize: 3, //每页条数
      currentPage: 1, //当前页
    };
  },
  mounted() {
    // 获取数据
    this.$http.get("/api/usercount").then((res) => {
      // console.log(res);
      var num = res.list[0].total;
      this.totals = num;
      this.$http
        .get("/api/userlist", {
          params: {
            size: num,
            page: 1,
          },
        })
        .then((res) => {
          // console.log(res, "渲染列表");
          this.tableData1 = res.list;
        });
    });
  },
  methods: {
    //改变页数
    currentChange(currentPage) {
      // console.log(currentPage);
      this.currentPage = currentPage;
    },
    //获取数据
    getmenu() {
      this.$http.get("/api/rolelist").then((res) => {
        this.menu = res.list;
        console.log(this.menu, "渲染列表");
      });
    },
    //选择框
    changeuser(value) {
      console.log(value);
      this.ruleForm.roleid = value;
      // console.log(this.ruleForm);
    },
    //状态
    changestatus(value) {
      console.log(value);
      this.status = value;
    },
    //添加
    handleEditAdd() {
      this.getmenu();
      this.tip = "添加";
      this.dialogVisible = true;
    },
    //编辑      r:这一行
    handleEdit(r) {
      this.getmenu();
      // console.log(r);
      this.tip = "编辑";
      this.dialogVisible = true;

      this.$http.get("/api/userinfo?uid=" + r.uid).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          //获取数据成功
          let info = res.list;
          info.id = r.id.toString();
          // info.roleid = info.roleid == 3 ? "系统管理员" : "客服专员";
          info.status = info.status.toString();
          this.ruleForm = info;
          // console.log(this.ruleForm);
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },

    // 取消,关闭
    handleCancel() {
      this.dialogVisible = false;
      this.ruleForm = {
        roleid: "", //角色编号
        username: "", //管理员名称
        password: "", //密码
        status: "1", //状态1正常2禁用
      };
    },
    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      // 有id就是修改。没有就是添加
      let url = this.ruleForm.id ? "/api/useredit" : "/api/useradd";
      this.ruleForm.status = this.status ? "1" : "2";
      console.log(this.ruleForm);
      this.$http.post(url, this.ruleForm).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$http.get("/api/usercount").then((res) => {
            var num = res.list[0].total;
            this.totals = num;
            // console.log(num);
            this.$http
              .get("/api/userlist", {
                params: {
                  size: num,
                  page: 1,
                },
              })
              .then((res) => {
                // console.log(res, "渲染列表");
                this.tableData1 = res.list || [];
              });
          });
          this.$message({
            message: res.msg,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });

      this.ruleForm = {
        roleid: "", //角色编号
        username: "", //管理员名称
        password: "", //密码
        status: "1", //状态1正常2禁用
      };
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/userdelete", { id: r.id }).then((res) => {
        // console.log(res);

        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.$http.get("/api/usercount").then((res) => {
            // console.log(res);
            var num = res.list[0].total;
            this.totals = num;
            this.$http
              .get("/api/userlist", {
                params: {
                  size: num,
                  page: 1,
                },
              })
              .then((res) => {
                // console.log(res, "渲染列表");
                this.tableData1 = res.list;
              });
          });
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style>
</style>