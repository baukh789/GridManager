/*
 * ajax
 * type === GET: data格式 name=baukh&age=29
 * type === POST: data格式 { name: 'baukh', age:29 }
 * 与 jquery 不同的是,[success, error, complete]返回的第二个参数, 并不是返回错误信息, 而是错误码
 * */
import { noop, each, isObject } from './utils';
import extend from './extend';

export default function ajax(options) {
    const defaults = {
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
    };
    options = extend(defaults, options);

    if (!options.url) {
        return;
    }

    const xhr = new XMLHttpRequest();
    let formData = '';

    // 获取表单数据: GET 与 POST(Content-Type !== appliaction/json)时使用
    function getFormData() {
        let data = '';
        if (isObject(options.data)) {
            each(options.data, (key, value) => {
                if(data !== '') {
                    data += '&';
                }
                data += key + '=' + value;
            });
            return data;
        }
        return options.data;
    }

    // GET
    if (options.type.toUpperCase() === 'GET') {
        formData = getFormData();
        if (formData) {
            options.url = options.url + (options.url.indexOf('?') === -1 ?  '?' : '&') + formData;
        }
        formData = null;
    }

    // POST
    if (options.type.toUpperCase() === 'POST') {
        // 配置默认消息主体编码方式
        if(!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        // Content-Type: application/x-www-form-urlencoded || application/x-www-form-urlencoded;charset=utf-8
        if (options.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') === 0) {
            formData = getFormData();
        }

        // Content-Type: application/json || application/json;charset=utf-8
        if (options.headers['Content-Type'].indexOf('application/json') === 0) {
            formData = JSON.stringify(options.data);
        }
    }

    xhr.open(options.type, options.url, options.async);

    // 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
    // 比如xhrFields = {withCredentials: true}, 那么将会配置跨域访问时协带cookies, authorization headers(头部授权)
    for (const field in options.xhrFields) {
        xhr[field] = options.xhrFields[field];
    }

    // 增加头信息
    for (const header in options.headers) {
        xhr.setRequestHeader(header, options.headers[header]);
    }

    // xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // 执行发送前事件
    options.beforeSend(xhr);

    // 监听onload并执行完成事件
    xhr.onload = () => {
        // jquery complete(XHR, TS)
        options.complete(xhr, xhr.status);
    };

    // 监听onreadystatechange并执行成功\失败事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
            return;
        }

        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            // jquery success(XHR, TS)
            options.success(xhr.response, xhr.status);
        } else {
            // jquery error(XHR, TS, statusText)
            options.error(xhr, xhr.status, xhr.statusText);
        }
    };
    xhr.send(formData);

}
