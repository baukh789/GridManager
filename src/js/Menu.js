/*
 * GridManager: 右键菜单
 * */
import $ from './jTool';
import Cache from './Cache';
import I18n from './I18n';
import Export from './Export';
import AjaxPage from './AjaxPage';
const Menu = {
	/*
	 @验证菜单区域: 禁用、开启分页操作
	 */
	checkMenuPageAction: function(table){
		let Settings = Cache.getSettings(table);
		//右键菜单区上下页限制
		const gridMenu = $('.grid-menu[grid-master="'+ Settings.gridManagerName +'"]');
		if(!gridMenu || gridMenu.length === 0){
			return;
		}
		const previousPage = $('[refresh-type="previous"]', gridMenu),
			nextPage = $('[refresh-type="next"]', gridMenu);
		if(Settings.pageData.cPage === 1 || Settings.pageData.tPage === 0){
			previousPage.addClass('disabled');
		}else{
			previousPage.removeClass('disabled');
		}
		if(Settings.pageData.cPage === Settings.pageData.tPage || Settings.pageData.tPage === 0){
			nextPage.addClass('disabled');
		}else{
			nextPage.removeClass('disabled');
		}
	}
	/*
	 @绑定右键菜单事件
	  $table: table[jTool Object]
	 */
	,bindRightMenuEvent: function($table){
		let Settings = Cache.getSettings($table);
		const tableWarp = $table.closest('.table-wrap'),
			tbody = $('tbody', tableWarp);
		//刷新当前表格
		let menuHTML = `<div class="grid-menu" grid-master="${Settings.gridManagerName}">`;
		//分页类操作
		if(Settings.supportAjaxPage){
			menuHTML+= `<span grid-action="refresh-page" refresh-type="previous">
							${ I18n.i18nText($table, "previous-page") }
							<i class="iconfont icon-sanjiao2"></i>
						</span>
						<span grid-action="refresh-page" refresh-type="next">
							${ I18n.i18nText($table, "next-page") }
							<i class="iconfont icon-sanjiao1"></i>
						</span>`;
		}
		menuHTML += `<span grid-action="refresh-page" refresh-type="refresh">
						${ I18n.i18nText($table, "refresh") }
						<i class="iconfont icon-31shuaxin"></i>
					</span>`;
		//导出类
		if(Settings.supportExport){
			menuHTML+= `<span class="grid-line"></span>
						<span grid-action="export-excel" only-checked="false">
							${ I18n.i18nText($table, "save-as-excel") }
							<i class="iconfont icon-baocun"></i>
						</span>
						<span grid-action="export-excel" only-checked="true">
							${ I18n.i18nText($table, "save-as-excel-for-checked") }
							<i class="iconfont icon-saveas24"></i>
						</span>`;
		}
		//配置类
		if(Settings.supportConfig){
			menuHTML+= `<span class="grid-line"></span>
						<span grid-action="setting-grid">
							${ I18n.i18nText($table, "setting-grid") }
							<i class="iconfont icon-shezhi"></i>
						</span>`;
		}
		menuHTML+= `</div>`;
		const _body = $('body');
		_body.append(menuHTML);
		//绑定打开右键菜单栏
		const menuDOM = $(`.grid-menu[grid-master="${ Settings.gridManagerName }"]`);
		tableWarp.unbind('contextmenu');
		tableWarp.bind('contextmenu', function(e){
			e.preventDefault();
			e.stopPropagation();
			//验证：如果不是tbdoy或者是tbody的子元素，直接跳出
			if(e.target.nodeName !== 'TBODY' && $(e.target).closest('tbody').length === 0){
				return;
			}
			//验证：当前是否存在已选中的项
			const exportExcelOfChecked = $('[grid-action="export-excel"][only-checked="true"]');
			if($('tbody tr[checked="true"]', $(`table[grid-manager="${ Settings.gridManagerName }"]`)).length === 0){
				exportExcelOfChecked.addClass('disabled');
			}else{
				exportExcelOfChecked.removeClass('disabled');
			}
			const menuWidth = menuDOM.width(),
				menuHeight = menuDOM.height(),
				offsetHeight = document.documentElement.offsetHeight,
				offsetWidth = document.documentElement.offsetWidth;
			const top = offsetHeight < e.clientY + menuHeight ? e.clientY - menuHeight : e.clientY;
			const left = offsetWidth < e.clientX + menuWidth ? e.clientX - menuWidth : e.clientX;
			menuDOM.css({
				'top': top + tableWarp.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop),
				'left': left + tableWarp.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
			});
			//隐藏非当前展示表格的菜单项
			$('.grid-menu[grid-master]').hide();
			menuDOM.show();
			_body.off('mousedown.gridMenu');
			_body.on('mousedown.gridMenu', function(e){
				const eventSource = $(e.target);
				if(eventSource.hasClass('.grid-menu') || eventSource.closest('.grid-menu').length === 1){
					return;
				}
				_body.off('mousedown.gridMenu');
				menuDOM.hide();
			});
		});

		//绑定事件：上一页、下一页、重新加载
		const refreshPage = $('[grid-action="refresh-page"]');
		refreshPage.unbind('click');
		refreshPage.bind('click', function(e){
			if(isDisabled(this, e)){
				return false;
			}
			const _gridMenu = $(this).closest('.grid-menu');
			const _table = $(`table[grid-manager="${ _gridMenu.attr('grid-master') }"]`);
			const refreshType = this.getAttribute('refresh-type');
			let Settings = Cache.getSettings(_table);
			let cPage = Settings.pageData.cPage;
			//上一页
			if(refreshType === 'previous' && Settings.pageData.cPage > 1){
				cPage = Settings.pageData.cPage - 1;
			}
			//下一页
			else if(refreshType === 'next' && Settings.pageData.cPage < Settings.pageData.tPage){
				cPage = Settings.pageData.cPage + 1;
			}
			//重新加载
			else if(refreshType === 'refresh'){
				cPage = Settings.pageData.cPage;
			}
			AjaxPage.gotoPage(_table, cPage);
			_body.off('mousedown.gridMenu');
			_gridMenu.hide();
		});
		//绑定事件：另存为EXCEL、已选中表格另存为Excel
		const exportExcel = $('[grid-action="export-excel"]');
		exportExcel.unbind('click');
		exportExcel.bind('click', function(e){
			if(isDisabled(this, e)){
				return false;
			}
			const _gridMenu = $(this).closest('.grid-menu'),
				_table = $(`table[grid-manager="${ _gridMenu.attr('grid-master') }"]`);
			let onlyChecked = false;
			if(this.getAttribute('only-checked') === 'true'){
				onlyChecked = true;
			}
			Export.__exportGridToXls(_table, undefined, onlyChecked);
			_body.off('mousedown.gridMenu');
			_gridMenu.hide();
		});
		//绑定事件：配置表
		const settingGrid = $('[grid-action="setting-grid"]');
		settingGrid.unbind('click');
		settingGrid.bind('click', function(e){
			if(isDisabled(this, e)){
				return false;
			}
			const _gridMenu = $(this).closest('.grid-menu'),
				_table = $(`table[grid-manager="${ _gridMenu.attr('grid-master') }"]`);
			const configArea = $('.config-area', _table.closest('.table-wrap'));
			$('.config-action', configArea).trigger('click');
			_body.off('mousedown.gridMenu');
			_gridMenu.hide();
		});
		//验证当前是否禁用
		function isDisabled(dom, events){
			if($(dom).hasClass('disabled')){
				events.stopPropagation();
				events.preventDefault();
				return true;
			}else{
				return false;
			}
		}
	}
};
export default Menu;
