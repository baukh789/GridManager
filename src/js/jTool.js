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
        // selector -> NodeList || selector -> Array
        else if(selector instanceof NodeList || selector instanceof Array){
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
        this.length = this.DOMList ? this.DOMList.length : 0;
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
        // 如果参数只有一个, 将认为是对jTool进行扩展
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
     * @jTool工具扩展
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
            if(o instanceof Element){
                type = 'Element';
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
                    v.jTool ? v = v.get(0) : ''; // 处理jTool 对象
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
        // 获取样式的单位
        ,getStyleUnit: function (style) {
            var unitList = ['px', 'em', 'vem', '%'],
                unit = '';
            // 样式本身为纯数字,则直接返回单位为空
            if(typeof(style) === 'number'){
                return unit;
            }
            jTool.each(unitList, function (i, v) {
                if(style.indexOf(v) !== -1){
                    unit = v;
                    return false;
                }
            });
            return unit;
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
            return this.DOMList[index];
        }
        // 获取指定索引的jTool对象
        ,eq: function(index){
            return jTool(this.DOMList[index]);
        }
        // 返回指定选择器的jTool对象
        ,find: function(selectText){
            return jTool(selectText, this);
        }
        // 获取与th同列的td jTool对象, 该方法的调用者只允许为Th
        ,getRowTd: function () {
            var th = this.eq(0);
            if(th.get(0).tagName !== 'TH'){
                jTool.error('getRowTd的调用者只允许为Th');
                return;
            }
            var table = th.closest('table'),
                trList = $('tbody tr', table);
            var tdList = [],
                thIndex = th.index();
            jTool.each(trList, function (i, v) {
                tdList.push(jTool('td', v).get(thIndex));
            });
            return jTool(tdList);
        }
    });

    // Class
    jTool.prototype.extend({
        addClass: function(className){
            return this.changeClass(className, 'add');
        }
        ,removeClass: function(className){
            return this.changeClass(className, 'remove');
        }
        ,toggleClass: function(className){
            return this.changeClass(className, 'toggle');
        }
        // 如果DOMList为多值, 以第一个值为基准
        ,hasClass: function(className){
            return this.get(0).classList.contains(className);
        }
        // 解析className 将以空格间格的字符串分割为数组
        ,parseClassName: function (className) {
            return className.indexOf(' ') ?  className.split(' ') : [className];
        }
        // 执行指定classList方法
        ,changeClass: function (className, exeName) {
            var classNameList = this.parseClassName(className);
            jTool.each(this.DOMList, function(i, dom){
                jTool.each(classNameList, function(index, name){
                    dom.classList[exeName](name);
                });
            });
            return this;
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
                return _this.get(0)[_this.dataKey]
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
                _data = _this.get(0)[_this.dataKey] || {};
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
                return this;
            }
            // getter
            else{
                return this.get(0).getAttribute(key);
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
        // 配置固有属性
        ,prop: function (key, value) {
            // 未指定参数,返回空字符
            if(typeof key === 'undefined' && typeof value === 'undefined'){
                return '';
            }
            // setter
            if(typeof(value) !== 'undefined'){
                jTool.each(this.DOMList, function(i, v){
                    v[key] = value;
                });
                return this;
            }
            // getter
            else{
                return this.get(0)[key];
            }
        }
        // attr -> value
        ,val: function (value) {
            return this.attr('value', value) || '';
        }
        // 索引
        ,index: function () {
            var node = this.get(0),
                nodeList = node.parentNode.childNodes;
            return nodeList ? [].indexOf.call(nodeList, node) : -1;
        }
    });
    // CSS
    jTool.prototype.extend({
        css: function(key, value){
            var _this = this;
            // getter
            if(jTool.type(key) === 'String' && !value){
                return jTool.getStyle(this.get(0), key);
            }
            // setter
            var pxList = ['width', 'height', 'top', 'left', 'right', 'bottom'];
            // ex: {width:13px, height:10px}
            if(jTool.type(key) === 'Object'){
                var obj = key;
                for(var k in obj){
                    setStyle(k, obj[k]);
                }
            }
            // ex: width, 13px
            else {
                setStyle(key, value);
            }
            function setStyle(name, val) {
                jTool.type(val) !== 'String' ? val = val.toString() : '';
                if(pxList.indexOf(name) !==-1 && val.indexOf('px') === -1){
                    val = val + 'px';
                }
                jTool.each(_this.DOMList, function(i, v){
                    v.style[name] = val;
                });
            }
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
            getOffset(this.get(0), true);
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
        ,animate: function (styleObj, time, callback) {
            callback();
            console.log('animate 是个空方法,考虑使用CSS实现');
            return;
            var oldValue, targetvalue, value, style, interval, unit;
            var index = 100;
                for(var key in styleObj){
                    style = styleObj[key];
                    oldValue = parseInt(this.css(key)) || 0;
                    targetvalue = parseInt(style);
                    interval = targetvalue - oldValue;
                    unit = jTool.getStyleUnit(style);

                    for(var i=1; index<=time; i++){
                        value = oldValue + interval * index / time;
                        this.css(key, value + unit);
                        index = index + 100;
                    }
                }
            callback();
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
        ,before: function (node) {
            if(node.jTool){
                node = node.get(0);
            }
            var thisNode = this.get(0);
            var parentEl = thisNode.parentNode;
            parentEl.insertBefore(node, thisNode);
            return this;
        }
        ,after: function (node) {
            if(node.jTool){
                node = node.get(0);
            }
            var thisNode = this.get(0);
            var parentEl = thisNode.parentNode;
            if(parentEl.lastChild == thisNode){
                parentEl.appendChild(node);
            }else{
                parentEl.insertBefore(node, thisNode.nextSibling);
            }
          //  parentEl.insertBefore(node, thisNode);
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
        ,html: function(childList, insertType) {
            // getter
            if(typeof(childList) == 'undefined' && typeof(insertType) == 'undefined'){
                return this.get(0).innerHTML;
            }
            // setter
            var _this = this;
            var type = jTool.type(childList);
            if(childList.jTool){
                childList = childList.DOMList;
            }
            else if(type === 'String'){
                childList = _this.createDOM(childList || '');
            }
            else if(type === 'Element'){
                childList = [childList];
            }
            var firstChild;
            jTool.each(_this.DOMList, function(e, element){
                // html
                if(!insertType){
                    element.innerHTML = '';
                }
                // prepend
                else if(insertType === 'prepend'){
                    firstChild = element.firstChild;
                }
                jTool.each(childList, function(c, child){
                    child = child.cloneNode(true);
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
        // 向上寻找匹配节点
        ,closest: function (selectorText) {
           var _this  =this;
            var parentDOM = this.get(0).parentNode;
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
        // 获取当前元素父级,返回jTool对象
        ,parent: function () {
            return this.closest();
        }
        // 通过html字符串, 生成DOM.  返回生成后的子节点
        // 该方法无处处理包含table标签的字符串,但是可以处理table下属的标签
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
            var childNodes = jToolDOM.childNodes;

            // 进行table类标签清理, 原因是在增加如th,td等table类标签时,浏览器会自动补全节点.
            if(!/<tbody|<TBODY/.test(htmlString) && childNodes.length == 1 && childNodes[0].nodeName === 'TBODY'){
                childNodes = childNodes[0].childNodes;
            }
            if(!/<thead|<THEAD/.test(htmlString) && childNodes.length == 1 &&  childNodes[0].nodeName === 'THEAD'){
                childNodes = childNodes[0].childNodes;
            }
            if(!/<tr|<TR/.test(htmlString) && childNodes.length == 1 &&  childNodes[0].nodeName === 'TR'){
                childNodes = childNodes[0].childNodes;
            }
            if(!/<td|<TD/.test(htmlString) && childNodes.length == 1 &&  childNodes[0].nodeName === 'TD'){
                childNodes = childNodes[0].childNodes;
            }
            if(!/<th|<TH/.test(htmlString) && childNodes.length == 1 &&  childNodes[0].nodeName === 'TH'){
                childNodes = childNodes[0].childNodes;
            }
            jToolDOM.remove();
            return childNodes;
        }
        //克隆节点: 参数deep克隆节点及其后代
        ,clone: function (deep) {
            return jTool(this.get(0).cloneNode(deep || false));
        }
        //批量删除节点
        ,remove: function () {
            jTool.each(this.DOMList, function(i, v) {
                v.remove();
            });
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
            var eventSplit = event.split(' ');
            var eventList = [],
                eventScopeSplit,
                eventObj;
            jTool.each(eventSplit, function (i, eventName) {
                if(eventName.trim() === ''){
                    return true;
                }
                eventScopeSplit = eventName.split('.');
                eventObj = {
                    eventName: eventName + querySelector,
                    type: eventScopeSplit[0],
                    querySelector: querySelector,
                    callback: callback || jTool.noop,
                    useCapture: useCapture || false,
                    nameScope: eventScopeSplit[1] || undefined
                };
                eventList.push(eventObj);
            });
            return eventList;
        }
        // 增加事件,并将事件对象存储至DOM节点
        // mouseleave 事件原生已经支持了?
        ,addEvent: function(eventList){
            var _this = this;
            jTool.each(eventList, function (index, eventObj) {
                jTool.each(_this.DOMList, function(i, v){
                    if(!v['jToolEvent']){
                        v['jToolEvent'] = {};
                    }
                    if(!v['jToolEvent'][eventObj.eventName]){
                        v['jToolEvent'][eventObj.eventName] = [];
                    }
                    v['jToolEvent'][eventObj.eventName].push(eventObj);
                    v.addEventListener(eventObj.type, eventObj.callback, eventObj.useCapture);
                });
            });
            return _this;
        }
        // 删除事件,并将事件对象移除出DOM节点
        ,removeEvent: function(eventList){
            var _this = this;
            var eventFnList; //事件执行函数队列
            jTool.each(eventList, function (index, eventObj) {
                jTool.each(_this.DOMList, function(i, v){
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
            });
            return _this;
        }
    });
    window.$ = window.jTool = jTool;  //临时对外使用
    return jTool;
});