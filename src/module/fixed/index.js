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
import { getFakeTh, getDiv, getThead, getFakeThead, getTbody, getFakeVisibleTh } from '@common/base';
import { DIV_KEY, EMPTY_TPL_KEY, PX } from '@common/constants';
import { each } from '@jTool/utils';
import scroll from '@module/scroll';
import './style.less';

const LEFT = 'left';
const RIGHT = 'right';
const SHADOW_COLOR = '#e8e8e8';
const getStickyCss = (_, index, direction, shadowValue, directionValue) => {
    return `[${DIV_KEY}="${_}"][gm-overflow-x="true"] tr:not([${EMPTY_TPL_KEY}]) td:nth-of-type(${index + 1}){`
           + 'position: sticky;\n'
           + 'position: -webkit-sticky;\n' // 解决safari兼容问题
           + `${direction}: ${directionValue + PX};\n`
           + 'z-index: 3;\n'
           + `box-shadow: ${shadowValue};`
        + '}';
};

// 存储DOM节点，用于节省DOM查询操作(在scroll和adjust中操作会很频繁)
const FIXED_LEFT_MAP = {};
const FIXED_RIGHT_MAP = {};

class Fixed {
    /**
     * 生成td固定列样式: 通过添加style的方式比修改td的dom性能会高
     * @param _
     */
    init(settings) {
        const { _, browser, columnMap } = settings;

        const $tableDiv = getDiv(_);
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
        const leftList = [];
        const rightList = [];
        each(columnMap, (key, col) => {
            if (col.fixed === 'left') {
               leftList.push(col);
           }
            if (col.fixed === 'right') {
                rightList.push(col);
            }
        });
        const leftLen = leftList.length;
        let shadowValue = 'none';
        FIXED_LEFT_MAP[_] = leftList.sort((a, b) => a.index - b.index);
        each(FIXED_LEFT_MAP[_], (col, index) => {
            const $fakeTh = getFakeTh(_, col.key);
            if (index === leftLen - 1) {
                shadowValue = `2px 0 4px ${SHADOW_COLOR}`;
            }
            styleStr += getStickyCss(_, col.index, LEFT, shadowValue, pl);
            col.pl = pl;
            pl += parseInt(col.width, 10);
            $fakeTh.css({
                height: theadHeight,
                lineHeight: theadHeight,
                boxShadow: shadowValue
            });
        });

        // 兼容性处理: safari 需要-1
        if (browser === 'safari') {
            pl--;
        }
        $fakeThead.css('padding-left', pl);

        shadowValue = 'none';
        const rightLen = rightList.length;
        FIXED_RIGHT_MAP[_] = rightList.sort((a, b) => b.index - a.index);
        FIXED_RIGHT_MAP[_].forEach((col, index) => {
            const $fakeTh = getFakeTh(_, col.key);
            if (index === rightLen - 1) {
                shadowValue = `-2px 0 4px ${SHADOW_COLOR}`;
            }
            $fakeTh.css({
                height: theadHeight,
                lineHeight: theadHeight,
                boxShadow: shadowValue
            });
            styleStr += getStickyCss(_, col.index, RIGHT, shadowValue, pr);
            col.pr = pr;
            pr += parseInt(col.width, 10);
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
        // left fixed
        if (FIXED_LEFT_MAP[_] && FIXED_LEFT_MAP[_].length) {
            const scrollLeft = getDiv(_).scrollLeft();
            each(FIXED_LEFT_MAP[_], col => {
                getFakeTh(_, col.key).css('left', col.pl + scrollLeft);
            });
        }

        // right fixed
        if (FIXED_RIGHT_MAP[_] && FIXED_RIGHT_MAP[_].length) {
            const $tableDiv = getDiv(_);
            let scrollRight = getFakeThead(_).width() - $tableDiv.width() - $tableDiv.scrollLeft();

            // 存在Y轴滚动轴
            if (getTbody(_).height() > $tableDiv.get(0).clientHeight) {
                scrollRight += scroll.width;
            }

            FIXED_RIGHT_MAP[_].forEach(col => {
                getFakeTh(_, col.key).css('right', col.pr + scrollRight);
            });
        }
    }

    /**
     * 更新right fixed previous标识
     * @param _
     */
    updateBeforeTh(_) {
        // 当前不存在 right fixed
        if (!FIXED_RIGHT_MAP[_] || !FIXED_RIGHT_MAP[_].length) {
            return;
        }

        const fixedPrevious = 'fixed-previous';
        const $firstFixedFakeTh = getFakeThead(_).find('th[fixed="right"]').eq(0);
        const $allVisibleTh = getFakeVisibleTh(_);
        const index = $firstFixedFakeTh.index($allVisibleTh);

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
