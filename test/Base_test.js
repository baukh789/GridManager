'use strict';
import { jTool, Base } from '../src/js/Base';
import { CONSOLE_STYLE } from '../src/common/constants';
/**
 * 验证类的属性及方法总量
 */
describe('Base 验证类的属性及方法总量', function() {
	var getPropertyCount = null;
	beforeEach(function() {
		getPropertyCount = function(o){
			var n, count = 0;
			for(n in o){
				if(o.hasOwnProperty(n)){
					count++;
				}
			}
			return count;
		}
	});
	afterEach(function(){
		getPropertyCount = null;
	});
	it('Function count', function() {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Base)))).toBe(25 + 1);
	});
});


describe('Base.getKey($table)', function() {
	let table = null;
	beforeEach(function(){
		table = document.createElement('table');
	});

	afterEach(function(){
		table = null;
	});

	it('基础验证', function () {
		expect(Base.getKey).toBeDefined();
		expect(Base.getKey.length).toBe(1);
	});

	it('返回值验证', function () {
		table.setAttribute('grid-manager', 'hello-gm');
		expect(Base.getKey(jTool(table))).toBe('hello-gm');
	});
});


describe('Base.fakeTheadAttr', function() {
	it('基础验证', function () {
		expect(Base.fakeTheadAttr).toBeDefined();
        expect(Base.fakeTheadAttr).toBe('grid-manager-mock-thead');
	});
});

describe('Base.getEmptyHtml(visibleNum, emptyTemplate)', function() {
	let emptyTemplate = null;
	beforeEach(function(){
	});

	afterEach(function(){
		emptyTemplate = null;
	});

	it('基础验证', function () {
		expect(Base.getEmptyHtml).toBeDefined();
		expect(Base.getEmptyHtml.length).toBe(2);
	});

	it('返回值验证', function () {
		// 参数正常
		emptyTemplate = `<tr emptyTemplate>
							<td colspan="3">
								<p>返回为空</p>
							</td>
						</tr>`;
		expect(Base.getEmptyHtml(3, '<p>返回为空</p>').replace(/\s/g, '')).toBe(emptyTemplate.replace(/\s/g, ''));

		// 不传递参数
		emptyTemplate = `<tr emptyTemplate>
							<td colspan="1">
							</td>
						</tr>`;
		expect(Base.getEmptyHtml().replace(/\s/g, '')).toBe(emptyTemplate.replace(/\s/g, ''));
	});
});

describe('Base.updateEmptyCol($table)', function() {
	let table = null;
	let $table = null;
	let colspan = null;
	beforeEach(function(){
	});

	afterEach(function(){
		table = null;
		$table = null;
		colspan = null;
		document.body.innerHTML = '';
	});

	it('基础验证', function () {
		expect(Base.updateEmptyCol).toBeDefined();
		expect(Base.updateEmptyCol.length).toBe(1);
	});

	it('当前数据为空', function () {
		table = `<table grid-manager="test">
					<thead grid-manager-thead>
						<tr>
						<th th-name="th-one" th-visible="visible">th-one</th>
						<th th-name="th-two" th-visible="visible">th-two</th>
						<th th-name="th-three">th-three</th>
						</tr>
					</thead>
						<tr emptyTemplate>
							<td></td>
						</tr>
					<tbody>
					
					</tbody>
				</table>`;
		document.body.innerHTML = table;
		$table = jTool('table[grid-manager="test"]');
		colspan = jTool('tr[emptyTemplate] td', $table).attr('colspan');
		expect(colspan).toBeUndefined();
		Base.updateEmptyCol($table);
		colspan = jTool('tr[emptyTemplate] td', $table).attr('colspan');
		expect(colspan).toBe('2');
	});

	it('当前数据不为空', function () {
		table = `<table grid-manager="test">
					<thead>
						<tr>
						<th th-name="th-one" th-visible="visible">th-one</th>
						<th th-name="th-two" th-visible="visible">th-two</th>
						<th th-name="th-three">th-three</th>
						</tr>
					</thead>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
						</tr>
					<tbody>
					
					</tbody>
				</table>`;
		document.body.innerHTML = table;
		$table = jTool('table[grid-manager="test"]');
		expect(jTool('tr[emptyTemplate] td', $table).length).toBe(0);
		Base.updateEmptyCol($table);
		expect(jTool('tr[emptyTemplate] td', $table).length).toBe(0);
	});
});

