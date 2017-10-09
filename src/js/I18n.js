/*
 * I18n: 国际化
 * */
import { Base } from './Base';
import Cache from './Cache';
class I18n {
	/**
	 * 获取所用语种，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
	 * @param $table
	 * @returns {string|string}
     */
	getLanguage($table) {
		return Cache.getSettings($table).i18n;
	}

	/**
	 * 指定[表格 键值 语种]获取对应文本
	 * @param $table 表格
	 * @param key 键值
	 * @param language 语种
	 * @returns {*|string}
     */
	getText($table, key, language) {
		return Cache.getSettings($table).textConfig[key][language] || '';
	}

	/**
	 * 获取与当前配置国际化匹配的文本
	 * @param $table
	 * @param key 指向的文本索引
	 * @param v1 可为空，也存在一至3项，只存在一项时可为数组
	 * @param v2 可为空，也存在一至3项，只存在一项时可为数组
	 * @param v3 可为空，也存在一至3项，只存在一项时可为数组
     * @returns {string}
     */
	i18nText($table, key, v1, v2, v3) {
		const _this = this;
		let intrusion = [];

		// 处理参数，实现多态化
		if (arguments.length === 3 && typeof (arguments[2]) === 'object') {
			intrusion = arguments[2];
		} else if (arguments.length > 1) {
			for (let i = 1; i < arguments.length; i++) {
				intrusion.push(arguments[i]);
			}
		}
		let _text = '';
		try {
			_text = _this.getText($table, key, _this.getLanguage($table));
			if (!intrusion || intrusion.length === 0) {
				return _text;
			}
			_text = _text.replace(/{\d+}/g, word => {
				return intrusion[word.match(/\d+/)];
			});
			return _text;
		} catch (e) {
			Base.outLog(`未找到与${key}相匹配的${_this.getLanguage($table)}语言`, 'warn');
			return '';
		}
	}
}
export default new I18n();
