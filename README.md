# cloudMusic

#### 介绍

基于网易云音乐真实接口开发的音乐小程序

#### 软件架构

Nodejs作为后端，跨站请求伪造 (CSRF), 伪造请求头 , 调用官方 API

[网易云音乐NodeJS版API](https://binaryify.github.io/NeteaseCloudMusicApi/#/)


使用ES6语法

使用promise对象进行异步请求资源

使用moment.js进行时间日期处理

使用pubsub.js消息的发布订阅，进行组件间数据的传递

使用 `subpackages` 进行了项目pages 分包，以满足小程序单包不超过2MB的要求

实现了歌曲的歌词实时滚动

#### 使用方法

1. 打开music_server文件，安装依赖（npm install ) 终端输入 node app.js 开启服务器
2. 将 cloudMusic 导入到 微信小程序 即可运行  

#### 注意事项

1.  首先要安装有nodejs
2.  然后安装有[微信小程序开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
3.  使用详情可参考微信官网给出的[起步](https://developers.weixin.qq.com/miniprogram/dev/framework/)
4.  导入项目以后记得在本地配置中勾选
    - ES6 转 ES5
    - 增强编译
    - **使用npm模块**
    - **不校验合法域名**、web-view(业务域名)、TLS版本以及 HTTPS 证书
    - ![config](https://gitee.com/youngstory/images/raw/master/img/202112101357136.png "config.png")

#### 项目截图

##### 首页

![image-20211210140213759](https://gitee.com/youngstory/images/raw/master/img/202112101402928.png)

##### 视频页面

![image-20211210140252869](https://gitee.com/youngstory/images/raw/master/img/202112101402007.png)

##### 用户页面

![image-20211210140309208](https://gitee.com/youngstory/images/raw/master/img/202112101403326.png)

##### 歌曲推荐页面

![image-20211210140331173](https://gitee.com/youngstory/images/raw/master/img/202112101403346.png)



##### 音乐播放页面

![image-20211210140354522](https://gitee.com/youngstory/images/raw/master/img/202112101403629.png)

##### 登录注册页面

由于采用的是网易云真实的API 接口，所以可以登录自己的网易云账号  

![image-20211210140418235](https://gitee.com/youngstory/images/raw/master/img/202112101404307.png)

#### 最后

此项目适合刚入门微信小程序的新手使用 ！ 好用的话记得Star  😊