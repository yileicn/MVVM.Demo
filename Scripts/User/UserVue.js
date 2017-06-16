$(function () {
    var vm = new Vue({
        el: '#divBody',
        data: {
            //当前页
            CurIndex: 1,
            //分页大小
            PageSize: 5,
            //查询条件
            Query: { Id: 0, Name: null,Sex: 0, Profession: null },
            //列表数据
            ListData: [],
            //当前编辑数据
            CurData: { Id: 0, Name: null,Sex: 0, Profession: null },
            //编辑对话框
            EditDialog: null
        },
        //页面初始化
        created: function () {
            //默认显示第一页
            this.getList(1);
        },
        //页面呈现
        mounted: function () {
            //获取编辑对话框
            this.EditDialog = $("#EditDialog");
        },
        methods: {
            //添加
            addData: function () {
                var self = this;
                self.CurData = { Id: 0, Name: null, Profession: null };
                self.EditDialog.find("#exampleModalLabel").text("添加用户");
                self.EditDialog.modal();
            },
            //编辑
            editData: function (id) {
                var self = this;
                $.getJSON("/User/Get/" + id, function (data, textStatus, jqXHR) {
                    self.CurData = data;
                    self.EditDialog.find("#exampleModalLabel").text("编辑用户");
                    self.EditDialog.modal();
                });
            },
            //保存
            saveData: function () {
                var self = this;
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
            },
            //删除
            delData: function (id) {
                var self = this;
                if (confirm("确定要删除这条数据?")) {
                    $.post('/User/Del/' + id, function (data, textStatus, jqXHR) {
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
            getList: function (pageIndex,orderBy) {
                if (!!!pageIndex) pageIndex = 1;
                var self = this;
                var req = { "PageIndex": pageIndex, "PageSize": self.PageSize, "OrderBy": orderBy, "Query": self.Query };
                $.post("/User/GetList", req, function (data, textStatus, jqXHR) {
                    self.ListData = data.Items;
                    self.showPage(pageIndex, data.TotalPage);
                });
            },
            //列表排序
            sortData: function (event) {
                var self = this;
                var target = $(event.target);
                var orderBy = target.attr("sort");
                if (!orderBy) return;
                var sortType = target.children('i').attr('class');
                target.siblings().children('i').attr('class', 'upDown');
                if (sortType === 'upDown') {
                    orderBy = orderBy+" desc"
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
            },
            //laypage分页
            showPage: function (pageIndex, totalPage) {
                var self = this;
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
        }
    });
});