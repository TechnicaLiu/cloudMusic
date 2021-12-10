// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    bannerData:[],
    recommandSongs:[],
    topListData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerData = await request('/banner',{type:2});
   
    this.setData({
      bannerData:bannerData.banners
    })

    let recommandData = await request('/personalized',{limit:10});
    console.log(recommandData);
    this.setData({
      recommandSongs:recommandData.result
    })


    
  let index = 0;
  let resultArr=[];
  while(index<5){
    let topListData = await request('/top/list',{idx:index++});
    let topListItem={
      name: topListData.playlist.name,
      tracks: topListData.playlist.tracks.slice(0,3)
    }
    resultArr.push(topListItem);
    // 每次循环都渲染一次，这种做法 不会导致页面长时间 白屏  
    this.setData({
      topListData:resultArr
    })
  }
  },

  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommandSong/recommandSong',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})