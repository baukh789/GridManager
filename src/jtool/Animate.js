/*
 * 动画效果
 * --动画中的参数对应--
 * styleObj: 元素将要实现的样式, 只允许为Object格式
 * time: 执行动画的间隔时间
 * callback: 动画执行完成后的回调函数
 * --Ex--
 * 无回调参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000);
 * 无时间参数: jTool('#div1').animate({height: '100px', width: '200px'}, callback);
 * 完整参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000, callback);
 * --注意事项--
 * show与hide方法只是一个简单的实现,不支持参数及动画效果
 * */
import { each, isFunction, isUndefined, getStyle, noop } from './utils';
import _Css from './Css';
function show() {
    each(this.DOMList, function (i, v) {
        let _display = '';
        const inlineArray = ['SPAN', 'A', 'FONT', 'I'];
        // inline
        if(v.nodeName.indexOf(inlineArray) !== -1) {
            v.style.display = 'inline-block';
            return this;
        }
        // table or block
        switch (v.nodeName) {
            case 'TABLE':
                _display = 'table';
                break;
            case 'THEAD':
                _display = 'table-header-group';
                break;
            case 'TBODY':
                _display = 'table-row-group';
                break;
            case 'TR':
                _display = 'table-row';
                break;
            case 'TH':
                _display = 'table-cell';
                break;
            case 'TD':
                _display = 'table-cell';
                break;
            default:
                _display = 'block';
                break;
        }
        v.style.display = _display;
    });
    return this;
}

function hide() {
    each(this.DOMList, function (i, v) {
        v.style.display = 'none';
    });
    return this;
}

/**
 *  动画效果, 动画样式仅支持以对象类型传入且值需要存在有效的单位
 * @param styleObj
 * @param time
 * @param callback
 */
function animate(styleObj, time, callback) {
    let animateFromText = '';   // 动画执行前样式文本
    let animateToText = '';     // 动画执行后样式文本
    let node = this.DOMList[0];
    // 无有效的参数, 直接跳出. 但并不返回错误.
    if(!styleObj) {
        return;
    }
    // 参数转换
    if(isUndefined(callback) && isFunction(time)) {
        callback = time;
        time = 0;
    }
    if(isUndefined(callback)) {
        callback = noop;
    }
    if(isUndefined(time)) {
        time = 0;
    }
    // 组装动画 keyframes
    each(styleObj, (key, v) => {
        animateFromText += key + ':' + getStyle(node, key) + ';';
        animateToText += key + ':' + v + ';';
    });
    // 拼接动画样式文本
    const animateText = `@keyframes jToolAnimate {from {${animateFromText}}to {${animateToText}}}`;

    // 引入动画样式至页面
    const jToolAnimate = document.createElement('style');
    jToolAnimate.className = 'jTool-animate-style';
    jToolAnimate.type = 'text/css';
    document.head.appendChild(jToolAnimate);
    jToolAnimate.textContent = jToolAnimate.textContent + animateText;

    // 启用动画
    node.style.animation = 'jToolAnimate ' + time / 1000 + 's ease-in-out forwards';

    // 延时执行回调函数及清理操作
    window.setTimeout(() => {
        _Css.css.call(this, styleObj);
        node.style.animation = '';
        document.head.removeChild(jToolAnimate);
        callback();
    }, time);
}

export default {
    animate,
    show,
    hide
};
