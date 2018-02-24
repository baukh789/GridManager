/**
 * Created by baukh on 17/4/14.
 * 公开方法
 * 参数中的table, 将由组件自动添加
 */
import GridManager from './GridManager';
import { GM_PUBLISH_METHOD_LIST } from '../common/constants';
class PublishMethodClass {
	/**
	 * 初始化方法
	 */
	init(table, settings, callback) {
		const _GM = new GridManager();
		return _GM.init(table, settings, callback);
	}

	/**
	 * 当前版本号
	 * @returns {string}
     */
	version() {
		return	GridManager.version;
	}

	/*
	 * 通过jTool实例获取GridManager
	 * */
	get(table) {
		return GridManager.get(table);
	}

	/*
	 * 获取指定表格的本地存储数据
	 * */
	getLocalStorage(table) {
		return GridManager.getLocalStorage(table);
	}

	/*
	 * 清除指定表的表格记忆数据
	 * */
	clear(table) {
		return GridManager.clear(table);
	}

	/*
	 * @获取当前行渲染时使用的数据
	 * */
	getRowData(table, target) {
		return GridManager.getRowData(table, target);
	}

	/*
	 * 手动设置排序
	 * */
	setSort(table, sortJson, callback, refresh) {
		GridManager.setSort(table, sortJson, callback, refresh);
	}

	/*
	 * 显示Th及对应的TD项
	 * */
	showTh(table, target) {
		GridManager.showTh(table, target);
	}

	/*
	 * 隐藏Th及对应的TD项
	 * */
	hideTh(table, target) {
		GridManager.hideTh(table, target);
	}

	/*
	 * 导出表格 .xls
	 * */
	exportGridToXls(table, fileName, onlyChecked) {
		return GridManager.exportGridToXls(table, fileName, onlyChecked);
	}

	/**
	 * 设置查询条件
	 */
	setQuery(table, query, isGotoFirstPage, callback) {
		GridManager.setQuery(table, query, isGotoFirstPage, callback);
	}

	/**
	 * 配置静态数ajaxData
	 */
	setAjaxData(table, ajaxData) {
		GridManager.setAjaxData(table, ajaxData);
	}

	/*
	 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 * */
	refreshGrid(table, isGotoFirstPage, callback) {
		GridManager.refreshGrid(table, isGotoFirstPage, callback);
	}

	/*
	 * 获取当前选中的行
	 * */
	getCheckedTr(table) {
		return GridManager.getCheckedTr(table);
	}

	/*
	 * 获取当前选中行渲染时使用的数据
	 * */
	getCheckedData(table) {
		return GridManager.getCheckedData(table);
	}

	/*
	 * 消毁当前实例
	 * */
	destroy(table) {
		return GridManager.destroy(table);
	}
}
// 对外公开方法列表
const publishMethodArray = GM_PUBLISH_METHOD_LIST;
const PublishMethod = new PublishMethodClass();
export { PublishMethod, publishMethodArray };
