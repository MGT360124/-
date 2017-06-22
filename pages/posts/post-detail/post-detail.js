var postdata = require('../../../datas/posts-local-database.js');
var app = getApp();
Page({
  data: {
    isplayingmusic: false,
  },
  //页面加载事件
  onLoad: function (option) {
    //console.log(option);
    var postid = option.id;
    this.setData({
      currentpostid: postid
    });
    var postData = postdata.postlist[postid];
    this.setData({
      postdetailData: postData
    });
    var postscollected = wx.getStorageSync('Posts_Collected')
    if (postscollected) {
      var postcollected = postscollected[postid]
      this.setData({
        collected: postcollected,
      })
    }
    else {
      var postscollected = {};
      postscollected[postid] = false;
      wx.setStorageSync('Posts_Collected', postscollected)
    }
    if (app.globalData.g_isplayingmusic && app.globalData.g_currentmusicpostid === this.data.currentpostid) {
      this.setData({
        isplayingmusic: true,
      })
    }
    this.onmusicmonitor();
  },
  //点击图标和总控开关，都会触发这个函数
  onmusicmonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(
      function (event) {
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];
        if (currentPage.data.currentpostid == that.data.currentpostid) {
           // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到
                // 当前页面的postid，只处理当前页面的音乐播放。
          if (app.globalData.g_currentmusicpostid == that.data.currentpostid) {
            that.setData({
              isplayingmusic: true,
            })
          }
        }
        app.globalData.g_isplayingmusic = true;
        app.globalData.g_currentmusicpostid = that.data.currentpostid;
      }
    );
    //监听背景音乐暂停
    wx.onBackgroundAudioPause(
      function () {
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];
        if (currentPage.data.currentpostid == that.data.currentpostid) {
          if (app.globalData.g_currentmusicpostid == that.data.currentpostid) {
            that.setData({
              isplayingmusic: false,
            })
          }
        }
        app.globalData.g_isplayingmusic = false;
        //app.globalData.g_currentmusicpostid = null;
      }
    )
    //监听背景音乐停止
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isplayingmusic: false
      })
      app.globalData.g_isplayingmusic = false;
      app.globalData.g_currentmusicpostid = null;
    })
  },
  //点击音乐图标事件
  onmusictap: function (event) {
    var currentpostid = this.data.currentpostid;
    var ispPayingMusic = this.data.isplayingmusic;
    if (ispPayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isplayingmusic: false,
      })
      app.globalData.g_isplayingmusic = false;
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: postdata.postlist[currentpostid].music.dataUrl,
        title: postdata.postlist[currentpostid].music.title,
        coverImgUrl: postdata.postlist[currentpostid].music.cover,
      })
      this.setData({
        isplayingmusic: true,
      })
      app.globalData.g_isplayingmusicpostid = this.data.currentpostid;
      app.globalData.g_isplayingmusic = true;
    }
  },
  //点击收藏事件
  oncollectiontap: function (event) {
    this.getpostscollectedSync();
  },
  //异步事件
  getpostscollectedAsync: function (event) {
    var that = this;
    wx.getStorage({
      key: 'Posts_Collected',
      success: function (res) {
        var postscollected = res.data;
        var postcollected = postscollected[that.data.currentpostid];
        postcollected = !postcollected;
        postscollected[that.data.currentpostid] = postcollected;
        that.showToast(postscollected, postcollected)
      },
    })
  },
  //同步事件
  getpostscollectedSync: function (event) {
    var postscollected = wx.getStorageSync('Posts_Collected')
    var postcollected = postscollected[this.data.currentpostid];
    postcollected = !postcollected;
    postscollected[this.data.currentpostid] = postcollected;
    this.showToast(postscollected, postcollected)
  },
  showToast: function (postscollected, postcollected) {
    wx.setStorageSync('Posts_Collected', postscollected);
    this.setData({
      collected: postcollected
    })
    wx.showToast({
      title: postcollected ? "收藏成功" : "取消收藏",
      icon: "success",
      duration: 1000,
    })
  },
  //分享事件
  onsharetap: function (event) {
    var shareList = [
      "分享到微信朋友圈",
      "分享到微信好友",
      "分享到QQ空间",
      "分享到QQ好友",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: shareList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: "用户" + shareList[res.tapIndex],
          content: "是否点击了取消？" + res.cancel + "小程序现在还无法实现分享功能",
        })
      }
    })
  },
   //右上角的分享事件
onShareAppMessage:function(event){
return{
  title:"分享到微信群",
  desc:"经典散文",
  path:"/pages/posts/post-detail/post-detail",
}
}
 
})
