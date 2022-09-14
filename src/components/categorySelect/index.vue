<template>
  <div>
    <!-- 一行放置多个表单元素，为行内表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "categorySelect",
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      // 收集对应分类的ids
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      // 获取一级分类数据
      let result = await this.$API.attr.reqCategory1List();
      // console.log(result);
      if (result.code == 200) {
        this.list1 = result.data;
      } else {
        this.$message({
          type: "error",
          message: "请求一级分类商品数据失败",
        });
      }
    },
    // 一级分类选择回调
    async handler1() {
      // 清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      const { category1Id } = this.cForm;
      this.$emit('getCategoryId', {categoryId:category1Id,level:1})
      // 获取二级分类数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      } else {
        return Promise.reject(new Error(message.error));
      }
    },
    // 二级分类回调
    async handler2() {
      this.list3 = [];
      this.category3Id = "";
      const { category2Id } = this.cForm;
      this.$emit('getCategoryId', {categoryId:category2Id,level:2})
      let result = await this.$API.attr.reqCategory3List(category2Id);
      // console.log(result);
      if (result.code == 200) {
        this.list3 = result.data;
      } else {
      }
    },
    // 三级分类回调
    handler3() {
     const{category3Id} = this.cForm
     this.$emit('getCategoryId', {categoryId:category3Id,level:3})
    },
  },
};
</script>

<style>
</style>
