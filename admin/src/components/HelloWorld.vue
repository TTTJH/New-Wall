<template>
  <div class="box1">
    <!-- <img src="./assets/logo.png"> -->
     <!-- <a-button type="primary">Button></a-button> -->
    <div ref="myChart" style="width:100%;height:100%" id="myChart"></div>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    this.setMyEchart()  //页面挂载完成后执行
  },
  methods: {
      setMyEchart() {
          const myChart = this.$refs.myChart;  //通过ref获取到DOM节点
          if (myChart) {
              const thisChart = this.$echarts.init(myChart);  //利用原型调取Echarts的初始化方法
              const option = {
                      title: {
                          text: 'ECharts 入门示例'
                      },
                      tooltip: {},
                      legend: {
                          data:['销量']
                      },
                      xAxis: {
                          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                      },
                      yAxis: {},
                      series: [{
                          name: '销量',
                          type: 'bar',
                          data: [5, 20, 36, 10, 10, 20]
                      }]
                  }; //{}内写需要图表的各种配置，可以在官方案例中修改完毕后复制过来
              thisChart.setOption(option);  //将编写好的配置项挂载到Echarts上
              window.addEventListener("resize", function() {
                  thisChart.resize();  //页面大小变化后Echarts也更改大小
              });
          }
      }
  }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .box1{
    width: 40vw;
    height: 30vh;
    border-radius: 10px;
    box-shadow: 0 0 30px #f0f0f0;
    background-color: white;
    border: 1px solid #f0f0f0;
  }
</style>
