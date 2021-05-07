<template>
    <div class='device-box'>
      <p class='device-p'>用户使用设备比重:</p>
        <div ref="myChart" style="width:100%;height:100%" id="myChart"></div>
      <div class='ball'></div>
    </div>
</template>

<script>
import {
    getDeviceAjax,//获取用户设备比重
} from '../api/index'
export default {
    name:"device",
    created() {
        getDeviceAjax()
            .then(val => {
                let data = val.data.data
                data.map((item,index) => {
                    item.name = item._id
                })
                this.deviceArr = data
                this.setMyEchart()
            })
            .catch(err => {
                this.$message.warning(":(")
            })
    },
    data(){
        return{
            deviceArr:[]
        }
    },
    methods:{
        setMyEchart() {
          const myChart = this.$refs.myChart;  //通过ref获取到DOM节点
          if (myChart) {
              const thisChart = this.$echarts.init(myChart);  //利用原型调取Echarts的初始化方法
              const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: 'center',
                        left: '5%',
                        width:"50px"
                    },
                    series: [
                        {
                            // name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            // data: [
                            //     {value: 1048, name: '搜索引擎'},
                            //     {value: 735, name: '直接访问'},
                            //     {value: 580, name: '邮件营销'},
                            //     {value: 484, name: '联盟广告'},
                            //     {value: 300, name: '视频广告'}
                            // ]
                            data:this.deviceArr
                        }
                    ]
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

<style scoped>
    .device-box{
        height: 160px;
        min-width: 320px;
        margin: 5px;
        position: relative;
        display: inline-block;
        overflow: hidden;
        border-radius: 25px;
        padding: 5px;
        border: 1px solid #f0f0f0;
        box-shadow: 0 0 30px #f0f0f0;
    }
    .device-p{
        width: 100%;
        top: 10px;
        left: 50%;
        font-family: 'SimSun';
        transform: translateX(-50%);
        position: absolute;        
    }
    #myChart{
        margin-top:5px;
    }
    .ball{
        width: 80px;
        height: 80px;
        position: absolute;
        right: -36px;
        bottom: -36px;
        border-radius: 50%;
        background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
    }
</style>