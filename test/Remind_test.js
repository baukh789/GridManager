/**
 * Created by baukh on 17/10/12.
 */

import Remind from '../src/js/Remind';
describe('Remind.js', function() {
	it('验证Remind.html', function(){
		let RemindHtml = `<div class="remind-action">
						<i class="ra-help iconfont icon-icon"></i>
						<div class="ra-area">
							<span class="ra-title"></span>
							<span class="ra-con"></span>
						</div>
					</div>`;
		expect(Remind.html.replace(/\s/g, '')).toBe(RemindHtml.replace(/\s/g, ''));
		RemindHtml = null;
	});
});
