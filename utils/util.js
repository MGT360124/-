//公共的方法
function convertTostarsArray(stars) {
    var num = stars.toString().substring(0, 1);//tostring函数是将当前对象以字符串形式返回，substring函数用于返回当前字符串的连续片段
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    };
    return array;
};
function douban_limit() {
    var timestamp = Date.parse(new Date());
    var requestDoubanTime = wx.getStorageSync('requestDoubanTime');
    var requestDoubanNum = wx.getStorageSync('requestDoubanNum');
    if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
        wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1);
        if (requestDoubanNum < 35) {
            //Lower than 35/m,pass            
            return;
        }
        else {
            wx.showToast({
                title: '豆瓣api请求频率超35/m，小心',
                icon: 'loading',
                duration: 5000
            })
            //提示或者去别的地方
            // wx.redirectTo({
            //      url:"pages/welcome/welcome"
            // });
        }
    }
    else {
        wx.setStorageSync('requestDoubanTime', timestamp);
        wx.setStorageSync('requestDoubanNum', 1);
    }
};
function http(Url, callBack, settedkey = "") {
    douban_limit();
    wx.request({
        url: Url,
        data: {},//提交数据
        method: 'GET',
        header: {
            "Content-Type": "json"
        }, // 设置请求的 header
        success: function (res) {
            callBack(res.data, settedkey);
        },
        fail: function () {
        },
    })
};
function convertToCastString(event) {
    var castsjoin = "";
    for (var index in event) {
        castsjoin = castsjoin + event[index].name + "/";
    }
    castsjoin = castsjoin.substring(0, castsjoin.length - 1);
    return castsjoin;
};
function convertToCastInfos(event) {
    var castsArray = [];
    for (var index in event) {
        var cast = {
            img: event[index].avatars ? event[index].avatars.large : '',
            name: event[index].name,
        };
        castsArray.push(cast);
    };
    return castsArray;
};
module.exports = {
    convertToCastInfos: convertToCastInfos,
    convertToCastString: convertToCastString,
    convertTostarsArray: convertTostarsArray,
    http: http,
}