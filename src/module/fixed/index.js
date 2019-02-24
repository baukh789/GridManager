import { parseTpl } from "../../common";
import './style.less';
import fixedTpl from './fixed.html';

class Fixed {
    init($table, settings) {
        const tableDiv = $table.closest('.table-div');
        tableDiv.append(this.createLeftTpl(settings));
        tableDiv.append(this.createRightTpl(settings));

        console.log(settings.columnRightMap);
    }

    @parseTpl(fixedTpl)
    createLeftTpl(params) {
        return {
            fixed: 'left'
        };
    }

    @parseTpl(fixedTpl)
    createRightTpl(params) {
        return {
            fixed: 'right'
        };
    }
}

export default new Fixed();
