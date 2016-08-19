/**
 * Created by Elsa.Dou on 2016/4/7.
 */
define(["app"], function(app) {
    var bindings = [{
        element: '.tab-link',
        event: 'click',
        handler: jumpPage
    }, {
        element: '.wx-item',
        event: 'click',
        handler: openNewPage
    }, {
        element: '.quitSystem',
        event: 'click',
        handler: quitSystem
    }];

    function init() {
        if (!localStorage.getItem("userName") || !localStorage.getItem("passWord")) {
            return;
        }
        if (!storeWithExpiration.get("ee_person")) {
            $.ajax({
                type: "get",
                url: ess_getUrl("humanresource/HumanResourceWebsvcService/getEmployeeProfile/"),
                dataType: "jsonp",
                timeout: 20000,
                jsonp: "callback",
                jsonpCallback: "jsonp" + getRandomNumber(),
                success: function(json) {
                    var model_ = {};
                    if ("1" == json.status) {
                        var card = json.data.profile;
                        var photo = json.data.profile.photo;
                        if (photo && '' !== photo && photo.indexOf(Star_imgUrl) < 0) {
                            photo = photo.replace(/\s/g, '%20');
                            json.data.profile.photo = Star_imgUrl + photo;
                        }
                        storeWithExpiration.set('ee_person', json.data);
                        model_.card = card;
                    } else if (json.status == "-1") {
                        app.f7.alert(json.message, function() {
                            app.mainView.router.load({
                                url: "index.html"
                            });
                        });
                    } else {
                        app.f7.alert(json.message);
                    }

                    var renderObject = {
                        selector: $('.self_base'),
                        hbsUrl: "js/ee_self/self_base/self_base",
                        model: model_,
                        bindings: bindings,
                        beforeRender: weixin_hideBackButton,

                    }
                    viewRender(renderObject);

                },
                error: function(e) {
                    closeLoading();
                    app.f7.showPreloader(getI18NText('network-error'))
                    setTimeout(function() {
                        app.f7.hidePreloader();
                    }, 2000);
                    app.mainView.router.back({
                        force: true,
                        url: "index.html"
                    });
                }
            });

        } else {
            var model_ = {
                "card": storeWithExpiration.get("ee_person").profile
            };
            var renderObject = {
                selector: $('.self_base'),
                hbsUrl: "js/ee_self/self_base/self_base",
                model: model_,
                bindings: bindings,
                beforeRender: weixin_hideBackButton,

            }
            viewRender(renderObject);
        }
        initWeChat();
    }
    return {
        init: init
    };

    function quitSystem() {

        app.f7.confirm(getI18NText('sureQuit'),
            function() {
                var userName = localStorage.getItem("userName");
                var passWord = localStorage.getItem("passWord");
                var language = localStorage.getItem("language") || 'en_us';
                var languageSet = localStorage.getItem("languageSet");

                localStorage.clear();

                localStorage.setItem("userName", userName);
                localStorage.setItem('isFirstUse', '1');
                localStorage.setItem('language', language);
                if(languageSet !== undefined || languageSet !== null){
                    localStorage.setItem('languageSet',languageSet);
                }

                $.ajax({
                    type: "get",
                    url: ess_getUrl("user/userService/logout/"),
                    dataType: "jsonp",
                    timeout: 20000,
                    jsonp: "callback",
                    jsonpCallback: "jsonp" + getRandomNumber(),
                    success: function() {
                        $('.navbar').addClass("navbar-none");
                        app.mainView.router.load({
                            url: "index.html"
                        });
                    },
                    error: function() {
                        closeLoading();
                        app.f7.alert(getI18NText('network-error'));
                    }
                });
            });
    }
    
    function jumpPage(e) {
        var id = $(e.currentTarget).attr("toPage");
        if ("myProfile" === id) {
            app.mainView.router.load({
                url: "js/myProfile/myProfile.html",
                animatePages: false
            })

        } else if ("myContact" === id) {
            app.mainView.router.load({
                url: "js/myContact/contactList/contactList.html",
                animatePages: false
            })
        }
        else  if ("myMessage" == id){
            app.mainView.router.load({
                url: "js/myMessage/messageOverview/messageOverview.html",
                animatePages: false
            })
        }
    }

    function openNewPage(e) {
        var id = $(e.currentTarget).attr("toPage");
        if ("setting" == id) {
            app.mainView.router.load({
                url: "js/ee_self/setting/setting.html"
            })
        }
        if ("feedback" == id) {
            app.mainView.router.load({
                url: "js/ee_self/feedback/feedback.html"
            })
        }
        if ("online" == id) {
            app.mainView.router.load({
                url: "js/ee_self/online/online.html"
            })
        } else if ("HelpAbout" == id) {
            app.mainView.router.load({
                url: "js/HelpAbout/HelpAbout.html"
            })
        }
    }

    function initWeChat() {
        document.addEventListener('deviceready', function() {
            //分享给好友
            var btn1 = $("#recommendF");
            btn1.onclick = function() {
                //alert(33333333)
                navigator.WechatShare.showToast('请稍后...');
                shareToWeixin(false);
            }

            ////分享到朋友圈
            //var btn2 = document.getElementById('share_to_timeline');
            //btn2.onclick = function(){
            //    navigator.WechatShare.showToast('请稍后...');
            //    shareToWeixin(true);
            //}

            //分享操作的回调
            navigator.WechatShare.sendCallBack = function(result) {
                switch (result) {
                    case 1:
                        navigator.WechatShare.showToast('分享成功');
                        break;

                    case 2:
                        navigator.WechatShare.showToast('取消分享');
                        break;

                    case 3:
                        navigator.WechatShare.showToast('验证失败');
                        break;

                    case 4:
                        navigator.WechatShare.showToast('未知错误');
                        break;
                }

            }

        });
    }

    function shareToWeixin(bool) {
        //这里以分享一个网页为例
        var args = {
            type: 'webpage',
            url: 'http://www.baidu.com',
            imgUrl: 'https://www.baidu.com/img/bdlogo.png',
            title: '文章标题',
            desc: '文章简介',
            isSendToTimeline: bool //true表示分享到朋友圈，false分享给好友
        };

        navigator.WechatShare.send(args);
    }


});