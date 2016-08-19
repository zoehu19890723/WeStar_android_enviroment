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
    var exitAfterAgainTap = (Locale[language] !== undefined) ? (Locale[language])['exitAfterAgainTap'] : 'Exit after another press';
    
    var f7 = new Framework7({
        modalTitle: '',
        animateNavBackIcon: true,
        dynamicNavbar:true,
        cache:true,
        modalButtonOk: sure,
        modalButtonCancel: cancel
    });

    function eventBackButton(){
        if($('.icon-back').length!=0){
            $('.icon-back').click();
        }else{
            f7.alert(exitAfterAgainTap);
            document.removeEventListener("backbutton", eventBackButton, false); // 注销返回键
            document.addEventListener("backbutton", exitApp, false);//绑定退出事件

            //3秒后重新注册
            var intervalID = window.setInterval(
                function() {
                    window.clearInterval(intervalID);
                    document.removeEventListener("backbutton",exitApp, false); // 注销返回键
                    document.addEventListener("backbutton", eventBackButton, false); // 返回键
                },3000);
        }
    }
    function exitApp(){
        navigator.app.exitApp();
    }

    registerCommonTemplete();
    var mainView = f7.addView('.view-main', {
        dynamicNavbar: true
    });
    
    return {
        f7: f7,
        mainView: mainView,
        router: Router,
        locale : Locale
    };
});
