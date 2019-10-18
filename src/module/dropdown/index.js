import jTool from '@common/jTool';
import { getWrap, clearTargetEvent } from '@common/base';
import { parseTpl } from '@common/parse';
import { TOOLBAR_KEY } from '@common/constants';
import dropdownTpl from './dropdown.tpl.html';
import './style.less';
import getEvent from './event';
class Dropdown {
    eventMap = {};

    /**
     * 初始化下拉框
     * @param gridManagerName
     */
    init({ gridManagerName, defaultValue = '', onChange }) {
        this.eventMap[gridManagerName] = getEvent(gridManagerName, `[${TOOLBAR_KEY}="${gridManagerName}"]`);
        const { open, close, selected } = this.eventMap[gridManagerName];

        const $wrap = getWrap(gridManagerName);
        const $text = $wrap.find('.gm-dropdown .gm-dropdown-text');
        const $ul = $wrap.find('.gm-dropdown .gm-dropdown-list');

        $text.text(defaultValue);

        // 事件: 展示状态
        jTool(open.target).on(open.events, open.selector, function (e) {
            e.stopPropagation();
            $ul.show();

            // 事件: 关闭
            const $body = jTool(close.target);
            $body.unbind(close.events);
            $body.bind(close.events, function () {
                $body.unbind(close.events);
                $ul.hide();
            });
        });

        // 事件: 选中
        jTool(selected.target).on(selected.events, selected.selector, function () {
            const oldValue = $text.text();
            const newValue = this.value;
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
    createHtml(params) {
        const { sizeData } = params;
        let liStr = '';
        sizeData.forEach(item => {
            liStr += `<li value="${item}">${item}</li>`;
        });

        return {
            liStr
        };
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        clearTargetEvent(this.eventMap[gridManagerName]);
    }
}

export default new Dropdown();
