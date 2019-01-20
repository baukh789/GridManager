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
     * @param table
     * @param settings
     * @param callback
     * @returns {*}
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

    /**
     * 通过jTool实例获取GridManager
     * @param table
     * @returns {*}
     */
	get(table) {
		return GridManager.get(table);
	}

    /**
     * 获取指定表格的本地存储数据
     * @param table
     * @returns {{}}
     */
	getLocalStorage(table) {
		return GridManager.getLocalStorage(table);
	}

    /**
     * 重置表格布局
     * @param table
     * @param width: 宽度
     * @param height: 高度
     * @returns {string} 当前overflow-x的使用值
     */
    resetLayout(table, width, height) {
        return GridManager.resetLayout(table, width, height);
    }

    /**
     * 清除指定表的表格记忆数据
     * @param table
     * @returns {boolean}
     */
	clear(table) {
		return GridManager.clear(table);
	}

    /**
     * 获取当前行渲染时使用的数据
     * @param table
     * @param target
     * @returns {{}}
     */
	getRowData(table, target) {
		return GridManager.getRowData(table, target);
	}

    /**
     * 手动设置排序
     * @param table
     * @param sortJson
     * @param callback
     * @param refresh
     */
	setSort(table, sortJson, callback, refresh) {
		GridManager.setSort(table, sortJson, callback, refresh);
	}

    /**
     * 设置表头配置区域可视状态
     * @param table
     * @param visible
     */
    setConfigVisible(table, visible) {
        GridManager.setConfigVisible(table, visible);
    }

    /**
     * 显示Th及对应的TD项
     * @param table
     * @param target
     */
	showTh(table, target) {
		GridManager.showTh(table, target);
	}

    /**
     * 隐藏Th及对应的TD项
     * @param table
     * @param target
     */
	hideTh(table, target) {
		GridManager.hideTh(table, target);
	}

    /**
     * 导出表格 .xls
     * @param table
     * @param fileName
     * @param onlyChecked
     * @returns {boolean}
     */
	exportGridToXls(table, fileName, onlyChecked) {
		return GridManager.exportGridToXls(table, fileName, onlyChecked);
	}

    /**
     * 设置查询条件
     * @param table
     * @param query
     * @param isGotoFirstPage
     * @param callback
     */
	setQuery(table, query, isGotoFirstPage, callback) {
		GridManager.setQuery(table, query, isGotoFirstPage, callback);
	}

    /**
     * 配置静态数ajaxData
     * @param table
     * @param ajaxData
     * @param callback
     */
	setAjaxData(table, ajaxData, callback) {
		GridManager.setAjaxData(table, ajaxData, callback);
	}

    /**
     * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
     * @param table
     * @param isGotoFirstPage
     * @param callback
     */
	refreshGrid(table, isGotoFirstPage, callback) {
		GridManager.refreshGrid(table, isGotoFirstPage, callback);
	}

    /**
     * 获取当前选中的行
     * @param table
     * @returns {NodeList}
     */
	getCheckedTr(table) {
		return GridManager.getCheckedTr(table);
	}

    /**
     * 获取当前选中行渲染时使用的数据
     * @param table
     * @returns {{}}
     */
	getCheckedData(table) {
		return GridManager.getCheckedData(table);
	}

    /**
     * 设置选中的数据
     * @param table
     * @param checkedList
     * @returns {{}}
     */
    setCheckedData(table, checkedList) {
        return GridManager.setCheckedData(table, checkedList);
    }

    /**
     * 更新列数据, 该操作为merge效果。
     * @param table
     * @param key: 列数据的主键
     * @param rowData: 需要更新的数据列表
     * @returns tableData: 更新后的表格数据
     */
	updateRowData(table, key, rowData) {
	    return GridManager.updateRowData(table, key, rowData);
    }

    /**
     * 清除数据
     * @param table
     * @returns {*}
     */
	cleanData(table) {
		return GridManager.cleanData(table);
	}

    /**
     * 消毁当前实例
     * @param table
     */
	destroy(table) {
		return GridManager.destroy(table);
	}
}
// 对外公开方法列表
const publishMethodArray = GM_PUBLISH_METHOD_LIST;
const PublishMethod = new PublishMethodClass();
export { PublishMethod, publishMethodArray };
