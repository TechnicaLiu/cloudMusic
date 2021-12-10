// pages/songDetail/songDetail.js

import request from '../../../utils/request';
import PubSub from 'pubsub-js'
import moment from 'moment'



const appInstance = getApp();
console.log(appInstance.globalData);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    song: {},//歌曲详情对象
    isPlay: false,//标识播放状态
    currentTime: '00:00',//当前时长
    durationTime:'00:00',//总时长
    currentWidth: 0,//实时进度条宽度,
    musicId:'' , // 音乐ID,
    musicLink:'',  // 音乐链接 缓存 
    currentLyric:'', // 当前歌词对象
    lyric:[], // 歌词 
    lyricTime: 0
  },
  onLoad: function (options) {
    let songId = options.id;
    this.setData({
      musicId:songId
    })
    this.getSongDetail(songId);
    this.getSongLyric(songId);

    if(appInstance.globalData.isMusicPlay &&appInstance.globalData.musicId === songId ){
        this.setData({
          isPlay:true
        })
    }




    // 创建控制音乐播放器实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager(); 
    // 监听音乐播放器播放/暂停 
    this.backgroundAudioManager.onPlay(()=>{
        // 修改音乐播放的状态
        this.setData({
          isPlay:true
        })
        // 修改全局音乐播放的状态 
        appInstance.globalData.isMusicPlay=true;
        appInstance.globalData.musicId=songId;
    })
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay=false;
    })
    this.backgroundAudioManager.onStop(()=>{
      this.setData({
        isPlay:false
      })
      appInstance.globalData.isMusicPlay=false;
    })
    // 实时进度条
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let lyricTime = Math.ceil(this.backgroundAudioManager.currentTime); 
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
    
      let currentWidth =(this.backgroundAudioManager.currentTime * 450) / this.backgroundAudioManager.duration ;
      this.setData({
        lyricTime ,
        currentTime,
        currentWidth
      })
      this.getCurrentLyric();
    })
    // 音乐播放结束后，自动切换下一首 
    this.backgroundAudioManager.onEnded(()=>{
      PubSub.publish('switchType','next');
      this.setData({
        currentWidth:0,
        currentTime: '00:00',
        lyric: 0,
        lyricTime: 0,
      })
    })
  },
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    let {musicId,musicLink} =this.data;
    this.musicControl(isPlay,musicId,musicLink);
  },
  async musicControl(isPlay,musicId,musicLink){
    if(isPlay){ // 音乐的播放  
      if(!musicLink){
         // 获取歌曲的播放连接 
      let songData = await request('/song/url',{id:musicId})
      musicLink = songData.data[0].url;
      this.setData({
        musicLink
      })
     }
      // 创建控制音乐播放的实例对象 
      this.backgroundAudioManager.src= musicLink;
      this.backgroundAudioManager.title=this.data.song.name;
     
    }else{     // 音乐的暂停 
      this.backgroundAudioManager.pause();
    }
  },

  async getSongDetail(id){
    let songInfo = await request('/song/detail',{ids:id})
    console.log(songInfo);
    let durationTime = moment(songInfo.songs[0].dt).format('mm:ss');
    this.setData({
      song:songInfo.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name ,
    })
  },
  
  clickNeedle(){
    this.handleMusicPlay()
  },

  // 歌曲切换 
  handleSwitch(event){
   let type = event.currentTarget.id;
   // 关闭当前播放的音乐
   this.backgroundAudioManager.pause();
   PubSub.subscribe('musicId',(msg,musicId)=>{
     console.log(musicId);
     // 获取歌曲信息 
     this.getSongDetail(musicId);
     // 自动播放
     this.musicControl(true,musicId)
     // 取消订阅 
     PubSub.unsubscribe('musicId');
   })
   PubSub.publish('switchType',type)
  },

  // 实时播放歌词 

  async getSongLyric(id){
    let lyricData  = await request('/lyric',{id:id});
    let lyric = this.formatLyric(lyricData.lrc.lyric);
  },
  formatLyric(text) {
    let result = [];
    let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
    let row = arr.length; //获取歌词行数
    for (let i = 0; i < row; i++) {
      let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
      let temp_arr = temp_row.split("]");//我们可以通过“]”对时间和文本进行分离
      let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
      //再对剩下的歌词时间进行处理
      temp_arr.forEach(element => {
        let obj = {};
        let time_arr = element.substr(1, element.length - 1).split(":");//先把多余的“[”去掉，再分离出分、秒
        let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
        obj.time = s;
        obj.text = text;
        result.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
      });
    }
    result.sort(this.sortRule) //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
    this.setData({
      lyric: result
    })
  },
  sortRule(a, b) { //设置一下排序规则
    return a.time - b.time;
  },

  getCurrentLyric(){
    let j;
    for(j=0; j<this.data.lyric.length-1; j++){
      if(this.data.lyricTime == this.data.lyric[j].time){
        this.setData({
          currentLyric : this.data.lyric[j].text
        })
      }
    }
  },




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