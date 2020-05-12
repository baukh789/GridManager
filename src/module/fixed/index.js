import { getWrap, getDiv, getTh, getFakeThead, getThead, getTbody } from '@common/base';
import { TABLE_KEY, EMPTY_TPL_KEY, TH_NAME, PX } from '@common/constants';
import { each } from '@jTool/utils';
import scroll from '@module/scroll';
import './style.less';

const LEFT = 'left';
const RIGHT = 'right';
const SHADOW_COLOR = '#e8e8e8';
const getStyle = (_, fakeTh, direction, shadowValue, directionValue) => {
    const $th = getTh(_, fakeTh.getAttribute(TH_NAME));

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
        const leftLen = $leftList.length;
        let shadowValue = disableLine ? '' : `inset -1px 0 ${SHADOW_COLOR}`;
        each($leftList, (item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            if (index === leftLen - 1) {
                shadowValue = `2px 1px 3px ${SHADOW_COLOR}`;
            }
            styleStr += getStyle(_, item, LEFT, shadowValue, pl);
            pl += $th.width();
            item.style.height = fakeTheadHeight;
            item.style.boxShadow = shadowValue;
        });
        $fakeThead.css('padding-left', pl);
        leftMap[_] = $leftList;

        // const theadWidth = $thead.width();
        setTimeout(() => {
            console.log($thead.width());
        });
        shadowValue = disableLine ? '' : `-1px 1px 0 ${SHADOW_COLOR}`;
        const $rightList = $fakeThead.find(getFixedQuerySelector(RIGHT));
        const rightLen = $rightList.length;
        rightMap[_] = ($rightList.DOMList || []).reverse();
        rightMap[_].forEach((item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            if (index === rightLen - 1) {
                shadowValue = `-2px 1px 3px ${SHADOW_COLOR}`;
            }
            item.style.height = fakeTheadHeight;
            item.style.boxShadow = shadowValue;
            styleStr += getStyle(_, item, RIGHT, shadowValue, pr);
            // styleStr += getStyle(_, item, RIGHT, shadowValue, index === 0 ? pr : pr + 1);
            pr += $th.width();
        });
        $fakeThead.css('padding-right', pr - 1); // todo -1是容错处理: 由于Table元素的特性需要放宽一个像素

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
        each(leftMap[_], item => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            item.style.left = scrollLeft + $th.get(0).offsetLeft + PX;
        });

        let scrollRight = theadWidth - divWidth - scrollLeft;

        // 存在Y轴滚动轴
        if (getTbody(_).height() > $tableDiv.get(0).clientHeight) {
            scrollRight += scroll.width;
        }

        // 将数组进行倒序操作
        let pr = 0;
        rightMap[_].forEach(item => {
            item.style.right = pr + scrollRight + PX;
            pr += getTh(_, item.getAttribute(TH_NAME)).width();
        });
    }
}

export default new Fixed();
