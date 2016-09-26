/*
 * GridManager: 表头提醒
 * */
define(['jTool'], function($) {
    var remindGM = {
        /*
         @绑定表头提醒功能
         $.table: table [jquery object]
         */
        bindRemindEvent: function(table){
            var _this = this;
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
    return remindGM;
});
