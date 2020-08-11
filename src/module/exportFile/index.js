/*
 * exportFile: 数据导出
 */
import jTool from '@jTool';
import { isFunction, each, isArray } from '@jTool/utils';
import { showLoading, hideLoading, getFakeVisibleTh, getTbody } from '@common/base';
import { outError } from '@common/utils';
import { getSettings, getCheckedData, getTableData } from '@common/cache';
import { GM_CREATE, CELL_HIDDEN } from '@common/constants';

/**
 * 获取文件名称
 * @param _
 * @param fileName: 文件名
 * @param query: 查询参数
 * @param exportConfig: 配置信息
 */
const getFileName = (_, fileName, query, exportConfig) => {
    // 未存在指定下载名称时, 使用exportConfig.fileName
    if (!fileName) {
        const confName = exportConfig.fileName;
        fileName = isFunction(confName) ? confName(query) : confName;
    }

    // 未存在指定下载名称 且 未指定exportConfig.fileName时, 使用 _
    if (!fileName) {
        fileName = _;
    }

    return `${fileName}.${exportConfig.suffix}`;
};

/**
 * 执行下载
 * @param fileName
 * @param href
 */
const dispatchDownload = (fileName, href) => {
    const a = document.createElement('a');
    a.addEventListener('click', () => {
        a.download = fileName;
        a.href = href;
    });
    const e = document.createEvent('MouseEvents');
    e.initEvent('click', false, false);
    a.dispatchEvent(e);
};
class ExportFile {
	/**
	 * 导出表格 .xls
	 * @param _
	 * @param fileName: 导出后的文件名, 该文件名不包含后缀名
	 * @param onlyChecked: 是否只导出已选中的表格
	 * @returns {boolean}
     * @private
     */
	async exportGrid(_, fileName, onlyChecked) {
	    const settings = getSettings(_);
	    const { query, loadingTemplate, exportConfig, pageData, sortData } = settings;

        fileName = getFileName(_, fileName, query, exportConfig);

        const selectedList = onlyChecked ? getCheckedData(_) : [];
        const tableData = getTableData(_);

        const handler = exportConfig.handler;

	    switch (exportConfig.mode) {
            case 'static': {
                this.downStatic(_, loadingTemplate, fileName, onlyChecked, exportConfig.suffix, handler, query, pageData, sortData, selectedList, tableData);
                break;
            }
            case 'blob': {
                await this.downBlob(_, loadingTemplate, fileName, handler, query, pageData, sortData, selectedList, tableData);
                break;
            }

            case 'url': {
                await this.downFilePath(_, loadingTemplate, fileName, handler, pageData, sortData, selectedList);
                break;
            }
        }
	}

    /**
     * 下载方式: 静态下载
     * @param _
     * @param loadingTemplate
     * @param fileName
     * @param onlyChecked
     * @returns {boolean}
     */
	downStatic(_, loadingTemplate, fileName, onlyChecked, suffix, exportHandler, query, pageData, sortData, selectedList, tableData) {
        showLoading(_, loadingTemplate);

        let tableList = exportHandler(fileName, query, pageData, sortData, selectedList, tableData);

        // exportHandler 未返回数组表示当前exportHandler未被配置
        if (!isArray(tableList)) {
            const thDOM = getFakeVisibleTh(_, true);
            const $tbody = getTbody(_);
            let	trDOM;
            // 验证：是否只导出已选中的表格
            if (onlyChecked) {
                trDOM = jTool('tr[checked="true"]', $tbody);
            } else {
                trDOM = jTool('tr', $tbody);
            }
            tableList = [];
            // 存储导出的thead
            const thList = [];
            each(thDOM, v => {
                thList.push(`"${v.querySelector('.th-text').textContent || ''}"`);
            });
            tableList.push(thList);

            // 存储导出的tbody
            each(trDOM, v => {
                let tdList = [];
                const tdDOM = jTool(`td:not([${GM_CREATE}]):not([${CELL_HIDDEN}])`, v);
                each(tdDOM, v2 => {
                    tdList.push(`"${v2.textContent || ''}"`); // 添加""的原因: 规避内容中英文逗号被识别为分割单元格的标识
                });
                tableList.push(tdList);
            });
        }

        let exportHTML = '';
        each(tableList, (v, i) => {
            if (i !== 0) {
                exportHTML += '\r\n';
            }
            exportHTML += v.join(','); // 添加""的原因: 规避内容中英文逗号被识别为分割单元格的标识
        });

        const dataType = {
            csv: 'text/csv',
            xls: 'application/vnd.ms-excel'
        };
        dispatchDownload(fileName, `data:${dataType[suffix]};charset=utf-8,\ufeff${encodeURIComponent(exportHTML)}`);

        hideLoading(_, loadingTemplate);
    }

    /**
     * 下载方式: 文件路径
     * @param _
     * @param loadingTemplate: loading模板
     * @param fileName
     * @param exportHandler
     * @param pageData
     * @param sortData
     * @param selectedList
     * @returns {Promise<void>}
     */
    async downFilePath(_, loadingTemplate, fileName, exportHandler, pageData, sortData, selectedList) {
        try {
            showLoading(_, loadingTemplate);
            const res = await exportHandler(fileName, pageData, sortData, selectedList);
            dispatchDownload(fileName, res);
        } catch (e) {
            outError(e);
        } finally {
            hideLoading(_);
        }
    }

    /**
     * 下载方式: Blob格式
     * @param _
     * @param loadingTemplate: loading模板
     * @param fileName: 导出的文件名，不包含后缀名
     * @param exportHandler: 执行函数
     * @param query: 请求参数信息
     * @param pageData: 分页信息
     * @param sortData: 排序信息
     * @param selectedList: 当前选中的列表
     */
    async downBlob(_, loadingTemplate, fileName, exportHandler, query, pageData, sortData, selectedList, tableData) {
        try {
            showLoading(_, loadingTemplate);

            const res = await exportHandler(fileName, query, pageData, sortData, selectedList, tableData);
            const blobPrototype = Blob.prototype;
            let blob;

            // res === blob
            if (Object.getPrototypeOf(res) === blobPrototype) {
                blob = res;
            }

            // res.data === blob
            if (res.data && Object.getPrototypeOf(res.data) === blobPrototype) {
                blob = res.data;
            }

            // 当前返回的blob有误，直接跳出
            if (!blob || Object.getPrototypeOf(blob) !== blobPrototype) {
                outError('response type not equal to Blob');
                return;
            }

            dispatchDownload(fileName, URL.createObjectURL(blob));
        } catch (e) {
            outError(e);
        } finally {
            hideLoading(_);
        }
    }
}
export default new ExportFile();
