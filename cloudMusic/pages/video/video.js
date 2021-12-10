// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabData:[],
    navId:'',
    videoList:[],
    videoId:'',
    videoUpdateTime:[] ,// 视频播放的时长
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {

    this.getTabData(); // 获取导航标签
   
  },
  toSearchPage(){
    wx.navigateTo({
      url: '/otherPackage/pages/search/search',
    })
  },
  async getTabData(){
    let tabList = await request('/video/group/list');
    let result = tabList.data.slice(0,30);
    console.log(result);
  
    this.setData({
      tabData:result,
      navId:result[0].id
    })
    this.getVideoList(this.data.navId)  // 获取视频数据 
  },

  async getVideoList(navId){
    let videoData = await request('/video/group',{id:navId});
  
    wx.hideLoading();
    this.setData({
      videoList:videoData.datas,
      isTriggered: false 
    })
  },
   changeNav(event){
    let navId = event.currentTarget.id;
    this.setData({
      navId:navId*1,
      videoData:[]
    })
   
    wx.showLoading({
      title: '正在加载中',
    })
   
    this.getVideoList(this.data.navId);
  },

  videoTimeHandle(event){  // 视频播放结束，要从 播放记录中删除 
      let videoTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime};
      let {videoUpdateTime} = this.data;
      let videoItem =  videoUpdateTime.find(item=>item.vid === videoTimeObj.vid );
      if(videoItem){
        videoItem.currentTime= videoTimeObj.currentTime;
      }else{
        videoUpdateTime.push(videoTimeObj);
      }
      this.setData({
        videoUpdateTime
      })
      
  },
  // 点击视频播放 的回调
  /* 
    1. 在点击播放的事件中 需要找到上一个播放的视频
    2. 在播放新的视频之前，把上一个视频暂停 
    关键 1 ：
    第一次点视频 this下没有videoContext 为 false 也就不会执行.stop , 把第一个视频的id 存入 this下的 videoContext  
    第二次 点视频，this.videoContext 为true ，因为存在上一次的视频， 所以可以执行.stop 

 

    
  */
  handleVideo(event){
    let vid = event.currentTarget.id;

     this.setData({
       videoId:vid
     })

     this.videoContext= wx.createVideoContext(vid); // 视频实例化
     let { videoUpdateTime } = this.data;
     let videoItem = videoUpdateTime.find(item=>item.vid === vid);
     if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
     }
     //this.videoContext.play();// 点击视频后，自动播放 `

  },
  handleVideoEnd(event){
    let videoEndId = event.currentTarget.id;
    let { videoUpdateTime } = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid === videoEndId),1);
    this.setData({
      videoUpdateTime
    })
  },
  // 自定义下拉刷新  
  handleRefresh(){
    this.getVideoList(this.data.navId);
    
  },
  // 触底 加载更多 
  handleToLower(){

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
  onShareAppMessage: function (from) {
   /*    if(from === 'button'){
        return{
          title:'',
          page:'',
          imageUrl:''
        }
      }else{
        return{
          title:'',
          page:'',
          imageUrl:''
        }
      } */
  }
})