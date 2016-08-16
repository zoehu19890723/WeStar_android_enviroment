/**
 * @description  WeStar salary controller.Created at 2016/6/24
 * @author zoe
 */
define(["app"], function(app) {

    var bindings = [{
        element: '.pull-to-refresh-content',
        event: 'refresh',
        handler: refreshContent
    }];

    /**
     * init controller 
     */
    function init(refresh) {
        showLoading();
        var ess_mySalary_month = [];

        /**
         * on ajax succeed with data return
         * @param {Object} data , return data form service
         */
        var onSuccess = function(data) {
            closeLoading();

            if (data.status == 1) {
                var pla_wage = {
                    isNull: false
                };

                if (data.data === undefined || (data.data && data.data.length === 0)) {
                    pla_wage.isNull = true;
                } else {
                    $('#mySalary-calender').css('visibility', 'visible');
                    storeWithExpiration.set('mySalary', data.data);
                    for (var i = 0; i < data.data.length; i++) {
                        var obj = {
                            id: i,
                            date: data.data[i].date
                        };
                        ess_mySalary_month.push(obj);
                    }

                    var select_month = storeWithExpiration.get("salary_selected_month") ? storeWithExpiration.get("salary_selected_month") : ((ess_mySalary_month.length == 0) ? "" : ess_mySalary_month[0]);
                    storeWithExpiration.set("salary_selected_month", select_month);

                    var currentIndex = _.findIndex(data.data, {
                        date: storeWithExpiration.get("salary_selected_month").date
                    });
                    pla_wage.data = (currentIndex !== -1) ? data.data[currentIndex] : data.data[0];

                    if(refresh !== true){
                        initPicker(ess_mySalary_month);
                    }
                }

                renderView(pla_wage);

            } else {
                var isWeixin = localStorage.getItem("isWeixin");

                if (data.message === null || data.message === "") {
                    data.message = getI18NText('reGet-salary');
                }
                if (isWeixin && "1" == isWeixin) {
                    app.f7.alert(data.message, function() {
                        wx.closeWindow();
                    });
                } else {
                    app.f7.alert(data.message);
                }
            }
        };

        /**
         * on ajax failed with error return
         * @param {Object} e , error data return
         */
        var onError = function(e) {
            closeLoading();
            app.f7.alert(getI18NText('network-error'),function(){
                app.f7.initPullToRefresh($(".pull-to-refresh-content"));
            });
        }

        /**
         * on ajax succeed with data return ,and reset the data in local store
         * @param {Object} data , return data form service
         */
        var onRestDataSuccess = function(data) {
            if (data.status && data.status === 1 && data.data) {
                storeWithExpiration.set('mySalary', data.data);
            } else {
                app.f7.alert(data.message);
            }
        }

        if (!storeWithExpiration.get("mySalary")) {
            getAjaxData(ess_getUrl("payroll/PayrollConfigWebService/getEmployeePayslip/"), onSuccess, onError);
        } else {
            var data = {
                data: storeWithExpiration.get("mySalary"),
                status: 1
            }
            onSuccess(data);

            getAjaxData(ess_getUrl("payroll/PayrollConfigWebService/getEmployeePayslip/"), onRestDataSuccess, onError);
        }
    }

    return {
        init: init
    };

    function renderView(model){
        var afterRender = function() {
            weixin_hideBackButton();
            var isWeixin = localStorage.getItem("isWeixin");
            if (isWeixin && "1" == isWeixin) {
                var width = $("#mySalary_right").width();
                var child_width = $("#mySalary-calender").width();
                var padd = (width * 1 - child_width * 1 - 4) + "px";
                $("#mySalary-calender").css("padding-left", padd);
            }
            checkListItems();
            app.f7.initPullToRefresh($(".pull-to-refresh-content"));
        }
        var renderObject = {
            selector: $('.mySalary'),
            hbsUrl: "js/weStarSalary/weStarSalary",
            model: model,
            bindings: bindings,
            afterRender: afterRender
        }
        viewRender(renderObject);
    }

    function refreshContent(){
        storeWithExpiration.remove('mySalary');
        init(true);
    }
    /**
     * Init salary calendar picker
     * @param {Array} ess_mySalary_month ,it is an array with different object of {date : XXX ,id : XXX}
     */
    function initPicker(ess_mySalary_month) {
        var myPicker = app.f7.picker({
            input: '#mySalary-calender',
            toolbarTemplate: '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                '<div class="left">' +
                '<a href="#" class="link toolbar-randomize-link"></a>' +
                '</div>' +
                '<div class="right">' +
                '<a href="#" class="link close-picker" id="mySalary-picker-month-sure">确定</a>' +
                '</div>' +
                '</div>' +
                '</div>',
            cols: [{
                displayValues: (function() {
                    var arr = [];
                    $.each(ess_mySalary_month, function(index, value) {
                        arr.push(value.date);
                    });
                    return arr;
                })(),
                values: (function() {
                    var arr = [];
                    $.each(ess_mySalary_month, function(index, value) {
                        arr.push(value.id);
                    });
                    return arr;
                })()
            }],
            onOpen: function(p) {
                $('#mySalary-picker-month-sure').on('click', function(e) {
                    if (myPicker.value !== storeWithExpiration.get("salary_selected_month").id) {
                        var mySalary = storeWithExpiration.get('mySalary');
                        var index = _.findIndex(ess_mySalary_month, {
                            id: parseInt(myPicker.value)
                        });
                        var select_month = (index !== -1) ? mySalary[index] : storeWithExpiration.get("salary_selected_month");

                        storeWithExpiration.set("salary_selected_month", select_month);

                        var pla_wage = {
                            isNull: false,
                            data: (index !== -1) ? mySalary[index] : mySalary[0]
                        };

                        renderView(pla_wage);
                    }

                });
            }
        });
    }
});