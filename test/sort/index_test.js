import sort from '../../src/module/sort';

describe('sort', () => {
    describe('createHtml', () => {
        let htmlStr = null;
        beforeEach(() => {
        });
        afterEach(() => {
            htmlStr = null;
        });

        it('执行验证', () => {
            htmlStr = `<div class="gm-sorting-action">
                        <i class="sa-icon sa-up gm-icon gm-icon-up"></i>
                        <i class="sa-icon sa-down gm-icon gm-icon-down"></i>
                    </div>`.replace(/\s/g, '');
            expect(sort.createHtml().replace(/\s/g, '')).toBe(htmlStr);
        });
    });
});
