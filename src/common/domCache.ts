/**
 * 通过将在实例销毁前一直存在的dom进行缓存，以减少DOM操作提升性能。
 * cacheMap中仅缓存操作较频繁的DOM，操作较少的DOM不需要进行缓存。
 *
 * 注意: 需要保证这些缓存的DOM获取方法在DOM未存在时不被调用，实例销毁前不被清除。
 */
import jTool from '@jTool';
import { DIV_KEY, FAKE_TABLE_HEAD_KEY, TABLE_BODY_KEY, TABLE_HEAD_KEY, TABLE_KEY, WRAP_KEY } from '@common/constants';

// 缓存map: 操作较少的不需要放在这里
const cacheMap: {
	[index:string]: any
} = {
    [TABLE_KEY]: {},
    [DIV_KEY]: {},
    [WRAP_KEY]: {},
    [TABLE_HEAD_KEY]: {},
    [FAKE_TABLE_HEAD_KEY]: {},
    [TABLE_BODY_KEY]: {},
    'allTh': {},
    'allFakeTh': {}
};

/**
 * 获取缓存dom
 * @param _
 * @param key
 * @param querySelector: 为空时，自动使用key + _ 进行拼接
 * @returns {*}
 */
export const getCacheDOM = (_: string, key: string, querySelector?: string) => {
    const cache = cacheMap[key];
    if (!cache[_]) {
        cache[_] = jTool(querySelector || `[${key}="${_}"]`);
    }
    return cache[_];
};

/**
 * 清除指定实例的缓存
 * @param _
 */
export const clearCacheDOM = (_: string): void => {
    for (let key in cacheMap) {
        delete cacheMap[key][_];
    }
};
