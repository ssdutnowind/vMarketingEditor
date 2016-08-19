/**
 * 注意：
 * 1、本文件不要与旧版common.js和cordova.js、share.js混用
 * 2、本文件依赖于commonUtil.js
 * 3、如果单独引用了任何plugins，本文件将不会自动加载allPluginsMerged.js
 *
 * 本版本还原了官方Cordova的目录结构，cordova.js为Cordova核心代码、cordova_plugins.js为同目录下的插件列表（目前插件列表无实际用处）
 */
(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    // 常量
    UP.W.App = UP.W.App || {};

    var app = UP.W.App;

    /**
     * 初始化Cordova和插件
     */
    var initPlugins = function () {
        // 未加载Cordova则加载Cordova
        if (typeof window.cordova === 'undefined') {
            var platform = UP.W.Env.isIOS ? 'ios' : 'android';
            var version = /\(cordova\s([\d\.]+)\)/g.exec(navigator.userAgent)[1];
            var cordovaPath = UP.W.Env.pathWalletRes + '/web/common/cordova/' + platform + '.' + version + '/cordova.js';
            UP.W.Util.loadScript(cordovaPath);
        }
        // 未加载插件则动态加载allPluginsMerged.js
        if (typeof window.plugins === 'undefined') {
            UP.W.Util.loadScript(UP.W.Env.pathWalletRes + '/web/402/js/UPWebPlugin/allPluginsMerged.js');
        }
    };

    /** ========== 插件相关 ========== **/
    var isWaiting = false;

    /**
     * 运行插件前判断逻辑
     */
    var checkPlugins = function () {
        if (!window.plugins) {
            throw new Error('Plugin is not ready, please listen to "pluginready" event.');
        }
    };

    /**
     * 插件是否准备完毕
     * @returns {boolean}
     */
    app.isPluginReady = function () {
        return !!window.plugins;
    };

    /**
     * 插件初始化完毕后回调
     * @param callback
     */
    app.onPluginReady = function (callback) {
        if (app.isPluginReady()) {
            callback();
        } else {
            document.addEventListener('pluginready', function () {
                callback();
            }, false);
        }
    };

    /** ========== 埋点 ========== **/

    /**
     * 埋点-事件
     * @param name 事件名称
     * @param label 事件标签
     * @param data 埋点数据
     */
    app.logEvent = function (name, label, data) {
        checkPlugins();
        if (data && typeof data !== 'object') {
            console.error('logEvent, data must be object.');
            return;
        }
        var params = {
            name: (name ? name : ''),
            label: (label ? label : ''),
            data: (data ? data : {})
        };

        window.plugins.UPWebAnalysisPlugin.logEvent(null, null, params);
    };

    /**
     * 埋点 - 页面开始
     * @param name 页面名称
     */
    app.logPageBegin = function (name) {
        checkPlugins();
        var params = {
            name: name
        };

        window.plugins.UPWebAnalysisPlugin.logPageBegin(null, null, params);
    };

    /**
     * 埋点 - 页面结束
     * @param name 页面名称
     */
    app.logPageEnd = function (name) {
        checkPlugins();
        var params = {
            name: name
        };

        window.plugins.UPWebAnalysisPlugin.logPageEnd(null, null, params);
    };

    /** ========== 加载动画/提示 ========== **/

    /**
     * 显示加载动画（阻塞）
     */
    app.showLoading = function () {
        checkPlugins();
        if (!isWaiting) {
            window.plugins.UPWebUIPlugin.showWaitingView();
            isWaiting = true;
        }
    };

    /**
     * 显示加载动画（非阻塞）
     */
    app.showWaiting = function () {
        checkPlugins();
        if (!isWaiting) {
            window.plugins.UPWebUIPlugin.showLoadingView();
            isWaiting = true;
        }
    };

    /**
     * 隐藏加载动画
     */
    app.dismiss = function () {
        checkPlugins();
        if (isWaiting) {
            window.plugins.UPWebUIPlugin.dismiss();
            isWaiting = false;
        }
    };

    /**
     * 消息提示Toast
     * @param msg 提示信息
     */
    app.showToast = function (msg) {
        checkPlugins();
        // fix server msg issue.
        msg = msg.replace('[]', '');

        window.plugins.UPWebUIPlugin.showFlashInfo(msg);
    };

    /**
     * 消息提示框
     * @param params {title: '标题', msg: '提示信息...', ok:'确定', cancel: '取消'}
     * @param okCallback 确定回调
     * @param cancelCallback 取消回调
     */
    app.showAlert = function (params, okCallback, cancelCallback) {
        checkPlugins();
        window.plugins.UPWebUIPlugin.showAlertView(okCallback, cancelCallback, JSON.stringify(params));
    };

    /**
     * 打开一个新的Native窗口加载指定页面
     * @param url 页面地址（如果不传全路径则基于当前路径查找）
     * @param params 页面参数（留空null或undefined）
     * @param title 窗口标题（默认标题使用undefined，iOS貌似不支持？）
     * @param isFinish 是否关闭当前的窗口
     */
    app.createWebView = function (url, params, title, isFinish) {
        checkPlugins();
        if (!url) {
            return;
        }

        // 相对路径，生成全路径
        if (!/:\/\//.test(url)) {
            var path = location.origin + location.pathname;
            url = path.replace(/\/(\w)+(\.html)/g, '/' + url);
        }
        // 生成参数
        if (params) {
            url += url.indexOf('?') > 0 ? ('&' + $.param(params)) : ('?' + $.param(params));
        }

        window.plugins.UPWebNewPagePlugin.createWebPage(JSON.stringify({
            title: title,
            url: url,
            loading: "yes",
            toolbar: "no",
            isFinish: isFinish || "0"
        }));
    };

    /**
     * 关闭当前Native窗口
     */
    app.closeWebView = function () {
        checkPlugins();
        window.plugins.UPWebClosePagePlugin.closeWebApp();
    };

    /**
     * 获取用户信息（手机后台，注意Android和iOS返回信息不一致）
     * @param success
     * @param fail
     */
    app.getUserInfo = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebUserInfoPlugin.getUserInfo(success, fail, null);
    };

    /**
     * 获取用户信息（优惠后台）
     * @param success
     * @param fail
     */
    app.getUserDetailInfo = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebUserDetailPlugin.getUserDetail(success, fail, null);
    };

    /**
     * 获取当前定位信息
     * @param success
     * @param fail
     */
    app.getCurrentLocationInfo = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebNativeInfoPlugin.getCurrentLocationInfo(success, fail, null);
    };

    /**
     * 获取客户端信息
     * @param success
     * @param fail
     * @param type 0：版本号；1：经纬度；5：UserId
     */
    app.fetchNativeData = function (type, success, fail) {
        checkPlugins();
        var params = {type: type};
        // 该插件比较另类，返回JSON String
        var successCallback = function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            success(data);
        };
        window.plugins.UPWebUserInfoPlugin.fetchNativeData(successCallback, fail, params);
    };

    /**
     * 设置窗口标题
     * @param title
     */
    app.setNavigationBarTitle = function (title) {
        checkPlugins();
        window.plugins.UPWebBarsPlugin.setNavigationBarTitle(title);
    };

    /**
     * 设置窗口右侧按钮
     * @param title 图标标题
     * @param image 图标文件
     * @param handler 点击回调函数
     */
    app.setNavigationBarRightButton = function (title, image, handler) {
        checkPlugins();
        var params = {};
        if (title) {
            params.title = title;
        }
        if (image) {
            params.image = image;
        }

        if (handler) {
            params.handler = handler;
        }

        window.plugins.UPWebBarsPlugin.setNavigationBarRightButton(null, null, params);
    };

    /**
     * 登录
     * @param params
     * @param success
     * @param fail
     */
    app.login = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebUserLoginPlugin.login(success, fail, params);
    };

    /**
     * 强制登录
     * @param params
     * @param success
     * @param fail
     */
    app.forceLogin = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebUserLoginPlugin.forceLogin(success, fail, params);
    };

    /**
     * 拉起绑卡控件
     * @param success
     * @param fail
     */
    app.addBankCard = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebBankCardPlugin.addBankCard(success, fail);
    };

    /**
     * 调用Native选择或拍摄图片
     * @param params {maxWidth: 最大宽度, maxHeight：最大高度}
     * @param success
     * @param fail
     */
    app.chooseImage = function (params, success, fail) {
        checkPlugins();
        var successCallback = function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            success(data);
        };

        window.plugins.UPWebUIPlugin.chooseImage(successCallback, fail, params);
    };

    /**
     * 页面返回及关闭事件监听
     * @param pageBackCB
     * @param pageCloseCB
     */
    app.setPageBackListener = function (pageBackCB, pageCloseCB) {
        checkPlugins();
        var params = {};

        if (typeof pageBackCB === 'function') {
            params.backHandler = pageBackCB;
        }

        if (typeof pageCloseCB === 'function') {
            params.closeHandler = pageCloseCB;
        }

        window.plugins.UPWebBarsPlugin.setPageBackListener(null, null, params);
    };

    /**
     * 扫描条码和二维码
     * @param params
     * @param success
     * @param fail
     */
    app.scanQRCode = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebScanPlugin.scanQRCode(success, fail, params);
    };

    /**
     * 显示分享面板
     * 如果所有渠道使用相同的分享内容则仅填写params即可，
     * 如果需要根据不同渠道定制分享内容，则可params留空，在shareCallback中返回指定渠道的分享内容
     * @param params 分享参数
     *              {
     *                  title： 分享标题
     *                  desc: 分享摘要
     *                  picUrl：分享图标
     *                  shareUrl：详情地址
     *              }
     * @param shareCallback 分享时回调
     *              channel：{
     *                  0：短信
     *                  1：新浪微博
     *                  3：微信好友
     *                  4：微信朋友圈
     *                  5：QQ好友
     *                  6：QQ空间
     *                  7：复制链接
     *              }
     *              data: 默认分享数据
     */
    app.showSharePanel = function (params, shareCallback) {
        checkPlugins();

        if (!params.title) {
            params.title = '';
        }
        if (!params.desc) {
            params.desc = '';
        }
        params.content = params.desc;
        if (!params.picUrl) {
            params.picUrl = 'http://wallet.95516.com/s/wl/web/402/images/common/logo.png';
        }
        params.imgUrl = params.picUrl;
        if (!params.shareUrl) {
            params.shareUrl = location.href;
        }

        /**
         * 根据channel生成默认的分享内容
         * 由于Android和iOS每个分享渠道对应内容都不一样，只能单独一个函数根据渠道分别生成分享内容
         * @param channel
         */
        function getDefaultShareContent(channel) {
            // iOS和Android坑爹的不一致
            // iOS：
            // 微信、朋友圈、QQ、Qzone：title、desc、picUrl、shareUrl
            // 微博、短信：content
            // 拷贝：title + shareUrl
            // Android：
            // 微信、朋友圈、QQ、Qzone：title、content、imgUrl、shareUrl
            // 短信：content + shareUrl
            // 微博：content
            // 邮件：title、content + shareUrl
            // 拷贝：shareUrl

            // 默认返回对象
            var defaultParams = {
                title: params.title,
                content: params.desc,
                desc: params.desc,
                picUrl: params.picUrl,
                imgUrl: params.picUrl,
                shareUrl: params.shareUrl + (params.shareUrl.indexOf('?') < 0 ? '?channel=' + channel : '&channel=' + channel ),
                channel: channel
            };
            switch (channel) {
                case 0: // 短信
                    if (UP.W.Env.isIOS) {
                        defaultParams.content = params.content + ' ' + params.shareUrl;
                    }
                    break;
                case 1: // 新浪微博
                    defaultParams.content = params.content + ' ' + params.shareUrl;
                    break;
                case 3: // 微信
                case 4: // 朋友圈
                case 5: // QQ
                case 6: // QZone
                    break;
                case 7: // 拷贝
                    if (UP.W.Env.isAndrid) {
                        defaultParams.shareUrl = params.title + ' ' + params.shareUrl;
                    }
                    break;
                default:

            }
            return defaultParams;
        }

        //每次重新生成函数，避免被share.js等影响
        // iOS分享回调
        window.unionpayWalletShareContent_iOS = function (channel) {
            var params = getDefaultShareContent(channel);
            if (typeof shareCallback === 'function') {
                params = shareCallback(channel, params);
            }
            return JSON.stringify(params);
        };
        // Android分享回调
        window.unionpayWalletShareContent_Android = function (channel) {
            var params = getDefaultShareContent(channel);
            if (typeof shareCallback === 'function') {
                params = shareCallback(channel, params);
            }
            if (share_utils && (typeof share_utils.setCommonTemplate === 'function')) {
                share_utils.setCommonTemplate(JSON.stringify(params));
            }
        };

        // 客户端预加载图片
        window.plugins.UPWebBarsPlugin.prefetchImage({picUrl: params.picUrl});
        window.plugins.UPWebBarsPlugin.showSharePanel(null, null, params);
    };


    /**
     * 执行队列中第一个下发请求任务
     * 由于插件无法支持并发调用，所以为了避免业务层并发调用导致回调异常，公共函数中对请求进行控制，
     * 同时下发多个请求会排到队列中，前一个请求执行完毕之后才会下发下一个请求，因此并发请求过多会导致后面请求响应很慢。
     */
    // 请求队列
    var requestQueue = [];
    // 是否正在下发请求
    var isRequesting = false;
    var doSendMessage = function () {
        // 正在执行请求或者请求队列为空，则直接返回
        if (isRequesting || requestQueue.length === 0) {
            return;
        }
        // 从队列头取出请求
        var request = requestQueue.shift();
        var params = request.params;
        var forChsp = request.forChsp;
        var byAjax = request.byAjax;
        var success = request.success;
        var error = request.error;
        var fail = request.fail;

        // 判断会话失效
        var checkInvalidSession = function (data, xhr) {
            // 会话失效
            if ((data && data.resp === '+9x9+') || (xhr && xhr.status === 401)) {
                if (!byAjax) {
                    app.dismiss();
                    if (UP.W.UI) {
                        UP.W.UI.dismiss();
                    }
                    setTimeout(function () {
                        app.showAlert({
                                title: '提示',
                                msg: (data && data.msg) || '系统发现您的账号异常，为了您的账号安全，请重新登录！',
                                ok: '重新登录'
                            },
                            function () {
                                app.forceLogin({'refreshPage': true});
                            });
                    }, 200);
                    return true;
                }
            }
            return false;
        };

        // 统一成功回调（可能包含业务错误）
        var successCallback = function (data) {
            if ((typeof data) === 'string') {
                data = JSON.parse(data);
            }

            // 无效会话统一处理，不继续执行
            if (checkInvalidSession(data)) {
                isRequesting = false;
                return;
            }

            if (data.resp === '00') {
                if (typeof success === 'function') {
                    success(data);
                }
            } else {
                if (typeof error === 'function') {
                    error(data);
                }
            }

            // 开始发送下一个请求
            isRequesting = false;
            doSendMessage();
        };

        // 统一失败回调（请求异常等）
        var failCallback = function (xhr) {
            // XHR错误
            // 无效会话统一处理，不继续执行
            if (checkInvalidSession(null, xhr)) {
                isRequesting = false;
                return;
            }
            if (xhr.resp) {
                if (typeof error === 'function') {
                    error(xhr);
                }
            } else {
                if (typeof fail === 'function') {
                    fail(xhr);
                }
            }

            // 开始发送下一个请求
            isRequesting = false;
            doSendMessage();
        };

        isRequesting = true;
        if (byAjax) {
            // 通过Ajax下发请求
            if (forChsp) {
                params.params.version = params.params.version || params.version;
                params.params.source = params.params.source || params.source;
                // 优惠后台POST参数需要stringify
                var contentType = 'application/x-www-form-urlencoded';
                if (params.method === 'POST') {
                    params.params = JSON.stringify(params.params);
                    contentType = 'application/json';
                }
                // 优惠后台
                $.ajax({
                    type: params.method,
                    url: UP.W.Env.pathYouhuiServer + '/' + params.version + '/' + params.uri,
                    contentType: contentType,
                    dataType: "json",
                    data: params.params,
                    success: successCallback,
                    error: failCallback
                });
            } else {
                // 手机后台，需要增加额外的HTTP标头
                $.ajax({
                    type: params.httpMethod,
                    url: UP.W.Env.pathWalletServer + '/' + params.path,
                    //contentType: contentType,
                    dataType: "json",
                    data: JSON.stringify(params.params),
                    headers: {
                        vid: params.vid || '',
                        decrypt: 0
                    },
                    success: successCallback,
                    error: failCallback
                });
            }
        } else {
            // 通过插件下发请求
            checkPlugins();
            if (forChsp) {
                // 优惠后台
                window.plugins.UPWebNetworkPlugin.sendMessageForChsp(successCallback, failCallback, params);
            } else {
                window.plugins.UPWebNetworkPlugin.sendMessage(successCallback, failCallback, params);
            }
        }
    };

    /**
     * 向服务器发送请求
     * @param params 请求参数
     *                  version：版本，默认是1.0
     *                  source：来源，默认根据Android、iOS自动添加
     *                  encrypt：是否加密，默认加密
     *                  method：请求方法，POST或GET
     *                  cmd：请求命令（也可自行将cmd组装至uri[优惠后台]或path[钱包后台]）
     *                  uri/path：请求地址，建议仅填充cmd，不建议自行组装uri/path
     *                  params：发送给后台的参数
     *                  vid：如果通过Ajax方式向wallet后台发送请求需要携带vid
     * @param forChsp 是否向优惠后台发送请求（默认向手机后台发送请求）
     * @param byAjax 是否使用Ajax发送请求（默认使用控件）
     * @param success 成功回调
     * @param error 错误回调（业务错误）
     * @param fail 失败回调（请求失败）
     */
    app.sendMessage = function (params, forChsp, byAjax, success, error, fail) {
        params = params || {};
        params.version = params.version || '1.0';
        params.source = params.source || (UP.W.Env.isiOS ? '2' : '3');
        // 注意：wallet的path是带有版本号的，youhui的uri不带有版本号
        if (forChsp) {
            params.encrypt = !(params.encrypt === false || params.encrypt === '0');
            params.method = params.method || 'POST';
            params.uri = params.uri || params.cmd;
            params.params = params.params || {};
            params.params.version = params.params.version || '1.0';
            params.params.source = params.params.source || (UP.W.Env.isiOS ? '2' : '3');
        } else {
            params.encrypt = (params.encrypt === false || params.encrypt === '0') ? '0' : '1';
            params.httpMethod = params.httpMethod || params.method || 'POST';
            params.path = params.path || params.version + '/' + params.cmd;
        }
        // 将请求信息加入队列
        requestQueue.push({
            params: params,
            forChsp: forChsp,
            byAjax: byAjax,
            success: success,
            error: error,
            fail: fail
        });

        doSendMessage();
    };

    /**
     * 直接调用支付控件
     * @param params
     * @param success
     * @param fail
     */
    app.pay = function (params, success, fail) {
        window.plugins.UPWebPayPlugin.pay(success, fail, params);
    };

    /**
     * 支付订单，包含自动调用order.prehandle
     * @param params 参数
     *          tn: 订单号
     *          merchantId: 商户ID，如果希望使用Apple Pay等第三方支付需要传入
     *          title: 在支持第三方支付时，提示界面的标题（默认不传）
     *          cancelTitle: 在支持第三方支付时，提示界面的取消按钮文字
     * @param success 成功
     * @param fail 失败
     */
    app.payBill = function (params, success, fail) {
        // 检查tn号
        if (!params || !params.tn) {
            if (typeof fail === 'function') {
                fail({msg: '银联钱包支付必须先生成TN号。'});
            }
            return;
        }

        // 向手机后台下发order.prehandle，然后调用支付控件支付
        app.showWaiting();
        app.sendMessage({
                cmd: 'order.prehandle',
                method: 'POST',
                params: params
            },
            false,  // 发到手机后台
            false,  // 非Ajax
            function (data) {
                // prehandle成功，开始支付
                app.dismiss();
                // 生产环境mode是'00'，否则是'02'
                app.pay({
                        tn: params.tn,
                        mode: UP.W.Env.appMode === '0' ? '00' : '02',
                        merchantId: params.merchantId || '',
                        title: params.title || '',
                        msg: params.msg || '',
                        upWalletPay: params.upWalletPay || '',
                        cancel: params.cancel || ''
                    },
                    function (data) {
                        if (typeof success === 'function') {
                            success(data);
                        }
                    },
                    function (err) {
                        var msg = (typeof err === 'string' ? err : err.desc);
                        if (typeof fail === 'function') {
                            fail({msg: msg});
                        }
                    });
            },
            function (err) {
                // prehandle失败
                app.dismiss();
                if (typeof fail === 'function') {
                    fail(err);
                }
            });
    };

    /**
     * 进行实名认证
     * @param success
     * @param fail
     */
    app.doAutonymAuth = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebAccountPlugin.doAutonymAuth(success, fail);
    };

    /**
     * 获取实名认证状态
     * @param success
     * @param fail
     */
    app.getAutonymAuthStatus = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebAccountPlugin.getAutonymAuthStatus(success, fail);
    };

    /**
     * 身份认证
     * @param success
     * @param fail
     */
    app.authentication = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebAccountPlugin.authentication(success, fail);
    };

    /* ========== apple pay 相关插件 ========*/
    /**
     * 是否支持ApplePay
     * @param success
     * @param fail
     * @param params
     */
    app.isSupportAP = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.isSupport(success, fail, params);
    };

    /**
     * 获取ApplePay卡列表
     * @param success
     * @param fail
     * @param params
     */
    app.getAPCardList = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.getCardList(success, fail, params);
    };

    /**
     * 打开AppleWallet
     * @param success
     * @param fail
     * @param params
     */
    app.openAppleWallet = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.openAppleWallet(success, fail, params);
    };

    /**
     * 绑定AppleWallet卡
     * @param success
     * @param fail
     * @param params
     */
    app.bindAPCard = function (params, success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.bindAppleWalletCard(success, fail, params);
    };

    /**
     * 绑定AppleWallet卡到钱包
     * @param success
     * @param fail
     */
    app.bindAppleWalletCard2UPWallet = function (success, fail) {
        checkPlugins();
        window.plugins.UPWebApplePayPlugin.bindAppleWalletCard2UPWallet(success, fail);
    };

    // 只有在钱包里才能初始化插件
    if (UP.W.Env.isInsideWalletApp) {
        initPlugins();
    }

})(Zepto, window.UP = window.UP || {});