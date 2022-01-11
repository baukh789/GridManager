import sort from '../../src/module/sort';

describe('sort', () => {
    describe('createHtml', () => {
        let htmlStr = null;
        beforeEach(() => {
        });
        afterEach(() => {
            htmlStr = null;
        });

        it('执行验证: 无排序', () => {
            htmlStr = `<div class="gm-sorting-action">
                        <i class="sa-icon sa-up gm-icon gm-icon-up"></i>
                        <i class="sa-icon sa-down gm-icon gm-icon-down"></i>
                    </div>`.replace(/\s/g, '');
            expect(sort.createHtml({type: '', sortUpText: 'ASC', sortDownText: 'DESC'}).replace(/\s/g, '')).toBe(htmlStr);
        });
		it('执行验证: 向上排序', () => {
			htmlStr = `<div class="gm-sorting-action sorting-up">
                        <i class="sa-icon sa-up gm-icon gm-icon-up"></i>
                        <i class="sa-icon sa-down gm-icon gm-icon-down"></i>
                    </div>`.replace(/\s/g, '');
			expect(sort.createHtml({type: 'ASC', sortUpText: 'ASC', sortDownText: 'DESC'}).replace(/\s/g, '')).toBe(htmlStr);
		});
		it('执行验证: 向下排序', () => {
			htmlStr = `<div class="gm-sorting-action sorting-down">
                        <i class="sa-icon sa-up gm-icon gm-icon-up"></i>
                        <i class="sa-icon sa-down gm-icon gm-icon-down"></i>
                    </div>`.replace(/\s/g, '');
			expect(sort.createHtml({type: 'DESC', sortUpText: 'ASC', sortDownText: 'DESC'}).replace(/\s/g, '')).toBe(htmlStr);
		});
    });
});
