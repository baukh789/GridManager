/*
 * Config: th配置
 * */
import $ from './jTool';
import Base from './Base';
import Cache from './Cache';
import Adjust from './Adjust';
const Config = {
	html: function () {
		const html= `<div class="config-area">
						<span class="config-action">
							<i class="iconfont icon-31xingdongdian"></i>
						</span>
						<ul class="config-list"></ul>
					</div>`;
		return html;
	}
	/*
	* 绑定配置列表事件[隐藏展示列]
	* $table: table [jTool object]
	* */
	,bindConfigEvent: function($table){
		let Settings = Cache.getSettings($table);
		// GM容器
		const tableWarp = $table.closest('div.table-wrap');
		// 打开/关闭设置事件源
		const configAction = $('.config-action', tableWarp);
		configAction.unbind('click');
		configAction.bind('click', function(){
			// 展示事件源
			const _configAction = $(this);

			// 设置区域
			const _configArea = _configAction.closest('.config-area');

			// 关闭
			if(_configArea.css('display') === 'block'){
				_configArea.hide();
				return false;
			}
			// 打开
			_configArea.show();

			//验证当前是否只有一列处于显示状态 并根据结果进行设置是否可以取消显示
			const checkedLi = $('.checked-li', _configArea);
			checkedLi.length === 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');
		});
		//设置事件
		$('.config-list li', tableWarp).unbind('click');
		$('.config-list li', tableWarp).bind('click', function(){
			//单个的设置项
			const _only = $(this);

			//单个设置项的thName
			const _thName = _only.attr('th-name');

			//事件下的checkbox
			const _checkbox = _only.find('input[type="checkbox"]');

			//所在的大容器
			const _tableWarp = _only.closest('.table-wrap');

			//所在的table-div
			const _tableDiv	= $('.table-div', _tableWarp);

			//所对应的table
			const _table = $('[grid-manager]', _tableWarp);

			//所对应的th
			const _th = $('thead[grid-manager-thead] th[th-name="'+_thName +'"]', _table);

			// 最后一项显示列不允许隐藏
			if(_only.hasClass('no-click')){
				return false;
			}
			_only.closest('.config-list').find('.no-click').removeClass('no-click');
			let isVisible = !_checkbox.prop('checked');

			//设置与当前td同列的td是否可见
			_tableDiv.addClass('config-editing');
			Base.setAreVisible(_th, isVisible, function(){
				_tableDiv.removeClass('config-editing');
			});

			//当前处于选中状态的展示项
			const _checkedList =  $('.config-area input[type="checkbox"]:checked', _tableWarp);

			//限制最少显示一列
			if(_checkedList.length == 1){
				_checkedList.parent().addClass('no-click');
			}

			//重置调整宽度事件源
			if(Settings.supportAdjust){
				Adjust.resetAdjust(_table);
			}

			//重置镜像滚动条的宽度
			$('.sa-inner', _tableWarp).width('100%');

			//重置当前可视th的宽度
			const _visibleTh = $('thead[grid-manager-thead] th[th-visible="visible"]', _table);
			$.each(_visibleTh, function(i, v){
				// 特殊处理: GM自动创建的列使终为50px
				if(v.getAttribute('gm-create') === 'true'){
					v.style.width = '50px';
				}
				else{
					v.style.width = 'auto';
				}
			});
			//当前th文本所占宽度大于设置的宽度
			//需要在上一个each执行完后才可以获取到准确的值
			$.each(_visibleTh, function(i, v){
				let _realWidthForThText = Base.getTextWidth(v),
					_thWidth = $(v).width();
				if(_thWidth < _realWidthForThText){
					$(v).width(_realWidthForThText);
				}else{
					$(v).width(_thWidth);
				}
			});
			Cache.saveUserMemory(_table);	// 存储用户记忆

			// 处理置顶表头
			const topThead = $('thead.set-top', _table);
			if(topThead.length === 1){
				topThead.remove();
				_tableDiv.trigger('scroll');
			}
		});
	}
};
export default Config;
