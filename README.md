# 微信小程序商城
微信小程序商城，知名奢饰品线上专卖！

## 扫码体验

![](https://github.com/liyuhong-hainan/wechat-app-unicorn/blob/master/images/demo/qrcode.jpg)

## 项目部分截图


![](https://github.com/liyuhong-hainan/wechat-app-unicorn/blob/master/images/demo/index.jpg) -------- ![](https://github.com/liyuhong-hainan/wechat-app-unicorn/blob/master/images/demo/shop.jpg)

<br>  <br>  <br>  

![](https://github.com/liyuhong-hainan/wechat-app-unicorn/blob/master/images/demo/goods.jpg) --------- ![](https://github.com/liyuhong-hainan/wechat-app-unicorn/blob/master/images/demo/buy.jpg)

## 调用微信小程序API

* wx.showModal 小程序模态框

* wx.setStorage wx.getStorage 数据缓存

* onShareAppMessage 分享

* wx.getUserInfo 微信授权获取用户信息接口

* wx.login 微信登录获取code

* getPhoneNumber 获取用户手机号

* wx.navigateToMiniProgram 打开关联小程序

* wx.request 发起网络请求，调取远程数据

* wx.getSystemInfo 获取设备信息

* wx.downloadFile  下载文件资源到本地

* wx.previewImage 预览图片

* wx.navigateTo、redirectTo、switchTab、navigateBack 导航

* wx.chooseAddress 获取微信收获地址

* wx.requestPayment 调起微信支付

## 其他

* 诸葛io 数据埋点

## 提示
 
 一开始在 app.js内调用 wx.getUserInfo 主动触发用户授权弹框，获取用户基本信息
 随着微信小程序的迭代更新，wx.getUserInfo 口有调整，使用该接口将不再出现授权弹窗，请使用 <button open-type="getUserInfo"></button> 所以使用的时候注意一下！



