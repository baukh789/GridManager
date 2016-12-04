/*
 * Order: 序号
 * */
var I18n = require('./I18n');
var Order = {
	/*
	 @生成序号DOM
	 $.table: table [jTool object]
	 */
	initOrderDOM: function(table) {
		var orderHtml = '<th th-name="gm_order" gm-order="true" gm-create="true">'+ I18n.i18nText('order-text') +'</th>';
		$('thead tr', table).prepend(orderHtml);
	}
};
module.exports = Order;
