import ajax from '../../src/jTool/Ajax';
describe('ajax', () => {
	let success = null;
    let error = null;
    let complete = null;

	beforeEach(() => {
		jasmine.Ajax.install();

		success = jasmine.createSpy('success');
		error = jasmine.createSpy('error');
		complete = jasmine.createSpy('complete');
	});

	afterEach(() => {
		jasmine.Ajax.uninstall();
		success = null;
		error = null;
		complete = null;
	});


	describe('简单的 get 请求', () => {

		beforeEach(() => {
			ajax({
				url: '/some/url',
				success: success,
				error: error,
				complete: complete
			});
		});

		it('请求成功', () => {
			expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url');
			expect(success).not.toHaveBeenCalled();

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 200,
				'contentType': 'text/plain',
				'responseText': 'some response'
			});

			expect(success).toHaveBeenCalledWith('some response', 200);

		});

		it('请求失败 && 请求完成', () => {

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 502,
				'statusText': '出错了'
			});

			expect(error.calls.argsFor(0)[1]).toBe(502);
			expect(error.calls.argsFor(0)[2]).toBe('出错了');
			expect(complete.calls.argsFor(0)[1]).toBe(502);

		});

	});

	describe('简单的 post 请求', () => {

		beforeEach(() => {
			ajax({
				url: '/some/url',
				type: 'POST',
				data: { name: 'hjzheng', job: 'niubi' },
				success: success,
				error: error,
				complete: complete
			});
		});

		it('请求成功', () => {

			let request = jasmine.Ajax.requests.mostRecent();

			expect(request.url).toBe('/some/url');
			expect(request.method).toBe('POST');
			expect(request.params).toEqual('name=hjzheng&job=niubi');
			expect(success).not.toHaveBeenCalled();

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 200,
				'contentType': 'text/plain',
				'responseText': 'some response'
			});

			expect(success).toHaveBeenCalledWith('some response', 200);
            request = null;
		});

		it('请求失败 && 请求完成', () => {

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 504,
				'statusText': '出错了'
			});

			expect(error.calls.argsFor(0)[1]).toBe(504);
			expect(error.calls.argsFor(0)[2]).toBe('出错了');
			expect(complete.calls.argsFor(0)[1]).toBe(504);

		});

	});


	it('测试 get 请求的 url 参数', () => {

		ajax({
			url: '/some/url?name=hjzheng'
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url?name=hjzheng');

		ajax({
			url: '/some/url',
			data: 'name=hjzheng&job=niubi'
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url?name=hjzheng&job=niubi');

		ajax({
			url: '/some/url?name=hjzheng',
			data: 'job=niubi'
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url?name=hjzheng&job=niubi');
	});

	it('测试请求 header', () => {

	    // get
		ajax({
			url: '/some/url',
			headers: {'Content-Type': 'application/json; charset=UTF-8'},
            success: success
		});

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url');
		expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual({'Content-Type': 'application/json; charset=UTF-8'});

		// post: 无Content-Type
        ajax({
            url: '/some/url',
            type: 'POST',
            success: success
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url');
        expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual({'Content-Type': 'application/x-www-form-urlencoded'});

        // post: Content-Type === application/x-www-form-urlencoded
        ajax({
            url: '/some/url',
            type: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            success: success
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url');
        expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual({'Content-Type': 'application/x-www-form-urlencoded'});

        // post: Content-Type === application/json; charset=UTF-8
        ajax({
            url: '/some/url',
            type: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            success: success
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe('/some/url');
        expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual({'Content-Type': 'application/json; charset=UTF-8'});
	});

    it('测试请求 xhrFields', () => {
        ajax({
            url: '/some/url',
            xhrFields: {
                withCredentials: true
            },
            success: success
        });

        expect(jasmine.Ajax.requests.mostRecent().withCredentials).toBe(true);
    });

	it('测试请求返回', () => {
		ajax({
			url: '/some/url',
			success: success
		});

		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'Content-Type': 'text/plain',
			'responseText': 'some response'
		});

		expect(success).toHaveBeenCalledWith('some response', 200);
	});

	it('测试请求返回 JSON 数据', () => {
		ajax({
			url: '/some/url',
			success: success
		});

		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'Content-Type': 'application/json; charset=UTF-8',
			'responseText': {'test': 1}
		});

		expect(success).toHaveBeenCalledWith({'test': 1}, 200);
	});
});
