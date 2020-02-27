import jTool from '@jTool';
import { getWrap, getFakeTh, getFakeThead } from '@common/base';
import { CHECKBOX_KEY, ORDER_KEY } from '@common/constants';
import fixedTpl from './fixed.html';
import './style.less';

class Fixed {
    // todo 使用fixed 的列应该禁用宽度调整与位置更换功能
    // tbody区域使用的是模板，可以考虑在渲染模板时直接渲染至固定列中？
    init(gridManagerName) {
        const $tableWrap = getWrap(gridManagerName);

        const fixedLeft = document.createElement('div');
        fixedLeft.className = 'gm-fixed';
        fixedLeft.setAttribute('fixed-left', gridManagerName);
        fixedLeft.innerHTML = fixedTpl;
        $tableWrap.append(fixedLeft);

        const fixedRight = document.createElement('div');
        fixedRight.className = 'gm-fixed';
        fixedRight.setAttribute('fixed-right', gridManagerName);
        fixedRight.innerHTML = fixedTpl;
        $tableWrap.append(fixedRight);

        const $leftThead = jTool(`[fixed-left="${gridManagerName}"] thead tr`);
        const $rightThead = jTool(`[fixed-right="${gridManagerName}"] thead tr`);

        console.log($leftThead);
        // fixedLeft.find('.fixed-head').get(0).innerHTML = '<table><thead><tr></tr></thead></table>';
        $leftThead.height(getFakeThead(gridManagerName).height());
        $leftThead.append(getFakeTh(gridManagerName, CHECKBOX_KEY));
        $leftThead.append(getFakeTh(gridManagerName, ORDER_KEY));

        $rightThead.height(getFakeThead(gridManagerName).height());
        $rightThead.append(getFakeTh(gridManagerName, 'action'));

        console.log(getFakeTh(gridManagerName, CHECKBOX_KEY));
    }
}

export default new Fixed();
