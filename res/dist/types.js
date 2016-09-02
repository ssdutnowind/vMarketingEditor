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

        /**
         * 设置值
         * @param val
         */
        this.setValue = function (val) {
            this.value = val;
            this.$inputEl.val(val);
        };

        /**
         * 取值
         * @returns {null}
         */
        this.getValue = function () {
            this.value = this.$inputEl.val();
            return this.value;
        };

        /**
         * 重置值
         */
        this.reset = function () {
            this.$inputEl.val(this.config.default || '');
            this.value = this.$inputEl.val();
        };

        /**
         * 获取导出的字符串
         * @returns {string}
         */
        this.getExportString = function () {
            var str = '';
            str += '    // ' + this.config.itemLabel + '\r\n';
            str += '    ' + this.exports + ': "' + this.getValue() + '"';
            return str;
        };

        /**
         * 验证有效性
         * @returns {boolean}
         */
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
        this.must = this.config.extra && this.config.extra.must || false;

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

        /**
         * 设置值
         * @param val
         */
        this.setValue = function (val) {
            this.value = val;
            this.$inputEl.val(this.value.join('\n'));
        };

        /**
         * 取值
         * @returns {null}
         */
        this.getValue = function (val) {
            this.value = this.$inputEl.val().split('\n');
            return this.value;
        };

        /**
         * 重置值
         */
        this.reset = function () {
            this.$inputEl.val(this.config.default && this.config.default.join('\n') || '');
            this.value = this.$inputEl.val();
        };

        /**
         * 获取导出的字符串
         * @returns {string}
         */
        this.getExportString = function () {
            var str = '';
            str += '    // ' + this.config.itemLabel + '\n';
            str += '    ' + this.exports + ': ' + JSON.stringify(this.getValue());
            return str;
        };

        /**
         * 验证有效性
         * @returns {boolean}
         */
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
        this.must = this.config.extra && this.config.extra.must || false;

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

        /**
         * 设置值
         * @param val
         */
        this.setValue = function (val) {
            this.$el.find('input[value="' + val + '"]').attr('checked', true);
        };

        /**
         * 取值
         * @returns {null}
         */
        this.getValue = function (val) {
            this.value = this.$el.find('input:radio[name=' + config.exports + ']:checked').val();
            return this.value;
        };

        /**
         * 重置值
         */
        this.reset = function () {
            if (this.config.default) {
                this.$el.find('input[value="' + this.config.default + '"]').attr('checked', true);
            }
            this.value = this.config.default || '';
        };

        /**
         * 获取导出的字符串
         * @returns {string}
         */
        this.getExportString = function () {
            var str = '';
            str += '    // ' + this.config.itemLabel + '\r\n';
            str += '    ' + this.exports + ': "' + this.getValue() + '"';
            return str;
        };

        /**
         * 验证有效性
         * @returns {boolean}
         */
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
        this.must = this.config.extra && this.config.extra.must || false;

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

        /**
         * 设置值
         * @param val
         */
        this.setValue = function (file) {
            if (typeof file !== 'string') {
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
            }
            this.value = file;
            this.$inputEl.val('');
            setPreview(file);
        };

        /**
         * 取值
         * @returns {null}
         */
        this.getValue = function () {
            if (this.value) {
                return this.value;
            } else if (this.$inputEl[0].files.length > 0) {
                return this.$inputEl[0].files[0];
            } else {
                return null;
            }
        };

        /**
         * 重置值
         */
        this.reset = function () {
            this.$inputEl.val('');
            this.value = null;
            setPreview(null);
        };

        /**
         * 获取导出的CSS对象
         * @param timestamp
         * @returns {{}}
         */
        this.getExportObject = function (timestamp) {
            if (!this.getValue() || !this.config.relevance) {
                return {};
            }

            var obj = {};
            obj[this.config.relevance.exports] = {};
            obj[this.config.relevance.exports][this.config.relevance.name] = Util.template(this.config.relevance.value, {timestamp: timestamp});
            return obj;
        };

        /**
         * 验证有效性
         * @returns {boolean}
         */
        this.validate = function () {
            if (this.must && !this.getValue()) {
                this.$el.addClass('has-error');
                return false;
            } else {
                this.$el.removeClass('has-error');
                return true;
            }
        };

        /**
         * 生成图片预览
         * @param file
         */
        function setPreview(file) {
            if (typeof file === 'string') {
                that.$el.find('img').attr('src', file);
                that.$el.find('img').show();
            } else {
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
                    this.$inputEl.val('');
                    Util.showAlert('请选择“' + that.suffix + '”类型的文件！');
                    return;
                }
            }
            // 检查文件大小
            if (file.size > that.maxSize) {
                this.$inputEl.val('');
                Util.showAlert('文件体积不能大于 ' + (that.maxSize / 1024) + 'KB！');
                return;
            }
            this.value = file;
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
        this.must = this.config.extra && this.config.extra.must || false;

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

        /**
         * 设置值
         * @param val
         */
        this.setValue = function (value) {
            this.$el.find('.color-picker').colorpicker('setValue', value);
        };

        /**
         * 取值
         * @returns {null}
         */
        this.getValue = function () {
            this.value = this.$inputEl.val().toLowerCase();
            return this.value;
        };

        /**
         * 重置值
         */
        this.reset = function () {
            this.value = this.config.default || '';
            this.$el.find('.color-picker').colorpicker('setValue', this.value);
        };

        /**
         * 获取导出的CSS对象
         * @returns {{}}
         */
        this.getExportObject = function () {
            if (!this.getValue() || !this.config.extra) {
                return {};
            }

            var obj = {};
            obj[this.exports] = {};
            obj[this.exports][this.config.extra.name] = this.getValue();
            return obj;
        };

        /**
         * 验证有效性
         * @returns {boolean}
         */
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