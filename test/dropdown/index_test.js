import dropdown from '@module/dropdown';

describe('dropdown', () => {
    describe('createHtml', () => {
        let settings = null;
        let str = null;
        beforeEach(() => {
        });
        afterEach(() => {
            settings = null;
            str = null;
        });

        it('基础验证', () => {
            expect(dropdown.createHtml).toBeDefined();
            expect(dropdown.createHtml.length).toBe(1);
        });

        it('执行验证', () => {
            settings = {
                sizeData: [10, 20, 50, 100]
            };
            str = `
            <div class="gm-dropdown">
                <span class="gm-dropdown-text"></span>
                <span class="gm-dropdown-icon"></span>
                <ul class="gm-dropdown-list">
                    <li value="10">10</li>
                    <li value="20">20</li>
                    <li value="50">50</li>
                    <li value="100">100</li>          
                </ul>
            </div>`;
            expect(dropdown.createHtml(settings).replace(/\s/g, '')).toBe(str.replace(/\s/g, ''));
        });
    });
});
