import jTool from '@jTool';
import { getTableData } from '@common/cache';
import {
	getAllTh,
	getColTd,
	getDiv,
	getEmpty,
	getTbody, getTh, getThead,
	getVisibleTh,
	setAreVisible,
	updateVisibleLast
} from '@common/base';
import {
	DISABLE_CUSTOMIZE,
	EMPTY_DATA_CLASS_NAME,
	EMPTY_TPL_KEY, ODD,
	PX,
	ROW_CLASS_NAME, TH_NAME,
	TR_CACHE_KEY,
	TR_CHILDREN_STATE, TR_LEVEL_KEY,
	TR_PARENT_KEY
} from '@common/constants';
import { each, isElement, isObject, isString, isUndefined, isValidArray } from '@jTool/utils';
import { compileEmptyTemplate, compileTd, sendCompile } from '@common/framework';
import { outError } from '@common/utils';
import moveRow from '@module/moveRow';
import checkbox from '@module/checkbox';
import fullColumn from '@module/fullColumn';
import tree from '@module/tree';
import { installSummary } from '@module/summary';
import { mergeRow } from '@module/merge';
import fixed from '@module/fixed';
import remind from '@module/remind';
import sort from '@module/sort';
import filter from '@module/filter';
import adjust from '@module/adjust';
import template from './template';
import { SettingObj, Column, TrObject, Row } from 'typings/types';

/**
 * 重绘thead
 * @param settings
 */
export const renderThead = (settings: SettingObj): void => {
	const { _, columnMap, sortUpText, sortDownText, supportAdjust } = settings;
	const $thead = getThead(_);
	$thead.html(template.getTheadTpl({ settings }));
	// 单个table下的TH
	const $thList = getAllTh(_);

	// 由于部分操作需要在th已经存在于dom的情况下执行, 所以存在以下循环
	// 单个TH下的上层DIV
	each($thList, (item: HTMLTableElement) => {
		const onlyTH = jTool(item);
		const onlyThWarp = jTool('.th-wrap', onlyTH);
		const thName = onlyTH.attr(TH_NAME);
		const column = columnMap[thName];

		// 是否为GM自动添加的列
		const isAutoCol = column.isAutoCreate;

		// 嵌入表头提醒事件源
		if (!isAutoCol && column.remind) {
			onlyThWarp.append(jTool(remind.createHtml({ remind: column.remind })));
		}

		// 嵌入排序事件源
		if (!isAutoCol && isString(column.sorting)) {
			const sortingDom = jTool(sort.createHtml());

			// 依据 column.sorting 进行初始显示
			switch (column.sorting) {
				case sortUpText:
					sortingDom.addClass('sorting-up');
					break;
				case sortDownText:
					sortingDom.addClass('sorting-down');
					break;
			}
			onlyThWarp.append(sortingDom);
		}

		// 嵌入表头的筛选事件源
		// 插件自动生成的序号列与选择列不做事件绑定
		if (!isAutoCol && column.filter && isObject(column.filter)) {
			const filterDom = jTool(filter.createHtml({settings, columnFilter: column.filter}));
			onlyThWarp.append(filterDom);
		}

		// 嵌入宽度调整事件源,以下情况除外
		// 1.插件自动生成的选择列和序号列不做事件绑定
		// 2.禁止使用个性配置功能的列
		if (supportAdjust && !isAutoCol && !column[DISABLE_CUSTOMIZE]) {
			onlyThWarp.append(jTool(adjust.html));
		}
	});
};
/**
 * 渲染为空DOM
 * @param settings
 * @param isInit
 */
export const renderEmptyTbody = (settings: SettingObj, isInit?: boolean): void => {
	const { _, emptyTemplate } = settings;
	// 当前为第一次加载 且 已经执行过setQuery 时，不再插入空数据模板
	// 用于解决容器为不可见时，触发了setQuery的情况
	if (isInit && getTableData(_).length !== 0) {
		return;
	}

	const $tableDiv = getDiv(_);
	$tableDiv.addClass(EMPTY_DATA_CLASS_NAME);
	getTbody(_).html(`<tr ${EMPTY_TPL_KEY}="${_}" style="height: ${$tableDiv.height() - 1 + PX}"><td colspan="${getVisibleTh(_).length}"></td></tr>`);
	const emptyTd = getEmpty(_).get(0).querySelector('td');

	emptyTd.innerHTML = compileEmptyTemplate(settings, emptyTd, emptyTemplate);

	// 解析框架: 空模板
	sendCompile(settings);
};

