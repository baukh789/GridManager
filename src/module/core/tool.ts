/**
 * 将不同类型的ajaxData转换为promise
 * #001:
 * settings.mergeSort: 是否合并排序字段
 * false: {sort_createDate: 'DESC', sort_title: 'ASC'}
 * true: sort: {createDate: 'DESC'}
 */
import { isString, isFunction, each, isEmptyObject, extend } from '@jTool/utils';
import ajax from '@jTool/Ajax';
import { cloneObject, equal } from '@common/utils';
import { setSettings } from '@common/cache';
import { DiffData, Row, SettingObj } from 'typings/types';
import { TR_CACHE_KEY } from '@common/constants';

// 获取参数信息
export const getParams = (settings: SettingObj): object => {
    const { query, supportAjaxPage, pageData, sortData, mergeSort, sortKey, currentPageKey, pageSizeKey, requestHandler } = settings;
    const params = extend(true, {}, query);
    // 合并分页信息至请求参
    if (supportAjaxPage) {
        params[currentPageKey] = pageData[currentPageKey];
        params[pageSizeKey] = pageData[pageSizeKey];
    }

    // 合并排序信息至请求参, 排序数据为空时则忽略
    if (!isEmptyObject(sortData)) {
        // #001
        // settings.mergeSort: 是否合并排序字段
        if (mergeSort) {
            params[sortKey] = '';
            each(sortData, (key: string, value: string) => {
                params[sortKey] = `${params[sortKey]}${params[sortKey] ? ',' : ''}${key}:${value}`;
            });
        } else {
            each(sortData, (key: string, value: string) => {
                // 增加sort_前缀,防止与搜索时的条件重叠
                params[`${sortKey}${key}`] = value;
            });
        }
    }

    // 请求前处理程序, 可以通过该方法增加 或 修改全部的请求参数
    // requestHandler方法内需返回修改后的参数
    return requestHandler(cloneObject(params));
};

/**
 * 将不同类型的ajaxData转换为promise
 * @param settings
 * @returns promise
 */
export const transformToPromise = (settings: SettingObj): Promise<any> =>  {
    const params = getParams(settings);
    const { supportAjaxPage, pageData, sortData, sortKey, ajaxType, ajaxHeaders, ajaxXhrFields, ajaxData } = settings;
    // 将 requestHandler 内修改的分页参数合并至 settings.pageData
    if (supportAjaxPage) {
        each(pageData, (key: string, value: string) => {
            pageData[key] = params[key] || value;
        });
    }

    // 将 requestHandler 内修改的排序参数合并至 settings.sortData
    each(sortData, (key: string, value: string) => {
        sortData[key] = params[`${sortKey}${key}`] || value;
    });
    setSettings(settings);

    const data = isFunction(ajaxData) ? ajaxData(settings, params) : ajaxData;

    // ajaxData === string url
    if (isString(data)) {
        return new Promise((resolve, reject) => {
            ajax({
                url: data,
                type: ajaxType,
                data: params,
                headers: ajaxHeaders,
                xhrFields: ajaxXhrFields,
                cache: true,
                success: resolve,
                error: reject
            });
        });
    }

    // ajaxData === Promise
    if (data instanceof Promise) {
        return data;
    }

    // 	ajaxData === 静态数据
    return new Promise(resolve => {
        resolve(data);
    });
};

/**
 * 表格数据比对:
 * 1、返回结果用于render，empty代表该条数据未变更，长度变化时以返回结果长度为准
 * 2、两份数组中[TR_CACHE_KEY]相同的数据, equal()返回值为diff结果
 * 3、在DOM中找到与 diffFirst 匹配的tr，并清除之前的tr
 * 4、在DOM中找到与 diffLast 匹配的tr，并清除之后的tr
 * @param settings
 * @param oldTableData
 * @param newTableData
 */
export const diffTableData = (settings: SettingObj, oldTableData: Array<Row>, newTableData: Array<Row>): DiffData => {
	const diffList = cloneObject(newTableData);
	const { supportTreeData, treeConfig } = settings;
	const { treeKey } = treeConfig;

	// 存储第一个与最后一个: 在后续的差异比对中，这两项可能会不存在于differenceList内
	let diffFirst: Row = diffList[0];
	let diffLast: Row;
	// 循环比对时，在旧数据与新数据间取长度较大的值为循环对象，以确保可以对所有值进行比对
	const difference = (newList: Array<Row>, oldList: Array<Row>) => {
		const oldMap = {};
		oldList.forEach(item => {
			oldMap[item[TR_CACHE_KEY]] = item;
		});
		each(newList, (newRow: Row, index: number) => {
			const oldRow = oldMap[newRow[TR_CACHE_KEY]] || {};
			diffLast = newRow;
			// 验证两个对像是否存在差异: 无差异的值为 empty，并在后续的DOM操作中跳过当前索引
			if (equal(oldRow, newRow)) {
				delete newList[index];
			}

			// 树型数据
			if (supportTreeData && newRow[treeKey]) {
				difference(newRow[treeKey], oldRow[treeKey] || []);
			}
		});

	};
	difference(diffList, oldTableData);
	return {
		diffList,
		diffFirst,
		diffLast
	};
};
