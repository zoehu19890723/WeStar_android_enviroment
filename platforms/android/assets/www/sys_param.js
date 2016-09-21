var WebUrlPath = {
    'WEB_WESTAR' : 'http://192.168.9.241',//开发环境
    'WEB_WESTAR_SERVICE' : '/sme/ws.php',//开发环境服务
    'WEB_WESTAR_Ali' : 'http://star-test.cdpyun.com',//阿里云环境
    'WEB_WESTAR_PRO' : 'http://star.cdpyun.com',//生产环境
    'WEB_WESTAR_SERVICE_PRO' : '/ws.php',//阿里云环境服务
};

var EXPIRATION_TIME = 30*24*60*60*1000;

//发布系统
//1.修改后端服务 url
//var Star_imgUrl = WebUrlPath.WEB_WESTAR_PRO;
//var Star_envUrl=Star_imgUrl+WebUrlPath.WEB_WESTAR_SERVICE_PRO;
// var Star_imgUrl = WebUrlPath.WEB_WESTAR;
// var Star_envUrl=Star_imgUrl+WebUrlPath.WEB_WESTAR_SERVICE;
 var Star_imgUrl = WebUrlPath.WEB_WESTAR_Ali;
 var Star_envUrl=Star_imgUrl+WebUrlPath.WEB_WESTAR_SERVICE_PRO;

//2.修改app版本 
var Star_appVersion = '1.0.0';

$(function(){
	var userName = localStorage.getItem("userName");
    var passWord = localStorage.getItem("passWord");
    var isFirstUse = localStorage.getItem("isFirstUse");
    var language = localStorage.getItem("language");
    var languageSet = localStorage.getItem("languageSet");

    localStorage.clear();

    localStorage.setItem("userName", userName);
    localStorage.setItem("passWord", passWord);
    localStorage.setItem('isFirstUse',isFirstUse);
    if(language !== undefined || language !== null){
        localStorage.setItem('language',language);
    }
    if(languageSet !== undefined || languageSet !== null){
        localStorage.setItem('languageSet',languageSet);
    }
	initBrowser();
});



