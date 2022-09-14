<template>
<div class="linearecharts"  ref="linearecharts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "linearEcharts",
  mounted(){
    let myEcharts = echarts.init(document.querySelector('.linearecharts'))
    // console.log("##这是折线图生命周期",myEcharts)  //这里是可行的
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
          type:'line',
          data:[10, 7, 33, 12, 48, 9,29,10,44],
          //拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(173,166,166,0)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgb(4,255,131)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
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
.linearecharts{
  width: 100%;
  height: 100%;
}
</style>
