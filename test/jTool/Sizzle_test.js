import Sizzle from '../../src/jTool/Sizzle';

describe('Sizzle', () => {

    let divEle = null;
    let divNodeList = null;
    let spanEle = null;

    let pEle = null;
    let spanEle2 = null;
    let jToolObj = null;
    let s = null;

    beforeEach(() => {
        document.body.innerHTML = '';
        divEle = document.createElement('div');
        divEle.id = 'div1';
        document.body.appendChild(divEle);
        divNodeList = document.querySelectorAll('div');

        spanEle = document.createElement('span');
        spanEle.id = 'span1';
        document.body.appendChild(spanEle);

        // ------- 构造父子嵌套结构 测试参数 context

        pEle = document.createElement('p');
        pEle.id = 'p1';
        spanEle2 = document.createElement('span');
        spanEle2.id = 'span2';
        pEle.appendChild(spanEle2);

        document.body.appendChild(pEle);
    });

    afterEach(() => {
        document.body.innerHTML = '';

        divEle = null;
        spanEle = null;
        divNodeList = null;

        pEle = null;
        spanEle2 = null;
        jToolObj = null;
        s = null;
    });

    it('测试 null', function () {
        s = new Sizzle(null);
        expect(s.DOMList).toBe(undefined);
        expect(s.length).toBe(0);
        expect(s.querySelector).toBe(null);
        expect(s.jTool).toBe(true);
    });

    it('测试 window', () => {
        s = new Sizzle(window);
        expect(s.DOMList).toEqual([window]);
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe(window);
        expect(s.jTool).toBe(true);
    });

    it('测试 document', () => {
        s = new Sizzle(document);
        expect(s.DOMList).toEqual([document]);
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe(document);
        expect(s.jTool).toBe(true);
    });

    it('测试 DOM', () => {
        s = new Sizzle(divEle);
        expect(s.DOMList).toEqual([divEle]);
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe(divEle);
        expect(s.jTool).toBe(true);
    });

    it('测试 NodeList', () => {
        s = new Sizzle(divNodeList);
        expect(s.DOMList).toEqual(divNodeList);
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe(divNodeList);
        expect(s.jTool).toBe(true);
    });


    it('测试 jTool 对象', () => {
        jToolObj = new Sizzle(divNodeList);
        s = new Sizzle(jToolObj);

        expect(s.DOMList).toBe(jToolObj.DOMList);
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe(jToolObj);
        expect(s.jTool).toBe(true);
    });

    it('测试 字符串 CSS 选择器', () => {
        s = new Sizzle('#div1');
        expect(s.DOMList[0].id).toBe('div1');
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe('#div1');
        expect(s.jTool).toBe(true);
    });

    it('测试 context 是 字符串 CSS 选择器', () => {
        s = new Sizzle('span', '#p1');
        expect(s.DOMList[0].id).toBe('span2');
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe('span');
        expect(s.jTool).toBe(true);
    });

    it('测试 context 是 DOM', () => {
        s = new Sizzle('span', pEle);
        expect(s.DOMList[0].id).toBe('span2');
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe('span');
        expect(s.jTool).toBe(true);
    });

    it('测试 context 是 NodeList', () => {
        s = new Sizzle('span', document.querySelectorAll('p'));
        expect(s.DOMList[0].id).toBe('span2');
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe('span');
        expect(s.jTool).toBe(true);
    });

    it('测试 context 是 jTool 对象', () => {
        jToolObj = new Sizzle('#p1');
        s = new Sizzle('span', jToolObj);
        expect(s.DOMList[0].id).toBe('span2');
        expect(s.length).toBe(1);
        expect(s.querySelector).toBe('span');
        expect(s.jTool).toBe(true);
    });
});
