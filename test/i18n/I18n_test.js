/**
 * Created by baukh on 17/3/5.
 */
'use strict';
import i18n from '../../src/module/i18n';
import { Settings } from '../../src/common/Settings';
import TextConfig from '../../src/module/i18n/config';
import { CONSOLE_STYLE, CONSOLE_WARN } from '../../src/common/constants';

/**
 * 实例化方法验证
 */
describe('i18n(settings, key, v1, v2, v3)', () => {
	let settings = null;
	beforeEach(() => {
		settings = new Settings();
		settings.textConfig = new TextConfig();

		// 存储console, 用于在测方式完成后原还console对象
		console._log = console.log;
		console.log = jasmine.createSpy('log');
	});

	afterEach(() => {
		settings = null;

		// 还原console
		console.log = console._log;
	});
	it('基础验证', () => {
		expect(i18n).toBeDefined();
		expect(i18n.length).toBe(5);
	});

	it('返回值验证', () => {

		// 未指定{}内容的
		expect(i18n(settings, 'order-text')).toBe('序号');

		// 指定1个{}内容的
		expect(i18n(settings, 'checked-info', 1)).toBe('已选 1 条');

		// 指定2个{}内容的
		expect(i18n(settings, 'page-info', 1, 2)).toBe('此页显示 1-2<span class="page-info-totals"> 共条</span>');

		// 指定3个{}内容的
		expect(i18n(settings, 'page-info', 1, 2, 3)).toBe('此页显示 1-2<span class="page-info-totals"> 共3条</span>');

		// 指定1个{}内容的- 数组
		expect(i18n(settings, 'page-info', [1, 2, 3])).toBe('此页显示 1-2<span class="page-info-totals"> 共3条</span>');

		// 指定错误的, 并验证错误打印信息
		expect(i18n(settings, 'undefinedKey', [1, 2, 3])).toBe('');
		expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c not find language matched to undefinedKey ', ...CONSOLE_STYLE[CONSOLE_WARN]);
	});
});

