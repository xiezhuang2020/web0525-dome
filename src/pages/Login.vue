<template>
  <div class="loginbox">
    <div class="loginfrom">
      <h2>登录</h2>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名，长度：3-5个字符"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations(["setInfo"]),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        //登录成功
        if (valid) {
          this.$http.post("/api/userlogin", this.ruleForm).then((res) => {
            // console.log(res);

            if (res.code == 200) {
              sessionStorage.setItem("user", JSON.stringify(res.list));
              sessionStorage.setItem("token", JSON.stringify(res.list.token));
              this.setInfo();
              this.$router.replace("/");
            } else {
              // this.$message.error(res.msg);

              this.$message({
                showClose: true,
                message: res.msg,
                type: "warning",
              });
            }
          });

          // this.$router.replace('/');
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus">
.loginbox {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(90deg, #563443, #2f3d60);

  .loginfrom {
    width: 300px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -150px 0 0 -150px;

    h2 {
      text-align: center;
      margin: 20px 0;
      color: #fff;
    }

    .el-button--primary {
      width: 100%;
    }
  }
}
</style>