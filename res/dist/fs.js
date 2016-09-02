$(function () {
    "use strict";

    var FS = window.FS = {
        /**
         * 初始化FileSystem
         * @param onSuccess 成功回调
         * @param onError   失败回调
         * @param type      类型（TEMPORARY/PERSISTENT)
         * @param size      大小（字节数）
         */
        initFileSystem: function (onSuccess, onError, type, size) {
            type = type || window.TEMPORARY;
            size = size || 5 * 1024 * 1024;
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(type, size, onSuccess, onError);
        },

        /**
         * 创建目录
         * @param rootDir   FileSystem根对象
         * @param path      文件路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        createFolder: function (rootDir, path, onSuccess, onError) {
            var folders = path;
            if (typeof path === 'string') {
                path.replace('\\', '/');
                folders = path.split('/');
            }
            // 一层层递归
            rootDir.getDirectory(folders[0], {create: true}, function (dirEntry) {
                if (folders.length) {
                    FS.createFolder(dirEntry, folders.slice(1), onSuccess, onError);
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(rootDir);
                    }
                }
            }, onError);
        },

        /**
         * 删除目录
         * @param rootDir   FileSystem根对象
         * @param path      文件夹路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        removeFolder: function (rootDir, path, onSuccess, onError) {
            rootDir.getDirectory(path, {}, function (dirEntry) {
                dirEntry.removeRecursively(function () {
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }
                }, onError);
            }, onError);
        },

        /**
         * 列出目录内容
         * @param rootDir   FileSystem根对象
         * @param path      文件夹路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        listFolder: function (rootDir, path, onSuccess, onError) {
            rootDir.getDirectory(path, {create: false}, function (dirEntry) {
                var dirReader = dirEntry.createReader();
                var entries = [];

                // Call the reader.readEntries() until no more results are returned.
                var readEntries = function () {
                    dirReader.readEntries(function (results) {
                        if (!results.length) {
                            if (typeof onSuccess === 'function') {
                                onSuccess(entries.sort());
                            }
                        } else {
                            entries = entries.concat(Array.prototype.slice.call(results || [], 0));
                            readEntries();
                        }
                    }, onError);
                };
                readEntries();
            }, onError);
        },

        /**
         * 拷贝文件夹
         * @param rootDir   FileSystem根对象
         * @param src       源路径
         * @param dest      目标路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        copyFolder: function (rootDir, src, dest, onSuccess, onError) {
            rootDir.getDirectory(src, {}, function (dirEntry1) {
                rootDir.getDirectory(dest, {}, function (dirEntry2) {
                    dirEntry1.copyTo(dirEntry2, dirEntry1.name, onSuccess, onError);
                }, onError);

            }, onError);
        },

        /**
         * 移动目录
         * @param rootDir   FileSystem根对象
         * @param src       源目录
         * @param dest      目标目录
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        moveFolder: function (rootDir, src, dest, onSuccess, onError) {
            dest.replace('\\', '/');
            dest = dest.split('/');
            var dirName = dest.splice(dest.length - 1, 1).join('');
            var path = dest.join('/');
            rootDir.getDirectory(src, {}, function (dirEntry) {
                rootDir.getDirectory(path, {}, function (pDirEntry) {
                    dirEntry.moveTo(pDirEntry, dirName, onSuccess, onError);
                }, onError);
            }, onError);
        },

        /**
         * 删除文件
         * @param rootDir   FileSystem根对象
         * @param path      文件路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        removeFile: function (rootDir, path, onSuccess, onError) {
            rootDir.getFile(path, {}, function (fileEntry) {

                fileEntry.remove(function () {
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }
                }, onError);

            }, onError);
        },

        /**
         * 写入文件
         * @param rootDir   FileSystem根对象
         * @param content   写入内容（String/Blob/File）
         * @param path      文件路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        writeFile: function (rootDir, content, path, onSuccess, onError) {
            rootDir.getFile(path, {create: true}, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    var type = content.toString(), file;
                    switch (type) {
                        case '[object Blob]':
                        case '[object File]':
                            file = content;
                            break;
                        default:
                            file = new Blob([content]);
                    }
                    // fileWriter.seek(0);
                    fileWriter.truncate(0);
                    setTimeout(function(){
                        fileWriter.onwriteend = function (e) {
                            if (typeof onSuccess === 'function') {
                                onSuccess(e);
                            }
                        };

                        fileWriter.onerror = function (e) {
                            if (typeof onError === 'function') {
                                onError(e);
                            }
                        };
                        fileWriter.write(file);
                    }, 100);
                }, onError);
            }, onError);
        },

        /**
         * 从服务器直接下载文件到FileSystem
         * @param rootDir   FileSystem根对象
         * @param url       文件的服务器路径
         * @param path      文件路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        downloadFile: function (rootDir, url, path, onSuccess, onError) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function (e) {
                if (this.status === 200) {
                    FS.writeFile(rootDir, new Blob([xhr.response]), path, onSuccess, onError);
                } else {
                    if (typeof onError === 'function') {
                        onError(e);
                    }
                }
            };

            xhr.send(null);
        },

        /**
         * 读取文件内容
         * @param rootDir   FileSystem根对象
         * @param path      文件路径
         * @param type      读取类型（arrayBuffer/dataUrl/binaryString/text）
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        readFile: function (rootDir, path, type, onSuccess, onError) {
            type = type || 'text';
            rootDir.getFile(path, {}, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(this.result);
                        }
                    };
                    reader.onerror = onError;

                    switch (type.toLocaleString()) {
                        case 'arraybuffer':
                            reader.readAsArrayBuffer(file);
                            break;
                        case 'dataurl':
                            reader.readAsDataURL(file);
                            break;
                        case 'binarystring':
                            reader.readAsBinaryString(file);
                            break;
                        default:
                            reader.readAsText(file);
                            break;
                    }
                }, onError);

            }, onError);
        },

        /**
         * 拷贝文件
         * @param rootDir
         * @param src
         * @param dest
         * @param onSuccess
         * @param onError
         */
        copyFile: function (rootDir, src, dest, onSuccess, onError) {
            rootDir.getFile(src, {}, function (fileEntry) {
                rootDir.getDirectory(dest, {}, function (dirEntry) {
                    fileEntry.copyTo(dirEntry, fileEntry.name, onSuccess, onError);
                }, onError);

            }, onError);
        },

        /**
         * 移动文件
         * @param rootDir   FileSystem根对象
         * @param src       源路径
         * @param dest      目标路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        moveFile: function (rootDir, src, dest, onSuccess, onError) {
            dest.replace('\\', '/');
            dest = dest.split('/');
            var fileName = dest.splice(dest.length - 1, 1).join('');
            var dirName = dest.join('/');
            rootDir.getFile(src, {}, function (fileEntry) {
                rootDir.getDirectory(dirName, {}, function (dirEntry) {
                    fileEntry.moveTo(dirEntry, fileName, onSuccess, onError);
                }, onError);
            }, onError);
        },

        /**
         * 获取文件的FileSystem URL
         * @param rootDir   FileSystem根对象
         * @param path      文件路径
         * @param onSuccess 成功回调
         * @param onError   失败回调
         */
        getFileUrl: function (rootDir, path, onSuccess, onError) {
            rootDir.getFile(path, {}, function (fileEntry) {
                var url = fileEntry.toURL();
                if (typeof onSuccess === 'function') {
                    onSuccess(url);
                }
            }, onError);
        }
    };

    var fileSystem = null;

    FS.initFileSystem(function (fs) {
            fileSystem = fs;
        },
        function (e) {
            alert(e.toString());
        });

    $('#saveInputButton').bind('click', function () {
        var files = document.getElementById('newFile').files;
        if (files.length > 0) {
            FS.writeFile(fileSystem.root, files[0], 'input.txt', function () {
                    console.log('success');
                },
                function (e) {
                    console.log(e);
                });
        }
    });

    $('#saveTextButton').bind('click', function () {
        FS.writeFile(fileSystem.root, '我是中国人\r\nAAAAAAA', 'text.txt', function () {
                console.log('success');
            },
            function (e) {
                console.log(e);
            });
    });

    $('#downloadFileButton').bind('click', function () {
        FS.downloadFile(fileSystem.root, 'http://localhost:63342/TestServer/public/test/filesystem/bg_kb.jpg', 'file.jpg', function () {
                console.log('success');
            },
            function (e) {
                console.log(e);
            });
    });

    $('#listDirButton').bind('click', function () {
        FS.listFolder(fileSystem.root, 'theme', function (list) {
                console.log(list);
            },
            function (e) {
                console.log(e);
            });
    });

    $('#getFileUrlButton').bind('click', function () {
        FS.getFileUrl(fileSystem.root, 'file.txt', function (url) {
                console.log(url);
            },
            function (e) {
                console.log(e);
            });
    });

    $('#moveFileButton').bind('click', function () {
        FS.moveFile(fileSystem.root, 'file.jpg', 'theme/aaa.jpg', function () {
                console.log();
            },
            function (e) {
                console.log(e);
            });
    });

    $('#moveFolderButton').bind('click', function () {
        FS.moveFolder(fileSystem.root, 'theme', 'theme2', function () {
                console.log();
            },
            function (e) {
                console.log(e);
            });
    });
});