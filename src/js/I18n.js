/*
 * I18n: 国际化
 * */
import Base from './Base';
import Cache from './Cache';
const I18n = {
	//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
	getLanguage : function($table){
		return Cache.getSettings($table).i18n;
	}
	// 指定[表格 键值 语言]获取对应文本
	,getText: function($table, key, language){
		return Cache.getSettings($table).textConfig[key][language] || '';
	}
	/*
	 * @获取与当前配置国际化匹配的文本
	 *  $table: table [jTool Object]
	 *  key: 指向的文本索引
	 *  v1,v2,v3:可为空，也存在一至3项，只存在一项时可为数组
	 * */
	,i18nText: function($table, key, v1, v2, v3){
		const _this = this;
		let intrusion = [];
		//处理参数，实现多态化
		if(arguments.length == 3 && typeof(arguments[2]) == 'object'){
			intrusion = arguments[2];
		}
		else if(arguments.length > 1){
			for(let i=1; i< arguments.length; i++){
				intrusion.push(arguments[i]);
			}
		}
		let _text = '';
		try{
			_text = _this.getText($table, key, _this.getLanguage($table));
			if(!intrusion || intrusion.length == 0){
				return _text;
			}
			_text = _text.replace(/{\d+}/g, function(word){
				return intrusion[word.match(/\d+/)];
			});
			return _text;
		}catch (e){
			Base.outLog('未找到与'+ key +'相匹配的'+ _this.getLanguage($table) +'语言', 'warn');
			return '';
		}
	}
};
export default I18n;
