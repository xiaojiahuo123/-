<template>
<div class="barEcharts" ref="barEcharts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "barEcharts",
  mounted(){
     let myEcharts= echarts.init(document.querySelector('.barEcharts'))
     myEcharts.setOption({
        xAxis:{
          show:false,
          type:'category'
        },
       yAxis:{
          show:false
       },
       series:[
         {
           type:"bar",
           data:[10, 7, 33, 12, 48, 9,29,10,44,33,22,8],
           color:'rgb(20,224,104)',
           // label:{
           //   show:true
           // }
         }
       ],
       //布局调试
       grid: {
         left: 0,
         top: 0,
         right: 0,
         bottom: 0,
       },
       tooltip:{}
     })
  }
}
</script>

<style scoped>
.barEcharts{
  width: 100%;
  height: 100%;
}
</style>
