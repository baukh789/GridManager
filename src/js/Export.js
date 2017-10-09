/*
 * Export: 数据导出
 * */
import { $ } from './Base';
import Core from './Core';
import Cache from './Cache';
class Export {
	/**
	 * 导出所需的HTML
	 * @returns {string}
     */
	html() {
		const html = '<a href="" download="" id="gm-export-action"></a>';
		return html;
	}

	/**
	 * 拼接要导出html格式数据
	 * @param theadHTML
	 * @param tbodyHTML
	 * @returns {string}
     */
	createExportHTML(theadHTML, tbodyHTML) {
		const exportHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
								<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
								<body>
									<table>
										<thead>
											${theadHTML}
										</thead>
										<tbody>
											${tbodyHTML}
										</tbody>
									</table>
								</body>
							</html>`;
		return exportHTML;
	}

	/**
	 * 导出表格 .xls
	 * @param $table:当前操作的grid,由插件自动传入
	 * @param fileName: 导出后的文件名
	 * @param onlyChecked: 是否只导出已选中的表格
	 * @returns {boolean}
     * @private
     */
	__exportGridToXls($table, fileName, onlyChecked) {
		let Settings = Cache.getSettings($table);
		// createDOM内添加
		const gmExportAction = $('#gm-export-action');
		if (gmExportAction.length === 0) {
			Core.outLog('导出失败，请查看配置项:supportExport是否配置正确', 'error');
			return false;
		}

		// type base64
		const uri = 'data:application/vnd.ms-excel;base64,';

		// 存储导出的thead数据

		let	theadHTML = '';

		// 存储导出的tbody下的数据
		let	tbodyHTML = '';

		const thDOM = $('thead[grid-manager-thead] th[th-visible="visible"][gm-create="false"]', $table);
		let	trDOM = null;
		let	tdDOM = null;

		// 验证：是否只导出已选中的表格
		if (onlyChecked) {
			trDOM = $('tbody tr[checked="true"]', $table);
		} else {
			trDOM = $('tbody tr', $table);
		}

		$.each(thDOM, (i, v) => {
			theadHTML += `<th>${v.getElementsByClassName('th-text')[0].textContent}</th>`;
		});

		$.each(trDOM, (i, v) => {
			tdDOM = $('td[gm-create="false"][td-visible="visible"]', v);
			tbodyHTML += '<tr>';
			$.each(tdDOM, (i2, v2) => {
				tbodyHTML += v2.outerHTML;
			});
			tbodyHTML += '</tr>';
		});

		// 拼接要导出html格式数据
		const exportHTML = this.createExportHTML(theadHTML, tbodyHTML);
		gmExportAction.prop('href', uri + base64(exportHTML));
		gmExportAction.prop('download', `${fileName || Settings.gridManagerName}.xls`);
		gmExportAction.get(0).click();

		function base64(s) {
			return window.btoa(unescape(encodeURIComponent(s)));
		}

		// 成功后返回true
		return true;
	}
}
export default new Export();
