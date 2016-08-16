define(["app"], function(app) {
    var bindings = [{
        element: '.wx-item',
        event: 'click',
        handler: openNewPage
    }, {
        element: '#updateButton',
        event: 'click',
        handler: updateVersion
    }, {
        element: '#changeLan',
        event: 'click',
        handler: openLanguageOption
    }, {
        element: '.my-setting',
        event: 'click',
        handler: backToPrevious
    }];

    function init() {
        var renderObject = {
            selector: $('.setting'),
            hbsUrl: "js/ee_self/setting/setting",
            model: {},
            bindings: bindings,
            beforeRender: weixin_hideBackButton,

        }
        viewRender(renderObject);
    }

    function openLanguageOption() {
        var languages = [{
            'name': 'zh_cn',
            'index': 0
        }, {
            'name': 'zh_tw',
            'index': 1
        }, {
            'name': 'en_us',
            'index': 2
        }];
        var language = localStorage.getItem("language") || 'en_us';
        var btn_active_index = _.find(languages, {
            'name': language
        }).index;

        var setLanguage = function(language) {

            var onSuccess = function(data) {
                if (data.status === 1) {
                    localStorage.setItem("language", language);
                    localStorage.setItem("languageSet","true");
                    app.mainView.router.refreshPage();
                } else {
                    app.f7.alert(data.message);
                }
            };

            var onError = function(e) {
                app.f7.alert(getI18NText('network-error'));
            }

            //var url = ''; TODO
            //getAjaxData(url,onSuccess, onError);
            //Mock data
            var data = {
                status: 1,
                message: 'success'
            }
            onSuccess(data);
        }

        var buttons = [{
            text: getI18NText('CH'),
            onClick: function(){
                setLanguage('zh_cn');
            }
            
        }, {
            text: getI18NText('TW'),
            onClick: function(){
                setLanguage('zh_tw');
            }
            
        }, {
            text: getI18NText('EN'),
            onClick: function(){
                setLanguage('en_us');
            }
        }];

        buttons[btn_active_index].bold = true;
        buttons[btn_active_index].color = 'red';
        buttons[btn_active_index].onClick = function() {};

        app.f7.actions(buttons);
    }

    function openNewPage(e) {
        var id = $(e.currentTarget).attr("toPage");
        if ("changePwd" === id) {
            app.mainView.router.load({
                url: "./js/changePwd/changePwd.html"
            });
        }
        if ("notification" === id) {
            app.mainView.router.load({
                url: "./js/ee_self/notification/notification.html"
            });
        }
        if ("update" === id) {
            app.mainView.router.load({
                url: "./views/"
            });
        } else if ("aboutStar" === id) {
            app.mainView.router.load({
                url: "./views/"
            });
        }
    }

    function updateVersion() {

        //var url = 'http://app.test.com/TjLib/check_update.php';
        cordova.getAppVersion.getVersionCode(function(versionCode) {
            var onSuccess = function(data) {
                    closeLoading();
                    if (parseInt(data.status) === 1) {
                        var obj = data.data;
                        if (versionCode < obj.versionCode) {
                            //检测到更新时，提示用户是否升级
                            var r = confirm(obj.msg);
                            if (r) {
                                //调用浏览器打开下载链接，需要安装inappbrowser插件
                                window.open(obj.apk, '_system', 'location=yes');
                            }
                        }
                    } else {
                        app.f7.alert(data.message);
                    }

                }
                //var onError = function(e) {
                //    closeLoading();
                //    app.f7.alert("网络异常，请稍后重试。");
                //}
                //var url = ess_getUrl("", "ess/ELeave/getleaveDetailInfo/");
                //getAjaxData(url, onSuccess, onError);
            var data = {
                "status": "1",
                "message": "操作成功！",
                "error": {
                    "code": 0,
                    "message": "Success"
                },
                "data": {
                    "versionCode": 10104, //版本号
                    "versionName": "1.0.1", //版本名称
                    "msg": "有新版本可供更新.\n 1.界面美化 \n 2.性能优化", //更新提示
                    "apk": "https://wespark.cdpcloud.com/download/portalTestAPP/android/WeSpark.apk" //app下载地址
                }
            };
            onSuccess(data);
        });
    }

    function backToPrevious() {
        app.mainView.router.back({
            url: "js/ee_self/self_base/self_base.html",
            force: true,
            ignoreCache: true
        });
    }
    return {
        init: init
    };
});