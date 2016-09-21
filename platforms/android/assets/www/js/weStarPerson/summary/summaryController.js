/** 
 * @author zoe
 * @description It is the summary controller for my profile summary view .
 * Created at 2016/6/24  
 */
define(["app"], function(app) {
    var bindings = [
        { element: '.we-star-person', event: 'click', handler: openNewPage } ,
        // { element: '.edit-head-photo', event: 'click', handler: openPhotoPage },
    ];
    /**
     * init controller
     */
    function init(param){
        var id = '';
        var name = getI18NText('my');
        if(param.id !== undefined){
            id = param.id;
        }
        if(param.name !== undefined){
            name = param.name + getI18NText('prep');
        }

        var beforeRender = function(){
            $(".myprofile-summary").text(name+getI18NText('StarProfile'));
        }
        var renderObject = {
            selector : $('.person-summary'),
            hbsUrl : "js/weStarPerson/summary/summary",
            model : {},
            bindings : bindings,
            beforeRender : beforeRender
        }
        setPersonalProfile(renderObject,id);
    }

    return {
        init: init,
        setPersonalProfile : setPersonalProfile,
        openPhotoPage : openPhotoPage
    };

    /**
     * set personal profile
     * @param {Object} view  : hbs view
     * @param {Object} model : data model for hbs templete
     * @param {Array} binds : listeners for view
     */
    function setPersonalProfile(renderObject,id){
        /**
         * on ajax service success
         * @param  {Object} data : success data 
         */
        var onSuccess =  function(data){
            closeLoading();
            var model_= renderObject.model;
            if(data.status === "1" || data.status === 1){
                var photo=data.data.profile.photo;
                if(photo &&''!== photo && photo.indexOf(Star_imgUrl)< 0){
                    photo = photo.replace(/\s/g,'%20');
                    data.data.profile.photo = Star_imgUrl + photo;
                }
                if(id !== undefined && id !== ''){
                    store.set('selected_person',data.data);
                    model_.isOther = true;
                }else{
                    storeWithExpiration.set('ee_person',data.data);
                }
               
                var detailArray = _.pairs(_.omit(data.data,"profile"));
                model_.detailArray = detailArray;
                model_.card=data.data.profile;
            }else{
                var message = data.message;
                if (parseInt(data.status) === 605) {
                    message = getI18NText('DBError');
                }
                if(id !== undefined && id !== ''){
                    app.f7.alert(message);
                }else{
                    app.f7.alert(message, function(){
                        app.mainView.router.load({url:"index.html"});
                    });
                }
                
            }
            renderObject.model = model_;
            viewRender(renderObject);
        };

        /**
         * on ajax service failed
         * @param  {Object} e : error object
         */
        var onError = function(e){
            closeLoading();
            app.f7.alert(getI18NText('network-error'));
        }

        /**
         * on ajax service success,to reset data in store
         * @param  {Object} data : success data 
         */
        var onRestData = function(data){
            if(data.status === "1" || data.status === 1){
                var photo=data.data.profile.photo;
                if(photo &&''!==photo && photo.indexOf(Star_imgUrl)< 0){
                    data.data.profile.photo = Star_imgUrl + photo;
                }
                storeWithExpiration.set('ee_person',data.data)
            }else{
                var message = data.message;
                if (parseInt(data.status) === 605) {
                    message = getI18NText('DBError');
                }
                app.f7.alert(message, function(){
                    app.mainView.router.load({url:"index.html"});
                });
            }
        }

        var url = ess_getUrl("humanresource/HumanResourceWebsvcService/getEmployeeProfile/");
        var module = {
            html : 'weStarPerson/summary/summary.html',
        }
        if(id !== undefined && id !== ''){
            showLoading();
            var data = {
                "argsJson": JSON.stringify({
                    "id": parseInt(id)
                })
            }
            module.param ={
                id : id
            }
            getAjaxData(module,url , onSuccess, onError, data);
        }else{
            if(!storeWithExpiration.get("ee_person") ){
                showLoading();
                getAjaxData(module,url , onSuccess, onError);
            }else{
                var data = {
                    status :  1,
                    data : storeWithExpiration.get("ee_person")
                }
                onSuccess(data);
                getAjaxData(module,url,onRestData, onError);
            }
        }
    }

    /**
     * open detai page of my profile
     * @param  {Object} e :click event
     */
    function openNewPage(e){
        var id=$(e.currentTarget).attr("toPage");
        var isOther=$(e.currentTarget).attr("isOther");
        var addStr = '';
        if(isOther === 'true'){
            addStr = "&isOther=true"
        }
        var title=$.trim($(e.currentTarget).find(".wx-name").html());
        app.mainView.router.load({url:'./js/weStarPerson/detail/detail.html?id='+id+"&title="+title+addStr})
    }
    /** 
     * open photo edit page
     */
    function openPhotoPage(){
        query_ = storeWithExpiration.get("ee_person").profile;
        app.router.load("editPhoto",{photo:query_.photo,ee_id:query_.id.toString(),photo_width:$(this)[0].offsetWidth});
    }
});