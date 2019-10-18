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
import jTool from '@common/jTool';
import { cloneObject } from '@common/utils';
import cache from '@common/cache';

// 获取参数信息
export const getParams = settings => {
    let _params = jTool.extend(true, {}, settings.query);

    // 合并分页信息至请求参
    if (settings.supportAjaxPage) {
        _params[settings.currentPageKey] = settings.pageData[settings.currentPageKey];
        _params[settings.pageSizeKey] = settings.pageData[settings.pageSizeKey];
    }

    // 合并排序信息至请求参, 排序数据为空时则忽略
    if (!jTool.isEmptyObject(settings.sortData)) {
        // #001
        // settings.mergeSort: 是否合并排序字段
        if (settings.mergeSort) {
            _params[settings.sortKey] = '';
            jTool.each(settings.sortData, (key, value) => {
                _params[settings.sortKey] = `${_params[settings.sortKey]}${_params[settings.sortKey] ? ',' : ''}${key}:${value}`;
            });
        } else {
            jTool.each(settings.sortData, (key, value) => {
                // 增加sort_前缀,防止与搜索时的条件重叠
                _params[`${settings.sortKey}${key}`] = value;
            });
        }
    }

    // 请求前处理程序, 可以通过该方法增加 或 修改全部的请求参数
    // requestHandler方法内需返回修改后的参数
    _params = settings.requestHandler(cloneObject(_params));
    return _params;
};

/**
 * 将不同类型的ajaxData转换为promise
 * @param settings
 * @returns promise
 */
export const transformToPromise = settings =>  {
    const params = getParams(settings);
    // 将 requestHandler 内修改的分页参数合并至 settings.pageData
    if (settings.supportAjaxPage) {
        jTool.each(settings.pageData, (key, value) => {
            settings.pageData[key] = params[key] || value;
        });
    }

    // 将 requestHandler 内修改的排序参数合并至 settings.sortData
    jTool.each(settings.sortData, (key, value) => {
        settings.sortData[key] = params[`${settings.sortKey}${key}`] || value;
    });
    cache.setSettings(settings);

    let ajaxData = typeof settings.ajaxData === 'function' ? settings.ajaxData(settings, params) : settings.ajaxData;

    // ajaxData === string url
    if (typeof ajaxData === 'string') {
        return getPromiseByUrl(params);
    }

    // ajaxData === Promise
    if (typeof ajaxData.then === 'function') {
        return ajaxData;
    }

    // 	ajaxData === 静态数据
    if (jTool.type(ajaxData) === 'object' || jTool.type(ajaxData) === 'array') {
        return new Promise(resolve => {
            resolve(ajaxData);
        });
    }

    // 获取Promise, 条件: ajaxData 为 url
    function getPromiseByUrl(Params) {
        // #002
        // 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
        if (settings.ajaxType.toUpperCase() === 'POST' && !settings.ajaxHeaders['Content-Type']) {
            settings.ajaxHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        return new Promise((resolve, reject) => {
            jTool.ajax({
                url: ajaxData,
                type: settings.ajaxType,
                data: Params,
                headers: settings.ajaxHeaders,
                xhrFields: settings.ajaxXhrFields,
                cache: true,
                success: response => {
                    resolve(response);
                },
                error: (XMLHttpRequest, textStatus, errorThrown) => {
                    reject(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        });
    }
};
