/**
 * Created by baukh on 16/9/3.
 */
;(function($){
    'use strict';
    // GridManager构造函数
    function GridManager(_settings_){
    }
    var a = $('div');
    a.attr('abc', {a:1,b:1})
    a.removeAttr('abc');
    console.log(a.attr('abc'));
    // 通过原型绑定GM方法
    GridManager.prototype = {
        init : function(_name_, _callback_){
            return this;
        }
        // 只读版本号
        ,get version(){
            return '2.0';
        }
        /*
         @获取随机参数
         */
        ,getRandom: function(){
            return this.version + Math.random();
        }
    };
    // 捆绑至选择器对象
    Element.prototype.GM = Element.prototype.GridManager = function(_name_, _settings_, _callback_){
        var _GM = new GridManager(_settings_);
        return _GM;
    };
// 即时执行选择器方法
// 生成选择器,返回工具类
// 该选择器只会在插件内部生效,在插件外部无法调用
})((function(){
    'use strict';
    // 如果需要集成Angular,React,在此处进行集成
    var cQuery = function (selector, context){
        return cQuery.prototype.sizzle(selector, context);
    };
    // 实现所必须的公用方法
    cQuery.prototype = {
        // 用于存储当前选中的节点
        DOMList: undefined
        // 缓存容器
        ,cache : {}
        ,type: 'Boolean Number String Function Array Date RegExp Object Error Symbol'
    };
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
        var i = 1,
            target = arguments[0],
            options;
        // 如果参数只有一个, 将认为是对cQuery进行扩展
        if(arguments.length === 1){
            target = this;
            i=0;
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
    * @cQuery扩展
    * */
    cQuery.extend({
        // 是否为chrome浏览器
        isChrome: function(){
            return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
        }
        ,version: '1.0'
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
    /*
    * @cQuery.prototype扩展
    * */
    // sizzle选择器,类似于jQuery.Sizzle;
    cQuery.prototype.extend({
        sizzle:function(selector, context){
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
            this.DOMList = DOMList;
            return this;
        }
    });
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
})());
