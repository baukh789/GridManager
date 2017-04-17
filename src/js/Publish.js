/**
 * Created by baukh on 17/4/14.
 * 公开方法
 * 参数中的$table, 将由组件自动添加
 */
import $ from './jTool';
import Cache from './Cache';
import Base from './Base';
import Sort from './Sort';
import Export from './Export';
import Core from './Core';
const PublishMethod= {
	/*
	* @获取 GridManager 实例
	* */
	get: function($table) {
		return this.__getGridManager($table);
	}
	/*
	 * @获取指定表格的本地存储数据
	 * 成功则返回本地存储数据,失败则返回空对象
	 * */
	,getLocalStorage: function($table){
		return Cache.getUserMemory($table);
	}
	/*
	 * @清除指定表的表格记忆数据
	 * return 成功或者失败的布尔值
	 * */
	,clear:function($table){
		return Cache.delUserMemory($table);
	}
	/*
	* @获取当前行渲染时使用的数据
	* tr: 将要获取数据所对应的tr[Element or NodeList]
	* */
	,getRowData: function ($table, tr) {
		return Cache.__getRowData($table, tr);
	}
	/*
	* @配置排序
	* sortJson: 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
	* refresh: 是否执行完成后对表格进行自动刷新[boolean]
	* */
	,setSort: function($table, sortJson, callback, refresh){
		return Sort.__setSort($table, sortJson, callback, refresh)
	}
	/*
	 [对外公开方法]
	 @显示Th及对应的TD项
	 $table: table [jTool Object]
	 th: th
	 */
	,showTh: function($table, th){
		Base.__showTh(th);
	}
	/*
	 @隐藏Th及对应的TD项
	 table: table
	 th:th
	 */
	,hideTh: function($table, th){
		Base.__hideTh(th);
	}
	/*
	* @导出表格 .xls
	* $table:当前操作的grid,由插件自动传入
	* fileName: 导出后的文件名
	* onlyChecked: 是否只导出已选中的表格
	* */
	,exportGridToXls: function($table, fileName, onlyChecked){
		Export.__exportGridToXls($table, fileName, onlyChecked);
	}
	/**
	 * 配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	 * @param $table: table [jTool object]
	 * @param query: 配置的数据
	 */
	,setQuery: function($table, query){
		const settings = Cache.getSettings($table);
		$.extend(settings, {query: query});
		Cache.updateSettings($table, settings);
	}
	/**
	 * 配置ajaxData
	 * @param $table: table [jTool object]
	 * @param ajaxData: 配置的数据
	 */
	,setAjaxData: function ($table, ajaxData) {
		const settings = Cache.getSettings($table);
		$.extend(settings, {ajax_data: ajaxData});
		Cache.updateSettings($table, settings);
		Core.__refreshGrid($table);
	}
	/*
	* 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	* @param $table:当前操作的grid,由插件自动传入
	* @param gotoFirstPage:  是否刷新时跳转至第一页
	* @param callback: 回调函数
	* */
	,refreshGrid: function($table, gotoFirstPage, callback){
		const settings = Cache.getSettings($table);
		if(typeof(gotoFirstPage) !== 'boolean'){
			callback = gotoFirstPage;
			gotoFirstPage = false;
		}
		if(gotoFirstPage){
			settings.pageData['cPage'] = 1;
			Cache.getSettings($table, settings);
		}
		Core.__refreshGrid($table, callback);
	}
	/*
	 @获取当前选中的 tr
	 $table: table [jTool Object]
	 */
	,getCheckedTr: function($table) {
		return $('tbody tr[checked="true"]', $table).DOMList || [];
	}
	/*
	 @获取当前选中的 tr 渲染时的数据,  返回值类型为数组
	 $table: table [jTool Object]
	 */
	,getCheckedData: function($table){
		return Cache.__getRowData($table, this.getCheckedTr(table))
	}
};

/*
	'init',					//初始化
	'setSort',				//手动设置排序
	'get',					//通过jTool实例获取GridManager
	'showTh',				//显示Th及对应的TD项
	'hideTh',				//隐藏Th及对应的TD项
	'exportGridToXls',		//导出表格 .xls
	'getLocalStorage',		//获取指定表格的本地存储数据
	'setQuery',				//配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	'setAjaxData',          //用于再次配置ajax_data数据, 配置后会根据配置的数据即刻刷新表格
	'refreshGrid',			//刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	'getCheckedTr',			//获取当前选中的行
	'getRowData',			//获取当前行渲染时使用的数据
	'getCheckedData',		//获取当前选中行渲染时使用的数据
	'clear'					//清除指定表的表格记忆数据
*/
// 对外公开方法列表
const publishList = [
	'init'
];
for(let key in PublishMethod){
	publishList.push(key);
}
export {PublishMethod, publishList};
