<template>
   <el-card style="margin: 10px 0" class="box-card">
     <div slot="header" class="clearfix">
       <el-tabs class="tab" v-model="activeName">
         <el-tab-pane label="销售额" name="sale"></el-tab-pane>
         <el-tab-pane label="访问量" name="visite"></el-tab-pane>
       </el-tabs>
<!--       header right-->
       <div class="right">
         <span @click="setDay">今日</span>
         <span @click="setWeek">本周</span>
         <span @click="setMonth">本月</span>
         <span @click="setYear">本年</span>
         <el-date-picker
           v-model="date"
           class="date"
           type="daterange"
           range-separator="--"
           start-placeholder="开始日期"
           end-placeholder="结束日期"
         >
         </el-date-picker>
       </div>
     </div>
     <div>
       <el-row :gutter="10">
         <el-col :span="18">
           <div class="charts" ref="charts"></div>
         </el-col>
         <el-col :span="6" class="right">
           <h3>门店{{title}}排名</h3>
           <ul>
             <li>
               <span class="rindex">0</span>
               <span>肯德基</span>
               <span class="rvalue">123456</span>
             </li>
             <li>
               <span class="rindex">1</span>
               <span>肯德基</span>
               <span class="rvalue">123456</span>
             </li>
             <li>
               <span class="rindex">3</span>
               <span>肯德基</span>
               <span class="rvalue">123456</span>
             </li>
             <li>
               <span>4</span>
               <span>肯德基</span>
               <span class="rvalue">123456</span>
             </li>
             <li>
               <span>5</span>
               <span>肯德基</span>
               <span class="rvalue">123456</span>
             </li>
             <li>
               <span>6</span>
               <span>肯德基</span>
               <span class="rvalue">123456</span>
             </li>
             <li>
               <span>7</span>
               <span>肯德基</span>
               <span class="rvalue">123456</span>
             </li>
           </ul>
         </el-col>
       </el-row>
     </div>
   </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data(){
    return {
      date:[],
      activeName: "sale",
      myEcharts:null
    }
  },
  mounted(){
     this.myEcharts = echarts.init(document.querySelector('.charts'))
     this.myEcharts.setOption({
       title: {
         text:this.title + "趋势",
       },
       tooltip: {
         trigger: "axis",
         axisPointer: {
           type: "shadow",
         },
       },
       grid: {
         left: "3%",
         right: "4%",
         bottom: "3%",
         containLabel: true,
       },
       xAxis: [
         {
           type: "category",
           data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
           axisTick: {
             alignWithLabel: true,
           },
         },
       ],
       yAxis: [
         {
           type: "value",
         },
       ],
       series: [
         {
           name: "Direct",
           type: "bar",
           barWidth: "60%",
           data: ['300','400','390','268','240','220','180','420','250','330','130','230'],
           color: "#00f8d9",
         },
       ],
     })
  },
  methods:{
    //本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  computed:{
    //计算属性-标题
    title() {
      //重新设置配置项
      return this.activeName === "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch:{
    title(){
      this.myEcharts.setOption({
        title:{
          text:this.title + '趋势'
        },
      })
    },
  }
}
</script>

<style lang="css" scoped>
.clearfix{
  position: relative;
  display: flex;
  justify-content: space-between;
}
 .tab{
  width: 80%;
}

.right{
  position: absolute;
  right: 0;
}
.date {
  width: 250px;
  margin: 0px 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>
