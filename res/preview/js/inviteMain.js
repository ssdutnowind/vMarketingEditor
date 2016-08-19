(function ($, UP, config) {
    "use strict";

    UP.W = UP.W || {};
    UP.W.VMarketing = UP.W.VMarketing || {};
    UP.W.VMarketing.InviteMain = {};

    var inviteMain = UP.W.VMarketing.InviteMain;
    var util = UP.W.Util;
    var env = UP.W.Env;
    var app = UP.W.App;
    var ui = UP.W.UI;

    var $container = null;                  // 当前模块容器
    var index = null;                       // 主页面对象
    var mobile = '';                        // 用户手机号

    /**
     * 查看我的邀请记录
     */
    function checkMyInviteList() {
        index.openPage('inviteList', {
            mobile: mobile
        });
        app.logEvent("chongyang_inviteView_checkReward");
    }

    /**
     * 没有用户信息，直接分享，此时分享之后也不会有推荐奖励
     * （页面上点击事件）：
     * 如果是登陆状态，弹出分享列表panel，
     * 如果未登录状态，则先登录，再回到此页面，需要用户再次点击分享
     **/
    function shareClick() {
        //已登录情况
        if (!!mobile) {
            shareAction();
        } else {
            ui.showToast('请使用手机号登录后再分享！');
        }

        app.logEvent("chongyang_inviteView_wantInvite");
    }

    /**
     * 分享动作及埋点
     **/
    function shareAction() {
        var params = {};
        params.title = config.shareTitle;
        params.desc = config.shareDesc;
        params.picUrl = env.currentPath.replace('/html/', config.shareIcon) + '?v=' + config.activityId;
        params.shareUrl = getShareLink();

        app.showSharePanel(params, function (channel, data) {
            if (channel !== 'undefined') {
                console.log(channel);
                app.logEvent({
                        3: 'up99_promotion_share_weChat', //分享到微信好友
                        4: 'up99_promotion_share_Moments', //分享到朋友圈
                        1: 'up99_promotion_share_sina', //分享到新浪微博
                        0: 'up99_promotion_share_message', //分享到短信
                        5: 'up99_promotion_share_QQ', //分享到QQ
                        6: 'up99_promotion_share_QQSPACE', //分享到QQ空间
                        7: 'up99_promotion_share_copy' //复制
                    }[channel]
                );
                // 朋友圈单独配置
                if (channel === 4) {
                    data.title = data.title + ' ' + data.desc;
                }
            } else {
                console.log(channel);
            }
            return data;
        });
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
        return link.replace('inviteIndex.html', 'snsIndex.html');
    }

    /**
     * 显示二维码
     */
    function showQRCode() {
        if (mobile) {
            $('#qrCodeContainer').empty();
            var qrCode = new QRCode($('#qrCodeContainer')[0], {
                text: getShareLink()
            });
            // 二维码内部实现依赖Image的onload事件，直接显示会先闪现一下空白，所以增加一个异步延时
            setTimeout(function () {
                $('#qrCodeMask').show();
            }, 50);
        } else {
            // 没有获取到手机号，提示使用手机号登录
            ui.showToast('请使用手机号登录后再分享！');
        }
        app.logEvent("chongyang_inviteView_QRcode");
    }

    /**
     * 判断用户未登录情况下登录
     */
    function login() {
        var params = {};
        app.login(params, function () {
            initPageData();
        }, function (data) {
            ui.showToast(data.msg);
        });
    }

    /**
     * 用户登录情况下按钮绑定事件和状态
     */
    function userAction() {
        //in and over:活动结束控制邀请btn隐藏，显示闭幕提示
        if (config.activityStatus === '0') {
            $container.find("#buttonInviteContainer").hide();
            $container.find("#endNote").show();
            $container.find("#endCheck").show();
            $container.find("#inCheckContainer").hide();
        } else {
            $container.find("#buttonInviteContainer").show();
            $container.find("#inCheckContainer").show();
        }
        //二维码
        $('#buttonShowQRCode').show().unbind('click').bind('click', showQRCode);
        $('#buttonCloseQRCode').unbind('click').bind('click', function () {
            $('#qrCodeMask').hide();
        });
        // 点击进入邀请列表（活动结束）
        $container.find('#endCheck').unbind('click').bind('click', checkMyInviteList);
        // 点击进入邀请列表（活动中）
        $container.find('#inCheck').unbind('click').bind('click', checkMyInviteList);
        // 我要邀请
        $container.find('#buttonInvite').unbind('click').bind('click', shareClick);
    }

    /**
     * 用户未登录情况下按钮绑定事件和状态
     */
    function guestAction() {
        //in and over:活动结束控制邀请btn隐藏，显示闭幕提示
        if (config.activityStatus === '0') {
            $container.find("#buttonInviteContainer").hide();
            $container.find("#endNote").show();
            $container.find("#endCheck").show();
            $container.find("#inCheckContainer").hide();
        } else {
            $container.find("#buttonInviteContainer").show();
            $container.find("#inCheckContainer").show();
        }
        //二维码button不显示
        $('#buttonShowQRCode').hide();
        // 点击进入邀请列表（活动结束）
        $container.find('#endCheck').unbind('click').bind('click', login);
        // 点击进入邀请列表（活动中）
        $container.find('#inCheck').unbind('click').bind('click', login);
        // 我要邀请
        $container.find('#buttonInvite').unbind('click').bind('click', login);
    }

    /**
     * 获取用户信息，初始化页面
     */
    function initPageData() {
        ui.showLoading();
        // 查询用户手机号
        app.getUserDetailInfo(function (data) {
                if (data.username && /^(\d)*$/.test(data.username)) {
                    mobile = data.username;
                    userAction();
                    ui.dismiss();
                } else {
                    ui.dismiss();
                    guestAction();
                    ui.showToast('请使用手机号登录。');
                }
            },
            function (err) {
                console.log(err);
                ui.dismiss();
                guestAction();
            });
    }

    /**
     * 初始化时被调用
     */
    inviteMain.onInit = function ($el, indexRef) {
        console.log('inviteMain init.');
        $container = $el;
        index = indexRef;
        if (app.isPluginReady()) {
            // 获取用户信息，初始化数据
            initPageData();
            app.logPageBegin('chongyang_inviteView');
        } else {
            document.addEventListener('pluginready', function () {
                console.log('inviteMain: Plugin Ready.');
                // 获取用户信息，初始化数据
                initPageData();
                app.logPageBegin('chongyang_inviteView');
            }, false);
        }
    };

    /**
     * 显示时被调用
     */
    inviteMain.onShow = function (mobile) {
        console.log('inviteMain show.');
    };

})(Zepto, window.UP = window.UP || {}, window.config = window.config || {});