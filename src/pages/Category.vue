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
          <el-select v-model="ruleForm.pid" placeholder="请选择">
            <el-option label="顶级菜单" :value="'0'" :key="0"></el-option>
            <el-option v-for="item in cate" :key="item.id" :label="item.catename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 分类名称 -->
        <el-form-item prop="catename" label="分类名称">
          <el-input v-model="ruleForm.catename"></el-input>
        </el-form-item>
        <el-form-item label="分类图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleChange"
            :file-list="fileList"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <!-- 多重遮罩解决方法  append-to-body -->
          <el-dialog :visible.sync="disabled" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
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
import axios from "axios";
export default {
  data() {
    return {
      //列表数据
      tableData1: [],
      //是否显示弹窗
      dialogVisible: false,

      dialogImageUrl: "",

      disabled: false,
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
      cate: [],
      // 状态开关
      status: true,
      fileList: [],
    };
  },
  mounted() {
    // 获取数据

    this.$http.get("/api/catelist?istree=1").then((res) => {
      console.log(res, "渲染列表");
      this.tableData1 = res.list;
    });
  },
  methods: {
    handleChange(file) {
      this.ruleForm.img = file.raw;
    },
    // 删除文件
    handleRemove(file) {
      document.querySelector(".el-upload-list--picture-card").innerHTML = "";
      console.log(file);
      this.fileList = [];
    },
    // 缩略图预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.disabled = true;
    },

    //获取数据
    getcate() {
      this.$http.get("/api/catelist?pid=0").then((res) => {
        this.cate = res.list;
        console.log(this.cate, 333);
      });
    },
    //状态
    changestatus(value) {
      this.status = value;
      // console.log(this.status);
    },
    //添加
    handleEditAdd() {
      this.getcate();
      this.tip = "添加";
      this.dialogVisible = true;
    },
    //编辑      r:这一行
    handleEdit(r) {
      this.getcate();
      // console.log(r);
      this.tip = "编辑";
      this.dialogVisible = true;

      this.$http.get("/api/cateinfo?id=" + r.id).then((res) => {
        console.log(res);
        if (res.code === 200) {
          //获取数据成功
          let info = res.list;
          info.id = r.id;
          info.pid = r.pid === 0 ? "顶级菜单" : r.pid;
          info.status = info.status.toString();
          // info.img = "http://localhost:3000"+info.img
          this.ruleForm = info;
          this.fileList = [
            { name: info.catename, url: "http://localhost:3000" + info.img },
          ];
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
      this.ruleForm.pid = this.ruleForm.pid=="顶级菜单"?0:this.ruleForm.pid
      // console.log(this.ruleForm);
        console.log(this.ruleForm);
       
      // 新建表单数据对象
      let formData = new FormData();
      // 把ruleForm里面的数据添加到fromData
      for (var key in this.ruleForm) {
        formData.append(key, this.ruleForm[key]);
      }
      axios({
        method: "post",
        url,
        data: formData,
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$http.get("/api/catelist?istree=1").then((res) => {
            if (res.code == 200) {
              this.tableData1 = res.list;
            }
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
      this.fileList = [];
      document.querySelector(".el-upload-list--picture-card").innerHTML = "";
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/catedelete", { id: r.id }).then((res) => {
        console.log(res);
        this.tableData1 = res.list;
      });
    },
  },
};
</script>

<style>
</style>