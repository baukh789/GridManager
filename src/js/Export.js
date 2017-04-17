/*
 * Export: 数据导出
 * */
import $ from './jTool';
import Core from './Core';
import Cache from './Cache';
const Export = {
	html: function () {
		const html = '<a href="" download="" id="gm-export-action"></a>';
		return html;
	}
	/*
	 [对外公开方法]
	 @导出表格 .xls
	 $.table:当前操作的grid,由插件自动传入
	 $.fileName: 导出后的文件名
	 $.onlyChecked: 是否只导出已选中的表格
	 */
	,__exportGridToXls: function(table, fileName, onlyChecked){
		let Settings = Cache.getSettings(table);
		const gmExportAction = $('#gm-export-action'); //createDOM内添加
		if(gmExportAction.length === 0){
			Core.outLog('导出失败，请查看配置项:supportExport是否配置正确', 'error');
			return;
		}
		// type base64
		const uri = 'data:application/vnd.ms-excel;base64,';

		//存储导出的thead数据
		let	theadHTML = '';
		//存储导出的tbody下的数据
		let	tbodyHTML = '';

		//当前要导出的table
		const tableDOM = $(table);
		const thDOM = $('thead[grid-manager-thead] th[th-visible="visible"][gm-create="false"]', tableDOM);

		let	trDOM,
			tdDOM;
		//验证：是否只导出已选中的表格
		if(onlyChecked){
			trDOM = $('tbody tr[checked="true"]', tableDOM);
		}else{
			trDOM = $('tbody tr', tableDOM);
		}
		$.each(thDOM, function(i, v){
			theadHTML += `<th>${v.getElementsByClassName('th-text')[0].textContent}</th>`;
		});
		$.each(trDOM, function(i, v){
			tdDOM = $('td[gm-create="false"][td-visible="visible"]', v);
			tbodyHTML += '<tr>';
			$.each(tdDOM, function(i2, v2){
				tbodyHTML += v2.outerHTML;
			});
			tbodyHTML += '</tr>';
		});
		// 拼接要导出html格式数据
		const exportHTML =`
			<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
				<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
				<body>
					<table>
						<thead>'
							${theadHTML}
						</thead>
						<tbody>
							${tbodyHTML}
						</tbody>
					</table>
				</body>
			</html>`;
		gmExportAction.prop('href', uri + base64(exportHTML));
		gmExportAction.prop('download', (fileName || Settings.gridManagerName) +'.xls');
		gmExportAction.get(0).click();

		function base64(s) {
			return window.btoa(unescape(encodeURIComponent(s)))
		}
	}
};
export default Export;
