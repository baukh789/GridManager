/*
 * GridManager: 拖拽
 * */
define(['jTool'], function($) {
    var dragGM = {
        /*
         @绑定拖拽换位事件
         $.table: table [jquery object]
         */
        bindDragEvent: function(table){
            var _this = this;
            var thList = $('thead th', table),	//匹配页面下所有的TH
                dragAction	= thList.find('.drag-action');
            //指定拖拽换位事件源,配置拖拽样式
            var _th,			//事件源th
                _prevTh,		//事件源的上一个th
                _nextTh,		//事件源的下一个th
                _prevTd,		//事件源对应的上一组td
                _nextTd,		//事件源对应的下一组td
                _tr,			//事件源所在的tr
                _allTh,			//事件源同层级下的所有th
                _table,			//事件源所在的table
                _tableDiv,		//事件源所在的DIV
                _td,			//与事件源同列的所在td
                _divPosition,	//所在DIV使用定位方式
                _dreamlandDIV;	//临时展示被移动的列
            var SIV_td;			//用于处理时实刷新造成的列表错乱
            dragAction.unbind('mousedown');
            dragAction.bind('mousedown',function(){
                _th 			= $(this).closest('th'),					//事件源所在的th
                _prevTh			= undefined,							//事件源的上一个th
                _nextTh			= undefined,							//事件源的下一个th
                _prevTd			= undefined,							//事件源对应的上一组td
                _nextTd			= undefined,							//事件源对应的下一组td
                _tr 			= _th.parent(),							//事件源所在的tr
                _allTh 			= _tr.find('th'), 						//事件源同层级下的所有th
                _table 			= _tr.closest('table'),			        //事件源所在的table
                _tableDiv 		= _table.closest('.table-div'),	        //事件源所在的DIV
                _td 			= _th.getRowTd();                       //存储与事件源同列的所有td

                //禁用文字选中效果
                $('body').addClass('no-select-text');

                //父级DIV使用相对定位
                _divPosition = _tableDiv.css('position');
                if(_divPosition != 'relative' && _divPosition != 'absolute'){
                    _tableDiv.css('position','relative');
                }
                //处理时实刷新造成的列表错乱
                if(_this.isRealTime){
                    _th.addClass('drag-ongoing');
                    _td.addClass('drag-ongoing');
                    window.clearInterval(SIV_td);
                    SIV_td = window.setInterval(function(){
                        _td = _table.find('tbody tr').find('td:eq('+_th.index()+')'); 	//与事件源同列的所有td
                        _td.addClass('drag-ongoing');
                    },100);
                }else{
                    _th.addClass('drag-ongoing opacityChange');
                    _td.addClass('drag-ongoing opacityChange');
                }
                //增加临时展示DOM
                _dreamlandDIV = $('<div class="dreamland-div"></div>');
                _tableDiv.parent().append(_dreamlandDIV);
                var tmpHtml = '<table class="dreamland-table '+ _table.attr('class') +'">'
                    + '<thead>'
                    + '<tr>'
                    + '<th style="height:'+_th.get(0).offsetHeight+'px">'
                    + _th.find('.drag-action').get(0).outerHTML
                    + '</th>'
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>';
                //tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
                var _cloneTr,_cloneTd;
                $.each(_td, function(i, v){
                    _cloneTd = v.cloneNode(true);
                    _cloneTd.style.height = v.offsetHeight + 'px';
                    _cloneTr = $(v).closest('tr').clone();
                    tmpHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
                });
                tmpHtml += '</tbody>'
                    + '</table>';
                _dreamlandDIV.html(tmpHtml);
                //绑定拖拽滑动事件
                $('body').unbind('mousemove');
                $('body').bind('mousemove', function(e2){
                    _prevTh = undefined;
                    //当前移动的非第一列
                    if(_th.index() != 0){
                        _prevTh = _allTh.eq(_th.index() - 1);
                    }
                    _nextTh = undefined;
                    //当前移动的非最后一列
                    if(_th.index() != _allTh.length -1){
                        _nextTh = _allTh.eq(_th.index() + 1);
                    }
                    //插件自动创建的项,不允许移动
                    if(_prevTh && _prevTh.attr('gm-create') === 'true'){
                        _prevTh = undefined;
                    }
                    else if(_nextTh && _nextTh.attr('gm-create') === 'true'){
                        _nextTh = undefined;
                    }
                    _dreamlandDIV.show();
                    _dreamlandDIV.css({
                        width	: _th.get(0).offsetWidth,
                        height	: _table.get(0).offsetHeight,
                        left	: e2.clientX - _tableDiv.offset().left
                        //  + $('html').get(0).scrollLeft
                        + _tableDiv.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
                        - _th.get(0).offsetWidth / 2,
                        top		: e2.clientY - _tableDiv.offset().top
                        + _tableDiv.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop)
                        - _dreamlandDIV.find('th').get(0).offsetHeight / 2
                    });
                    //处理向左拖拽
                    if(_prevTh && _prevTh.length != 0
                        && _dreamlandDIV.get(0).offsetLeft < _prevTh.get(0).offsetLeft){
                        _prevTd = _prevTh.getRowTd();
                        _prevTh.before(_th);
                        console.log('left')
                        $.each(_td,function(i, v){
                            _prevTd.eq(i).before(v);
                        });
                        _allTh = _tr.find('th'); //重置TH对象数据
                    }
                    //处理向右拖拽
                    if(_nextTh && _nextTh.length != 0
                        && _dreamlandDIV.get(0).offsetLeft > _nextTh.get(0).offsetLeft - _dreamlandDIV.get(0).offsetWidth / 2){
                        _nextTd = _table.find('tbody').find('tr').find('td:eq('+_nextTh.index()+')');
                        _nextTh.after(_th);
                        console.log('right')
                        $.each(_td,function(i, v){
                            _nextTd.eq(i).after(v);
                        });
                        _allTh = _tr.find('th'); //重置TH对象数据
                    }
                });
                //绑定拖拽停止事件
                $('body').unbind('mouseup');
                $('body').bind('mouseup',function(){
                    $('body').unbind('mousemove');
                    //清除临时展示被移动的列
                    _dreamlandDIV = $('.dreamland-div');
                    if(_dreamlandDIV.length != 0){
                        _dreamlandDIV.animate({
                            top	: _table.get(0).offsetTop,
                            left: _th.get(0).offsetLeft - _tableDiv.get(0).scrollLeft
                        },_this.animateTime,function(){
                            _tableDiv.css('position',_divPosition);
                            _th.removeClass('drag-ongoing');
                            _td.removeClass('drag-ongoing');
                            _dreamlandDIV.remove();
                        });
                    }
                    //缓存列表位置信息
                    _this.setToLocalStorage(_table);

                    //重置调整宽度事件源
                    _this.resetAdjust(_table);
                    //开启文字选中效果
                    $('body').removeClass('no-select-text');
                    if(_this.isRealTime){
                        window.clearInterval(SIV_td);
                    }
                });
            });
        }
    };
    return dragGM;
});