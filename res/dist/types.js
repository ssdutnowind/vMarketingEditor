var FormItems = {

    /**
     * String类型配置
     * @param config
     * @constructor
     */
    ItemString: function (config, $container) {
        "use strict";
        // 类型
        this.type = 'String';
        this.config = config;
        this.exports = config.exports;
        this.must = this.config.extra && this.config.extra.must || false;

        // 模板
        this.tpl = '<div class="form-group">' +
            '    <label for="<%- groupId + \'_\' + itemId %>" class="col-md-3 control-label"><%- itemLabel %>' +
            '    <% if(extra && extra.must) { %>' +
            '    <span class="must">*</span>' +
            '    <% } %>' +
            '    </label>' +
            '    <div class="col-md-8">' +
            '        <input type="text" class="form-control" id="<%- groupId + \'_\' + itemId %>" placeholder="<%- itemLabel %>">' +
            '        <p class="help-block"><%- itemDesc %></p>' +
            '    </div>' +
            '</div>';
        this.value = null;

        this.setValue = function (val) {
            this.value = val;
            this.$inputEl.val(val);
        };

        this.getValue = function () {
            this.value = this.$inputEl.val();
            return this.value;
        };

        this.validate = function () {
            if (this.must && !this.getValue()) {
                this.$el.addClass('has-error');
                return false;
            } else {
                this.$el.removeClass('has-error');
                return true;
            }
        };

        // 生成DOM
        var html = Util.template(this.tpl, this.config);
        this.$el = $(html);
        this.$inputEl = this.$el.find('input');

        if (this.config.default) {
            this.$inputEl.val(this.config.default);
        }

        $container.append(this.$el);
    },

    /**
     * Array类型配置
     * @param config
     * @param $container
     * @constructor
     */
    ItemArray: function (config, $container) {
        "use strict";
        // 类型
        this.type = 'Array';
        this.config = config;
        this.exports = config.exports;
        // 模板
        this.tpl = '<div class="form-group">' +
            '    <label for="<%- groupId + \'_\' + itemId %>" class="col-md-3 control-label"><%- itemLabel %>' +
            '    <% if(extra && extra.must) { %>' +
            '    <span class="must">*</span>' +
            '    <% } %>' +
            '    </label>' +
            '    <div class="col-md-8">' +
            '        <textarea class="form-control" id="<%- groupId + \'_\' + itemId %>" placeholder="<%- itemLabel %>" rows="5" style="resize: vertical"></textarea>' +
            '        <p class="help-block"><%- itemDesc %></p>' +
            '    </div>' +
            '</div>';
        this.value = null;

        this.setValue = function (val) {
            this.value = val;
            this.$inputEl.val(this.value.join('\r\n'));
        };

        this.getValue = function (val) {
            this.value = this.$inputEl.val().split('\r\n');
            return this.value;
        };

        this.validate = function () {
            if (this.must && !this.getValue()) {
                this.$el.addClass('has-error');
                return false;
            } else {
                this.$el.removeClass('has-error');
                return true;
            }
        };

        // 生成DOM
        var html = Util.template(this.tpl, this.config);
        this.$el = $(html);
        this.$inputEl = this.$el.find('textarea');

        if (this.config.default) {
            this.$inputEl.val(this.config.default.join('\n'));
        }

        $container.append(this.$el);
    },

    /**
     * Select类型配置
     * @param config
     * @param $container
     * @constructor
     */
    ItemSelect: function (config, $container) {
        "use strict";
        // 类型
        this.type = 'Select';
        this.config = config;
        this.exports = config.exports;
        // 模板
        this.tpl = '<div class="form-group">' +
            '    <label for="<%- groupId + \'_\' + itemId + \'_0\' %>" class="col-md-3 control-label"><%- itemLabel %>' +
            '    <% if(extra && extra.must) { %>' +
            '    <span class="must">*</span>' +
            '    <% } %>' +
            '    </label>' +
            '    <div class="col-md-8">' +
            '        <% for(var i = 0; i < options.length; i++) { %>' +
            '        <label class="radio-inline">' +
            '           <input type="radio" name="<%- exports %>" id="<%- groupId + \'_\' + itemId + \'_\' + i %>" value="<%- options[i].value %>"> <%- options[i].label %>' +
            '        </label>' +
            '        <% } %>' +
            '        <p class="help-block"><%- itemDesc %></p>' +
            '    </div>' +
            '</div>';
        this.value = null;

        this.setValue = function (val) {

        };

        this.getValue = function (val) {

        };

        this.validate = function () {
            return true;
        };

        // 生成DOM
        var html = Util.template(this.tpl, this.config);
        this.$el = $(html);
        this.$inputEl = this.$el.find('input');

        if (this.config.default) {
            this.$el.find('input[value="' + this.config.default + '"]').attr('checked', true);
        }

        $container.append(this.$el);
    },

    /**
     * Image类型配置
     * @param config
     * @param $container
     * @constructor
     */
    ItemImage: function (config, $container) {
        "use strict";

        var that = this;
        // 类型
        this.type = 'Image';
        this.config = config;
        this.maxSize = config.extra && config.extra.maxSize || 1024 * 1024;
        this.suffix = config.extra && config.extra.suffix || '';
        this.exports = config.exports;

        // 模板
        this.tpl = '<div class="form-group">' +
            '    <label for="<%- groupId + \'_\' + itemId %>" class="col-md-3 control-label"><%- itemLabel %>' +
            '    <% if(extra && extra.must) { %>' +
            '    <span class="must">*</span>' +
            '    <% } %>' +
            '    </label>' +
            '    <div class="col-md-8">' +
            '        <input type="file" class="form-control" id="<%- groupId + \'_\' + itemId %>" placeholder="<%- itemLabel %>">' +
            '        <p class="help-block"><%- itemDesc %></p>' +
            '        <img class="img-thumbnail" style="max-width: 320px; display: none;">' +
            '    </div>' +
            '</div>';
        this.value = null;

        this.setValue = function (file) {
            // 检查文件类型
            if (that.suffix) {
                if (file.name.toLowerCase().lastIndexOf(that.suffix) !== file.name.lastIndexOf('.')) {
                    Util.showAlert('请选择“' + that.suffix + '”类型的文件！');
                    return;
                }
            }
            // 检查文件大小
            if (file.size > that.maxSize) {
                Util.showAlert('文件体积不能大于 ' + (that.maxSize / 1024) + 'KB！');
                return;
            }
            this.value = file;
            setPreview(file);
        };

        this.getValue = function (val) {

        };

        this.validate = function () {
            return true;
        };

        function setPreview(file) {
            var reader = new FileReader();
            reader.onloadend = function () {
                that.$el.find('img').attr('src', reader.result);
                that.$el.find('img').show();
            };
            if (file) {
                reader.readAsDataURL(file);
            } else {
                that.$el.find('img').attr('src', '');
                that.$el.find('img').hide();
            }
        }

        // 生成DOM
        var html = Util.template(this.tpl, config);
        this.$el = $(html);
        this.$inputEl = this.$el.find('input');

        this.$inputEl.bind('change', function () {
            var file = this.files[0];
            // 检查文件类型
            if (that.suffix) {
                if (file.name.toLowerCase().lastIndexOf(that.suffix) !== file.name.lastIndexOf('.')) {
                    Util.showAlert('请选择“' + that.suffix + '”类型的文件！');
                    return;
                }
            }
            // 检查文件大小
            if (file.size > that.maxSize) {
                Util.showAlert('文件体积不能大于 ' + (that.maxSize / 1024) + 'KB！');
                return;
            }

            setPreview(file);
        });


        $container.append(this.$el);
    },

    /**
     * CSS类型配置
     * @param config
     * @param $container
     * @constructor
     */
    ItemCss: function (config, $container) {
        "use strict";
        // 类型
        this.type = 'CSS';
        this.config = config;
        this.exports = config.exports;
        // 模板
        this.tpl = '<div class="form-group">' +
            '    <label for="<%- groupId + \'_\' + itemId %>" class="col-md-3 control-label"><%- itemLabel %>' +
            '    <% if(extra && extra.must) { %>' +
            '    <span class="must">*</span>' +
            '    <% } %>' +
            '    </label>' +
            '    <div class="col-md-3">' +
            '        <div class="input-group color-picker">' +
            '            <input type="text" class="form-control" id="<%- groupId + \'_\' + itemId %>" placeholder="<%- itemLabel %>">' +
            '            <div class="input-group-addon">' +
            '                <i></i>' +
            '            </div>' +
            '        </div>' +
            '        <p class="help-block"><%- itemDesc %></p>' +
            '    </div>' +
            '</div>';
        this.value = null;

        this.setValue = function (val) {

        };

        this.getValue = function (val) {

        };

        this.validate = function () {
            return true;
        };

        // 生成DOM
        var html = Util.template(this.tpl, this.config);
        this.$el = $(html);
        this.$inputEl = this.$el.find('input');

        if (this.config.default) {
            this.$inputEl.val(this.config.default);
        }

        $container.append(this.$el);

        this.$el.find('.color-picker').colorpicker();
    }
};