/**
 * Created by baukh on 17/4/14.
 * 公开方法
 * 参数中的$table, 将由组件自动添加
 */
import { $, Base } from './Base';
import Cache from './Cache';
import Sort from './Sort';
import Export from './Export';
import Core from './Core';
class PublishMethodClass {
	constructor() {
		/*
		 * 通过jTool实例获取GridManager
		 * @param $table: table [jTool Object]
		 * */
		this.get = $table => {
			return Cache.__getGridManager($table);
		};

		/*
		 * 获取指定表格的本地存储数据
		 * 成功则返回本地存储数据,失败则返回空对象
		 * @param $table: table [jTool Object]
		 * */
		this.getLocalStorage = $table => {
			return Cache.getUserMemory($table);
		};

		/*
		 * 清除指定表的表格记忆数据
		 * @param $table: table [jTool Object]
		 * return 成功或者失败的布尔值
		 * */
		this.clear = $table => {
			return Cache.delUserMemory($table);
		};

		/*
		 * @获取当前行渲染时使用的数据
		 * @param $table: table [jTool Object]
		 * @param target: 将要获取数据所对应的tr[Element or NodeList]
		 * */
		this.getRowData = ($table, target) => {
			return Cache.__getRowData($table, target);
		};

		/*
		 * 手动设置排序
		 * @param sortJson: 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
		 * @param callback: 回调函数[function]
		 * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
		 * */
		this.setSort = ($table, sortJson, callback, refresh) => {
			Sort.__setSort($table, sortJson, callback, refresh);
		};

		/*
		 * 显示Th及对应的TD项
		 * @param $table: table [jTool Object]
		 * @param target: th[Element or NodeList]
		 * */
		this.showTh = ($table, target) => {
			Base.setAreVisible($(target), true);
		};

		/*
		 * 隐藏Th及对应的TD项
		 * @param $table: table [jTool Object]
		 * @param target: th[Element or NodeList]
		 * */
		this.hideTh = ($table, target) => {
			Base.setAreVisible($(target), false);
		};

		/*
		 * 导出表格 .xls
		 * @param $table:当前操作的grid,由插件自动传入
		 * @param fileName: 导出后的文件名
		 * @param onlyChecked: 是否只导出已选中的表格
		 * */
		this.exportGridToXls = ($table, fileName, onlyChecked) => {
			return Export.__exportGridToXls($table, fileName, onlyChecked);
		};

		/**
		 * 设置查询条件
		 * @param $table: table [jTool object]
		 * @param query: 配置的数据 [Object]
		 * @param callback: 回调函数
		 * @param isGotoFirstPage: 是否返回第一页[Boolean default=true]
		 * 注意事项:
		 * - query的key值如果与分页及排序等字段冲突, query中的值将会被忽略.
		 * - setQuery() 会立即触发刷新操作
		 * - 在此配置的query在分页事件触发时, 会以参数形式传递至pagingAfter(query)事件内
		 * - setQuery对query字段执行的操作是修改而不是合并, 每次执行setQuery都会将之前配置的query值覆盖
		 */
		this.setQuery = ($table, query, isGotoFirstPage, callback) => {
			const settings = Cache.getSettings($table);
			if (typeof (isGotoFirstPage) !== 'boolean') {
				callback = isGotoFirstPage;
				isGotoFirstPage = true;
			}
			$.extend(settings, {query: query});
			if (isGotoFirstPage) {
				settings.pageData.cPage = 1;
			}
			Cache.updateSettings($table, settings);
			Core.__refreshGrid($table, callback);
		};

		/**
		 * 配置静态数ajaxData
		 * @param $table: table [jTool object]
		 * @param ajaxData: 配置的数据
		 */
		this.setAjaxData = ($table, ajaxData) => {
			const settings = Cache.getSettings($table);
			$.extend(settings, {ajax_data: ajaxData});
			Cache.updateSettings($table, settings);
			Core.__refreshGrid($table);
		};

		/*
		 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
		 * @param $table:当前操作的grid,由插件自动传入
		 * @param isGotoFirstPage:  是否刷新时跳转至第一页[boolean类型, 默认false]
		 * @param callback: 回调函数
		 * */
		this.refreshGrid = ($table, isGotoFirstPage, callback) => {
			const settings = Cache.getSettings($table);
			if (typeof (isGotoFirstPage) !== 'boolean') {
				callback = isGotoFirstPage;
				isGotoFirstPage = false;
			}
			if (isGotoFirstPage) {
				settings.pageData['cPage'] = 1;
				Cache.updateSettings($table, settings);
			}
			Core.__refreshGrid($table, callback);
		};

		/*
		 * 获取当前选中的行
		 * @param $table: table [jTool Object]
		 * return 当前选中的行 [NodeList]
		 * */
		this.getCheckedTr = $table => {
			return $table.get(0).querySelectorAll('tbody tr[checked="true"]');
		};

		/*
		 * 获取当前选中行渲染时使用的数据
		 * @param $table: table [jTool Object]
		 * */
		this.getCheckedData = $table => {
			return Cache.__getRowData($table, this.getCheckedTr($table));
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
