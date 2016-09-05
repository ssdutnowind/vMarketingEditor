$(function () {
    "use strict";
    var Util = window.Util;
    var FS = window.FS;
    var EDITOR_CONFIG = window.EDITOR_CONFIG;
    var FormItems = window.FormItems;
    // zip.js需要指定webworker目录
    zip.workerScriptsPath = 'res/plugins/zip/';

    // FileSystem
    var fs = null;
    // 当前工作目录
    var workDir = null;
    var currentTask = 'work/theme/';

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

                        if (typeof callback === 'function') {
                            callback();
                        }

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
     * 清理预览空间
     * @param callback
     */
    function doClearPreview(callback) {
        Util.showProgress(100, '正在清理预览包……');
        FS.removeFolder(fs.root, 'preview', function () {
                Util.hideProgress();
                Util.showAlert('清理完毕！', function () {
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            },
            function (e) {
                Util.hideProgress();
                Util.showAlert('清理完毕：' + (e.message || '（未知错误）'));
            });
    }

    /**
     * 清理配置文件
     */
    function doClearConfig() {
        Util.showProgress(100, '正在清理配置文件……');
        FS.removeFile(fs.root, 'editorConfig.js', function () {
                Util.hideProgress();
                Util.showAlert('清理完毕！');
            },
            function (e) {
                Util.hideProgress();
                Util.showAlert('清理完毕：' + (e.message || '（未知错误）'));
            });
    }

    /**
     * 导入配置文件
     */
    function doImportConfig() {
        var files = $('#fileConfigJS')[0].files;
        if (files.length === 0) {
            Util.showAlert('请选择文件！');
            return;
        }
        var file = files[0];
        if (file.name.indexOf('.js') < 0) {
            Util.showAlert('请选择正确的文件！');
            return;
        }

        FS.writeFile(fs.root, file, 'editorConfig.js', function () {
                Util.hideProgress();
                Util.showAlert('导入完毕！');
            },
            function (e) {
                Util.hideProgress();
                Util.showAlert('导入失败：' + (e.message || '（未知错误）'));
            });
    }

    /**
     * 递归遍历
     * @param path
     * @param list
     */
    function listFiles(path, list) {
        FS.listFolder(fs.root, path, function (entrys) {
                for (var i = 0; i < entrys.length; i++) {
                    if (entrys[i].isDirectory === true) {
                        entrys[i].files = [];
                        listFiles(entrys[i].fullPath, entrys[i].files);
                    }

                    list.push(entrys[i]);
                }
            },
            function (e) {
                Util.hideProgress();
                Util.showAlert('遍历工作目录失败：' + (e.message || '（未知错误）'));
            });
    }

    var fileList = [];

    /**
     * 遍历文件系统
     */
    function doListFiles() {
        Util.showProgress(100, '正在遍历工作目录……');
        var path = '';
        fileList = [];
        listFiles(path, fileList);

        setTimeout(function () {
            console.log(fileList);
            var fileTpl = Util.template('<li><a class="<%- color %>" href="<%- href %>" target="_blank"><i class="fa <%- icon %>"></i> <%- name %></a></li>');

            // 生成文件树
            function buildDom(files, $dom) {
                var icon = '', color = '', href = '#';
                var $el = null;
                for (var i = 0; i < files.length; i++) {
                    // 每种文件类型不同的颜色、图标
                    if (files[i].isDirectory) {
                        icon = 'fa-folder-open-o';
                        color = 'text-black';
                        href = '#';
                    } else {
                        if (files[i].name.indexOf('.jpg') >= 0 || files[i].name.indexOf('.png') >= 0) {
                            icon = 'fa-file-image-o';
                            color = 'text-blue';
                        } else if (files[i].name.indexOf('.css') >= 0) {
                            icon = 'fa-file-code-o';
                            color = 'text-yellow';
                        } else if (files[i].name.indexOf('.js') >= 0) {
                            icon = 'fa-file-code-o';
                            color = 'text-red';
                        } else if (files[i].name.indexOf('.html') >= 0) {
                            icon = 'fa-file-code-o';
                            color = 'text-green';
                        } else {
                            icon = 'fa-file-o';
                            color = 'text-black';
                        }
                        // 文件带有超链接
                        href = files[i].toURL();
                    }
                    $el = $(fileTpl({name: files[i].name, icon: icon, color: color, href: href}));
                    $dom.append($el);
                    if (files[i].files && files[i].files.length > 0) {
                        $el = $('<ul class="nav nav-stacked tree"></ul>').appendTo($el);
                        buildDom(files[i].files, $el);
                    }
                }
            }

            buildDom(fileList, $('#treeRoot').empty());

            Util.hideProgress();
        }, 3000);
    }

    /**
     * 初始化页面事件
     */
    function initEvent() {
        // 清理预览包
        $('#buttonClearPreview').bind('click', function () {
            doClearPreview();
        });

        // 导入配置文件
        $('#buttonReplaceConfig').bind('click', doImportConfig);

        // 清理配置文件
        $('#buttonClearConfig').bind('click', doClearConfig);

        // 遍历文件列表
        $('#buttonListFiles').bind('click', doListFiles);

    }

    // 初始化页面
    initPage();

    // 初始化页面事件
    initEvent();
});
