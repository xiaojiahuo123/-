<template>
<div class="progressEcharts" ref="progressEcharts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "progressEcharts",
  mounted(){
    let myEcharts = echarts.init(document.querySelector('.progressEcharts'))
    myEcharts.setOption({
         xAxis:{
           show:false,
           min: 0,
           max: 100,
         },
         yAxis:{
           show:false,
           //均分
           type: "category",
         },
      //系列
      series: [
        {
          //图标形式-柱状图
          type: "bar",
          data: [78],// 这里是因为上面给定了x的取值范围
          color: "cyan",
          //柱状图的宽度
          barWidth: 10,
          // color: "yellowgreen",
          //背景颜色设置
          showBackground: true,
          //设置背景颜色
          backgroundStyle: {
            color: "rgba(137,157,157,0.32)",
          },
          //文本标签
          label:{
            show:true,
            //改变文本内容
            formatter:'|',
            //文本标签位置调试
            position:'right'
          }
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    })
  }
}
</script>

<style scoped>
.progressEcharts{
  width: 100%;
  height:100%;
}
</style>
