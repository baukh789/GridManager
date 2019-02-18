import Filter from '../src/js/Filter';
import { Base } from '../src/js/Base';
import { Settings, TextSettings} from '../src/js/Settings';
import I18n from "../src/js/I18n";

/**
 * 验证类的属性及方法总量
 */
describe('Filter 验证类的属性及方法总量', function() {
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
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Filter)))).toBe(5 + 1);
    });
});

describe('Filter.enable', function() {
    it('初始值验证', function() {
        expect(Filter.enable).toBeDefined();
        expect(Filter.enable).toBe(false);
    });
});

describe('Filter.init($table)', function() {
    it('基础验证', function() {
        expect(Filter.init).toBeDefined();
        expect(Filter.init.length).toBe(1);
    });
});

describe('Filter.createHtml(settings, filter, tableWarpHeight)', function() {
    it('基础验证', function() {
        expect(Filter.createHtml).toBeDefined();
        expect(Filter.createHtml.length).toBe(3);
    });

    it('返回值验证[单选框形式]', function() {
        let settings = new Settings();
        settings.textConfig = new TextSettings();
        settings.gridManagerName = 'test-filter';
        let filter = {
            option: [
                {value: '1', text: 'HTML/CSS'},
                {value: '2', text: 'nodeJS'}
            ],
            // 选中的过滤条件将会覆盖query
            selected: '1',
            isMultiple: false
        };
        let FilterHtml = `<div class="filter-action">
                            <i class="fa-icon iconfont icon-filter filter-selected"></i>
                            <div class="fa-con">
                                <ul class="filter-list" style="max-height: 400px">
                                    <li class="filter-radio">${Base.getRadioString(true, 'HTML/CSS', '1')}</li>
                                    <li class="filter-radio">${Base.getRadioString(false, 'nodeJS', '2')}</li>
                                </ul>
                                <div class="filter-bottom">
                                    <span class="filter-button filter-submit">${I18n.i18nText(settings, 'filter-ok')}</span>
                                    <span class="filter-button filter-reset">${I18n.i18nText(settings, 'filter-reset')}</span>
                                </div>
                            </div>
                        </div>`;

        expect(Filter.createHtml(settings, filter, 500).replace(/\s/g, '')).toBe(FilterHtml.replace(/\s/g, ''));
        settings = null;
        filter = null;
        FilterHtml = null;
    });

    it('返回值验证[复选框形式]', function() {
        let settings = new Settings();
        settings.textConfig = new TextSettings();
        settings.gridManagerName = 'test-filter';
        let filter = {
            option: [
                {value: '1', text: 'HTML/CSS'},
                {value: '2', text: 'nodeJS'}
            ],
            // 选中的过滤条件将会覆盖query
            selected: '1',
            isMultiple: true
        };
        let FilterHtml = `<div class="filter-action">
                            <i class="fa-icon iconfont icon-filter filter-selected"></i>
                            <div class="fa-con">
                                <ul class="filter-list" style="max-height: 400px">
                                    <li class="filter-checkbox">${Base.getCheckboxString('checked', 'HTML/CSS', '1')}</li>
                                    <li class="filter-checkbox">${Base.getCheckboxString('unchecked', 'nodeJS', '2')}</li>
                                </ul>
                                <div class="filter-bottom">
                                    <span class="filter-button filter-submit">${I18n.i18nText(settings, 'filter-ok')}</span>
                                    <span class="filter-button filter-reset">${I18n.i18nText(settings, 'filter-reset')}</span>
                                </div>
                            </div>
                        </div>`;

        expect(Filter.createHtml(settings, filter, 500).replace(/\s/g, '')).toBe(FilterHtml.replace(/\s/g, ''));
        settings = null;
        filter = null;
        FilterHtml = null;
    });
});

describe('Filter.update($table)', function() {
    it('基础验证', function() {
        expect(Filter.update).toBeDefined();
        expect(Filter.update.length).toBe(2);
    });
});

describe('Filter.__bindFilterEvent($table)', function() {
    it('基础验证', function() {
        expect(Filter.__bindFilterEvent).toBeDefined();
        expect(Filter.__bindFilterEvent.length).toBe(1);
    });
});

describe('Filter.destroy($table)', function() {
    it('基础验证', function() {
        expect(Filter.destroy).toBeDefined();
        expect(Filter.destroy.length).toBe(1);
    });
});
