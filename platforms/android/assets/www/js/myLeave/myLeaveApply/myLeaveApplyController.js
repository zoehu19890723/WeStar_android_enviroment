define(["app"], function(app) {

    var $$ = Dom7;
    var bindings = [

        {
            element: '#commitButton',
            event: 'click',
            handler: commitVacation
        }, {
            element: '#uploadP',
            event: 'click',
            handler: uploadPicture
        }
    ];
    var vacationType = [{
        id: '1',
        name: getI18NText('year-leave')
    }, {
        id: '2',
        name: getI18NText('sick-leave')
    }];
    var leave_type;
    var eeListPicker;


    var myDate = new Date();

    var query_;


    function init(query) {
        query_ = query;
        var model_ = {};
        $.ajax({
            type: "get",
            url: ess_getUrl("ess/ELeave/GetLeaveType/"),
            // url: "http://192.168.9.241/sme/ws.php/ess/ELeave/GetLeaveType/",
            dataType: "jsonp",
            timeout: 20000,
            jsonp: "callback",
            jsonpCallback: "jsonp" + getRandomNumber(),
            success: function(data) {
                closeLoading();
                if (data.status === 1) {
                    if (data.data === undefined || (data.data && data.data.length === 0)) {
                        vacationType = [{
                            id: '0',
                            name: getI18NText('no-type-choose')
                        }];
                    } else {
                        vacationType = data.data;
                    }
                    model_.photo = localStorage.getItem('attatchPhoto');

                    var renderObject = {
                        selector: $('.myleaveapply'),
                        hbsUrl: "js/myLeave/myLeaveApply/myLeaveApply",
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
        var pickerStart = app.f7.picker({
            input: '#startDate',
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
            value: [myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), (myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()), (myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())],
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
                },
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
            onChange: function(picker, values) {
                var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, 0).getDate();
                if (values[2] > daysInMonth) {
                    picker.cols[2].setValue(daysInMonth);
                }

            },
            onOpen: function() {
                $$('#start-sure').on('click', function() {
                    var begin = $.trim($("#startDate").val());
                    var end = $.trim($("#endDate").val());
                    if (!compareTime(begin, end)) {
                        pickerEnd.setValue([pickerStart.cols[0].value, pickerStart.cols[1].value, pickerStart.cols[2].value, pickerStart.cols[4].value, pickerStart.cols[6].value]);
                    }
                });
            },
            formatValue: function(p, values) {
                var result1 = values[0];
                if (values[1] < 9) {
                    result1 += "-0" + (values[1] * 1 + 1);
                } else {
                    result1 += "-" + (values[1] * 1 + 1);
                }
                if (values[2] < 10) {
                    result1 += "-0" + values[2];
                } else {
                    result1 += "-" + values[2];
                }
                result1 += '   ' + values[3] + ':' + values[4]
                return result1;
            }
        });

        var pickerEnd = app.f7.picker({
            input: '#endDate',
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
            value: [myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), (myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()), (myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())],
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
                },
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
            onChange: function(picker, values) {
                var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, 0).getDate();
                if (values[2] > daysInMonth) {
                    picker.cols[2].setValue(daysInMonth);
                }

            },
            onOpen: function() {
                $$('#end-sure').on('click', function() {
                    var end = pickerEnd.cols[0].displayValue;

                });
            },
            formatValue: function(p, values) {
                var result2 = values[0];
                if (values[1] < 9) {
                    result2 += "-0" + (values[1] * 1 + 1);
                } else {
                    result2 += "-" + (values[1] * 1 + 1);
                }
                if (values[2] < 10) {
                    result2 += "-0" + values[2];
                } else {
                    result2 += "-" + values[2];
                }
                result2 += '   ' + values[3] + ':' + values[4]
                return result2;
            }
        });
        eeListPicker = app.f7.picker({
            input: '#vacationType',
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
                    $$.each(vacationType, function(index, value) {
                        arr.push(value.leave_code);
                    });
                    return arr;
                })(),
                displayValues: (function() {
                    var arr = [];
                    $$.each(vacationType, function(index, value) {
                        arr.push(value.name);
                    });
                    return arr;
                })()
            }],
            formatValue: function(p, values, displayValues) {
                return displayValues;
            },
            onOpen: function() {
                leave_type = eeListPicker.cols[0].value;
            }

        });
    }

    function uploadPicture() {
        var phooo = $(".upload").find("img").attr("src");
        app.router.load("myLeave/attatchment", {
            photo: phooo
        });

    }

    function compareTime(begin, end) {
        var d1 = new Date(begin.replace(/\-/g, "\/"));
        var d2 = new Date(end.replace(/\-/g, "\/"));

        if (begin != "" && end != "" && d1 < d2) {
            return true;
        } else return false;
    }

    function commitVacation() {

        var begin = $.trim($("#startDate").val());
        var end = $.trim($("#endDate").val());
        var begin_date = begin.split('   ')[0];
        var begin_time = begin.split('   ')[1];
        var end_date = end.split('   ')[0];
        var end_time = end.split('   ')[1];
        var attatchment = localStorage.getItem("attatchPhoto");
        var remark = $.trim($("#feedback").val());
        if (eeListPicker !== undefined && eeListPicker.cols[0] !== undefined) {
            leave_type = eeListPicker.cols[0].value;
        }
        var check = true;
        if (check && vacationType[0].id === "0") {
            check = false;
            app.f7.alert(vacationType[0].name);
        }
        if (check && !leave_type) {
            check = false;
            app.f7.alert(getI18NText('enterLeaveType'));
        }
        if (check && !begin_date) {
            check = false;
            app.f7.alert(getI18NText('timeNotNull'));
        }

        if (check && !end_date) {
            check = false;
            app.f7.alert(getI18NText('timeNotNull'));
        }


        if (check && !compareTime(begin, end)) {
            check = false;
            app.f7.alert(getI18NText('startBEnd'));
        }
        var argsJson = {
            leave_code: leave_type,
            begin_date: begin_date,
            begin_time: begin_time,
            end_date: end_date,
            end_time: end_time,
            attachment: attatchment,
            remark: remark
        };
        if (check) {
            showLoading();
            $.ajax({
                type: "get",
                url: ess_getUrl("ess/ELeave/ApplyELeave/"),
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
                            app.f7.alert(getI18NText('leaveSuc') + data.data.leave_days + getI18NText('day'), function() {
                                localStorage.removeItem("attatchPhoto");
                                app.mainView.router.back({
                                    url: "js/myLeave/myLeaveApply/myLeaveApply.html"
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