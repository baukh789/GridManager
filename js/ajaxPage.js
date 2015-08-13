/*
	@@baukh20140813:分页功能开发
*/

var ajaxPage = {	
	/*
		@初始化方法
	*/
	init: function(settings){
		this.pageJson 		= {}; 		//分页所需JSON数据
		this.query 			= {}; 		//其它需要带入的参数，该参数会在分页触发后返回至searchAction方法
		this.tableWarp 		= {}; 		//分页所在的列表容器
		this.pageCallback	= {}; 		//分页触发后的回调函数，该函数一般需指向搜索事件
		this.isDevelopMode 	= false; 	//是否为开发模式，为true时将打印事件日志
		this.disableCache	= false;	//就否禁用缓存每页展示条数
		$.extend(this, settings);
		var pageToolbar = $('.page-toolbar', this.tableWarp),	//分页工具条
			pagination	= $('.pagination', pageToolbar);		//分页区域	
		if(pageToolbar.length == 0 || !this.pageJson || this.pageJson.length == 0){
			this.outLog('分页初始化缺失必要参数，初始化失败');
			pagination.html('');
			return false;
		}
		if(this.pageJson.tSize == 0){
			this.outLog('当前数据为空，停止初始化');
			pageToolbar.hide();
			return false;
		}	
		//生成分页DOM节点
		this.createPageDOM();
			
		//绑定点击事件
		this.bindClickEvent();	
		
		//绑定设置显示条数切换事件
		this.bindSetPageSizeEvent(pageToolbar);
		
		//重置当前页显示条数
		this.resetPSize(pageToolbar);
		
		pageToolbar.show();
	}
	/*
		@生成分页DOM节点
	*/
	,createPageDOM:function(){
		var _this = this;
		var pageToolbar = $('.page-toolbar', _this.tableWarp),	//分页工具条
			pagination	= $('.pagination', pageToolbar),		//分页区域	
			tName 		= $('table', _this.tableWarp).attr('list-manager'); //当前与分页同容器下的列表名称
		var cPage = Number(_this.pageJson[tName].cPage),		//当前页
			tPage = Number(_this.pageJson[tName].tPage),		//总页数
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
		@绑定分页点击事件
	*/
	,bindClickEvent:function(pagination){
		var _this = this;		
		var pageToolbar = $('.page-toolbar', _this.tableWarp),	//分页工具条
			pagination	= $('.pagination', pageToolbar),		//分页区域	
			tName 		= $('table', _this.tableWarp).attr('list-manager'); //当前与分页同容器下的列表名称
		pageToolbar.off('click', 'li');
		pageToolbar.on('click', 'li', function(){
			var _page = $(this);
			var cPage = _page.attr('cPage');	//分页页码
			if(!cPage || !Number(cPage) || _page.hasClass('disabled')){
				_this.outLog('指向页无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在');
				return false;
			}			
			//替换被更改的值
			_this.query.cPage = cPage;
			_this.pageJson[tName].cPage = cPage;
			_this.createPageDOM();
			//调用回调函数
			_this.pageCallback[tName](_this.query);
		});
	}
	/*
		@绑定设置单页显示数切换事件
	*/
	,bindSetPageSizeEvent:function(toolBar){
		var _this = this;
		var pageToolbar = $('.page-toolbar', _this.tableWarp),	//分页工具条
			sizeArea	= $('select[name=pSizeArea]', pageToolbar),	//切换条数区域	
			tName 		= $('table', _this.tableWarp).attr('list-manager'); //当前与分页同容器下的列表名称
		if(!sizeArea || sizeArea.length == 0){
			_this.outLog('未找到单页显示数切换区域，停止该事件绑定');
			return false;
		}
		sizeArea.unbind('change');
		sizeArea.change(function(){
			var _psa = $(this);
			_this.query.pSize = _psa.val();
			window.localStorage.setItem('pSize_'+ tName, _this.query.pSize);				
			_this.query.cPage = 1;
			_this.pageCallback[tName](_this.query);
		});
	}
	//重置当前页显示条数
	,resetPSize: function(toolBar){
		var _this = this;
		var pSizeArea = $('select[name="pSizeArea"]', toolBar),
			pSizeInfo = $('.dataTables_info', toolBar),
			tName 	  = $('table', _this.tableWarp).attr('list-manager'); //当前与分页同容器下的列表名称
		if(!pSizeArea || pSizeArea.length == 0){
			_this.outLog('未找到条数切换区域，停止该事件绑定');
			return false;
		}
		var tmpHtml = '此页显示 '
					+ (_this.pageJson[tName].cPage == 1 ? 1 : (_this.pageJson[tName].cPage-1) * _this.pageJson[tName].pSize + 1)
					+ '-'
					+ _this.pageJson[tName].cPage * _this.pageJson[tName].pSize
					+ ' 共'
					+ _this.pageJson[tName].tSize
					+ '条';
		//根据返回值修正单页条数显示值		
		pSizeArea.val(_this.pageJson[tName].pSize || 10); 
		//修改单页条数文字信息
		pSizeInfo.html(tmpHtml);	
		pSizeArea.show();
	}
	/*
		@重置分页数据
		$.pageJsonObj:分页数据格式:{list-manager:json}
	*/
	,resetPageJson: function(pageJsonObj){
		var _this = this;
		
		var pageToolbar = $('.page-toolbar', this.tableWarp),	//分页工具条
			pagination	= $('.pagination', pageToolbar);		//分页区域	
		$.extend(_this.pageJson, pageJsonObj);
		
		//生成分页DOM节点
		this.createPageDOM();
		
		//重置当前页显示条数
		this.resetPSize(pageToolbar);
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