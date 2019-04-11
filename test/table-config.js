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
            __width: null,
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
            'text': '<span style=\'color: red\'>操作</span>',
            'isShow': true,
            'index': 9,
            '__width': '100px',
            '__isShow': true
        }
    };
}
