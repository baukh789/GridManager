/**
 * Created by baukh on 17/6/20.
 */
import '../src/js/index';
// 引入组件, 实例化 Element.prototype.GM
describe('index.js', function() {
	it('验证Element.prototype 是否绑定成功', function(){
		expect(Element.prototype.GridManager).toBeDefined();
		expect(Element.prototype.GM).toBeDefined();
		expect(Element.prototype.GridManager).toBe(Element.prototype.GM);
	});

	it('验证GridManager 挂载至window 是否成功', function(){
		expect(window.GridManager).toBeDefined();
		expect(window.GM).toBeDefined();
		expect(window.GridManager).toBe(window.GM);
	});
});

require('./Adjust_test');
require('./AjaxPage_test');
require('./Base_test');
require('./Cache_test');
require('./Checkbox_test');
require('./Config_test');
require('./Core_test');
require('./Drag_test');
require('./Export_test');
require('./GridManager_test');
require('./Hover_test');
require('./I18n_test');
require('./Menu_test');
require('./Order_test');
require('./Publish_test');
require('./Remind_test');
require('./Settings_test');
require('./Sort_test');
// require('./Store_test');
