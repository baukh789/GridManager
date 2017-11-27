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
