<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:voad(0)">商品分类</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="router-plus">
      <el-button type="primary" @click="handleEditAdd">添加</el-button>
    </div>
    <!-- 表格   -->
    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="catename" label="分类名称" width="180"></el-table-column>

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
      :title="'分类'+tip"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleCancel"
    >
      <!-- 提交的表单 -->
      <el-form :model="ruleForm" ref="f1" :rules="rules" class="demo-ruleForm" label-width="16%">
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="ruleForm.pid" placeholder="请选择" @change="changeuser">
            <el-option v-for="item in menu" :key="item.id" :label="item.catename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 分类名称 -->
        <el-form-item prop="catename" label="分类名称">
          <el-input v-model="ruleForm.catename"></el-input>
        </el-form-item>
        <el-form-item prop="pass" label="分类图片">
          <!-- on-preview	点击文件列表中已上传的文件时的钩子	function(file)	—	—on-remove	文件列表移除文件时的钩子	function(file, fileList) -->
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
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
        pid: "", //上级分类编号
        catename: "", //商品分类名称
        img: "", //图片(文件，一般用于二级分类)
        status: "1", //状态1正常2禁用
      },
      tip: "",
      //验证规则
      rules: {
        catename: [
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

    this.$http.get("/api/catelist?istree=1").then((res) => {
      console.log(res, "渲染列表");
      this.tableData1 = res.list;
    });
  },
  // updated() {
  //   this.$http.get("/api/usercount").then((res) => {
  //     // console.log(res.list[0].total, "总条数");
  //     this.totals = res.list[0].total;
  //   });
  // },
  methods: {
    //获取数据
    getmenu() {
      this.$http.get("/api/catelist?pid=0").then((res) => {
        this.menu = res.list;
        console.log(this.menu, 333);
      });
    },
    //选择框
    changeuser(value) {
      console.log(value);
      this.ruleForm.id = value;
      // console.log(this.ruleForm);
    },
    //状态
    changestatus(value) {
      this.status = value;
      // console.log(this.status);
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

      this.$http.get("/api/cateinfo?id=" + r.id).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          //获取数据成功
          let info = res.list;
          info.id = r.id;

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

    // 取消,关闭
    handleCancel() {
      this.dialogVisible = false;
      this.ruleForm = {
        pid: "", //上级分类编号
        catename: "", //商品分类名称
        img: "", //图片(文件，一般用于二级分类)
        status: "1", //状态1正常2禁用
      };
    },
    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      // 有id就是修改。没有就是添加
      let url = this.ruleForm.id ? "/api/cateedit" : "/api/cateadd";
      this.ruleForm.status = this.status ? "1" : "2";
      // console.log(this.ruleForm);
      this.$http.post(url, this.ruleForm).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          this.$http.get("/api/catelist?istree=1").then((res) => {
            // console.log(res, "渲染列表");
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
        pid: "", //上级分类编号
        catename: "", //商品分类名称
        img: "", //图片(文件，一般用于二级分类)
        status: "1", //状态1正常2禁用
      };
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/userdelete", { id: r.id }).then((res) => {
        // console.log(res);
        this.tableData1 = res.list;
      });
    },
    //图片上传  点击文件列表中已上传的文件时的钩子	function(file)
    handlePictureCardPreview() {},
    //文件列表移除文件时的钩子
    handleRemove() {},
  },
};
</script>

<style>
</style>