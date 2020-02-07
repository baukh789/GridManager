/**
 * 将不同类型的ajaxData转换为promise
 * #001:
 * settings.mergeSort: 是否合并排序字段
 * false: {sort_createDate: 'DESC', sort_title: 'ASC'}
 * true: sort: {createDate: 'DESC'}
 *
 * #002:
 * 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
 * 1. Content-Type = application/x-www-form-urlencoded 的数据形式为 form data
 * 2. Content-Type = text/plain;charset=UTF-8 的数据形式为 request payload
 */
import { isString, isFunction, each, isEmptyObject } from '@jTool/utils';
import ajax from '@jTool/ajax';
import extend from '@jTool/extend';
import { cloneObject } from '@common/utils';
import { setSettings } from '@common/cache';

// 获取参数信息
export const getParams = settings => {
    const { query, supportAjaxPage, pageData, sortData, mergeSort, sortKey, currentPageKey, pageSizeKey, requestHandler } = settings;
    const params = extend(true, {}, query);
    // 合并分页信息至请求参
    if (supportAjaxPage) {
        params[currentPageKey] = pageData[currentPageKey];
        params[pageSizeKey] = pageData[pageSizeKey];
    }

    // 合并排序信息至请求参, 排序数据为空时则忽略
    if (!isEmptyObject(sortData)) {
        // #001
        // settings.mergeSort: 是否合并排序字段
        if (mergeSort) {
            params[sortKey] = '';
            each(sortData, (key, value) => {
                params[sortKey] = `${params[sortKey]}${params[sortKey] ? ',' : ''}${key}:${value}`;
            });
        } else {
            each(sortData, (key, value) => {
                // 增加sort_前缀,防止与搜索时的条件重叠
                params[`${sortKey}${key}`] = value;
            });
        }
    }

    // 请求前处理程序, 可以通过该方法增加 或 修改全部的请求参数
    // requestHandler方法内需返回修改后的参数
    return requestHandler(cloneObject(params));
};

/**
 * 将不同类型的ajaxData转换为promise
 * @param settings
 * @returns promise
 */
export const transformToPromise = settings =>  {
    const params = getParams(settings);
    const { supportAjaxPage, pageData, sortData, sortKey, ajaxType, ajaxHeaders, ajaxXhrFields, ajaxData } = settings;
    // 将 requestHandler 内修改的分页参数合并至 settings.pageData
    if (supportAjaxPage) {
        each(pageData, (key, value) => {
            pageData[key] = params[key] || value;
        });
    }

    // 将 requestHandler 内修改的排序参数合并至 settings.sortData
    each(sortData, (key, value) => {
        sortData[key] = params[`${sortKey}${key}`] || value;
    });
    setSettings(settings);

    const data = isFunction(ajaxData) ? ajaxData(settings, params) : ajaxData;

    // ajaxData === string url
    if (isString(data)) {
        // #002
        // 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
        if (ajaxType.toUpperCase() === 'POST' && !ajaxHeaders['Content-Type']) {
            ajaxHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        return new Promise((resolve, reject) => {
            ajax({
                url: data,
                type: ajaxType,
                data: params,
                headers: ajaxHeaders,
                xhrFields: ajaxXhrFields,
                cache: true,
                success: resolve,
                error: reject
            });
        });
    }

    // ajaxData === Promise
    if (data instanceof Promise) {
        return data;
    }

    // 	ajaxData === 静态数据
    return new Promise(resolve => {
        resolve(data);
    });
};
