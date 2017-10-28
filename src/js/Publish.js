/**
 * Created by baukh on 17/4/14.
 * 公开方法
 * 参数中的table, 将由组件自动添加
 */
import GridManager from './GridManager';
class PublishMethodClass {
	constructor() {
		/*
		 * 通过jTool实例获取GridManager
		 * */
		this.get = table => {
			return GridManager.get(table);
		};

		/*
		 * 获取指定表格的本地存储数据
		 * */
		this.getLocalStorage = table => {
			return GridManager.getLocalStorage(table);
		};

		/*
		 * 清除指定表的表格记忆数据
		 * */
		this.clear = table => {
			return GridManager.clear(table);
		};

		/*
		 * @获取当前行渲染时使用的数据
		 * */
		this.getRowData = (table, target) => {
			return GridManager.getRowData(table, target);
		};

		/*
		 * 手动设置排序
		 * */
		this.setSort = (table, sortJson, callback, refresh) => {
			GridManager.setSort(table, sortJson, callback, refresh);
		};

		/*
		 * 显示Th及对应的TD项
		 * */
		this.showTh = (table, target) => {
			GridManager.showTh(table, target);
		};

		/*
		 * 隐藏Th及对应的TD项
		 * */
		this.hideTh = (table, target) => {
			GridManager.hideTh(table, target);
		};

		/*
		 * 导出表格 .xls
		 * */
		this.exportGridToXls = (table, fileName, onlyChecked) => {
			return GridManager.exportGridToXls(table, fileName, onlyChecked);
		};

		/**
		 * 设置查询条件
		 */
		this.setQuery = (table, query, isGotoFirstPage, callback) => {
			GridManager.setQuery(table, query, isGotoFirstPage, callback);
		};

		/**
		 * 配置静态数ajaxData
		 */
		this.setAjaxData = (table, ajaxData) => {
			GridManager.setAjaxData(table, ajaxData);
		};

		/*
		 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
		 * */
		this.refreshGrid = (table, isGotoFirstPage, callback) => {
			GridManager.refreshGrid(table, isGotoFirstPage, callback);
		};

		/*
		 * 获取当前选中的行
		 * */
		this.getCheckedTr = table => {
			return GridManager.getCheckedTr(table);
		};

		/*
		 * 获取当前选中行渲染时使用的数据
		 * */
		this.getCheckedData = table => {
			return GridManager.getCheckedData(table);
		};
	}
}

/*
	//对外公开方法展示
	'init',					// 初始化方法
	'setSort',				// 手动设置排序
	'get',					// 通过jTool实例获取GridManager
	'showTh',				// 显示Th及对应的TD项
	'hideTh',				// 隐藏Th及对应的TD项
	'exportGridToXls',		// 导出表格 .xls
	'getLocalStorage',		// 获取指定表格的本地存储数据
	'setQuery',				// 配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	'setAjaxData',          // 用于再次配置ajax_data数据, 配置后会根据配置的数据即刻刷新表格
	'refreshGrid',			// 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	'getCheckedTr',			// 获取当前选中的行
	'getRowData',			// 获取当前行渲染时使用的数据
	'getCheckedData',		// 获取当前选中行渲染时使用的数据
	'clear'					// 清除指定表的表格记忆数据
*/
// 对外公开方法列表
const PublishMethod = new PublishMethodClass();
const publishMethodArray = ['init'];
for (let key in PublishMethod) {
	publishMethodArray.push(key);
}
export {PublishMethod, publishMethodArray};
