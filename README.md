# tableSelect
 LayUi组件：TableSelect
 项目介绍
   下拉表格数据选择器，主要用途有以下几个方面：
   1：表单中下拉框数据显示的内容过少不清晰，下拉表格数据选择器可以有效的解决该问题。
   2：目前这个组件在原基础上实现了回显功能，有效了防止用户再次选择该数据
   
   此组件有不足点：
   不能实现跨页选择，如果有兴趣的小伙伴想扩展该组件可以参考： http://www.111cn.net/wy/165048.htm
   
   使用说明：
   <script type="text/javascript">
      layui.use('tableSelect',function () {
             let $ = layui.jquery, tableSelect = layui.tableSelect;
             tableSelect.render({
                 elem: '#demo', 
                 searchKey: 'username',
                 checkDataElem: ".table-ids", // 用于存储回显值
                 table: { // layui table 一些属性 
                     url:'table.json',
                     method: 'post',
                     cols: [[
                         { type: 'checkbox' },
                         { field: 'id', title: 'ID', width:100 },
                         { field: 'username', title: '姓名', width:300 },
                         { field: 'sex', title: '性别', width:100 }
                     ]],
                     page: true,
                     height: 315
                 },
                 done: function (elem, data) { // 用户选中数据触发
                     let newJson = [];
                     let ids = [];
                     layui.each(data.data, function (index, item) {
                         newJson.push(item.username);
                         ids.push(item.id);
                     })
                     elem.val(newJson.join(","));
                     $(".table-ids").val(ids.join(",")); // 保存回显的值
                 }
             })
         })
  </script>
  首先引入组件，不懂怎么引入组件，请参考：https://www.layui.com/doc/ 
 
 效果图
 ## 效果图
![输入图片说明](https://github.com/xla145/tableSelect/blob/master/screenshots/1536653561.jpg "1536653561.png")
参考：
https://gitee.com/lolicode/layui_component_tableselect 
http://www.111cn.net/wy/165048.htm
