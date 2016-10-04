// 即时执行选择器方法
// 生成选择器,返回工具类
// 该选择器只会在插件内部生效,在插件外部无法调用
define(function() {
    'use strict';
    // 如果需要集成Angular,React,在此处进行集成
    var jTool = function (selector, context){
        return new Sizzle(selector, context);
    };
    // 实现所必须的公用方法
    // Sizzle选择器,类似于jQuery.Sizzle;
    var Sizzle = function(selector, context){
        var DOMList = undefined;
        // selector -> undefined || null
        if(!selector){
            selector = null;
        }
        // selector -> DOM
        else if(selector instanceof HTMLElement){
            DOMList = [selector];
            context = undefined;
        }
        // selector -> NodeList
        else if(selector instanceof NodeList){
            DOMList = selector;
            context = undefined;
        }
        // selector -> jTool Object
        else if(selector.jTool){
            DOMList = selector.DOMList;
            context = undefined;
        }
        // selector -> Html String
        else if(/<.+>/.test(selector)){
            DOMList = jTool.prototype.createDOM(selector);
            context = undefined;
        }
        // selector -> 字符CSS选择器
        else {
            // context -> undefined
            if(!context){
                DOMList = document.querySelectorAll(selector);
            }
            // context -> 字符CSS选择器
            else if(typeof context === 'string'){
                context = document.querySelectorAll(context);
            }
            // context -> DOM 将HTMLElement转换为数组
            else if(context instanceof HTMLElement){
                context = [context];
            }
            // context -> NodeList
            else if(context instanceof NodeList){
                context = context;
            }
            // context -> jTool Object
            else if(context.jTool){
                context = context.DOMList;
            }
            // 其它不可以用类型
            else {
                context = undefined;
            }
            // 通过父容器获取NodeList: 存在父容器
            if(context){
                DOMList = [];
                jTool.each(context, function (i, v) {
                    // NodeList 只是类数组,直接使用concat并不会将两个数组中的参数边接,而是会直接将NodeList做为一个参数合并成为二维数组
                    jTool.each(v.querySelectorAll(selector), function (i2, v2) {
                        DOMList.push(v2);
                    });
                });
            }
        }
        if(!DOMList || DOMList.length === 0){
            DOMList = undefined;
        }
        // 用于确认是否为jTool对象
        this.jTool = true;
        // 用于存储当前选中的节点
        this.DOMList = DOMList;
        // 存储选择器条件
        this.querySelector = selector;

        return this;
    };
    /*
     * 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
     * */
    Sizzle.prototype = jTool.prototype = {};
    /*
     * @extend:扩展方法
     * jTool.extend => 可以直接使用$.extend调用
     * jTool.prototype.extend => 扩展操作后可以通过$.prototype获取
     * */
    jTool.extend = jTool.prototype.extend =  function(){
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
//            console.log('jTool不支持递归合并');
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
    jTool.extend({
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
            // 当前为jTool对象,循环目标更换为jTool.DOMList
            if(object && object.jTool){
                object = object.DOMList;
            }
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
        // 清除字符串前后的空格
        ,trim: function (text) {
            return text.trim();
        }
        // 抛出异常信息
        ,error: function(msg){
            throw new Error('[jTool Error: '+ msg + ']');
        }
        // 检测是否为空对象
        ,isEmptyObject: function(obj){
            var isEmptyObject = true;
            for(var i in obj){
                isEmptyObject = false;
            }
            return isEmptyObject;
        }
        // 获取节点样式
        ,getStyle: function(dom, key){
            return window.getComputedStyle(dom)[key]
        }
    });
    // ajax
    // type === GET: data格式 name=baukh&age=29
    // type === POST: data格式 {name:'baukh',age:29}
    // 与jquery不同的是,[success,error,complete]返回的第二个参数,并不是返回错误信息,而是错误码
    jTool.extend({
        ajax: function(arg){
            var url = arg.url,
                type = arg.type || 'GET',
                data = arg.data || undefined,
                headers = arg.headers || {},
                asynch = typeof(arg.asynch) === 'undefined' ? true : arg.asynch, // 是否使用异步
                beforeSend = arg.beforeSend || jTool.noop,
                complete =  arg.complete || jTool.noop,
                success =  arg.success || jTool.noop,
                error = arg.error || jTool.noop;
            if(!arg){
                jTool.error('jTool ajax: url不能为空');
                return;
            }
            var xhr = new XMLHttpRequest();
            if (type === 'POST' && jTool.type(data) === 'Object') {
                data = JSON.stringify(data);
            } else if(type === 'GET' && jTool.type(data) === 'String'){
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
     * @jTool.prototype扩展
     * */
    // 筛选
    jTool.prototype.extend({
        // 获取指定DOM Element
        get: function(index){
            return this.DOMList[0];
        }
        // 获取指定索引的cQuery对象:返回的是以指定索引继承的cQuery对象
        ,eq: function(index){
            /*
             var newObject = Object.create(this);
             // 与jQuery不同的是, eq结果为空时会直接抛出异常,而不是返回空对象.这样做的好处是防止为空导致的排错困难
             if(!this.DOMList[index]){
             jTool.error('eq('+ index +')所指向的DOM不存在');
             return;
             }
             newObject.DOMList = [this.DOMList[index]];
             */
            return jTool(this.DOMList[index]);
        }
        ,find: function(selectText){
            return jTool(selectText, this);
        }
    });

    // Class
    jTool.prototype.extend({
        addClass: function(className){
            jTool.each(this.DOMList, function(i, v){
                v.classList.add(className);
            });
            return this;
        }
        ,removeClass: function(className){
            jTool.each(this.DOMList, function(i, v){
                v.classList.remove(className);
            });
            return this;
        }
        ,toggleClass: function(className){
            jTool.each(this.DOMList, function(i, v){
                v.classList.toggle(className);
            });
            return this;
        }
        // 如果DOMList为多值, 以第一个值为基准
        ,hasClass: function(className){
            return this.get(0).classList.contains(className);
        }
    });
    // 属性 数据
    jTool.prototype.extend({
        // data唯一识别码
        dataKey: 'jTool' + jTool.version
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
                var _type = jTool.type(value);
                if(_type === 'String' || _type === 'Number'){
                    _this.attr(key, value);
                }
                jTool.each(_this.DOMList, function(i, v){
                    _data = v[_this.dataKey] || {};
                    _data[key] = value;
                    v[_this.dataKey] = _data;
                });
                return this;
            }
            // getter
            else{
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
            jTool.each(_this.DOMList, function(i, v){
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
                jTool.each(this.DOMList, function(i, v){
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
            jTool.each(this.DOMList, function(i, v){
                v.removeAttribute(key);
            });
        }
    });
    // CSS
    jTool.prototype.extend({
        css: function(key, value){
            // getter
            if(!value){
                return jTool.getStyle(this.DOMList[0])[key];
            }
            // setter
            jTool.each(this.DOMList, function(i, v){
                v.style[key] = value;
            });
            return this;
        }
        ,width: function(value){
            return this.css('width', value);
        }
        ,height: function(value){
            return this.css('height', value);
        }
        ,offset: function(){
            var offest = {
                top: 0,
                left:0
            };
            var _position;
            getOffset(this.DOMList[0], true);
            return offest;

            // 递归获取offset
            function getOffset(node, init){
                if(node.nodeType !== 1){
                    return;
                }
                _position = jTool.getStyle(node, 'position');
                // position=static: 继续递归父节点
                if(typeof(init) === 'undefined' && _position === 'static'){
                    getOffset(node.parentNode);
                    return;
                }
                offest.top = node.offsetTop + offest.top;
                offest.left = node.offsetLeft + offest.left;
                // position=fixed
                if( _position === 'fixed'){
                    return;
                }
                getOffset(node.parentNode);
            }

        }
    });
    // 效果
    jTool.prototype.extend({
        show: function(){
            jTool.each(this.DOMList, function(i, v){
                v.style.display = 'block';
            });
            return this;
        }
        ,hide: function(){
            jTool.each(this.DOMList, function(i, v){
                v.style.display = 'none';
            });
            return this;
        }
    });
    // 文档操作
    jTool.prototype.extend({
        append: function(childList){
            return this.html(childList, 'append');
        }
        ,prepend: function(childList){
            return this.html(childList, 'prepend');
        }
        ,text: function(text){
            // setter
            if(typeof(text) !== 'undefined'){
                jTool.each(this.DOMList, function(i, v){
                    v.innerText = text;
                });
                return this;
                // getter
            }else{
                return this.get(0).innerText;
            }
        }
        ,html: function(childList, type) {
            // getter
            if(typeof(childList) == 'undefined' && typeof(type) == 'undefined'){
                return this.DOMList[0].innerHTML;
            }
            // setter
            var _this = this;
            if(childList.jTool){
                childList = childList.DOMList;
            }
            else if(!childList.nodeType || childList.nodeType !== 1){
                childList = _this.createDOM(childList || '');
            }
            var firstChild;
            jTool.each(_this.DOMList, function(e, element){
                // html
                if(!type){
                    element.innerHTML = '';
                }
                // prepend
                else if(type === 'prepend'){
                    firstChild = element.firstChild;
                }
                jTool.each(childList, function(c, child){
                    // text node
                    if(!child.nodeType){
                        child = document.createTextNode(child);
                    }
                    if(firstChild){
                        element.insertBefore(child, firstChild);
                    }
                    else{
                        element.appendChild(child);
                    }
                    element.normalize();
                });
            });
            return this;
        }
        ,wrap: function (elementText) {
            var selfDOM = '', //存储当前node 的html
                parentNode;  // 存储父节点
            jTool.each(this.DOMList, function(i, v){
                selfDOM = v;
                parentNode = v.parentNode;
                v.outerHTML = elementText;
                // 将原节点添加入wrap中第一个为空的节点内
                parentNode.querySelector(':empty').appendChild(selfDOM);
            });
            return this;
        }
        ,closest: function (selectorText) {
           var _this  =this;
            var parentDOM = this.DOMList[0].parentNode;
            if(typeof selectorText === 'undefined'){
                return jTool(parentDOM);
            }
            var target = document.querySelectorAll(selectorText);

            // 递归查找匹配的父级元素
            function getParentNode(){
                if(!parentDOM || target.length === 0 || parentDOM.nodeType !== 1){
                    parentDOM = null;
                    return;
                }
                if([].indexOf.call(target, parentDOM) !== -1){
                    return;
                }
                parentDOM = parentDOM.parentNode;
                getParentNode();
            }
            getParentNode();
            return jTool(parentDOM);
        }
        // 通过html字符串, 生成DOM.  返回生成后的子节点
        ,createDOM: function (htmlString) {
            var jToolDOM = document.querySelector('#jTool-create-dom');
            if(!jToolDOM || jToolDOM.length === 0){
                // table标签 可以在新建element时可以更好的容错.
                // div标签, 添加thead,tbody等表格标签时,只会对中间的文本进行创建
                // table标签,在添加任务标签时,都会成功生成.且会对table类标签进行自动补全
                var el = document.createElement('table');
                el.id = 'jTool-create-dom';
                el.style.display = 'none';
                document.body.appendChild(el);
                jToolDOM = document.querySelector('#jTool-create-dom');
            }
            jToolDOM.innerHTML = htmlString || '';
            var childNodes = [];
            jTool.each(jToolDOM.childNodes, function(i, v){
                if(!/<tbody|<TBODY/.test(htmlString) && v.nodeName === 'TBODY'){
                    v = v.childNodes[0];
                }
                if(!/<thead|<THEAD/.test(htmlString) && v.nodeName === 'THEAD'){
                    v = v.childNodes[0];
                }
                if(!/<tr|<TR/.test(htmlString) && v.nodeName === 'TR'){
                    v = v.childNodes[0];
                }
                if(!/<td|<TD/.test(htmlString) && v.nodeName === 'TD'){
                    v = v.childNodes[0];
                }
                if(!/<th|<TH/.test(htmlString) && v.nodeName === 'TH'){
                    v = v.childNodes[0];
                }
                childNodes.push(v);
            });
            jToolDOM.innerHTML = '';
            return childNodes;
        }
    });
    // Event 事件
    jTool.prototype.extend({
        on: function(event, querySelector, callback, useCapture){
            // 将事件触发执行的函数存储于DOM上, 在清除事件时使用
            return this.addEvent(this.getEventObject(event, querySelector, callback, useCapture));
        }
        ,off: function(event, querySelector){
            return this.removeEvent(this.getEventObject(event, querySelector));
        }
        ,bind: function(event, callback, useCapture){
            return this.on(event, callback, useCapture);
        }
        ,unbind: function(event){
            return this.removeEvent(this.getEventObject(event));
        }
        ,trigger: function(event){
            jTool.each(this.DOMList, function(e, element){
                try {
                    element[event]();
                }catch(e){
                    jTool.error(e);
                }
            });
            return this;
        }
        // 获取jTool Event 对象
        ,getEventObject: function(event, querySelector, callback, useCapture){
            // $(dom).on(event, callback);
            if(typeof querySelector === 'function'){
                callback  = querySelector;
                useCapture = callback || false;
                querySelector = undefined;
            }
            // event callback 为必要参数
            if(!event){
                jTool.error('事件绑定失败,原因: 参数中缺失事件类型');
                return this;
            }
            if(!querySelector){
                querySelector = '';
            }
            // 存在子选择器 -> 包装回调函数
            if(querySelector !== ''){
                var fn = callback;
                callback = function(e){
                    // 验证子选择器所匹配的nodeList中是否包含当前事件源
                    if([].indexOf.call( this.querySelectorAll(querySelector), e.target) !== -1){
                        fn.apply(e.target, arguments);
                    }
                };
            }
            var eventSplit = event.split('.');
            var eventObj = {
                eventName: event + querySelector,
                type: eventSplit[0],
                querySelector: querySelector,
                callback: callback || jTool.noop,
                useCapture: useCapture || false,
                nameScope: eventSplit[1] || undefined
            };
            return eventObj;
        }
        // 增加事件,并将事件对象存储至DOM节点
        ,addEvent: function(eventObj){
            var eventFnList; //事件执行函数队列
            jTool.each(this.DOMList, function(i, v){
                if(!v['jToolEvent']){
                    v['jToolEvent'] = {};
                }
                if(!v['jToolEvent'][eventObj.eventName]){
                    v['jToolEvent'][eventObj.eventName] = [];
                }
                v['jToolEvent'][eventObj.eventName].push(eventObj);
                v.addEventListener(eventObj.type, eventObj.callback, eventObj.useCapture);
            });
            return this;
        }
        // 删除事件,并将事件对象移除出DOM节点
        ,removeEvent: function(eventObj){
            var eventFnList; //事件执行函数队列
            jTool.each(this.DOMList, function(i, v){
                if(!v['jToolEvent']){
                    return;
                }
                eventFnList = v['jToolEvent'][eventObj.eventName];
                if(eventFnList){
                    jTool.each(eventFnList, function(i2, v2){
                        v.removeEventListener(v2.type, v2.callback);
                    });
                    v['jToolEvent'][eventObj.eventName] = undefined;
                }
            });
            return this;
        }
    });
    window.$ = window.jTool = jTool;
    return jTool;
});