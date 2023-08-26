/**
 * 自动轮播
 */
import { getSettings } from '@common/cache';
import { getDiv } from '@common/base';

class AutoPlay {
	siv: any;
	init(_: string): void {
		const { autoPlayConfig } = getSettings(_);
		const { interval, step } = autoPlayConfig;
		const $div = getDiv(_);
		let oldTop: number;

		// 防止用户错误操作，多次执行
		if (this.siv) {
			clearInterval(this.siv);
		}
		this.siv = setInterval(() => {
			oldTop = $div.scrollTop();
			$div.scrollTop(oldTop + step);
		}, interval * 1000);
	}
	start(_: string): void {
		this.init(_);
	}
	stop(_: string): void {
		clearInterval(this.siv);
	}
}

export default new AutoPlay();
