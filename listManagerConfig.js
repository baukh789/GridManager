// listManager config file
var listManagerConfig = {	
	isDevelopMode   : true		//是否为开发模式，为true时将打印事件日志
	,basePath		: ''		//当前基本路径[用于加载资源文件]
	,useDefaultStyle: true		//是否使用默认的table样式
	,animateTime	:300		//动画效果延时
	,minNum:40					//宽度所允许的最小值
	,supportSorting	: true		//是否支持排序
	,isCombSorting	: false		//是否为组合排序[只有在支持排序的情况下生效]
	,disableCache	: false		//是否禁用本地缓存
	,supportRemind	: true		//是否支持提示信息
	,supportAdjust	: true		//是否支持宽度调整
	,supportDrag	: true 		//是否支持拖拽换位 
	,supportConfig	: true 		//是否支持配置列表功能[操作列是否可见]
	,supportSetTop	: true		//是否支持表头置顶
	,isRealTime		: true		//列表内是否存在实时刷新[平时尽量不要设置为true，以免消耗资源]
	,sortingCallback:{			//排序触发后的回调函数集合，该函数一般需指向搜索事件
	}
	,supportAjaxPage: false		//是否支持配置列表ajxa分页[多列表两种状态都有时，统一配置为true,禁用的列表pageJson参数为空即可]	
	,pageJson: {				//分页数据
	}
	,pageCallback:{				//分页触发后的回调函数集合，该函数一般需指向搜索事件
	}
}