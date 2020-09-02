<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:voad(0)">管理员管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="router-plus">
      <!-- <el-button type="primary" @click="handleEditAdd">添加</el-button> -->
    </div>

    <!--表格    -->
    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
      <el-table-column prop="addtime" label="注册日期" width="180"></el-table-column>
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
      :current-page="currentPage"
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
        <!-- 用户名称 -->
        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="ruleForm.phone"></el-input>
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
import moment from 'moment/moment' 
export default {
  data() {
    return {
      //列表数据
      tableData1: [],
      //是否显示弹窗
      dialogVisible: false,
      //提交的数据
      ruleForm: {
       uid:"",//会员编号，必填项
       nickname:"",//昵称
       phone:"",//手机号
       password:"",//密码
       status:"1",//状态1正常2禁用
      },
      tip: "",
      //验证规则
      rules: {
        membername: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      //弹窗列表数据
      member: [],
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
    this.getTotal();
  },
  methods: {
    getTotal() {
      this.$http.get("/api/membercount").then((res) => {
        if (res.code === 200) {
          this.totals = res.list[0].total;
          console.log(this.totals);
          this.getTatble();
        }
      });
    },
    //获取表格数据
    getTatble() {
      this.$http
        .get("/api/memberlist", {
          params: {
            size: this.pagesize,
            page: this.currentPage,
          },
        })
        .then((res) => {
          if (res.code === 200) {          
            res.list.map(item=>{          
              return item.addtime= this.getTime(Number(item.addtime))
            })
            console.log(res.list);
            this.tableData1 = res.list || [];
          }
        });
    },
    getTime(time){
     return moment(time).format("YYYY-MM-DD HH:mm:ss")
    },
    //改变页数
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.$http
        .get("/api/memberlist", {
          params: {
            size: this.pagesize,
            page: currentPage,
          },
        })
        .then((res) => {
          this.tableData1 = res.list;
        });
      this.$http.get("/api/membercount").then((res) => {
        var num = res.list[0].total;
        this.totals = num;
      });
    },
  
    //选择框
    changemember(value) {
      this.ruleForm.roleid = value;
    },
    //状态
    changestatus(value) {
      // console.log(value);
      this.status = value;
    },
    //编辑      r:这一行
    handleEdit(r) {
      // this.getmember();
      // console.log(r);
      this.tip = "编辑";
      this.dialogVisible = true;

      this.$http.get("/api/memberinfo?uid=" + r.uid).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          //获取数据成功
          console.log(res.list);
          let info = res.list;
          info.id = r.id.toString();
          info.status = info.status.toString();
          this.status = info.status == "1" ? true : false;
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
      //重置还原
      this.ruleForm = {
        roleid: "", //角色编号
        membername: "", //管理员名称
        password: "", //密码
        status: "1", //状态1正常2禁用
      };
    },
    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      // 有id就是修改。没有就是添加
      let url = this.ruleForm.id ? "/api/memberedit" : "/api/memberadd";
      this.ruleForm.status = this.status ? "1" : "2";
      this.$http.post(url, this.ruleForm).then((res) => {
        if (res.code == 200) {
          // 获取数据
          this.$http.get("/api/membercount").then((res) => {
            if (res.code === 200) {
              this.totals = res.list[0].total;
              if (this.totals % this.pagesize === 1 && url === "/api/memberadd") {
                this.currentPage++;
              }

              this.getTatble();
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
      //重置还原
      this.ruleForm = {
        roleid: "", //角色编号
        membername: "", //管理员名称
        password: "", //密码
        status: "1", //状态1正常2禁用
      };
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/memberdelete", { id: r.id }).then((res) => {
        // console.log(res);

        if (res.code === 200) {
          // 获取数据
          this.$http.get("/api/membercount").then((res) => {
            if (res.code === 200) {
              this.totals = res.list[0].total;
              if (this.totals % this.pagesize == 0) {
                this.currentPage--;
              }
              this.getTatble();
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
    },
  },
};
</script>

<style>
.el-pagination {
  text-align: right;
}
</style>