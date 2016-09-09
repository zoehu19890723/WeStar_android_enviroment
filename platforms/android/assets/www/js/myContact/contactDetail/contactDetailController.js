/**
 * Created by Elsa.Dou on 2016/1/8.
 */
define(["app"], function(app) {
    var contact = null;
    var bindings = [];

    function init(query) {
        var id = query.id;
        var contacts = store.get('myContact');
        if (id) {
            var values = _.find(contacts, {
                id: parseInt(query.id)
            }) || _.find(contacts, {
                id: query.id
            });
            contact = new Contact(values);
        }
        var renderObject = {
            selector: $('.contactDetail'),
            hbsUrl: "js/myContact/contactDetail/contactDetail",
            model: contact,
            bindings: bindings
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
        this.organization = values['organization'] || '';
        if (this.name.toUpperCase() === "ADMIN") {
            this.admin = true;
        } else {
            this.admin = false;
        }
    }
    return {
        init: init
    };
});