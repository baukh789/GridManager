
import TextConfig from '../../src/module/i18n/config';
describe('textConfig', () => {
    let textConfig = null;
    beforeEach(() => {
        textConfig = new TextConfig();
    });
    afterEach(() => {
        textConfig = null;
    });
    it('验证国际化文本总数', () => {
        expect(Object.keys(textConfig).length).toBe(16);
    });
    it('验证国际化文本[order-text]初始值', () => {
        expect(textConfig['order-text']['zh-cn']).toBe('序号');
        expect(textConfig['order-text']['zh-tw']).toBe('序號');
        expect(textConfig['order-text']['en-us']).toBe('order');
    });

    it('验证国际化文本[first-page]初始值', () => {
        expect(textConfig['first-page']['zh-cn']).toBe('首页');
        expect(textConfig['first-page']['zh-tw']).toBe('首頁');
        expect(textConfig['first-page']['en-us']).toBe('first');
    });

    it('验证国际化文本[previous-page]初始值', () => {
        expect(textConfig['previous-page']['zh-cn']).toBe('上一页');
        expect(textConfig['previous-page']['zh-tw']).toBe('上一頁');
        expect(textConfig['previous-page']['en-us']).toBe('previous');
    });

    it('验证国际化文本[next-page]初始值', () => {
        expect(textConfig['next-page']['zh-cn']).toBe('下一页');
        expect(textConfig['next-page']['zh-tw']).toBe('下一頁');
        expect(textConfig['next-page']['en-us']).toBe('next');
    });

    it('验证国际化文本[last-page]初始值', () => {
        expect(textConfig['last-page']['zh-cn']).toBe('尾页');
        expect(textConfig['last-page']['zh-tw']).toBe('尾頁');
        expect(textConfig['last-page']['en-us']).toBe('last');
    });

    it('验证国际化文本[checked-info]初始值', () => {
        expect(textConfig['checked-info']['zh-cn']).toBe('已选 {0} 条');
        expect(textConfig['checked-info']['zh-tw']).toBe('已選 {0} 條');
        expect(textConfig['checked-info']['en-us']).toBe('selected {0}');
    });

    it('验证国际化文本[page-info]初始值', () => {
        expect(textConfig['page-info']['zh-cn']).toBe('此页显示 {0}-{1}<span class="page-info-totals"> 共{2}条</span>');
        expect(textConfig['page-info']['zh-tw']).toBe('此頁顯示 {0}-{1}<span class="page-info-totals"> 共{2}條</span>');
        expect(textConfig['page-info']['en-us']).toBe('this page show {0}-{1}<span class="page-info-totals"> count {2}</span>');
    });

    it('验证国际化文本[goto-first-text]初始值', () => {
        expect(textConfig['goto-first-text']['zh-cn']).toBe('跳转至');
        expect(textConfig['goto-first-text']['zh-tw']).toBe('跳轉至');
        expect(textConfig['goto-first-text']['en-us']).toBe('goto');
    });

    it('验证国际化文本[goto-last-text]初始值', () => {
        expect(textConfig['goto-last-text']['zh-cn']).toBe('页');
        expect(textConfig['goto-last-text']['zh-tw']).toBe('頁');
        expect(textConfig['goto-last-text']['en-us']).toBe('page');
    });

    it('验证国际化文本[refresh]初始值', () => {
        expect(textConfig['refresh']['zh-cn']).toBe('重新加载');
        expect(textConfig['refresh']['zh-tw']).toBe('重新加載');
        expect(textConfig['refresh']['en-us']).toBe('Refresh');
    });

    it('验证国际化文本[export]初始值', () => {
        expect(textConfig['export']['zh-cn']).toBe('导出');
        expect(textConfig['export']['zh-tw']).toBe('導出');
        expect(textConfig['export']['en-us']).toBe('Export');
    });

    it('验证国际化文本[export-checked]初始值', () => {
        expect(textConfig['export-checked']['zh-cn']).toBe('导出选中项');
        expect(textConfig['export-checked']['zh-tw']).toBe('導出選中項');
        expect(textConfig['export-checked']['en-us']).toBe('Export selected');
    });

    it('验证国际化文本[config]初始值', () => {
        expect(textConfig['config']['zh-cn']).toBe('配置表');
        expect(textConfig['config']['zh-tw']).toBe('配置表');
        expect(textConfig['config']['en-us']).toBe('Setting Grid');
    });

    it('验证国际化文本[print]初始值', () => {
        expect(textConfig['print']['zh-cn']).toBe('打印');
        expect(textConfig['print']['zh-tw']).toBe('打印');
        expect(textConfig['print']['en-us']).toBe('Print');
    });

    it('验证国际化文本[ok]初始值', () => {
        expect(textConfig['ok']['zh-cn']).toBe('确定');
        expect(textConfig['ok']['zh-tw']).toBe('確定');
        expect(textConfig['ok']['en-us']).toBe('OK');
    });

    it('验证国际化文本[reset]初始值', () => {
        expect(textConfig['reset']['zh-cn']).toBe('重置');
        expect(textConfig['reset']['zh-tw']).toBe('重置');
        expect(textConfig['reset']['en-us']).toBe('Reset');
    });
});
