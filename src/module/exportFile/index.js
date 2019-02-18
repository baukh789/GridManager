/*
 * exportFile: 数据导出
 * */
import { jTool, base, cache, parseTpl } from '../../common';
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
        if (jTool.type(suffix) !== 'string') {
            base.outLog('导出参数错误，exportConfig.suffix只允许为字符串', 'error');
            return;
        }

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
	    const { $table, base } = params;
        const thDOM = base.getVisibleTh($table, false);
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
	 * @param $table:当前操作的grid,由插件自动传入
	 * @param fileName: 导出后的文件名, 该文件名不包含后缀名
	 * @param onlyChecked: 是否只导出已选中的表格
	 * @returns {boolean}
     * @private
     */
	async __exportGridToXls($table, fileName, onlyChecked) {
	    const settings = cache.getSettings($table);
	    const {gridManagerName, query, loadingTemplate, exportConfig, pageData, sortData} = settings;

        fileName = this.addSuffix(gridManagerName, fileName, exportConfig.suffix);

        // 文件有误，导出失败
        if (!fileName) {
            return false;
        }

        const selectedList = onlyChecked ? cache.getCheckedData($table) : undefined;

        if (jTool.type(exportConfig.handler) !== 'function') {
            base.outLog('配置项exportAPI错误，该参数由一个返回promise的函数构成。', 'error');
            return false;
        }

	    switch (exportConfig.mode) {
            case 'blob': {
                await this.downBlob($table, loadingTemplate, fileName, query, exportConfig.handler, pageData, sortData, selectedList);
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
                this.downStatic($table, fileName, onlyChecked);
                break;
            }

            default: {
                this.downStatic($table, fileName, onlyChecked);
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
            base.outLog(`导出错误，请确认exportAPI接口, ${e}`, 'error');
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
            base.outLog(`导出错误，请确认exportAPI接口, ${e}`, 'error');
        }

    }

    /**
     * 下载方式: 静态下载
     * @param $table
     * @param fileName
     * @param onlyChecked
     * @returns {boolean}
     */
	downStatic($table, fileName, onlyChecked) {
        this.dispatchDownload(fileName, this.getHref(this.createExportHTML({$table, base})));
    }

    /**
     * 下载方式: Blob格式
     * @param $table
     * @param loadingTemplate: loading模板
     * @param fileName: 导出的文件名，不包含后缀名
     * @param query: 请求参数信息
     * @param pageData: 分页信息
     * @param sortData: 排序信息
     * @param selectedList: 当前选中的列表
     */
    async downBlob($table, loadingTemplate, fileName, query, exportHandler, pageData, sortData, selectedList) {
        const $tableWrap = $table.closest('.table-wrap');
        try {
            base.showLoading($table, loadingTemplate);

            const res = await exportHandler(fileName, query, pageData, sortData, selectedList);

            base.hideLoading($tableWrap);

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
                base.outLog(`导出错误，请确认接口返回是否为Blob格式`, 'error');
                return;
            }

            this.dispatchDownload(fileName, URL.createObjectURL(blob));
        } catch (e) {
            base.outLog(`blob方式导出错误, ${e}`, 'error');
            base.hideLoading($tableWrap);
        }
    }
}
export default new ExportFile();
