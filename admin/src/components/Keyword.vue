<template>
  <div class="keyword-box">
      <p class="keyword-p">最热门词汇:</p>
      <p class="keyword">“{{keyword.keyword}}”</p>
      <!-- <div ref="myChart" style="width:100%;height:100%" id="myChart"></div> -->
    <div class="ball"></div>
  </div>
</template>

<script>
import {
    getKeywordAjax,// 获取发言比重ajax
} from '../api/index'
export default {
    name:"keyword",
    created(){
        // 获取发言比重ajax
        getKeywordAjax()
            .then(val => {
                let keywordArr = JSON.parse(val.data.data) 
                // let keywordArr = []
                // let weightArr = []
                // keywordList.map((item,index) => {
                //     keywordArr.push(item.keyword)
                //     weightArr.push(item.weight*10)
                // })   
                // this.keywordArr = keywordArr
                // this.weightArr = weightArr 
                // this.setMyEchart()//调用表格渲染方法
                this.keyword = keywordArr[0]
            })
            .catch(err => {
                console.log(err)
            })
    },
    mounted(){
    },
    data(){
        return{
            keyword:{}
        }
    },
    methods:{
    //   setMyEchart() {
    //       const myChart = this.$refs.myChart;  //通过ref获取到DOM节点
    //       if (myChart) {
    //           const thisChart = this.$echarts.init(myChart);  //利用原型调取Echarts的初始化方法
    //           const option = {
    //                   title: {
    //                       text: 'ECharts 入门示例'
    //                   },
    //                   tooltip: {},
    //                   legend: {
    //                     //   data:['销量']
    //                   },
    //                   xAxis: {
    //                     //   data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    //                     data:this.keywordArr
    //                   },

    //                   yAxis: {
    //                       data:[]
    //                   },
    //                   series: [{
    //                       name: '销量',
    //                       type: 'bar',
    //                     //   data: [5, 20, 36, 10, 10, 20]
    //                       data:this.weightArr
    //                   }]
    //               }; //{}内写需要图表的各种配置，可以在官方案例中修改完毕后复制过来
    //           thisChart.setOption(option);  //将编写好的配置项挂载到Echarts上
    //           window.addEventListener("resize", function() {
    //               thisChart.resize();  //页面大小变化后Echarts也更改大小
    //           });
    //       }
    //   }
    }
}
</script>

<style scoped>
    .keyword-box{
        width: 160px;
        height: 160px;
        margin: 5px;
        position: relative;
        display: inline-block;
        overflow: hidden;
        border-radius: 25px;
        padding: 5px;
        border: 1px solid #f0f0f0;
        box-shadow: 0 0 30px #f0f0f0;
    }
    .keyword-p{
        top: 10px;
        left: 50%;
        font-family: 'SimSun';
        transform: translateX(-50%);
        position: absolute;        
    }
    .keyword{
        font-size: 28px;
        margin: 0;
        line-height: 160px;
        color:  #69606b;
        font-family: 'SimSun';
    }

    .ball{
        width: 80px;
        height: 80px;
        position: absolute;
        right: -35px;
        bottom: -35px;
        border-radius: 50%;
        background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
    }
</style>