/*
 * exportFile: 数据导出
 */
import jTool from '@common/jTool';
import { showLoading, hideLoading, getVisibleTh, getTbody } from '@common/base';
import { outError, isFunction, jEach } from '@common/utils';
import { getSettings, getCheckedData } from '@common/cache';
import { parseTpl } from '@common/parse';
import { GM_CREATE } from '@common/constants';
import staticTpl from './static.tpl.html';
class ExportFile {
	/**
	 * uri type base64
	 * @returns {string}
     */
	get URI() {
		return 'data:application/vnd.ms-excel;base64,';
	}

	/**
	 * 获取下载 url
	 * @param exportHTML
     */
	getHref(exportHTML) {
		return this.URI + window.btoa(unescape(encodeURIComponent(exportHTML || '')));
	}

	/**
	 * 获取文件名称
	 * @param gridManagerName
	 * @param fileName: 文件名
	 * @param query: 查询参数
	 * @param exportConfig: 配置信息
     */
    getFileName(gridManagerName, fileName, query, exportConfig) {
        // 未存在指定下载名称时, 使用exportConfig.fileName
		if (!fileName) {
		    const confName = exportConfig.fileName;
		    fileName = isFunction(confName) ? confName(query) : confName;
		}

		// 未存在指定下载名称 且 未指定exportConfig.fileName时, 使用 gridManagerName
		if (!fileName) {
            fileName = gridManagerName;
        }

		return `${fileName}.${exportConfig.suffix}`;
	}

    /**
     * 执行下载
     * @param fileName
     * @param href
     */
    dispatchDownload(fileName, href) {
        const a = document.createElement('a');
        a.addEventListener('click', () => {
            a.download = fileName;
            a.href = href;
        });
        const e = document.createEvent('MouseEvents');
        e.initEvent('click', false, false);
        a.dispatchEvent(e);
    }

	/**
	 * 拼接要导出html格式数据
     * @param params
	 * @returns {parseData}
     */
	@parseTpl(staticTpl)
	createExportHTML(params) {
	    const { gridManagerName, onlyChecked } = params;
        const thDOM = getVisibleTh(gridManagerName, false);
        const $tbody = getTbody(gridManagerName);
        let	trDOM = null;
        // 验证：是否只导出已选中的表格
        if (onlyChecked) {
            trDOM = jTool('tr[checked="true"]', $tbody);
        } else {
            trDOM = jTool('tr', $tbody);
        }
        // 存储导出的thead
        let	theadHTML = '';
        jEach(thDOM, (i, v) => {
            theadHTML += `<th>${v.getElementsByClassName('th-text')[0].textContent}</th>`;
        });

        // 存储导出的tbody
        let	tbodyHTML = '';
        jEach(trDOM, (i, v) => {
            let tdDOM = jTool(`td[${GM_CREATE}="false"][td-visible="visible"]`, v);
            tbodyHTML += '<tr>';
            jEach(tdDOM, (i2, v2) => {
                tbodyHTML += `<td>${v2.textContent}</td>`;
            });
            tbodyHTML += '</tr>';
        });

        return {
            theadHTML,
            tbodyHTML
        };
	}

	/**
	 * 导出表格 .xls
	 * @param gridManagerName
	 * @param fileName: 导出后的文件名, 该文件名不包含后缀名
	 * @param onlyChecked: 是否只导出已选中的表格
	 * @returns {boolean}
     * @private
     */
	async __exportGridToXls(gridManagerName, fileName, onlyChecked) {
	    const settings = getSettings(gridManagerName);
	    const { query, loadingTemplate, exportConfig, pageData, sortData } = settings;

        fileName = this.getFileName(gridManagerName, fileName, query, exportConfig);

        const selectedList = onlyChecked ? getCheckedData(gridManagerName) : undefined;

        if (!isFunction(exportConfig.handler)) {
            outError('exportConfig.handler not return promise');
            return false;
        }

	    switch (exportConfig.mode) {
            case 'blob': {
                await this.downBlob(gridManagerName, loadingTemplate, fileName, query, exportConfig.handler, pageData, sortData, selectedList);
                break;
            }
            // TODO 待添加
            // case 'filePath': {
            //     await this.downFilePath(fileName, exportHandler, pageData, sortData, selectedList);
            //     break;
            // }
            //
            // case 'fileStream': {
            //     await this.downFileStream(fileName, exportHandler, pageData, sortData, selectedList);
            //     break;
            // }

            case 'static': {
                this.downStatic(gridManagerName, fileName, onlyChecked);
                break;
            }

            default: {
                this.downStatic(gridManagerName, fileName, onlyChecked);
                break;
            }
        }

		// 成功后返回true
		return true;
	}

    /**
     * 下载方式: 文件路径
     * @param fileName
     * @param exportHandler
     * @param pageData
     * @param sortData
     * @param selectedList
     * @returns {Promise<void>}
     */
    // async downFilePath(fileName, exportHandler, pageData, sortData, selectedList) {
    //     try {
    //         const res = await exportHandler(fileName, pageData, sortData, selectedList);
    //         this.dispatchDownload(fileName, res);
    //     } catch (e) {
    //         outError(e);
    //     }
    // }

    /**
     * 下载方式: 文件流
     * @param fileName
     * @param exportHandler
     * @param pageData
     * @param sortData
     * @param selectedList
     * @returns {Promise<void>}
     */
    // async downFileStream(fileName, exportHandler, pageData, sortData, selectedList) {
    //     try {
    //         const res = await exportHandler(fileName, pageData, sortData, selectedList);
    //         window.open(res);
    //     } catch (e) {
    //         outError(e);
    //     }
    //
    // }

    /**
     * 下载方式: 静态下载
     * @param gridManagerName
     * @param fileName
     * @param onlyChecked
     * @returns {boolean}
     */
	downStatic(gridManagerName, fileName, onlyChecked) {
        this.dispatchDownload(fileName, this.getHref(this.createExportHTML({gridManagerName, onlyChecked})));
    }

    /**
     * 下载方式: Blob格式
     * @param gridManagerName
     * @param loadingTemplate: loading模板
     * @param fileName: 导出的文件名，不包含后缀名
     * @param query: 请求参数信息
     * @param pageData: 分页信息
     * @param sortData: 排序信息
     * @param selectedList: 当前选中的列表
     */
    async downBlob(gridManagerName, loadingTemplate, fileName, query, exportHandler, pageData, sortData, selectedList) {
        try {
            showLoading(gridManagerName, loadingTemplate);

            const res = await exportHandler(fileName, query, pageData, sortData, selectedList);

            hideLoading(gridManagerName);

            const blobPrototype = Blob.prototype;
            let blob = null;

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

            this.dispatchDownload(fileName, URL.createObjectURL(blob));
        } catch (e) {
            outError(e);
            hideLoading(gridManagerName);
        }
    }
}
export default new ExportFile();
