import { getDiv, getTh, getFakeThead } from '@common/base';
import { each } from '@jTool/utils';
import './style.less';

class Fixed {
    // 存储启用状态
    enable = {};

    // todo 使用fixed 的列应该禁用宽度调整与位置更换功能
    // tbody区域使用的是模板，可以考虑在渲染模板时直接渲染至固定列中？
    init(gridManagerName) {
        // const $wrap = getWrap(gridManagerName);
        const $fakeThead = getFakeThead(gridManagerName);
        const $tableDiv = getDiv(gridManagerName);
        const scrollLeft = $tableDiv.scrollLeft();
        const $fixedList = $fakeThead.find('th[fixed="left"]');
        each($fixedList, (index, item) => {
            item.style.left = -(scrollLeft - getTh(gridManagerName, item.getAttribute('th-name')).get(0).offsetLeft) + 'px';
        });

        const $rightList = $fakeThead.find('th[fixed="right"]');
        const theadWidth = $fakeThead.width();
        each($rightList, (index, item) => {
            // todo 需要处理由于滚动Y轴出现造成的right大10px的问题
            const $th = getTh(gridManagerName, item.getAttribute('th-name'));
            item.style.right = -(theadWidth - $th.get(0).offsetLeft - $th.width() - scrollLeft) + 'px';
        });
    }
}

export default new Fixed();
