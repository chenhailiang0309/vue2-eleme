<template>
  <div class="food_container">
    <head-top :head-title="headTitle" goBack="true"></head-top>
    <section class="sort_container">
      <div class="sort_item">
        <div class="sort_item_container">
          <div class="sort_item_border">
            <span>分类</span>
            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
              <polygon points="0,3 10,3 5,8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapMutations } from 'vuex'
import headTop from '@/components/header/head'

export default {
  data() {
    return {
      geohash: '', // city页面传递过来的地址geohash
      headTitle: '', // msiet页面头部标题
      foodTitle: '', // 排序左侧头部标题
      restaurant_category_id: '', // 食品类型id值
      sortBy: '', // 筛选的条件
      category: null, // category分类左侧数据
    }
  },
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ])
  },
  created() {
    this.initData(); // 初始化获取数据
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS'
    ]),
    // 初始化获取数据
    initData() {
      //获取从msite页面传递过来的参数
      this.geohash = this.$route.query.geohash;
      this.headTitle = this.$route.query.title;
      this.foodTitle = this.headTitle;
      this.restaurant_category_id = this.$route.query.restaurant_category_id;
      //防止刷新页面时，vuex状态丢失，经度纬度需要重新获取，并存入vuex
      if (!this.latitude) {
        // 获取位置信息
        this.getMsiteAddress();
      }
      // 获取category分类左侧数据
      this.foodCategory();
    },
    // 获取位置信息
    getMsiteAddress() {
      this.$http({
          url: 'http://cangdu.org:8001/v2/pois/' + this.geohash,
          type: 'get'
        })
        .then(res => {
          // 记录当前经度纬度进入vuex
          this.RECORD_ADDRESS(res.data);
        })
        .catch(error => {
          // console.log(error)
        })
    },
    // 获取category分类左侧数据
    foodCategory(){
      this.$http({
        url:'http://cangdu.org:8001/shopping/v2/restaurant/category',
        type:'post',
        data:{
          latitude : this.latitude,
          longitude:this.longitude
        }
      })
      .then(res=>{
        console.log(res.data)
        this.category = res.data;
        //初始化时定位当前category分类左侧默认选择项，在右侧展示出其sub_categories列表
        this.category.forEach(item=>{
          
        })
      })
      .catch(error=>{
        console.log(error)
      })
    }
  },
  components: {
    headTop
  }
}

</script>
<style lang="scss">
@import '../../style/mixin';
.food_container {
  padding-top: 3.6rem;
}

.sort_container {
  background-color: #fff;
  border-bottom: 0.025rem solid #f1f1f1;
  position: fixed;
  top: 1.95rem;
  right: 0;
  width: 100%;
  display: flex;
  z-index: 13;
  box-sizing: border-box;
  .sort_item {
    @include sc(0.55rem, #444);
    @include wh(33.3%, 1.6rem);
    text-align: center;
    line-height: 1rem;
    .sort_item_container {
      @include wh(100%, 100%);
      position: relative;
      z-index: 14;
      background-color: #fff;
      box-sizing: border-box;
      padding-top: .3rem;
      .sort_item_border {
        height: 1rem;
        border-right: 0.025rem solid $bc;
      }
    }
    .sort_icon {
      vertical-align: middle;
      transition: all .3s;
      fill: #666;
    }
  }
}

</style>
