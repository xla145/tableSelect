layui.define(['table', 'jquery', 'form'], function (exports) {

    let MOD_NAME = 'tableSelect', $ = layui.jquery, table = layui.table, form = layui.form;

    let tableSelect = function () {
        this.options = {
            v: '1.0.1',
            elem: '#id',
            checkDataElem: '.ids', // 回显的隐藏表单，用于当再次点击文本框时，之前的选中的值默认在表格中被勾选
            searchKey: 'keyword',
            searchPlaceholder: '关键词搜索',
            table: {}
        }
    };

    /**
     * 初始化表格选择器
     */
    tableSelect.prototype.render = function (opt) {
        let that = this;
        let options = Object.assign({}, that.options, opt);
        let elem = $(options.elem);
        elem.on('click', function (e) {
            e.stopPropagation();
            if ($('div.tableSelect').length >= 1) {
                return false;
            }

            let t = elem.offset().top + elem.outerHeight() + "px";
            let l = elem.offset().left + "px";
            let tableName = "tableSelect_table_" + new Date().getTime();
            let tableBox = '<div class="tableSelect layui-anim layui-anim-upbit" style="left:' + l + ';top:' + t + ';border: 1px solid #d2d2d2;background-color: #fff;box-shadow: 0 2px 4px rgba(0,0,0,.12);padding:10px 10px 0 10px;position: absolute;z-index: 100;margin: 5px 0;border-radius: 2px;">';
            tableBox += '<div class="tableSelectBar">';
            tableBox += '<form class="layui-form" action="" style="display:inline-block;">';
            tableBox += '<input style="display:inline-block;width:190px;height:30px;vertical-align:middle;margin-right:-1px;border: 1px solid #C9C9C9;" type="text" name="' + options.searchKey + '" placeholder="' + options.searchPlaceholder + '" autocomplete="off" class="layui-input"><button class="layui-btn layui-btn-sm layui-btn-primary tableSelect_btn_search" lay-submit lay-filter="tableSelect_btn_search"><i class="layui-icon layui-icon-search"></i></button>';
            tableBox += '</form>';
            tableBox += '<button style="float:right;" class="layui-btn layui-btn-sm tableSelect_btn_select">选择</button>';
            tableBox += '</div>';
            tableBox += '<table id="' + tableName + '" lay-filter="' + tableName + '"></table>';
            tableBox += '</div>';
            tableBox = $(tableBox);
            $('body').append(tableBox);

            //渲染TABLE
            options.table.elem = "#" + tableName;

            // 回显呈现选中效果
            options.table.done = function (res, curr, count) {
                let data = $(options.checkDataElem).val();
                let checkData = data.split(",");
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < checkData.length; j++) {
                        if (res.data[i].id == checkData[j]) {
                            res.data[i]["LAY_CHECKED"] = 'true';
                            let index = res.data[i]['LAY_TABLE_INDEX'];
                            $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                            $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                        }
                    }
                    //设置全选checkbox的选中状态，只有改变LAY_CHECKED的值， table.checkStatus才能抓取到选中的状态
                    let checkStatus = table.checkStatus('' + tableName + '');
                    if (checkStatus.isAll) {
                        $('.layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                        $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                    }
                }
            }

            let tableSelect_table = table.render(options.table);

            //关键词搜索
            form.on('submit(tableSelect_btn_search)', function (data) {
                tableSelect_table.reload({
                    where: data.field, page: {
                        curr: 1
                    }
                });
                return false;
            });

            //双击行选中
            table.on('rowDouble(' + tableName + ')', function (obj) {
                let checkStatus = {data: [obj.data]};
                opt.done(elem, checkStatus);
                tableBox.remove();
            })

            //按钮选中
            tableBox.find('.tableSelect_btn_select').on('click', function () {
                let checkStatus = table.checkStatus('' + tableName + '');
                opt.done(elem, checkStatus);
                tableBox.remove();
            })

            //点击其他区域关闭
            $(document).mouseup(function (e) {
                let userSet_con = $('' + opt.elem + ',.tableSelect');
                if (!userSet_con.is(e.target) && userSet_con.has(e.target).length === 0) {
                    tableBox.remove();
                }
            });
        })
    }

    /**
     * 隐藏选择器
     */
    tableSelect.prototype.hide = function () {
        $('.tableSelect').remove();
    }

    //FIX 滚动时错位
    $(window).scroll(function () {
        tableSelect.hide();
    });


    // 有空实现，跨页选数据
    exports(MOD_NAME, new tableSelect());
})