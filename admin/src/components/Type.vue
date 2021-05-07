<template>
  <div class='type-box'>
      <p class='type-p'>最热门卡片种类:</p>
      <div class='type'>
          <a-icon :type="typeList2[type]" />
          <span v-html="typeList1[type]"></span>
      </div>
      <div class='ball'></div>
  </div>
</template>

<script>
import {
    getTypeAjax,// 获取卡片最多种类
} from '../api/index'
export default {
    name:'type',
    created() {
        getTypeAjax()
            .then(val => {
                let type = val.data.data._id*1
                this.type = type
            })
            .catch(err => {
                this.$message.warning(":(")
                console.log(err)
            })
    },
    data(){
        return{
            typeList1:[
                        "<span>普通卡</span>",
                        "<span>捞人卡</span>",
                        "<span>寻物卡</span>",
                        "<span>心事卡</span>",
                       " <span>吐槽卡</span>",
                        "<span>提问卡</span>",
                        "<span>交友卡</span>",
                        "<span>开黑卡</span>",
                        "<span>安利卡</span>",
                        "<span>学习卡</span>",
                        "<span>无聊卡</span>",
            ],
            typeList2:[
                "file","heart","robot","message","question-circle","usergroup-add","car","like","read","meh"
            ],
            type:''
        }
    }
}
</script>

<style scoped>
    .type-box{
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
    .type-p{
        width: 100%;
        top: 10px;
        left: 50%;
        font-family: 'SimSun';
        transform: translateX(-50%);
        position: absolute;        
    }
    .type{
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
</style>>
