<template>
  <div>
    <head-top>
      <router-link :to="'/search/geohash'" class="link_search" slot="search">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none" />
          <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2" />
        </svg>
      </router-link>
      <router-link to="/home" slot="msite-title" class="msite_title">
        <span class="title_text ellipsis">{{msiteTitle}}</span>
      </router-link>
    </head-top>
  </div>
</template>
<script>
import headTop from '@/components/header/head'

import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      msiteTitle: '请选择地址...', // msite页面头部标题
      geohash: '', // city页面传递过来的地址geohash,
    }
  },
  created() {
    // console.log(this.$route.query.geohash)
    if (!this.$route.query.geohash) {
      this.getGuessGeolocation()
    } else {
      this.geohash = this.$route.query.geohash
    }
    //保存geohash 到vuex
    this.SAVE_GEOHASH(this.geohash); //与  @click="SAVE_GEOHASH(this.geohash)"  效果相同
    // 获取位置信息
    this.getMsiteAddress();
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS', 'SAVE_GEOHASH', //保存位置信息
    ]),
    // 获取当前城市坐标
    getGuessGeolocation() {
      //获取当前城市坐标
      this.$http({
          url: 'http://cangdu.org:8001/v1/cities?type=guess',
          method: 'get'
        })
        .then(res => {
          this.geohash = res.data.latitude + ',' + res.data.longitude;
        })
        .catch(error => {
          // console.log(error)
        });
    },
    // 获取位置信息
    getMsiteAddress() {
      this.$http({
          url: 'http://cangdu.org:8001/v2/pois/' + this.geohash,
          type: 'get'
        })
        .then(res => {
          console.log(res.data)
          this.msiteTitle = res.data.name
          // 记录当前经度纬度
          this.RECORD_ADDRESS({
            latitude:res.data.latitude,
            longitude:res.data.longitude
          });
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  components: {
    headTop
  }
}

</script>
<style lang="scss" scoped>
@import 'src/style/mixin';
.link_search {
  left: .8rem;
  @include wh(.9rem, .9rem);
  @include ct;
}

.msite_title {
  @include center;
  width: 50%;
  color: #fff;
  text-align: center;
  margin-left: -0.5rem;
  .title_text {
    @include sc(0.8rem, #fff);
    text-align: center;
    display: block;
  }
}

.msite_nav {
  padding-top: 2.1rem;
  background-color: #fff;
  border-bottom: 0.025rem solid $bc;
  height: 10.6rem;
  .swiper-container {
    @include wh(100%, auto);
    padding-bottom: 0.6rem;
    .swiper-pagination {
      bottom: 0.2rem;
    }
  }
  .fl_back {
    @include wh(100%, 100%);
  }
}

.food_types_container {
  display: flex;
  flex-wrap: wrap;
  .link_to_food {
    width: 25%;
    padding: 0.3rem 0rem;
    @include fj(center);
    figure {
      img {
        margin-bottom: 0.3rem;
        @include wh(1.8rem, 1.8rem);
      }
      figcaption {
        text-align: center;
        @include sc(0.55rem, #666);
      }
    }
  }
}

.shop_list_container {
  margin-top: .4rem;
  border-top: 0.025rem solid $bc;
  background-color: #fff;
  .shop_header {
    .shop_icon {
      fill: #999;
      margin-left: 0.6rem;
      vertical-align: middle;
      @include wh(0.6rem, 0.6rem);
    }
    .shop_header_title {
      color: #999;
      @include font(0.55rem, 1.6rem);
    }
  }
}

</style>
