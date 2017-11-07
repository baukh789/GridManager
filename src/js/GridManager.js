/**
 * Created by baukh on 17/10/26.
 * 构造类
 */
import '../css/index.scss';
import { jTool, Base } from './Base';
import Adjust from './Adjust';
import AjaxPage from './AjaxPage';
import Cache from './Cache';
import Core from './Core';
import Config from './Config';
import Drag from './Drag';
import Export from './Export';
import Menu from './Menu';
import Remind from './Remind';
import Scroll from './Scroll';
import Sort from './Sort';
import store from './Store';
import { Settings, TextSettings } from './Settings';
import Hover from './Hover';
export default class GridManager {
	/**
	 * @静态方法
	 * 版本号
	 * GridManager.version || GM.version
	 * @returns {string}
	 */
	static
	get version() {
		return store.version;
	}

	/**
	 * @静态方法
	 * 获取Table 对应 GridManager的实例
	 * @param table
	 * @returns {*}
	 */
	static
	get(table) {
		return Cache.__getGridManager(jTool(table));
	}

	/**
	 * @静态方法
	 * 获取指定表格的本地存储数据
	 * 成功则返回本地存储数据,失败则返回空对象
	 * @param table
	 * @returns {{}}
     */
	static
	getLocalStorage(table) {
		return Cache.getUserMemory(jTool(table));
	}

	/**
	 * @静态方法
	 * 清除指定表的表格记忆数据,  如果未指定删除的table, 则全部清除
	 * @param table
	 * @returns {boolean}
     */
	static
	clear(table) {
		return Cache.delUserMemory(jTool(table));
	}

	/**
	 * @静态方法
	 * 获取当前行渲染时使用的数据
	 * @param table
	 * @param target 将要获取数据所对应的tr[Element or NodeList]
	 * @returns {{}}
     */
	static
	getRowData(table, target) {
		return Cache.__getRowData(jTool(table), target);
	}

	/**
	 * @静态方法
	 * 手动设置排序
	 * @param table
	 * @param sortJson 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
	 * @param callback 回调函数[function]
     * @param refresh 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
     */
	static
	setSort(table, sortJson, callback, refresh) {
		Sort.__setSort(jTool(table), sortJson, callback, refresh);
	}

	/**
	 * @静态方法
	 * 显示Th及对应的TD项
	 * @param table
	 * @param target
     */
	static
	showTh(table, target) {
		Base.setAreVisible(jTool(target), true);
	}

	/**
	 * @静态方法
	 * 隐藏Th及对应的TD项
	 * @param table
	 * @param target
     */
	static
	hideTh(table, target) {
		Base.setAreVisible(jTool(target), false);
	}

	/**
	 * @静态方法
	 * 导出表格 .xls
	 * @param table
	 * @param fileName 导出后的文件名
	 * @param onlyChecked 是否只导出已选中的表格
	 * @returns {boolean}
     */
	static
	exportGridToXls(table, fileName, onlyChecked) {
		return Export.__exportGridToXls(jTool(table), fileName, onlyChecked);
	}

	/**
	 * @静态方法
	 * 设置查询条件
	 * @param table
	 * @param query: 配置的数据 [Object]
	 * @param callback: 回调函数
	 * @param isGotoFirstPage: 是否返回第一页[Boolean default=true]
	 * 注意事项:
	 * - query的key值如果与分页及排序等字段冲突, query中的值将会被忽略.
	 * - setQuery() 会立即触发刷新操作
	 * - 在此配置的query在分页事件触发时, 会以参数形式传递至pagingAfter(query)事件内
	 * - setQuery对query字段执行的操作是修改而不是合并, 每次执行setQuery都会将之前配置的query值覆盖
	 */
	static
	setQuery(table, query, isGotoFirstPage, callback) {
		const $table = jTool(table);
		const settings = Cache.getSettings($table);
		if (typeof (isGotoFirstPage) !== 'boolean') {
			callback = isGotoFirstPage;
			isGotoFirstPage = true;
		}
		jTool.extend(settings, {query: query});
		if (isGotoFirstPage) {
			settings.pageData.cPage = 1;
		}
		Cache.updateSettings($table, settings);
		Core.__refreshGrid($table, callback);
	}

