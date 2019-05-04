/*
 * i18n: 国际化
 * */
import base from '@common/base';
class I18n {
	/**
	 * 获取所用语种，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
	 * @param settings
	 * @returns {string|string}
     */
	getLanguage(settings) {
		return settings.i18n;
	}

	/**
	 * 指定[表格 键值 语种]获取对应文本
	 * @param settings
	 * @param key 键值
	 * @param language 语种: 非必须, 不指定则会使用当前的配置 settings.i18n
	 * @returns {*|string}
     */
	getText(settings, key, language) {
		return settings.textConfig[key][language || this.getLanguage(settings)] || '';
	}

	/**
	 * 获取与当前配置国际化匹配的文本
	 * @param settings
	 * @param key 指向的文本索引
	 * @param v1 可为空，也存在1至3项，只存在1项时可为数组
	 * @param v2 可为空，也存在1至3项，只存在1项时可为数组
	 * @param v3 可为空，也存在1至3项，只存在1项时可为数组
     * @returns {string}
     */
	i18nText(settings, key, v1, v2, v3) {
		let intrusion = [];

		// 处理参数，实现多态化
		if (arguments.length === 3 && Array.isArray(arguments[2])) {
			intrusion = arguments[2];
		} else if (arguments.length > 2) {
			for (let i = 2; i < arguments.length; i++) {
				intrusion.push(arguments[i]);
			}
		}

		try {
			let _text = this.getText(settings, key);
			if (!intrusion || intrusion.length === 0) {
				return _text;
			}

			// 更换包含{}的文本
			_text = _text.replace(/{\d+}/g, word => {
			    const _v = intrusion[word.match(/\d+/)];
				return typeof _v === 'undefined' ? '' : _v;
			});
			return _text;
		} catch (e) {
			base.outWarn(`未找到与${key}相匹配的${this.getLanguage(settings)}语言`);
			return '';
		}
	}
}
export default new I18n();
