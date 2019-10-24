/**
 * Created by baukh on 17/12/23.
 * 常量
 */
// 版本号
export const GM_VERSION = process.env.VERSION;

// 表格唯一key
export const TABLE_KEY = 'grid-manager';

// 正在渲染中的标识
export const RENDERING_KEY = 'gm-rendering';

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

// th唯一名称
export const TH_NAME = 'th-name';

// tr cache key
export const TR_CACHE_KEY = 'gm-cache-key';

// tr cache row data
export const TR_CACHE_ROW = 'gm-cache-row';

// tr level key
export const TR_LEVEL_KEY = 'gm-level-key';

// tr 上一层级的 cache key
export const TR_PARENT_KEY = 'parent-key';

// tr 子行的展示状态
export const TR_CHILDREN_STATE = 'children-state';

// 行属性 禁用
export const COL_PROP_DISABLED = 'gm_checkbox_disabled';

// 用户记忆 localStorage key
export const MEMORY_KEY = 'GridManagerMemory';

// 版本信息 localStorage key
export const VERSION_KEY = 'GridManagerVersion';

// 缓存错误 key
export const CACHE_ERROR_KEY = 'grid-manager-cache-error';

// 空模板属性 key
export const EMPTY_TPL_KEY = 'empty-template';

// order width
export const ORDER_WIDTH = '50px';

// order: key
export const ORDER_KEY = 'gm_order';

// checkbox width
export const CHECKBOX_WIDTH = '40px';

// checkbox key
export const CHECKBOX_KEY = 'gm_checkbox';

// checkbox 禁用标识
export const CHECKBOX_DISABLED_KEY = CHECKBOX_KEY + '_disabled';

// 禁用文本选中Class Name
export const NO_SELECT_CLASS_NAME = 'no-select-text';

// 空数据Class Name
export const EMPTY_DATA_CLASS_NAME = 'empty-data';

// 渲染完成标识 Class Name
export const READY_CLASS_NAME = 'GridManager-ready';

// 加载中 Class Name
export const LOADING_CLASS_NAME = 'gm-load-area';

// 最后一列可视列 标识
export const LAST_VISIBLE = 'last-visible';

// th的可视状 标识
export const TH_VISIBLE = 'th-visible';

// GM自动创建 标识
export const GM_CREATE = 'gm-create';

// table在实例化后，会更改到的属性值列表
export const TABLE_PURE_LIST = ['class', 'style'];

// 选中
export const CHECKED = 'checked';

// 半选中
export const INDETERMINATE = 'indeterminate';

// 全选
export const UNCHECKED = 'unchecked';

// 选中ClassName
export const CHECKED_CLASS = `gm-checkbox-${CHECKED}`;

// 半选中ClassName
export const INDETERMINATE_CLASS = `gm-checkbox-${INDETERMINATE}`;

// 禁用ClassName
export const DISABLED_CLASS_NAME = 'disabled';

// 公开方法列表
// export const GM_PUBLISH_METHOD_LIST = [
// 	'init',
// 	'get',
// 	'version',
// 	'getLocalStorage',
//  'resetLayout',
// 	'clear',
// 	'getRowData',
//  'updateRowData',
// 	'setSort',
//  'setConfigVisible',
// 	'showTh',
// 	'hideTh',
// 	'exportGridToXls',
// 	'setQuery',
// 	'setAjaxData',
// 	'refreshGrid',
// 	'getCheckedTr',
// 	'getCheckedData',
// 	'setCheckedData',
//  'updateTreeState',
// 	'cleanData',
// 	'destroy'
// ];

// console样式
const getStyle = bgColor => {
    return [`background:${bgColor};height:18px;line-height:18px;padding:1px;border-radius:3px 0 0 3px;color:#fff`, 'background:#169fe6;height:18px;line-height:18px;padding:1px;border-radius:0 3px 3px 0;color:#fff'];
};

export const CONSOLE_INFO = 'Info';
export const CONSOLE_WARN = 'Warn';
export const CONSOLE_ERROR = 'Error';
export const CONSOLE_STYLE = {
    [CONSOLE_INFO]: getStyle('#333'),
    [CONSOLE_WARN]: getStyle('#f90'),
    [CONSOLE_ERROR]: getStyle('#f00')
};

export const EVENT_CLICK = 'click';
