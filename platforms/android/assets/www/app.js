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
    var f7 = new Framework7({
        modalTitle: '',
        //swipePanel: 'left',
        animateNavBackIcon: true,
        dynamicNavbar:true,
        cache:true,
        modalButtonOk: '确认',
        modalButtonCancel: '取消'
    });


    document.addEventListener("backbutton", eventBackButton, false);
    function eventBackButton(){
        if($('.icon-back').length!=0){
            $('.icon-back').click();
        }else{
            f7.alert("再按一次退出");
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
