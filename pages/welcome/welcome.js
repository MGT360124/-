Page({
  tap: function (event) {
    //console.log("ontap");//函数代码写完要加双引号，还有wxss里加双引号，其他的地方加单引号
    //微信中最多只有五代元素（五个上下级的关系）
    // wx.navigateTo({
    //   url:"../posts/post",
    // }
    //  );//和welcome是父子（上下级）页面关系，如果执行wx.navigateTo()方法的话，welcome是被隐藏的hide
    //navigate导航wx.navigateTo();这是一个页面跳转方法他可以跳转到他的子元素中，然后又可以返回到他本身，里面的参数是一个路径，这里是相对路径
    wx.switchTab({
      url: '../posts/post',//和welcome是平行页面，如果执行wx.redirectTo()方法的话，welcome是被卸载的Unload
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
})