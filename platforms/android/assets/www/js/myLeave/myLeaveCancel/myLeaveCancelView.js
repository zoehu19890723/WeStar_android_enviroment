define([ 'hbs!js/myLeave/myLeaveCancel/myLeaveCancelView'], function( viewTemplate) {

	var $ = Dom7;

	function render(params) {
		weixin_hideBackButton();
		$('.myleavecancel').html(viewTemplate(params.model));
		bindEvents(params.bindings);
	}

	function bindEvents(bindings) {
		for (var i in bindings) {
			$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

	return {
		render: render
	}
});