import jTool from '@jTool';
import { getWrap, clearTargetEvent } from '@common/base';
import { parseTpl } from '@common/parse';
import { TOOLBAR_KEY } from '@common/constants';
import dropdownTpl from './dropdown.tpl.html';
import './style.less';
import { getEvent, eventMap } from './event';
import { EVENTS, TARGET, SELECTOR } from '@common/events';

class Dropdown {
    /**
     * 初始化下拉框
     * @param _
     */
    init({ _, defaultValue = '', onChange }: { _: string, defaultValue: string, onChange: any}): void {
        eventMap[_] = getEvent(`[${TOOLBAR_KEY}="${_}"]`);
        const { open, close, selected } = eventMap[_];

        const $dropdown = getWrap(_).find('.gm-dropdown');
        const $text = $dropdown.find('.gm-dropdown-text');
        const $ul = $dropdown.find('.gm-dropdown-list');

        $text.text(defaultValue);

        // 事件: 展示状态
        jTool(open[TARGET]).on(open[EVENTS], open[SELECTOR], function (e: MouseEvent) {
            e.stopPropagation();
            // 事件: 关闭
            const $close = jTool(close[TARGET]);
            if ($ul.css('display') === 'block') {
                $ul.hide();
                $close.unbind(close[EVENTS]);
                return;
            }

            // 事件: 打开
            $ul.show();

            const closeEvents = close[EVENTS];
            $close.unbind(closeEvents);
            $close.bind(closeEvents, function () {
                $close.unbind(closeEvents);
                $ul.hide();
            });
        });

        // 事件: 选中
        jTool(selected[TARGET]).on(selected[EVENTS], selected[SELECTOR], function () {
            const oldValue = parseInt($text.text(), 10);
            const newValue = this.value;
            if (oldValue === newValue) {
                return;
            }
            $text.text(newValue);
            onChange(newValue, oldValue);
        });
    }

    /**
     * 生成html
     * @param params
     * @returns {{liStr: string}}
     */
    @parseTpl(dropdownTpl)
    createHtml(params: any): string {
        const { sizeData } = params;
        let liStr = '';
        sizeData.forEach((item: number) => {
            liStr += `<li value="${item}">${item}</li>`;
        });

        // @ts-ignore
        return {
            li: liStr
        };
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_: string): void {
        clearTargetEvent(eventMap[_]);
    }
}

export default new Dropdown();
