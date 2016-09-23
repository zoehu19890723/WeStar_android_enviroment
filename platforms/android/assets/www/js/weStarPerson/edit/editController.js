/** 
 * @author zoe
 * @description My profile detail controller
 * Created at 2016/6/24  
 */
define(["app"], function (app) {
    var bindings = [];
    /**
     * Init the controller
     * @param  {Object} query : an object with id
     */
    function init(query) {

        $(".myprofile-sub").text(query.title);
        var id = query.id || null;
        var isOther = query.isOther;
        var card = {};
        var baseData = {};

        if(isOther === 'true'){
            card = store.get("selected_person").profile
            baseData = store.get('selected_person')[id];
        }else{
            card = storeWithExpiration.get("ee_person").profile
            baseData = storeWithExpiration.get('ee_person')[id];
        }
        var model_ = {
            "card": card,
            "isgroup" : baseData.isGroup || false,
            "isNull" : (baseData.data !== undefined && baseData.data !== null) ? false : true
        };
        var data_ = baseData.data || null;

        if(baseData.isGroup === undefined || baseData.isGroup === false){
            data_ = [
                {
                    groupTitle : null,
                    groupData : baseData.data || null
                }
            ];
        }
        model_.data = data_;

        var renderObject = {
            selector : $(".profile-detail"),
            hbsUrl : "js/weStarPerson/detail/detail",
            model: model_,
            bindings: bindings,
            afterRender : checkListItems
        }
        viewRender(renderObject);
    }

    return {
        init: init
    };

});