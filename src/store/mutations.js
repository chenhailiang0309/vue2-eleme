import {
  RECORD_ADDRESS,
  ADD_CART,
  REDUCE_CART,
  INIT_BUYCART,
  CLEAR_CART,
  RECORD_SHOPDETAIL,
  RECORD_USERINFO,
  GET_USERINFO,
  CONFIRM_REMARK,
  CONFIRM_INVOICE,
  CHOOSE_SEARCH_ADDRESS,
  SAVE_GEOHASH,
  CONFIRM_ADDRESS,
  CHOOSE_ADDRESS,
  NEED_VALIDATION,
  SAVE_CART_ID_SIG,
  SAVE_ORDER_PARAM,
  CHANGE_ORDER_PARAM,
  ORDER_SUCCESS,
  SAVE_SHOPID,
  SAVE_ORDER,
  OUT_LOGIN,
  RETSET_NAME,
  SAVE_AVANDER,
  SAVE_ADDRESS,
  SAVE_ADDDETAIL,
  SAVE_QUESTION,
  ADD_ADDRESS,
  BUY_CART,
} from './mutation-types.js'

import { setStore, getStore } from '../config/mUtils.js'

export default {
  //保存geohash
  [SAVE_GEOHASH](state, geohash) {
    state.geohash = geohash;
  },
  //记录当前经度纬度
  [RECORD_ADDRESS](state, {
    latitude,
    longitude
  }) {
    state.latitude = latitude;
    state.longitude = longitude;
  },
  // 加入购物车
  [ADD_CART](state, {
    shopid,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
    packing_fee,
    sku_id,
    stock
  }) {
    let cart = state.cartList;
    let shop = cart[shopid] = (cart[shopid] || {});
    let category = shop[category_id] = (shop[category_id] || {});
    let item = category[item_id] = (category[item_id] || {});
    if (item[food_id]) {
      item[food_id]['num']++
    } else {
      item[food_id] = {
        "num": 1,
        "id": food_id,
        "name": name,
        "price": price,
        "specs": specs,
        "packing_fee": packing_fee,
        "sku_id": sku_id,
        "stock": stock
      }
    }
    // ...属于拓展运算符，用于对象或者数组的析构
    // let a = [1,2,3];
    // let b = [0, ...a, 4]; // [0,1,2,3,4]
    state.cartList = { ...cart } // 展开运算符
    // 存入localSrotage
    setStore('buyCart', state.cartList)
  },
  // 移除购物车
}
