<template>
  <div id="app">
    <!-- <router-view/> -->
    <Top/>

    <div>
      <Device/>
      <MyTime/>
    </div>
        <div>
      <Keyword/>
      <Card/>
      <Type/>
    </div>
    <div>
      <Gender/>
    </div>
  </div>
</template>

<script>
import Top from './components/Top' //顶栏UI
import Keyword from './components/Keyword' // 热词模块
import Card from './components/Card'// 最高赞模块
import Type from './components/Type'// 最热门卡片种类
import MyTime from './components/MyTime'// 获取卡片发布时间数组
import Gender from './components/Gender' //用户性别比重模块
import Device from './components/Device' //用户使用设备模块
export default {
  name: 'App',
  components:{
    Keyword,
    Card,
    Type,
    MyTime,
    Top,
    Gender,
    Device,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

/* //设置文字不可被选中 */
*{
  -webkit-user-select:none;
   -moz-user-select:none;
   -ms-user-select:none;
   user-select:none;
}
</style>
