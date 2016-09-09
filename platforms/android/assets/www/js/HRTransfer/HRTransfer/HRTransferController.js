define(["app"], function(app) {
    var bindings = [{
        element: '.leave-item',
        event: 'click',
        handler: openNewPage
    }];

    var module = {
        html : 'HRTransfer/HRTransfer/HRTransfer.html'
    }
    /**
     * init controller
     */
    function init() {
        showLoading();
        var model_ = {
            "isNull": false,
        };
        /**
         * on ajax service success
         * @param  {Object} data : success data 
         */
        var onSuccess = function(data) {
                closeLoading();
                if (parseInt(data.status) === 1) {
                    if (data.data === undefined || data.data === null || (data.data && data.data.length === 0)) {
                        model_.isNull = true;
                    } else {
                        var tempArr = data.data.notApproved || [];
                        tempArr.forEach(function(item, index) {
                            _.extend(item, {
                                userInfo: {
                                    image: item.userInfo.image,
                                    name: item.userInfo.name
                                }
                            });
                        });
                        data.data.notApproved = tempArr;
                        data.data.approved = dealImage(data.data.approved);

                        model_.data = data.data;
                    }

                }else if(parseInt(data.status) === 605){
                    app.f7.alert(getI18NText('DBError'));
                }else {
                    app.f7.alert(data.message);
                }
                var renderObject = {
                    selector: $('.myHRTransfer'),
                    hbsUrl: "js/HRTransfer/HRTransfer/HRTransfer",
                    model: model_,
                    bindings: bindings,
                    beforeRender: weixin_hideBackButton,
                }
                viewRender(renderObject);
            }
            /**
             * on ajax service success
             * @param  {Object} data : success data 
             */
        var onError = function(e) {
            closeLoading();
            app.f7.alert(getI18NText('network-error'));
        }

      getAjaxData(module,ess_getUrl("humanresource/HumanResourceRelocationWebsvcService/getMyTransferApproveInfo/"), onSuccess, onError);
    }
    return {
        init: init
    };
    /**
     * open detai page of my profile
     * @param  {Object} e :click event
     */
    function openNewPage(e) {
        var id = $(e.currentTarget).find(".link-page").attr("toPage");
        var title = $(e.currentTarget).find(".link-page").attr("name") || '未知';
        var currentTab = $(e.currentTarget).parent().parent().attr("id");
        var code = (currentTab === "tab2") ? 1 : 0;

        app.mainView.router.load({
            url: './js/HRTransfer/transferDetail/transferDetail.html?id=' + id + "&title=" + title + "&code=" + code
        });
    }
});