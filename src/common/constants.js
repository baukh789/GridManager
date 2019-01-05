/**
 * Created by baukh on 17/12/23.
 * 常量
 */
// 版本号
export const GM_VERSION = process.env.VERSION;

// 公开方法列表
export const GM_PUBLISH_METHOD_LIST = [
	'init',
	'get',
	'version',
	'getLocalStorage',
    'resetLayout',
	'clear',
	'getRowData',
    'updateRowData',
	'setSort',
    'setConfigVisible',
	'showTh',
	'hideTh',
	'exportGridToXls',
	'setQuery',
	'setAjaxData',
	'refreshGrid',
	'getCheckedTr',
	'getCheckedData',
	'setCheckedData',
	'cleanData',
	'destroy'
];

// 序号的列宽
export const ORDER_WIDTH = '50px';

// 全选的列宽
export const CHECKBOX_WIDTH = '40px';

// console样式
export const CONSOLE_STYLE = {
    LOG: ['background:#333 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#169fe6 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'],
    INFO: ['background:#333 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#169fe6 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'],
    WARN: ['background:#f90 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#169fe6 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'],
    ERROR: ['background:#f00 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#169fe6 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff']
};
