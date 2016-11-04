/*
 * GridManager: th配置
 * */
define(['jTool'], function($) {
    var configGM = {
        /*
         @绑定配置列表事件[隐藏展示列]
         $.table: table [jquery object]
         */
        bindConfigEvent: function(table){
            var _this = this;
            //打开/关闭设置区域
            var tableWarp = $(table).closest('div.table-wrap');
            var configAction = $('.config-action', tableWarp);
            configAction.unbind('click');
            configAction.bind('click', function(){
                var _configAction = $(this),		//展示事件源
                    _configArea = _configAction.closest('.config-area');	//设置区域
                //关闭
                if(_configArea.css('display') === 'block'){
                    _configArea.hide();
                    return false;
                }
                //打开
                _configArea.show();
                var _tableWarp = _configAction.closest('.table-wrap'),  //当前事件源所在的div
                    _table	= $('[grid-manager]', _tableWarp),			//对应的table
                    _thList = $('thead th', _table),					//所有的th
                    _trList = $('tbody tr', _table),					//tbody下的tr
                    _td;												//与单个th对应的td
                $.each(_thList, function(i, v){
                    v = $(v);
                    $.each(_trList, function(i2, v2){
                        _td = $('td', v2).eq(v.index());
                        _td.css('display', v.css('display'));
                    });
                });
                //验证当前是否只有一列处于显示状态 并根据结果进行设置是否可以取消显示
                var checkedLi = $('.checked-li', _configArea);
                checkedLi.length == 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');
            });
            //设置事件
            $('.config-list li', tableWarp).unbind('click');
            $('.config-list li', tableWarp).bind('click', function(){
                var _only = $(this),		//单个的设置项
                    _configArea 	= _only.closest('.config-area'),					//事件源所在的区域
                    _thName 		= _only.attr('th-name'),							//单个设置项的thName
                    _checkbox 		= _only.find('input[type="checkbox"]'),			    //事件下的checkbox
                    _tableWarp  	= _only.closest('.table-wrap'), 					//所在的大容器
                    _tableDiv	  	= $('.table-div', _tableWarp), 						//所在的table-div
                    _table	 		= $('[grid-manager]', _tableWarp),				    //所对应的table
                    _th				= $('thead th[th-name="'+_thName +'"]', _table), 	//所对应的th
                    _checkedList;		//当前处于选中状态的展示项
                if(_only.hasClass('no-click')){
                    return false;
                }
                _only.closest('.config-list').find('.no-click').removeClass('no-click');
                var isVisible = !_checkbox.get(0).checked;
                //设置与当前td同列的td是否可见
                _tableDiv.addClass('config-editing');
                _this.setAreVisible(_th, isVisible, function(){
                    _tableDiv.removeClass('config-editing');
                });
                //最后一项禁止取消
                _checkedList =  $('.config-area input[type="checkbox"]:checked', _tableWarp);
                if(_checkedList.length == 1){
                    _checkedList.parent().addClass('no-click');
                }

                //重置调整宽度事件源
                _this.resetAdjust(_table);

                //重置镜像滚动条的宽度
                if(_this.supportSetTop){
                    $('.sa-inner', _tableWarp).width('100%');
                }
                //重置当前可视th的宽度
                var _visibleTh = $('thead th[th-visible="visible"]', _table);
                $.each(_visibleTh, function(i, v){
                    v.style.width = 'auto';
                });
                //当前th文本所占宽度大于设置的宽度
                //需要在上一个each执行完后才可以获取到准确的值
                $.each(_visibleTh, function(i, v){
                    var _realWidthForThText = _this.getTextWidth(v),
                        _thWidth = $(v).width();
                    if(_thWidth < _realWidthForThText){
                        $(v).width(_realWidthForThText);
                    }else{
                        $(v).width(_thWidth);
                    }
                });
                _this.setToLocalStorage(_table);	//缓存信息
            });
        }
        /*
         [对外公开方法]
         @显示Th及对应的TD项
         $.table: table
         $.th:th
         */
        ,showTh: function(table, th){
            var _this = this;
            _this.setAreVisible($(th), true);
        }
        /*
         [对外公开方法]
         @隐藏Th及对应的TD项
         $.table: table
         $.th:th
         */
        ,hideTh: function(table, th){
            var _this = this;
            _this.setAreVisible($(th), false);
        }
        /*
         @设置列是否可见
         $._thList_	： 即将配置的列所对应的th[jquery object，可以是多个]
         $._visible_: 是否可见[Boolean]
         $.cb		: 回调函数
         */
        ,setAreVisible: function(_thList_, _visible_ ,cb){
            var _this = this;
            var _table,			//当前所在的table
                _tableWarp, 	//当前所在的容器
                _th,			//当前操作的th
                _trList, 		//当前tbody下所有的tr
                _tdList = [], 	//所对应的td
                _checkLi,		//所对应的显示隐藏所在的li
                _checkbox;		//所对应的显示隐藏事件
            $.each(_thList_, function(i, v){
                _th = $(v);
                _table = _th.closest('table');
                _tableWarp = _table.closest('.table-wrap');
                _trList = $('tbody tr', _table);
                _checkLi = $('.config-area li[th-name="'+ _th.attr('th-name') +'"]', _tableWarp);
                _checkbox = _checkLi.find('input[type="checkbox"]');
                if(_checkbox.length == 0){
                    return;
                }
                $.each(_trList, function(i2, v2){
                    _tdList.push($(v2).find('td').eq(_th.index()));
                });
                //显示
                if(_visible_){
                    _th.attr('th-visible','visible');
                    $.each(_tdList, function(i2, v2){
                        $(v2).show();
                    });
                    _checkLi.addClass('checked-li');
                    _checkbox.get(0).checked = true;
                }
                //隐藏
                else{
                    _th.attr('th-visible','none');
                    $.each(_tdList, function(i2, v2){
                        $(v2).hide();
                    });
                    _checkLi.removeClass('checked-li');
                    _checkbox.get(0).checked = false;
                }
                typeof(cb) == 'function' ? cb() : '';
            });
        }
    };
    return configGM;
});