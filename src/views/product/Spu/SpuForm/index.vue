<template>
  <el-card>
    <el-form ref="from" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入名称!" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="placeholder" v-model="spu.tmId">
          <el-option
            :label="tradeMark.tmName"
            :value="tradeMark.id"
            v-for="(tradeMark, index) in tradeMarkList"
            :key="tradeMark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          style="resize: none"
          placeholder="请输入具体描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-progress="sendImageData"
          :on-success="sendImaneDataSuccesscreat"
          :on-error="sendImageDataError"
          :on-preview="inquireImageData"
          :on-remove="removeSendData"
          :file-list="spuImageList"
        >
          <!--  :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" -->
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" width="100%" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttrListData.length}`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :value="`${item.id}:${item.name}`"
            :label="item.name"
            v-for="item in unSelectSaleAttrListData"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" header-align="center" align="center" label="序号" width="80px">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="saleAttrName" label="属性名">
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="prop" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag closable :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- <el-input v-model="" placeholder=""></el-input> -->
              <!-- 底下的解构可以当中咱们当年的span与input切换 -->
              <!--  @keyup.enter.native="handleInputConfirm"  -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" prop="prop" label="操作">
            <template slot-scope="{row,$index}">
              <el-button  type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)" >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
        <!--cancel是取消的意思-->
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
// 添加
export default {
  name: "SpuForm",
  data() {
    return {
      commentContent: "",
      dialogImageUrl: "",
      dialogVisible: false,

      //spu属性初始化的时候是一个空的对象,在修改SPU的时候，会想服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [], //销售属性的数据（项目全部的销售属性）
      attrIdAndAttrName: "", //收集未选择的销售属性的id-----
    };
  },
  methods: {
    // open() {  //此方式存在问题暂时无法解决，以后再尝试
    //   //<input type="text" placeholder="输入属性值" class="text_my_input"></input>
    //   this.$alert("搞快点！", "输入属性值", {
    //     dangerouslyUseHTMLString: true,
    //     showCancelButton: true,
    //     cancelButtonText: "取消",
    //     showInput: true,
    //     value: this.messageBoxValue,

    //   });
    // },
    //进入页面之前点击添加SPU按钮的时候触发的回调(这个是点击添加Spu触发的回调)
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      //获取对应的品牌信息
      let result = await this.$API.spu.reqTradeMarkList();
      // console.log(result);
      if (result.code == 200) {
        console.log('这是result',result)
        this.$message({
          type: "success",
          message: "获取品牌信息成功!",
        });
        this.tradeMarkList = result.data;
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
        // console.log(result.message);
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log('这是saleResult',saleResult)
      if (saleResult.code == 200) {
        this.$message({
          type: "success",
          message: "成功获取售卖属性",
        });
        this.saleAttrList = saleResult.data;
      } else {
        console.log(saleResult.message);
      }
    },
    //初始化SpuForm数据(这个是修改Spu触发的回调)
    async initSpuData(spu) {
      //获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id); //此时是修改，已经有id存在
      if (spuResult.code == 200) {
        // console.log('这是spuResult',spuResult)
        //在修改spu的时候,需要向服务器发请求的，把服务器返回的数据（对象），赋值给spu属性
        this.$message({
          type: "success",
          message: "修改Spu初始化成功!",
        });
        // console.log("初始化查看", spuResult.data);
        // console.log(spu.description);
        this.spu = spuResult.data;
      }
      //在这下面把逻辑重新写一下
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        // console.log('获得的品牌',tradeMarkResult)
        // console.log("初始化查看", tradeMarkResult.data);
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        // console.log('获得的图片',spuImageResult)
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据赋值给
        // console.log("初始化查看", listArr);
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        // console.log("初始化查看", saleResult.data);
        this.saleAttrList = saleResult.data;
      }
    },
    //on-progress,这是ElementUI中规定的用于el-Upload中，图片上传时(也就是上传中途)的回调
    sendImageData(event, file, fileList) {
      this.$message({
        type: "success",
        message: "上传中...",
      });
    },
    //on-success，这是图片上传完成且成功时的钩子
    sendImaneDataSuccesscreat(response, file, fileList) {
      this.$message({
        type: "success",
        message: "这是on-success回调函数的触发",
      });
      //收集图片信息
      this.spuImageList = fileList;
    },
    //on-preveiew是el-Upload查看已上传的图片或者文件的钩子
    inquireImageData(file) {
      this.$message({
        type: "success",
        message: "on-preveiew钩子调用",
      });
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //on-remove是删除el-upload中已经上传文件的钩子
    removeSendData(file, fileList) {
      this.$message({
        type: "error",
        message: "正在删除",
      });
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList,22222);
      //收集照片墙图片的数据
      //对于已有的图片【照片墙中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
    },
    //on-error，显而易见，这是上传图片或者文件失败的钩子
    sendImageDataError() {
      this.$message({
        type: "error",
        message: "这都失败？是时候换一个电脑了伙计",
      });
    },
    // el-input失去焦点事件
    handleInputConfirm(row) {  //切记事事小心，这里单词错了之前
      console.log(row);
      const {baseSaleAttrId ,inputValue} = row
      console.log(inputValue);
      if(inputValue.trim() == ""){  //注意这里，trim()方法写错了是不会报错的
        this.$message({
          type:"warning",
          message:"属性值不能为空!"
        })
        console.log('判断逻辑正常吗？');
        return
      }
      //避免重复
      let result = row.spuSaleAttrValueList.every((item)=>{
        return  item.saleAttrValueName !== inputValue
      })
      if(!result) return //假如result为空（里面不存在数据），到这里直接停止执行下面的逻辑
      // console.log('已经执行');
      const newSaleAttrList = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrList)
      console.log('###',row.spuSaleAttrValueList)
      row.inputVisible = false;  //
    },
    //添加新的销售属性
    addSaleAttr() {
      //已经收集需要添加的销售属性的信息
      //把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndAttrName = "";
    },
    //点击添加销售属性属性值的回调
    addSaleAttrValue(row) {
      //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row, "inputVisible", true);   //在Vue2中，重新手动添加的数据无法同步。使用$set解决
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      console.log(this.spu)
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        console.log(item)
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件回到场景0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //取消按钮的回调，通知父亲切换场景为0
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    unSelectSaleAttrListData() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName; //this.spu.saleAttrList中不存在，则将其从saleAttrList中加入进去
        });
      });
      return result;
    },
  },
};
</script>

<style lang="css" scope>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
