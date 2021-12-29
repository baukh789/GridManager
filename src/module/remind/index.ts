/*
 * remind: 表头提醒
 */
import './style.less';
import jTool from '@jTool';
import {isFunction, isObject} from '@jTool/utils';
import { getQuerySelector, getDiv, clearTargetEvent, getTable } from '@common/base';
import { FAKE_TABLE_HEAD_KEY, PX } from '@common/constants';
import { parseTpl } from '@common/parse';
import remindTpl from './remind.tpl.html';
import { getEvent, eventMap } from './event';
import { TARGET, EVENTS, SELECTOR, MOUSE_LEAVE } from '@common/events';

// 配置信息
interface ConfigInfo {
	text: string;
	position: string;
}

/**
 * 删除tr上的Remind
 * @param _
 */
export const removeTooltip = (_: string): void => {
    const $trRemind = getDiv(_).find('.gm-tooltip');
    if ($trRemind.length) {
        $trRemind.remove();
    }
};
/**
 * 为tr 上的tooltip
 * @param _
 * @param dom: tr 或 td
 * @param conf: 配置信息
 */
export const tooltip = (_: string, dom: HTMLTableCellElement, conf: ConfigInfo, callback?: any): void => {
    if (!isObject(conf)) {
        return;
    }
    const { text, position } = conf;
    let rightModel = position === 'right' ? ' right-model' : '';

    // tooltip显示高度: 在top定位时也会使用到
    const height = 30;
    const $div = getDiv(_);
    const $dom = jTool(dom);
    const $body = getTable(_);
    const top = $dom.offset().top - $body.offset().top - $div.scrollTop() - height;

    // td上的tooltip: rightModel将被清空（td上右模式没有必要存在）
    let leftStyle = '';
    if (dom.nodeName === 'TD') {
        rightModel = '';
        leftStyle = `left:${$dom.offset().left - $body.offset().left - $div.scrollLeft() + PX};`;
    }
    removeTooltip(_);
    const str = `<span class="ra-area gm-tooltip${rightModel}" style="height:${height + PX};top:${top + PX};${leftStyle}">${text}</span>`;
    $div.append(str);

    // 绑定清除事件: 即时绑定即时销毁，不需要在destroy中处理
    $dom.bind(MOUSE_LEAVE, () => {
        $dom.unbind(MOUSE_LEAVE);
        removeTooltip(_);
        isFunction(callback) && callback();
    });
};

class Remind {
    /**
     * 初始化表头提醒
     * @param _
     */
    init(_: string): void {
        eventMap[_] = getEvent(_, `${getQuerySelector(_)} [${FAKE_TABLE_HEAD_KEY}]`);
        const { start } = eventMap[_];

        const $tableDiv = getDiv(_);

        // 这里的事件仅对位置进行处理，hover状态通过css实现
        jTool(start[TARGET]).on(start[EVENTS], start[SELECTOR], function () {
            const $onlyRemind = jTool(this);
            const $raArea = $onlyRemind.find('.ra-area');
            const theLeft = ($tableDiv.get(0).offsetWidth - ($onlyRemind.offset().left - $tableDiv.offset().left)) > $raArea.get(0).offsetWidth + 20;
            theLeft ? $raArea.removeClass('right-model') : $raArea.addClass('right-model');
        });
    }

    /**
     * 获取表头提醒所需HTML
     * @param params
     * @returns {string}
     */
    @parseTpl(remindTpl)
	createHtml(params: any): string {
        const { remind } = params;
        let styleStr = '';
        let text = '';
        if (isObject(remind)) {
            text = remind.text;
        } else {
            text = remind;
        }

        const style = remind.style;
        if (isObject(style)) {
            styleStr = 'style="';
            Object.keys(style).forEach(key => {
                styleStr = `${styleStr}${key}:${style[key]};`;
            });
            styleStr += '"';
        }

		// @ts-ignore
	    return {
            text,
            style: styleStr
        };
	}
    /**
	 * 消毁
	 * @param _
	 */
	destroy(_: string): void {
	    clearTargetEvent(eventMap[_]);
        removeTooltip(_);
	}
}

export default new Remind();
