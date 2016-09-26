/*
 * GridManager: 右键菜单
 * */
define(['jTool'], function($) {
    var menuGM = {
        /*
         @验证菜单区域: 禁用、开启分页操作
         */
        checkMenuPageAction: function(){
            var _this = this;
            //右键菜单区上下页限制
            var gridMenu = $('.grid-menu[grid-master="'+ _this.gridManagerName +'"]');
            if(!gridMenu || gridMenu.length === 0){
                return;
            }
            var previousPage = $('[refresh-type="previous"]', gridMenu),
                nextPage = $('[refresh-type="next"]', gridMenu);
            if(_this.pageData.cPage === 1 || _this.pageData.tPage === 0){
                previousPage.addClass('disabled');
            }else{
                previousPage.removeClass('disabled');
            }
            if(_this.pageData.cPage === _this.pageData.tPage || _this.pageData.tPage === 0){
                nextPage.addClass('disabled');
            }else{
                nextPage.removeClass('disabled');
            }
        }
        /*
         @绑定右键菜单事件
         $.table:table
         */
        ,bindRightMenuEvent: function(table){
            var _this = this;
            var tableWarp = $(table).closest('.table-warp'),
                tbody = $('tbody', tableWarp);
            //刷新当前表格
            var menuHTML = '<div class="grid-menu" grid-master="'+ _this.gridManagerName +'">';
            //分页类操作
            if(_this.supportAjaxPage){
                menuHTML+= '<span grid-action="refresh-page" refresh-type="previous">'
                    + _this.i18nText("previous-page")
                    + '<i class="iconfont icon-sanjiao2"></i></span>'
                    + '<span grid-action="refresh-page" refresh-type="next">'
                    + _this.i18nText("next-page")
                    + '<i class="iconfont icon-sanjiao1"></i></span>';
            }
            menuHTML    += '<span grid-action="refresh-page" refresh-type="refresh">'
                + _this.i18nText("refresh")
                + '<i class="iconfont icon-31shuaxin"></i></span>';
            //导出类
            if(_this.supportExport){
                menuHTML+='<span class="grid-line"></span>'
                    + '<span grid-action="export-excel" only-checked="false">'
                    + _this.i18nText("save-as-excel")
                    + '<i class="iconfont icon-baocun"></i></span>'
                    + '<span grid-action="export-excel" only-checked="true">'
                    + _this.i18nText("save-as-excel-for-checked")
                    + '<i class="iconfont icon-saveas24"></i></span>';
            }
            //配置类
            if(_this.supportConfig){
                menuHTML+= '<span class="grid-line"></span>'
                    + '<span grid-action="setting-grid">'
                    + _this.i18nText("setting-grid")
                    + '<i class="iconfont icon-shezhi"></i></span>';
            }
            menuHTML+= '</div>';
            var _body = $('body');
            _body.append(menuHTML);
            //绑定打开右键菜单栏
            var menuDOM = $('.grid-menu[grid-master="'+ _this.gridManagerName +'"]');
            tableWarp.unbind('contextmenu');
            tableWarp.bind('contextmenu', function(e){
                e.preventDefault();
                e.stopPropagation();
                //验证：如果不是tbdoy或者是tbody的子元素，直接跳出
                if(e.target.nodeName !== 'TBODY' && $(e.target).closest('tbody').length === 0){
                    return;
                }
                //验证：当前是否存在已选中的项
                var exportExcelOfChecked = $('[grid-action="export-excel"][only-checked="true"]');
                if($('tbody tr[checked="checked"]', 'table[grid-manager="'+ _this.gridManagerName +'"]').length === 0){
                    exportExcelOfChecked.addClass('disabled');
                }else{
                    exportExcelOfChecked.removeClass('disabled');
                }
                var menuWidth = menuDOM.width(),
                    menuHeight = menuDOM.height(),
                    offsetHeight = document.documentElement.offsetHeight,
                    offsetWidth = document.documentElement.offsetWidth;
                var top = offsetHeight < e.clientY + menuHeight ? e.clientY - menuHeight : e.clientY;
                var left = offsetWidth < e.clientX + menuWidth ? e.clientX - menuWidth : e.clientX;
                menuDOM.css({
                    'top': top + tableWarp.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop),
                    'left': left + tableWarp.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
                });
                //隐藏非当前展示表格的菜单项
                $('.grid-menu[grid-master]').hide();
                menuDOM.show();
                _body.off('mousedown.gridMenu');
                _body.on('mousedown.gridMenu', function(e){
                    var eventSource = $(e.target);
                    if(eventSource.hasClass('.grid-menu') || eventSource.closest('.grid-menu').length === 1){
                        return;
                    }
                    _body.off('mousedown.gridMenu');
                    menuDOM.hide();
                });
            });

            //绑定事件：上一页、下一页、重新加载
            var refreshPage = $('[grid-action="refresh-page"]');
            refreshPage.unbind('click');
            refreshPage.bind('click', function(e){
                if(isDisabled(this, e)){
                    return false;
                }
                var _gridMenu = $(this).closest('.grid-menu'),
                    _table = $('table[grid-manager="'+_gridMenu.attr('grid-master')+'"]');
                _this = _this.__getGridManager(_table);
                var refreshType = this.getAttribute('refresh-type');
                //上一页
                if(refreshType === 'previous' && _this.pageData.cPage > 1){
                    _this.pageData.cPage = _this.pageData.cPage - 1;
                }
                //下一页
                else if(refreshType === 'next' && _this.pageData.cPage < _this.pageData.tPage){
                    _this.pageData.cPage = _this.pageData.cPage + 1;
                }
                //重新加载
                else if(refreshType === 'refresh'){
                }
                var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
                _this.pagingBefore(query);
                _this.__refreshGrid(function() {
                    _this.pagingAfter(query);
                });
                _body.off('mousedown.gridMenu');
                _gridMenu.hide();
            });
            //绑定事件：另存为EXCEL、已选中表格另存为Excel
            var exportExcel = $('[grid-action="export-excel"]');
            exportExcel.unbind('click');
            exportExcel.bind('click', function(e){
                if(isDisabled(this, e)){
                    return false;
                }
                var _gridMenu = $(this).closest('.grid-menu'),
                    _table = $('table[grid-manager="'+_gridMenu.attr('grid-master')+'"]');
                var onlyChecked = false;
                if(this.getAttribute('only-checked') === 'true'){
                    onlyChecked = true;
                }
                _this.exportGridToXls(_table, undefined, onlyChecked);
                _body.off('mousedown.gridMenu');
                _gridMenu.hide();
            });
            //绑定事件：配置表
            var settingGrid = $('[grid-action="setting-grid"]');
            settingGrid.unbind('click');
            settingGrid.bind('click', function(e){
                if(isDisabled(this, e)){
                    return false;
                }
                var _gridMenu = $(this).closest('.grid-menu'),
                    _table = $('table[grid-manager="'+_gridMenu.attr('grid-master')+'"]');
                var configArea = $('.config-area', _table.closest('.table-warp'));
                $('.config-action', configArea).trigger('click');
                _body.off('mousedown.gridMenu');
                _gridMenu.hide();
            });
            //验证当前是否禁用
            function isDisabled(dom, events){
                if($(dom).hasClass('disabled')){
                    events.stopPropagation();
                    events.preventDefault();
                    return true;
                }else{
                    return false;
                }
            }
        }
    };
    return menuGM;
});
