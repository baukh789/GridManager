/**
 * Created by baukh on 16/9/8.
 */
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

function testPost(){
    $.post('data/test.json', {a:1,b:2,ccc:22234}, function(data, status){
        console.log(data);
        console.log(status);
    });
}