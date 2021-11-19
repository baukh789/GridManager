/**
 * ajax
 * type === GET: data格式 name=baukh&age=29
 * type === POST: data格式 { name: 'baukh', age:29 }
 * 与 jquery 不同的是,[success, error, complete]返回的第二个参数, 并不是返回错误信息, 而是错误码
 *
 * #001:
 * 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
 * 1. Content-Type = application/x-www-form-urlencoded 的数据形式为 form data
 * 2. Content-Type = text/plain;charset=UTF-8 的数据形式为 request payload
 */
import { noop, each, isObject, extend } from './utils';

// 内容类型
const CONTENT_TYPE = 'Content-Type';
const FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

/**
 * 获取表单数据: GET 与 POST(Content-Type !== appliaction/json)时使用
 * @param data
 * @returns {string|*}
 */
function getFormData(data: string | object): string {
    if (!isObject(data)) {
        return data as string;
    }
    let str = '';
    each(data, (key: string, value: string): void => {
        if(str) {
            str += '&';
        }
        str += key + '=' + value;
    });
    return str;
}

interface AjaxOptions {
    url?: string;
    type?: string;
    data?: object | Array<object>;
    headers?: object;
    async?: boolean;
    xhrFields?: object;
    beforeSend?: (xhr: object) => {};
	cache?: boolean;
    complete?(xhr: object, status: number): void;
    success?(response: object, status: number): void;
    error?(xhr: object, status: number, statusText: string): void;
}
export default function ajax(options: AjaxOptions) {
    let { url, type, data, headers, async, xhrFields, beforeSend, complete, success, error } = extend({
        url: null,		// 请求地址
        type: 'GET',	// 请求类型
        data: null,		// 传递数据
        headers: {},	// 请求头信息
        async: true,	// 是否异步执行
        xhrFields: {},  // 设置XHR对象, ajaxXhrFields 中的属性将追加至实例化后的XHR对象上
        beforeSend: noop,	// 请求发送前执行事件
        complete: noop,	// 请求发送后执行事件
        success: noop,	// 请求成功后执行事件
        error: noop		// 请求失败后执行事件
    }, options) as AjaxOptions;

    type = type.toUpperCase();

    const xhr = new XMLHttpRequest();
    let formData;

    // GET
    if (type === 'GET') {
        if (data) {
            url = url + (url.indexOf('?') === -1 ?  '?' : '&') + getFormData(data);
        }
    }

    // POST
    if (type === 'POST') {
        // 配置默认消息主体编码方式
        // #001
        if(!headers[CONTENT_TYPE]) {
            headers[CONTENT_TYPE] = FORM_URL_ENCODED;
        }

        // Content-Type: application/x-www-form-urlencoded || application/x-www-form-urlencoded;charset=utf-8
        if (headers[CONTENT_TYPE].indexOf(FORM_URL_ENCODED) === 0) {
            formData = getFormData(data);
        }

        // Content-Type: application/json || application/json;charset=utf-8
        if (headers[CONTENT_TYPE].indexOf('application/json') === 0) {
            formData = JSON.stringify(data);
        }
    }

    xhr.open(type, url, async);

    // 设置XHR对象, ajaxXhrFields 中的属性将追加至实例化后的XHR对象上
    // 比如xhrFields = {withCredentials: true}, 那么将会配置跨域访问时协带cookies, authorization headers(头部授权)
    for (const field in xhrFields) {
        xhr[field] = xhrFields[field];
    }

    // 增加头信息
    for (const header in headers) {
        xhr.setRequestHeader(header, headers[header]);
    }

    // xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // 执行发送前事件
    beforeSend(xhr);

    // 监听onload并执行完成事件
    xhr.onload = () => {
        // jquery complete(XHR, TS)
        complete(xhr, xhr.status);
    };

    // 监听onreadystatechange并执行成功\失败事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
            return;
        }

        const status = xhr.status;
        if (status >= 200 && status < 300 || status === 304) {
            // jquery success(XHR, TS)
            success(xhr.response, status);
        } else {
            // jquery error(XHR, TS, statusText)
            error(xhr, status, xhr.statusText);
        }
    };
    xhr.send(formData);
}
