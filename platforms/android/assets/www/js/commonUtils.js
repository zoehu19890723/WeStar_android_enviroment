/**
 * Update by zoe,2016/6/27
 */
document.addEventListener("deviceready", onDeviceReady, false);
var deviceInfo = {};
var macAddressInfo;

function onDeviceReady() {
	deviceInfo.model = device.model; //设备模型（如三星，华为等）
	deviceInfo.version = device.version; //设备版本
	localStorage.setItem('deviceUUID',device.uuid);
    var onGPLSuccess = function(language){
		if(localStorage.getItem("languageSet") !== "true"){
			var new_language = 'en_us';
			if(language !== undefined && language !== null && language.value !== undefined){
                if(device.platform.toLowerCase() === 'ios'){
                    if(language.value.indexOf('zh-Hans-') > -1){
                        new_language = 'zh_cn';
                    }else if(language.value.indexOf('zh-Hant-') > -1){
                        new_language = 'zh_tw'
                    }else{
                        new_language = 'en_us';
                    }
                }else{
                  
                   new_language = (language.value).toLowerCase().replace("-", "_");
                }
				
				if(new_language !== 'en_us' && new_language !== 'zh_cn' &&  new_language !== 'zh_tw'){
					new_language = 'en_us';
				}
			}
			localStorage.setItem("language", new_language);
		}
	}

	var onGPLFailure = function(){
		localStorage.setItem("language", 'en_us');
	}
	navigator.globalization.getPreferredLanguage(onGPLSuccess, onGPLFailure);
	
	window.MacAddress.getMacAddress(
		function(macAddress) {
			macAddressInfo = macAddress;
		},
		function(fail) {

		}
	);
}
/**
 * get basic url for differnt service
 * @param  {String} url      Spark url
 * @return {String}           new url
 */
function ess_getUrl(url) {
	//mobile/PC
	var platform = "pc";
	if ("android" == localStorage.getItem("device") || "ios" == localStorage.getItem("device")) {
		platform = "mobile";
	}
	var ess_envUrl = Star_envUrl + "/";
	//WeStar
	var extraParam = '&format=jsonp';
	var url_ = ess_envUrl + url + extraParam;
	return url_;

}

var ess_loadingToastHtml = '<div id="ess_loadingToast" class="weui_loading_toast"> <div class="weui_mask_transparent"></div> <div class="weui_toast"> <div class="weui_loading"> <!-- :) --> <div class="weui_loading_leaf weui_loading_leaf_0"></div> <div class="weui_loading_leaf weui_loading_leaf_1"></div> <div class="weui_loading_leaf weui_loading_leaf_2"></div> <div class="weui_loading_leaf weui_loading_leaf_3"></div> <div class="weui_loading_leaf weui_loading_leaf_4"></div> <div class="weui_loading_leaf weui_loading_leaf_5"></div> <div class="weui_loading_leaf weui_loading_leaf_6"></div> <div class="weui_loading_leaf weui_loading_leaf_7"></div> <div class="weui_loading_leaf weui_loading_leaf_8"></div> <div class="weui_loading_leaf weui_loading_leaf_9"></div> <div class="weui_loading_leaf weui_loading_leaf_10"></div> <div class="weui_loading_leaf weui_loading_leaf_11"></div> </div> <p class="weui_toast_content" style="text-align: center">{{spacial-string}}</p> </div> </div>';

var ess_GeoToastHtml = '<div id="ess_geoToast" class="weui_loading_toast"> <div class="weui_mask_transparent"></div> <div class="weui_toast"> <div class="weui_loading"> <div class="weui_loading_leaf weui_loading_leaf_0"></div> <div class="weui_loading_leaf weui_loading_leaf_1"></div> <div class="weui_loading_leaf weui_loading_leaf_2"></div> <div class="weui_loading_leaf weui_loading_leaf_3"></div> <div class="weui_loading_leaf weui_loading_leaf_4"></div> <div class="weui_loading_leaf weui_loading_leaf_5"></div> <div class="weui_loading_leaf weui_loading_leaf_6"></div> <div class="weui_loading_leaf weui_loading_leaf_7"></div> <div class="weui_loading_leaf weui_loading_leaf_8"></div> <div class="weui_loading_leaf weui_loading_leaf_9"></div> <div class="weui_loading_leaf weui_loading_leaf_10"></div> <div class="weui_loading_leaf weui_loading_leaf_11"></div> </div> <p class="weui_toast_content" style="text-align: center">{{spacial-string}}</p> </div> </div>';

