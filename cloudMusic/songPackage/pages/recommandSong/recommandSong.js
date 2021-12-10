// pages/recommandSong/recommandSong.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    month:'12',
    day:'7',
    recommandSongs:[], // 每日推荐
    index:0 // 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userIinfo = wx.getStorageSync('userInfo');
    if(!userIinfo){
      wx.showToast({
        title: '请先进行登录',
        icon: 'none',
        success: ()=>{
          //跳转至登录界面
          wx.reLaunch({
            url: '/otherPackage/pages/login/login',
          })
        }
      })
    }
    let nowTime = new Date();
    //更新日期
    this.setData({
      day: nowTime.getDate(),
      month: nowTime.getMonth() + 1,
    })

    this.getRecommandSongs();

    // 订阅 来自 songDeatil 页面发布的消息  
    PubSub.subscribe('switchType',(msg,type)=>{
      let {recommandSongs,index} = this.data;
      if(type === 'pre'){  // 上一首
       
         (index === 0) && (index = recommandSongs.length);
        
          index-=1;
      }else{   //下一首
        (index===recommandSongs.length-1) && (index=-1)
        index+=1;
      }
      this.setData({
        index
      })
      let musicId = recommandSongs[index].id;
      PubSub.publish('musicId',musicId)
    })

  },
  async getRecommandSongs(){
    let result = await request('/recommend/songs');
    this.setData({
      recommandSongs: result.recommend
    })
  },
  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?id='+song.id,
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