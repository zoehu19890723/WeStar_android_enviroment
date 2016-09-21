define(["app"], function(app) {


    var bindings = [];


    function init() {
        var renderObject = {
            selector: $('.changePwd'),
            hbsUrl: "js/changePwd/changePwd",
            model: {},
            bindings: bindings
        }
        viewRender(renderObject);

        var account = ":" + localStorage.getItem("login_userName") + ":";

        $('.button-submit').click(function() {
            var orgPwd = $("#orgPwd").val();
            var newPwd = $("#newPwd").val();
            var new2Pwd = $("#new2Pwd").val();

            var myReg = /^[a-zA-Z0-9_]{8,18}$/;

            if (orgPwd == '') {
                app.f7.alert(getI18NText('oldPassNotNull'), '');
                return false;
            } else if (newPwd == '') {
                app.f7.alert(getI18NText('newPassNotNull'), '');
                return false;
            } else if (new2Pwd == '') {
                app.f7.alert(getI18NText('confirmNotNull'), '');
                return false;
            } else if (new2Pwd != newPwd) {
                app.f7.alert(getI18NText('passDiff'), '');
            } else if (myReg.test(newPwd) == false) {
                app.f7.alert(getI18NText('passUnderRule'), '');
                return false;
            } else {
                showLoading();

                $.ajax({
                    type: "get",
                    url: ess_getUrl("platform/changePassword"),
                    data: {
                        password: $("#orgPwd").val(),
                        new_password: $("#newPwd").val()
                    },
                    dataType: "jsonp",
                    timeout: 20000,
                    jsonp: "callback",
                    jsonpCallback: "jsonp" + getRandomNumber(),
                    success: function(data) {
                        closeLoading();
                        if (data.status == "0") {
                            app.f7.alert(data.message, '');
                        } else if (data.status == "-1") {
                            app.f7.alert(data.message, function() {
                                app.router.load('login');
                            });
                        } else {
                            app.f7.alert(getI18NText('changeSuc'), '');
                            $(".modal-button").click(function() {
                                $('.navbar').addClass("navbar-none");
                                localStorage.removeItem("passWord");
                                app.mainView.router.load({
                                    url: "index.html"
                                });
                            });
                        }


                    },
                    error: function(e) {
                        closeLoading();
                        app.f7.alert(getI18NText('network-error'));
                    }
                });
            }
        });

        $('.button-cancel').click(function() {
            app.mainView.router.back();
        });
    }

    return {
        init: init
    };

});