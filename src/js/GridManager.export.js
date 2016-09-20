/*
 * GridManager: 数据导出
 * */
define(function() {
    var exportGM = {

        /*
         [对外公开方法]
         @导出表格 .xls
         $.table:当前操作的grid,由插件自动传入
         $.fileName: 导出后的文件名
         $.onlyChecked: 是否只导出已选中的表格
         */
        exportGridToXls: function(table, fileName, onlyChecked){
            var _this = this;
            var gmExportAction = $('#gm-export-action'); //createDOM内添加
            if(!_this.supportExport || gmExportAction.length === 0){
                _this.outLog('导出失败，请查看配置项:supportExport是否配置正确', 'error');
                return;
            }

            var uri = 'data:application/vnd.ms-excel;base64,',
                exportHTML = '',	//要导出html格式数据
                theadHTML= '',	//存储导出的thead数据
                tbodyHTML ='', //存储导出的tbody下的数据
                tableDOM = $(table);	//当前要导出的table
            var thDOM = $('thead[class!="set-top"] th[th-visible="visible"][gm-create!="true"]', tableDOM),
                trDOM,
                tdDOM;
            //验证：是否只导出已选中的表格
            if(_this.supportCheckbox && onlyChecked){
                trDOM = $('tbody tr[checked="checked"]', tableDOM);
            }else{
                trDOM = $('tbody tr', tableDOM);
            }
            $.each(thDOM, function(i, v){
                theadHTML += '<th>'
                    + v.getElementsByClassName('th-text')[0].textContent
                    + '</th>';
            });
            $.each(trDOM, function(i, v){
                tdDOM = $('td[gm-create!="true"]', v);
                tbodyHTML += '<tr>';
                $.each(tdDOM, function(i2, v2){
                    tbodyHTML += v2.outerHTML
                });
                tbodyHTML += '</tr>';
            });
            exportHTML  = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
                + '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>'
                + '<body><table>'
                + '<thead>'
                + theadHTML
                + '</thead>'
                + '<tbody>'
                + tbodyHTML
                + '</tbody>'
                + '</table></body>'
                + '</html>';
            gmExportAction.prop('href', uri + base64(exportHTML));
            gmExportAction.prop('download', (fileName || tableDOM.attr('grid-manager')) +'.xls');
            gmExportAction.get(0).click();

            function base64(s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            }
        }
    };
    return exportGM;
});