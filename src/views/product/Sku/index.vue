<template>
  <div>
    <el-table border style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" prop="skuName" width="width"></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="width"></el-table-column>
      <el-table-column label="默认图片" width="width">
        <template v-slot={row,$index}>
          <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px"/>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80px"></el-table-column>
      <el-table-column label="价格" prop="price" width="80px"></el-table-column>
      <el-table-column label="操作" prop="" width="width">
        <template v-slot={row,$index}>
          <el-button type="success" title="上架" icon="el-icon-top-right" size="mini" @click="grounding(row)" v-if="row.isSale === 1"></el-button>
          <el-button type="success" title="下架" icon="el-icon-bottom-left" size="mini" v-else @click="soldOut(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="info" size="mini" title="查看信息" icon="el-icon-more" @click="inquireInfo(row)"></el-button>
          <el-button type="danger" size="mini" title="删除Sku" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px; text-align: center"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>

    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {reqCancel, reqSale, reqSkuById, reqSkuList} from "@/api/product/sku";

export default {
  name: 'Sku',
  data(){
    return {
      records:[],
      page:1,
      limit:5,
      total:0,
      show:false,
      skuInfo:{}
    }
  },
  mounted(){
    this.getSkuList()
  },
  methods:{
   async getSkuList(pager = 1){
    this.page = pager
    const {page,limit} = this
    let result = await this.$API.sku.reqSkuList(page,limit)
    // console.log(result)
    if (result.code === 200){
      this.records = result.data.records
      this.total = result.data.total
     }else{
      console.log(result.message)
     }
    },
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      this.getSkuList();
    },
    async grounding(row){
      console.log(row)
      let result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200){
        row.isSale = 0
        this.$message({type:'success', message:'下架成功!'})
      }
    },
    async soldOut(row){
      console.log(row)
      let result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200){
       row.isSale = 1
       this.$message({type:'success', message:'上架成功'})
      }
    },
    async inquireInfo(row){
      this.show = true
      let result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200){
        this.skuInfo = result.data;
      }
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5{
  font-size:18px;
  text-align:right;
}
.el-col{
  margin:10px 10px;
}

>>>.el-carousel__button{
  width:10px;
  height:10px;
  background:red;
  border-radius:50%;
}
</style>
