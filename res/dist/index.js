$(function () {
    "use strict";

    /**
     * Class to handle drag and drop events on an element.
     *
     * @param {string} selector A CSS selector for an element to attach drag and
     *     drop events to.
     * @param {function(FileList)} onDropCallback A callback passed the list of
     *     files that were dropped.
     * @constructor
     */
    function DnDFileController(selector, onDropCallback) {
        var el_ = document.querySelector(selector);

        this.dragenter = function (e) {
            e.stopPropagation();
            e.preventDefault();

            // Give a visual indication this element is a drop target.
            el_.classList.add('dropping');
        };

        this.dragover = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };

        this.dragleave = function (e) {
            e.stopPropagation();
            e.preventDefault();
            el_.classList.remove('dropping');
        };

        this.drop = function (e) {
            e.stopPropagation();
            e.preventDefault();

            el_.classList.remove('dropping');

            onDropCallback(e.dataTransfer.files);
        };

        el_.addEventListener('dragenter', this.dragenter, false);
        el_.addEventListener('dragover', this.dragover, false);
        el_.addEventListener('dragleave', this.dragleave, false);
        el_.addEventListener('drop', this.drop, false);
    }

    var items = [];

    function init() {
        // 生成编辑界面

        var containerTpl = '<div class="box box-primary">' +
            '    <div class="box-header with-border">' +
            '        <h3 class="box-title"><%- groupName %></h3>' +
            '    </div>' +
            '    <div class="form-horizontal">' +
            '        <div class="box-body">' +
            '        </div>' +
            '    </div>' +
            '</div>';
        containerTpl = Util.template(containerTpl);

        var group, item, groupHtml, $group, $box;
        for (var i = 0; i < EDITOR_CONFIG.groups.length; i++) {
            group = EDITOR_CONFIG.groups[i];
            groupHtml = containerTpl(group);
            $group = $(groupHtml);
            $box = $group.find('.box-body');

            for (var j = 0; j < group.items.length; j++) {
                item = group.items[j];
                item.groupId = group.groupId;

                switch (item.type.toLowerCase()) {
                    case 'string':
                        items.push(new FormItems.ItemString(item, $box));
                        break;
                    case 'array':
                        items.push(new FormItems.ItemArray(item, $box));
                        break;
                    case 'select':
                        items.push(new FormItems.ItemSelect(item, $box));
                        break;
                    case 'image':
                        items.push(new FormItems.ItemImage(item, $box));
                        break;
                    case 'css':

                        break;
                }
            }
            $('#formContainer').append($group);
        }

        //// 处理拖拽区域
        //var controller = new DnDFileController('#dragArea', function (files) {
        //    [].forEach.call(files, function (file, i) {
        //        // writeFile(FS.root, file);
        //        console.log(file);
        //        $('#g02_i04')[0].files.push(file);
        //    });
        //});

    }


    init();

});
