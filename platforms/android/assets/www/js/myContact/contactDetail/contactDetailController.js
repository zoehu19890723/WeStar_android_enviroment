/**
 * Created by Elsa.Dou on 2016/1/8.
 */
define(["app"], function(app) {
    var contact = null;
    var bindings = [{
            element: '#myContact_contactDetail_label',
            event: 'click',
            handler: changeFavourite
        }

    ];
    var pla_var = null;
    var backStage = localStorage.getItem("backStage") || "1";

    function init(query) {
        query = JSON.parse(query.data);
        pla_var = query;
        var contacts = store.get('myContact');
        if (contacts !== null && contacts.length > 0) {
            contacts = _.flatten(_.pluck(contacts, 'childList'));
        }
        if (query) {
            if (backStage === "1") {
                var values = _.find(contacts, {
                    id: parseInt(query.id)
                }) || _.find(contacts, {
                    id: query.id
                });
                contact = new Contact(values);
                contact.hasFavor = false;
            } else {
                contact = new Contact(_.find(contacts, {
                    id: parseInt(query.id),
                    color: query.color
                }));
                contact.hasFavor = true;
            }
        }

        var afterRender = function() {
            if (contact.favorite) {
                $("#myContact_contactDetail_checkbox").attr("status", "on");
            } else {
                $("#myContact_contactDetail_checkbox").attr("status", "false");
            }
        }
        var renderObject = {
            selector: $('.contactDetail'),
            hbsUrl: "js/myContact/contactDetail/contactDetail",
            model: contact,
            bindings: bindings,
            afterRender: afterRender
        }
        viewRender(renderObject);
    }

    function Contact(values) {
        if (values === undefined || values === null) {
            this.isNull = true;
            return;
        }
        values = values || {};
        this.isNull = false;

        this.id = values['id'] || '';
        this.mobile = values['mobile'] || '';
        this.name = values['name'] || '';

        this.photo = values['photo'] || '';
        this.gender = values['gender'] || '';
        this.email = values['email'] || '';
        this.post = values['position'] || '';
        this.supervisor = values['supervisor'] || '';
        this.favorite = values['favorite'];
        this.photoText = values['photoText'] || '';
        this.color = values['color'] || '';
        this.organization= values['organization'] || '';
        if (this.name.toUpperCase() === "ADMIN") {
            this.admin = true;
        } else {
            this.admin = false;
        }
    }

    function changeFavourite() {
        showLoading();
        setTimeout(isFavorite, 300);
    }


    function isFavorite() {
        var url_;
        if ($("#myContact_contactDetail_checkbox").attr("status") == "false") {
            url_ = "address/setFavorite";
        } else {
            url_ = "address/cancelFavorite";
        }
        $.ajax({
            type: "get",
            url: ess_getUrl(url_),
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 20000,
            jsonpCallback: "jsonp" + getRandomNumber(),
            data: {
                "id": contact.id
            },
            success: function(json) {
                closeLoading();
                if ("1" === json.status) {
                    var pla_myContact = store.get('myContact');
                    if ($("#myContact_contactDetail_checkbox").attr("status") == "false") {
                        $("#myContact_contactDetail_checkbox").attr("status", "on");
                        pla_myContact[1].childList.push({
                            color: pla_var.color,
                            email: pla_var.email,
                            favorite: true,
                            gender: pla_var.gender,
                            id: pla_var.id,
                            mobile: pla_var.mobile,
                            name: pla_var.name,
                            photo: pla_var.photo,
                            pinyin: pla_var.pinyin,
                            photoText: pla_var.photoText,
                            post: pla_var.post,
                            supervisor: pla_var.supervisor,
                            organization: pla_var.organization
                        });
                        _(pla_myContact).forEach(function(n) {
                            _(n.childList).forEach(function(m) {
                                if (m.id && m.id === contact.id) {
                                    m.favorite = true;
                                }
                            }).value();
                        }).value();
                    } else {
                        $("#myContact_contactDetail_checkbox").attr("status", "false");
                        _.remove(pla_myContact[1].childList, function(n) {
                            if (n.id === contact.id) {
                                n.favorite = false;
                            }
                            return n.id === contact.id;
                        });
                        _(pla_myContact).forEach(function(n) {
                            _(n.childList).forEach(function(m) {
                                if (m.id && m.id === contact.id) {
                                    m.favorite = false;
                                }
                            }).value();
                        }).value();
                    }
                    store.set('myContact', pla_myContact);
                } else if (json.status === "-1") {
                    app.f7.alert(json.message, function() {
                        app.router.load('login');
                    });
                } else {
                    app.f7.alert(json.message);
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
});