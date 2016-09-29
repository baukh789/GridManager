/*
 * GridManager: 宽度调整
 * */
define(['jTool'], function($) {
    var adjustGM = {
        /*
         @绑定宽度调整事件
         $.table: table [jquery object]
         */
        bindAdjustEvent: function(table){
            var _this = this;
            var thList 	= $('thead th', table);	//页面下所有的TH
            //监听鼠标调整列宽度
            thList.off('mousedown', '.adjust-action');
            thList.on('mousedown', '.adjust-action', function(event){
                var _dragAction 	= $(this);
                var _th 			= _dragAction.closest('th'),		        //事件源所在的th
                    _tr 			= _th.parent(),								//事件源所在的tr
                    _table 			= _tr.closest('table'),			            //事件源所在的table
                    _tableDiv 		= _table.closest('.table-div'),	            //事件源所在的DIV
                    _thWarp			= $('.th-warp', _th),						//th下所有内容的外围容器
                    _dragAction		= $('.drag-action', _thWarp),				//th文本在渲染后所在的容器
                    _allTh 			= _tr.find('th[th-visible!=none]'),		    //事件源同层级下的所有th
                    _nextTh			= _allTh.eq(_th.index() + 1),				//事件源下一个可视th
                    _last 			= _allTh.eq(_allTh.length - 1), 			//事件源同层级倒数第一个th
                    _lastButOne 	= _allTh.eq(_allTh.length - 2), 			//事件源同层级倒数第二个th
                    _td 			= _table.find('tbody')
                        .find('tr')
                        .find('td:eq('+_th.index()+')'); 		//与事件源同列的所在td
                //	adjustActionToTr= $('.adjust-action',_tr);				//事件源所在的TR下的全部调整宽度节点
                //重置width 防止auto现象
                $.each(_allTh, function(i, v){
                    if(v.style.width == 'auto' || v.style.width == ''){
                        //	$(v).css('width',$(v).width());
                        $(v).width($(v).width());
                    }
                });
                //增加宽度调整中样式
                _th.addClass('adjust-selected');
                _td.addClass('adjust-selected');
                //绑定鼠标拖动事件
                var _X = event.clientX, //记录鼠标落下的横向坐标
                    _w,
                    _w2;
                var _realWidthForThText = _this.getTextWidth(_th);
                _table.unbind('mousemove');
                _table.bind('mousemove',function(e){
                    _w = e.clientX -
                        _th.offset().left -
                        _th.css('padding-left').split('px')[0] -
                        _th.css('padding-right').split('px')[0];
                    //限定最小值
                    if(_w < _realWidthForThText){
                        _w = _realWidthForThText;
                    }
                    //触发源为倒数第二列时 缩小倒数第一列
                    if(_th.index() == _lastButOne.index()){
                        _w2 = _th.width() - _w + _last.width();
                        _last.width(Math.ceil(_w2 < _realWidthForThText ? _realWidthForThText : _w2));
                    }
                    _th.width(Math.ceil(_w));
                    //_isSame:table的宽度与table-div宽度是否相同
                    //Chrome下 宽度会精确至小数点后三位 且 使用width时会进行四舍五入，需要对其进行特殊处理 宽度允许相差1px
                    var _isSame  = _this.isChrome() ?
                        (_table.get(0).offsetWidth == _tableDiv.width() || _table.get(0).offsetWidth == _tableDiv.width() + 1 || _table.get(0).offsetWidth == _tableDiv.width() - 1)
                        : _table.get(0).offsetWidth == _tableDiv.width();
                    //table宽度与table-div宽度相同 且 当前处理缩小HT宽度操作时
                    if(_isSame && _th.width() > _w){
                        _nextTh.width(Math.ceil(_nextTh.width() + _th.width() - _w))
                    }
                    //重置镜像滚动条的宽度
                    if(_this.supportSetTop){
                        $(_this.scrollDOM).trigger('scroll');
                    }
                });

                //绑定鼠标放开、移出事件
                _table.unbind('mouseup mouseleave');
                _table.bind('mouseup mouseleave',function(){
                    _table.unbind('mousemove mouseleave');
                    _th.removeClass('adjust-selected');
                    _td.removeClass('adjust-selected');
                    //重置镜像滚动条的宽度
                    if(_this.supportSetTop){
                        $(_this.scrollDOM).trigger('scroll');
                    }
                    //缓存列表宽度信息
                    _this.setToLocalStorage(_table);
                });
                return false;
            });

        }
        /*
         @获取TH宽度
         $.element: th
         */
        ,getTextWidth: function(element){
            var _this = this;
            var th 				= $(element),   				//th
                thWarp 			= $('.th-warp', th),  			//th下的GridManager包裹容器
                thText	 		= $('.th-text', th),			//文本所在容器
                remindAction	= $('.remind-action', thWarp),	//提醒所在容器
                sortingAction	= $('.sorting-action', thWarp);	//排序所在容器
            //文本镜象 用于处理实时获取文本长度
            var textDreamland	= $('.text-dreamland', th.closest('.table-warp'));

            //将th文本嵌入文本镜象 用于获取文本实时宽度
            textDreamland.text(thText.text());
            textDreamland.css({
                fontSize 	: thText.css('font-size'),
                fontWeight	: thText.css('font-weight'),
                fontFamily	: thText.css('font-family')
            });
            var thPaddingLeft = thWarp.css('padding-left').split('px')[0] || 0,
                thPaddingRight = thWarp.css('padding-right').split('px')[0] || 0;
            var thWidth = textDreamland.width()
                + (Number(thPaddingLeft) ? Number(thPaddingLeft) : 0)
                + (Number(thPaddingRight) ? Number(thPaddingRight) : 0)
                + (remindAction.length == 1 ? 20 : 5)
                + (sortingAction.length == 1 ? 20 : 5);
            return thWidth;
        }
        /*
         @重置宽度调整事件源DOM
         用于禁用最后一列调整宽度事件
         $.table:table
         */
        ,resetAdjust: function(table){
            var _this = this;
            //当前不支持宽度调整，直接跳出
            if(!_this.supportAdjust){
                return false;
            }
            var _table = $(table),
                _thList = $('thead [th-visible="visible"]', _table),
                _adjustAction = $('.adjust-action', _thList);
            if(!_adjustAction || _adjustAction.length == 0){
                return false;
            }
            _adjustAction.show();
            _adjustAction.eq(_adjustAction.length - 1).hide();
        }
    };
    return adjustGM;
});