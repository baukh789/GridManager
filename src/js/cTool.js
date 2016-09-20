// 即时执行选择器方法
// 生成选择器,返回工具类
// 该选择器只会在插件内部生效,在插件外部无法调用
define(function() {
    'use strict';
    // 如果需要集成Angular,React,在此处进行集成
    var cQuery = function (selector, context){
        return new sizzle(selector, context);
    };
    // 实现所必须的公用方法
    // sizzle选择器,类似于jQuery.Sizzle;
    var sizzle = function(selector, context){
        if(typeof selector === 'undefined'){
            this.error('无效的选择器');
            return;
        }
        var DOMList = undefined;
        // 验证容器是否为选择器,如果是则通过该选择器获取dom节点
        if(typeof context === 'string'){
            context = document.querySelectorAll(context);
        }
        // 验证context是否为空节点
        if(context && context.length !== 0){
            DOMList = context.querySelectorAll(selector);
            // 没有容器,直接对通过选择器获取dom节点
        }else{
            DOMList = document.querySelectorAll(selector);
        }
        if(!DOMList){
            this.error('无效的选择器');
            return;
        }
        // 用于存储当前选中的节点
        this.DOMList = DOMList;
        // 存储选择器条件
        this.querySelector = selector;
        // 缓存容器
        this.cache = {};
        return this;
    };
    /*
     * 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
     * */
    sizzle.prototype = cQuery.prototype = {};
    /*
     * @extend:扩展方法
     * cQuery.extend => 可以直接使用$.extend调用
     * cQuery.prototype.extend => 扩展操作后可以通过$.prototype获取
     * */
    cQuery.extend = cQuery.prototype.extend =  function(){
        // 参数为空,返回空对象
        if(arguments.length === 0){
            return {};
        }
        var doop = false, // 是否递归
            i = 1,
            target = arguments[0],
            options;
        // 如果参数只有一个, 将认为是对cQuery进行扩展
        if(arguments.length === 1){
            target = this;
            i=0;
        }
        if(typeof(target) === 'boolean'){
            doop = target;
            target = arguments[1] || {};
            console.log('cTool不支持递归合并');
        }
        for(; i<arguments.length; i++){
            options = arguments[i] || {};
            for (var p in options) {
                if (options.hasOwnProperty(p)) {
                    target[p] = options[p];
                }
            }
        }
        return target;
    };
    /*
     * @cQuery工具扩展
     * */
    cQuery.extend({
        // 是否为chrome浏览器
        isChrome: function(){
            return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
        }
        // 版本号
        ,version: '1.0'
        // 空函数
        ,noop: function(){}
        // 类型
        ,type: function(o){
            if(o === null || o === undefined){
                return o + '';
            }
            var type = '';
            switch (o.constructor){
                case Object:
                    type = 'Object';
                    break;
                case Array:
                    type = 'Array';
                    break;
                case Element:
                    type = 'Element';
                    break;
                case NodeList:
                    type = 'NodeList';
                    break;
                case String:
                    type = 'String';
                    break;
                case Number:
                    type = 'Number';
                    break;
                case Function:
                    type = 'Function';
                    break;
                case Date:
                    type = 'Date';
                    break;
                case RegExp:
                    type = 'RegExp';
                    break;
                default:
                    type = 'null';
                    break;
            }
            return type;
        }
        // 循环
        ,each: function(object, callback){
            var type = this.type(object);
            if(type === 'Array' || type === 'NodeList'){
                // 由于存在类数组NodeList, 所以不能直接调用every方法
                [].every.call(object, function(v, i){
                    return callback.call(v, i, v) === false ? false : true;
                });
            }else if(type === 'Object'){
                for(var i in object){
                    if(callback.call(object[i], i, object[i]) === false){
                        break;
                    }
                }
            }
        }
    });
    // ajax
    // type === GET: data格式 name=baukh&age=29
    // type === POST: data格式 {name:'baukh',age:29}
    // 与jquery不同的是,[success,error,complete]返回的第二个参数,并不是返回错误信息,而是错误码
    cQuery.extend({
        ajax: function(arg){
            var url = arg.url,
                type = arg.type || 'GET',
                data = arg.data || undefined,
                headers = arg.headers || {},
                asynch = typeof(arg.asynch) === 'undefined' ? true : arg.asynch, // 是否使用异步
                beforeSend = arg.beforeSend || cQuery.noop,
                complete =  arg.complete || cQuery.noop,
                success =  arg.success || cQuery.noop,
                error = arg.error || cQuery.noop;
            if(!arg){
                cQuery.error('cQuery ajax: url不能为空');
                return;
            }
            var xhr = new XMLHttpRequest();
            if (type === 'POST' && cQuery.type(data) === 'Object') {
                data = JSON.stringify(data);
            } else if(type === 'GET' && cQuery.type(data) === 'String'){
                url = url + (url.indexOf('?') === -1 ?  '?' : '&') + data;
            }
            xhr.open(type, url, asynch);
            for(var key in headers){
                xhr.setRequestHeader(key, headers[key]);
            }
            // 执行发送前事件
            beforeSend(xhr);
            // 监听onload并执行完成事件
            xhr.onload = function () {
                // jquery complete(XHR, TS)
                complete(xhr, xhr.status);
            };
            // 监听onreadystatechange并执行成功后失败事件
            xhr.onreadystatechange = function () {
                if(xhr.readyState !== 4){
                    return;
                }
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                    // jquery success(XHR, TS)
                    success(xhr.response, xhr.status);
                }else{
                    // jquery error(XHR, TS, statusText)
                    error(xhr, xhr.status, xhr.statusText);
                }
            };
            xhr.send(data);
        }
        ,post: function(url, data, callback){
            this.ajax({url:url, type: 'POST', data: data, success: callback})
        }
    });
    /*
     * @cQuery.prototype扩展
     * */
    // DOM元素上获取/存储数值
    cQuery.prototype.extend({
        // data唯一识别码
        dataKey: 'cQuery' + cQuery.version
        // 设置\获取对象类属性
        ,data: function(key, value){
            var _this = this,
                _data = {};
            // 未指定参数,返回全部
            if(typeof key === 'undefined' && typeof value === 'undefined'){
                return _this.DOMList[0][_this.dataKey]
            }
            // setter
            if(typeof(value) !== 'undefined'){
                // 存储值类型为字符或数字时, 使用attr执行
                var _type = cQuery.type(value);
                if(_type === 'String' || _type === 'Number'){
                    _this.attr(key, value);
                }
                cQuery.each(_this.DOMList, function(i, v){
                    _data = v[_this.dataKey] || {};
                    _data[key] = value;
                    v[_this.dataKey] = _data;
                });
                return this;
                // getter
            }else{
                _data = _this.DOMList[0][_this.dataKey] || {};
                return _data[key] || _this.attr(key);
            }
        }
        // 删除对象类属性
        ,removeData: function(key){
            var _this = this,
                _data;
            if(typeof key === 'undefined'){
                return;
            }
            cQuery.each(_this.DOMList, function(i, v){
                _data = v[_this.dataKey] || {};
                delete _data[key];
            });
        }
        // 普通属性
        ,attr: function(key, value){
            // 未指定参数,返回空字符
            if(typeof key === 'undefined' && typeof value === 'undefined'){
                return '';
            }
            // setter
            if(typeof(value) !== 'undefined'){
                cQuery.each(this.DOMList, function(i, v){
                    v.setAttribute(key, value);
                });
                // getter
            }else{
                return this.DOMList[0].getAttribute(key);
            }
        }
        // 删除普通属性
        ,removeAttr: function(key){
            if(typeof key === 'undefined'){
                return;
            }
            cQuery.each(this.DOMList, function(i, v){
                v.removeAttribute(key);
            });
        }
    });
    // 获取指定索引的对象或DOM
    cQuery.prototype.extend({
        // 获取指定DOM Element
        get: function(index){
            return this.DOMList[0];
        }
        // 获取指定索引的cQuery对象:返回的是以指定索引继承的cQuery对象
        ,eq: function(index){
            var newObject = Object.create(this);
            newObject.DOMList = [this.DOMList[index]];
            return newObject;
        }
    });
    // 获取/存储缓存对象
    cQuery.prototype.extend({
        error: function(msg){
            throw new Error('GridManager Error:'+ msg);
        }
    });
    // 获取/设置节点文本
    cQuery.prototype.extend({
        text: function(text){
            // setter
            if(typeof(text) !== 'undefined'){
                cQuery.each(this.DOMList, function(i, v){
                    v.innerText = text;
                });
                return this;
                // getter
            }else{
                return this.get(0).innerText;
            }
        }
    });
    // 显示/隐藏元素
    cQuery.prototype.extend({
        show: function(){
            cQuery.each(this.DOMList, function(i, v){
                v.style.display = 'block';
            });
            return this;
        }
        ,hide: function(){
            cQuery.each(this.DOMList, function(i, v){
                v.style.display = 'none';
            });
            return this;
        }
    });
    // DOM操作
    // 参数child可能为ElementNode,也可能是字符串
    cQuery.prototype.extend({
        append: function(child){
            cQuery.each(this.DOMList, function(i, v){
                if(child.nodeType && child.nodeType === 1){
                    v.appendChild(child.cloneNode(true));
                }else{
                    v.innerHTML = v.innerHTML + child;
                }
            });
            return this;
        }
        ,prepend: function(child){
            cQuery.each(this.DOMList, function(i, v){
                if(child.nodeType && child.nodeType === 1) {
                    v.insertBefore(child.cloneNode(true), v.childNodes[0]);
                }else{
                    v.innerHTML = child + v.innerHTML;
                }
            });
            return this;
        }
        ,html: function(child) {
            // getter
            if(!child){
                return this.DOMList[0].innerHTML;
            }
            // setter
            var childHtml = child.get(0).cloneNode(true).outerHTML;
            cQuery.each(this.DOMList, function(i, v){
                if(child.get(0).nodeType && child.get(0).nodeType === 1) {
                    v.innerHTML = childHtml;
                }else{
                    v.innerHTML = child;
                }
            });
            return this;
        }
    });
    // class相关操作
    cQuery.prototype.extend({
        addClass: function(className){
            cQuery.each(this.DOMList, function(i, v){
                v.classList.add(className);
            });
            return this;
        }
        ,removeClass: function(className){
            cQuery.each(this.DOMList, function(i, v){
                v.classList.remove(className);
            });
            return this;
        }
        ,toggleClass: function(className){
            cQuery.each(this.DOMList, function(i, v){
                v.classList.toggle(className);
            });
            return this;
        }
        // 如果DOMList为多值, 以第一个值为基准
        ,hasClass: function(className){
            return this.get(0).classList.contains(className);
        }

    });
    return cQuery;
});