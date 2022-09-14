<template>
  <div>
    <el-card shadow="always" style="margin: 20px auto">
      <categorySelect
        @getCategoryId="getCategoryId"
        :show="scene !== 0"
      ></categorySelect>
    </el-card>
    <el-card shadow="hover" v-if="scene == 0">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category3Id"
        @click="addSpu"
        >添加SPU</el-button
      >
      <el-table style="width: 100%" border :data="records">
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column
          prop="spuName"
          label="SPU名称"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="description" label="SPU描述" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template v-slot={row,$index}>
            <hint-button
              type="success"
              icon="el-icon-plus"
              round
              title="添加sku"
              @click="addSku(row)"
            ></hint-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              round
              title="修改spu"
              @click="updateSpu(row)"
            ></el-button>
            <hint-button
              type="info"
              icon="el-icon-view"
              round
              title="查看当前spu的全部sku信息"
              @click="handler(row)"
            ></hint-button>
            <hint-button
              type="danger"
              icon="el-icon-delete-solid"
              round
              title="删除"
              @click="deleteSpu(row)"
            ></hint-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; text-align: center"
        @size-change="handleSizeChange"
        @current-change="getSpuList"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加 -->
    <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene" />
    <SkuForm v-show="scene === 2" ref="sku" @changeScenes="changeScenes" />
    <el-dialog :title="`${spu.spuName}的sku信息`" :visible.sync="dialogTableVisible">
       <el-table :data="skuList">
         <el-table-column prop="skuName" label="名称" width="width">
         </el-table-column>
         <el-table-column prop="price" label="价格" width="width">
         </el-table-column>
         <el-table-column prop="weight" label="重量" width="width">
         </el-table-column>
         <el-table-column label="默认图片" width="width">
           <template v-slot={row,$index}>
             <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
           </template>
         </el-table-column>
       </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm/index.vue";
import SpuForm from "./SpuForm/index.vue";
import {reqDeleteSpu} from "@/api/product/spu";
export default {
  name: "Spu",
  data() {
    return {
      //分别是分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      page: 1, //分页器当前第几页
      limit: 3, //每一页需要展示多少条数据
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示SPU列表数据   1 添加SPU|修改SPU   2 添加SKU
      //控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], //存储的是SKU列表的数据
      loading: true,
    };
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId:获取到一、二、三级分类的id  level：为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除2、3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //清除3级id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取SPU列表数据进行展示
        this.getSpuList();
      }
    },
    /*获取SPU数据列表*/
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // console.log(result);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
        this.$message({
          type: "success",
          message: result.message,
        });
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    //当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //再发请求
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      console.log("这里是scene", this.scene);
      this.$refs.spu.addSpuData(this.category3Id);
    },
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求------三个请求
      console.log(this.$refs)
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);  //spu
    },
    //修改spu信息
    updateSpu(row) {
      this.scene = 1;
      //获取子组件SpuForm子组件的
      //在父组件当中可以通过$ref获取子组件等等
      this.$refs.spu.initSpuData(row);  //这里的插槽的row中就包含了点击修改的spu的所有数据,传递给了子组件
    },
    //查看SKU的按钮的回调
    async handler(spu) {
      //点击这个按钮的时候，对话框可见的
      this.dialogTableVisible = true;
      //保存spu信息
      this.spu = spu;
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        console.log(this.skuList)
        //loading隐藏
        this.loading = false;
      }
    },
    //删除一个spu
    async  deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      console.log(row)
      console.log(result)
      if(result.code == 200){
        this.$message({ type: "success", message: "删除成功" });
        //代表SPU个数大于1删除的时候停留在当前页，如果SPU个数小于1 回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 自定义事件
    changeScene({ scene, flag }) {
      this.scene = scene;
      if(flag == '修改'){
        this.getSpuList(this.page)
      }else{
        this.getSpuList()
      }
    },
    changeScenes(scene) {
      console.log("changeScenes调用");
      this.scene = scene
    },
  },
  components: {
    SkuForm,
    SpuForm,
  },
};
</script>

<style>
</style>
