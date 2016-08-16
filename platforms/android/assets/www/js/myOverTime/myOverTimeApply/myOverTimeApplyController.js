define(["app"], function(app) {

    var $$ = Dom7;
    var bindings = [
        {
            element: '#commitButton',
            event: 'click',
            handler: commitoverTime
        }, {
            element: '#confirmStart',
            event: 'click',
            handler: changeEndT
        }, {
            element: '#changeEnd',
            event: 'click',
            handler: changeEnd
        },
    ];
    var overTimeType;
    var ot_code;
    var date;
    var beginT;
    var endT;
    var check1;
    var check2;
    var eeListPicker;


    var myDate = new Date();

    var query_;

    function init(query) {
        check1 = 0;
        check2 = 0;
        query_ = query;
        $.ajax({
            type: "get",
            url: ess_getUrl("ess/EOT/GetOTType/"),
            dataType: "jsonp",
            timeout: 20000,
            jsonp: "callback",
            jsonpCallback: "jsonp" + getRandomNumber(),
            success: function(data) {
                closeLoading();
                var model_ = {};
                if (data.status === 1) {
                    if (data.data === undefined || (data.data && data.data.length === 0)) {
                        overTimeType = [{
                            id: '0',
                            name: getI18NText('no-overtime-type-choice-text ')
                        }];
                    } else {
                        overTimeType = data.data;
                    }
                    var renderObject = {
                        selector: $('.myovertimeapply'),
                        hbsUrl: "js/myOverTime/myOverTimeApply/myOverTimeApply",
                        model: model_,
                        bindings: bindings,
                        beforeRender: weixin_hideBackButton,
                        afterRender: initPicker
                    }
                    viewRender(renderObject);

                } else if (data.status === -1) {
                    app.f7.alert(data.message, function() {
                        app.router.load('login');
                    });
                } else {
                    app.f7.alert(data.message);
                }
            },
            error: function(e) {
                closeLoading();
                app.f7.alert(getI18NText('network-error'));
            }
        });


    }

    return {
        init: init
    };

    function initPicker() {
        var pickerDate = app.f7.picker({
            input: '#overTimeDate',
            toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '<div class="left">' +
            '<a href="#" class="link toolbar-randomize-link"></a>' +
            '</div>' +
            '<div class="right">' +
            '<a href="#" class="link close-picker" id="end-sure">确定</a>' +
            '</div>' +
            '</div>' +
            '</div>',
            value: [myDate.getFullYear(), myDate.getMonth(), myDate.getDate()],
            cols: [{
                textAlign: 'left',
                values: (function() {
                    var arr = [];
                    for (var i = myDate.getFullYear() - 3; i <= myDate.getFullYear() + 3; i++) {
                        arr.push(i);
                    }
                    return arr;
                })()
            }, {
                values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),

            }, {
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31').split(' '),
            }, {
                divider: true,
                content: '  '
            }],
            onChange: function(picker, values) {
                var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, 0).getDate();
                if (values[2] > daysInMonth) {
                    picker.cols[2].setValue(daysInMonth);
                }

            },
            onOpen: function() {
                $$('#end-sure').on('click', function() {
                    //date= pickerDate.cols[0].displayValue;

                });
            },
            formatValue: function(p, values) {
                date = values[0];
                if (values[1] < 9) {
                    date += "-0" + (values[1] * 1 + 1);
                } else {
                    date += "-" + (values[1] * 1 + 1);
                }
                if (values[2] < 10) {
                    date += "-0" + values[2];
                } else {
                    date += "-" + values[2];
                }
                return date;
            }
        });
        var pickerStart = app.f7.picker({
            input: '#startTime',
            toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '<div class="left">' +
            '<a href="#" class="link toolbar-randomize-link"></a>' +
            '</div>' +
            '<div class="right">' +
            '<a href="#" class="link close-picker" id="start-sure">确定</a>' +
            '</div>' +
            '</div>' +
            '</div>',
            value: [(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()), (myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())],
            cols: [
                // Hours
                {
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 23; i++) {
                            arr.push(i < 10 ? '0' + i : i);
                        }
                        return arr;
                    })(),
                },
                // Divider
                {
                    divider: true,
                    content: ':'
                },
                // Minutes
                {
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 59; i++) {
                            arr.push(i < 10 ? '0' + i : i);
                        }
                        return arr;
                    })(),
                }
            ],
            onOpen: function() {
                $$('#start-sure').on('click', function() {
                    //beginT = pickerStart.cols[0].displayValue;
                    // pickerEnd.setValue([pickerStart.cols[0].value,pickerStart.cols[2].value]);
                });
            },
            formatValue: function(p, values) {
                beginT = values[0] + ':' + values[1]
                return beginT;
            }
        });

        var pickerEnd = app.f7.picker({
            input: '#endTime',
            toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '<div class="left">' +
            '<a href="#" class="link toolbar-randomize-link"></a>' +
            '</div>' +
            '<div class="right">' +
            '<a href="#" class="link close-picker" id="end-sure">确定</a>' +
            '</div>' +
            '</div>' +
            '</div>',
            value: [(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()), (myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())],
            cols: [
                // Hours
                {
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 23; i++) {
                            arr.push(i < 10 ? '0' + i : i);
                        }
                        return arr;
                    })(),
                },
                // Divider
                {
                    divider: true,
                    content: ':'
                },
                // Minutes
                {
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 59; i++) {
                            arr.push(i < 10 ? '0' + i : i);
                        }
                        return arr;
                    })(),
                }
            ],
            onOpen: function() {
                $$('#end-sure').on('click', function() {
                    //endT = pickerEnd.cols[0].displayValue;

                });
            },
            formatValue: function(p, values) {
                endT = values[0] + ':' + values[1]
                return endT;
            }
        });
        eeListPicker = app.f7.picker({
            input: '#overTimeType',
            toolbarTemplate: '<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '<div class="left">' +
            '<a href="#" class="link toolbar-randomize-link"></a>' +
            '</div>' +
            '<div class="right">' +
            '<a href="#" class="link close-picker" id="eeList-picker-month-sure">确定</a>' +
            '</div>' +
            '</div>' +
            '</div>',
            cols: [{
                values: (function() {
                    var arr = [];
                    $$.each(overTimeType, function(index, value) {
                        arr.push(value.ot_code);
                    });
                    return arr;
                })(),
                displayValues: (function() {
                    var arr = [];
                    $$.each(overTimeType, function(index, value) {
                        arr.push(value.name);
                    });
                    return arr;
                })()
            }],
            formatValue: function(p, values, displayValues) {
                return displayValues;
            },
            onOpen: function() {
                ot_code = eeListPicker.cols[0].value;
                // $$('#eeList-picker-month-sure').on('click', function () {
                //     ot_code  = eeListPicker.cols[0].value;

                // });
            }

        });
    }

    function changeEndT() {
        if (!$("#startNext").is(':checked')) {
            //$("#changeEnd").checked=true;
            $("#endNext").prop("checked", true)
        }

    }

    function changeEnd() {
        if ($("#endNext").prop("checked")) {
            document.getElementById("endNext").removeAttribute("checked")
        }

    }

    function compareTime(begin, end) {
        begin = date + " " + begin;
        end = date + " " + end;
        var d1 = new Date(begin.replace(/\-/g, "\/"));
        var d2 = new Date(end.replace(/\-/g, "\/"));

        if (begin && end && d1 < d2) {
            return true;
        }
    }

    function commitoverTime() {
        var ot_date = date;
        var begin_time = beginT;
        var end_time = endT;
        var remark = $.trim($("#feedback").val());

        if (eeListPicker !== undefined && eeListPicker.cols[0] !== undefined) {
            ot_code = eeListPicker.cols[0].value;
        }
        var check = true;
        if (check && overTimeType[0].id === "0") {
            check = false;
            app.f7.alert(overTimeType[0].name);
        }
        if (check && !ot_code) {
            check = false;
            app.f7.alert(getI18NText('input-ot-type'));
        }
        if (check && (date === "" || !date)) {
            check = false;
            app.f7.alert(getI18NText('ot-dateNotNull'));
        }
        if (check && (begin_time === "" || !begin_time)) {
            check = false;
            app.f7.alert(getI18NText('ot-start-timeNotNull'));
        }

        if (check && (end_time === "" || !end_time)) {
            check = false;
            app.f7.alert(getI18NText('ot-end-timeNotNull'));
        }

        if ($("#startNext").is(':checked')) {
            check1 = 1;
            $("#endNext").is(':checked');
        }
        if ($("#endNext").is(':checked')) {
            check2 = 1;
        }

        if ((check1 === 0 && check2 === 0) || (check1 === 1 && check2 === 1)) {
            if (check && !compareTime(begin_time, end_time)) {
                check = false;
                app.f7.alert(getI18NText('startBEnd'));
            }
        }
        var argsJson = {
            ot_code: ot_code,
            ot_date: ot_date,
            begin_time: begin_time,
            next_day_start: check1,
            end_time: end_time,
            next_day_end: check2,
            remark: remark
        };
        if (check) {
            showLoading();
            $.ajax({
                type: "get",
                url: ess_getUrl("ess/EOT/ApplyEOT/"),
                data: {
                    "argsJson": JSON.stringify(argsJson)
                },
                dataType: "jsonp",
                timeout: 20000,
                jsonp: "callback",
                jsonpCallback: "jsonp" + getRandomNumber(),
                success: function(data) {
                    closeLoading();
                    if (data.status === 1) {
                        if (data.data.status === "OK") {
                            app.f7.alert(getI18NText('ot-succeed') + data.data.ot_hours + getI18NText('ot-hour'), function() {
                                app.mainView.router.back({
                                    url: "./views/myLeave/myLeaveApply/myLeaveApply.html"
                                });
                            });
                        } else {
                            app.f7.alert(data.data.msg);
                        }

                    } else if (data.status === -1) {
                        app.f7.alert(data.message, function() {
                            app.router.load('login');
                        });
                    } else {
                        app.f7.alert(data.message);
                    }
                },
                error: function(e) {
                    closeLoading();
                    app.f7.alert(getI18NText('network-error'));
                }
            });

        }

    }
});