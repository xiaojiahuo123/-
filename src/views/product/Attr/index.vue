<template>
  <div>
    <el-card shadow="hover" style="margin: 20px 0">
      <categorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></categorySelect>
    </el-card>
    <el-card shadow="hover">
      <div v-show="isShowTable">
        <el-button
          type="primary"
          round
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          @click="addAttr"
          :disabled="!category3Id"
          >添加</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column
            type="index"
            prop="date"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="120">
            <template slot-scope="{ row, $index }">
              <el-button
                icon="el-icon-edit"
                circle
                type="warning"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                icon="el-icon-delete"
                circle
                type="danger"
                @click="deleteAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性 | 修改属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-widt="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            prop="prop"
            label="序号"
            width="80"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 无法实现加载出来立即判断input的状态 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值!"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                @input="forbid(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete-solid"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1 || Fliter"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep"; //这里的深拷贝是我们引入的库，最好是自己直接手写一个深浅拷贝
export default {
  name: "Attr",
  data() {
    return {
      Fliter: false, //使得空属性值无法添加
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接受平台属性的数据
      attrList: [],
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //代表三级分类的id有了
        this.category3Id = categoryId;
        //发请求获取平台的属性数据
        this.getAttrList();
      }
      // console.log(this.category1Id,this.category2Id,this.category3Id);
    },
    // 数据更新
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      console.log(result);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: result.message,
        });
        this.attrList = result.data;
        return "ok";
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    // 修改属性
    updateAttr(row) {
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
      //深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
      this.attrInfo = cloneDeep(row);
      // 实现点击对应的属性的修改只更改对应的属性
      this.attrInfo.attrValueList.forEach((item) => {
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, "flag", false); //forEach遍历attrValueList数组中的=每一项，为其添加flag属性，其对应的值是falseF
      });
    },
    // 添加属性input
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      };
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: "",
        flag: true,
      });
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      //当前flag属性，响应式数据（数据变化视图跟着变化）
    },
    // 保存
    async addOrUpdateAttr() {
      //修改和保存都是对服务器改变
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值为空的属性
          if (item.valueName !== "") {
            // 删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        console.log(result);
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        this.getAttrList();
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    // input失去焦点
    toLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });

      if (isRepat) return;
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    // span失去焦点
    toEdit(row, $index) {
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs[$index].focus(); //通过为input打ref的方式获取到当前点击的input，并且以此为其添加焦点
      });
    },
    //修改 | 添加属性中删除对应的属性值
    deleteAttrValue(index) {
      console.log(index);
      this.attrInfo.attrValueList.splice(index, 1); //接口原因，这里的删除走的是修改 | 保存接口
    },
    // 删除整个平台属性
    deleteAttr(index) {
      this.attrList.splice(index, 1); //这里没有实现删除整个的接口，也就是服务器数据无法操作，除非自己写一个，
    },
    // 实现属性值为空的时候无法点击保存
    forbid(row) {
      console.log("验证", row);
      // for (let result in row) {
      //   if (row.hasOwnProperty(result)) {
      //     // console.log(result);
      //     console.log('###',row[result]);
      //     if(row[result] == ""){
      //      //此时依旧有缺憾，不能一开始直接执行一次
         //这种傻逼代码居然是我写出来的
      //       this.Fliter =true
      //     // }else if(row[result] !== ""){
      //     //   console.log(row[result]);
      //     //   this.Fliter =false
      //     }
      //   }
      // }
      if(row.valueName == ""){
        this.Fliter = true
      }else{
        this.Fliter = false
      }
      console.log(this.Fliter);
    },
  },
};
</script>

<style>
</style>
