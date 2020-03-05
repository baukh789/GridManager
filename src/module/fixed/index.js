import jTool from '@jTool';
import { getDiv, getTh, getFakeThead, getThead } from '@common/base';
import { each } from '@jTool/utils';
import './style.less';

class Fixed {
    // 存储启用状态
    enable = {};

    /**
     * 渲染fake thead: 在scroll事件中触发，原因是fake thead使用了绝对定位，在th使用sticky时，需要实时修正left | right值
     * @param gridManagerName
     */
    updateFakeThead(gridManagerName) {
        if (!this.enable[gridManagerName]) {
            return;
        }
        // const $wrap = getWrap(gridManagerName);
        const $fakeThead = getFakeThead(gridManagerName);
        const $tableDiv = getDiv(gridManagerName);
        const scrollLeft = $tableDiv.scrollLeft();
        const $fixedList = $fakeThead.find('th[fixed="left"]');

        each($fixedList, (index, item) => {
            item.style.left = -(scrollLeft - getTh(gridManagerName, item.getAttribute('th-name')).get(0).offsetLeft) + 'px';
            index === $fixedList.length - 1 && item.setAttribute('fixed-border', '');
        });

        const $rightList = $fakeThead.find('th[fixed="right"]');
        const theadWidth = $fakeThead.width();

        // const scrollWidth = $tableDiv.width() < $tableDiv.get(0).scrollHeight ? 10 : 0;
        each($rightList, (index, item) => {
            // todo 需要处理由于滚动Y轴出现造成的right大10px的问题
            const $th = getTh(gridManagerName, item.getAttribute('th-name'));
            item.style.right = (theadWidth - $th.get(0).offsetLeft + scrollLeft - $th.width())  + 'px';
            // item.style.right = -(theadWidth - $th.get(0).offsetLeft - $th.width() - scrollLeft) + 'px';
            index === 0 && item.setAttribute('fixed-border', '');
        });
    }

    /**
     * 生成td固定列样式: 通过添加style的方式比修改td的dom性能会高
     * @param gridManagerName
     */
    init(gridManagerName) {
        if (!this.enable[gridManagerName]) {
            return;
        }
        const $thead = getThead(gridManagerName);
        const $tableDiv = getDiv(gridManagerName);
        const theadWidth = $thead.width();
        let styleLink = $tableDiv.get(0).querySelector(`#fixed-style-${gridManagerName}`);

        if (!styleLink) {
            styleLink = document.createElement('style');
            styleLink.id = `fixed-style-${gridManagerName}`;
        }
        let styleStr = '';
        const $fixedLeft = $thead.find('th[fixed="left"]');
        let shadowValue = '';
        each($fixedLeft, (index, item) => {
            if (index === $fixedLeft.length - 1) {
                shadowValue = '2px 0 3px #e8e8e8';
            } else {
                shadowValue = '1px 0 0 #e8e8e8;';
            }

            styleStr += `
            [gm-overflow-x="true"] [grid-manager="${gridManagerName}"] tr:not([empty-template]) td:nth-child(${jTool(item).index() + 1}){
                position: sticky;
                left: ${item.offsetLeft}px;
                z-index: 3;
                box-shadow: ${shadowValue};
            }`;
        });

        each($thead.find('th[fixed="right"]'), (index, item) => {
            if (index === 0) {
                shadowValue = '2px 0 3px #e8e8e8';
            } else {
                shadowValue = '1px 0 0 #e8e8e8;';
            }
            styleStr += `
            [gm-overflow-x="true"] [grid-manager="${gridManagerName}"] tr:not([empty-template]) td:nth-child(${jTool(item).index() + 1}){
                position: sticky;
                right: ${theadWidth - item.offsetLeft - item.offsetWidth}px;
                z-index: 3;
                box-shadow: -${shadowValue};
            }`;
        });
        styleLink.innerHTML = styleStr;
        $tableDiv.append(styleLink);
    }
}

export default new Fixed();
