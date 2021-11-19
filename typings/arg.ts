// 渲染参数 列
export interface ArgColumn {
	key: string;
	text?: any; // string | function
	index?: number;
	width?: number | string;
	isShow?: boolean;
	children?: Array<ArgColumn>;
	template?(cell: object, row: object, rowIndex: number, key: string | boolean): any; // 自动生成列没有key, 只有isTop
	align?: string;
	fixed?: string;
	merge?: string;
	filter?: {
		option: Array<{
			value: string;
			text: string;
		}>;
		selected: string;
		isMultiple: boolean
	};
	disableMoveRow?: boolean;
	remind?: string | object;
	sorting?: string;
}

export interface ArgObj{
	gridManagerName: string;
	columnData: Array<string | ArgColumn>;
	[index:string]: any;
}