function showLoading() {
	var loading_text = getI18NText('DataLoading');
	ess_loadingToastHtml = ess_loadingToastHtml.replace('{{spacial-string}}',loading_text);
	if (!isLoadingExist()) {
		$("#index_view .pages").append(ess_loadingToastHtml);
	}
}

function showLoadingLogin() {
	var loading_text = getI18NText('DataLoading');
	ess_loadingToastHtml = ess_loadingToastHtml.replace('{{spacial-string}}',loading_text);
	$("#index_view").append(ess_loadingToastHtml);
}

function closeLoading() {
	$("#ess_loadingToast").remove();
}

function isLoadingExist() {
	if ($("#ess_loadingToast").length > 0) {
		return true;
	} else {
		return false;
	}
}

function showGeoLoading() {
	var loading_text = getI18NText('GeoLoading');
	ess_GeoToastHtml = ess_GeoToastHtml.replace('{{spacial-string}}',loading_text);
	$("#index_view .pages").append(ess_GeoToastHtml);
}

function closeGeoLoading() {
	$("#ess_geoToast").remove();
}


function showToast(s) {
	var toast = '<div id="toast"><div class="weui_mask_transparent"></div><div class="weui_toast" style="z-index: 9999"><i class="weui_icon_toast"></i><p class="weui_toast_content">' + s + '</p> </div> </div>'
	$("#index_view").append(toast);
	setTimeout('$("#toast").remove()', 5000);
}


function getRandomNumber() {
	var timestamp = (new Date()).valueOf();
	var num = Math.ceil(Math.random() * 1000);
	var result = timestamp + "_" + num;
	return result;
}


function getQueryObject(url) {
	//alert("微信端调用的url："+url);
	var query = {};
	if (url && url.indexOf("?") != -1) {
		var para = url.substr(url.indexOf("?") + 1);
		var para_arr = para.split("&");
		if (para_arr) {
			for (i = 0; i < para_arr.length; i++) {
				var p = para_arr[i];
				var p_ = p.split("=");
				if (p_.length == 2) {
					query[p_[0]] = p_[1];
				}
			}
		}
	}
	//alert("微信端调用的url："+JSON.stringify(query));
	return query;
}

function initBrowser() {
	var browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return {
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内�?
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终�?
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或�?�uc浏览�?
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或�?�QQHD浏览�?
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
				weixin: u.indexOf('MicroMessenger') > -1, //是否微信 �?2015-01-22新增�?
				qq: u.match(/\sQQ/i) == " qq" //是否QQ
			};
		}()
	};
	localStorage.setItem("browser", JSON.stringify(browser.versions));
	JSON.parse(localStorage.browser).ios ? localStorage.setItem("device", 'ios') : localStorage.setItem("device", 'android');
}

function weixin_hideBackButton() {
	var isWeixin = localStorage.getItem("isWeixin");
	var ifHideBackIco = localStorage.getItem("ifHideBackIco");
	if (isWeixin && "1" == isWeixin && ifHideBackIco && "true" == ifHideBackIco) {
		$(".left .icon-back").parent().hide();
	}
}

function weixin_hideToolBar() {
	var isWeixin = localStorage.getItem("isWeixin");
	if (isWeixin && "1" == isWeixin) {
		$(".tabbar-labels").hide();
	}
}
function textEdit(e) {
	var val_ = $.trim($(this).val());
	if ("" != val_) {
		$(this).parent().next().children().show();
	} else {
		$(this).parent().next().children().hide();
	}
}

function textClear() {
	$(this).parent().parent().find("[class=weui_input]").val("")
	$(this).hide();
}

function hideClear() {
	$(this).parent().next().children().hide();
}

function addClear() {
	var val_ = $.trim($(this).val());
	if ("" != val_) {
		$(this).parent().next().children().show();
	} else {
		$(this).parent().next().children().hide();
	}
}

/**
 * re-define the store object with expiration time(default 30d)
 * @type {Object}
 */
var storeWithExpiration = {
	set: function(key, val, expiration_time) {
		expiration_time = expiration_time || EXPIRATION_TIME;
		store.set(key, {
			val: val,
			expiration_time: expiration_time,
			time: new Date().getTime()
		});
	},
	get: function(key) {
		var info = store.get(key);
		if (!info) {
			return null;
		}
		if (new Date().getTime() - info.time > info.expiration_time) {
			store.remove(key);
			return null;
		}
		return info.val
	},
	remove: function(key) {
		store.remove(key);
	}
};
/**
 * get ajax data
 * @param  {String} url       ajax address
 * @param  {Function} onSuccess called when ajax succeed
 * @param  {Function} onError   called when ajax failed
 * @param  {Object} data      paramaters of ajax request
 */
