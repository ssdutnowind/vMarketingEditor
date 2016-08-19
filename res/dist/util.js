$(function () {
    "use strict";
    var Util = window.Util = {
        /**
         * 对HTML进行转义
         * @param html 待转义的HTML字符串
         * @returns {*}
         */
        htmlEncode: function (html) {
            var temp = document.createElement("div");
            temp.textContent = html;
            var output = temp.innerHTML;
            temp = null;
            return output;
        },

        /**
         * 对HTML进行逆转义
         * @param html 待逆转义的HTML字符串
         * @returns {*}
         */
        htmlDecode: function (html) {
            var temp = document.createElement("div");
            temp.innerHTML = html;
            var output = temp.textContent;
            temp = null;
            return output;
        },

        /**
         * 移植自underscore的模板
         * @param text 模板文本
         * @param data 数据（可选参数）
         * @returns {*}
         */
        template: function (text, data) {
            var render;
            var settings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/;
            var matcher = new RegExp([
                    (settings.escape || noMatch).source,
                    (settings.interpolate || noMatch).source,
                    (settings.evaluate || noMatch).source
                ].join('|') + '|$', 'g');
            var escapes = {
                "'": "'",
                '\\': '\\',
                '\r': 'r',
                '\n': 'n',
                '\t': 't',
                '\u2028': 'u2028',
                '\u2029': 'u2029'
            };

            var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            var index = 0;
            var source = "__p+='";
            text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset)
                    .replace(escaper, function (match) {
                        return '\\' + escapes[match];
                    });

                if (escape) {
                    source += "'+\n((__t=(" + escape + "))==null?'':_.htmlEncode(__t))+\n'";
                }
                if (interpolate) {
                    source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                }
                if (evaluate) {
                    source += "';\n" + evaluate + "\n__p+='";
                }
                index = offset + match.length;
                return match;
            });
            source += "';\n";

            if (!settings.variable) {
                source = 'with(obj||{}){\n' + source + '}\n';
            }

            source = "var __t,__p='',__j=Array.prototype.join," +
                "print=function(){__p+=__j.call(arguments,'');};\n" +
                source + "return __p;\n";
            try {
                render = new Function(settings.variable || 'obj', '_', source);
            } catch (e) {
                e.source = source;
                throw e;
            }

            if (data) {
                return render(data, Util);
            }
            var template = function (data) {
                return render.call(this, data, Util);
            };

            template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

            return template;
        },

        /**
         * 提示信息框
         * @param msg
         * @param onOk
         * @param onCancel
         */
        showAlert: function (msg, onOk, onCancel) {
            var $dialog = $('#dialog');
            if (typeof onCancel === 'function') {
                $dialog.find('#cancelButton').show();
                $dialog.find('#cancelButton').unbind().bind('click', function () {
                    $dialog.hide();
                    if (typeof onCancel === 'function') {
                        onCancel();
                    }
                });
            } else {
                $dialog.find('#cancelButton').hide();
            }
            $dialog.find('#okButton').unbind().bind('click', function () {
                $dialog.hide();
                if (typeof onOk === 'function') {
                    onOk();
                }
            });
            $dialog.find('#dialogMessage').text(msg);

            $dialog.show();
        },

        showProgress: function(percent, msg){
            var $progress = $('#progress');
            percent = percent + '%';
            $progress.find('.progress-bar').css('width', percent);
            $progress.find('#progressMessage').text(msg || '加载中...');
            $progress.show();
        },

        hideProgress: function(){
            $('#progress').hide();
        }
    };
});