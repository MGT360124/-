var postdata = require('../../datas/posts-local-database.js');//请求datas中的数据，这里只能用相对路径//postdata是一个对象object是{key:value}
Page({
  data: {
    array: [
      {
        date: "2016 12 4",
        title: "经典散文",
      },

    ],
    //this.setData()函数调用 post_key[数组]，就是other_data数组
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数,监听页面加载,最先执行
    // console.log("onload");
    this.setData({
      postlist : postdata.postlist
      });//postdata.postlist这是一个数组array[3],里面还有三个{}对象，就是posts-local-database.js中的posts_local_database数组中的三个对象
    // this.setData({ post_key:postdata.postlist });
  },
  onposttap: function (event) {//event是默认的一个参数，事件对象
    var postid = event.currentTarget.dataset.postid;//currentTarget是当前鼠标点击的对象（即鼠标点击的组件,冒泡事件点击的组件）， dataset是所有自定义的属性集合 
    wx.navigateTo({//文章列表中的postid，即当前点击的文章的postid，传入文章的详情页面中。
      //因为只有post-detail知道postid,他才知道需要加载哪一篇文章的内容
      url: "post-detail/post-detail?id=" + postid,
      //id可以自己定义
    });
    // console.log("现在点击的是那个id"+postid);
  },
  onSwiperTap: function (event) {
   // console.log(event);
    var postid = event.target.dataset.postid;//target是当前鼠标点击的对象（即鼠标点击的组件）， dataset是所有自定义的属性集合 
    wx.navigateTo({//文章列表中的postid，即当前点击的文章的postid，传入文章的详情页面中。
      //因为只有post-detail知道postid,他才知道需要加载哪一篇文章的内容
      url: "post-detail/post-detail?id=" + postid,
      //id可以自己定义
    });
  }

})