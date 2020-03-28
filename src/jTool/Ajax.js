/*
 * ajax
 * type === GET: data格式 name=baukh&age=29
 * type === POST: data格式 { name: 'baukh', age:29 }
 * 与 jquery 不同的是,[success, error, complete]返回的第二个参数, 并不是返回错误信息, 而是错误码
 * */
import { noop, each, isObject, extend } from './utils';

// 内容类型
const CONTENT_TYPE = 'Content-Type';
const FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

/**
 * 获取表单数据: GET 与 POST(Content-Type !== appliaction/json)时使用
 * @param data
 * @returns {string|*}
 */
function getFormData(data) {
    if (!isObject(data)) {
        return data;
    }
    let str = '';
    each(data, (key, value) => {
        if(str) {
            str += '&';
        }
        str += key + '=' + value;
    });
    return str;
}
export default function ajax(options) {
    let { url, type, data, headers, async, xhrFields, beforeSend, complete, success, error } = extend({
        url: null,		// 请求地址
        type: 'GET',	// 请求类型
        data: null,		// 传递数据
        headers: {},	// 请求头信息
        async: true,	// 是否异步执行
        xhrFields: {},  // 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
        beforeSend: noop,	// 请求发送前执行事件
        complete: noop,	// 请求发送后执行事件
        success: noop,	// 请求成功后执行事件
        error: noop		// 请求失败后执行事件
    }, options);

    type = type.toUpperCase();

    const xhr = new XMLHttpRequest();
    let formData = null;

    // GET
    if (type === 'GET') {
        if (data) {
            url = url + (url.indexOf('?') === -1 ?  '?' : '&') + getFormData(data);
        }
    }

    // POST
    if (type === 'POST') {
        // 配置默认消息主体编码方式
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

    // 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
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
