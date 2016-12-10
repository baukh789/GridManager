/*
 * Remind: 表头提醒
 * */
const Remind = {
	html: function(){
		var html = '<div class="remind-action">'
			+ '<i class="ra-help iconfont icon-icon"></i>'
			+ '<div class="ra-area">'
			+ '<span class="ra-title"></span>'
			+ '<span class="ra-con"></span>'
			+ '</div>'
			+ '</div>';
		return html;
	}
	/*
	* @绑定表头提醒功能
	* $.table: table [jTool object]
	* */
	,bindRemindEvent: function(table){
		var raArea,
			tableDiv,
			theLeft;
		var remindAction = $('.remind-action', table);
		remindAction.unbind('mouseenter');
		remindAction.bind('mouseenter', function(){
			raArea = $(this).find('.ra-area');
			tableDiv = $(this).closest('.table-div');
			raArea.show();
			theLeft = (tableDiv.get(0).offsetWidth - ($(this).offset().left - tableDiv.offset().left)) > raArea.get(0).offsetWidth;
			raArea.css({
				left: theLeft ? '0px' : 'auto',
				right: theLeft ? 'auto' : '0px'
			})
		});
		remindAction.unbind('mouseleave');
		remindAction.bind('mouseleave', function(){
			raArea = $(this).find('.ra-area');
			raArea.hide();
		});
	}
};
export default Remind;
