require.config({
    paths: {
        handlebars: "lib/handlebars",
        text: "lib/text",
        hbs: "lib/hbs"
    },
    shim: {
        handlebars: {
            exports: "Handlebars"
        }
    }
});

define('app', ['js/router','js/locale','handlebars'], function (Router, Locale) {
    Router.init();
    document.addEventListener("backbutton", eventBackButton, false);
    
    var language = localStorage.getItem('language') || 'en_us';
    var sure = (Locale[language] !== undefined) ? (Locale[language])['confirmP'] : 'Ok';
    var cancel = (Locale[language] !== undefined) ? (Locale[language])['cancelP'] : 'Cancel'
    
    
    var f7 = new Framework7({
        modalTitle: '',
        animateNavBackIcon: true,
        dynamicNavbar:true,
        cache:true,
        modalButtonOk: sure,
        modalButtonCancel: cancel
    });

    var mainView = f7.addView('.view-main', {
        dynamicNavbar: true
    });

    function showToast(s) {
        var toast = '<div id="toast"><div class="weui_mask_transparent toast_mask"><div class="toast_content"><p>' + s + '</p> </div> </div></div>'
        $("#index_view").append(toast);
        setTimeout('$("#toast").remove()', 3000);
    }

    function eventBackButton(){
        if($('.icon-back').length!=0){
            $('.icon-back').click();
        }else{
            var popupModel = $('.popup.modal-in');
            if(popupModel.length > 0 && popupModel.css('display')==='block'){
                f7.closeModal();
                return;
            }
            var activeName = mainView.activePage.name;//判断当前页面，只有在profile页面才提示退出，其他的都返回前一个页面
            if(activeName === '' || activeName === null || activeName.indexOf('myProfile')> -1 || activeName.indexOf('index') > -1){
                var temp_language = localStorage.getItem('language') || 'en_us';
                var exitAfterAgainTap = (Locale[temp_language] !== undefined) ? (Locale[temp_language])['exitAfterAgainTap'] : 'Exit after another press';
                showToast(exitAfterAgainTap);
                document.removeEventListener("backbutton", eventBackButton, false); // 注销返回键
                document.addEventListener("backbutton", exitApp, false);//绑定退出事件

                //3秒后重新注册
                var intervalID = window.setInterval(
                    function() {
                        window.clearInterval(intervalID);
                        document.removeEventListener("backbutton",exitApp, false); // 注销返回键
                        document.addEventListener("backbutton", eventBackButton, false); // 返回键
                    },3000);

            }else if(activeName.indexOf('self_base')> -1 || activeName.indexOf('contactList') >-1){
                mainView.back({
                    animatePages: false
                })
            }else{
                mainView.back();
            }
        }
    }
    function exitApp(){
        navigator.app.exitApp();
    }

    registerCommonTemplete();
    return {
        f7: f7,
        mainView: mainView,
        router: Router,
        locale : Locale
    };
});
