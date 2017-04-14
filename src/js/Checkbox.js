/*
 * Checkbox: 数据选择/全选/返选
 * */
import $ from './jTool';
import I18n from './I18n';
import Cache from './Cache';
const Checkbox = {
	/*
	 @初始化选择与反选DOM
	 $table: table [jTool Object]
	 */
	initDOM: function($table) {
		let checkboxHtml = `<th th-name="gm_checkbox" gm-checkbox="true" gm-create="true">
								<input type="checkbox"/>
								<span style="display: none">
									${ I18n.i18nText($table, 'checkall-text') }
								</span>
							</th>`;
		$('thead tr', $table).prepend(checkboxHtml);

		//绑定选择事件
		$table.off('click','input[type="checkbox"]');
		$table.on('click','input[type="checkbox"]', function(){
			// 存储th中的checkbox的选中状态
			let _thChecked= true;
			// 全选键事件源
			const _checkAction= $(this);
			// th中的选择框
			const _thCheckbox = $('thead th[gm-checkbox] input[type="checkbox"]', $table);

			// td中的选择框
			const _tdCheckbox = $('tbody td[gm-checkbox] input[type="checkbox"]', $table);
			//当前为全选事件源
			if(_checkAction.closest('th[th-name="gm_checkbox"]').length === 1){
				$.each(_tdCheckbox, function(i, v){
					v.checked = _checkAction.prop('checked');
					$(v).closest('tr').attr('checked', v.checked);
				});
				//当前为单个选择
			}else{
				$.each(_tdCheckbox, function(i, v){
					if(v.checked === false) {
						_thChecked = false;
					}
					$(v).closest('tr').attr('checked', v.checked);
				});
				_thCheckbox.prop('checked', _thChecked);
			}
		});
	}
	/*
	 [对外公开方法]
	 @获取当前选中的 tr
	 $table: table [jTool Object]
	 */
	,getCheckedTr: function($table) {
		return $('tbody tr[checked="true"]', $table).DOMList || [];
	}
	/*
	 [对外公开方法]
	 @获取当前选中的 tr 渲染时的数据,  返回值类型为数组
	 $table: table [jTool Object]
	 */
	,getCheckedData: function($table){
		return Cache.__getRowData($table, this.getCheckedTr(table))
	}
};
export default Checkbox;
