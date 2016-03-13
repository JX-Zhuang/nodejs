$(document).ready(function() {
    //查询按钮
    $("#newsseach-btn").click(function() {
        $("#search-news-contanier").empty();
        $("#search-news").val("");
    });
    //按钮事件
    //查询新闻
     $("#search-news-btn").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/select",
            dataType: "json",
            data: {
                id: $("#search-news").val()
            },
            success: function(data) {
                if (data != "") {
                    $("#search-news-contanier").empty();
                    var addDiv = $("<div>").appendTo("#search-news-contanier").addClass("news-box");
                    var addForm = $("<form>").appendTo(addDiv);
                    addNewsHead(addForm, "新闻ID:" + data[0].id);
                    addNewsSelect(addForm, "<select class='form-control' readonly>", data[0].newstype, "新闻类型");
                    addNewsInner(addForm, "<input type='text' readonly>", data[0].newstitle, "新闻标题");
                    addNewsInner(addForm, "<input type='text' readonly>", data[0].newsimg, "新闻图片路径");
                    addNewsInner(addForm, "<textarea readonly>", data[0].newscontent, "新闻内容");
                    //时间转化UTC->GTM
                    if (data[0].addtime.match('T16:00:00.000Z') != null) {
                        var time = new Date(data[0].addtime.replace('T16:00:00.000Z', ''));
                        var timestamp = Date.parse(time) + 24 * 3600 * 1000;
                        var timeGTM = new Date(timestamp);
                        var month;
                        var date;
                        if (timeGTM.getMonth() + 1 < 10) {
                            month = "0" + (timeGTM.getMonth() + 1);
                        } else {
                            month = timeGTM.getMonth() + 1;
                        }
                        if (timeGTM.getDate() < 10) {
                            date = "0" + timeGTM.getDate();
                        } else {
                            date = timeGTM.getDate();
                        }
                        addNewsInner(addForm, "<input type='text' class='laydate-icon' onclick='laydate()' readonly>", timeGTM.getFullYear() + '-' + month + '-' + date, "新闻时间");
                    } else {
                        addNewsInner(addForm, "<input type='text' class='laydate-icon' onclick='laydate()' readonly>", data[0].addtime, "新闻时间");

                    }
                    operate(addForm); //操作
                } else {
                    alert('没有这条新闻');
                }
            },
            error: function(jqXHR) {
                alert("错误：" + jqXHR.status);
            }
        });
     });
    //删除按钮
    $(document).on("click",'.delBtn',function(e) {
            e.preventDefault();
            var delDiv = $(this).parent().parent();
            var delP = $(delDiv).children();
            $.ajax({
                type: "POST",
                url: "/delete",
                dataType: "json",
                data: {
                    id: $(delP).eq(0).text().replace("新闻ID:", "")
                },
                success: function(data) {
                    if (data.success) {
                        alert("删除成功");
                    }else{
                        alert("操作有误");
                    }
                },
                error: function(jqXHR) {
                    alert("错误：" + jqXHR.status);
                },
            });
            $(delDiv.parent()).remove();
        });
    
    //修改按钮
    $(document).on("click",".updateBtn",function(e) {
            e.preventDefault();
            var updatelTr = $(this).parent().parent();
            updatelTd = $(updatelTr).children();
            updatelTd.last().children().first().css("display", "inline-block");
            oldTitle = updatelTd.eq(1).children().val(); //需要修改的新闻标题
            $(updatelTd).removeAttr("readonly");
            updatelTd.children().removeAttr("readonly");
            $(updatelTd.eq(1).children()).focus();
        });

    //保存按钮
    $(document).on("click",".saveBtn",function(e) {
        e.preventDefault();
        var updatelDiv = $(this).parent().parent();
        var updateP = $(updatelDiv).children();
        var a = true;
        var imgUrl = false;
        for (var i = 1; i < 6; i++) {
            if (!checkString($(updateP).eq(i).children().eq(1).val())) {
                a = false;
                break;
            }
        };
        if ($(updateP).eq(3).children().eq(1).val().match(/http:\/\//) != null || $(updateP).eq(3).children().eq(1).val().match(/https:\/\//) != null) {
            imgUrl = true;
        }
        if (a) {
            if (!imgUrl) {
                alert("请输入正确的图片路径url");
            } else {
                $.ajax({
                    type: "POST",
                    url: "/update", //提交地址
                    dataType: "json",
                    data: {
                        id: $(updateP).eq(0).text().replace("新闻ID:", ""),
                        newstype: $(updateP).eq(1).children().eq(1).val(),
                        newstitle: $(updateP).eq(2).children().eq(1).val(),
                        newsimg: $(updateP).eq(3).children().eq(1).val(),
                        newscontent: $(updateP).eq(4).children().eq(1).val(),
                        addtime: $(updateP).eq(5).children().eq(1).val()
                    },
                    success: function(data) {
                        if (data.success) {
                            $(".saveBtn").css("display", "none");
                            updatelTd.children().attr("readonly", "readonly");
                            alert("修改成功");
                        } else {
                            alert("操作有误");
                        }
                    },
                    error: function(jqXHR) {
                        alert("请输入需要修改的内容");
                    }
                });
            }
        } else {
            alert("内容不能为空");
        }
    });
    //增加新闻
    $("#insert-btn").click(function(e) {
        e.preventDefault();
        if (!(checkString($("#newstype").val())) || !(checkString($("#newstitle").val())) || !(checkString($("#newsimg").val())) || !(checkString($("#newscontent").val())) || !(checkString($("#newstime").val()))) {
            alert("不能为空");
        } else if ($("#newsimg").val().match(/http:\/\//) != null || $("#newsimg").val().match(/https:\/\//) != null) {
            insert();
        } else {
            alert("请输入正确的图片url");
        }
    });
    //增加
    function insert() {
        $.ajax({
            type: "POST",
            url: "/insert",
            dateType: "json",
            data: {
                newstype: $("#newstype").val(),
                newstitle: $("#newstitle").val(),
                newsimg: $("#newsimg").val(),
                newscontent: $("#newscontent").val(),
                addtime: $("#newstime").val()
            },
            success: function(data) {
                if (data.success) {
                    alert("添加成功");
                    window.open('/backstage','_self');//页面刷新
                } else {
                    alert("操作有误");
                }
            },
            error: function(jqXHR) {
                alert("错误:" + jqXHR.status);
            }
        });
    }
    //增加newstype <select>
    function addNewsSelect(addId, tag, value, text) {
        var addP = $("<p>").appendTo(addId);
        var addLabel = $("<label>").appendTo(addP);
        var addTitle = $(tag).appendTo(addP);
        $("<option>推荐</option>").appendTo(addTitle);
        $("<option>百家</option>").appendTo(addTitle);
        $("<option>本地</option>").appendTo(addTitle);
        $("<option>图片</option>").appendTo(addTitle);
        $("<option>娱乐</option>").appendTo(addTitle);
        $("<option>社会</option>").appendTo(addTitle);
        $("<option>军事</option>").appendTo(addTitle);
        $("<option>娱乐</option>").appendTo(addTitle);
        $("<option>社会</option>").appendTo(addTitle);
        $("<option>军事</option>").appendTo(addTitle);
        $("<option>科技</option>").appendTo(addTitle);
        $("<option>互联网</option>").appendTo(addTitle);
        $("<option>体育</option>").appendTo(addTitle);
        $("<option>国外</option>").appendTo(addTitle);
        addLabel.text(text);
        addTitle.val(value);
    }
    //添加新闻
    function addNewsInner(addId, tag, value, text) {
        var addP = $("<p>").appendTo(addId);
        var addLabel = $("<label>").appendTo(addP);
        var addTitle = $(tag).appendTo(addP);
        addLabel.text(text);
        addTitle.val(value);
    }
    //添加新闻头部
    function addNewsHead(addId, text) {
        var addTd = $("<p>").appendTo(addId);
        addTd.html(text);
    }

    //添加操作按钮
    function operate(addId) {
        var addTd = $("<p>").appendTo(addId);
        $(addTd).text("操作");
        var operateBtn = [];
        for (var i = 0; i < 3; i++) {
            operateBtn[i] = $("<button>").appendTo(addTd);
        }
        operateBtn[2].addClass("delBtn");
        operateBtn[2].html("删除");
        operateBtn[1].addClass("updateBtn");
        operateBtn[1].html("修改");
        operateBtn[0].addClass("saveBtn").css("display", "none");
        operateBtn[0].html("保存");
    }
    //判断输入的字符串是不是为空
    function checkString(string) {
        var result = false;
        var arr = string.split("");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != " ") {
                result = true;
                break;
            }
        };
        if (result) {
            return true;
        }
        return false;
    }
});
