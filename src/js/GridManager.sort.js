/*
* GridManager: 排序
* */
define(['cTool'], function($) {
    var sortGM = {
        /*
         [对外公开方法]
         @手动设置排序
         $.table: table [jquery object]
         $.sortJson: 需要排序的json串
         $.callback: 回调函数
         $.refresh: 是否执行完成后对表格进行自动刷新[boolean]
         ex: sortJson
         sortJson = {
         th-name:up/down 	//其中up/down 需要与参数 sortUpText、sortDownText值相同
         }
         */
        setSort: function(table, sortJson, callback, refresh){
            var _this = this;
            if(table.length == 0 || !sortJson || $.isEmptyObject(sortJson)){
                return false;
            }
            //默认执行完后进行刷新列表操作
            if(typeof(refresh) === 'undefined'){
                refresh = true;
            }
            var _th,
                _sortAction,
                _sortType;
            for(var s in sortJson){
                _th = $('[th-name="'+ s +'"]', table);
                _sortType = sortJson[s];
                _sortAction = $('.sorting-action', _th);
                if(_sortType == _this.sortUpText){
                    _th.attr('sorting', _this.sortUpText);
                    _sortAction.removeClass('sorting-down');
                    _sortAction.addClass('sorting-up');
                }
                else if(_sortType == _this.sortDownText){
                    _th.attr('sorting', _this.sortDownText);
                    _sortAction.removeClass('sorting-up');
                    _sortAction.addClass('sorting-down');
                }
            }
            refresh ? _this.__refreshGrid(callback) : (typeof(callback) === 'function' ? callback() : '');
            return table;
        }
        /*
         @绑定排序事件
         $.table: table [jquery object]
         */
        ,bindSortingEvent: function(table){
            var _this = this;
            var _thList = $('th[sorting]', table),	//所有包含排序的列
                _action,		//向上或向下事件源
                _th,			//事件源所在的th
                _table,			//事件源所在的table
                _tName,			//table grid-manager
                _thName;		//th对应的名称

            //绑定排序事件
            $('.sorting-action', _thList).unbind('mouseup');
            $('.sorting-action', _thList).bind('mouseup', function(){
                _action = $(this);
                _th 	= _action.closest('th');
                _table 	= _th.closest('table');
                _tName  = _table.attr('grid-manager');
                _thName = _th.attr('th-name');
                if(!_thName || $.trim(_thName) == ''){
                    _this.outLog('排序必要的参数丢失', 'error');
                    return false;
                }
                //根据组合排序配置项判定：是否清除原排序及排序样式
                if(!_this.isCombSorting){
                    $.each($('.sorting-action', _table), function(i, v){
                        if(v != _action.get(0)){   //_action.get(0) 当前事件源的DOM
                            $(v).removeClass('sorting-up sorting-down');
                            $(v).closest('th').attr('sorting', '');
                        }
                    });
                }
                //排序操作：升序
                if(_action.hasClass('sorting-down')){
                    _action.addClass('sorting-up');
                    _action.removeClass('sorting-down');
                    _th.attr('sorting', _this.sortUpText);
                }
                //排序操作：降序
                else {
                    _action.addClass('sorting-down');
                    _action.removeClass('sorting-up');
                    _th.attr('sorting', _this.sortDownText);
                }
                //生成排序数据
                if(!_this.isCombSorting){
                    _this.sortData = {};
                    _this.sortData[_th.attr('th-name')] = _th.attr('sorting');
                }else{
                    $.each($('th[th-name][sorting]', _table), function(i, v){
                        if(v.getAttribute('sorting') != ''){
                            _this.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
                        }
                    });
                }
                //调用事件、渲染tbody
                var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
                _this.sortingBefore(query);
                _this.__refreshGrid(function(){
                    _this.sortingAfter(query,  _th);
                });

            });

        }
    };
    return sortGM;
});
