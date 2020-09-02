<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:voad(0)">商品规格</a>
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
      <el-table-column prop="specsname" label="属性名称" width="180"></el-table-column>
      <el-table-column prop="attrs" label="属性值" width="180">
        <!-- 属性值 -->
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <el-tag v-for="(item, index) in scope.row.attrs" :key="index" class="guige">{{item}}</el-tag>
          </span>
        </template>
      </el-table-column>

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
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totals"
      :page-size="pagesize"
      @current-change="currentChange"
    ></el-pagination>
    <!-- 添加弹出框 -->
    <el-dialog
      :title="'规格'+tip"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleCancel"
    >
      <!------------------- 提交的表单 ----------------------------------------------------------->
      <el-form :model="ruleForm" ref="f1" :rules="rules" class="demo-ruleForm" label-width="16%">
        <!-- 用户名称 -->
        <el-form-item prop="specsname" label="属性名称">
          <el-input v-model="ruleForm.specsname"></el-input>
        </el-form-item>
        <el-form-item prop="attrs" label="属性值">
          <div v-for="(item, index) in ruleForm.attrs" :key="index" class="attrsbox">
            <el-input v-model="item.value" class="inp"></el-input>
            <el-button type="primary" v-if="index==0" @click="handleAddAttrs">新增属性值</el-button>
            <el-button type="danger" v-else @click="handleRemoveAttrs(index)">删除</el-button>
          </div>
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
        specsname: "", //商品规格名称
        attrs: [{ value: "" }], //商品规格属性值
        status: "1", //状态1正常2禁用
      },
      tip: "",
      //验证规则
      rules: {
        specsname: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },

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
    this.$http.get("/api/specscount").then((res) => {
      var num = res.list[0].total;
      // console.log(num);
      this.totals = num;
      this.$http
        .get("/api/specslist", {
          params: {
            size: num,
            page: 1,
          },
        })
        .then((res) => {
          this.tableData1 = res.list;
          console.log(res.list, "渲染列表");
        });
    });
  },
  methods: {
    //改变页数
    currentChange(currentPage) {
      this.currentPage = currentPage;
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
      this.tip = "添加";
      this.dialogVisible = true;
    },
    //编辑      r:这一行
    handleEdit(r) {
      // console.log(r);
      this.tip = "编辑";
      this.dialogVisible = true;

      this.$http.get("/api/specsinfo?id=" + r.id).then((res) => {
        if (res.code === 200) {
          //获取数据成功
          let info = res.list[0];
          // console.log(info.attrs);
          // console.log(info.attrs);
          info.id = r.id.toString();
          let attrs = res.list[0].attrs.map((item) => {
            return {
              value: item,
            };
          });
          console.log(attrs);
          info.attrs = attrs;

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
        specsname: "", //商品规格名称
        attrs: [{ value: "" }], //商品规格属性值
        status: "1", //状态1正常2禁用
      };
    },

    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      // 有id就是修改。没有就是添加
      let url = this.ruleForm.id ? "/api/specsedit" : "/api/specsadd";

      this.ruleForm.status = this.status ? "1" : "2";
      //将attrs数组对象形式转成-->数组字符串
      let attr = this.ruleForm.attrs.map((item) => item.value);
      // 将数组转成字符串提交
      this.ruleForm.attrs = attr.join(",");
      console.log(this.ruleForm);
      this.$http.post(url, this.ruleForm).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$http.get("/api/specscount").then((res) => {
            var num = res.list[0].total;
            this.totals = num;
            // console.log(num);
            this.$http
              .get("/api/specslist", {
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
        specsname: "", //商品规格名称
        attrs: [{ value: "" }], //商品规格属性值
        status: "1", //状态1正常2禁用
      };
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/specsdelete", { id: r.id }).then((res) => {
        // console.log(res);

        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          // console.log(res.list);
          res.list.map((item) => {
            item.attrs = item.attrs.split(",");
          });     
          // console.log(res.list);
          this.tableData1 = res.list ? res.list : [];
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    //新增属性值
    handleAddAttrs() {
      console.log(333);
      this.ruleForm.attrs.unshift({ value: "" });
    },
    //删除属性值
    handleRemoveAttrs(index) {
      this.ruleForm.attrs.splice(index, 1);
    },
  },
};
</script>

<style>
.inp {
  width: 50%;
}
.guige {
  margin-right: 5px;
}
.attrsbox {
  margin: 5px 0;
}
</style>