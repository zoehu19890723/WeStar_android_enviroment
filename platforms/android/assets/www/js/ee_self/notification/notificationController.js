define(["app"], function(app) {


    var bindings = [];

    function init() {
        var renderObject = {
            selector: $('.notification'),
            hbsUrl: "js/ee_self/notification/notification",
            model:{},
            bindings: bindings,
            beforeRender: weixin_hideBackButton,

        }
        viewRender(renderObject);
    }

    return {
        init: init
    };

});