	/**
	 * @静态方法
	 * 配置静态数ajaxData
	 * @param table
	 * @param ajaxData: 配置的数据
	 */
	static
	setAjaxData(table, ajaxData) {
		const $table = jTool(table);
		const settings = Cache.getSettings($table);
		jTool.extend(settings, {ajax_data: ajaxData});
		Cache.updateSettings($table, settings);
		Core.__refreshGrid($table);
	}

	/**
	 * @静态方法
	 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 * @param table
	 * @param isGotoFirstPage:  是否刷新时跳转至第一页[boolean类型, 默认false]
	 * @param callback: 回调函数
	 */
	static
	refreshGrid(table, isGotoFirstPage, callback) {
		const $table = jTool(table);
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

	/**
	 * @静态方法
	 * 获取当前选中的行
	 * @param table
	 * @returns {NodeList} 当前选中的行
     */
	static
	getCheckedTr(table) {
		return table.querySelectorAll('tbody tr[checked="true"]');
	};

	/**
	 * @静态方法
	 * 获取当前选中行渲染时使用的数据
	 * @param table
	 * @returns {{}}
     */
	static
	getCheckedData(table) {
		const $table = jTool(table);
		return Cache.__getRowData($table, this.getCheckedTr(table));
	};

	/**
	 * [对外公开方法]
	 * @param table
	 * @param arg: 参数
	 * @param callback: 回调
	 * @returns {*}
	 */
	init(table, arg, callback) {
		const $table = jTool(table);
		if (typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === '') {
			// 存储gridManagerName值
			arg.gridManagerName = Base.getKey($table);
		}

		// 配置参数
		var _settings = new Settings();
		_settings.textConfig = new TextSettings();
		jTool.extend(true, _settings, arg);
		Cache.updateSettings($table, _settings);

		jTool.extend(true, this, _settings);

		// 通过版本较验 清理缓存
		Cache.cleanTableCacheForVersion();
		if (this.gridManagerName.trim() === '') {
			this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
			return false;
		}

		// 验证当前表格是否已经渲染
		if ($table.hasClass('GridManager-ready') || $table.hasClass('GridManager-loading')) {
			this.outLog('渲染失败：可能该表格已经渲染或正在渲染', 'error');
			return false;
		}

		// 根据本地缓存配置每页显示条数
		if (this.supportAjaxPage) {
			AjaxPage.configPageForCache($table);
		}

		// 增加渲染中标注
		$table.addClass('GridManager-loading');

		// 初始化表格
		this.initTable($table);
		// 如果初始获取缓存失败，在渲染完成后首先存储一次数据
		if (typeof $table.attr('grid-manager-cache-error') !== 'undefined') {
			window.setTimeout(() => {
				Cache.saveUserMemory($table);
				$table.removeAttr('grid-manager-cache-error');
			}, 1000);
		}
		// 启用回调
		typeof (callback) === 'function' ? callback(this.query) : '';
		return $table;
	}

	/**
	 * 初始化列表
	 * @param table
     */
	initTable(table) {
		// 渲染HTML，嵌入所需的事件源DOM
		Core.createDOM(table);

		// 获取本地缓存并对列表进行配置
		if (!this.disableCache) {
			Cache.configTheadForCache(table);
			// 通过缓存配置成功后, 重置宽度调整事件源dom
			this.supportAdjust ? Adjust.resetAdjust(table) : '';
		}

		// 绑定宽度调整事件
		if (this.supportAdjust) {
			Adjust.bindAdjustEvent(table);
		}

		// 绑定拖拽换位事件
		if (this.supportDrag) {
			Drag.bindDragEvent(table);
		}

		// 绑定排序事件
		if (this.supportSorting) {
			Sort.bindSortingEvent(table);
		}

		// 绑定表头提示事件
		if (this.supportRemind) {
			Remind.bindRemindEvent(table);
		}

		// 绑定配置列表事件
		if (this.supportConfig) {
			Config.bindConfigEvent(table);
		}

		// 绑定table区域hover事件
		Hover.onTbodyHover(table);

		// 绑定表头置顶功能
		Scroll.bindScrollFunction(table);

		// 绑定右键菜单事件
		Menu.bindRightMenuEvent(table);

		// 渲染tbodyDOM
		Core.__refreshGrid(table);

		// 存储GM实例
		Cache.__setGridManager(table, this);
	}
}
