<template>
  <div class="card-box">
      <p class="card-p">最热门卡片:</p>
      <p class="card">“{{card.content}}”</p>
      <div class="ball"></div>
  </div>
</template>

<script>
import {
    getCardAjax,// 获取最高赞卡片
} from '../api/index'
export default {
    name:"card",
    created() {
        getCardAjax()
            .then(val => {
                this.card = val.data.data[0]
            })
            .catch(err => {
                this.$message.warning(":(")
                console.log(err)
            })
    },
    data(){
        return{
            card:{}
        }
    }
}
</script>

<style scoped>
    .card-box{
        height: 160px;
        min-width: 160px;
        margin: 5px;
        position: relative;
        display: inline-block;
        overflow: hidden;
        border-radius: 25px;
        padding: 5px;
        border: 1px solid #f0f0f0;
        box-shadow: 0 0 30px #f0f0f0;
    }
    .card-p{
        top: 10px;
        left: 50%;
        font-family: 'SimSun';
        transform: translateX(-50%);
        position: absolute;        
    }
    .card{
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
        right: -36px;
        bottom: -36px;
        border-radius: 50%;
        background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
    }
</style>