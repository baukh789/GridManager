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

// table body key
export const TABLE_BODY_KEY = 'grid-manager-tbody';

// th唯一名称
export const TH_NAME = 'th-name';

// tr cache key
export const TR_CACHE_KEY = 'gm-cache-key';

// tr level key
export const TR_LEVEL_KEY = 'gm-level-key';

// tr 上一层级的 cache key
export const TR_PARENT_KEY = 'parent-key';

// tr 子行的展示状态
export const TR_CHILDREN_STATE = 'children-state';

// 行 禁用选中
export const ROW_DISABLED_CHECKBOX = 'gm_checkbox_disabled';

// 行自定义class name
export const ROW_CLASS_NAME = 'gm_row_class_name';

// 用户记忆 localStorage key
export const MEMORY_KEY = 'GridManagerMemory';

// 版本信息 localStorage key
export const VERSION_KEY = 'GridManagerVersion';

// 缓存错误 key
export const CACHE_ERROR_KEY = 'grid-manager-cache-error';

// 空模板属性 key
export const EMPTY_TPL_KEY = 'empty-template';

// order width
export const ORDER_WIDTH = 50;

// fold: key
export const FOLD_KEY = 'gm_fold';

// order: key
export const ORDER_KEY = 'gm_order';

// checkbox width
export const CHECKBOX_WIDTH = 40;

// moverow key
export const MOVEROW_KEY = 'gm_moverow';

// checkbox key
export const CHECKBOX_KEY = 'gm_checkbox';

// checkbox 禁用标识
export const CHECKBOX_DISABLED_KEY = CHECKBOX_KEY + '_disabled';

// 禁用文本选中Class Name
export const NO_SELECT_CLASS_NAME = 'no-select-text';

// 空数据Class Name
export const EMPTY_DATA_CLASS_NAME = 'empty-data';

// 渲染完成标识 Class Name
export const READY_CLASS_NAME = 'gm-ready';

// 加载中 Class Name
export const LOADING_CLASS_NAME = 'gm-load-area';

// 最后一列可视列 标识
export const LAST_VISIBLE = 'last-visible';

// 单元格不可见 标识
export const CELL_HIDDEN = 'cell-hidden';

// GM自动创建 标识
export const GM_CREATE = 'gm-create';

// table在实例化后，会更改到的属性值列表
export const TABLE_PURE_LIST = ['class', 'style'];

// 选中
export const CHECKED = 'checked';

// 半选中
export const INDETERMINATE = 'indeterminate';

// 未选中
export const UNCHECKED = 'unchecked';

// 选中ClassName
export const CHECKED_CLASS = `gm-checkbox-${CHECKED}`;

// 半选中ClassName
export const INDETERMINATE_CLASS = `gm-checkbox-${INDETERMINATE}`;

// 禁用ClassName
export const DISABLED_CLASS_NAME = 'disabled';

// 表头提醒ClassName
export const REMIND_CLASS = 'gm-remind-action';

// 排序ClassName
export const SORT_CLASS = 'gm-sorting-action';

// 偶数行标识，不直接使用css odd是由于存在层级数据时无法排除折叠元素
export const ODD = 'odd';

// 该列是否禁止使用个性配置功能(宽度调整、位置更换、列的显示隐藏)
export const DISABLE_CUSTOMIZE = 'disableCustomize';

// 像素
export const PX = 'px';
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