/**
 * render tr
 * @param settings
 * @param diffTableList
 */
export const renderTr = (settings: SettingObj, diffTableList: Array<Row>): void => {
	const { _, columnMap, supportTreeData, treeConfig } = settings;
	const { treeKey } = treeConfig;
	const render = (list: Array<Row>) => {
		list.forEach(row => {
			if (!row) {
				return;
			}
			const cacheKey = row[TR_CACHE_KEY];
			const level = row[TR_LEVEL_KEY];
			let index = parseInt(cacheKey.split('-').pop(), 10);

			const trNode = getTbody(_).find(`[${TR_CACHE_KEY}="${cacheKey}"]`).get(0);

			if (!trNode) {
				return;
			}

			// 添加tree map
			if (supportTreeData) {
				const children = row[treeKey];
				const hasChildren = children && children.length;
				tree.add(_, cacheKey, level, hasChildren);
				hasChildren && render(children);
			}

			each(columnMap, (key: string, col: Column) => {
				let tdTemplate = col.template;
				const tdNode = getColTd(getTh(_, key), trNode).get(0);
				// 自动添加列
				if (col.isAutoCreate) {
					tdNode.innerHTML = tdTemplate(row[col.key], row, index, level === 0);
					return;
				}

				// 不直接操作tdNode的原因: react不允许直接操作已经关联过框架的DOM
				const tdCloneNode = tdNode.cloneNode(true);

				let { text, compileAttr } = compileTd(settings, tdTemplate, row, index, key);
				text = isElement(text) ? text.outerHTML : text;
				if (compileAttr) {
					tdCloneNode.setAttribute(compileAttr.split('=')[0], compileAttr.split('=')[1]);
				}
				tdCloneNode.innerHTML = text;
				trNode.replaceChild(tdCloneNode, tdNode);
			});
		});
	};
	render(diffTableList);

	// 解析框架
	sendCompile(settings).then(() => {
		// 插入tree dom
		supportTreeData && tree.insertDOM(_, treeConfig);

		// 合并单元格
		mergeRow(_, columnMap);
	});
};

/**
 * 重新组装table body: 这个方法最大的性能问题在于tbody过大时，首次获取tbody或其父容器时过慢
 * @param settings
 * @param data
 */
