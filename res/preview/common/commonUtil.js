/**
 * 注意：本文件不要与旧版common.js和cordova.js混用
 * wallet_web工具函数集
 */

/**
 * http://git.oschina.net/loonhxl/jbase64/blob/master/jbase64.js
 * BASE64 Encode and Decode By UTF-8 unicode
 * 可以和java的BASE64编码和解码互相转化
 */
(function () {
    var BASE64_MAPPING = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ];

    /**
     *ascii convert to binary
     */
    var _toBinary = function (ascii) {
        var binary = new Array();
        while (ascii > 0) {
            var b = ascii % 2;
            ascii = Math.floor(ascii / 2);
            binary.push(b);
        }
        /*
         var len = binary.length;
         if(6-len > 0){
         for(var i = 6-len ; i > 0 ; --i){
         binary.push(0);
         }
         }*/
        binary.reverse();
        return binary;
    };

    /**
     *binary convert to decimal
     */
    var _toDecimal = function (binary) {
        var dec = 0;
        var p = 0;
        for (var i = binary.length - 1; i >= 0; --i) {
            var b = binary[i];
            if (b == 1) {
                dec += Math.pow(2, p);
            }
            ++p;
        }
        return dec;
    };

    /**
     *unicode convert to utf-8
     */
    var _toUTF8Binary = function (c, binaryArray) {
        var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
        var fatLen = binaryArray.length;
        var diff = mustLen - fatLen;
        while (--diff >= 0) {
            binaryArray.unshift(0);
        }
        var binary = [];
        var _c = c;
        while (--_c >= 0) {
            binary.push(1);
        }
        binary.push(0);
        var i = 0, len = 8 - (c + 1);
        for (; i < len; ++i) {
            binary.push(binaryArray[i]);
        }

        for (var j = 0; j < c - 1; ++j) {
            binary.push(1);
            binary.push(0);
            var sum = 6;
            while (--sum >= 0) {
                binary.push(binaryArray[i++]);
            }
        }
        return binary;
    };

    var __BASE64 = {
        /**
         *BASE64 Encode
         */
        encoder: function (str) {
            var base64_Index = [];
            var binaryArray = [];
            for (var i = 0, len = str.length; i < len; ++i) {
                var unicode = str.charCodeAt(i);
                var _tmpBinary = _toBinary(unicode);
                if (unicode < 0x80) {
                    var _tmpdiff = 8 - _tmpBinary.length;
                    while (--_tmpdiff >= 0) {
                        _tmpBinary.unshift(0);
                    }
                    binaryArray = binaryArray.concat(_tmpBinary);
                } else if (unicode >= 0x80 && unicode <= 0x7FF) {
                    binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
                } else if (unicode >= 0x800 && unicode <= 0xFFFF) {//UTF-8 3byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
                } else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {//UTF-8 4byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
                } else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {//UTF-8 5byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
                } else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {//UTF-8 6byte
                    binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
                }
            }

            var extra_Zero_Count = 0;
            for (var i = 0, len = binaryArray.length; i < len; i += 6) {
                var diff = (i + 6) - len;
                if (diff == 2) {
                    extra_Zero_Count = 2;
                } else if (diff == 4) {
                    extra_Zero_Count = 4;
                }
                //if(extra_Zero_Count > 0){
                //	len += extra_Zero_Count+1;
                //}
                var _tmpExtra_Zero_Count = extra_Zero_Count;
                while (--_tmpExtra_Zero_Count >= 0) {
                    binaryArray.push(0);
                }
                base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
            }

            var base64 = '';
            for (var i = 0, len = base64_Index.length; i < len; ++i) {
                base64 += BASE64_MAPPING[base64_Index[i]];
            }

            for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
                base64 += '=';
            }
            return base64;
        },
        /**
         *BASE64  Decode for UTF-8
         */
        decoder: function (_base64Str) {
            var _len = _base64Str.length;
            var extra_Zero_Count = 0;
            /**
             *计算在进行BASE64编码的时候，补了几个0
             */
            if (_base64Str.charAt(_len - 1) == '=') {
                //alert(_base64Str.charAt(_len-1));
                //alert(_base64Str.charAt(_len-2));
                if (_base64Str.charAt(_len - 2) == '=') {//两个等号说明补了4个0
                    extra_Zero_Count = 4;
                    _base64Str = _base64Str.substring(0, _len - 2);
                } else {//一个等号说明补了2个0
                    extra_Zero_Count = 2;
                    _base64Str = _base64Str.substring(0, _len - 1);
                }
            }

            var binaryArray = [];
            for (var i = 0, len = _base64Str.length; i < len; ++i) {
                var c = _base64Str.charAt(i);
                for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
                    if (c == BASE64_MAPPING[j]) {
                        var _tmp = _toBinary(j);
                        /*不足6位的补0*/
                        var _tmpLen = _tmp.length;
                        if (6 - _tmpLen > 0) {
                            for (var k = 6 - _tmpLen; k > 0; --k) {
                                _tmp.unshift(0);
                            }
                        }
                        binaryArray = binaryArray.concat(_tmp);
                        break;
                    }
                }
            }

            if (extra_Zero_Count > 0) {
                binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
            }

            var unicode = [];
            var unicodeBinary = [];
            for (var i = 0, len = binaryArray.length; i < len;) {
                if (binaryArray[i] == 0) {
                    unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
                    i += 8;
                } else {
                    var sum = 0;
                    while (i < len) {
                        if (binaryArray[i] == 1) {
                            ++sum;
                        } else {
                            break;
                        }
                        ++i;
                    }
                    unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
                    i += 8 - sum;
                    while (sum > 1) {
                        unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
                        i += 8;
                        --sum;
                    }
                    unicode = unicode.concat(_toDecimal(unicodeBinary));
                    unicodeBinary = [];
                }
            }
            return unicode;
        }
    };

    window.BASE64 = __BASE64;
})();

