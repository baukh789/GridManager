// 分页
export interface PageData {
	tPage: number;
	tSize: number;
	cPage?: number; // 动态取值[currentPageKey]
	pSize?: number; // 动态取值[pageSizeKey]
	// 动态取值
	[key: string]: number;
}

// 排序
export interface SortData {
	// 动态取值
	[key: string]: number | string;
}
// 行数据
export interface Row {
	'gm-cache-key'?: string;
	'gm-level-key'?: number;
	'gm-row-index'?: number;
	gm_checkbox?: boolean;
	gm_checkbox_disabled?: boolean;
	gm_order?: number;
	[key:string]: any;
}