export const renderTbody = async (settings: SettingObj, data: Array<Row>): Promise<any> => {
	const {
		_,
		columnMap,
		supportTreeData,
		supportCheckbox,
		supportMoveRow,
		treeConfig,
		__isNested,
		__isFullColumn
	} = settings;

	const { treeKey, openState } = treeConfig;
	//
	// data = formatTableData(_, data);
	//
	// // 存储表格数据
	// setTableData(_, data);
	// setCheckedData(_, data);

	// tbody dom
	const $tbody = getTbody(_);
	const tbody = $tbody.get(0);

	// 清空 tbody
	tbody.innerHTML = '';

	// 存储tr对像列表
	let trObjectList: Array<TrObject> = [];

	// 通过index对columnMap进行排序
	const topList: Array<Column> = [];
	const columnList: Array<Column> = [];
	each(columnMap, (key: string, col: Column) => {
		if (!col.pk) {
			topList[col.index] = col;
		}
	});

	const pushList = (list: Array<Column>) => {
		each(list, (col: Column) => {
			if (!isValidArray(col.children)) {
				columnList.push(col);
				return;
			}
			pushList(col.children);
		});
	};
	pushList(topList);

	// 插入常规的TR
	const installNormal = (trObject: TrObject, row: Row, rowIndex: number, isTop: boolean): void => {
		// 与当前位置信息匹配的td列表

		const tdList = trObject.tdList;
		each(columnList, (col: Column) => {
			const tdTemplate = col.template;
			if (col.isAutoCreate) {
				tdList.push(tdTemplate(row[col.key], row, rowIndex, isTop));
				return;
			}

			let { text, compileAttr } = compileTd(settings, tdTemplate, row, rowIndex, col.key);
			const alignAttr = col.align ? `align=${col.align}` : '';
			const moveRowAttr = supportMoveRow ? moveRow.addSign(col) : '';
			const useRowCheckAttr = supportCheckbox ? checkbox.addSign(col) : '';
			const fixedAttr = col.fixed ? `fixed=${col.fixed}` : '';
			text = isElement(text) ? text.outerHTML : text;
			tdList.push(`<td ${compileAttr} ${alignAttr} ${moveRowAttr} ${useRowCheckAttr} ${fixedAttr}>${text}</td>`);
		});
	};

	try {
		const installTr = (list: Array<Row>, level: number, pIndex?: string): void => {
			const isTop = isUndefined(pIndex);
			each(list, (row: Row, index: number) => {
				const className = [];
				const attribute = [];
				const tdList: Array<string> = [];
				const cacheKey = row[TR_CACHE_KEY];

				// 增加行 class name
				if (row[ROW_CLASS_NAME]) {
					className.push(row[ROW_CLASS_NAME]);
				}

				// 非顶层
				if (!isTop) {
					attribute.push(`${TR_PARENT_KEY}="${pIndex}"`);
					attribute.push(`${TR_CHILDREN_STATE}="${openState}"`);
				}

				// 顶层 且当前为树形结构
				if (isTop && supportTreeData) {
					// 不直接使用css odd是由于存在层级数据时无法排除折叠元素
					index % 2 === 0 && attribute.push(ODD);
				}

				attribute.push(`${TR_CACHE_KEY}="${cacheKey}"`);

				const trObject: TrObject = {
					className,
					attribute,
					tdList
				};

				// 顶层结构: 通栏-top
				if (isTop && __isFullColumn) {
					fullColumn.addTop(settings, row, index, trObjectList);
				}

				// 插入正常的TR
				installNormal(trObject, row, index, isTop);

				trObjectList.push(trObject);

				// 顶层结构: 通栏-bottom
				if (isTop && __isFullColumn) {
					fullColumn.addBottom(settings, row, index, trObjectList);
				}

				// 处理层级结构
				if (supportTreeData) {
					const children = row[treeKey];
					const hasChildren = children && children.length;

					// 添加tree map
					tree.add(_, cacheKey, level, hasChildren);

					// 递归处理层极结构
					if (hasChildren) {
						installTr(children, level + 1, cacheKey);
					}
				}
			});
		};

		installTr(data, 0);

		// 插入汇总行
		installSummary(settings, columnList, data, trObjectList);

		let tbodyStr = '';
		trObjectList.forEach(item => {
			const { className, attribute, tdList } = item;
			let classStr = '';
			if (className.length) {
				classStr = `class="${className.join(' ')}"`;
			}

			const attrStr = attribute.join(' ');
			const tdStr = tdList.join('');
			tbodyStr = `${tbodyStr}<tr ${classStr} ${attrStr}>${tdStr}</tr>`;
		});
		tbody.innerHTML = tbodyStr;
	} catch (e) {
		outError('render tbody error');
		console.error(e);
	}

	// 非多层嵌套初始化显示状态: 多层嵌套不支持显示、隐藏操作
	if (!__isNested) {
		each(columnMap, (key: string, col: Column) => {
			setAreVisible(_, key, col.isShow);
		});
	}
	// !__isNested && this.initVisible(_, columnMap);

	// 解析框架
	await sendCompile(settings);

	// 插入tree dom
	supportTreeData && tree.insertDOM(_, treeConfig);

	// 合并单元格
	mergeRow(_, columnMap);

	fixed.update(_);

	// 增加tbody是否填充满标识
	if ($tbody.height() >= getDiv(_).height()) {
		$tbody.attr('filled', '');
	} else {
		$tbody.removeAttr('filled');
	}

	// 为最后一列的th, td增加标识: 嵌套表头不处理
	if (!settings.__isNested) {
		updateVisibleLast(_);
	}
};
