<template>
  <el-card>
    <el-form ref="form" label-width="80px" >
      <el-form-item label="spu名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="sku名称">
        <el-input v-model="skuInfo.skuName" placeholder="请输入sku名称"></el-input>
<!--  Invalid prop: type check failed for prop "value". Expected String, Number, got Object found in
      无效属性——value属性类型检查失败，期望是字符串或者number或者数组，却是对象。这里的value就是指v-model绑定的值。
-->
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="请输入价格" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="请输入" type="text" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="请输入具体描述!"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
         <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
           <el-select placeholder="选择" v-model="attr.attrIdAndValueId">
             <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
           </el-select>
         </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
          <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
            <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" width="80" value="true">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template v-slot="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px">
            </template>
          </el-table-column><el-table-column prop="imgName" label="名称" width="width">
          </el-table-column><el-table-column prop="prop" label="操作" width="width">
          <template v-slot={row,$index}>
            <el-button type="primary" v-if="row.isDefault === 0" @click="changeDefault(row)">设置默认</el-button>
            <el-button v-else>默认</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import spuForm from "@/views/product/Spu/SpuForm";
import {reqAddSku, reqAttrInfoList, reqSpuImageLIst, reqSpuSaleAttrList} from "@/api/product/spu";

export default {
  name: "SkuForm",
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售是属性
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu:{},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imageList:[]
    };
  },
  methods: {
    /*这是点击添加sku时触发的回调*/
    async getData(category1Id,category2Id,spu){
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      //获取spu图片数据
      let result = await this.$API.spu.reqSpuImageLIst(spu.id)
      // console.log(result)
       if (result.code == 200){
         // console.log(result.message)
         let list = result.data
         list.forEach((item)=>{
           item.isDefault = 0
         })
         this.spuImageList  = list
         console.log(this.spuImageList)
       }
       /* 获取销售属性 */
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      console.log(result1)
      if (result1.code == 200){
        // console.log('成功获取销售属性数据')
        this.spuSaleAttrList = result1.data
        // console.log('spuSaleAttrList',this.spuSaleAttrList)
      }
      /* 获取平台属性 */
      let attrInfoListResult = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id)
      // console.log(attrInfoListResult)
      if(attrInfoListResult.code == 200){
        this.attrInfoList = attrInfoListResult.data
        console.log('attrInfoList',this.attrInfoList)
      }
    },
   /*复选框变化*/
    handleSelectionChange(params){
      this.imageList = params
    },
    changeDefault(row){
      // console.log(row)
      this.spuImageList.forEach((item)=>{
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg  = row.imgUrl
    },
    //保存按钮的事件
    async save(){
      //整理参数
      //整理平台属性
      const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this;
      //整理平台属的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [attrId,valueId]  = item.attrIdAndValueId.split(":");
          prev.push({attrId,valueId});
        }
        return prev;
      },[]);
      console.log('####',skuInfo.skuAttrValueList)
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({saleAttrId,saleAttrValueId});
        }
        return prev;
      },[]);
      console.log('####',skuInfo.skuSaleAttrValueList)
      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id,
        }
      });
      console.log('####',skuInfo.skuImageList)
      //发请求
      let result  = await this.$API.spu.reqAddSku(skuInfo);
      console.log(result);
      console.log(skuInfo);
      if(result.code==200) {
        this.$message({type: 'success', message: '添加SKU成功'})
        this.$emit('changeScenes', 0);
      }
    },
    cancel(){
      //自定义事件，让父组件切换场景0
      this.$emit('changeScenes',0);
      //清除数据
      Object.assign(this._data,this.$options.data());
    },
  },
};
</script>

<style>
</style>
