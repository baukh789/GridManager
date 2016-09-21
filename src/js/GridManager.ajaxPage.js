/*
 * GridManager: 分页
 * */
define(['cTool'], function($) {
    var ajaxPageGM = {
        /*
         @初始化分页
         $.table:table
         */
        initAjaxPage: function(table){
            var _this = this;
            var table 		= $(table),
                tName		= table.attr('grid-manager'),
                tableWarp 	= table.closest('.table-warp'),
                pageToolbar = $('.page-toolbar', tableWarp);	//分页工具条
            /*
             //生成分页存储器
             _this.query.pageData = {
             tPage: undefined,		//总页数
             cPage: undefined,		//当前页
             pSize: undefined,		//每页显示条数
             tSize: undefined		//总条数
             };
             */
            var	sizeData = $.isArray(_this.sizeData) ? _this.sizeData : _this.sizeData[tName];
            pageToolbar.hide();
            //生成每页显示条数选择框
            _this.createPageSizeDOM(table, sizeData);

            //绑定页面跳转事件
            _this.bindPageJumpEvent(table);

            //绑定设置显示条数切换事件
            _this.bindSetPageSizeEvent(table);
        }
        /*
         @生成分页DOM节点据
         $._tableDOM_: table的juqery实例化对象
         $._pageData_:分页数据格式
         */
        ,createPageDOM:function(_tableDOM_, _pageData_){
            var _this = this;
            var table 		= $(_tableDOM_),
                tableWarp 	= table.parents('.table-warp').eq(0),
                pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
                pagination	= $('.pagination', pageToolbar);		//分页区域
            var cPage = Number(_pageData_.cPage || 0),		//当前页
                tPage = Number(_pageData_.tPage || 0),		//总页数
                tHtml = '',					//临时存储分页HTML片段
                lHtml = '';					//临时存储末尾页码THML片段
            //配置首页
            var firstClassName = 'first-page',
                previousClassName = 'previous-page';
            if(cPage == 1){
                firstClassName += ' disabled';
                previousClassName += ' disabled';
            }
            tHtml += '<li cPage="1" class="'+ firstClassName +'">'
                +  '<a href="javascript:void(0);">'+ _this.i18nText("first-page") +'</a>'
                +  '</li>'
                +  '<li cPage="'+(cPage-1)+'" class="'+ previousClassName +'">'
                +  '<a href="javascript:void(0);">'+ _this.i18nText("previous-page") +'</a>'
                +  '</li>';
            var i 	 = 1,		//循环开始数
                maxI = tPage;	//循环结束数
            //配置first端省略符
            if(cPage > 4){
                tHtml += '<li cPage="1">'
                    +  '<a href="javascript:void(0);">1</a>'
                    +  '</li>'
                    +  '<li class="disabled">'
                    +	 '<a href="javascript:void(0);">...</a>'
                    +  '</li>';
                i = cPage - 2;
            }
            //配置last端省略符
            if((tPage - cPage) > 4){
                maxI = cPage + 2;
                lHtml += '<li class="disabled">'
                    +	 '<a href="javascript:void(0);">...</a>'
                    +  '</li>'
                    +  '<li cPage="'+tPage+'">'
                    +  '<a href="javascript:void(0);">'+ tPage +'</a>'
                    +  '</li>';
            }
            // 配置页码
            for(i; i<= maxI;i++){
                if(i == cPage){
                    tHtml += '<li class="active">'
                        +  '<a href="javascript:void(0);">'+ cPage +'</a>'
                        +  '</li>';
                    continue;
                }
                tHtml += '<li cPage="'+i+'">'
                    +  '<a href="javascript:void(0);">'+ i +'</a>'
                    +  '</li>';
            }
            tHtml += lHtml;
            //配置下一页与尾页
            var nextClassName = 'next-page',
                lastClassName = 'last-page';
            if(cPage >= tPage){
                nextClassName += ' disabled';
                lastClassName += ' disabled';
            }
            tHtml += '<li cPage="'+(cPage+1)+'" class="'+ nextClassName +'">'
                +  '<a href="javascript:void(0);">'+ _this.i18nText("next-page") +'</a>'
                +  '</li>'
                +  '<li cPage="'+tPage+'" class="'+ lastClassName +'">'
                +  '<a href="javascript:void(0);">'+ _this.i18nText("last-page") +'</a>'
                +  '</li>';
            pagination.html(tHtml);
        }
        /*
         @生成每页显示条数选择框据
         $._tableDOM_: table的juqery实例化对象
         $._sizeData_: 选择框自定义条数
         */
        ,createPageSizeDOM: function(_tableDOM_, _sizeData_){
            var _this = this;
            var table		= $(_tableDOM_),
                tableWarp	= table.closest('.table-warp'),
                pageToolbar = $('.page-toolbar', tableWarp),				//分页工具条
                pSizeArea	= $('select[name="pSizeArea"]', pageToolbar);	//分页区域
            //error
            if(!_sizeData_ || !$.isArray(_sizeData_)){
                _this.outLog('渲染失败：参数[sizeData]配置错误' , 'error');
                return;
            }

            var _ajaxPageHtml = '';
            $.each(_sizeData_, function(i, v){
                _ajaxPageHtml += '<option value="'+ v +'">' + v + '</option>';
            });
            pSizeArea.html(_ajaxPageHtml);
        }
        /*
         @绑定页面跳转事件
         $._tableDOM_: table的juqery实例化对象
         */
        ,bindPageJumpEvent:function(_tableDOM_){
            var _this = this;
            var table		= $(_tableDOM_),
                tableWarp	= table.closest('.table-warp'),
                pageToolbar = $('.page-toolbar', tableWarp),		//分页工具条
                pagination	= $('.pagination', pageToolbar),		//分页区域
                gp_input	= $('.gp-input', pageToolbar),			//快捷跳转
                refreshAction	= $('.refresh-action', pageToolbar);//快捷跳转
            //绑定分页点击事件
            pageToolbar.off('click', 'li');
            pageToolbar.on('click', 'li', function(){
                var _page 		= $(this),
                    _tableWarp 	= _page.closest('.table-warp');
                var cPage = _page.attr('cPage');	//分页页码
                if(!cPage || !Number(cPage) || _page.hasClass('disabled')){
                    _this.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
                    return false;
                }
                cPage = parseInt(cPage);
                gotoPage(_tableWarp, cPage);
            });
            //绑定快捷跳转事件
            gp_input.unbind('keyup');
            gp_input.bind('keyup', function(e){
                if(e.which !== 13){
                    return;
                }
                var _tableWarp = $(this).closest('.table-warp'),
                    _inputValue = parseInt(this.value, 10);
                if(!_inputValue){
                    this.focus();
                    return;
                }
                gotoPage(_tableWarp, _inputValue);
                this.value = '';
            });
            //绑定刷新界面事件
            refreshAction.unbind('click');
            refreshAction.bind('click', function() {
                var _action = $(this);
                var _tableWarp = $(this).closest('.table-warp'),
                    _input = $('.page-toolbar .gp-input', _tableWarp),
                    _value = _input.val();
                //跳转输入框为空时: 刷新当前菜
                if(_value.trim() === ''){
                    _this.__refreshGrid();
                    return;
                }
                //跳转输入框不为空时: 验证输入值是否有效,如果有效跳转至指定页,如果无效对输入框进行聚焦
                var _inputValue = parseInt(_input.val(), 10);
                if(!_inputValue){
                    _input.focus();
                    return;
                }
                gotoPage(_tableWarp, _inputValue);
                _input.val('');
            });
            //跳转至指定页
            function gotoPage(_tableWarp, _cPage){
                var _table		= $('table[grid-manager]', _tableWarp),
                    _size 		= $('select[name="pSizeArea"]', _tableWarp);
                //跳转的指定页大于总页数
                if(_cPage > _this.pageData.tPage){
                    _cPage = _this.pageData.tPage;
                }
                //替换被更改的值
                _this.pageData.cPage = _cPage;
                _this.pageData.pSize = _this.pageData.pSize || _this.pageSize;

                //调用事件、渲染DOM
                var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
                _this.pagingBefore(query);
                _this.__refreshGrid(function() {
                    _this.pagingAfter(query);
                });
            }
        }
        /*
         @绑定设置当前页显示数事件
         $._tableDOM_: table的juqery实例化对象
         */
        ,bindSetPageSizeEvent:function(_tableDOM_){
            var _this = this;
            var table 		=  $(_tableDOM_),
                tableWarp 	= table.parents('.table-warp').eq(0),
                pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
                sizeArea	= $('select[name=pSizeArea]', pageToolbar);	//切换条数区域
            if(!sizeArea || sizeArea.length == 0){
                _this.outLog('未找到单页显示数切换区域，停止该事件绑定', 'info');
                return false;
            }
            sizeArea.unbind('change');
            sizeArea.change(function(){
                var _size = $(this);
                var _tableWarp  = _size.parents('.table-warp').eq(0),
                    _table		= $('table[grid-manager]', _tableWarp),
                    _tName 		= $('table', _tableWarp).attr('grid-manager'); //当前与分页同容器下的列表名称
                _this.pageData = {
                    cPage : 1,
                    pSize : _size.val()
                }

                _this.setToLocalStorage(_table);
                //调用事件、渲染tbody
                var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
                _this.pagingBefore(query);
                _this.__refreshGrid(function(){
                    _this.pagingAfter(query);
                });

            });
        }
        /*
         @重置当前页显示条数据
         $.table: table的juqery实例化对象
         $._pageData_:分页数据格式
         */
        ,resetPSize: function(table, _pageData_){
            var _this = this;
            var table 		=  $(table),
                tableWarp 	= table.parents('.table-warp').eq(0),
                toolBar   = $('.page-toolbar', tableWarp),
                pSizeArea = $('select[name="pSizeArea"]', toolBar),
                pSizeInfo = $('.dataTables_info', toolBar);
            if(!pSizeArea || pSizeArea.length == 0){
                _this.outLog('未找到条数切换区域，停止该事件绑定', 'info');
                return false;
            }
            var fromNum = _pageData_.cPage == 1 ? 1 : (_pageData_.cPage-1) * _pageData_.pSize + 1,	//从多少开始
                toNum	= _pageData_.cPage * _pageData_.pSize,	//到多少结束
                totalNum= _pageData_.tSize;			//总共条数
            var tmpHtml = _this.i18nText('dataTablesInfo', [fromNum, toNum, totalNum]);
            //根据返回值修正单页条数显示值
            pSizeArea.val(_pageData_.pSize || 10);
            //修改单页条数文字信息
            pSizeInfo.html(tmpHtml);
            pSizeArea.show();
        }
        /*
         [对外公开方法] @baukh20160629:不再对外公开，传参格式也变化
         @重置分页数据
         $.table: table
         $.totals: 总条数
         */
        ,resetPageData: function(table, totals){
            var _this = this;
            if(isNaN(parseInt(totals, 10))){
                return;
            }
            var _pageData = getPageData(totals);
            //生成分页DOM节点
            _this.createPageDOM(table, _pageData);
            //重置当前页显示条数
            _this.resetPSize(table, _pageData);

            var table 		= $(table),
                tableWarp 	= table.parents('.table-warp').eq(0),
                pageToolbar = $('.page-toolbar', tableWarp);	//分页工具条
            $.extend(_this.pageData, _pageData); //存储pageData信息
            pageToolbar.show();

            //计算分页数据
            function getPageData(tSize){
                var _pSize = _this.pageData.pSize || _this.pageSize,
                    _tSize = tSize,
                    _cPage = _this.pageData.cPage;
                return {
                    tPage: Math.ceil(_tSize / _pSize),		//总页数
                    cPage: _cPage,							//当前页
                    pSize: _pSize,							//每页显示条数
                    tSize: _tSize							//总条路
                }
            }
        }
    };
    return ajaxPageGM;
});