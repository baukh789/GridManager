/**
 * Created by baukh on 17/12/23.
 * 常量
 */
// 版本号
export const GM_VERSION = process.env.VERSION;

// 表格唯一key
export const TABLE_KEY = 'grid-manager';

// 表格外围唯一key
export const WRAP_KEY = 'grid-manager-wrap';

// 表格的核心区域div唯一key
export const DIV_KEY = 'grid-manager-div';

// 配置区域唯一key
export const CONFIG_KEY = 'grid-manager-config';

// 底部工具唯一key
export const TOOLBAR_KEY = 'grid-manager-toolbar';

// 菜单唯一key
export const MENU_KEY = 'grid-master';

// table head key
export const TABLE_HEAD_KEY = 'grid-manager-thead';

// 吸顶head所使用的key
export const FAKE_TABLE_HEAD_KEY = 'grid-manager-mock-thead';

// tr 上 cache key
export const TR_CACHE_KEY = 'cache-key';

// 用户记忆 localStorage key
export const MEMORY_KEY = 'GridManagerMemory';

// 版本信息 localStorage key
export const VERSION_KEY = 'GridManagerVersion';

// 缓存错误 key
export const CACHE_ERROR_KEY = 'grid-manager-cache-error';

// 空模板属性 key
export const EMPTY_TPL_KEY = 'empty-template';

// 序号的列宽
export const ORDER_WIDTH = '50px';

// 全选的列宽
export const CHECKBOX_WIDTH = '40px';

// 禁用文本选中Class Name
export const NO_SELECT_CLASS_NAME = 'no-select-text';

// 空数据Class Name
export const EMPTY_DATA_CLASS_NAME = 'empty-data';

// 渲染完成标识 Class Name
export const READY_CLASS_NAME = 'GridManager-ready';

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

// console样式
const __getStyle = bgColor => {
    return [`background:${bgColor} ; height: 18px;line-height: 18px; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff`, 'background:#169fe6 ; height: 18px;line-height: 18px; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'];
};

export const CONSOLE_INFO = 'Info';
export const CONSOLE_WARN = 'Warn';
export const CONSOLE_ERROR = 'Error';
export const CONSOLE_STYLE = {
    [CONSOLE_INFO]: __getStyle('#333'),
    [CONSOLE_WARN]: __getStyle('#f90'),
    [CONSOLE_ERROR]: __getStyle('#f00')
};
