$(function () {
    "use strict";
    var Util = window.Util;
    var FS = window.FS;
    var EDITOR_CONFIG = window.EDITOR_CONFIG;
    var FormItems = window.FormItems;
    // zip.js需要指定webworker目录
    zip.workerScriptsPath = 'res/plugins/zip/';

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
            el_.classList.add('callout-success');
        };

        this.dragover = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };

        this.dragleave = function (e) {
            e.stopPropagation();
            e.preventDefault();

            var event = e.originalEvent || e;
            var newElement = document.elementFromPoint(event.pageX, event.pageY);
            if (!this.contains(newElement)) {
                el_.classList.remove('callout-success');
            }
        };

        this.drop = function (e) {
            e.stopPropagation();
            e.preventDefault();

            el_.classList.remove('callout-success');

            onDropCallback(e.dataTransfer.files);
        };

        el_.addEventListener('dragenter', this.dragenter, false);
        el_.addEventListener('dragover', this.dragover, false);
        el_.addEventListener('dragleave', this.dragleave, false);
        el_.addEventListener('drop', this.drop, false);
    }

    // 生成的表单项目
    var items = [];
    // FileSystem
    var fs = null;
    // 当前工作目录
    var workDir = null;
    var currentTask = 'work/theme/';
    // 是否导出
    var isExport = false;
    // 是否预览
    var isPreview = false;

    function createEditors() {
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
                        items.push(new FormItems.ItemCss(item, $box));
                        break;
                }
            }
            $('#formContainer').append($group);
        }
    }

    /**
     * 初始化页面
     */
    function initPage(callback) {
        // 请求永久配额
        window.webkitStorageInfo.requestQuota(window.PERSISTENT, 100 * 1024 * 1024, function (grantedBytes) {
            // 初始化FileSystem
            FS.initFileSystem(function (filesystem) {
                    console.log(filesystem);
                    fs = filesystem;
                    FS.createFolder(fs.root, 'work', function (dEntry) {
                        console.log(dEntry);
                        workDir = dEntry;

                        // 尝试加载配置文件
                        FS.readFile(fs.root, 'editorConfig.js', 'text',
                            function (data) {
                                data += '\nreturn EDITOR_CONFIG;';
                                var fun;
                                try {
                                    fun = new Function(data);
                                    EDITOR_CONFIG = fun();
                                } catch (e) {
                                }
                                // 失败了则使用默认配置
                                createEditors();

                                if (typeof callback === 'function') {
                                    callback();
                                }
                            },
                            function () {
                                // 失败了则使用默认配置
                                createEditors();

                                if (typeof callback === 'function') {
                                    callback();
                                }
                            });

                    }, function (e) {
                        console.log(e);
                        Util.showAlert('申请存储配额失败！');
                    });
                },
                function (e) {
                    console.log(e);
                    Util.showAlert('申请存储配额失败！');
                }, window.PERSISTENT, grantedBytes);

        }, function (e) {
            console.log(e);
            Util.showAlert('申请存储配额失败！');
        });
    }

    /**
     * 初始化页面事件
     */
    function initEvent() {
        // 处理拖拽区域
        var controller = new DnDFileController('#dragArea', function (files) {
            Util.showAlert('拖放的文件将覆盖现有配置中的文件，是否继续？', function () {
                    [].forEach.call(files, function (file, i) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].type === 'Image' && items[i].exports === file.name) {
                                items[i].setValue(file);
                            }
                        }
                    });
                },
                function () {
                    // 什么也不做
                });
        });

        // 向上、向下按钮
        $('.up-to-top').bind('click', function () {
            $('body').animate({scrollTop: 0}, 300);
        });
        $('.down-to-bottom').bind('click', function () {
            $('body').animate({scrollTop: $('body').height()}, 300);
        });

        // 保存按钮
        $('#buttonSave').bind('click', function () {
            isExport = false;
            isPreview = false;
            doSave();
        });

        // 导出按钮
        $('#buttonExport').bind('click', function () {
            isExport = true;
            isPreview = false;
            doSave();
        });

        // 重置按钮
        $('#buttonReset').bind('click', function () {
            doReset();
        });

        // 预览
        $('#buttonPreview').bind('click', function () {
            isExport = false;
            isPreview = true;
            doSave();
            // doPreview();
        });

        // 新窗口预览
        $('button.preview-new').bind('click', function () {
            var tabId = $(this).attr('data-tab');
            var url = $(tabId).find('iframe').attr('src');
            window.open(url, '_blank');
        });

        // 显示导入对话框
        $('#buttonImport').bind('click', function () {
            $('#importThemeFile').val('');
            $('#importDialog').show();
        });

        // 显示网络对话框
        $('#buttonNetwork').bind('click', function () {
            $('#networkDialog').show();
        });

        // 隐藏对话框
        $('#buttonCloseImport').bind('click', function () {
            $('#importDialog').hide();
        });
        $('#buttonCloseNetwork').bind('click', function () {
            $('#networkDialog').hide();
        });
        $('#buttonClosePreview').bind('click', function () {
            $('#previewDialog').hide();
            clearInterval(previewTimer);
        });

        // 导入配置
        $('#buttonDoImport').bind('click', doImportTheme);

        // 从网络导入配置
        $('#buttonDoNetwork').bind('click', doImportFromNetwork);
    }

    /**
     * 加载工作临时文件
     */
    function initPageData() {
        currentTask = 'work/theme/';
        Util.showProgress(100, '正在初始化配置数据...');
        setTimeout(initConfigData, 100);
    }

    /**
     * 从config.js逆向初始化配置数据
     */
    function initConfigData() {
        FS.readFile(fs.root, 'work/theme/config.js', 'text',
            function (data) {
                data += '\nreturn config;';
                var fun, config;
                try {
                    fun = new Function(data);
                    config = fun();
                } catch (e) {
                    console.log(e);
                    // 失败了则继续初始化其他数据
                    initCssData();
                    return;
                }

                // 开始初始化数据
                for (var i in config) {
                    if (config.hasOwnProperty(i)) {
                        items.forEach(function (item, index) {
                            if (item.type === 'String' && item.exports === i) {
                                item.setValue(config[i]);
                            } else if (item.type === 'Array' && item.exports === i) {
                                item.setValue(config[i]);
                            } else if (item.type === 'Select' && item.exports === i) {
                                item.setValue(config[i]);
                            }
                        });
                    }
                }

                // 继续初始化CSS数据
                initCssData();
            },
            function () {
                // 失败了则继续初始化其他数据
                initCssData();
            });
    }

    /**
     * 从theme.css逆向初始化配置数据
     */
    function initCssData() {
        FS.readFile(fs.root, 'work/theme/theme.css', 'text',
            function (data) {
                var css = {}, configs = data.split('\n\n'), temps, temps2, props;
                configs.forEach(function (config, index) {
                    temps = config.split(/{|}/g);
                    // 'body '
                    // '↵    background-color: #ffffff↵'
                    if (temps[0] && temps[1]) {
                        temps[0] = temps[0].replace('\n', '').trim();
                        temps[1] = temps[1].replace('\n', '').trim();
                        // 选择器
                        css[temps[0]] = {};
                        // 每一条样式
                        temps2 = temps[1].split(';');
                        temps2.forEach(function (temp) {
                            temp = temp.trim();
                            if (temp) {
                                props = temp.split(':');
                                // color
                                // #fdebbf
                                if (props[0] && props[1]) {
                                    props[0] = props[0].trim();
                                    props[1] = props[1].trim();
                                    css[temps[0]][props[0]] = props[1];
                                }
                            }
                        });
                    }
                });
                console.log(css);
                // 开始初始化数据（三层循环……）
                for (var i in css) {
                    if (css.hasOwnProperty(i)) {
                        for (var j in css[i]) {
                            if (css[i].hasOwnProperty(j)) {
                                items.forEach(function (item) {
                                    if (item.type === 'CSS' && item.exports === i) {
                                        if (item.config.extra && item.config.extra.name && item.config.extra.name === j) {
                                            item.setValue(css[i][j]);
                                        }
                                    }
                                });
                            }
                        }
                    }
                }

                // 继续初始化图片文件
                initFiles();
            },
            function () {
                // 失败了则继续初始化其他数据
                initFiles();
            });
    }

    /**
     * 从遍历工作目录的img逆向初始化配置数据
     */
    function initFiles() {
        FS.listFolder(fs.root, currentTask + '/img',
            function (entrys) {
                entrys.forEach(function (entry) {
                    if (entry.isFile === true) {
                        items.forEach(function (item) {
                            if (item.type === 'Image' && item.exports === entry.name) {
                                item.setValue(entry.toURL())
                            }
                        });
                    }
                });
                Util.hideProgress();
            },
            function (e) {
                console.log(e);
                Util.hideProgress();
            });
    }

    // 异步处理到处的图片文件列表
    var exportFiles = [];

    /**
     * 根据exportFiles数组导出所有图片文件到目标路径
     */
    function doSaveFiles() {
        if (exportFiles.length === 0) {
            doSaveConfig();
            return;
        }
        var item = exportFiles.splice(0, 1)[0];
        FS.writeFile(fs.root, item.getValue(), currentTask + 'img/' + item.exports,
            function () {
                // 开始下一个
                doSaveFiles();
            },
            function (e) {
                console.log(e);
                Util.hideProgress();
                Util.showAlert('保存文件出错：' + (e.message || '未知错误'));
            });
    }

    /**
     * 保存theme.css
     */
    function doSaveCss() {
        Util.showProgress(60, '正在保存样式配置...');
        // 生成配置的CSS对象
        var css = {};
        var timestamp = (new Date()).getTime();
        for (var i = 0; i < items.length; i++) {
            if (items[i].type === 'CSS' || items[i].type === 'Image') {
                $.extend(true, css, items[i].getExportObject(timestamp));
            }
        }
        // 将对象转换为CSS字符串
        var cssStr = '';
        for (var j in css) {
            if (css.hasOwnProperty(j)) {
                cssStr += j + ' {\n';
                for (var k in css[j]) {
                    if (css[j].hasOwnProperty(k)) {
                        cssStr += '    ' + k + ': ' + css[j][k] + ';\n';
                    }
                }
                cssStr += '}\n\n';
            }
        }
        // 将CSS写入文件
        FS.writeFile(fs.root, cssStr, currentTask + 'theme.css',
            function () {

                if (isExport) {
                    // 如果是导出任务则继续导出成zip
                    doExportZip();
                } else if (isPreview) {
                    doPreview();
                } else {
                    // 非导出任务则直接完成
                    Util.showProgress(100, '保存完毕...');
                    setTimeout(function () {
                        Util.hideProgress();
                        Util.showAlert('保存配置完毕！');
                    }, 100);
                }
            },
            function (e) {
                console.log(e);
                Util.hideProgress();
                Util.showAlert('保存样式配置出错：' + (e.message || '未知错误'));
            });
    }

    /**
     * 保存config.js
     */
    function doSaveConfig() {
        Util.showProgress(40, '正在保存活动配置...');
        // 生成配置字符串
        var configs = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].type === 'String' || items[i].type === 'Array' || items[i].type === 'Select') {
                configs.push(items[i].getExportString());
            }
        }
        console.log(configs);
        var config = configs.join(',\n');
        config = 'var config = {\n' + config + '\n};';
        // 将配置内容写入文件
        FS.writeFile(fs.root, config, currentTask + 'config.js',
            function () {
                doSaveCss();
            },
            function (e) {
                console.log(e);
                Util.hideProgress();
                Util.showAlert('保存活动配置出错：' + (e.message || '未知错误'));
            });
    }

    /**
     * 执行保存任务
     */
    function doSave() {
        // 第一步检查配置是否正确
        var validate = true;
        for (var i = 0; i < items.length; i++) {
            if (items[i].validate() === false) {
                validate = false;
            }
        }

        if (!validate) {
            // 滚动到第一个出错的位置
            $('body').animate({scrollTop: $('.has-error').offset().top - 10}, 300);
            // Util.showAlert('请检查各项配置！');
            return;
        }

        // 将所有需要导出的图片文件加入队列
        Util.showProgress(20, '正在保存图片文件...');
        exportFiles = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].type === 'Image' && items[i].getValue() && (typeof items[i].getValue() !== 'string')) {
                exportFiles.push(items[i]);
            }
        }
        // 创建图片文件夹
        FS.createFolder(fs.root, currentTask + 'img',
            function () {
                // 开始保存图片文件
                doSaveFiles();
            },
            function (e) {
                console.log(e);
                Util.hideProgress();
                Util.showAlert(e.message || '生成文件夹出错！');
            });
    }

    /**
     * 导出zip包
     */
    function doExportZip() {
        Util.showProgress(80, '正在打包配置文件...');
        var zipFs = new zip.fs.FS();
        // 将FileSystem目录导入zipFS
        fs.root.getDirectory('work', {create: false}, function (dirEntry) {
            zipFs.root.addFileEntry(dirEntry, function () {
                // 将zipFS转换为Blob然后下载
                zipFs.exportBlob(function (b) {
                        Util.showProgress(100, '打包完毕，准备下载...');
                        setTimeout(function () {
                            Util.hideProgress();
                            var link = document.createElement('a');
                            link.href = URL.createObjectURL(b);
                            link.download = 'theme_' + (new Date()).getTime() + '.zip';
                            link.click();
                        }, 100);
                    },
                    function (e) {
                    },
                    function (e) {
                        console.log(e);
                        Util.showAlert('配置文件打包失败：' + (e.message || '未知错误'));
                    });
            }, function (e) {
                console.log(e);
                Util.showAlert('配置文件打包失败：' + (e.message || '未知错误'));
            });
        }, function (e) {
            console.log(e);
            Util.showAlert('配置文件打包失败：' + (e.message || '未知错误'));
        });
    }

    /**
     * 重置配置
     */
    function doReset(silent, callback) {
        function resetProcess() {
            FS.removeFolder(fs.root, currentTask, function () {
                    // 清理目录成功
                    items.forEach(function (item) {
                        item.reset();
                    });
                    if (typeof callback === 'function') {
                        callback();
                    }
                },
                function (e) {
                    console.log(e);
                    if (e.name === 'NotFoundError') {
                        // 清理目录成功
                        items.forEach(function (item) {
                            item.reset();
                        });
                        if (typeof callback === 'function') {
                            callback();
                        }
                    } else {
                        Util.hideProgress();
                        Util.showAlert('清理工作目录失败：' + (e.message || '未知错误'));
                    }
                });
        }

        if (silent) {
            resetProcess();
        } else {
            Util.showAlert('确定要重置所有配置？', resetProcess,
                function () {
                    // 什么也不做
                });
        }
    }

    var previewTimer = null;

    /**
     * 预览
     */
    function doPreview() {
        Util.showProgress(80, '正在准备预览……')
        FS.readFile(fs.root, 'preview/js/previewHack.js', 'Text',
            function () {
                // 成功说明已经存在预览文件，不再解压缩
                preparePreview();
            },
            function () {
                // 失败可能是文件不存在，解压
                // 第二步打开zip文件检查文件内容
                var zipFs = new zip.fs.FS();

                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'res/preview.zip', true);
                xhr.responseType = 'blob';

                xhr.onload = function (e) {
                    if (this.status === 200) {
                        // Chrome Extension无法获取到Content-Length，
                        zipFs.importBlob(this.response,
                            function () {
                                // zip导入成功
                                zipFs.root.getFileEntry(fs.root,
                                    function () {
                                        // 已经解压成功
                                        preparePreview();
                                    }, null,
                                    function (e) {
                                        console.log(e);
                                        Util.hideProgress();
                                        Util.showAlert('准备预览出错：' + (e.message || '未知错误'));
                                    });
                            },
                            function (e) {
                                console.log(e);
                                Util.hideProgress();
                                Util.showAlert('准备预览出错：' + (e.message || '未知错误'));
                            });
                    }
                };
                xhr.onerror = function (e) {
                    console.log(e);
                };
                xhr.send();
            });
    }

    /**
     * 预览前最后一步
     */
    function preparePreview() {
        function copyTheme() {
            Util.showProgress(100, '正在准备预览……');
            FS.copyFolder(fs.root, 'work/theme', 'preview',
                function (dirEntry) {
                    Util.hideProgress();
                    // 设置四个窗口预览路径
                    var path = dirEntry.toURL();
                    var previewDir = path + '/../html/';
                    var url1 = previewDir + 'snsIndex.html?user=new';
                    var url2 = previewDir + 'snsIndex.html?user=old';
                    var url3 = previewDir + 'appIndex.html?user=already';
                    var url4 = previewDir + 'inviteIndex.html?user=old';
                    $('iframe').attr('src', 'about:blank');
                    $('#tab_1 iframe').attr('src', url1);
                    $('#tab_2 iframe').attr('src', url2);
                    $('#tab_3 iframe').attr('src', url3);
                    $('#tab_4 iframe').attr('src', url4);
                    // 动态计算窗口高度
                    var height = $(window).height() - 130;
                    height = height > 850 ? 850 : height;
                    $('#previewDialog .tab-content').height(height);
                    $('#previewDialog .tab-content').css('overflow-y', 'auto');
                    $('#previewDialog').show();
                    startPreviewTimer();
                },
                function (e) {
                    console.log(e);
                    Util.hideProgress();
                });
        }

        // 已经存在的目录直接拷贝会出错，所以先删除目标目录
        FS.removeFolder(fs.root, 'preview/theme',
            function () {
                copyTheme();
            },
            function () {
                copyTheme();
            });
    }

    /**
     * 定时刷新iframe高度
     */
    function startPreviewTimer() {
        previewTimer = setInterval(function () {
            $('iframe').each(function () {
                $(this).height($($(this)[0].contentWindow.document).height());
            });
        }, 1000);
    }

    /**
     * 从zip文件导入配置
     */
    function doImportTheme() {
        if ($('#importThemeFile')[0].files.length === 0) {
            Util.showAlert('请选择文件！');
            return;
        }

        var file = $('#importThemeFile')[0].files[0];
        if (file.name.lastIndexOf('.zip') !== file.name.length - 4) {
            Util.showAlert('请选择.zip格式文件！');
            return;
        }

        // 开始导入
        $('#importDialog').hide();
        Util.showProgress(20, '正在清理工作空间……');

        // 第一步重置配置
        doReset(true, function () {
            // 第二步打开zip文件检查文件内容
            var zipFs = new zip.fs.FS();
            Util.showProgress(40, '正在读取zip包……');

            var reader = new FileReader();
            reader.onloadend = function (e) {
                Util.showProgress(60, '正在导入zip包……');
                zipFs.importData64URI(this.result,
                    function () {
                        // zip导入成功
                        Util.showProgress(80, '正在解压缩文件……');
                        zipFs.root.getFileEntry(workDir,
                            function () {
                                // 已经解压成功，重新走页面初始化
                                initPageData();
                            }, null,
                            function (e) {
                                console.log(e);
                                Util.hideProgress();
                                Util.showAlert('导入文件出错：' + (e.message || '未知错误'));
                            });
                    },
                    function (e) {
                        console.log(e);
                        Util.hideProgress();
                        Util.showAlert('导入文件出错：' + (e.message || '未知错误'));
                    });
            };
            reader.onerror = function (e) {
                console.log(e);
                Util.hideProgress();
                Util.showAlert('导入文件出错：' + (e.message || '未知错误'));
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * 从网络导入主题配置
     */
    function doImportFromNetwork() {

    }

    // 初始化页面
    initPage(initPageData);

    // 初始化页面事件
    initEvent();
});
