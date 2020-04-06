import jTool from '@jTool';
import { getWrap, getDiv, getTh, getFakeThead, getThead } from '@common/base';
import { TABLE_KEY, EMPTY_TPL_KEY, TH_NAME, PX } from '@common/constants';
import { each } from '@jTool/utils';
import './style.less';

const LEFT = 'left';
const RIGHT = 'right';
const SHADOW_COLOR = '#e8e8e8';
const getStyle = (_, item, direction, shadowValue, theadWidth) => {
    let directionValue = '';
    if (direction === LEFT) {
        directionValue = item.offsetLeft;
    }
    if (direction === RIGHT) {
        directionValue = theadWidth - item.offsetLeft - item.offsetWidth;
    }
    return `[gm-overflow-x="true"] [${TABLE_KEY}="${_}"] tr:not([${EMPTY_TPL_KEY}]) td:nth-of-type(${jTool(item).index() + 1}){`
           + 'position: sticky;\n'
           + `${direction}: ${directionValue + PX};\n`
           + 'border-right: none;\n'
           + 'z-index: 3;\n'
           + `box-shadow: ${shadowValue};`
        + '}';
};

const getFixedQuerySelector = type => {
    return `th[fixed="${type}"]`;
};
class Fixed {
    enable = {};

    /**
     * 生成td固定列样式: 通过添加style的方式比修改td的dom性能会高
     * @param _
     */
    init(_) {
        this.enable[_] = true;

        const $thead = getThead(_);
        const $tableDiv = getDiv(_);
        const disableLine = getWrap(_).hasClass('disable-line');
        const styleId = `fixed-style-${_}`;
        let styleLink = document.getElementById(styleId);

        if (!styleLink) {
            styleLink = document.createElement('style');
            styleLink.id = styleId;
        }
        let styleStr = '';
        const $fixedLeft = $thead.find(getFixedQuerySelector(LEFT));
        let shadowValue = disableLine ? '' : `inset -1px 0 ${SHADOW_COLOR}`;
        each($fixedLeft, (item, index) => {
            if (index === $fixedLeft.length - 1) {
                shadowValue = `2px 1px 3px ${SHADOW_COLOR}`;
            }

            styleStr += getStyle(_, item, LEFT, shadowValue);
        });
        const theadWidth = $thead.width();
        shadowValue = `-2px 1px 3px ${SHADOW_COLOR}`;
        each($thead.find(getFixedQuerySelector(RIGHT)), (item, index) => {
            if (index !== 0) {
                shadowValue = disableLine ? '' : `-1px 1px 0 ${SHADOW_COLOR}`;
            }
            styleStr += getStyle(_, item, RIGHT, shadowValue, theadWidth);
        });
        styleLink.innerHTML = styleStr;
        $tableDiv.append(styleLink);
    }

    /**
     * 渲染fake thead: 在scroll事件中触发，原因是fake thead使用了绝对定位，在th使用sticky时，需要实时修正left | right值
     * @param _
     */
    updateFakeThead(_) {
        if (!this.enable[_]) {
            return;
        }

        const fixedBorderAttr = 'fixed-border';
        const $fakeThead = getFakeThead(_);
        const $tableDiv = getDiv(_);
        const scrollLeft = $tableDiv.scrollLeft();
        const $fixedList = $fakeThead.find(getFixedQuerySelector(LEFT));

        each($fixedList, (item, index) => {
            item.style.left = -(scrollLeft - getTh(_, item.getAttribute(TH_NAME)).get(0).offsetLeft) + PX;
            index === $fixedList.length - 1 && item.setAttribute(fixedBorderAttr, '');
        });

        const $rightList = $fakeThead.find(getFixedQuerySelector(RIGHT));
        const theadWidth = $fakeThead.width();

        each($rightList, (item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            item.style.right = (theadWidth - $th.get(0).offsetLeft + scrollLeft - $th.width())  + PX;
            index === 0 && item.setAttribute(fixedBorderAttr, '');
        });
    }
}

export default new Fixed();
