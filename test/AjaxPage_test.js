'use strict';
var AjaxPage = require('../src/js/AjaxPage').default;
var I18n = require('../src/js/I18n').default;
describe('AjaxPage', function() {
	var AjaxPageHtml = null;
	beforeEach(function(){
		AjaxPageHtml = '<div class="page-toolbar">'
			+ '<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>'
			+ '<div class="goto-page">'+ I18n.i18nText("goto-first-text")
			+ '<input type="text" class="gp-input"/>'+ I18n.i18nText("goto-last-text")
			+ '</div>'
			+ '<div class="change-size"><select name="pSizeArea"></select></div>'
			+ '<div class="dataTables_info"></div>'
			+ '<div class="ajax-page"><ul class="pagination"></ul></div>'
			+ '</div>';
	});
	afterEach(function () {
		AjaxPageHtml = null;
	});
	it('验证获取html', function() {
		expect(AjaxPage.html()).toBe(AjaxPageHtml);
	});
});
