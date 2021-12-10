// pages/search/search.js
import request from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContent:'', // 搜索框内容 
    placeholderContent:'', // 搜索好音乐 
    searchList:[], // 搜索结果
    historyList:[],  // 历史搜索  
    hotList:[] // 热搜榜  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
  },
   async getInitData(){
    let placeholderContentData = await request('/search/default');
    let hostListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderContentData.data.showKeyword,
      hotList: hostListData.data
    })
  },

  handleInputChange(event){
     this.setData({
       searchContent:event.detail.value.trim()
     })
     this.getSearchListData();
  },
  async getSearchListData(){
    if(!this.data.searchContent){
      this.setData({
        searchList: []
      })
      return;
    }
    let {searchContent, historyList} = this.data;
    let searchListData = await request('/search', {keywords: searchContent, limit: 10});
    this.setData({
      searchList: searchListData.result.songs    
    })
    if(historyList.indexOf(searchContent) !== -1 ){
      historyList.splice(historyList.indexOf(searchContent),1);
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },
  handleClear(){
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  handleCancel(){
    wx.showModal({
      content: '确认清空记录嘛？',
      success:(res)=>{
        if(res.confirm){
          this.setData({
            historyList:[]
          })
          wx.removeStorageSync('searchHistory');
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  searchHotSong(event){
    
     this.setData({
       searchContent:event.currentTarget.dataset.hotwords
     })
     this.getSearchListData();

  },
  toSongDetail(event){
    let songId =event.currentTarget.id;
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?id='+songId,
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