/*
 * exportFile: 数据导出
 */
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import { parseTpl } from '@common/parse';
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
	 * 添加后缀
	 * @param gridManagerName
	 * @param fileName: 文件名
	 * @param suffix: 后缀名
     */
    addSuffix(gridManagerName, fileName, suffix) {
		if (!fileName) {
			fileName = gridManagerName;
		}

		return `${fileName}.${suffix}`;
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
        const thDOM = base.getVisibleTh(gridManagerName, false);
        const $table = base.getTable(gridManagerName);
        let	trDOM = null;
        // 验证：是否只导出已选中的表格
        if (onlyChecked) {
            trDOM = jTool('tbody tr[checked="true"]', $table);
        } else {
            trDOM = jTool('tbody tr', $table);
        }
        // 存储导出的thead
        let	theadHTML = '';
        jTool.each(thDOM, (i, v) => {
            theadHTML += `<th>${v.getElementsByClassName('th-text')[0].textContent}</th>`;
        });

        // 存储导出的tbody
        let	tbodyHTML = '';
        jTool.each(trDOM, (i, v) => {
            let tdDOM = jTool('td[gm-create="false"][td-visible="visible"]', v);
            tbodyHTML += '<tr>';
            jTool.each(tdDOM, (i2, v2) => {
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
	    const settings = cache.getSettings(gridManagerName);
	    const { query, loadingTemplate, exportConfig, pageData, sortData } = settings;

        fileName = this.addSuffix(gridManagerName, fileName, exportConfig.suffix);

        // 文件有误，导出失败
        if (!fileName) {
            return false;
        }

        const selectedList = onlyChecked ? cache.getCheckedData(gridManagerName) : undefined;

        if (jTool.type(exportConfig.handler) !== 'function') {
            base.outError('exportConfig.handler not return promise');
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
	async downFilePath(fileName, exportHandler, pageData, sortData, selectedList) {
        try {
            const res = await exportHandler(fileName, pageData, sortData, selectedList);
            this.dispatchDownload(fileName, res);
        } catch (e) {
            base.outError(e);
        }
    }

    /**
     * 下载方式: 文件流
     * @param fileName
     * @param exportHandler
     * @param pageData
     * @param sortData
     * @param selectedList
     * @returns {Promise<void>}
     */
    async downFileStream(fileName, exportHandler, pageData, sortData, selectedList) {
        try {
            const res = await exportHandler(fileName, pageData, sortData, selectedList);
            window.open(res);
        } catch (e) {
            base.outError(e);
        }

    }

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
            base.showLoading(gridManagerName, loadingTemplate);

            const res = await exportHandler(fileName, query, pageData, sortData, selectedList);

            base.hideLoading(gridManagerName);

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
                base.outError('response type not equal to Blob');
                return;
            }

            this.dispatchDownload(fileName, URL.createObjectURL(blob));
        } catch (e) {
            base.outError(e);
            base.hideLoading(gridManagerName);
        }
    }
}
export default new ExportFile();