function getAjaxData(url, onSuccess, onError, data) {
	var data = data || null;
	var onSuccessCallBack = function(data) {
		if (data.status === 500) { //session time out
			var app = require('app');
			app.f7.alert(getI18NText('session-overtime'), function() {
				app.router.load('first_slider');
			})
		} else {
			if (onSuccess !== undefined && typeof onSuccess === "function") {
				onSuccess(data);
			}
		}
	}
	$.ajax({
		type: "get",
		async: true,
		url: url,
		data: data,
		dataType: "jsonp",
		timeout: 20000,
		jsonp: "callback",
		jsonpCallback: "jsonp" + getRandomNumber(),
		success: onSuccessCallBack,
		error: onError
	});
};
/**
 * post ajax data
 * @param  {String} url       ajax address
 * @param  {Function} onSuccess called when ajax succeed
 * @param  {Function} onError   called when ajax failed
 * @param  {Object} data      paramaters of ajax request
 */
function postAjaxData(url, onSuccess, onError, data) {
	var data = data || null;
	$.ajax({
		type: "post",
		async: true,
		url: url,
		data: data,
		dataType: "jsonp",
		timeout: 20000,
		jsonp: "callback",
		jsonpCallback: "jsonp" + getRandomNumber(),
		success: onSuccess,
		error: onError
	});
};
/**
 * set local storage
 * @param {Object} object key-value mapping
 */
function setLocalStorage(object) {
	if (arguments.length > 1) {
		window.localStorage.setItem(arguments[0], arguments[1]);
	} else {
		var array = _.pairs(object);
		array.forEach(function(k) {
			if (window.localStorage.getItem(k[0])) {
				window.localStorage.removeItem(k[0]);
			}
			window.localStorage.setItem(k[0], k[1]);
		})
	}
};
/**
 * register basic user info card for common use
 */
function registerCardTemplete() {
	var templete = '<div class="card">' + '<div class="wx-group">' + '<ul class="wx-person">' + '<li class="wx-item">' + '<div class="wx-time" ><span></span></div>' + '<span class="wx-icon edit-head-photo"> {{#if card.photo}}  <img src="{{card.photo}}" onerror = "javascript:this.src=\'./img/default.jpg\';" style="height: 100%!important;width: 100%;"/>' + '{{else}}<i class="cdp-icon-touxiang"></i> {{/if}}</span>' + '<div class="wx-name">{{card.name}}</div>' + '<span class="wx-pos">{{#if card.post}} {{card.post}} {{else}} 未知 {{/if}}</span>' + '{{#if card.name_editable}}' + '<div class="wx-time " ></div>' + '{{/if}}' + '<div class="wx-content" >{{card.action}}</div>' + '</li>' + '</ul>' + '</div>' + '</div>';

	Handlebars.registerPartial('userInfoCard', templete);
}
/**
 * register basic apply info card (include my-leave and my-overtime)for common use
 */
function registerApplyInfoCardTemplete() {
	var temp = '<div class="leave-item-time">{{updateTime}}</div>' + '<div class="leave-item">' + '<div class = "status-img"><img style="width:100%;height:100%" src="{{userInfo.image}}" onerror="javascript:this.src=\'./img/default.jpg\';"></div>' + '<div class="b_main">' + '<div class="border">' + '<div class = "summary">' + '<div class = "title">' + '<span>{{title}}</span>' + '</div>' + '<div class = "contentTitle">' + '<span>{{status.title}}:</span>' + '<span class = "value">{{status.value}}</span>' + '</div>' + '{{#each general}}' + '<div class = "content">' + '<span>{{title}}:</span>' + '<span class = "value">{{value}}</span>' + '</div>' + '{{/each}}' + '<div class="link-page" topage = {{id}} name={{userInfo.name}}>' + '<span class="click-detail">{{i18n-text "see-detail"}}</span>' + '<i class="WeSpark_iconfont ">&#xe604;</i>' + '</div>' + '</div>' + '</div>' + '<div class="out">' + '<div class="in"></div>' + '</div>' + '</div>' + '</div>';

	Handlebars.registerPartial('applyInfoCard', temp);
}
/**
 * register no data card for common use
 */
function registerNullTemplete() {
	var temp = '<div class="noDataItem">' + '<span>{{i18n-text "NoData"}}</span>' + '</div>';

	Handlebars.registerPartial('nullCard', temp);
}
/**
 * register compare function for handle bar caculation
 */
