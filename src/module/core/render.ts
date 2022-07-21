import { getRowData, getTableData } from '@common/cache';
import {
	getDiv,
	getEmpty, getFakeThead,
	getTbody,
	getThead,
	getVisibleTh,
	setAreVisible,
	updateVisibleLast
} from '@common/base';
import {
	EMPTY_DATA_CLASS_NAME,
	EMPTY_TPL_KEY,
	ODD,
	PX,
	ROW_CLASS_NAME,
	TR_CACHE_KEY,
	TR_CHILDREN_STATE,
	TR_PARENT_KEY,
	TR_ROW_KEY,
	ROW_INDEX_KEY
} from '@common/constants';
import {each, isElement, isNumber, isUndefined, isValidArray} from '@jTool/utils';
import {compileEmptyTemplate, compileFakeThead, compileTd, sendCompile} from '@common/framework';
import { outError } from '@common/utils';
import moveRow from '@module/moveRow';
import checkbox from '@module/checkbox';
import fullColumn, { getFullColumnTr, getFullColumnInterval } from '@module/fullColumn';
import tree from '@module/tree';
import { treeElementKey } from '@module/tree/tool';
import { installSummary } from '@module/summary';
import { mergeRow } from '@module/merge';
import fixed from '@module/fixed';
import template from './template';
import nested from '@module/nested';
import { SettingObj, Column, TrObject, Row } from 'typings/types';

/**
 * 重绘thead
 * @param settings
 */
