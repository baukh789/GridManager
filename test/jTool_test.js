/**
 * Created by baukh on 17/10/9.
 */

import $ from '../src/js/jTool';
describe('jTool.js', function() {
	it('验证jTool是否存在', function(){
		expect($).toBeDefined();
	});

	it('验证jTool是否加载成功', function(){
		expect($).toBe(window.jTool);
	});
});
