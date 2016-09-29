/*
* GridManager base function
* */
define(['jTool'], function($) {
    var baseGM = {
        /*
         @当前浏览器是否为谷歌[内部参数]
         */
        isChrome: function(){
            return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
        }
        /*
         @获取随机参数
         */
        ,getRandom: function(){
            return this.version + Math.random();
        }
        /*
         [对外公开方法]
         @初始化方法
         $.callback:回调
         $.jQueryObj: table [jquery object]
         */
        ,init: function(jQueryObj, callback){
            var _this = this;
            //通过版本较验 清理缓存
            _this.cleanTableCacheForVersion(jQueryObj);
            if(typeof _this.gridManagerName !== 'string' || _this.gridManagerName.trim() === ''){
                _this.gridManagerName = jQueryObj.attr('grid-manager');	//存储gridManagerName值
            }
            if(_this.gridManagerName.trim() === ''){
                _this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
                return false;
            }

            if(jQueryObj.hasClass('GridManager-ready') || jQueryObj.hasClass('GridManager-loading')){
                _this.outLog('渲染失败：可能该表格已经渲染或正在渲染' , 'error');
                return false;
            }
            //根据本地缓存配置每页显示条数
            if(_this.supportAjaxPage){
                _this.configPageForCache(jQueryObj);
            }
            var query = $.extend({}, _this.query, _this.pageData);
            //增加渲染中标注
            jQueryObj.addClass('GridManager-loading');
            //加载所需资源
            _this.loadGridManagerFile(function(){  //baukh20160705:加载资源应该移除
                _this.initTable(jQueryObj);

                //如果初始获取缓存失败，则在mousedown时，首先存储一次数据
                if(typeof jQueryObj.attr('grid-manager-cache-error') !== 'undefined'){
                    window.setTimeout(function(){
                        _this.setToLocalStorage(jQueryObj, true);
                        jQueryObj.removeAttr('grid-manager-cache-error');
                    },1000);
                }

                //重置tbody存在数据的列表 @20160717:的2.0版本中，重置已在其它位置执行，该处已无用
                //$('tbody tr', jQueryObj).length > 0 ? _this.resetTd(v, false) : '';
                //启用回调
                typeof(callback) == 'function' ? callback(query) :'';
            });
            return jQueryObj;
        }
        /*
         @初始化列表
         $.table: table[jquery object]
         */
        ,initTable: function(table){
            var _this = this;

            //渲染HTML，嵌入所需的事件源DOM
            _this.createDOM(table);
            //获取本地缓存并对列表进行配置
            if(!_this.disableCache){
                _this.configTheadForCache(table);
            }
            //绑定宽度调整事件
            if(_this.supportAdjust){
                _this.bindAdjustEvent(table);
            }
            //绑定拖拽换位事件
            if(_this.supportDrag){
                _this.bindDragEvent(table);
            }
            //绑定排序事件
            if(_this.supportSorting){
                _this.bindSortingEvent(table);
            }
            //绑定表头提示事件
            if(_this.supportRemind){
                _this.bindRemindEvent(table);
            }
            //绑定配置列表事件
            if(_this.supportConfig){
                _this.bindConfigEvent(table);
            }
            //绑定表头吸顶功能
            if(_this.supportSetTop){
                _this.bindSetTopFunction(table);
            }
            //绑定右键菜单事件
            _this.bindRightMenuEvent(table);
            //渲梁tbodyDOM
            _this.__refreshGrid();
            //将GridManager实例化对象存放于jquery data
            _this.setGridManagerToJQuery(table);

        }
        /*
         @存储对外实例至JQuery
         $.table:当前被实例化的table
         */
        ,setGridManagerToJQuery: function(table){
            table.data('gridManager', this);
        }
        /*
         [对外公开方法]
         @通过JQuery实例获取gridManager
         $.table:table [jquery object]
         */
        ,get: function(table){
            return this.__getGridManager(table);
        }
        /*
         @通过JQuery实例获取gridManager
         $.table:table [jquery object]
         */
        ,__getGridManager: function(table){
            return table.data('gridManager');
        }

        /*
         @加载所需文件
         */
        ,loadGridManagerFile: function(callback){
            var _this = this;
            var loadIConfont = false,
                loadListCss  = false,
                loadPageCss  = false;
            //加载列表样式文件
            if($('link#GridManager-css').length == 0 && _this.autoLoadCss){
                var GridManagerCss  = document.createElement('link');
                GridManagerCss.id   = 'GridManager-css';
                GridManagerCss.rel  = 'stylesheet';
                GridManagerCss.type = 'text/css';
                GridManagerCss.href = _this.basePath + 'css/GridManager.css';
                document.head.appendChild(GridManagerCss);
                GridManagerCss.addEventListener('load', function(event) {
                    _this.outLog('GridManager-css load OK' , 'info');
                    loadListCss = true;
                    gotoCallback();
                });
                GridManagerCss.addEventListener('error', function(){
                    _this.outLog('GridManager-css load error' , 'error');
                    loadListCss = false;
                });
            }else{
                loadListCss = true;
            }
            //加载用户自定义分页样式文件
            if(_this.supportAjaxPage &&
                $('link#GridManager-ajaxPage-css').length == 0 &&
                _this.pageCssFile && _this.pageCssFile != ''){
                var ajaxPageCss  = document.createElement('link');
                ajaxPageCss.id   = 'GridManager-ajaxPage-css';
                ajaxPageCss.rel  = 'stylesheet';
                ajaxPageCss.type = 'text/css';
                ajaxPageCss.href = _this.pageCssFile;
                document.head.appendChild(ajaxPageCss);
                ajaxPageCss.addEventListener('load', function(event) {
                    _this.outLog('GridManager-ajaxPage-css load OK', 'info');
                    loadPageCss = true;
                    gotoCallback();
                });
                ajaxPageCss.addEventListener('error', function(){
                    _this.outLog('GridManager-ajaxPage-css load error', 'error');
                    loadPageCss = false;
                });
            }else{
                loadPageCss = true;
            }
            gotoCallback();
            function gotoCallback(){
                if(/*loadIConfont && */loadListCss && loadPageCss){
                    callback();
                }
            }
        }

        /*
         * @缓存数据
         * 用于存储当前渲染表格的数据
         * 通过每个tr上的cache-key进行获取
         * */
        ,cacheData: {}
        /*
         * [对外公开方法]
         * @获取当前行渲染时使用的数据
         * $.table:当前操作的grid,由插件自动传入
         * $.tr: 将要获取数据所对应的tr[tr DOM]
         * */
        ,getRowData: function(table, tr) {
            return this.cacheData[$(tr).attr('cache-key')];
        }
        /*
         [对外公开方法]
         @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
         $.table:当前操作的grid,由插件自动传入
         $.gotoFirstPage:  是否刷新时跳转至第一页
         $.callback: 回调函数
         */
        ,refreshGrid: function(table, gotoFirstPage, callback){
            var _this = this;
            if(typeof(gotoFirstPage) !== 'boolean'){
                callback = gotoFirstPage;
                gotoFirstPage = false;
            }
            if(gotoFirstPage){
                _this.pageData['cPage'] = 1;
            }
            _this.__refreshGrid(callback);
        }
        /*
         @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
         $.callback: 回调函数
         */
        ,__refreshGrid: function(callback){
            var _this = this;
            var tableDOM = $('table[grid-manager="'+ _this.gridManagerName +'"]'),		//table dom
                tbodyDOM = $('tbody', tableDOM),	//tbody dom
                refreshAction = $('.page-toolbar .refresh-action', tableDOM.closest('.table-warp')); //刷新按纽
            //增加刷新中标识
            refreshAction.addClass('refreshing');
            /*
             使用配置数据
             如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
             且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
             */
            if(_this.ajax_data){
                driveDomForSuccessAfter(_this.ajax_data);
                _this.ajax_success(_this.ajax_data);
                removeRefreshingClass();
                typeof callback === 'function' ? callback() : '';
                return;
            }
            if(typeof(_this.ajax_url) != 'string' || _this.ajax_url === ''){
                _this.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
                removeRefreshingClass();
                typeof callback === 'function' ? callback() : '';
                return;
            }
            /*
             @baukh20160717:2。0版本中该验证将无用
             if(!tbodyDOM || tbodyDOM.length === 0){
             tableDOM.append('<tbody></tbody>');
             tbodyDOM = $('tbody', tableDOM);
             }
             */
            var parme = $.extend({}, _this.query);
            //合并分页信息至请求参
            if(_this.supportAjaxPage){
                $.extend(parme, _this.pageData);
            }
            //合并排序信息至请求参
            if(_this.supportSorting){
                $.extend(parme, _this.sortData);
            }
            //当前页小于1时, 修正为1
            if(parme.cPage < 1){
                parme.cPage = 1;
                //当前页大于总页数时, 修正为总页数
            }else if(parme.cPage > parme.tPage){
                parme.cPage = parme.tPage
            }
            //执行ajax前事件
            $.ajax({
                url: _this.ajax_url,
                type: _this.ajax_type,
                data: parme,
                cache: true,
                beforeSend: function(XMLHttpRequest){
                    _this.ajax_beforeSend(XMLHttpRequest);
                },
                success: function(response){
                    driveDomForSuccessAfter(response);
                    _this.ajax_success(response);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    _this.ajax_error(XMLHttpRequest, textStatus, errorThrown);
                },
                complete: function(XMLHttpRequest, textStatus){
                    _this.ajax_complete(XMLHttpRequest, textStatus);
                    removeRefreshingClass();
                }
            });
            //移除刷新中样式
            function removeRefreshingClass(){
                window.setTimeout(function(){
                    refreshAction.removeClass('refreshing');
                }, 2000);
            }
            //执行ajax成功后重新渲染DOM
            function driveDomForSuccessAfter(response) {
                if(!response){
                    _this.outLog('请求数据失败！请查看配置参数[ajax_url或ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
                    return;
                }

                var tbodyTmpHTML = '';	//用于拼接tbody的HTML结构
                var parseRes = typeof(response) === 'string' ? JSON.parse(response) : response;
                var _data = parseRes[_this.dataKey];
                var key,	//数据索引
                    alignAttr, //文本对齐属性
                    template,//数据模板
                    templateHTML;//数据模板导出的html
                _this.cacheData = {};
                //数据为空时
                if(!_data ||_data.length === 0){
                    tbodyTmpHTML = '<tr emptyTemplate>'
                        + '<td colspan="'+$('th[th-visible="visible"]', tableDOM).length+'">'
                        + (_this.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>')
                        + '</td>'
                        + '</tr>';
                    parseRes.totals = 0;
                    tbodyDOM.html(tbodyTmpHTML);
                }else {
                    $.each(_data, function(i, v){
                        _this.cacheData[i] = v;
                        tbodyTmpHTML += '<tr cache-key="'+ i +'">';
                        $.each(_this.columnData, function(i2, v2){
                            key = v2.key;
                            template = v2.template;
                            templateHTML = typeof template === 'function' ? template(v[key], v) : v[key];
                            alignAttr = v2.align ? 'align="'+v2.align+'"' : '';
                            tbodyTmpHTML += '<td '+ alignAttr +'>'+ templateHTML +'</td>';
                        });
                        tbodyTmpHTML += '</tr>';
                    });
                    tbodyDOM.html(tbodyTmpHTML);
                    _this.resetTd(tableDOM, false);
                }
                //渲染分页
                if(_this.supportAjaxPage){
                    _this.resetPageData(tableDOM, parseRes[_this.totalsKey]);
                    _this.checkMenuPageAction();
                }
                typeof callback === 'function' ? callback() : '';
            }
        }

        /*
         @渲染HTML，根据配置嵌入所需的事件源DOM
         $.table: table[JQuery对象]
         */
        ,createDOM: function(table){
            var _this = this;
            table.attr({width: '100%', cellspacing: 1, cellpadding:0, 'grid-manager': _this.gridManagerName});
            var theadHtml = '<thead grid-manager-thead>',
                tbodyHtml = '<tbody></tbody>',
                alignAttr = '', 				//文本对齐属性
                widthHtml = '',					//宽度对应的html片段
                remindHtml = '',				//提醒对应的html片段
                sortingHtml	= '';				//排序对应的html片段
            //通过配置项[columnData]生成thead
            $.each(_this.columnData, function(i, v){
                if(_this.supportRemind && typeof(v.remind) === 'string' && v.remind !== ''){
                    remindHtml = 'remind="' + v.remind +'"';
                }
                sortingHtml = '';
                if(_this.supportSorting && typeof(v.sorting) === 'string'){
                    if(v.sorting === _this.sortDownText){
                        sortingHtml = 'sorting="' + _this.sortDownText +'"';
                        _this.sortData[v.key] = _this.sortDownText
                    }
                    else if(v.sorting === _this.sortUpText){
                        sortingHtml = 'sorting="' + _this.sortUpText +'"';
                        _this.sortData[v.key] = _this.sortUpText
                    }else {
                        sortingHtml = 'sorting';
                    }
                }
                if(v.width){
                    widthHtml = 'width="'+ v.width +'"';
                }else{
                    widthHtml = '';
                }
                alignAttr = v.align ? 'align="'+v.align+'"' : '';
                theadHtml += '<th th-name="'+ v.key +'" '+remindHtml+' '+sortingHtml+' '+widthHtml+' '+alignAttr+'>'+ v.text +'</th>';
            });
            theadHtml += '</thead>';
            table.html(theadHtml + tbodyHtml);

            //嵌入序号DOM
            if(_this.supportAutoOrder){
                _this.initOrderDOM(table);
            }
            //嵌入选择返选DOM
            if(_this.supportCheckbox){
                _this.initCheckboxDOM(table);
            }
            //存储原始th DOM
            _this.setOriginalThDOM(table);
            //表头提醒HTML
            var _remindHtml  = '<div class="remind-action">'
                + '<i class="ra-help iconfont icon-icon"></i>'
                + '<div class="ra-area">'
                + '<span class="ra-title"></span>'
                + '<span class="ra-con"></span>'
                + '</div>'
                + '</div>';
            //配置列表HTML
            var	_configHtml	 = '<div class="config-area"><span class="config-action"><i class="iconfont icon-31xingdongdian"></i></span>'
                + '<ul class="config-list"></ul></div>';
            //宽度调整HTML
            var	_adjustHtml	 = '<span class="adjust-action"></span>';
            //排序HTML
            var	_sortingHtml = '<div class="sorting-action">'
                + '<i class="sa-icon sa-up iconfont icon-sanjiao2"></i>'
                + '<i class="sa-icon sa-down iconfont icon-sanjiao1"></i>'
                + '</div>';
            //导出表格数据所需的事件源DOM
            var exportActionHtml = '<a href="" download="" id="gm-export-action"></a>';
            //AJAX分页HTML
            if(_this.supportAjaxPage){
                var	_ajaxPageHtml= '<div class="page-toolbar">'
                    + '<div class="dataTables_info"></div>'
                    + '<div class="change-size"><select name="pSizeArea"></select></div>'
                    + '<div class="goto-page">'+ _this.i18nText("goto-first-text")
                    + '<input type="text" class="gp-input"/>'+ _this.i18nText("goto-last-text")
                    + '</div>'
                    + '<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>'
                    + '<div class="ajax-page"><ul class="pagination"></ul></div>'
                    + '</div>';
            }
            var	tableWarp,						//单个table所在的DIV容器
                tName,							//table的GridManager属性值
                tableDiv,						//单个table所在的父级DIV
                onlyThead,						//单个table下的thead
                onlyThList,						//单个table下的TH
                onlyTH,							//单个TH
                onlyThWarp,						//单个TH下的上层DIV
                thHeight,						//TH的高
                thPadding,						//TH当前的padding值
                marginRigth,					//调整宽度节点所需要右移的数值
                remindDOM,						//表头提醒DOM
                adjustDOM,						//调整宽度DOM
                sortingDom,						//排序DOM
                sortType,						//排序类形
                isLmOrder,						//是否为插件自动生成的序号列
                isLmCheckbox;					//是否为插件自动生成的选择列
            //校验table的必要参数
            _this.checkTable(table);   //@baukh20160705:这个后期可以移除了，2.0版本中将没有什么作用了

            //根据配置使用默认的表格样式
            if(_this.useDefaultStyle){
                table.addClass('grid-manager-default');
            }
            onlyThead = $('thead', table);
            onlyThList = onlyThead.find('th');
            table.wrap('<div class="table-warp"><div class="table-div"></div><span class="text-dreamland"></span></div>');
            tableWarp = table.closest('.table-warp');
            tableDiv = $('.table-div', tableWarp);
            //嵌入配置列表DOM
            if(_this.supportConfig){
                tableWarp.append(_configHtml);
            }
            tName = table.attr('grid-manager');
            //嵌入Ajax分页DOM
            if(_this.supportAjaxPage){
                tableWarp.append(_ajaxPageHtml);
                _this.initAjaxPage(table);
            }
            //嵌入导出表格数据事件源
            if(_this.supportExport){
                tableWarp.append(exportActionHtml);
            }
            //表头置顶
            if(_this.supportSetTop){
                tableDiv.after('<div class="scroll-area"><div class="sa-inner"></div></div>');
            }

            $.each(onlyThList, function(i2,v2){
                onlyTH = $(v2);
                onlyTH.attr('th-visible','visible');

                //是否为自动生成的序号列
                if(_this.supportAutoOrder && onlyTH.attr('gm-order') == 'true'){
                    isLmOrder = true;
                }else{
                    isLmOrder = false;
                }

                //是否为自动生成的选择列
                if(_this.supportCheckbox && onlyTH.attr('gm-checkbox') == 'true'){
                    isLmCheckbox = true;
                }else{
                    isLmCheckbox = false;
                }

                //嵌入th下外层div
                onlyThWarp = $('<div class="th-warp"></div>');
                //th存在padding时 转移至th-warp
                if(_this.isChrome()){
                    thPadding = onlyTH.css('padding');  //firefox 不兼容
                }else{
                    thPadding = onlyTH.css('padding-top') + ' '
                        + onlyTH.css('padding-right') + ' '
                        + onlyTH.css('padding-bottom') + ' '
                        + onlyTH.css('padding-left');
                }
                thPadding = $.trim(thPadding);
                if(thPadding != '' && thPadding != '0px' && thPadding != '0px 0px 0px 0px'){
                    onlyThWarp.css('padding', thPadding);
                    onlyTH.css('cssText','padding:0px!important');
                }
                //嵌入配置列表项
                if(_this.supportConfig){
                    $('.config-list', tableWarp)
                        .append('<li th-name="'+ onlyTH.attr('th-name') +'" class="checked-li">'
                            + '<input type="checkbox" checked="checked"/>'
                            + '<label>'
                            + '<span class="fake-checkbox"></span>'
                            + onlyTH.text()
                            + '</label>'
                            + '</li>');
                }
                //嵌入拖拽事件源
                //插件自动生成的排序与选择列不做事件绑定
                if(_this.supportDrag && !isLmOrder && !isLmCheckbox){
                    onlyThWarp.html('<span class="th-text drag-action">'+onlyTH.html()+'</span>');
                }else{
                    onlyThWarp.html('<span class="th-text">'+ onlyTH.html() +'</span>');
                }
                var onlyThWarpPaddingTop = onlyThWarp.css('padding-top');
                //嵌入表头提醒事件源
                //插件自动生成的排序与选择列不做事件绑定
                if(_this.supportRemind && onlyTH.attr('remind') != undefined && !isLmOrder && !isLmCheckbox){
                    remindDOM = $(_remindHtml);
                    remindDOM.find('.ra-title').text(onlyTH.text());
                    remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
                    if(onlyThWarpPaddingTop != '' && onlyThWarpPaddingTop != '0px'){
                        remindDOM.css('top', onlyThWarpPaddingTop);
                    }
                    onlyThWarp.append(remindDOM);
                }
                //嵌入排序事件源
                //插件自动生成的排序与选择列不做事件绑定
                sortType = onlyTH.attr('sorting');
                if(_this.supportSorting &&  sortType!= undefined && !isLmOrder && !isLmCheckbox){
                    sortingDom = $(_sortingHtml);
                    //依据 sortType 进行初始显示
                    switch(sortType){
                        case _this.sortUpText : sortingDom.addClass('sorting-up');
                            break;
                        case _this.sortDownText : sortingDom.addClass('sorting-down');
                            break;
                    }
                    if(onlyThWarpPaddingTop != ''  && onlyThWarpPaddingTop != '0px'){
                        sortingDom.css('top', onlyThWarpPaddingTop);
                    }
                    onlyThWarp.append(sortingDom);
                }
                //嵌入宽度调整事件源
                //插件自动生成的选择列不做事件绑定
                if(_this.supportAdjust && !isLmCheckbox){
                    adjustDOM = $(_adjustHtml);
                    //最后一列不支持调整宽度
                    if(i2 == onlyThList.length - 1){
                        adjustDOM.hide();
                    }
                    onlyThWarp.append(adjustDOM);
                }
                onlyTH.html(onlyThWarp);

                //如果th上存在width属性，则表明配置项中存在该项配置；
                //验证当前列是否存在宽度配置，如果存在，则直接使用配置项中的宽度，如果不存在则使用getTextWidth方法进行计算
                var thWidthForConfig = onlyTH.prop('width');
                if(thWidthForConfig && thWidthForConfig !== ''){
                    onlyTH.width(thWidthForConfig);
                    onlyTH.removeAttr('width');  //直接使用removeProp 无效
                }else{
                    var _realWidthForThText = _this.getTextWidth(onlyTH); //当前th文本所占宽度大于设置的宽度
                    onlyTH.css('min-width', _realWidthForThText);
                }
            });
            //删除渲染中标识、增加渲染完成标识
            table.removeClass('GridManager-loading');
            table.addClass('GridManager-ready');
        }
        /*
         @校验table的必要参数[th-name]
         必要参数不完整时将进行自动添加，但被添加的表将关闭缓存功能
         $.table: table
         */
        ,checkTable: function(table){
            var _this = this;
            var table 	= $(table),				//当前表
                thList 	= $('thead th', table); //当前表的所有th
            var noCache = false;				//是否禁用缓存
            //校验[th-name]
            $.each(thList, function(i, v){
                if(!v.getAttribute('th-name')){
                    noCache ? '' : noCache = true;
                    v.setAttribute('th-name', 'auto-th-' + _this.getRandom());
                }
            });
            //通过验证后确定是否禁用缓存
            if(noCache){
                table.attr('no-cache', 'true');
            }
        }
        /*
         @保存至本地缓存
         $.table:table [jquery object]
         $.isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
         */
        ,setToLocalStorage: function(table, isInit){
            var _this = this;
            //当前为禁用缓存模式，直接跳出
            if(_this.disableCache){
                return;
            }
            var _table = $(table);
            //当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
            var noCache = _table.attr('no-cache');
            if(noCache && noCache== 'true'){
                _this.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
                return false;
            }
            if(!window.localStorage){
                _this.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
                return false;
            }
            if(!_table || _table.length == 0){
                _this.outLog('setToLocalStorage:无效的table', 'error');
                return false;
            }
            var _gridKey = _table.attr('grid-manager');
            //验证当前表是否为GridManager
            if(!_gridKey || $.trim(_gridKey) == ''){
                _this.outLog('setToLocalStorage:无效的grid-manager', 'error');
                return false;
            }
            var _cache 		= {},
                _cacheString= '',
                _pageCache 	= {},
                _thCache	= new Array(),
                _thData 	= {};
            var thList = $('thead[grid-manager-thead] th', _table);
            if(!thList || thList.length == 0){
                _this.outLog('setToLocalStorage:无效的thList,请检查是否正确配置table,thead,th', 'error');
                return false;
            }

            //key 由pathcname + hash + 唯一标识grid-manager + 表列数 [用于规避同页面下存在grid-manager相同的表格]
            var _key = window.location.pathname +  window.location.hash + '-' +  _gridKey;
            var $v;
            $.each(thList, function(i, v){
                $v = $(v);
                _thData = {};
                _thData.th_name = v.getAttribute('th-name');
                if(_this.supportDrag){
                    _thData.th_index = $v.index();
                }
                if(_this.supportAdjust){
                    //用于处理宽度在特定情况下发生异常
                    isInit ? $v.css('width', $v.css('width')) : '';
                    _thData.th_width = v.offsetWidth;
                }
                if(_this.supportConfig){
                    _thData.isShow = $('.config-area li[th-name="'+ _thData.th_name +'"]', _table.closest('.table-warp')).find('input[type="checkbox"]').get(0).checked;
                }
                _thCache.push(_thData);
            });
            _cache.th = _thCache;
            //存储分页
            if(_this.supportAjaxPage){
                _pageCache.pSize = $('select[name="pSizeArea"]', _table.closest('.table-warp')).val();
                _cache.page = _pageCache;
            }
            _cacheString = JSON.stringify(_cache);
            window.localStorage.setItem(_key,_cacheString);
            return _cacheString;
        }
        /*
         [对外公开方法]
         @获取指定表格的本地存储数据
         $.table:table
         成功则返回本地存储数据,失败则返回空对象
         */
        ,getLocalStorage: function(table){
            var _this = this;
            var _table = $(table);
            var _key = _this.getLocalStorageKey(_table);
            if(!_key){
                return {};
            }
            var _data = {},
                _array = new Array(),
                _localStorage = window.localStorage.getItem(_key);
            //如无数据，增加属性标识：grid-manager-cache-error
            if(!_localStorage){
                _table.attr('grid-manager-cache-error','error');
                return {};
            }
            _data.key = _key;
            _data.cache = JSON.parse(_localStorage);
            return _data;
        }
        /*
         [对外公开方法]
         @清除指定表的表格记忆数据
         $.table:table
         返回成功或者失败的布尔值
         * */
        ,clear: function(table){
            var _this = this;
            var _table = $(table);
            var _key = _this.getLocalStorageKey(_table);
            if(!_key){
                return false;
            }
            window.localStorage.removeItem(_key);
            return true;
        }
        /*
         * 获取指定表格本地存储所使用的key
         * $table: table jquery
         * */
        ,getLocalStorageKey: function($table){
            var _this = this;
            //当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
            var noCache = $table.attr('no-cache');
            if(noCache && noCache== 'true'){
                _this.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
                return false;
            }
            if(!window.localStorage){
                _this.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
                return false;
            }
            if(!$table || $table.length == 0){
                _this.outLog('getLocalStorage:无效的table', 'error');
                return false;
            }
            var _gridKey = $table.attr('grid-manager');
            //验证当前表是否为GridManager
            if(!_gridKey || $.trim(_gridKey) == ''){
                _this.outLog('getLocalStorage:无效的grid-manager', 'error');
                return false;
            }
     //       var thList = $('thead[class!="set-top"] th', $table);
            return window.location.pathname +  window.location.hash + '-'+ _gridKey;
        }
        /*
         @根据本地缓存配置分页
         $.table: table[jquery object]
         配置当前页显示数
         */
        ,configPageForCache: function(table){
            var _this = this;
            var _data = _this.getLocalStorage(table),		//本地缓存的数据
                _cache = _data.cache,		//缓存对应
                _pSize,			 //每页显示条数
                _query;			 //init 后的callback中的query参数
            //验证是否存在每页显示条数缓存数据
            if(!_cache || !_cache.page || !_cache.page.pSize){
                _pSize = _this.pageSize || 10.
            }
            else{
                _pSize = _cache.page.pSize;
            }
            _this.pageData = {
                pSize : _pSize,
                cPage : 1
            };
        }
        /*
         @存储原Th DOM至table data
         $.table: table [jquery object]
         */
        ,setOriginalThDOM: function(table){
            table.data('originalThDOM', $('thead th', table));
        }
        /*
         @获取原Th DOM至table data
         $.table: table [jquery object]
         */
        ,getOriginalThDOM: function(table){
            return $(table).data('originalThDOM');
        }
        /*
         @根据本地缓存thead配置列表
         $.table: table [jquery object]
         获取本地缓存
         存储原位置顺序
         根据本地缓存进行配置
         */
        ,configTheadForCache: function(table){
            var _this = this;
            var _data = _this.getLocalStorage(table),		//本地缓存的数据
                _domArray = [];
            var	_th,		//单一的th
                _td,		//单列的td，与_th对应
                _cache,		//列表的缓存数据
                _thCache,	//th相关 缓存
                _thJson,	//th的缓存json
                _thArray,
                _tbodyArray;
            //验证：当前table 没有缓存数据
            if(!_data || $.isEmptyObject(_data)){
                _this.outLog('configTheadForCache:当前table没有缓存数据', 'info');
                return;
            }
            _cache = _data.cache;
            _thCache=_cache.th;
            //验证：缓存数据与当前列表是否匹配
            if(!_thCache || _thCache.length != $('thead th', table).length){
                _this.cleanTableCache(table, '缓存数据与当前列表不匹配');
                return;
            }
            //验证：缓存数据与当前列表项是否匹配
            var _thNameTmpList = [],
                _dataAvailable = true;
            $.each(_thCache, function(i2, v2){
                _thJson = v2;
                _th = $('th[th-name='+ _thJson.th_name +']', table);
                if(_th.length == 0 || _thNameTmpList.indexOf(_thJson.th_name) != -1){
                    _this.cleanTableCache(table, '缓存数据与当前列表不匹配');
                    _dataAvailable = false;
                    return false;
                }
                _thNameTmpList.push(_thJson.th_name);
            });
            //数据可用，进行列的配置
            if(_dataAvailable){
                $.each(_thCache, function(i2, v2){
                    _thJson = v2;
                    _th = $('th[th-name='+ _thJson.th_name +']', table);
                    //配置列的宽度
                    if(_this.supportAdjust){
                        _th.css('width',_thJson.th_width);
                    }
                    //配置列排序数据
                    if(_this.supportDrag && typeof(_thJson.th_index) !== 'undefined'){
                        _domArray[_thJson.th_index] = _th;
                    }else{
                        _domArray[i2] = _th;
                    }
                    //配置列的可见
                    if(_this.supportConfig){
                        _this.setAreVisible(_th, typeof(_thJson.isShow) == 'undefined' ? true : _thJson.isShow, true);
                    }
                });
                //配置列的顺序
                if(_this.supportDrag){
                    table.find('thead tr').html(_domArray);
                }
                //重置调整宽度事件源
                _this.resetAdjust(table);
            }
        }
        /*
         [对外公开方法]
         @重置列表[tbody]
         这个方法对外可以直接调用
         作用：处理局部刷新、分页事件之后的tb排序
         $.table: table [jquery object]
         $.isSingleRow: 指定DOM节点是否为tr[布尔值]
         */
        ,resetTd: function(dom, isSingleRow){
            var _this = this;
            if(isSingleRow){
                var _tr = $(dom),
                    _table= _tr.closest('table');
            }else{
                var _table = $(dom),
                    _tr	= _table.find('tbody tr');
            }
            if(!_tr || _tr.length == 0){
                return false;
            }
            //重置表格序号
            if(_this.supportAutoOrder){
                var _pageData = _this.pageData;
                var onlyOrderTd = undefined,
                    _orderBaseNumber = 1,
                    _orderText;
                //验证是否存在分页数据
                if(_pageData && _pageData['pSize'] && _pageData['cPage']){
                    _orderBaseNumber = _pageData.pSize * (_pageData.cPage - 1) + 1;
                }
                $.each(_tr, function(i, v){
                    _orderText = _orderBaseNumber + i;
                    onlyOrderTd = $('td[gm-order="true"]', v)
                    if(onlyOrderTd.length == 0){
                        $(v).prepend('<td gm-order="true" gm-create="true">'+ _orderText +'</td>');
                    }else{
                        onlyOrderTd.text(_orderText);
                    }
                });
            }
            //重置表格选择 checkbox
            if(_this.supportCheckbox){
                var onlyCheckTd = undefined;
                $.each(_tr, function(i, v){
                    onlyCheckTd = $('td[gm-checkbox="true"]', v);
                    if(onlyCheckTd.length == 0){
                        $(v).prepend('<td gm-checkbox="true" gm-create="true"><input type="checkbox"/></td>');
                    }else{
                        $('[type="checkbox"]', onlyCheckTd).prop('checked', false);
                    }
                });
            }
            //依据顺序存储重置td顺序
            if(_this.supportAdjust){
                var _thList = _this.getOriginalThDOM(_table),
                    _td;
                if(!_thList || _thList.length == 0 ){
                    _this.outLog('resetTdForCache:列位置重置所必须的原TH DOM获取失败', 'error');
                    return false;
                }
                var _tmpHtml = [],
                    _tdArray = [];
                //		console.log(_thList.eq(4).index())
                $.each(_tr, function(i, v){
                    _tmpHtml[i] = $(v);
                    _td = $(v).find('td');
                    $.each(_td, function(i2, v2){
                        //	console.log(_thList.eq($(v2).index()).index())
                        //		console.log(_thList.index(_thList.eq($(v2).index())))
                        //		console.log('-------------------')
                        //baukh20160703:#注：这块被简化了，可能存在问题，需要验证
                        _tdArray[_thList.eq(i2).index()] = v2;
                    });
                    _tmpHtml[i].html(_tdArray);
                });
            }
            //依据配置对列表进行隐藏、显示
            if(_this.supportConfig){
                _this.setAreVisible($('[th-visible="none"]'), false ,true);
            }
            //重置吸顶事件
            if(_this.supportSetTop){
                var _tableDIV 	= _table.closest('.table-div');
                var _tableWarp 	= _tableDIV.closest('.table-warp');
                _tableDIV.css({
                    height:'auto'
                });
                _tableWarp.css({
                    marginBottom: 0
                });
            }
        }
        /*
         @依据版本清除列表缓存
         $.table: table [jquery object]
         依据版本号判断 如果版本不符 则对缓存进行清理
         */
        ,cleanTableCacheForVersion: function(table){
            var _this = this;
            var locationVersion = window.localStorage.getItem('GridManagerVersion');
            //版本相符 直接跳出
            if(locationVersion && locationVersion == _this.version){
                return;
            }
            _this.cleanTableCache(table, '插件版本已更新');
        }
        /*
         @清除列表缓存
         $.table: table [jquery object]
         $.cleanText: 清除缓存的原因
         */
        ,cleanTableCache: function(table, cleanText){
            var _this = this;
            $.each(table, function(i, v){
                window.localStorage.removeItem(v.getAttribute('grid-manager'));
                window.localStorage.removeItem(v.getAttribute('grid-manager') + '-' + $('th', v).length);
                _this.outLog(v.getAttribute('grid-manager') + '清除缓存成功,原因：'+ cleanText, 'info');
            });
            window.localStorage.setItem('GridManagerVersion', _this.version);
        }
        /*
         [对外公开方法]
         @配置query 该参数会在分页触发后返回至pagingAfter(query)方法
         $.table: table [jquery object]
         $.query:配置的数据
         */
        ,setQuery: function(table, query){
            var _this = this;
            table.GridManager('get')['query'] = query;
        }
        /*
         @输出日志
         $.type: 输出分类[info,warn,error]
         */
        ,outLog: function(msg, type){
            if(!this.isDevelopMode && !type){
                return console.log('GridManager:', msg);
            }
            else if(!this.isDevelopMode && type === 'info'){
                return console.info('GridManager Info: ', msg);
            }
            else if(!this.isDevelopMode && type === 'warn'){
                return console.warn('GridManager Warn: ', msg);
            }
            else if(type === 'error'){
                return console.error('GridManager Error: ', msg);
            }
        }
    };
    return baseGM;
});