(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    // 环境变量
    UP.W.Env = UP.W.Env || {};
    // 工具函数
    UP.W.Util = UP.W.Util || {};


    /** ========== 工具函数相关 ========== **/
    var util = UP.W.Util;

    /**
     * 将URL查询参数转换为Object
     * @param str：可选参数，如果不传入默认解析当前页面查询参数
     * @returns {{object}}
     */
    util.urlQuery2Obj = function (str) {
        if (!str) {
            str = location.search;
        }

        if (str[0] === '?' || str[0] === '#') {
            str = str.substring(1);
        }
        var query = {};

        str.replace(/\b([^&=]*)=([^&=]*)/g, function (m, a, d) {
            if (typeof query[a] !== 'undefined') {
                query[a] += ',' + decodeURIComponent(d);
            } else {
                query[a] = decodeURIComponent(d);
            }
        });

        return query;
    };

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * formatDate(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     * @param date 日期对象
     * @param fmt 格式化字符串
     * @returns {*}
     */
    util.formatDate = function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    /**
     * 格式化金额
     * @param money 原始金额（数字或字符串格式）
     * @param digit 小数点后位数
     * @param thousands 是否千分位格式化
     * @returns {*}
     */
    util.formatMoney = function (money, digit, thousands) {
        // 默认两位小数
        if (typeof digit !== 'number' || digit < 0 || digit > 20) {
            digit = 2;
        }
        // 小数处理
        money = parseFloat((money + '').replace(/[^\d\.-]/g, '')).toFixed(digit) + '';
        // 千分位处理
        if (thousands) {
            var l = money.split('.')[0].split('').reverse(),
                r = money.split('.')[1];
            var t = '';
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
            }
            return t.split('').reverse().join('') + "." + r;
        } else {
            return money;
        }
    };

    /**
     * 格式化卡账号
     * @param pan
     */
    util.formatPan = function (pan) {
        if (typeof pan === 'string') {
            // 消除空格和非数字，增加空格
            return pan.replace(/\s/g, '').replace(/(\S{4})(?=\S)/g, '$1 ');
        } else {
            return '';
        }
    };

    /**
     * 格式化手机号
     * @param mobile
     * @returns {*}
     */
    util.formatMobile = function (mobile) {
        if (typeof mobile === 'string') {
            // 消除空格和非数字，增加空格
            return mobile.replace(/\D/g, '').replace(new RegExp('(^\\d{3})(\\d{1,4})', 'g'), '$1 $2 ');
        } else {
            return '';
        }
    };

    /**
     * 对输入框内用户输入的卡账号进行格式化
     * 警告：不要在通过该函数格式化的输入框内监听用户输入时间对value进行修改，否则可能导致冲突
     * @param element
     * @param formatType
     * @param formatFunc
     */
    util.formatInput = function (element, formatType, formatFunc) {
        // 绑定或取消绑定事件
        $(element).on('input', function () {
            if (!formatFunc) {
                if (formatType === '344') {
                    formatFunc = function (str) {
                        return $.trim(str.replace(new RegExp('(^\\d{3})(\\d{1,4})', 'g'), '$1 $2 '));
                    };
                } else {
                    formatFunc = function (str) {
                        return str.replace(new RegExp('(\\d{4})(?=\\d)', 'g'), '$1 ');
                    };
                }
            }
            return function () {
                var $el = $(this);
                var curValue = $el.val();
                var curCleanValue = curValue.replace(/\D/g, '');
                var oldValue = $el.attr('data-oldValue') || '';
                var oldCleanValue = oldValue.replace(/\D/g, '');
                var formatValue = formatFunc(curCleanValue);
                var curPos = $el[0].selectionStart;
                var isEnd = (curPos === curValue.length);

                // 内容没有变化
                if (curValue === oldValue) {
                    return;
                }

                $el.val(formatValue);
                $el.attr('data-oldValue', formatValue);

                if (isEnd) {
                    // 在行末添加，直接光标设置回行末
                    $el[0].setSelectionRange(formatValue.length, formatValue.length);
                } else if (curValue.length > oldValue.length) {
                    // 输入了新的内容
                    if (curCleanValue === oldCleanValue) {
                        // 内容一致，说明输入了非法内容
                        $el[0].setSelectionRange(curPos - 1, curPos - 1);
                    } else {
                        $el[0].setSelectionRange(curPos, curPos);
                    }
                } else if (curValue.length < oldValue.length) {
                    // 删除了内容，无论空格或有效值，光标位置不变
                    $el[0].setSelectionRange(curPos, curPos);
                }
            };
        }());
    };

    /**
     * 对HTML进行转义
     * @param html 待转义的HTML字符串
     * @returns {*}
     */
    util.htmlEncode = function (html) {
        var temp = document.createElement("div");
        temp.textContent = html;
        var output = temp.innerHTML;
        temp = null;
        return output;
    };

    /**
     * 对HTML进行逆转义
     * @param html 待逆转义的HTML字符串
     * @returns {*}
     */
    util.htmlDecode = function (html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        var output = temp.textContent;
        temp = null;
        return output;
    };

    /**
     * Base64编码
     * @param str
     * @returns {string}
     */
    util.base64Encode = function (str) {
        return BASE64.encoder(str);
    };

    /**
     * Base64解码
     * @param str
     * @returns {string}
     */
    util.base64Decode = function (str) {
        var unicode = BASE64.decoder(str);//返回会解码后的unicode码数组。
        str = [];
        for (var i = 0, len = unicode.length; i < len; ++i) {
            str.push(String.fromCharCode(unicode[i]));
        }
        return str.join('');
    };

    /**
     * 移植自underscore的模板
     * @param text 模板文本
     * @param data 数据（可选参数）
     * @returns {*}
     */
    util.template = function (text, data) {
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
            return render(data, util);
        }
        var template = function (data) {
            return render.call(this, data, util);
        };

        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

    /**
     * 内部函数，动态加载脚本文件
     * @param url
     */
    util.loadScript = function (url) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    /**
     * 向微信php后台发送请求
     * @param path
     * @param data
     * @param success
     * @param fail
     */
    util.sendMessageWeChat = function (path, data, success, fail) {
        $.ajax({
            type: "GET",
            url: env.pathWechatServer + path,
            dataType: "json",
            data: data,
            success: function (data) {
                if (success) {
                    success(data);
                }
            },
            error: function (err) {
                if (fail) {
                    fail(err);
                }
            }
        });
    };

    /** ========== 环境变量相关 ========== **/
    var env = UP.W.Env;
    var agent = navigator.userAgent.toLowerCase();
    // 是否在钱包客户端内
    env.isInsideWalletApp = (/com.unionpay.chsp/.test(agent)) || (/com.unionpay.mobilepay/.test(agent)) || (/(updebug)/.test(agent));
    // 是否运行在iOS内
    env.isIOS = /iphone|ipad|ipod/.test(agent);
    // 是否运行在Android内
    env.isAndrid = (/android/.test(agent));

    if (env.isInsideWalletApp) {
        // 设备运行模式
        // '0'：生产；'1'：测试；'2'：开发
        env.appMode = /\(updebug\s(\d+)\)/g.exec(agent)[1];
        // 客户端版本号
        env.appVer = /\(version\s(\d+)\)/g.exec(agent)[1];
    } else {
        switch (location.hostname) {
            case 'youhui.95516.com':
            case 'wallet.95516.com':
                env.appMode = '0';
                break;
            case '172.17.249.30':
            case '172.18.64.46':
                env.appMode = '1';
                break;
            case '172.18.179.10':
            case '172.18.179.11':
                env.appMode = '2';
                break;
            default:
                env.appMode = '888';
        }

        env.appVer = '';
    }
    // 允许强制通过URL参数指定appMode
    var urlQuery = util.urlQuery2Obj();
    if (typeof urlQuery.appMode === 'string') {
        env.appMode = urlQuery.appMode;
    }

    /**
     * 当前运行的社交平台
     * 'WeChat'：微信
     * 'QQ': QQ
     * 'Qzone': QQ空间
     * 'WeiBo'：新浪微博
     */
    env.platform = (function () {
        if (/micromessenger/.test(agent)) {
            return 'WeChat';
        } else if (/ qq\//.test(agent)) {
            return 'QQ';
        } else if (/ qzone\//.test(agent)) {
            return 'QZone';
        } else if (/ weibo/.test(agent)) {
            return 'WeiBo';
        } else {
            return 'Other';
        }
    })();

    /**
     * Wallet服务器地址
     */
    env.pathWalletHost = (function () {
        return {
            '0': location.protocol + '//wallet.95516.com',    //生产
            '1': 'http://172.17.249.30:8085',   //开发 内网
            '2': 'http://172.18.179.10',      // 测试外网
            '888': 'http://localhost:3000'      //本地测试
        }[env.appMode];
    })();

    /**
     * Youhui服务器地址
     */
    env.pathYouhuiHost = (function () {
        return {
            '0': location.protocol + '//youhui.95516.com',     // 生产
            '1': 'http://172.18.64.46:36080',   // 开发内网, 无外网IP
            '2': 'http://172.18.179.11',      // 测试外网
            '888': 'http://localhost:3000'      // 本地测试
        }[env.appMode];
    })();

    /**
     * 微信服务器地址
     */
    env.pathWechatHost = (function () {
        return {
            '0': location.protocol + '//wallet.95516.net',     // 生产
            '1': 'http://172.18.179.10',      // 开发内网, 无外网IP
            '2': 'http://172.18.179.10',      // 测试外网
            '888': 'http://172.18.179.10'     // 本地测试
        }[env.appMode];
    })();

    /**
     * Wallet服务器资源地址
     */
    env.pathWalletRes = (function () {
        return {
            '0': env.pathWalletHost + '/s/wl',          // 生产
            '1': env.pathWalletHost + '/wallet/res',    // 开发 内网
            '2': env.pathWalletHost + '/s/wl',          // 测试外网
            '888': (urlQuery.notWallet ? env.pathWalletHost + '' : 'http://' + location.host)       // 本地测试
        }[env.appMode];
    })();

    /**
     * Wallet服务器请求地址
     */
    env.pathWalletServer = (function () {
        return {
            '0': env.pathWalletHost + '/wl/webentry',          //生产
            '1': env.pathWalletHost + '/wallet/webentry',      //开发 外网
            '2': env.pathWalletHost + '/wl/webentry',          // 测试外网
            '888': 'http://172.17.249.30:35363' + '/gateway/webentry'   // localhost 时，请求默认指向开发环境
        }[env.appMode];
    })();

    /**
     * Youhui服务器请求地址
     */
    env.pathYouhuiServer = (function () {
        return {
            0: env.pathYouhuiHost + '/wm-non-biz-web/v3',     //生产
            1: env.pathYouhuiHost + '/wm-non-biz-web/v3',     //开发内网, 无外网IP
            2: env.pathYouhuiHost + '/wm-non-biz-web/v3',     // 测试外网
            888: 'http://172.18.179.11' + '/wm-non-biz-web/v3' //本地测试
        }[env.appMode];
    }());

    /**
     * 微信服务器请求地址
     */
    env.pathWechatServer = (function () {
        return env.pathWechatHost + '/upweixin/server/';
    })();

    /**
     * 管理平台上传图标文件目录
     */
    env.pathIconForder = env.pathWalletHost + '/icon/default/';

    /**
     * 当前页面路径
     */
    env.currentPath = (function () {
        var path = location.origin + location.pathname;
        return path.replace(/\/(\w)+(\.html)/g, '/');
    })();

})(Zepto, window.UP = window.UP || {});