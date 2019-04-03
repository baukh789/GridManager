/*
 * remind: 表头提醒
 */
import './style.less';
import jTool from '@common/jTool';
import base from '@common/base';
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { parseTpl } from '@common/parse';
import remindTpl from './remind.tpl.html';
import getRemindEvent from './event';
class Remind {
    eventMap = {};
    // 启用状态
    enable = false;

    /**
     * 获取表头提醒所需HTML
     * @param params
     * @returns {string}
     */
    @parseTpl(remindTpl)
	createHtml(params) {
        const { title, remind } = params;
	    return {
            title,
            remind
        };
	}

	/**
	 * 初始化表头提醒
	 * @param gridManagerName
     */
	init(gridManagerName) {
        this.eventMap[gridManagerName] = getRemindEvent(gridManagerName, `${base.getQuerySelector(gridManagerName)} [${FAKE_TABLE_HEAD_KEY}]`);
        const { eventName, eventQuerySelector } = this.eventMap[gridManagerName].remindStart;

        const $body = jTool('body');
        const $tableDiv = base.getDiv(gridManagerName);
        $body.off(eventName, eventQuerySelector);
        $body.on(eventName, eventQuerySelector, function () {
		    let $onlyRemind = jTool(this);
			let $raArea = $onlyRemind.find('.ra-area');
			let theLeft = ($tableDiv.get(0).offsetWidth - ($onlyRemind.offset().left - $tableDiv.offset().left)) > $raArea.get(0).offsetWidth + 20;
            theLeft ? $raArea.removeClass('right-model') : $raArea.addClass('right-model');
		});
	}

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
	    base.clearBodyEvent(this.eventMap[gridManagerName]);
	}
}
export default new Remind();
