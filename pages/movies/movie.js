// pages/movies/movie.js
var util=require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    inTheaters: {},//因为最后面的this.setData(data)中的data是一个对象，里面的属性settedKey（inTheaters，comingSoon， Top250）也是一个对象
    comingSoon: {},//所以要为其在data{}定义，如果是一个Title：columnTitle这样的就不用在此定义
    Top250: {},
    containerShow:true,//搜索页面的切换
    searchContainerShow:false,//搜索页面的切换
    text:"",//input里的文本
    searchResult:{},
  },
  onLoad: function (options) {
    var that=this;
    var inTheaterUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var Top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovielistData(inTheaterUrl, "正在热映", "inTheaters");//调用getMvieListData函数执行,inTheaters正在上映的数据
    this.getMovielistData(comingSoonUrl, "即将上映", "comingSoon");//调用getMovieListData函数执行，comingSoon即将上映
    this.getMovielistData(Top250Url, "Top250", "Top250");//调用getMovielistData函数执行，Top250
    util.http(inTheaterUrl,that.processdoubanData,"inTheaters");
  },

  getMovielistData: function (Url, title, settedKey) {
    var that = this;
    wx.request({
      url: Url,
      data: {},//提交数据
      method: 'GET',
      header: {
        "Content-Type": "json"
      }, // 设置请求的 header
      success: function (res) {
        //console.log(res);//res是object对象，里面包括data对象
        //console.log(res.data,title,settedKey)
        that.processdoubanData(res.data, title, settedKey);
      },
      fail: function () {
        console.log("调用失败了，断网了，或者链接超时了会执行fail函数")

      },
      complete: function (res) {
        // that.processdoubanData(res.data);
      }
    })
  },
  //这里是回调函数，处理request请求来的数据，
  processdoubanData: function (doubanData, columnTitle, settedKey) {
    var movies = [];//作为处理完记录数据的容器
    for (var idx in doubanData.subjects) {
      var subject = doubanData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";//substring返回值为前六个字，如果title的的长度大于6则后面的用用...表示
      };
      var temp = {
        stars:util.convertTostarsArray(subject.rating.stars),//[1,1,1,1,1],[1,1,1,0,0]
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      };
      movies.push(temp);//push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。返回值为把指定的值添加到数组后的新长度
    };
    var readyData = {
      Title: columnTitle,
      movies: movies,
    };
    var data = {};
    data[settedKey] = readyData;//对data的settedKey属性赋值，readyData也是一个对象，settedKey是 inTheaters，comingSoon， Top250
    this.setData(
      data//data 是一个对象，里面属性settedKey（inTheaters，comingSoon， Top250）也是一个对象，里面包含Title，和movies
    );
  },
  //实现收索的时候页面切换事件
   onBindFocus:function(event){
     this.setData({
       containerShow:false,
       searchContainerShow:true,
     })
   },
   //实现取消收索的时候页面切换
   onCancelTap:function(event){
   this.setData({
       containerShow:true,
       searchContainerShow:false,
        //searchResult:{},
       text:"",
     })
   },
   //搜索页面失去焦点时执行
   onBindBlur:function(event){
  var text=event.detail.value;
 var searchUrl=app.globalData.doubanBase +"/v2/movie/search?q="+text;
  this.getMovielistData(searchUrl, "","searchResult");
   this.setData({
    text:text,
  })
   },
   //页面跳转到更多页面
   moreMoviesTap:function(event){
     //console.log(event);
     var moviesId=event.currentTarget.dataset.moviesid;
     //console.log(moviesId);
     wx.navigateTo({
       url:"/pages/movies/more-movies/more-movies?moviesId="+moviesId//这里不用去（.扩展名名），加如果是相对路径的话话，就相对于当前路径，找目标路径more-movies/more-movies
     })
   },
   //页面跳转到电影详情页面
   onMovieDetail:function(event){
    var movieDetailId=event.currentTarget.dataset.moviedetailid;
     wx.navigateTo({
       url:"movies-detail/movie-detail?movieDetailId="+movieDetailId,
     })
   },
   
})