// 表格唯一标识
const gridManagerName = 'test';

// 博文类型
const TYPE_MAP = {
    '1': 'HTML/CSS',
    '2': 'nodeJS',
    '3': 'javaScript',
    '4': '前端鸡汤',
    '5': 'PM Coffee',
    '6': '前端框架',
    '7': '前端相关'
};

// 公开方法列表
const GM_PUBLISH_METHOD_MAP = {
    init: {
        key: 'init',
        relyInit: false,
        title: '初始化',
        code: 'demo1.initGM(document.querySelector("table"));'
    },
    get: {
        key: 'get',
        relyInit: true,  // 是否依赖init方法
        title: '获取表格的实时配置信息',
        code: `GridManager.get('${gridManagerName}');`
    },
    version: {
        key: 'version',
        relyInit: false,
        title: '获取当前GridManager的版本号',
        code: 'GridManager.version;'
    },
    getLocalStorage: {
        key: 'getLocalStorage',
        relyInit: true,
        title: '获取表格用户记忆',
        code: `GridManager.getLocalStorage('${gridManagerName}');`
    },
    resetLayout: {
        key: 'resetLayout',
        relyInit: true,
        title: '重置表格布局',
        code: `GridManager.resetLayout('${gridManagerName}', '800px', '500px');`
    },
    clear: {
        key: 'clear',
        relyInit: true,
        title: '清除表格记忆数据',
        code: `GridManager.clear('${gridManagerName}');`
    },
    getTableData: {
        key: 'getTableData',
        relyInit: true,
        title: '获取指定tr所使用的数据',
        code: `GridManager.getTableData('${gridManagerName}');`
    },
    getRowData: {
        key: 'getRowData',
        relyInit: true,
        title: '获取指定tr所使用的数据',
        code: `GridManager.getRowData('${gridManagerName}', document.querySelector("table[grid-manager=${gridManagerName}] tbody tr"));`
    },
    updateRowData: {
        key: 'updateRowData',
        relyInit: true,
        title: '更新指定行所使用的数据',
        code: `GridManager.updateRowData('${gridManagerName}', 'id', {id: 112, title: 'ccc'});`
    },
    updateTreeState: {
        key: 'updateTreeState',
        relyInit: true,
        title: '更新树的展开状态',
        code: `GridManager.updateTreeState('${gridManagerName}', true);`
    },
    setSort: {
        key: 'setSort',
        relyInit: true,
        title: '手动设置排序',
        code: `GridManager.setSort('${gridManagerName}', {createDate: 'ASC'});`
    },
    setConfigVisible: {
        key: 'setConfigVisible',
        relyInit: true,
        title: '设置表头配置区域可视状态',
        code: `GridManager.setConfigVisible('${gridManagerName}', true);`
    },
	setLineHeight: {
		key: 'setLineHeight',
		relyInit: true,
		title: '配置行的高度',
		code: `GridManager.setLineHeight('${gridManagerName}', '70px');`
	},
    showTh: {
        key: 'showTh',
        relyInit: true,
        title: '设置列为可视状态',
        code: `GridManager.showTh('${gridManagerName}', 'pic');`
    },
    hideTh: {
        key: 'hideTh',
        relyInit: true,
        title: '设置列为隐藏状态',
        code: `GridManager.hideTh('${gridManagerName}', 'pic');`
    },
    exportGrid: {
        key: 'exportGrid',
        relyInit: true,
        title: '导出指定表格',
        code: `GridManager.exportGrid('${gridManagerName}', 'demo中使用的导出').then(res=>{console.log('success')}).catch(err=>{console.error('error', err)});`
    },
    setQuery: {
        key: 'setQuery',
        relyInit: true,
        title: '更改在生成组件时所配置的参数query',
        code: `GridManager.setQuery('${gridManagerName}', {'userName':'baukh','sex':'男'});`
    },
    setAjaxData: {
        key: 'setAjaxData',
        relyInit: true,
        title: '用于再次配置ajaxData数据',
        code: `GridManager.setAjaxData('${gridManagerName}', {data: [{title: '通过setAjaxData动态添加的数据，其它项为空'}], totals: 1});`
    },
    refreshGrid: {
        key: 'refreshGrid',
        relyInit: true,
        title: '刷新表格',
        code: `GridManager.refreshGrid('${gridManagerName}');`
    },
    renderGrid: {
        key: 'renderGrid',
        relyInit: true,
        title: '渲染表格',
        code: `GridManager.renderGrid('${gridManagerName}');`
    },
    getCheckedTr: {
        key: 'getCheckedTr',
        relyInit: true,
        title: '获取当前选中的行',
        code: `GridManager.getCheckedTr('${gridManagerName}');`
    },
    getCheckedData: {
        key: 'getCheckedData',
        relyInit: true,
        title: '获取选中行的渲染数据',
        code: `GridManager.getCheckedData('${gridManagerName}');`
    },
    setCheckedData: {
        key: 'setCheckedData',
        relyInit: true,
        title: '设置选中的数据',
        code: `GridManager.setCheckedData('${gridManagerName}', [GridManager.getTableData('${gridManagerName}')[1]]);`
    },
    cleanData: {
        key: 'cleanData',
        relyInit: true,
        title: '清除指定表格数据',
        code: `GridManager.cleanData('${gridManagerName}');`
    },
    print: {
        key: 'print',
        relyInit: true,
        title: '打印当前页',
        code: `GridManager.print('${gridManagerName}');`
    },
    showRow: {
        key: 'showRow',
        relyInit: true,
        title: '显示隐藏行',
        code: `GridManager.showRow('${gridManagerName}', 1);`
    },
    hideRow: {
        key: 'hideRow',
        relyInit: true,
        title: '隐藏行',
        code: `GridManager.hideRow('${gridManagerName}', 1);`
    },
    showLoading: {
        key: 'showLoading',
        relyInit: true,
        title: '显示加载中',
        code: `GridManager.showLoading('${gridManagerName}');`
    },
    hideLoading: {
        key: 'hideLoading',
        relyInit: true,
        title: '隐藏加载中',
        code: `GridManager.hideLoading('${gridManagerName}', 300);`
    },
    destroy: {
        key: 'destroy',
        relyInit: true,
        title: '消毁指定的GridManager实例',
        code: `GridManager.destroy('${gridManagerName}');`
    }
};
const demo1 = {
    /**
     * 初始化搜索区域
     */
    initSearch: function () {
        // 渲染下拉框
        var typeSelect = document.querySelector('.search-area select[name="type"]');

        for(let key in TYPE_MAP) {
            const option = document.createElement('option');
            option.value = key;
            option.innerText = TYPE_MAP[key];
            typeSelect.appendChild(option);
        }

        // 绑定搜索事件
        document.querySelector('.search-action').addEventListener('click', function () {
            var _query = {
                title: document.querySelector('[name="title"]').value,
                type: document.querySelector('[name="type"]').value,
                content: document.querySelector('[name="content"]').value
            };
            table.GM('setQuery', _query, function () {
                console.log('setQuery执行成功');
            });
        });

        // 绑定重置
        document.querySelector('.reset-action').addEventListener('click', function () {
            document.querySelector('[name="title"]').value = '';
            document.querySelector('[name="type"]').value = '-1';
            document.querySelector('[name="content"]').value = '';
        });
    },

    /**
     * 初始化方法区域
     */
    initFN: () => {
        const fnSelect = document.querySelector('.fn-select');
        const fnRun = document.querySelector('.fn-run');
        const fnCode = document.querySelector('.fn-code');
        const fnRunInfo = document.querySelector('.fn-run-info');

        // 渲染选择区域, instantiated: 是否已经实例化
        const renderSelect = instantiated => {
            let liStr = '<option value="-1">请选择方法</option>';
            for (let key in GM_PUBLISH_METHOD_MAP) {
                let fn = GM_PUBLISH_METHOD_MAP[key];
                let disabled = !instantiated && fn.relyInit  ? 'disabled' : '';
                liStr = `${liStr}<option value="${key}" ${disabled} title="${fn.title}">${key}</option>`;
            }
            fnSelect.innerHTML = liStr;
        };
        renderSelect(true);

        // bind input change event
        fnSelect.addEventListener('change', function () {
            fnCode.value = GM_PUBLISH_METHOD_MAP[this.value].code;
            fnRun.setAttribute('now-fun', this.value);
        });

        // bind run event
        fnRun.addEventListener('click', function () {
            if (!fnCode.value) {
                fnRunInfo.innerHTML = '请通过选择方法生成所需要执行的代码';
                return;
            }
            fnRunInfo.innerHTML = '';
            /* eslint-disable*/
            const log = eval(fnCode.value);
            const nowFn = fnRun.getAttribute('now-fun');
            console.group(nowFn);
            console.log(fnCode.value);
            console.log(log);
            console.groupEnd();
            try {
                if (nowFn === 'init') {
                    renderSelect(true);
                }
                if (nowFn === 'destroy') {
                    renderSelect(false);
                }

                fnRunInfo.innerHTML = `<span class="success-info">
                    <a href="http://gridmanager.lovejavascript.com/api/index.html#${nowFn}" target="_blank">${nowFn}</a>
                    执行成功, 请打开控制台查看具体信息
                </span>`;
            } catch (e) {
                fnRunInfo.innerHTML = `<span class="error-info">
                    <a href="http://gridmanager.lovejavascript.com/api/index.html#${nowFn}" target="_blank">${nowFn}</a>
                    执行失败, 请打开控制台查看具体信息
                </span>`;
                console.error('执行错误: ', e);
            }
        });
    },

    /**
     * 初始化表格
     */
    initGM: function () {
    	const arg = {
			gridManagerName: 'test',
			width: '100%',
			height: '100%',
			// minHeight: '400px',
			// 初始渲染时是否加载数据
			// firstLoading: false,

			// 启用虚拟滚动
			// virtualScroll: {
			// 	useVirtualScroll: true,
			// 	virtualNum: 20
			// },

			// supportAutoOrder: false,
			// 自动序号配置
			autoOrderConfig: {
				// width: 40,
				// 固定列
				fixed: 'left'
			},
			// supportCheckbox: false,
			// 选择框配置
			checkboxConfig: {
				// 使用单选
				// useRadio: true,

				// 使用行选中
				// useRowCheck: true,

				// 禁用状态保持
				// disableStateKeep: true,

				// width: 100,
				key: 'id',
				// 复选时最大可选数
				// max: 2,

				// 固定列
				fixed: 'left'
			},

			// 是否使用无总条数模式
			// useNoTotalsMode: true,
			// 是否开启分页
			supportAjaxPage: true,
			// 排序模式，single(升降序单一触发) overall(升降序整体触发)
			sortMode: 'single',

			// supportAdjust: false,
			// 是否开启配置功能
			// supportConfig: false,

			// 是否开启导出
			// supportExport: false,

			// 是否开启打印
			// supportPrint: false,

			// 右键菜单
			supportMenu: true,
			menuHandler: list => {
				list.unshift({
					content: '自定义菜单',
					line: true,
					onClick: _ => {
						alert(_);
					}
				});
				return list;
			},

			// 禁用分割线
			// disableLine: true,

			// 设置表头的icon图标是否跟随文本
			// isIconFollowText: true,

			// 组合排序
			// isCombSorting: true,

			// 合并排序
			// mergeSort: true,

			// 禁用边框线
			// disableBorder: true,

			// 使用单元格触焦高亮样式
			useCellFocus: true,

			// 使用行隐藏功能
			useHideRow: true,

			// 行移动
			supportMoveRow: true,
			moveRowConfig: {
				key: 'priority',
				useSingleMode: true,
				fixed: 'left',
				handler: (list, tableData) => {
					console.log(list, tableData);
				}
			},
			summaryHandler: function(data) {
				let readNumber = 0;
				data.forEach(item => {
					readNumber += item.readNumber;
				});
				return {
					pic: '共计',
					readNumber
				};
			},

			// 禁用缓存
			disableCache: false,
			ajaxData: function (settings, params) {
				document.querySelector('[name="type"]').value = params.type || -1;
				return 'https://www.lovejavascript.com/blogManager/getBlogList';
			},

			// 导出配置
			exportConfig: {
				fileName: query => {
					const date = new Date();
					let fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
					for (let key in query) {
						fileName = `${fileName}-${key}=${query[key]}`;
					}
					return fileName;
				},
				suffix: 'xls'
			},
			ajaxType: 'POST',

			// 选择事件执行前事件
			checkedBefore: function (checkedList, isChecked, row) {
				console.log('checkedBefore==', checkedList, isChecked, row);
				if (row && row.id === 90) {
					alert('该节点在checkedBefore中配置为不可选');
				}
				return row && row.id !== 90;
			},

			// 选择事件执行后事件
			checkedAfter: function (checkedList, isChecked, row) {
				console.log('checkedAfter==', checkedList, isChecked, row);
			},

			// 全选事件执行前事件
			checkedAllBefore: function (checkedList, isChecked) {
				console.log('checkedAllBefore==', checkedList, isChecked);
				//
				// if (isChecked) {
				//     alert('不能取消全选');
				// }
				// return !isChecked;
			},

			// 全选事件执行后事件
			checkedAllAfter: function (checkedList, isChecked) {
				console.log('checkedAllAfter==', checkedList, isChecked);
			},

			// 执行排序前事件
			sortingBefore: function (query) {
				console.log('sortingBefore', query);
			},

			// 排行排序后事件
			sortingAfter: function (query) {
				console.log('sortingAfter', query);
			},

			// AJAX请求前事件函数
			ajaxBeforeSend: function (promise) {
				console.log('ajaxBeforeSend');
			},
			// AJAX成功事件函数
			ajaxSuccess: function (response) {
				console.log('ajaxSuccess');
			},

			// AJAX失败事件函数
			ajaxError: function (errorInfo) {
				console.log('ajaxError');
			},

			// AJAX结束事件函数
			ajaxComplete: function (complete) {
				console.log('ajaxComplete');
			},
			adjustBefore: eve => {
				console.log('adjustBefore=>', eve);
			},
			adjustAfter: eve => {
				console.log('adjustAfter=>', eve);
			},

			// 执行请求后执行程序
			responseHandler: res => {
				res.data.forEach(item => {
					// 用id模拟优先级字段
					item.priority = item.id;
				});
				return res;
			},

			// 单行数据渲染时执行程序
			rowRenderHandler: (row, index) => {
				// if (row.id === 90) {
				//     row.gm_checkbox = true;
				// }

				// 指定第92行不可选中
				// if (row.id === 92) {
				//         // row.gm_checkbox = true;
				//     row.gm_checkbox_disabled = true;
				//     row.gm_row_class_name = 'test-row-class';
				// }
				return row;
			},

			emptyTemplate: settings => {
				return `<div style="text-align: center;">${settings.query.title ? '搜索为空' : '暂无数据'}</div>`;
			},
			// 单个td的click事件
			// cellClick: (row, rowIndex, colIndex) => {
			//     console.log(row, rowIndex, colIndex);
			//     return {
			//         text: '这里有个提示',
			//         position: 'left'
			//     };
			// },
			// rowHover: (a, b, c) => {
			//     return {
			//         text: '这里有个提示',
			//         position: 'right'
			//     };
			// },
			// useWordBreak: true,
			columnData: [
				{
					key: 'pic',
					remind: {
						text: '这一列显示了缩略图，可以通过点击跳转至对应的博客地址',
						style: {
							'color': 'yellow'
						}
					},
					width: '140',
					align: 'center',
					text: '缩略图',
					disableMoveRow: true,
					// 使用函数返回 dom node
					template: function (pic, row) {
						var picNode = document.createElement('a');
						picNode.setAttribute('href', `https://www.lovejavascript.com/#!zone/blog/content.html?id=${row.id}`);
						picNode.setAttribute('title', row.title);
						picNode.setAttribute('target', '_blank');
						picNode.title = `点击阅读[${row.title}]`;
						picNode.style.display = 'block';
						picNode.style.height = '58.5px';

						var imgNode = document.createElement('img');
						imgNode.style.width = '90px';
						imgNode.style.margin = '0 auto';
						imgNode.alt = row.title;
						imgNode.src = `https://www.lovejavascript.com/${pic}`;

						picNode.appendChild(imgNode);
						return picNode;
					}
				}, {
					key: 'title',
					remind: 'the title',
					text: '标题',
					sorting: '',
					disableMoveRow: true,
					// 使用函数返回 dom node
					template: function (title, row) {
						var titleNode = document.createElement('a');
						titleNode.setAttribute('href', `https://www.lovejavascript.com/#!zone/blog/content.html?id=${row.id}`);
						titleNode.setAttribute('title', title);
						titleNode.setAttribute('target', '_blank');
						titleNode.innerText = title;
						titleNode.title = `点击阅读[${row.title}]`;
						titleNode.classList.add('plugin-action');
						return titleNode;
					}
				}, {
					key: 'readNumber',
					text: '阅读量'
				}, {
					key: 'type',
					remind: {
						text: '[HTML/CSS, nodeJS, javaScript, 前端鸡汤, PM Coffee, 前端框架, 前端相关]',
						style: {
							width: '300px',
							'text-align': 'left'
						}
					},
					text: '博文分类',
					align: 'left',
					width: '150px',
					sorting: '',
					disableMoveRow: true,
					// 表头筛选条件, 该值由用户操作后会将选中的值以{key: value}的形式覆盖至query参数内。非必设项
					filter: {
						// 筛选条件列表, 数组对象。格式: [{value: '1', text: 'HTML/CSS'}],在使用filter时该参数为必设项。
						option: [
							{value: '1', text: 'HTML/CSS'},
							{value: '2', text: 'nodeJS'},
							{value: '3', text: 'javaScript'},
							{value: '4', text: '前端鸡汤'},
							{value: '5', text: 'PM Coffee'},
							{value: '6', text: '前端框架'},
							{value: '7', text: '前端相关'}
						],
						// 筛选选中项，字符串, 未存在选中项时设置为''。 在此设置的选中的过滤条件将会覆盖query
						selected: '3',
						// 否为多选, 布尔值, 默认为false。非必设项
						isMultiple: false
					},
					template: function (type, row) {
						return TYPE_MAP[type];
					}
				}, {
					key: 'info',
					remind: 'the info',
					width: '100px',
					text: '简介',
					disableMoveRow: true
				}, {
					key: 'username',
					remind: 'the username',
					align: 'center',
					width: '100px',
					text: '作者',
					disableMoveRow: true,
					template: (username, row) => {
						return `<a class="plugin-action" href="https://github.com/baukh789" target="_blank" ${row.id} title="去看看${username}的github">${username}</a>`;
					}
				}, {
					key: 'createDate',
					width: '130px',
					text: '创建时间',
					sorting: 'DESC',
					align: 'left',
					// 使用函数返回 htmlString
					template: (createDate, row) => {
						return new Date(createDate).toLocaleDateString();
					}
				}, {
					key: 'lastDate',
					width: '130px',
					text: '最后修改时间',
					merge: 'text',
					sorting: '',
					// 使用函数返回 htmlString
					template: function (lastDate, row) {
						return new Date(lastDate).toLocaleDateString();
					}
				},
				{
					key: 'priority',
					text: '优先级',
					// fixed: 'right',
					align: 'right',
					width: '100px'
				},
				{
					key: 'action',
					remind: 'the action',
					width: '100px',
					align: 'center',
					fixed: 'right',
					disableMoveRow: true,
					disableRowCheck: true,
					text: '<span style="color: red">操作</span>',
					// 直接返回 通过函数返回
					template: (action, row) => {
						return `<span class="plugin-action" data-id="${row.id}" onclick="demo1.editRowData(this)">修改</span>`;
					}
				}
			]
		};
        new window.GridManager(table, arg, query => {
            // 渲染完成后的回调函数
            console.log('渲染完成后的回调函数:', query);
        });

        /**
		console.group('5秒后将更新以下内容');
		console.log('1.pic列被移除');
		console.log('2.title列被更名为: 标题(已更名)');
		console.log('3.type列表头提醒: 提醒变了');
		console.log('4.type列表过滤功能关闭');
		console.log('5.username 与 info 列更换位置');
		console.log('6.新增了两列');
		console.groupEnd();

		setTimeout(() => {
			console.log('开始执行了');
			arg.columnData.shift();
			const col3 = arg.columnData[3];
			arg.columnData[0].text = '标题(已更名)';
			arg.columnData[2].text = '测试中的列';
			arg.columnData[2].remind = '提醒变了';
			arg.columnData[2].filter = undefined;
			arg.columnData[3] = arg.columnData[4];
			arg.columnData[4] = col3;
			arg.columnData.push({
				key: 'l1',
				width: 100,
				text: '新增的 l1',
				fixed: 'right'
			});
			arg.columnData.push({
				key: 'l2',
				width: 100,
				text: '新增的 l2',
				fixed: 'right'
			});
			console.log(arg.columnData[3]);
			GridManager.renderGrid('test', arg.columnData);
		}, 5000);
		 **/
    },

    /**
     * 编辑功能
     */
    editRowData: function (dom) {
        window.GridManager.updateRowData('test', 'id', {id: window.parseInt(dom.getAttribute('data-id')), lastDate: new Date().getTime()});
    }
};

// GridManager 渲染
const table = document.querySelector('table');
demo1.initSearch(table);
demo1.initGM(table);
demo1.initFN();