export const renderThead = async (settings: SettingObj): Promise<void> => {
	const { _, columnMap, __isNested } = settings;

	const columnList: Array<Array<Column>> = [[]];
	const topList = columnList[0];

	// 多层嵌套，进行递归处理
	if (__isNested) {
		nested.push(columnMap, columnList);
	} else {
		each(columnMap, (key: string, col: Column) => {
			topList[col.index] = col;
		});
	}

	let thListTpl = '';
	// columnList 生成thead
	each(columnList, (list: Array<Column>) => {
		thListTpl += '<tr>';
		each(list, (col: Column) => {
			thListTpl += template.getThTpl({settings, col});
		});
		thListTpl += '</tr>';
	});
	getThead(_).html(thListTpl);
	getFakeThead(_).html(thListTpl);

	compileFakeThead(settings, getFakeThead(_).get(0));

	// 解析框架: thead区域
	await sendCompile(settings);
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
	if (isInit && getTableData(_, true).length !== 0) {
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
 * 重新组装table body: 这个方法最大的性能问题在于tbody过大时，首次获取tbody或其父容器时过慢
 * @param settings
 * @param bodyList
 * @param isVirtualScroll: 当前是否为虚拟滚动
 * @param firstTrCacheKey
 * @param lastTrCacheKey
 */
export const renderTbody = async (settings: SettingObj, bodyList: Array<Row>, isVirtualScroll: boolean, firstTrCacheKey: string, lastTrCacheKey: string): Promise<any> => {
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

	// tbody dom
	const $tbody = getTbody(_);
	const tbody = $tbody.get(0);

	// 清除数据为空时的dom
	const $emptyTr = $tbody.find(`[${EMPTY_TPL_KEY}="${_}"]`);
	if ($emptyTr.length) {
		$emptyTr.remove();
	}

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
					attribute.push([TR_PARENT_KEY, pIndex]);
					// 处理展开状态: 当前存在tr使用tr当前的状态，如不存在使用tree config中的配置项
					const _tr = tbody.querySelector(`[${TR_CACHE_KEY}="${cacheKey}"]`);
					let _openState = openState;
					if (_tr) {
						_openState = _tr.getAttribute(TR_CHILDREN_STATE) === 'true';
					}
					attribute.push([TR_CHILDREN_STATE, _openState]);
				}

				// 顶层 且当前为树形结构
				if (isTop && supportTreeData) {
					// 不直接使用css odd是由于存在层级数据时无法排除折叠元素
					index % 2 === 0 && attribute.push([ODD, '']);
				}

				attribute.push([TR_CACHE_KEY, cacheKey]);

				const trObject: TrObject = {
					className,
					attribute,
					row,
					querySelector: `[${TR_CACHE_KEY}="${cacheKey}"]`,
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

					// 当前为更新时，保留原状态
					let state;
					const $treeElement = $tbody.find(`${trObject.querySelector} [${treeElementKey}]`);
					if ($treeElement.length) {
						state = $treeElement.attr(treeElementKey) === 'true';
					}

					// 添加tree map
					tree.add(_, cacheKey, level, hasChildren, state);

					// 递归处理层极结构
					if (hasChildren) {
						installTr(children, level + 1, cacheKey);
					}
				}
			});
		};

		installTr(bodyList, 0);

		// 插入汇总行: 验证在函数内
		installSummary(settings, columnList, trObjectList);

		const prependFragment = document.createDocumentFragment();

		const df = document.createDocumentFragment();
		const $tr = $tbody.find('tr');
		each($tr, (item: HTMLTableRowElement) => {
			df.appendChild(item);
		});
		tbody.innerHTML = '';

		// 清除与数据不匹配的tr
		if (df.children.length) {
			let firstLineIndex: number;
			let lastLineIndex: number;

			// 处理开始行: 需要验证上通栏行
			let firstTr = getFullColumnTr(df, 'top', firstTrCacheKey);
			if (!firstTr) {
				firstTr = df.querySelector(`[${TR_CACHE_KEY}="${firstTrCacheKey}"]`);
			}
			if (firstTr) {
				firstLineIndex = [].indexOf.call(df.children, firstTr);
			}

			// 处理结束行: 需要验证分割行
			let lastTr = getFullColumnInterval(df, lastTrCacheKey);
			if (!lastTr) {
				lastTr = df.querySelector(`[${TR_CACHE_KEY}="${lastTrCacheKey}"]`);
			}
			if (lastTr) {
				lastLineIndex = [].indexOf.call(df.children, lastTr);
			}

			const list: Array<HTMLTableRowElement> = [];
			each(df.children, (item: HTMLTableRowElement, index: number) => {
				// DOM中不存在开始行与结束行的tr: 清空所有tr
				if (!isNumber(firstLineIndex) && !isNumber(lastLineIndex)) {
					list.push(item);
					return;
				}

				// DOM中存在开始行的tr: 清空小于开始的tr
				if (isNumber(firstLineIndex) && index < firstLineIndex) {
					list.push(item);
				}

				// DOM中存在结束行的tr: 清空大于结束行的tr
				if (isNumber(lastLineIndex) && index > lastLineIndex) {
					list.push(item);
				}
			});
			each(list, (item: HTMLTableRowElement) => item.remove());
		}
		trObjectList.forEach(item => {
			const { className, attribute, tdList, row, querySelector } = item;
			const tdStr = tdList.join('');

			// 差异化更新
			// 通过dom节点上的属性反查dom
			let tr = df.querySelector(querySelector);

			// 当前已存在tr
			if (tr) {
				tr.innerHTML = tdStr;
			} else {
				// 当前不存在tr
				tr = document.createElement('tr');
				tr.innerHTML = tdStr;

				const firstCacheTr = df.querySelector(`[${TR_CACHE_KEY}]`) as HTMLTableRowElement;
				if (firstCacheTr && !isUndefined(row)) {
					const firstNum = getRowData(_, firstCacheTr, true)[ROW_INDEX_KEY];
					const nowNum = row[ROW_INDEX_KEY];
					if (nowNum < firstNum) {
						prependFragment.appendChild(tr);
					} else {
						df.appendChild(tr);
					}
				} else {
					df.appendChild(tr);
				}
			}

			// 为新增或修改后的Tr更新[class, attribute]
			if (className.length) {
				tr.className = className.join(' ');
			}
			attribute.forEach(attr => {
				tr.setAttribute(attr[0], attr[1]);
			});
			// 将数据挂载至DOM
			tr[TR_ROW_KEY] = row;
		});

		df.insertBefore(prependFragment, df.firstChild);

		tbody.appendChild(df);
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

	// 解析框架
	await sendCompile(settings);

	// 插入tree dom
	supportTreeData && tree.insertDOM(_, treeConfig);

	// 合并单元格
	mergeRow(_, columnMap);

	// 虚拟滚动无需执行以后逻辑
	if (!isVirtualScroll) {
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
	}

};
