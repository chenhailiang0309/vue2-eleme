<template>
  <div class="city_container">
    <!-- 头部 -->
    <head-top :head-title="cityname" go-back="true">
      <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link>
    </head-top>
    <!-- 搜索部分 -->
    <form v-on:submit.prevent class="city_form">
      <div>
        <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city_input input_style" required v-model="inputValue">
      </div>
      <div>
        <input type="submit" name="submit" class="city_submit input_style" value="提交" @click="postposi">
      </div>
    </form>
    <!-- 搜索历史 标题 -->
    <header v-if="historytitle" class="pois_search_history">搜索历史</header>
    <!-- 地址列表 -->
    <ul class="getpois_ul">
      <li v-for="(item,index) in placelist" :key="index" @click="nextpage(index, item.geohash)">
        <h4 class="pois_name ellipsis">{{item.name}}</h4>
        <p class="pois_address ellipsis">{{item.address}}</p>
      </li>
    </ul>
    <footer v-if="historytitle&&placelist.length" class="clear_all_history" @click="clearAll">清空所有</footer>
    <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
  </div>
</template>
<script>
import headTop from '@/components/header/head'
import { getStore, setStore, removeStore } from '@/config/mUtils'

export default {
  data() {
    return {
      inputValue: '', //搜索地址
      cityid: '', //当前城市id
      cityname: '', //当前城市名称
      placelist: [], // 搜索城市列表
      placeHistory: [], // 历史搜索记录
      historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
      placeNone: false, // 搜索无结果，显示提示信息
    }
  },
  created() {
    this.cityid = this.$route.params.cityid;
    // 获取当前城市名字
    this.$http({
        url: 'http://cangdu.org:8001/v1/cities/' + this.cityid,
        type: 'get'
      })
      .then(res => {
        this.cityname = res.data.name;
      })
      .catch(error => {
        // console.log(error)
      })

    // 初始化搜索记录
    this.initData()
  },
  computed: {},
  methods: {
    initData() {
      // 获取搜索历史记录
      if (getStore('placeHistory')) {
        this.placelist = JSON.parse(getStore('placeHistory'))
      }else{
        this.placelist = []
      }
    },
    // 发送搜索信息
    postposi() {
      if (this.inputValue) {
        this.$http({
            url: 'http://cangdu.org:8001/v1/pois?type=search&city_id=' + this.cityid + '&keyword=' + this.inputValue,
            type: 'get'
          })
          .then(res => {
            this.historytitle = false;
            this.placelist = res.data;
            this.placeNone = res.data.length > 0 ? false : true;
          })
          .catch(error => {
            // console.log(error)
          })
      }
    },
    /**
     * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
     * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
     */
    nextpage(index, geohash) {
      let history = getStore('placeHistory');
      let choosePlace = this.placelist[index];
      if (history) {
        let checkrepeat = false;
        this.placeHistory = JSON.parse(history);
        this.placeHistory.forEach(item => {
          if (item.geohash == geohash) {
            checkrepeat = true;
          }
        })
        if (!checkrepeat) {
          this.placeHistory.push(choosePlace)
        }
      } else {
        this.placeHistory.push(choosePlace)
      }

      setStore('placeHistory', this.placeHistory)
      this.$router.push({ path: '/msite', query: { geohash } })
    },
    // 清空历史记录
    clearAll() {
      removeStore('placeHistory')
      this.initData()
    }
  },
  components: { headTop }
}

</script>
<style lang="scss" scoped>
@import 'src/style/mixin';
.city_container {
  padding-top: 2.35rem;
}

.change_city {
  right: 0.4rem;
  @include sc(0.6rem, #fff);
  @include ct;
}

.city_form {
  background-color: #fff;
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-top: 0.4rem;
  div {
    width: 90%;
    margin: 0 auto;
    text-align: center;
    .input_style {
      border-radius: 0.1rem;
      margin-bottom: 0.4rem;
      @include wh(100%, 1.4rem);
    }
    .city_input {
      border: 1px solid $bc;
      padding: 0 0.3rem;
      @include sc(0.65rem, #333);
    }
    .city_submit {
      background-color: $blue;
      @include sc(0.65rem, #fff);
    }
  }
}

.pois_search_history {
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-left: 0.5rem;
  @include font(0.475rem, 0.8rem);
}

.getpois_ul {
  background-color: #fff;
  border-top: 1px solid $bc;
  li {
    margin: 0 auto;
    padding-top: 0.65rem;
    border-bottom: 1px solid $bc;
    .pois_name {
      margin: 0 auto 0.35rem;
      width: 90%;
      @include sc(0.65rem, #333);
    }
    .pois_address {
      width: 90%;
      margin: 0 auto 0.55rem;
      @include sc(0.45rem, #999);
    }
  }
}

.search_none_place {
  margin: 0 auto;
  @include font(0.65rem, 1.75rem);
  color: #333;
  background-color: #fff;
  text-indent: 0.5rem;
}

.clear_all_history {
  @include sc(0.7rem, #666);
  text-align: center;
  line-height: 2rem;
  background-color: #fff;
}

</style>