function registerCompareFunction() {
	Handlebars.registerHelper('compare', function(left, operator, right, options) {
		if (arguments.length < 3) {
			throw new Error('Handlerbars Helper "compare" needs 2 parameters');
		}
		var operators = {
			'==': function(l, r) {
				return l == r;
			},
			'===': function(l, r) {
				return l === r;
			},
			'!=': function(l, r) {
				return l != r;
			},
			'!==': function(l, r) {
				return l !== r;
			},
			'<': function(l, r) {
				return l < r;
			},
			'>': function(l, r) {
				return l > r;
			},
			'<=': function(l, r) {
				return l <= r;
			},
			'>=': function(l, r) {
				return l >= r;
			},
			'typeof': function(l, r) {
				return typeof l == r;
			}
		};

		if (!operators[operator]) {
			throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
		}

		var result = operators[operator](left, right);

		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
}

function getI18NText(text){
	var app = require('app');
	var language = localStorage.getItem('language') || 'en_us';
	
	if(language === undefined || language === "null" || app.locale[language] === undefined){
		localStorage.setItem('language','en_us');
		language = 'en_us';
	}
	var res = (app.locale[language])[text];
	if(res === undefined){
		res = text;
	}
	return res;
}

function transformI18NForHtml(){
	var ele = $('[i18n-text]');

	ele.forEach(function(item){
		var text = item.getAttribute('i18n-text');
		item.innerText = getI18NText(text);
	})
}

function registerI18NHelper(){
	Handlebars.registerHelper('i18n-text', function(text) {
		if (arguments.length < 1) {
			throw new Error('Handlerbars Helper "I18N" needs 1 parameters');
		}
		var res = getI18NText(text);
		return res;
	});
}
/**
 * register common templete
 */
function registerCommonTemplete() {
	registerCardTemplete();
	registerApplyInfoCardTemplete();
	registerNullTemplete();
	registerCompareFunction();
	registerI18NHelper();

}

/**
 * check list items length , when over the length of the item ,change its layout
 */
function checkListItems() {
	var itemInnerArr = $(".item-inner");
	itemInnerArr.forEach(function(item, index) {
		var itemTitle = $(item).find(".item-title").find("span").width();
		var itemValue = $(item).find(".ess-item-value").width();
		var totalWidth = $(item).width() - 15;
		if (totalWidth > itemTitle + itemValue) {
			return;
		} else {
			$(item).addClass("ajustItemInner");
			$(item).find(".item-title").find("span").css("white-space", "normal")
		}
	})
}
/**
 * concat image src with basic service url
 * @param  {Array} array         Array of object with image to deal
 * @param  {Boolean} withoutInfo whether image is under the property of userinfo
 * @return {Array}               new array with object dealt
 */
function dealImage(array, withoutInfo) {
	if (array && array.length !== 0) {
		array.forEach(function(item, index) {
			var subItem = withoutInfo ? item : item.userInfo;
			if (subItem && subItem.image && subItem.image !== "" && subItem.image.indexOf(Star_imgUrl) < 0) {
				var image = subItem.image.replace(/\s/g, '%20');
				subItem.image = Star_imgUrl + image;

				if (withoutInfo) {
					item = subItem;
				} else {
					item.userInfo = subItem;
				}
			}
		})
	}
	return array;
}
/**
 * render hbs files
 * @param  {object} renderObject 	 basic render paramaters contains : selector,hbsUrl,model,bindings
 *                                   event operation functions contains : berforeRender,afterRender(after render and before binding),afterBinding
 */
function viewRender(renderObject) {
	var selector = renderObject.selector;
	var hbsUrl = renderObject.hbsUrl;
	var model = renderObject.model;
	var bindings = renderObject.bindings;
	var hbsModule = "hbs!" + hbsUrl;

	var bindEvents = function(bindings) {
		for (var i in bindings) {
			$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

	var isFnc = function(name) {
		if (renderObject !== undefined && renderObject !== null) {
			var fnc = renderObject[name];
			if (fnc !== undefined && fnc !== null && typeof fnc === "function") {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	require(["app", hbsModule], function(app, viewTemplate) {

		if (isFnc('berforeRender')) {
			renderObject.berforeRender.call();
		}
		var templete = viewTemplate(model);
		if(selector !== undefined && selector !== null){
			selector.html(templete);
		}
		if (isFnc('afterRender')) {
			renderObject.afterRender.call(this,templete);
		}
		bindEvents(bindings);

		if (isFnc('afterBinding')) {
			renderObject.afterBinding.call();
		}
	})
}
//format date
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}