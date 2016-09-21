/*
 * GridManager: 数据选择/全选/返选
 * */
define(['cTool'], function($) {
    var checkboxGM = {
        /*
         @初始化选择与反选DOM
         $.table: table DOM
         */
        initCheckboxDOM: function(table) {
            var _this = this;
            var checkboxHtml = '<th th-name="'+ _this.checkboxThName +'" gm-checkbox="true" gm-create="true"><input type="checkbox"/><span style="display: none">'+ _this.i18nText('checkall-text') +'</span></th>';
            $('thead tr', table).prepend(checkboxHtml);
            //绑定选择事件
            table.off('click','input[type="checkbox"]');
            table.on('click','input[type="checkbox"]', function(){
                var _checkAction = $(this),	//全选键事件源
                    _thChecked	= true,		//存储th中的checkbox的选中状态
                    _thCheckbox = $('thead th[gm-checkbox] input[type="checkbox"]', table),	//th中的选择框
                    _tdCheckbox = $('tbody td[gm-checkbox] input[type="checkbox"]', table);	//td中的选择框
                //当前为全选事件源
                if(_checkAction.closest('th[th-name="'+ _this.checkboxThName +'"]').length === 1){
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
         @获取当前选中的列
         $.table:当前操作的grid,由插件自动传入
         */
        ,getCheckedTr: function(table) {
            return $('tbody td[gm-checkbox] input[type="checkbox"]:checked', table).closest('tr');
        }
    };
    return checkboxGM;
});