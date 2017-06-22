// pages/movies/more-movies/more-movies.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    movies: {},
    navigateBarTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,//movies是空与否的判断
  },
  onLoad: function (options) {
    var movieId = options.moviesId;
    this.setData({
      navigateBarTitle: movieId,
    });
    var movieDataUrl = "";
    switch (movieId) {
      case "正在热映": movieDataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
        break;
      case "即将上映": movieDataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
        break;
      case "Top250": movieDataUrl = app.globalData.doubanBase + "/v2/movie/top250"
        break;
    }
    util.http(movieDataUrl, this.processdoubanData)
    this.setData({
      requestUrl: movieDataUrl,
    })
  },
  //实现上滑加载更多，此时必须在wxml里设置height高度
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    wx.showNavigationBarLoading();
    util.http(nextUrl, this.processdoubanData)
  },
  //处理request请求来的数据，这里默认的是20个电影的数据
  processdoubanData: function (doubanData) {
    //console.log(doubanData);
    var movies = [];//作为处理完记录数据的容器
    for (var idx in doubanData.subjects) {
      var subject = doubanData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";//substring返回值为前六个字，如果title的的长度大于6则后面的用用...表示
      };
      var temp = {
        stars: util.convertTostarsArray(subject.rating.stars),//[1,1,1,1,1],[1,1,1,0,0]
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      };
      movies.push(temp);//push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。返回值为把指定的值添加到数组后的新长度
    };
    //实现新加载的数据，和旧有的数据合并在一起
    var totalMovies = {};
    if (!this.data.isEmpty) {//若movies不为空的话话，就在movies后面加上movies新加载的元素
      totalMovies = this.data.movies.concat(movies)//concat方法是将括号中的数组movies的元素，添加到原数组对象this.data.movies中去
    }
    else {//若为空的话，就加载默认的20条数据
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies//data 是一个对象，里面属性settedKey（inTheaters，comingSoon， Top250）也是一个对象，里面包含Title，和movies
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.data.totalCount += 20;//这个要重点理解。不太明白。
  },
  //动态设置导航栏的标题
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateBarTitle,
      success: function (res) {
        // success
      }
    })
  },
  //下拉刷新事件
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start="+ this.data.totalCount+"&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount=0;
    wx.showNavigationBarLoading();
    util.http(refreshUrl, this.processdoubanData)
  },
    //页面跳转到电影详情页面
   onMovieDetail:function(event){
    var movieDetailId=event.currentTarget.dataset.moviedetailid;
     wx.navigateTo({
       url:"../movies-detail/movie-detail?movieDetailId="+movieDetailId,
     })
   },

})