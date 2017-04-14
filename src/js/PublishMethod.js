/**
 * Created by baukh on 17/4/14.
 * 公开方法
 * 参数中的$table, 将由组件自动添加
 */
import $ from './jTool';
import Cache from './Cache';
import Base from './Base';
import Sort from './Sort';
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
	 * @清除表格记忆数据
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
	* 参数信息:
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
	 [对外公开方法]
	 @隐藏Th及对应的TD项
	 table: table
	 th:th
	 */
	,hideTh: function($table, th){
		Base.__hideTh(th);
	}
};

export default PublishMethod;
