<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="javascript:voad(0)">商品管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="router-plus">
      <el-button type="primary" @click="handleEditAdd">添加</el-button>
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
      <el-table-column prop="firstcatename" label="一级分类" width="130"></el-table-column>
      <el-table-column prop="secondcatename" label="二级分类" width="130"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="130"></el-table-column>
      <el-table-column prop="price" label="销售价" width="130"></el-table-column>
      <el-table-column prop="market_price" label="市场价" width="130"></el-table-column>

      <el-table-column prop="status" label="状态" width="130">
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
    <!-- ------------添加弹出框 ----------------------------->
    <el-dialog
      :title="'商品'+tip"
      :visible.sync="dialogVisible"
      width="62%"
      :before-close="handleCancel"
      @opened="open"
    >
      <!-- 提交的表单 -->
      <el-form :model="ruleForm" ref="f1" :rules="rules" class="demo-ruleForm" label-width="100px">
        <el-form-item label="一级分类">
          <el-select v-model="ruleForm.first_cateid" placeholder="选择一级分类" @change="changeFirstCate">
            <el-option
              v-for="item in fistcate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="ruleForm.second_cateid"
            placeholder="请选择二级分类"
            @change="changeSecondCate"
          >
            <el-option
              v-for="item in secondcate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品名称 -->
        <el-form-item prop="goodsname" label="商品名称">
          <el-input v-model="ruleForm.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload action="#" list-type="picture-card" :auto-upload="false">
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
          <el-dialog :visible.sync="disabled">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品规格名称">
          <el-select v-model="ruleForm.sepcsid" placeholder="请选择商品规格名称" @change="changeSpecs">
            <el-option
              v-for="item in specsattr"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格值">
          <el-select v-model="ruleForm.sepcsattr" multiple placeholder="请选择商品规格值">
            <el-option
              v-for="item in specsattrs"
              :key="item.id"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价">
          <el-input v-model="ruleForm.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="ruleForm.market_price" type="number"></el-input>
        </el-form-item>
        <!-- 是否新品。 -->
        <el-form-item label="是否新品">
          <el-radio v-model="ruleForm.isnew" label="1">是</el-radio>
          <el-radio v-model="ruleForm.isnew" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="ruleForm.ishot" label="1">是</el-radio>
          <el-radio v-model="ruleForm.ishot" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="aditor"></div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="ruleForm.status" label="1">上架</el-radio>
          <el-radio v-model="ruleForm.status" label="2">下架</el-radio>
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
import $ from "jquery";
import E from "wangEditor";
export default {
  data() {
    return {
      //列表数据
      tableData1: [],
      dialogImageUrl: "",

      disabled: false,
      //是否显示弹窗
      dialogVisible: false,
      //提交的数据
      ruleForm: {
        first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        price: "", //商品价格
        market_price: "", //市场价格
        img: "", //商品图片（文件）
        description: "", //商品描述
        sepcsid: "", //商品规格编号
        sepcsattr: "", //商品规格属性
        isnew: true, //是否新品
        ishot: true, //是否热卖推荐
        status: "1", //状态1正常2禁用
      },
      tip: "",
      //验证规则
      rules: {
        goodsname: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      //弹窗列表数据
      goods: [],
      // 状态开关
      status: true,
      //总条数
      totals: 0,
      pagesize: 3, //每页条数
      currentPage: 1, //当前页
      fistcate: [], //一级分类列表
      secondcate: [], //二级分类列表
      specsattr: [], //商品规格
      specsattrs: [], //商品规格属性
    };
  },
  mounted() {
    // 获取数据
    this.getTotal();
  },
  methods: {
    //获取分类
    getcategory(pid = 0) {
      this.$http.get("/api/catelist", { params: { pid: pid } }).then((res) => {
        if (pid === 0) {
          // 一级分类
          this.fistcate = res.list;
        } else {
          //二级分类
          this.secondcate = res.list;
        }
        //  console.log(res.list);
      });
    },
    //切换一级分类
    changeFirstCate(pid) {
      this.secondcate = [];
      this.getcategory(pid);
    },
    // 选择二级分类
    changeSecondCate() {},
    //获取属性值
    getspecs() {
      this.$http.get("/api/specslist").then((res) => {
        this.specsattr = res.list;
        console.log(res.list);
        this.specsattr.map((item) => {
          if (item.id === this.ruleForm.sepcsid) {
            this.specsattrs = item.attrs;
          }
        });
      });
    },
    //切换属性
    changeSpecs() {
      var arr = this.specsattr.find((item, index) => {
        return item.id === this.ruleForm.sepcsid;
      });
      console.log(arr.attrs);
      this.specsattrs = arr.attrs;
    },
    //获取总的数据条数
    getTotal() {
      this.$http.get("/api/goodscount").then((res) => {
        if (res.code === 200) {
          this.totals = res.list[0].total;
          this.getTatble();
        }
      });
    },
    //获取表格数据
    getTatble() {
      this.$http
        .get("/api/goodslist", {
          params: {
            size: this.pagesize,
            page: this.currentPage,
          },
        })
        .then((res) => {
          if (res.code === 200) {
            console.log(res.list);
            this.tableData1 = res.list || [];
          }
        });
    },
    //改变页数
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.$http
        .get("/api/goodslist", {
          params: {
            size: this.pagesize,
            page: currentPage,
          },
        })
        .then((res) => {
          this.tableData1 = res.list;
        });
      this.$http.get("/api/goodscount").then((res) => {
        var num = res.list[0].total;
        this.totals = num;
      });
    },
    //选择框
    // changegoods(value) {
    //   this.ruleForm.goodsid = value;
    // },
    //状态
    changestatus(value) {
      // console.log(value);
      this.status = value;
    },
    //打开弹窗
    open() {
      // console.log("open");
      var editor2 = new E("#aditor");
      editor2.create();
    },
    //添加
    handleEditAdd() {
      this.getcategory();
      this.getspecs();
      this.tip = "添加";
      this.dialogVisible = true;
    },
    //编辑      r:这一行
    handleEdit(r) {
      this.getcategory();
      this.getspecs();
      // console.log(r);
      this.tip = "编辑";
      this.dialogVisible = true;

      this.$http.get("/api/goodsinfo?uid=" + r.uid).then((res) => {
        // console.log(res);
        if (res.code === 200) {
          //获取数据成功
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
        goodsid: "", //角色编号
        goodsname: "", //管理员名称
        password: "", //密码
        status: "1", //状态1正常2禁用
      };
      $("#aditor").html("");
    },
    // 确定
    handleConfirm() {
      this.dialogVisible = false;
      // 有id就是修改。没有就是添加
      let url = this.ruleForm.id ? "/api/goodsedit" : "/api/goodsadd";
      this.ruleForm.status = this.status ? "1" : "2";
      this.$http.post(url, this.ruleForm).then((res) => {
        if (res.code == 200) {
          // 获取数据
          this.$http.get("/api/goodscount").then((res) => {
            if (res.code === 200) {
              this.totals = res.list[0].total;
              if (
                this.totals % this.pagesize === 1 &&
                url === "/api/goodsadd"
              ) {
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
        goodsid: "", //角色编号
        goodsname: "", //管理员名称
        password: "", //密码
        status: "1", //状态1正常2禁用
      };
      $("#aditor").html("");
    },
    //删除
    handleDelete(r) {
      this.$http.post("/api/goodsdelete", { id: r.id }).then((res) => {
        // console.log(res);

        if (res.code === 200) {
          // 获取数据
          this.$http.get("/api/goodscount").then((res) => {
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
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  },
};
</script>

<style>
.el-pagination {
  text-align: right;
}
</style>