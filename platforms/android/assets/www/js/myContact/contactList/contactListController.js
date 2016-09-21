/**
 * Created by Elsa.Dou on 2016/1/8.
 */
define(["app"], function(app) {

    var contact = null;
    var color = ["blue", "red", "lightgreen", "orange2", "pink", "teal"];
    var state = {
        isFavorite: false
    };
    var flag = 0;

    var bindings = [{
        element: '.left',
        event: 'click',
        handler: openNewPage
    }, {
        element: '.my-contact-list',
        event: 'click',
        handler: seeDetail
    }, {
        element: '.tab-link',
        event: 'click',
        handler: jumpPage
    }];

    var module = {
        html: 'myContact/contactList/contactList.html'
    }

    function init(query) {
        var list__ = store.get('myContact');
        if (list__) {
            showList(list__);
        } else {
            showLoading();
            var onSuccess = function(json) {
                closeLoading();
                if (parseInt(json.status) === 1) {
                    var new_list = [];
                    $.each(json.data.list, function(letter, list) {
                        if (letter !== undefined && letter !== null) {
                            var new_obj = {
                                letter: letter,
                                className: "wx-title"
                            }
                            new_list.push(new_obj);
                        }
                        if (list !== undefined && list !== null && list.length > 0) {
                            list.forEach(function(subItem) {
                                if (subItem.gender === getI18NText('female') || subItem.gender === "p_f" || subItem.gender === false) {
                                    subItem.gender = false;
                                } else {
                                    subItem.gender = true;
                                }

                                if (subItem.name !== undefined && subItem.name !== null) {
                                    subItem.pinyin = pinyin.getFullChars(subItem.name).toLowerCase();
                                }

                                var photo = subItem.photo;
                                if (photo && '' !== photo && photo.indexOf(Star_imgUrl) < 0) {
                                    photo = photo.replace(/\s/g, '%20');
                                    subItem.photo = Star_imgUrl + photo;
                                }

                                subItem.className = "wx-item";
                            })
                            new_list = new_list.concat(list);
                        }
                    });
                    store.set('myContact', new_list);
                    showList(new_list);
                } else if (parseInt(json.status) === -1) {
                    app.f7.alert(json.message, function() {
                        app.router.load('login');
                    });
                } else {
                    closeLoading();
                    var message = json.message;
                    if (parseInt(json.status) === 605) {
                        message = getI18NText('DBError');
                    }
                    app.f7.alert(message);
                }
            };
            var onError = function(e) {
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
            var url = ess_getUrl("humanresource/HumanResourceWebsvcService/getAddressList/");

            getAjaxData(module, url, onSuccess, onError);
        }
    }


    function initVisualList(list) {
        var myList = app.f7.virtualList('.my-contact-list', {
            items: list,
            rowsBefore: 60,
            rowsAfter: 60,
            renderItem: function(index, item) {
                var str = '';
                if (item.letter !== undefined) {
                    str = '<li class="wx-title">&nbsp;&nbsp;&nbsp;' + item.letter + '</li>'
                } else {
                    str = '<li class="wx-item" toPage="' + item.id + '" >' + '<span class="wx-icon cut-img" id="ico_' + item.id + '">' + '<img src=' + item.photo + ' onload="AutoResizeImage(36,this)" onerror="javascript:this.src=\'./img/default.jpg\';">' + '</span>' + '<div class="wx-name">' + item.name + '</div>' + '<div class="wx-pos" style="font-size:12px;min-height:12px">';
                    if (item.position !== undefined && item.position !== null && item.position !== 'null') {
                        str += item.position;
                    } else if (item.mobile !== undefined && item.mobile !== null && item.mobile !== 'null') {
                        str += item.mobile;
                    } else {
                        str += '';
                    }
                    str += '</div></li>';
                }
                return str;
            },

            height: function(item) {
                if (item.letter !== undefined) {
                    return 23;
                } else {
                    return 53;
                }
            },
            searchAll: function(query, items) {
                var foundItems = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].name !== undefined || items[i].position !== undefined) {
                        if (items[i].name !== null && items[i].name.indexOf(query.trim()) >= 0) {
                            foundItems.push(i);
                        } else if (items[i].position !== null && items[i].position.indexOf(query.trim()) >= 0) {
                            foundItems.push(i);
                        }
                    }
                }
                // Return array with indexes of matched items
                return foundItems;
            }
        });
    }

    function showList(new_list) {
        var afterRender = function() {
            initVisualList(new_list);
            var mySearchbar = app.f7.searchbar('.searchbar', {
                searchList: '.my-contact-list',
                searchIn: '.wx-name',
            });
        }
        var renderObject = {
            selector: $('.contactList'),
            hbsUrl: "js/myContact/contactList/contactList",
            model: {},
            bindings: bindings,
            afterRender: afterRender
        }
        viewRender(renderObject);
    }

    function seeDetail(e) {
        var id = $(e.target).parent().attr("toPage") || $(e.target).attr("toPage") || $(e.target).parent().parent().attr("toPage");
        app.mainView.router.load({
            url: "js/myContact/contactDetail/contactDetail.html?id=" + id
        });
    }

    function openNewPage(e) {
        app.mainView.router.back({
            url: 'js/myProfile/myProfile.html',
            force: true
        });
    }

    function jumpPage(e) {
        var id = $(e.currentTarget).attr("toPage");
        if ("myProfile" == id) {
            app.mainView.router.load({
                url: "js/myProfile/myProfile.html",
                animatePages: false
            })
        } else if ("myContact" == id) {} else if ("myMessage" == id) {
            app.mainView.router.load({
                url: "js/myMessage/messageOverview/messageOverview.html",
                animatePages: false
            })
        } else {
            app.mainView.router.load({
                url: "js/ee_self/self_base/self_base.html",
                animatePages: false
            })
        }
    }
    return {
        init: init
    };
});