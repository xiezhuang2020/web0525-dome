<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:voad(0)">角色管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="router-plus">
      <el-button type="primary" @click="handleEditAdd">添加</el-button>
    </div>
    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="rolename" label="名称" width="180"></el-table-column>

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
    <!-- 添加弹出框 -->
    <el-dialog
      :title="'角色'+tip"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleCancel"
    >
      <!-- 提交的表单 -->
      <el-form :model="ruleForm" ref="f1" :rules="rules" class="demo-ruleForm" label-width="16%">
        <!-- 菜单名称 -->
        <el-form-item prop="rolename" label="角色名称">
          <el-input v-model="ruleForm.rolename"></el-input>
        </el-form-item>
        <!-- 菜单权限     :load="loadNode"-->
        <el-form-item label="角色类型">
          <el-tree
            ref="m"
            :data="menu"
            node-key="id"
            :props="{label:'title',children:'children'}"
            show-checkbox
            :default-checked-keys="ruleForm.menus"
          ></el-tree>
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
        rolename: "", //角色名称
        menus: [], //角色权限
        status: "1", //状态1正常2禁用
      },
      tip: "",
      //验证规则
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      //弹窗列表数据
      menu: [],
      // 状态开关
      status: true,
    };
  },
  mounted() {
    // 获取数据
    this.$http.get("/api/rolelist").then((res) => {
      // console.log(res, 222);
      this.tableData1 = res.list;
    });
  },
  methods: {
    //获取数据
    getmenu() {
      this.$http.get("/api/menulist?istree=1").then((res) => {
        console.log(res, 333);
        this.menu = res.list;
      });
    },
    //状态
    changestatus(value) {
      // console.log(value);
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

      this.tip = "编辑";
      this.dialogVisible = true;
      this.$http.get("/api/roleinfo?id=" + r.id).then((res) => {
        console.log(res);
        if (res.code === 200) {
          //获取数据成功
          let info = res.list;
          info.id = r.id.toString();
          info.menus = res.list.menus.split(",");
          info.status = info.status.toString();
          this.ruleForm = info;
          console.log(this.ruleForm);
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    // 取消
    handleCancel() {
      this.dialogVisible = false;
      this.ruleForm = {
        rolename: "", //角色名称
        menus: [], //角色权限
        status: "1", //状态1正常2禁用
      };
    },
    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      // 有id就是修改。没有就是添加
      let url = this.ruleForm.id ? "/api/roleedit" : "/api/roleadd";
      let menus = this.$refs.m.getCheckedKeys().join(",");
      this.ruleForm.menus = menus;
      this.ruleForm.status = this.status ? "1" : "2";
      this.$http.post(url, this.ruleForm).then((res) => {
        if (res.code == 200) {
          this.$http.get("/api/rolelist").then((res) => {
            // console.log(res, 222);
            this.tableData1 = res.list || [];
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
        rolename: "", //角色名称
        menus: [], //角色权限
        status: "1", //状态1正常2禁用
      };
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/roledelete", { id: r.id }).then((res) => {
        console.log(res);
        // this.tableData1 = res.list;
        if(res.code===200){
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.tableData1 = res.list? res.list:[];
        }else{
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