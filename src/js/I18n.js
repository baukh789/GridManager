/*
 * I18n: 国际化
 * */
var I18n = {
	//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
	i18n : 'zh-cn'
	/*
	 * @获取与当前配置国际化匹配的文本
	 *  $.key: 指向的文本索引
	 *  v1,v2,v3:可为空，也存在一至3项，只存在一项时可为数组
	 * */
	,i18nText: function(key, v1, v2, v3){
		var _this = this;
		var intrusion = [];
		//处理参数，实现多态化
		if(arguments.length == 2 && typeof(arguments[1]) == 'object'){
			intrusion = arguments[1];
		}
		else if(arguments.length > 1){
			for(var i=1; i< arguments.length; i++){
				intrusion.push(arguments[i]);
			}
		}
		var _lg = '';
		try{
			_lg = _this.textConfig[key][_this.i18n] || '';
			if(!intrusion || intrusion.length == 0){
				return _lg;
			}
			_lg = _lg.replace(/{\d+}/g, function(word){
				return intrusion[word.match(/\d+/)];
			});
			return _lg;
		}catch (e){
			_this.outLog('未找到与'+ key +'相匹配的'+ _this.i18n +'语言', 'warn');
			return '';
		}
	}
	/*
	 * 	@插件存在文本配置
	 * */
	,textConfig: {
		'order-text': {
			'zh-cn':'序号',
			'en-us':'order'
		}
		,'first-page': {
			'zh-cn':'首页',
			'en-us':'first'
		}
		,'previous-page': {
			'zh-cn':'上一页',
			'en-us':'previous'
		}
		,'next-page': {
			'zh-cn':'下一页',
			'en-us':'next '
		}
		,'last-page': {
			'zh-cn':'尾页',
			'en-us':'last '
		}
		,'dataTablesInfo':{
			'zh-cn':'此页显示 {0}-{1} 共{2}条',
			'en-us':'this page show {0}-{1} count {2}'
		}
		,'goto-first-text':{
			'zh-cn':'跳转至',
			'en-us':'goto '
		}
		,'goto-last-text':{
			'zh-cn':'页',
			'en-us':'page '
		}
		,'refresh':{
			'zh-cn':'重新加载',
			'en-us':'Refresh '
		}
		,'save-as-excel':{
			'zh-cn':'另存为Excel',
			'en-us':'Save as Excel '
		}
		,'save-as-excel-for-checked':{
			'zh-cn':'已选中项另存为Excel',
			'en-us':'Save as Excel of Checked'
		}
		,'setting-grid':{
			'zh-cn':'配置表',
			'en-us':'Setting Grid'
		}
		,'checkall-text':{
			'zh-cn':'全选',
			'en-us':'All'
		}

	}
};
module.exports = I18n;
