/**
 * Created by baukh on 17/10/12.
 */

import Sort from '../src/js/Sort';
describe('Sort.js', function() {
	it('验证Sort.html', function(){
		let sortHtml = `<div class="sorting-action">
						<i class="sa-icon sa-up iconfont icon-sanjiao2"></i>
						<i class="sa-icon sa-down iconfont icon-sanjiao1"></i>
					</div>`;
		expect(Sort.html.replace(/\s/g, '')).toBe(sortHtml.replace(/\s/g, ''));
		sortHtml = null;
	});
});
