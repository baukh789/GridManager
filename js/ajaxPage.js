/*
	author:baukh
	@ajaxPage: listManager.js的附带分页功能
*/
var ajaxPage = {
	isDevelopMode : undefined
	/*
		@初始化方法
	*/
	,initAjaxPage: function(arg){
		var _this = this;
		_this.isDevelopMode = arg.isDevelopMode;
		if(arg.pageData.tSize == 0){
			_this.outLog('当前数据为空，停止初始化');
			pageToolbar.hide();
			return false;
		}	
		//生成分页DOM节点
		_this.createPageDOM( arg.tableDOM, arg.pageData );
		//生成每页显示条数选择框
		_this.createPageSizeDOM( arg.tableDOM, arg.sizeData );	
		//绑定点击事件
		_this.bindClickEvent( arg.tableDOM, arg.pageData );	
		
		//绑定设置显示条数切换事件
		_this.bindSetPageSizeEvent( arg.tableDOM, arg.pageData );
		
		//重置当前页显示条数
		_this.resetPSize(arg.tableDOM, arg.pageData);
		
		var table 		= $(arg.tableDOM);
			tableWarp 	= table.parents('table-warp').eq(0),
			pageToolbar = $('.page-toolbar', tableWarp);	//分页工具条
		pageToolbar.show();
	}
	/*
		@生成分页DOM节点据
		$._tableDOM_: table的juqery实例化对象
		$._pageData_:分页数据格式
	*/
	,createPageDOM:function( _tableDOM_, _pageData_){
		var _this = this;
		var table 		= $(_tableDOM_);
			tableWarp 	= table.parents('.table-warp').eq(0),
			pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
			pagination	= $('.pagination', pageToolbar);		//分页区域
		var cPage = Number(_pageData_.cPage),		//当前页
			tPage = Number(_pageData_.tPage),		//总页数
			tHtml = '',					//临时存储分页HTML片段
			lHtml = '';					//临时存储末尾页码THML片段
		//配置首页
		if(cPage > 1 && tPage > 1){
			tHtml += '<li cPage="1">'
				  +  '<a href="javascript:void(0);">首页</a>'
				  +  '</li>'
				  +  '<li cPage="'+(cPage-1)+'">'
				  +  '<a href="javascript:void(0);">上一页</a>'
				  +  '</li>';
		}else{
			tHtml += '<li cPage="1" class="disabled">'
				  +  '<a href="javascript:void(0);">首页</a>'
				  +  '</li>'
				  +  '<li cPage="'+(cPage-1)+'" class="disabled">'
				  +  '<a href="javascript:void(0);">上一页</a>'
				  +  '</li>';				
		}
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
				  +  '<a href="javascript:void(0);">'+tPage+'</a>'
				  +  '</li>';
		}
		// 配置页码
		for(i; i<= maxI;i++){
			if(i == cPage){
				tHtml += '<li class="active">'
					  +  '<a href="javascript:void(0);">'+cPage+'</a>'
					  +  '</li>';
				continue;
			}			
			tHtml += '<li cPage="'+i+'">'
				  +  '<a href="javascript:void(0);">'+i+'</a>'
				  +  '</li>';				
		}			
		tHtml += lHtml;
		//配置下一页与尾页
		if(cPage < tPage){
			tHtml += '<li cPage="'+(cPage+1)+'">'
				  +  '<a href="javascript:void(0);">下一页</a>'
				  +  '</li>'
				  +  '<li cPage="'+tPage+'">'
				  +  '<a href="javascript:void(0);">尾页</a>'
				  +  '</li>';
		}else{
			tHtml += '<li cPage="'+(cPage+1)+'" class="disabled">'
				  +  '<a href="javascript:void(0);">下一页</a>'
				  +  '</li>'
				  +  '<li cPage="'+tPage+'" class="disabled">'
				  +  '<a href="javascript:void(0);">尾页</a>'
				  +  '</li>';
		}
		pagination.html(tHtml);
	}
	/*
		@生成每页显示条数选择框据
		$._tableDOM_: table的juqery实例化对象
		$._sizeData_: 选择框自定义条数
	*/
	,createPageSizeDOM: function( _tableDOM_, _sizeData_){
		var _this = this;
		var table		= $(_tableDOM_),
			tableWarp	= table.parents('.table-warp').eq(0),
			pageToolbar = $('.page-toolbar', tableWarp),				//分页工具条
			pSizeArea	= $('select[name="pSizeArea"]', pageToolbar);	//分页区域	
		//error
		if( !_sizeData_ || !$.isArray(_sizeData_) ){
			$.error('参数:[sizeData]配置错误');
		}
		
		var _ajaxPageHtml = '';
		$.each( _sizeData_, function( i, v ){				
			_ajaxPageHtml += '<option value="'+ v +'">' + v + '</option>';
		});
		pSizeArea.html(_ajaxPageHtml);
	}
	/*
		@绑定分页点击事件据
		$._tableDOM_: table的juqery实例化对象
		$._pageData_:分页数据格式
	*/
	,bindClickEvent:function( _tableDOM_, _pageData_){
		var _this = this;		
		var table		= $(_tableDOM_),
			tableWarp	= table.parents('.table-warp').eq(0),
			pageToolbar = $('.page-toolbar', tableWarp),		//分页工具条
			pagination	= $('.pagination', pageToolbar);		//分页区域	
		
		pageToolbar.off('click', 'li');
		pageToolbar.on('click', 'li', function(){
			var _page 		= $(this),
				_tableWarp 	= _page.parents('.table-warp').eq(0),
				_table		= $('table[list-manager]', _tableWarp),
				_listManager= _table.listManager('getListManager'),
				_size 		= $('select[name="pSizeArea"]', _tableWarp);
			
			var cPage = _page.attr('cPage');	//分页页码
			if(!cPage || !Number(cPage) || _page.hasClass('disabled')){
				_this.outLog('指向页无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在');
				return false;
			}			
			//替换被更改的值
			_listManager.pageData.cPage = cPage;
//			_this.createPageDOM(_table, _listManager.pageData);
			_table.data( 'listManager' , _listManager );
			var _pageQuery = {
				cPage : cPage,
				pSize : _size.val()
			};
			//调用回调函数
			_listManager.pageCallback( _pageQuery ,_listManager.pageQuery );
		});
	}
	/*
		@绑定设置当前页显示数事件
		$._tableDOM_: table的juqery实例化对象
		$._pageData_:分页数据格式
	*/
	,bindSetPageSizeEvent:function( _tableDOM_, _pageData_){
		var _this = this;
		var table 		=  $(_tableDOM_),
			tableWarp 	= table.parents('.table-warp').eq(0),
			pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
			sizeArea	= $('select[name=pSizeArea]', pageToolbar);	//切换条数区域	
		if(!sizeArea || sizeArea.length == 0){
			_this.outLog('未找到单页显示数切换区域，停止该事件绑定');
			return false;
		}
		sizeArea.unbind('change');
		sizeArea.change(function(){
			var _size = $(this);
			var _tableWarp  = _size.parents('.table-warp').eq(0),
				_table		= $('table[list-manager]', _tableWarp),
				_listManager= _table.data( 'listManager' ),
				_tName 		= $('table', _tableWarp).attr('list-manager'); //当前与分页同容器下的列表名称
			
			_listManager.pageData.cPage = 1;
			_listManager.pageData.pSize = _size.val();
		//	_this.createPageDOM(_table, _listManager.pageData);
			_table.data( 'listManager', _listManager);
			
			window.localStorage.setItem('pSize_'+ _tName, _listManager.pageData.pSize);
			if(!_listManager.pageCallback || typeof(_listManager.pageCallback) != 'function'){
				_this.outLog('参数pageCallback配置错误');
				return;
			}
			var _pageQuery = {
				pSize : _size.val(),
				cPage : 1,
			};
			//重置当前页显示条数
		//	_this.resetPSize( _table, _listManager.pageData );
			_listManager.pageCallback( _pageQuery, _listManager.pageQuery );
			
		});
	}
	/*
		@重置当前页显示条数据
		$._tableDOM_: table的juqery实例化对象
		$._pageData_:分页数据格式
	*/
	,resetPSize: function( _tableDOM_, _pageData_ ){
		var _this = this;
		
		var table 		=  $(_tableDOM_),
			tableWarp 	= table.parents('.table-warp').eq(0),
			toolBar   = $('.page-toolbar', tableWarp),
			pSizeArea = $('select[name="pSizeArea"]', toolBar),
			pSizeInfo = $('.dataTables_info', toolBar);
		if(!pSizeArea || pSizeArea.length == 0){
			_this.outLog('未找到条数切换区域，停止该事件绑定');
			return false;
		}
		var tmpHtml = '此页显示 '
					+ (_pageData_.cPage == 1 ? 1 : (_pageData_.cPage-1) * _pageData_.pSize + 1)
					+ '-'
					+ _pageData_.cPage * _pageData_.pSize
					+ ' 共'
					+ _pageData_.tSize
					+ '条';
		//根据返回值修正单页条数显示值		
		pSizeArea.val(_pageData_.pSize || 10); 
		//修改单页条数文字信息
		pSizeInfo.html(tmpHtml);	
		pSizeArea.show();
	}
	/*
		[对外公开方法]	
		@重置分页数据
		$._tableDOM_: table的juqery实例化对象
		$._pageData_:分页数据格式
		_pageData_ = {
			tPage: 10,				//总页数
			cPage: 1,				//当前页	
			pSize: 20,				//每页显示条数
			tSize: 100				//总条数
		}
	*/
	,resetPageData: function( _tableDOM_, _pageData_ ){
		var _this = this;
		//生成分页DOM节点
		_this.createPageDOM( _tableDOM_, _pageData_ );
		//重置当前页显示条数
		_this.resetPSize( _tableDOM_, _pageData_);
	}
	/*
		@输出日志
	*/
	,outLog: function(msg){
		if(this.isDevelopMode){
			console.log(msg);
		}
	}
}