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
import { each, getStyle, noop, getDomList } from './utils';
import _Css from './Css';
const INLINE_BLOCK = 'inline-block';
const TABLE_CELL = 'table-cell';
const DISPLAY_MAP = {
    TABLE: 'table',
    THEAD: 'table-header-group',
    TBODY: 'table-row-group',
    TR: 'table-row',
    TH: TABLE_CELL,
    TD: TABLE_CELL,
    SPAN: INLINE_BLOCK,
    A: INLINE_BLOCK,
    FONT: INLINE_BLOCK,
    BUTTON: INLINE_BLOCK,
    I: INLINE_BLOCK
};

export default {
    /**
     *  动画效果, 动画样式仅支持以对象类型传入且值需要存在有效的单位
     * @param styleObj
     * @param time
     * @param callback
     */
    animate: function (styleObj, time = 0, callback = noop) {
        let animateFromText = '';   // 动画执行前样式文本
        let animateToText = '';     // 动画执行后样式文本
        let node = getDomList(this, 0);

        // 组装动画 keyframes
        each(styleObj, (key, v) => {
            animateFromText += key + ':' + getStyle(node, key) + ';';
            animateToText += key + ':' + v + ';';
        });
        // 拼接动画样式文本
        const animateText = `@keyframes jToolAnimate {from {${animateFromText}}to {${animateToText}}}`;

        // 引入动画样式至页面
        const jToolAnimate = document.createElement('style');
        jToolAnimate.type = 'text/css';
        document.head.appendChild(jToolAnimate);
        jToolAnimate.textContent = jToolAnimate.textContent + animateText;

        // 启用动画
        node.style.animation = `jToolAnimate ${time / 1000}s ease-in-out forwards`;

        // 延时执行回调函数及清理操作
        setTimeout(() => {
            _Css.css.call(this, styleObj);
            node.style.animation = '';
            document.head.removeChild(jToolAnimate);
            callback();
        }, time);
    },
    show: function () {
        each(this,  v => {
            v.style.display = DISPLAY_MAP[v.nodeName] || 'block';
        });
        return this;
    },
    hide: function () {
        each(this, v => {
            v.style.display = 'none';
        });
        return this;
    }
};
