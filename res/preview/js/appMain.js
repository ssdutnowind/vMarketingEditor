(function ($, UP, config) {
    "use strict";

    UP.W = UP.W || {};
    UP.W.VMarketing = UP.W.VMarketing || {};
    UP.W.VMarketing.AppMain = {};

    var appMain = UP.W.VMarketing.AppMain;
    var util = UP.W.Util;
    var env = UP.W.Env;
    var app = UP.W.App;
    var ui = UP.W.UI;

    var $container = null;                  // 当前模块容器
    var index = null;                       // 主页面对象
    var mobile = '';                        // 用户手机号
    var existed = '';                       // 新老用户标记


    var PAGE_DEFAULT = 0;
    var PAGE_BEFORE = 1;
    var PAGE_AFTER = 2;
    var PAGE_ALREADY = 3;
    var PAGE_OLD = 4;
    var PAGE_VIOLATE = 5;

    /**
     * 显示指定界面
     * @param pageType
     */
    function showPage(pageType) {
        $container.find('#resultBlockDefault').hide();
        $container.find('#resultBlockBefore').hide();
        $container.find('#resultBlockAfter').hide();
        $container.find('#resultBlockViolate').hide();
        $container.find('#resultBlockAlready').hide();
        $container.find('#resultBlockOld').hide();
        $container.find('#buttonShowQRCode').hide();
        switch (pageType) {
            case PAGE_DEFAULT:
                $container.find('#resultBlockDefault').show();
                break;
            case PAGE_BEFORE:
                $container.find('#resultBlockBefore').show();
                break;
            case PAGE_AFTER:
                $container.find('#resultBlockAfter').show();
                $container.find('#buttonShowQRCode').show();
                break;
            case PAGE_ALREADY:
                $container.find('#resultBlockAlready').show();
                $container.find('#buttonShowQRCode').show();
                break;
            case PAGE_OLD:
                $container.find('#resultBlockOld').show();
                $container.find('#buttonShowQRCode').show();
                break;
            case PAGE_VIOLATE:
                $container.find('#resultBlockViolate').show();
                $container.find('#buttonShowQRCode').show();
                break;
        }
    }

    /**
     * 获取用户信息，初始化页面
     */
    function initPageData() {
        if (config.activityStatus !== '1') {
            ui.showToast('对不起，活动已结束或暂停！');
            return;
        }
        ui.showLoading();
        // 查询用户手机号
        app.getUserDetailInfo(function (data) {
                if (data.username && /^(\d)*$/.test(data.username)) {
                    mobile = data.username;
                    initGiftData();
                } else {
                    ui.dismiss();
                    // 隐藏默认撑高页面的内容
                    showPage(PAGE_BEFORE);
                    ui.showToast('请使用手机号登录。');
                }
            },
            function (err) {
                console.log('读取手机号错误，可能未登录：');
                console.log(err);
                ui.dismiss();
                // 隐藏默认撑高页面的内容
                showPage(PAGE_BEFORE);
            });
    }

    /**
     * 判断用户领奖情况
     */
    function initGiftData() {
        // 判断用户领奖情况
        var params = {
            uri: 'vMarketing/getAwardInfoForSns',
            method: 'GET',
            params: {
                mobile: mobile,
                activityId: config.activityId
            }
        };
        // 向后台查询用户获奖情况（forChsp，byAjax）
        ui.showLoading();
        app.sendMessage(params, true, true,
            function (data) {
                data = data && data.params;
                if (data.recSt && data.recSt === '06') {
                    // 违反活动规则
                    ui.dismiss();
                    showPage(PAGE_VIOLATE);
                } else if (data.newUserGiftPack) {
                    // 已经领过红包或者礼包
                    ui.dismiss();
                    showPage(PAGE_ALREADY);
                } else {
                    // 没有领过礼包，检查用户领奖情况
                    checkUserStatus();
                }
            },
            function (err) {
                console.log('getAwardInfoForSns error:');
                console.log(err);
                ui.dismiss();
                showPage(PAGE_BEFORE);
                // 服务器出错
                ui.showToast(err.msg);
            },
            function (xhr) {
                console.log('getAwardInfoForSns: HTTP error:');
                console.log(xhr);
                ui.dismiss();
                showPage(PAGE_BEFORE);
                ui.showToast('获取领奖信息出错，请稍后重试！');
            }
        );
    }

    /**
     * 检查新老用户
     */
    function checkUserStatus() {
        var params = {
            uri: 'vMarketing/isUserExisted',
            method: 'GET',
            params: {
                mobile: mobile,
                activityId: config.activityId
            }
        };
        ui.showLoading();
        app.sendMessage(params, true, true,
            function (data) {
                data = data && data.params;
                existed = data.existed;
                switch (existed) {
                    case '0':
                        // 新用户，不可能存在该情况
                        ui.dismiss();
                        showPage(PAGE_BEFORE);
                        ui.showToast('用户状态不正确，请重新登录。');
                        break;
                    case '1':
                        // 活动期间注册老用户，直接获取礼包
                        getGift();
                        break;
                    case '2':
                        // 活动之外老用户，不能领礼包
                        ui.dismiss();
                        showPage(PAGE_OLD);
                        break;
                    default:
                        ui.dismiss();
                        showPage(PAGE_BEFORE);
                }
            },
            function (err) {
                console.log('isUserExisted error: ' + JSON.stringify(err));
                ui.dismiss();
                showPage(PAGE_BEFORE);
                // 服务器出错
                ui.showToast(err.msg);
            },
            function (xhr) {
                console.log('isUserExisted: HTTP error. %o', xhr);
                ui.dismiss();
                showPage(PAGE_BEFORE);
                ui.showToast('检查用户状态出错，请稍后重试！');
            });
    }

    /**
     * 领奖
     */
    function getGift() {
        // 老用户直接领礼包
        ui.showLoading();
        var params = {
            uri: 'vMarketing/receiveAward',
            method: 'POST',
            params: {
                mobile: mobile,
                cityCd: '000000',
                registered: existed,
                channel: 'BDYX',
                activityId: config.activityId
            }
        };
        app.sendMessage(params, true, true,
            function (data) {
                ui.dismiss();
                showPage(PAGE_AFTER);
            },
            function (err) {
                console.log('receiveAward error: ' + JSON.stringify(err));
                ui.dismiss();
                showPage(PAGE_BEFORE);
                // 领取红包出错
                ui.showToast(err.msg);
            },
            function (xhr) {
                console.log('receiveAward: HTTP error. %o', xhr);
                ui.dismiss();
                showPage(PAGE_BEFORE);
                ui.showToast('领取礼包失败，请稍后重试！');
            }, 'POST');
    }

    /**
     * 用户未登录的情况下需要登录然后判断领奖状态
     */
    function loginForGift() {
        if (mobile) {
            initGiftData();
        } else {
            app.login(null,
                function () {
                    initPageData();
                },
                function (err) {
                    if (err.code === '1') {
                        initPageData();
                    }
                });
        }
        app.logEvent("chongyang_newuserView_getGift");
    }

    /**
     * 显示二维码
     */
    function showQRCode() {
        $container.find('#qrCodeContainer').empty();
        var qrCode = new QRCode($container.find('#qrCodeContainer')[0], {
            text: getShareLink()
        });
        // 二维码内部实现依赖Image的onload事件，直接显示会先闪现一下空白，所以增加一个异步延时
        setTimeout(function () {
            $container.find('#qrCodeMask').show();
        }, 50);
        app.logEvent("chongyang_newuserView_QRcode");
    }

    /**
     * 获取推荐链接
     * @returns {*}
     */
    function getShareLink() {
        var link = location.origin + location.pathname;
        if (mobile) {
            link += '?r=' + encodeURIComponent(util.base64Encode(mobile));
        }
        return link.replace('appIndex.html', 'snsIndex.html');
    }

    /**
     * 初始化时被调用
     */
    appMain.onInit = function ($el, indexRef) {
        console.log('appMain init.');
        $container = $el;
        index = indexRef;

        // 绑定各种事件
        // 登录，领取礼包
        $container.find('#buttonGetGift').bind('click', loginForGift);
        // 查看票券列表
        $container.find('a.showGift').bind('click', function () {
            index.openPage('appGift', {
                mobile: mobile
            });
            app.logEvent("chongyang_newuserView_checkGift");
        });
        // 二维码
        $container.find('#buttonShowQRCode').bind('click', showQRCode);
        $container.find('#buttonCloseQRCode').bind('click', function () {
            $container.find('#qrCodeMask').hide();
        });

        if (app.isPluginReady()) {
            // 获取用户信息，初始化数据
            initPageData();
            app.logPageBegin('chongyang_newuserView');
        } else {
            document.addEventListener('pluginready', function () {
                console.log('appMain: Plugin Ready.');
                // 获取用户信息，初始化数据
                initPageData();
                app.logPageBegin('chongyang_newuserView');
            }, false);
        }

    };

    /**
     * 显示时被调用
     */
    appMain.onShow = function () {
        console.log('appMain show.');
    };

})(Zepto, window.UP = window.UP || {}, window.config = window.config || {});