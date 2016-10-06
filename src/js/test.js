/**
 * jTool test
 */
require(['require.config'], function(){
    require(['jTool'], function($){
        window.$ = window.jTool = $;

        //testOffset();
        function testOffset(){
            console.log($('.tt3').offset());
        }
        // 测试wrap and closest
        //testDOM();
        function testDOM(){
            var t1 = $('.t1');
            t1.wrap('<div class="wrap"><div class="table-div"></div></div>');
            var t1Text = t1.text();
            t1.append('<div class="append-div">'+t1Text+'</div>');
            t1.attr('auto-attr', 'false');
            var wrap = t1.closest('.wrap');
            console.log(t1);
            console.log(wrap);
        }
        // 测试attr and each
        //testAttr();
        function testAttr(){
            var t2 = $('.t2');
            t2.append('<span>append span</span><span>append span</span><span>append span</span>');
            var span = $('span', t2);
            console.log(span);
            $.each(span, function(i, v){
                $(v).attr('test-attr', 'baukh');
            });
        }
        // 测试on
         testOn();
        function testOn(){
            $('div').off('click', 'p');
            $('div').on('click', 'p', function(e){
                console.log('click=', this.innerHTML)
            });
            $('div').append('<p>新增加的P元素</p>');
            /*
            $('div').off('mousedown', 'p,span');
            $('div').on('mousedown', 'p,span', function(e){
                console.log('mousedown=', this.innerHTML)
            });
            $('.t1').off('click', 'p,span');
            */
        }
        // 测试bind
        // testBind();
        function testBind(){
            $('p').unbind('click.bind');
            $('p').bind('click.bind', function(e){
                console.log(this.innerHTML)
            });
            $('p').eq(1).unbind('click.bind');
            $('p').eq(2).unbind('click');
        }
        // 测试sizzle
        // testSizzle();
        function testSizzle(){
            console.log($('.t1'));
        }
        // 测试ajax
        function testAjax(){
            $.ajax({
                url: 'data/test.json',
                data: {
                    name: 1,
                    c:2
                },
                headers: {a:1,b:2,c:3},
                type: 'GET',
                beforeSend: function(xhr){
                    console.log(xhr)
                },
                complete: function (xhr, status) {
                    console.log('complete', xhr, status)
                },
                success : function (data, status) {
                    console.log('success',data, status)
                },
                error: function (xhr, status, statusText) {
                    console.log('error', xhr, status, statusText)
                }
            });
        }
        // 测试post请求
        function testPost(){
            $.post('data/test.json', {a:1,b:2,ccc:22234}, function(data, status){
                console.log(data);
                console.log(status);
            });
        }

        // 测试html
        //testHtml();
        function testHtml(){
            var t1 = $('.t1');
            var t2 = $('.t2');
            t1.html(t2);
            console.log(t1.html());
        }

        // 测试append
        function testAppend(){
            var a = document.createElement('span');
            a.innerHTML = 'aaaaa';
            $('div').append(a);
            $('div').append('123123');
            $('div').append('<font style="color:red;">hello world</font>');
        }

        // 测试prepend
        function testPrepend(){
            var a = document.createElement('span');
            a.innerHTML = 'aaaaa';
            $('div').prepend(a);
            $('div').prepend('123123');
            $('div').prepend('<font style="color:red;">hello world</font>');
        }
    });
});