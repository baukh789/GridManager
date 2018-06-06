/**
 * Created by baukh on 17/10/26.
 * 构造类
 */
import '../css/index.scss';
import { jTool, Base } from './Base';
import Adjust from './Adjust';
import AjaxPage from './AjaxPage';
import Cache from './Cache';
import Checkbox from './Checkbox';
import Config from './Config';
import Core from './Core';
import Drag from './Drag';
import Export from './Export';
import Menu from './Menu';
import Remind from './Remind';
import Scroll from './Scroll';
import Sort from './Sort';
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
		return Cache.getVersion();
	}

	/**
	 * @静态方法
	 * 获取Table 对应 GridManager的实例
	 * @param table
	 * @returns {*}
	 */
	static
	get(table) {
		return Cache.getSettings(jTool(table));
	}

    /**
     * @静态方法
     * 存储表格渲染所在的域
     * @param table
     * @returns {*}
     */
    static
    setScope(table, scope) {
        return Cache.setScope(jTool(table), scope);
    }

	/**
	 * @静态方法
	 * 获取指定表格的本地存储数据
	 * 成功后返回本地存储数据,失败则返回空对象
	 * @param table
	 * @returns {{}}
     */
	static
	getLocalStorage(table) {
		return Cache.getUserMemory(jTool(table));
	}

	/**
	 * @静态方法
	 * 清除指定表的表格记忆数据, 如果未指定删除的table, 则全部清除
	 * @param table
	 * @returns {boolean}
     */
	static
	clear(table) {
		return Cache.delUserMemory(jTool(table), '通过clear()方法清除');
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
		return Cache.getRowData(jTool(table), target);
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

	// TODO 这个方法名称起的不规范, 按作用应该更名为showCol
	/**
	 * @静态方法
	 * 显示Th及对应的TD项
	 * @param table
	 * @param target
     */
	static
	showTh(table, target) {
		Base.setAreVisible(jTool(target), true);
        // 更新存储信息
        Cache.update(jTool(table));
	}

	// TODO 这个方法名称起的不规范, 按作用应该更名为hideCol
	/**
	 * @静态方法
	 * 隐藏Th及对应的TD项
	 * @param table
	 * @param target
     */
	static
	hideTh(table, target) {
		Base.setAreVisible(jTool(target), false);
        // 更新存储信息
        Cache.update(jTool(table));
	}

	/**
	 * @静态方法
	 * 导出.xls格式文件
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
	 * - 当query的key与分页及排序等字段冲突时将会被忽略.
	 * - setQuery() 执行后会立即触发刷新操作
	 * - 在此配置的query在分页事件触发时, 会以参数形式传递至pagingAfter(query)事件内
	 * - setQuery方法中对query字段执行的操作是覆盖而不是合并, query参数位传递的任意值都会将原来的值覆盖.
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
		Cache.setSettings($table, settings);
		Core.refresh($table, callback);
	}

	/**
	 * @静态方法
	 * 配置静态数ajaxData; 用于再次配置ajax_data数据, 配置后会根据参数ajaxData即时刷新表格
	 * @param table
	 * @param ajaxData: 配置的数据
	 */
	static
	setAjaxData(table, ajaxData, callback) {
		const $table = jTool(table);
		const settings = Cache.getSettings($table);
		jTool.extend(settings, {ajax_data: ajaxData});
		Cache.setSettings($table, settings);
		Core.refresh($table, callback);
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
			Cache.setSettings($table, settings);
		}
		Core.refresh($table, callback);
	};

	/**
	 * @静态方法
	 * 获取当前选中的行
	 * @param table
	 * @returns {NodeList} 当前选中的行
     */
	static
	getCheckedTr(table) {
		return Checkbox.getCheckedTr(jTool(table));
	};

	/**
	 * @静态方法
	 * 获取当前选中行渲染时使用的数据
	 * @param table
	 * @returns {{}}
     */
	static
	getCheckedData(table) {
		return Checkbox.getCheckedData(jTool(table));
	};

	static
	cleanData(table) {
		return Core.cleanData(jTool(table));
	}

	/**
	 * @静态方法
	 * 消毁当前实例
	 * @param $table
	 */
	static
	destroy(table) {
		const $table = jTool(table);
		// 清除各模块中的事件及部分DOM
		Adjust.destroy($table);
		AjaxPage.destroy($table);
		Checkbox.destroy($table);
		Config.destroy($table);
		Drag.destroy($table);
		Hover.destroy($table);
		Menu.destroy($table);
		Remind.destroy($table);
		Scroll.destroy($table);
		Sort.destroy($table);

		// 清除实例及数据
		Cache.setSettings($table, {});

		// 清除DOM属性及节点
		const $tableWrap = $table.closest('.table-wrap');
		$table.removeClass('GridManager-ready');
		$table.html('');
		$tableWrap.after($table);
		$tableWrap.remove();
	}

	/**
	 * [对外公开方法]
	 * @param table
	 * @param arg: 参数
	 * @param callback: 回调
	 * @returns {*}
	 */
	init(table, arg, callback) {
		const $table = jTool(table);
		// 校验: 初始参
		if (!arg || jTool.isEmptyObject(arg)) {
			Base.outLog('init()方法中未发现有效的参数', 'error');
			return;
		}

		// 校验: columnData
		if (!arg.columnData || arg.columnData.length === 0) {
			Base.outLog('请对参数columnData进行有效的配置', 'error');
			return;
		}

		// 参数变更提醒 @2.6.0
		if (arg.ajax_url) {
			Base.outLog('ajax_url在v2.6.0以后将被废弃, 请使用ajax_data替代', 'error');
			return;
		}

		// 参数中未存在配置项 gridManagerName: 使用table DOM 上的 grid-manager属性
		if (typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === '') {
			// 存储gridManagerName值
			arg.gridManagerName = Base.getKey($table);
		// 参数中存在配置项 gridManagerName: 更新table DOM 的 grid-manager属性
		} else {
			$table.attr('grid-manager', arg.gridManagerName);
		}

		// 通过版本较验 清理缓存
		Cache.cleanTableCacheForVersion();

		// 初始化设置相关: 合并, 存储
		const settings = Cache.initSettings($table, arg);

		// 校验: gridManagerName
		if (settings.gridManagerName.trim() === '') {
			Base.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
			return;
		}

		// 校验: 当前表格是否已经渲染
		if ($table.hasClass('GridManager-ready') || $table.hasClass('GridManager-loading')) {
			Base.outLog('渲染失败,可能该表格已经渲染或正在渲染', 'error');
			return;
		}

		// 增加渲染中标注
		$table.addClass('GridManager-loading');

		// 初始化表格
		this.initTable($table, settings);

		// 如果初始获取缓存失败，在渲染完成后首先存储一次数据
		if (typeof $table.attr('grid-manager-cache-error') !== 'undefined') {
			window.setTimeout(() => {
				Cache.saveUserMemory($table, settings);
				$table.removeAttr('grid-manager-cache-error');
			}, 1000);
		}
		// 启用回调
		typeof (callback) === 'function' ? callback(settings.query) : '';
	}

	/**
	 * 初始化列表
	 * @param $table
	 * @param settings
     */
	initTable($table, settings) {

		// 渲染HTML，嵌入所需的事件源DOM
		Core.createDOM($table);

		// 通过缓存配置成功后, 重置宽度调整事件源dom
		settings.supportAdjust ? Adjust.resetAdjust($table) : '';

		// init Adjust
		if (settings.supportAdjust) {
			Adjust.init($table);
		}

		// init Drag
		if (settings.supportDrag) {
			Drag.init($table);
		}

		// init Sort
		if (settings.supportSorting) {
			Sort.init($table);
		}

		// init Remind
		if (settings.supportRemind) {
			Remind.init($table);
		}

		// init Config
		if (settings.supportConfig) {
			Config.init($table);
		}

		// 绑定$table区域hover事件
		Hover.onTbodyHover($table);

		// 初始化表格卷轴
		Scroll.init($table);

		// 初始化右键菜单事件
		if (settings.supportMenu) {
			Menu.init($table);
		}

		// 渲染tbodyDOM
		settings.firstLoading ? Core.refresh($table) : Core.insertEmptyTemplate($table, settings);
	}
}
