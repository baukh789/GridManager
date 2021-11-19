// 过滤: 与arg的格式相同
export interface FilterObject{
	option: Array<{
		value: string;
		text: string;
	}>;
	selected: string;
	isMultiple: boolean
}
// 表格实列 列
export interface Column {
	key?: string;
	text?(): any;
	index?: number;
	width?: number;
	__width?: number | undefined;
	isShow?: boolean;
	pk?: string;
	children?: Array<Column>;
	template?(cell: object, row: object, rowIndex: number, key: string | boolean): any; // 自动生成列没有key, 只有isTop
	isAutoCreate?: boolean;
	align?: string;
	fixed?: string;
	merge?: string;
	filter?: FilterObject;
	disableMoveRow?: boolean;
	level?: number;
	rowspan?: number;
	colspan?: number;
	remind?: string | object;
	sorting?: string;
	disableRowCheck?: boolean;
	pl?: number; // 仅在fixed中使用
	pr?: number; // 仅在fixed中使用
}

// 表格实例 列集
export interface ColumnMap {
	[index:string]: Column
}

export interface SettingObj {
	_?: string;
	gridManagerName: string;
	columnMap: ColumnMap;
	columnData: Array<Column>;
	[index:string]: any;
}
