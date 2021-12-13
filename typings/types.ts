import { ArgColumn, ArgObj } from './arg';
import { Column, ColumnMap, SettingObj, FilterObject } from './settings';
import { Row, PageData, SortData } from './data';

export { ArgColumn, ArgObj, Column, ColumnMap, SettingObj, Row, PageData, SortData, FilterObject };

// 生成过程中的tr对像存储器
export interface TrObject {
	className: Array<string>;
	attribute: Array<Array<string>>;
	querySelector: string;
	cacheKey?: string;
	tdList: Array<string>;
}

// 配置区域模板参数
export interface ConfigHtmlParams {
	_: string;
	configInfo: object;
}

// 列模板参数
export interface ColHtmlParams {
	key: string;
	isShow: boolean;
	label: string;
}

// 移动行配置
export interface MoveRowConfig {
	key: string;
	useSingleMode: boolean;
	fixed?: string;
	handler?(list: Array<object>, tableData: Array<object>): void;
}

// jtool对象
export interface JTool {
	jTool: boolean;
	[index:string]: any;
}

// 事件存储器(单个事件)
export interface EventObj {
	events: string;
	target: string;
	selector: string;
}
// 事件存储器(事件集)
export interface EventMap {
	[index:string]: EventObj
}

// td模板函数
export interface TdTemplate {
	(col: Column, row: Row, index: number, key: string): string;
}

// th模板函数
export interface ThTemplate {
	(): string;
}

// 通栏模板函数
export interface FullColumnTemplate {
	(row: Row, index: number): string;
}

// 为空模板函数
export interface EmptyTemplate {
	(settings: SettingObj): string;
}

// diff data
export interface DiffData {
	diffList: Array<Row>;
	diffFirst: Row;
	diffLast: Row;
}