describe('Base.outLog(msg, type)', function() {
	let table = null;
	let arg = null;
	beforeEach(function(){
		// 存储console, 用于在测方式完成后原还console对象
		console._log = console.log;
		console.log = jasmine.createSpy("log");

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterEach(function(){
		// 还原console
		console.log = console._log;

		document.body.innerHTML = '';
		table = null;
		arg = null;
	});

	it('基础验证', function(){
		expect(Base.outLog).toBeDefined();
		expect(Base.outLog.length).toBe(2);
	});

	it('info', function(){
		Base.outLog('hello GridManager', 'info');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c hello GridManager ', ...CONSOLE_STYLE.INFO);
	});

	it('warn', function(){
		Base.outLog('hello GridManager', 'warn');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c hello GridManager ', ...CONSOLE_STYLE.WARN);
	});

	it('error', function(){
		Base.outLog('hello GridManager', 'error');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c hello GridManager ', ...CONSOLE_STYLE.ERROR);
	});

	it('log', function(){
		Base.outLog('hello GridManager', 'log');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Log %c hello GridManager ', ...CONSOLE_STYLE.LOG);
	});

	it('undefined', function(){
		Base.outLog('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Log %c hello GridManager ', ...CONSOLE_STYLE.LOG);
	});
});

describe('Base.getColTd($th)', function() {
	let table = null;
	beforeEach(function(){
		// 注意: phatomejs 会将模版字符串中的字行编译为 Text(nodeType: 3), 所以在这里需要将th及td间的空格去除
		let table = `
				<table grid-manager="test-get-col-td">
					<thead>
						<tr><th id="th1">th1</th><th id="th2">th2</th></tr>
					</thead>
					<tbody>
						<tr><td id="td1">td1</td><td id="td2">td2</td></tr>
					</tbody>
				</table>
			`;
		document.body.innerHTML = table;
	});

	afterEach(function(){
		table = null;
		document.body.innerHTML = '';
	});

	it('基础验证', function () {
		expect(Base.getColTd).toBeDefined();
		expect(Base.getColTd.length).toBe(1);
	});

	it('返回值验证', function () {
		expect(Base.getColTd(jTool('#th2')).get(0)).toBe(document.querySelector('#td2'));
	});
});

describe('Base.setAreVisible($thList, isVisible, cb)', function() {
	it('基础验证', function () {
		expect(Base.setAreVisible).toBeDefined();
		expect(Base.setAreVisible.length).toBe(3);
	});
});

describe('Base.equal(obj1, obj2)', function() {
    it('基础验证', function () {
        expect(Base.equal).toBeDefined();
        expect(Base.equal.length).toBe(2);
    });

    it('返回值验证', function () {
        let obj1 = {a: 1, b: 2};
        let obj2 = {a: 1, b: 2};
        let obj3 = {a: 11, b: 22};
        expect(Base.equal(obj1, obj2)).toBe(true);
        expect(Base.equal(obj2, obj3)).toBe(false);
        expect(Base.equal(obj1, obj3)).toBe(false);

        obj1 = null;
        obj2 = null;
        obj3 = null;
    });
});

describe('Base.getObjectIndexToArray(arr, obj)', function() {
    it('基础验证', function () {
        expect(Base.getObjectIndexToArray).toBeDefined();
        expect(Base.getObjectIndexToArray.length).toBe(2);
    });

    it('返回值验证', function () {
        let arr = [{a:1, b:2}, {name:'baukh', age:31}, {name:'kouzi', age:28}];
        let obj = {name:'baukh', age:31};
        expect(Base.getObjectIndexToArray(arr, obj)).toBe(1);
    });
});

describe('Base.updateVisibleLast($table)', function() {
    it('基础验证', function () {
        expect(Base.updateVisibleLast).toBeDefined();
        expect(Base.updateVisibleLast.length).toBe(1);
    });
});

describe('Base.updateThWidth($table, settings, isInit)', function() {
    it('基础验证', function () {
        expect(Base.updateThWidth).toBeDefined();
        expect(Base.updateThWidth.length).toBe(3);
    });
});

describe('Base.getTextWidth(th, isIconFollowText)', function() {
	it('基础验证', function () {
		expect(Base.getTextWidth).toBeDefined();
		expect(Base.getTextWidth.length).toBe(2);
	});
});

describe('Base.showLoading($table, loadingTemplate, cb)', function() {
	beforeEach(function(){
	});

	afterEach(function(){
		document.body.innerHTML = '';
	});
	it('基础验证', function () {
		expect(Base.showLoading).toBeDefined();
		expect(Base.showLoading.length).toBe(3);
	});

	it('并不存在的dom', function () {
		expect(Base.showLoading(jTool('body-void'))).toBe(false);
	});

	it('无回调函数', function () {
		jasmine.clock().install();
		expect(Base.showLoading(jTool('body'))).toBe(true);
		jasmine.clock().tick(500);
		jasmine.clock().uninstall();
	});

	it('连续两次调用', function () {
		Base.showLoading(jTool('body'));
		expect(Base.showLoading(jTool('body'))).toBe(true);
	});

	it('回调函数是否执行', function () {
		jasmine.clock().install();
		let callback = jasmine.createSpy('callback');
		expect(Base.showLoading(jTool('body'), undefined, callback)).toBe(true);
		jasmine.clock().tick(100);
		expect(callback).toHaveBeenCalled();
		jasmine.clock().uninstall();
		callback = null;
	});
});

describe('Base.hideLoading(dom, cb)', function() {
	it('基础验证', function () {
		expect(Base.hideLoading).toBeDefined();
		expect(Base.hideLoading.length).toBe(2);
	});

	it('并不存在的dom', function () {
		expect(Base.hideLoading(jTool('body-void'))).toBe(false);
	});

	it('无回调函数', function () {
		jasmine.clock().install();
		expect(Base.hideLoading(jTool('body'))).toBe(true);
		jasmine.clock().tick(500);
		jasmine.clock().uninstall();
	});

	it('回调函数是否执行', function () {
		jasmine.clock().install();
		let callback = jasmine.createSpy('callback');
		expect(Base.hideLoading(jTool('body'), callback)).toBe(true);
		jasmine.clock().tick(500);
		expect(callback).toHaveBeenCalled();
		jasmine.clock().uninstall();
		callback = null;
	});
});

describe('Base.updateInteractive($table, interactive)', function() {
	let $table = null;
	let $tableWrap = null;
	beforeEach(function(){
		document.body.innerHTML = '<div class="table-wrap"><table></table></div>';
		$table = jTool('table');
		$tableWrap = $table.closest('.table-wrap');
	});

	afterEach(function(){
		document.body.innerHTML = '';
		$table = null;
		$tableWrap = null;
	});

	it('基础验证', function () {
		expect(Base.updateInteractive).toBeDefined();
		expect(Base.updateInteractive.length).toBe(2);
	});

	it('宽度交互', function () {
		Base.updateInteractive($table, 'Adjust');
		expect($tableWrap.attr('user-interactive')).toBe('Adjust');
	});

	it('位置交互', function () {
		Base.updateInteractive($table, 'Drag');
		expect($tableWrap.attr('user-interactive')).toBe('Drag');
	});

	it('无交互', function () {
		Base.updateInteractive($table);
		expect($tableWrap.attr('user-interactive')).toBeUndefined();
	});
});


describe('Base.updateScrollStatus($table)', function() {
	let $table = null;
	beforeEach(function(){
	});

	afterEach(function(){
		document.body.innerHTML = '';
		$table = null;
	});

	it('基础验证', function () {
		expect(Base.updateScrollStatus).toBeDefined();
		expect(Base.updateScrollStatus.length).toBe(1);
	});

	it('100%宽度', function () {
		document.body.innerHTML = '<div class="table-div"><table style="width: 100%"></table></div>';
		$table = jTool('table');
		expect(Base.updateScrollStatus($table)).toBe('hidden');
	});

	it('90%宽度', function () {
		document.body.innerHTML = '<div class="table-div"><table style="width: 90%"></table></div>';
		$table = jTool('table');
		expect(Base.updateScrollStatus($table)).toBe('hidden');
	});

    it('110%宽度', function () {
        document.body.innerHTML = '<div class="table-div"><table style="width:110%"></table></div>';
        $table = jTool('table');
        expect(Base.updateScrollStatus($table)).toBe('auto');
    });
});

describe('Base.getVisibleForColumn(col)', function() {
	let col = null;
	beforeEach(function(){
	});

	afterEach(function(){
		document.body.innerHTML = '';
		col = null;
	});

	it('基础验证', function () {
		expect(Base.getVisibleForColumn).toBeDefined();
		expect(Base.getVisibleForColumn.length).toBe(1);
	});

	it('isShow= true', function(){
		col = {isShow: true};
		expect(Base.getVisibleForColumn(col)).toBe('visible');
	});

	it('isShow= false', function(){
		col = {isShow: false};
		expect(Base.getVisibleForColumn(col)).toBe('none');
	});
});

describe('Base.cloneObject(object)', function() {
	let o1 = null;
	let o2 = null;
	beforeEach(function(){
	});

	afterEach(function(){
		o1 = null;
		o2 = null;
	});

	it('基础验证', function () {
		expect(Base.cloneObject).toBeDefined();
		expect(Base.cloneObject.length).toBe(1);
	});

	it('执行结果', function(){
		o1 = {name: 'cc', ename: 'baukh'};
		o2 = o1;
		expect(o2 === o1).toBe(true);
		expect(Base.cloneObject(o2).name === o1.name).toBe(true);
		expect(Base.cloneObject(o2) === o1).toBe(false);
	});
});

describe('Base.compileFramework(settings, compileList)', function() {
    let settings = null;
    let compileList = null;
    beforeEach(function(){
        compileList = [document.body];
        console._error = console.error;
        console.error = jasmine.createSpy("error");
    });

    afterEach(function(){
        settings = null;
        compileList = null;
        console.error = console._error;
    });

    it('基础验证', function () {
        expect(Base.compileFramework).toBeDefined();
        expect(Base.compileFramework.length).toBe(2);
    });

    it('执行验证', function () {
        // settings = {
        //     compileVue: jasmine.createSpy('callback')
        // };
        // expect(settings.compileVue).toHaveBeenCalled();
    });

    it('异常验证', function () {
        // settings = {
        //     compileVue: function() {
        //         throw new Error('返回一个错误');
        //     }
        // };
        // expect(Base.compileFramework(settings, compileList)).toEqual(new Promise());
    });
});

describe('Base.calcLayout($table, width, height, supportAjaxPage)', function() {
    let $table = null;
    let $tableWrap = null;
    let $tableDiv = null;
    let style = null;
    beforeEach(function(){
        document.body.innerHTML = ` <div class="table-wrap">
                                        <div class="table-div">
                                            <table id="test-calcLayout"></table>
                                        </div>
                                        <span class="text-dreamland"></span>
                                    </div>`;

        $table = jTool('#test-calcLayout');
        $tableWrap = $table.closest('.table-wrap');
        $tableDiv = jTool('.table-div', $tableWrap);
    });

    afterEach(function(){
        $table = null;
        $tableWrap = null;
        $tableDiv = null;
        style = null;
        document.body.innerHTML = '';
    });

    it('基础验证', function () {
        expect(Base.calcLayout).toBeDefined();
        expect(Base.calcLayout.length).toBe(1); // 应该是4个实参，height = '100%'不被认为是一个有效实参
    });

    it('验证百分比', function () {
        Base.calcLayout($table, '100%', '100%');
        style = $tableWrap.get(0).style;
        expect(style.width).toBe('calc(100%)');
        expect(style.height).toBe('calc(100%)');
    });

    it('验证像素', function () {
        Base.calcLayout($table, '1000px', '500px');
        style = $tableWrap.get(0).style;
        expect(style.width).toBe('calc(1000px)');
        expect(style.height).toBe('calc(500px)');
    });

    it('验证calc()', function () {
        Base.calcLayout($table, '100% - 100px', '100% + 100px');
        style = $tableWrap.get(0).style;
        expect(style.width).toBe('calc(100% - 100px)');
        expect(style.height).toBe('calc(100% + 100px)');
    });
});


describe('Base.getRadioString(checked, label, value)', function() {
    let expectStr = null;
    beforeEach(function(){
    });

    afterEach(function(){
        expectStr = null;
    });
    it('基础验证', function () {
        expect(Base.getRadioString).toBeDefined();
        expect(Base.getRadioString.length).toBe(3);
    });

    it('getRadioString(true)', function () {
        expectStr = `<label class="gm-radio-wrapper">
                        <span class="gm-radio-checkbox gm-radio gm-radio-checked">
                            <input type="radio" class="gm-radio-checkbox-input gm-radio-input" checked="true"/>
                            <span class="gm-radio-inner"></span>
                        </span>
                    </label>`;
        expect(Base.getRadioString(true).replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getRadioString(false)', function () {
        expectStr = `<label class="gm-radio-wrapper">
                        <span class="gm-radio-checkbox gm-radio">
                            <input type="radio" class="gm-radio-checkbox-input gm-radio-input"/>
                            <span class="gm-radio-inner"></span>
                        </span>
                    </label>`;
        expect(Base.getRadioString(false).replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getRadioString(false, "baukh")', function () {
        expectStr = `<label class="gm-radio-wrapper">
                        <span class="gm-radio-checkbox gm-radio">
                            <input type="radio" class="gm-radio-checkbox-input gm-radio-input"/>
                            <span class="gm-radio-inner"></span>
                        </span>
                        <span>baukh</span>
                    </label>`;
        expect(Base.getRadioString(false, 'baukh').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getRadioString(true, "baukh", "baukh")', function () {
        expectStr = `<label class="gm-radio-wrapper">
                        <span class="gm-radio-checkbox gm-radio gm-radio-checked">
                            <input type="radio" class="gm-radio-checkbox-input gm-radio-input" value="baukh" checked="true"/>
                            <span class="gm-radio-inner"></span>
                        </span>
                        <span>baukh</span>
                    </label>`;
        expect(Base.getRadioString(true, 'baukh', 'baukh').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });
});


describe('updateRadioState($radio, state)', function() {
    let $radio = null;
    beforeEach(function(){
        document.body.innerHTML = `<label class="gm-radio-wrapper">
                                    <span class="gm-radio-checkbox gm-radio" id="gm-radio">
                                        <input type="radio" class="gm-radio-checkbox-input gm-radio-input"/>
                                        <span class="gm-radio-inner"></span>
                                    </span>
                                </label>`;
        $radio = jTool('#gm-radio');
    });

    afterEach(function(){
        document.body.innerHTML = '';
        $radio = null;
    });
    it('基础验证', function () {
        expect(Base.updateRadioState).toBeDefined();
        expect(Base.updateRadioState.length).toBe(2);
    });

    it('执行updateRadioState($radio, true)', function () {
        Base.updateRadioState($radio, true);
        expect($radio.find('.gm-radio-input').get(0).checked).toBe(true);
        expect($radio.hasClass('gm-radio-checked')).toBe(true);
    });

    it('执行updateRadioState($radio, false)', function () {
        Base.updateRadioState($radio, false);
        expect($radio.find('.gm-radio-input').get(0).checked).toBe(false);
        expect($radio.hasClass('gm-radio-checked')).toBe(false);
    });
});


describe('Base.getCheckboxString(state, label, value)', function() {
    let expectStr = null;
    beforeEach(function(){
    });

    afterEach(function(){
        expectStr = null;
    });
    it('基础验证', function () {
        expect(Base.getCheckboxString).toBeDefined();
        expect(Base.getCheckboxString.length).toBe(3);
    });

    it('getCheckboxString("checked")', function () {
        expectStr = `<label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" checked="true"/>
                            <span class="gm-checkbox-inner"></span>
                        </span>
                    </label>`;
        expect(Base.getCheckboxString('checked').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getCheckboxString("indeterminate")', function () {
        expectStr = `<label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox gm-checkbox-indeterminate">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"/>
                            <span class="gm-checkbox-inner"></span>
                        </span>
                    </label>`;
        expect(Base.getCheckboxString('indeterminate').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getCheckboxString("unchecked")', function () {
        expectStr = `<label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"/>
                            <span class="gm-checkbox-inner"></span>
                        </span>
                    </label>`;
        expect(Base.getCheckboxString('unchecked').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getCheckboxString("unchecked, "baukh")', function () {
        expectStr = `<label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"/>
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        <span>baukh</span>
                    </label>`;
        expect(Base.getCheckboxString('unchecked', 'baukh').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getCheckboxString("unchecked, "baukh", "baukh")', function () {
        expectStr = `<label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="baukh"/>
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        <span>baukh</span>
                    </label>`;
        expect(Base.getCheckboxString('unchecked', 'baukh', 'baukh').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getCheckboxString("checked, "baukh", "baukh")', function () {
        expectStr = `<label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="baukh" checked="true"/>
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        <span>baukh</span>
                    </label>`;
        expect(Base.getCheckboxString('checked', 'baukh', 'baukh').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });

    it('getCheckboxString("indeterminate, "baukh", "baukh")', function () {
        expectStr = `<label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox gm-checkbox-indeterminate">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="baukh"/>
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        <span>baukh</span>
                    </label>`;
        expect(Base.getCheckboxString('indeterminate', 'baukh', 'baukh').replace(/\s/g, '')).toBe(expectStr.replace(/\s/g, ''));
    });
});

describe('updateCheckboxState($checkbox, state)', function() {
    let $checkbox = null;
    beforeEach(function(){
        document.body.innerHTML = `<label class="gm-checkbox-wrapper">
                                    <span class="gm-radio-checkbox gm-checkbox" id="gm-checkbox">
                                        <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"/>
                                        <span class="gm-checkbox-inner"></span>
                                    </span>
                                </label>`;
        $checkbox = jTool('#gm-checkbox');
    });

    afterEach(function(){
        document.body.innerHTML = '';
        $checkbox = null;
    });
    it('基础验证', function () {
        expect(Base.updateCheckboxState).toBeDefined();
        expect(Base.updateCheckboxState.length).toBe(2);
    });

    it('执行 updateCheckboxState($checkbox, "checked")', function () {
        Base.updateCheckboxState($checkbox, 'checked');
        expect($checkbox.find('.gm-checkbox-input').get(0).checked).toBe(true);
        expect($checkbox.hasClass('gm-checkbox-checked')).toBe(true);
        expect($checkbox.hasClass('gm-checkbox-indeterminate')).toBe(false);
    });

    it('执行 updateCheckboxState($checkbox, "indeterminate")', function () {
        Base.updateCheckboxState($checkbox, 'indeterminate');
        expect($checkbox.find('.gm-checkbox-input').get(0).checked).toBe(false);
        expect($checkbox.hasClass('gm-checkbox-checked')).toBe(false);
        expect($checkbox.hasClass('gm-checkbox-indeterminate')).toBe(true);
    });

    it('执行 updateCheckboxState($checkbox, "unchecked")', function () {
        Base.updateCheckboxState($checkbox, 'unchecked');
        expect($checkbox.find('.gm-checkbox-input').get(0).checked).toBe(false);
        expect($checkbox.hasClass('gm-checkbox-checked')).toBe(false);
        expect($checkbox.hasClass('gm-checkbox-indeterminate')).toBe(false);
    });
});
