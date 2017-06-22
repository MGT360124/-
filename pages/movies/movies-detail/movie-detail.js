// pages/movies/movies-detail/movie-detail.js
var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    movie: {},
  },
  onLoad: function (options) {
    var movieDetailId = options.movieDetailId;
    var movieDetailUrl = app.globalData.doubanBase + "/v2/movie/subject/" + movieDetailId;
    util.http(movieDetailUrl, this.processdouBanData);
  },
  //回调函数,处理豆瓣数据，request请求来的数据
  processdouBanData: function (douBanData) {
    if (!douBanData) {
      return;
    };

    //console.log(douBanData);
    var director = {
      avatar: {},
      id: '',
      name: "",
    };
    if (douBanData.directors[0] != null) {
      if (douBanData.directors[0].avatars != null) {
        director.avatar = douBanData.directors[0].avatars.large;
      };
      director.id = douBanData.directors[0].id;
      director.name = douBanData.directors[0].name;
    }
    var movie = {
      movieImg: douBanData.images ? douBanData.images.large : "",//这是三元表达式
      countries: douBanData.countries[0],
      title: douBanData.title,
      original_title: douBanData.original_title,
      wish_count: douBanData.wish_count,
      year: douBanData.year,
      summary: douBanData.summary,
      comments_count: douBanData.comments_count,
      geners: douBanData.genres.join("、"),//join函数用于返回一个字符串，此字符串由包含在数组中的许多子字符串联接创建
      stars: util.convertTostarsArray(douBanData.rating.stars),
      score: douBanData.rating.average,
      director: director,
      casts: util.convertToCastString(douBanData.casts),
      castsInfo: util.convertToCastInfos(douBanData.casts),
    };
    // console.log(movie);
    this.setData({
      movie: movie,
    })
  },
  //查看海报图片，把图片放大的事件
  viewMoviePostImg: function (event) {
   // console.log(event);
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,//当前显示的图片http链接
      urls: [src],//需要预览的图片的http链接列表
    })
  },
  viewMovieCastImg:function(event){
    //console.log(event);
    var src=event.currentTarget.dataset.imgsrc;
    wx.previewImage({
      // current: 'src', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src],
      success: function(res){},
    })
  },
})