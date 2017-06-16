var User = function () {
    var self = this;
    //当前页
    self.CurIndex = 1;
    //分页大小
    self.PageSize = 5;
    //初始数据结构
    self.InitData = { Id: 0, Name: "", Profession: "" };
    //查询条件
    self.Query = ko.mapping.fromJS(self.InitData);//{ Id: ko.observable(0), Name: ko.observable(""), Profession: ko.observable("") }
    //列表数据
    self.ListData = ko.observableArray();
    //当前编辑数据
    self.CurData = ko.mapping.fromJS(self.InitData);//{ Id: ko.observable(0), Name: ko.observable(""), Profession: ko.observable("") }
    //编辑对话框
    self.EditDialog = $("#EditDialog");

    //添加
    self.addData = function () {
        //self.CurData.Id(0);
        //self.CurData.Name("");
        //self.CurData.Profession("");
        ko.mapping.fromJS(self.InitData, {}, self.CurData);
        self.EditDialog.find("#exampleModalLabel").text("添加用户");
        self.EditDialog.modal();
    };
    //编辑
    self.editData = function (data) {
        $.getJSON("/User/Get/" + data.Id, function (data, textStatus, jqXHR) {
            //self.CurData.Id(data.Id);
            //self.CurData.Name(data.Name);
            //self.CurData.Profession(data.Profession);
            ko.mapping.fromJS(data, {}, self.CurData);
            self.EditDialog.find("#exampleModalLabel").text("编辑用户");
            self.EditDialog.modal();
        });
    };
    //保存
    self.saveData = function () {
        $.post('/User/Save', self.CurData, function (data, textStatus, jqXHR) {
            if (data.Status == 0) {
                self.EditDialog.modal('hide')
                self.getList(self.CurIndex);
                alert('保存成功');
            }
            else {
                alert('保存失败');
            }
        });
    };
    //删除
    self.delData = function (data) {
        if (confirm("确定要删除这条数据?")) {
            $.post('/User/Del/' + data.Id, function (data, textStatus, jqXHR) {
                if (data.Status == 0) {
                    self.getList(self.CurIndex);
                    alert('删除成功');
                }
                else {
                    alert('删除失败');
                }
            });
        }        
    },
    //获取列表
    self.getList = function (pageIndex,orderBy) {
        if (!!!pageIndex) pageIndex = 1;
        var req = { "PageIndex": pageIndex, "PageSize": self.PageSize, "OrderBy": orderBy, "Query": self.Query };
        $.post("/User/GetList", req, function (data, textStatus, jqXHR) {
            self.ListData.removeAll();
            for (var d in data.Items) {
                self.ListData.push(data.Items[d]);
            }
            self.showPage(pageIndex, data.TotalPage);
        });
    }
    //列表排序
    self.sortData = function (data,event) {
        var self = this;
        var target = $(event.target);
        var orderBy = target.attr("sort");
        if (!orderBy) return;
        var sortType = target.children('i').attr('class');
        target.siblings().children('i').attr('class', 'upDown');
        if (sortType === 'upDown') {
            orderBy = orderBy + " desc"
            target.children('i').attr('class', 'down');
        } else if (sortType === 'down') {
            orderBy = orderBy + " asc"
            target.children('i').attr('class', 'up');
        } else if (sortType === 'up') {
            orderBy = orderBy + " desc"
            target.children('i').attr('class', 'down');
        }
        if (orderBy) {
            self.getList(1, orderBy);
        }
    }
    //laypage分页
    self.showPage = function (pageIndex, totalPage) {
        //显示分页
        laypage({
            cont: 'notice_pages', //容器。值支持id名、原生dom对象，jquery对象。
            pages: totalPage, //通过后台拿到的总页数
            curr: pageIndex, //当前页
            groups: 5,//连续分页数
            skip: true,//是否显示跳转
            skin: '#1E9FFF',
            jump: function (obj, first) { //触发分页后的回调
                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                    self.getList(obj.curr);
                    self.CurIndex = obj.curr;
                }
            }
        });
    }
};
$(function () {
    var model = new User();
    //默认显示第一页
    model.getList(1);
    //绑定数据
    ko.applyBindings(model);
});