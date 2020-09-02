<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:voad(0)">菜单管理</a>
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
      <el-table-column prop="title" label="名称" width="180"></el-table-column>
      <el-table-column prop="icon" label="图标" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px" :class="scope.row.icon"></span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <el-tag :class="scope.row.type" v-if="scope.row.type=='1'">目录</el-tag>
            <el-tag :class="scope.row.type" v-if="scope.row.type=='2'" type="success">菜单</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单URL" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加弹出框 -->
    <el-dialog
      :title="'菜单'+tip"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleCancel"
    >
      <!-- 提交的表单 -->
      <el-form :model="ruleForm" ref="f1" :rules="rules" class="demo-ruleForm" label-width="16%">
        <!-- 菜单类型 -->
        <el-form-item prop="pid" label="菜单类型">
          <el-select v-model="ruleForm.pid" @change="changemenu">
            <el-option label="顶级菜单" :value="'0'" :key="0"></el-option>
            <el-option
              v-for="item in menus"
              :key="item.id"
              :label="item.title"
              :value="item.id.toString()"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 菜单名称 -->
        <el-form-item prop="title" label="菜单名称">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标" v-show="ruleForm.type==='1'">
          <el-input v-model="ruleForm.icon"></el-input>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item label="类型">
          <el-radio v-model="ruleForm.type" label="1" :disabled="ruleForm.type=='2'">目录</el-radio>
          <el-radio v-model="ruleForm.type" label="2" :disabled="ruleForm.type=='1'">菜单</el-radio>
        </el-form-item>
        <!-- 菜单地址 -->
        <el-form-item prop="url" label="菜单地址" v-show="ruleForm.type==='2'">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch
            v-model="status"
            active-color="#13ce66"
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
        pid: "0",
        title: "",
        icon: "", //图标
        type: "1", //类型1目录2菜单
        url: "", //菜单地址
        status: "1", //状态1正常2禁用
      },
      tip: "",
      //验证规则
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        pid: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
      },
      //弹窗列表数据
      menus: [],
      // 状态开关
      status: true,
    };
  },
  mounted() {
    this.$http.get("/api/menulist?istree=1").then((res) => {
      // console.log(res, 222);
      this.tableData1 = res.list;
    });
  },
  methods: {
    //获取数据
    getmenu() {
      this.$http.get("/api/menulist?pid=0").then((res) => {
        this.menus = res.list;
        console.log(this.menus, 333);
      });
    },
    //选择框
    changemenu(value) {
      this.ruleForm.type = value == 0 ? "1" : "2";
    },
    //状态
    changestatus(value) {
      // console.log(value);
      this.status = value ? true : false;
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
      this.$http.get("/api/menuinfo?id=" + r.id).then((res) => {
        console.log(res);
        if (res.code === 200) {
          //获取数据成功
          let info = res.list;
          info.id = r.id.toString();
          info.pid = info.pid.toString();
          info.type = info.type.toString();
          info.status = info.status.toString();
          this.ruleForm = info;
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
        pid: "0",
        title: "",
        icon: "", //图标
        type: "1", //类型1目录2菜单
        url: "", //菜单地址
        status: "1", //状态1正常2禁用
      };
    },
    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      // 有id就是修改。没有就是添加
      let url = this.ruleForm.id ? "/api/menuedit" : "/api/menuadd";
      this.$http.post(url, this.ruleForm).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          this.$http.get("/api/menulist?istree=1").then((res) => {
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
        pid: "0",
        title: "",
        icon: "", //图标
        type: "1", //类型1目录2菜单
        url: "", //菜单地址
        status: "1", //状态1正常2禁用
      };
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/menudelete", { id: r.id }).then((res) => {
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