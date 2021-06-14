import { ROW_HIDE_KEY } from '@common/constants';
import { mergeRow } from '@module/merge';
import './style.less';

export const showRow = (settings, $tr) => {
    $tr.attr(ROW_HIDE_KEY, 'out');
    setTimeout(() => {
        $tr.removeAttr(ROW_HIDE_KEY);
        mergeRow(settings._, settings.columnMap);
    }, 500);
};

export const hideRow = (settings, $tr) => {
    $tr.attr(ROW_HIDE_KEY, 'ing');
    setTimeout(() => {
        $tr.attr(ROW_HIDE_KEY, 'true');
        mergeRow(settings._, settings.columnMap);
    }, 500);
};
