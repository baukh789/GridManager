/*
 * i18n: 国际化
 * */
import { isUndefined, isArray } from '@jTool/utils';
import { outWarn } from '@common/utils';
/**
 * 获取所用语种，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
 * @param settings
 * @returns {string|string}
 */
const getLanguage = settings => {
    return settings.i18n;
};

/**
 * 指定[表格 键值 语种]获取对应文本
 * @param settings
 * @param key 键值
 * @param language 语种: 非必须, 不指定则会使用当前的配置 settings.i18n
 * @returns {*|string}
 */
const getText = (settings, key, language) => {
    return settings.textConfig[key][language || getLanguage(settings)] || '';
};

/**
 * 获取与当前配置国际化匹配的文本
 * @param settings
 * @param key 指向的文本索引
 * @param v1 可为空，也存在1至3项，只存在1项时可为数组
 * @param v2 可为空，也存在1至3项，只存在1项时可为数组
 * @param v3 可为空，也存在1至3项，只存在1项时可为数组
 * @returns {string}
 */
/* eslint-disable */
export default function(settings, key, v1, v2, v3) {
    let intrusion = [];
    const len = arguments.length;
    // 处理参数，实现多态化
    if (len === 3 && isArray(arguments[2])) {
        intrusion = arguments[2];
    } else if (len > 2) {
        for (let i = 2; i < len; i++) {
            intrusion.push(arguments[i]);
        }
    }

    try {
        let _text = getText(settings, key);
        if (!intrusion || !intrusion.length) {
            return _text;
        }

        // 更换包含{}的文本
        _text = _text.replace(/{\d+}/g, word => {
            const _v = intrusion[word.match(/\d+/)];
            return isUndefined(_v) ? '' : _v;
        });
        return _text;
    } catch (e) {
        outWarn(`not find language matched to ${key}`);
        return '';
    }
};
