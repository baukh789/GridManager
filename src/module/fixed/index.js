/**
 * fixed[固定列]
 * 参数说明:
 *  - columnData[fixed]: 配置后同列的disableCustomize属性将强制变更为true;
 *      - type: String
 *      - value: ['left', 'right']
 *      - default: undefined
 *
 * 实现原理:
 * thead区域的固定th使用 absolute 定位，不使用sticky的原因是Firefox在设置了position: absolute的父容器内定位异常;
 * tbody区域的固定td使用 sticky 定位，通过脚本动态生成style标签;
 */
import { getWrap, getDiv, getTh, getThead, getFakeThead, getTbody, getFakeVisibleTh } from '@common/base';
import { TABLE_KEY, EMPTY_TPL_KEY, TH_NAME, PX } from '@common/constants';
import { each } from '@jTool/utils';
import jTool from '@jTool';
import scroll from '@module/scroll';
import './style.less';

const LEFT = 'left';
const RIGHT = 'right';
const SHADOW_COLOR = '#e8e8e8';
const getStyle = (_, fakeTh, direction, shadowValue, directionValue) => {
    const $th = getTh(_, fakeTh.getAttribute(TH_NAME));

    return `[gm-overflow-x="true"] [${TABLE_KEY}="${_}"] tr:not([${EMPTY_TPL_KEY}]) td:nth-of-type(${$th.index() + 1}){`
           + 'position: sticky;\n'
           + 'position: -webkit-sticky;\n' // 解决safari兼容问题
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
const FIXED_LEFT_MAP = {};
const FIXED_RIGHT_MAP = {};

class Fixed {
    enable = {};

    /**
     * 生成td固定列样式: 通过添加style的方式比修改td的dom性能会高
     * @param _
     */
    init(settings) {
        const { _, browser } = settings;
        this.enable[_] = true;

        const $tableDiv = getDiv(_);
        const disableLine = getWrap(_).hasClass('disable-line');
        const styleId = `fixed-style-${_}`;
        let styleLink = document.getElementById(styleId);

        if (!styleLink) {
            styleLink = document.createElement('style');
            styleLink.id = styleId;
        }

        const $fakeThead = getFakeThead(_);

        // theadHeight: 这里使用thead 而不是 fakeThead的原因是因为这样可以获取更准确的值，不至于在框架中出现错误
        const theadHeight = getThead(_).height() + PX;
        let styleStr = '';

        let pl = 0;
        let pr = 0;
        const $leftList = $fakeThead.find(getFixedQuerySelector(LEFT));
        const leftLen = $leftList.length;
        let shadowValue = disableLine ? '' : `inset -1px 0 ${SHADOW_COLOR}`;
        each($leftList, (item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            if (index === leftLen - 1) {
                shadowValue = `2px 0 3px ${SHADOW_COLOR}`;
            }
            styleStr += getStyle(_, item, LEFT, shadowValue, pl);
            pl += $th.width();
            item.style.height = theadHeight;
            item.style.boxShadow = shadowValue;
        });

        // 兼容性处理: safari 需要-1
        if (browser === 'safari') {
            pl--;
        }
        $fakeThead.css('padding-left', pl);
        FIXED_LEFT_MAP[_] = $leftList;

        shadowValue = disableLine ? '' : `-1px 1px 0 ${SHADOW_COLOR}`;
        const $rightList = $fakeThead.find(getFixedQuerySelector(RIGHT));
        const rightLen = $rightList.length;
        FIXED_RIGHT_MAP[_] = ($rightList.get() || []).reverse();
        FIXED_RIGHT_MAP[_].forEach((item, index) => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            if (index === rightLen - 1) {
                shadowValue = `-2px 0 3px ${SHADOW_COLOR}`;
            }
            item.style.height = theadHeight;
            item.style.boxShadow = shadowValue;
            styleStr += getStyle(_, item, RIGHT, shadowValue, pr);
            pr += $th.width();
        });
        $fakeThead.css('padding-right', pr - 1); // -1是容错处理: 由于Table元素的特性需要放宽一个像素(todo 需要验证现在是否还需要)

        styleLink.innerHTML = styleStr;
        $tableDiv.append(styleLink);

        this.updateBeforeTh(_);
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

        // left fixed
        const scrollLeft = $tableDiv.scrollLeft();
        each(FIXED_LEFT_MAP[_], item => {
            const $th = getTh(_, item.getAttribute(TH_NAME));
            item.style.left = scrollLeft + $th.get(0).offsetLeft + PX;
        });

        let scrollRight = theadWidth - divWidth - scrollLeft;

        // 存在Y轴滚动轴
        if (getTbody(_).height() > $tableDiv.get(0).clientHeight) {
            scrollRight += scroll.width;
        }

        // right fixed
        let pr = 0;
        FIXED_RIGHT_MAP[_].forEach(item => {
            item.style.right = pr + scrollRight + PX;
            pr += getTh(_, item.getAttribute(TH_NAME)).width();
        });
    }

    /**
     * 更新right fixed previous标识
     * @param _
     */
    updateBeforeTh(_) {
        // 当前不存在 right fixed
        if (!this.enable[_] || !FIXED_RIGHT_MAP[_] || !FIXED_RIGHT_MAP[_].length) {
            return;
        }

        const fixedPrevious = 'fixed-previous';
        const len = FIXED_RIGHT_MAP[_].length;
        const $th = jTool(FIXED_RIGHT_MAP[_].slice(len - 1, len));
        const $allVisibleTh = getFakeVisibleTh(_);
        const index = $th.index($allVisibleTh);

        $allVisibleTh.removeAttr(fixedPrevious);
        $allVisibleTh.eq(index - 1).attr(fixedPrevious, '');
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_) {
        delete FIXED_LEFT_MAP[_];
        delete FIXED_RIGHT_MAP[_];
    }
}

export default new Fixed();
