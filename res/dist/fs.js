$(function () {
    "use strict";

    var FS = window.FS = {
        /**
         * ��ʼ��FileSystem
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
         * @param type      ���ͣ�TEMPORARY/PERSISTENT)
         * @param size      ��С���ֽ�����
         */
        initFileSystem: function (onSuccess, onError, type, size) {
            type = type || window.TEMPORARY;
            size = size || 5 * 1024 * 1024;
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(type, size, onSuccess, onError);
        },

        /**
         * ����Ŀ¼
         * @param rootDir   FileSystem������
         * @param path      �ļ�·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
         */
        createFolder: function (rootDir, path, onSuccess, onError) {
            var folders = path;
            if (typeof path === 'string') {
                path.replace('\\', '/');
                folders = path.split('/');
            }
            // һ���ݹ�
            rootDir.getDirectory(folders[0], {create: true}, function (dirEntry) {
                if (folders.length) {
                    FS.createFolder(dirEntry, folders.slice(1), null, onError);
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }
                }
            }, onError);
        },

        /**
         * ɾ��Ŀ¼
         * @param rootDir   FileSystem������
         * @param path      �ļ���·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
         * �г�Ŀ¼����
         * @param rootDir   FileSystem������
         * @param path      �ļ���·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
         * �ƶ�Ŀ¼
         * @param rootDir   FileSystem������
         * @param src       ԴĿ¼
         * @param dest      Ŀ��Ŀ¼
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
         * ɾ���ļ�
         * @param rootDir   FileSystem������
         * @param path      �ļ�·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
         * д���ļ�
         * @param rootDir   FileSystem������
         * @param content   д�����ݣ�String/Blob/File��
         * @param path      �ļ�·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
         */
        writeFile: function (rootDir, content, path, onSuccess, onError) {
            rootDir.getFile(path, {create: true}, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwrite = function (e) {
                        if (typeof onSuccess === 'function') {
                            onSuccess(e);
                        }
                    };

                    fileWriter.onerror = function (e) {
                        if (typeof onError === 'function') {
                            onError(e);
                        }
                    };

                    var type = content.toString(), file;
                    switch (type) {
                        case '[object Blob]':
                        case '[object File]':
                            file = content;
                            break;
                        default:
                            file = new Blob([content]);
                    }

                    fileWriter.write(file);
                }, onError);
            }, onError);
        },

        /**
         * �ӷ�����ֱ�������ļ���FileSystem
         * @param rootDir   FileSystem������
         * @param url       �ļ��ķ�����·��
         * @param path      �ļ�·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
         * ��ȡ�ļ�����
         * @param rootDir   FileSystem������
         * @param path      �ļ�·��
         * @param type      ��ȡ���ͣ�arrayBuffer/dataUrl/binaryString/text��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
         * �����ļ�
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
         * �ƶ��ļ�
         * @param rootDir   FileSystem������
         * @param src       Դ·��
         * @param dest      Ŀ��·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
         * ��ȡ�ļ���FileSystem URL
         * @param rootDir   FileSystem������
         * @param path      �ļ�·��
         * @param onSuccess �ɹ��ص�
         * @param onError   ʧ�ܻص�
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
        FS.writeFile(fileSystem.root, '�����й���\r\nAAAAAAA', 'text.txt', function () {
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