import { getWrap, getDiv, getTh, getFakeThead, getThead } from '@common/base';
import { TABLE_KEY, EMPTY_TPL_KEY, TH_NAME, PX } from '@common/constants';
import { each } from '@jTool/utils';
import './style.less';

const LEFT = 'left';
const RIGHT = 'right';
const SHADOW_COLOR = '#e8e8e8';
const getStyle = (_, fakeTh, direction, shadowValue, theadWidth) => {
    const $th = getTh(_, fakeTh.getAttribute(TH_NAME));
    const th = $th.get(0);
    let directionValue = '';
    if (direction === LEFT) {
        directionValue = th.offsetLeft;
    }
    if (direction === RIGHT) {
        directionValue = theadWidth - th.offsetLeft - th.offsetWidth;
    }
    return `[gm-overflow-x="true"] [${TABLE_KEY}="${_}"] tr:not([${EMPTY_TPL_KEY}]) td:nth-of-type(${$th.index() + 1}){`
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

// 存储DOM节点，用于节省DOM查询操作(在scroll和adjust中操作会很频繁)
const leftMap = {};
const rightMap = {};

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

        const $fakeThead = getFakeThead(_);
        const fakeTheadHeight = $fakeThead.height() + PX;
        let styleStr = '';

        let pl = 0;
        let pr = 0;
        const $leftList = $fakeThead.find(getFixedQuerySelector(LEFT));
        let shadowValue = disableLine ? '' : `inset -1px 0 ${SHADOW_COLOR}`;
        each($leftList, (item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            if (index === $leftList.length - 1) {
                shadowValue = `2px 1px 3px ${SHADOW_COLOR}`;
                // item.setAttribute(fixedBorderAttr, '');
            }
            pl += $th.width();
            item.style.height = fakeTheadHeight;
            item.style.boxShadow = shadowValue;
            styleStr += getStyle(_, item, LEFT, shadowValue);
        });
        $fakeThead.css('padding-left', pl);
        leftMap[_] = $leftList;

        const theadWidth = $thead.width();
        shadowValue = `-2px 1px 3px ${SHADOW_COLOR}`;
        const $rightList = $fakeThead.find(getFixedQuerySelector(RIGHT));
        each($rightList, (item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            if (index !== 0) {
                shadowValue = disableLine ? '' : `-1px 1px 0 ${SHADOW_COLOR}`;
            }
            item.style.height = fakeTheadHeight;
            item.style.boxShadow = shadowValue;
            pr += $th.width();
            styleStr += getStyle(_, item, RIGHT, shadowValue, theadWidth);
        });
        $fakeThead.css('padding-right', pr - 1); // todo -1是容错处理: 由于Table元素的特性需要放宽一个像素
        rightMap[_] = ($rightList.DOMList || []).reverse();

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

        const $fakeThead = getFakeThead(_);
        const $tableDiv = getDiv(_);
        const divWidth = $tableDiv.width();
        const theadWidth = $fakeThead.width();

        // todo 这里的性能需要进行优化
        const scrollLeft = $tableDiv.scrollLeft();
        each(leftMap[_], (item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            item.style.left = scrollLeft + $th.get(0).offsetLeft + PX;
        });

        let scrollRight = theadWidth - divWidth - scrollLeft;

        // Chrome 的滚动轴通过样式控制了宽度，所以需要增加10个像素 todo 如果后贯还有类似的操作，需要将这个判断抽取为工具函数
        if (navigator.userAgent.indexOf('Chrome') > -1) {
            scrollRight += 10;
        }

        // 将数组进行倒序操作
        let pr = 0;
        rightMap[_].forEach((item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            item.style.right = pr + scrollRight  + PX;
            pr += $th.width();
        });
    }

    /**
     * 消毁 todo 需要确认是否需要
     * @param _
     */
    // destroy(_) {
    //     delete leftMap[_];
    //     delete rightMap[_];
    // }
}

export default new Fixed();
