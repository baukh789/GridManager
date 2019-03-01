import { parseTpl } from '../../common';
import './style.less';
import fixedTpl from './fixed.html';

class Fixed {
    init($table, settings) {
        const tableDiv = $table.closest('.table-div');
        tableDiv.append(this.createLeftTpl(settings));
        tableDiv.append(this.createRightTpl(settings));

    }

    @parseTpl(fixedTpl)
    createLeftTpl(params) {
        console.log('columnLeftMap===>', params.columnLeftMap);
        return {
            fixed: 'left'
        };
    }

    @parseTpl(fixedTpl)
    createRightTpl(params) {
        console.log('columnRightMap===>', params.columnRightMap);
        return {
            fixed: 'right'
        };
    }
}

export default new Fixed();
