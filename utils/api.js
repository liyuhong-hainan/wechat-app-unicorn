import Modal from 'modal.js';
 var API_HOST = "your api url";
function wxRequest(action, params, successFun, errorFun) {
  var userInfo = wx.getStorageSync('userInfo');
  var token = userInfo.token;
  // console.log('api ' + action, 'prams is:' + JSON.stringify(params));
  // Modal.showModal('api ' + action, 'prams is:' + JSON.stringify(params));
  // Modal.showModal('api ' + action, 'token is:' + token);
  wx.request({
    url: API_HOST + action,
    method: 'POST',
    data: params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Ports-Token": token
    },
    success: function (res) {
        // console.log(JSON.stringify(res.data));
      successFun(res.data);
    },
    fail: function (error) {
      console.log(error);
      //Modal.showModal('api ' + action, '请求失败:' + JSON.stringify(error));
    }
  })
}
/**
 * 微信登录
 */
function wxLogin(params, successFun, errorFun) {
  wxRequest('user/onLogin', params, successFun, errorFun);
}

/**
 * 用户注册
 */
function userRegister(params, successFun, errorFun) {
  wxRequest('user/register', params, successFun, errorFun);
}
/**
 * 获取用户信息
 */
function userInfo(params, successFun, errorFun) {
  wxRequest('user/info', params, successFun, errorFun);
}
/**
 * 绑定手机号
 */
function bindMobile(params, successFun, errorFun) {
  wxRequest('user/bindMobile', params, successFun, errorFun);
}
/**
 * 绑定邀请人
 */
function bindInviterId(params, successFun, errorFun) {
  wxRequest('user/bindInviterId', params, successFun, errorFun);
}
/**
 * 积分明细
 */
function userAmountList(params, successFun, errorFun) {
  wxRequest('user/amountList', params, successFun, errorFun);
}

/**
 * 积分比例
 */
function userPoints(params, successFun, errorFun) {
  wxRequest('user/points', params, successFun, errorFun);
}
/**
 *收货地址列表
 */
function addressList(params, successFun, errorFun) {
  wxRequest('address/list', params, successFun, errorFun);
}
/**
 * 添加收货地址
 */
function addAddress(params, successFun, errorFun) {
  wxRequest('address/add', params, successFun, errorFun);
}
/**
 * 收货地址详情
 */
function addressInfo(params, successFun, errorFun) {
  wxRequest('address/info', params, successFun, errorFun);
}
/**
 * 修改收货地址
 */
function updateAddress(params, successFun, errorFun) {
  wxRequest('address/update', params, successFun, errorFun);
}
/**
 * 删除收货地址
 */
function deleteAddress(params, successFun, errorFun) {
  wxRequest('address/delete', params, successFun, errorFun);
}
/**
 * 小程序码
 */
function userWxcode(params, successFun, errorFun) {
  wxRequest('user/wxCode', params, successFun, errorFun);
}
/**
 * 品牌代理人兑换
 */
function userExchange(params, successFun, errorFun) {
  wxRequest('user/exchange', params, successFun, errorFun);
}
/**
 * 品类列表
 */
function productShop(params, successFun, errorFun) {
  wxRequest('product/shop', params, successFun, errorFun);
}
/**
 * 商品列表
 */
function productList(params, successFun, errorFun) {
  wxRequest('product/list', params, successFun, errorFun);
}
/**
 * 商品详情
 */
function productInfo(params, successFun, errorFun) {
  wxRequest('product/info', params, successFun, errorFun);
}
/**
 * 订单列表
 */
function orderList(params, successFun, errorFun) {
  wxRequest('order/list', params, successFun, errorFun);
}
/**
 * 订单详情
 */
function orderInfo(params, successFun, errorFun) {
  wxRequest('order/info', params, successFun, errorFun);
}
/**
 * 完成订单
 */
function orderComplete(params, successFun, errorFun) {
  wxRequest('order/complete', params, successFun, errorFun);
}
/**
 * 快递
 */
function orderExpress(params, successFun, errorFun) {
  wxRequest('order/express', params, successFun, errorFun);
}
/**
 * 预支付
 */
function orderPrePay(params, successFun, errorFun) {
  wxRequest('order/prePay', params, successFun, errorFun);
}
/**
 * 支付
 */
function orderPay(params, successFun, errorFun) {
  wxRequest('order/pay', params, successFun, errorFun);
}
/**
 * 预充值
 */
function preRecharge(params, successFun, errorFun) {
  wxRequest('/user/preRecharge', params, successFun, errorFun);
}
/**
 * 优惠券是否领取查询
 */
function couponInfo(params, successFun, errorFun) {
  wxRequest('coupon/info', params, successFun, errorFun);
}
/**
 * 优惠券是否领取查询
 */
function userCouponList(params, successFun, errorFun) {
  wxRequest('coupon/list', params, successFun, errorFun);
}
/**
 * 搜索热词
 */
function hotWords(params, successFun, errorFun) {
  wxRequest('product/hot/words', params, successFun, errorFun);
}
/**
 * 搜索
 */
function productSearch(params, successFun, errorFun) {
  wxRequest('product/search', params, successFun, errorFun);
}
module.exports = {
  wxLogin: wxLogin,
  userRegister: userRegister,
  userInfo: userInfo,
  bindMobile: bindMobile,
  bindInviterId: bindInviterId,
  userAmountList: userAmountList,
  userPoints: userPoints,
  addressList: addressList,
  addressInfo: addressInfo,
  addAddress: addAddress,
  updateAddress: updateAddress,
  deleteAddress: deleteAddress,
  userWxcode: userWxcode,
  userExchange: userExchange,
  productShop: productShop,
  productList: productList,
  productInfo: productInfo,
  orderList: orderList,
  orderInfo: orderInfo,
  orderComplete: orderComplete,
  orderExpress: orderExpress,
  orderPrePay: orderPrePay,
  orderPay: orderPay,
  preRecharge: preRecharge,
  couponInfo: couponInfo,
  userCouponList: userCouponList,
  hotWords: hotWords,
  productSearch: productSearch
}

