/**
 * 获取test中使用到的 columnMap
 * @returns {{gm_checkbox: {key: string, text: string, isAutoCreate: boolean, isShow: boolean, disableCustomize: boolean, width: string, align: string, index: number, __width: string, __isShow: boolean}, gm_order: {key: string, text: string, isAutoCreate: boolean, isShow: boolean, disableCustomize: boolean, width: string, align: string, index: number, __width: string, __isShow: boolean}, pic: {key: string, remind: string, width: string, align: string, text: string, isShow: boolean, index: number, __width: string, __isShow: boolean}, title: {key: string, remind: string, align: string, text: string, sorting: string, isShow: boolean, index: number, __isShow: boolean, width: string}, type: {key: string, remind: string, text: string, align: string, width: string, sorting: string, filter: {option: *[], selected: string, isMultiple: boolean}, isShow: boolean, index: number, __width: string, __isShow: boolean}, info: {key: string, remind: string, width: string, text: string, isShow: boolean, index: number, __width: string, __isShow: boolean}, username: {key: string, remind: string, align: string, width: string, text: string, isShow: boolean, index: number, __width: string, __isShow: boolean}, createDate: {key: string, width: string, text: string, sorting: string, isShow: boolean, index: number, __width: string, __isShow: boolean}, lastDate: {key: string, width: string, text: string, sorting: string, isShow: boolean, index: number, __width: string, __isShow: boolean}, action: {key: string, remind: string, width: string, align: string, disableCustomize: boolean, text: string, isShow: boolean, index: number, __width: string, __isShow: boolean}}}
 */
export function getColumnMap() {
    return {
        'gm_checkbox': {
            'key': 'gm_checkbox',
            'text': '',
            'isAutoCreate': true,
            'isShow': true,
            'disableCustomize': true,
            'width': '40px',
            'align': 'center',
            'index': 0,
            '__width': '40px',
            '__isShow': true
        },
        'gm_order': {
            'key': 'gm_order',
            'text': '序号',
            'isAutoCreate': true,
            'isShow': true,
            'disableCustomize': true,
            'width': '50px',
            'align': 'center',
            'index': 1,
            '__width': '50px',
            '__isShow': true
        },
        'pic': {
            'key': 'pic',
            'remind': 'the pic',
            'width': '110px',
            'align': 'center',
            'text': '缩略图',
            'isShow': true,
            'index': 2,
            '__width': '110px',
            '__isShow': true
        },
        'title': {
            'key': 'title',
            'remind': 'the title',
            'width': '508px',
            'align': 'left',
            'text': '标题',
            'sorting': '',
            'isShow': true,
            'index': 3,
            '__isShow': true
        },
        'type': {
            'key': 'type',
            'remind': 'the type',
            'text': '博文分类',
            'align': 'center',
            'width': '150px',
            'sorting': '',
            'filter': {
                'option': [{
                    'value': '1',
                    'text': 'HTML/CSS'
                }, {
                    'value': '2',
                    'text': 'nodeJS'
                }, {
                    'value': '3',
                    'text': 'javaScript'
                }, {
                    'value': '4',
                    'text': '前端鸡汤'
                }, {
                    'value': '5',
                    'text': 'PM Coffee'
                }, {
                    'value': '6',
                    'text': '前端框架'
                }, {
                    'value': '7',
                    'text': '前端相关'
                }],
                'selected': '3',
                'isMultiple': true
            },
            'isShow': true,
            'index': 4,
            '__width': '150px',
            '__isShow': true
        },
        'info': {
            'key': 'info',
            'remind': 'the info',
            'width': '100px',
            'text': '简介',
            'isShow': true,
            'index': 5,
            '__width': '100px',
            '__isShow': true
        },
        'username': {
            'key': 'username',
            'remind': 'the username',
            'align': 'center',
            'width': '100px',
            'text': '作者',
            'isShow': true,
            'index': 6,
            '__width': '100px',
            '__isShow': true
        },
        'createDate': {
            'key': 'createDate',
            'width': '130px',
            'text': '创建时间',
            'sorting': 'DESC',
            'isShow': true,
            'index': 7,
            '__width': '130px',
            '__isShow': true
        },
        'lastDate': {
            'key': 'lastDate',
            'width': '130px',
            'text': '最后修改时间',
            'sorting': '',
            'isShow': true,
            'index': 8,
            '__width': '130px',
            '__isShow': true
        },
        'action': {
            'key': 'action',
            'remind': 'the action',
            'width': '100px',
            'align': 'center',
            'disableCustomize': true,
            'text': '<span style="color: red">操作</span>',
            'isShow': true,
            'index': 9,
            '__width': '100px',
            '__isShow': true
        }
    };
}

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

/**
 * 获取test中使用到的 columnData
 * @returns {*[]}
 */
export function getColumnData() {
    return [
        {
            key: 'pic',
            remind: 'the pic',
            width: '110px',
            align: 'center',
            text: '缩略图',
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
            align: 'left',
            text: '标题',
            sorting: '',
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
            key: 'type',
            remind: 'the type',
            text: '博文分类',
            align: 'center',
            width: '150px',
            sorting: '',
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
                isMultiple: true
            },
            template: function (type, row) {
                return TYPE_MAP[type];
            }
        }, {
            key: 'info',
            remind: 'the info',
            width: '100px',
            text: '简介'
        }, {
            key: 'username',
            remind: 'the username',
            align: 'center',
            width: '100px',
            text: '作者',
            template: username => {
                return `<a class="plugin-action" href="https://github.com/baukh789" target="_blank" title="去看看${username}的github">${username}</a>`;
            }
        }, {
            key: 'createDate',
            width: '130px',
            text: '创建时间',
            sorting: 'DESC',
            // 使用函数返回 htmlString
            template: (createDate, row) => {
                return new Date(createDate).toLocaleDateString();
            }
        }, {
            key: 'lastDate',
            width: '130px',
            text: '最后修改时间',
            sorting: '',
            // 使用函数返回 htmlString
            template: function (lastDate, row) {
                return new Date(lastDate).toLocaleDateString();
            }
        }, {
            key: 'action',
            remind: 'the action',
            width: '100px',
            align: 'center',
            disableCustomize: true,
            text: '<span style="color: red">操作</span>',
            // 直接返回 通过函数返回
            template: (action, row) => {
                return '<span class="plugin-action">删除</span>';
            }
        }
    ];
}
