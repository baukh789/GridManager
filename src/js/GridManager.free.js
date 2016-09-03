/**
 * Created by baukh on 16/9/3.
 */
;(function($){
    'use strict';
    function GridManager(){
    }
    // 捆绑至选择器对象
    $.prototype.GM = $.prototype.GridManager = function(_name_, _settings_, _callback_){
        console.log(_name_)
    };
    console.log($('.t3').hide(1))

// 即时执行选择器方法
// 生成选择器,使用与jQuery同名的变量 => $, 虽然同名,却是不同的
// 该选择器只会在插件内部生效,在插件外部无法调用
})((function(){
    'use strict';
    // 如果需要集成Angular,React,在此处进行集成
    // 调用$()时,执行document.querySelectorAll()方法
    // 并不做为构造函数进行使用. 在这里$是做为一个方法存在, 使用时并不是new $, 而是直接使用$.prototype
    var $ = function (selector, context){
        return $.prototype.sizzle(selector, context); // 相当于调用另外一个对象,只是将该对象存储$.prototype;
    };
    // 实现所必须的公用方法
    $.prototype = {
        /*
        * @该方法实现选择器功能,类似于jQuery.Sizzle
        * 设置不允许出现同时渲染多个table, 所以不需要使用querySelectorAll
        * */
       sizzle:function(selector, context){
            if(typeof selector === 'undefined'){
                this.error('无效的选择器');
                return;
            }
            var tableDOM = undefined;
            // 验证容器是否为选择器,如果是则通过该选择器获取dom节点
            if(typeof context === 'string'){
                context = document.querySelector(context);
            }
            // 验证context是否为空节点
            if(context && context.length !== 0){
                tableDOM = context.querySelector(selector);
            // 没有容器,直接对通过选择器获取dom节点
            }else{
                tableDOM = document.querySelector(selector);
            }
            if(!tableDOM){
                this.error('无效的选择器');
                return;
            }
            this.tableDOM = tableDOM;
            return this;
        }
        /*
        * @显示
        * */
        ,show: function(){
            this.tableDOM.style.display = 'block';
            return this;
        }
        /*
         * @隐藏
         * */
        ,hide: function(){
            this.tableDOM.style.display = 'none';
            return this;
        }
        ,extend: function(){
        }
        ,error: function(msg){
            throw new Error('GridManager Error:'+ msg);
        }
    };

    return $;
})());