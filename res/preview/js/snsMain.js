(function ($, UP, config) {
    "use strict";

    UP.W = UP.W || {};
    UP.W.VMarketing = UP.W.VMarketing || {};
    UP.W.VMarketing.SnsMain = {};

    var snsMain = UP.W.VMarketing.SnsMain;
    var util = UP.W.Util;
    var env = UP.W.Env;
    var app = UP.W.App;
    var ui = UP.W.UI;

    var COUNT_DOWN_SECOND = 60;             // 验证码倒计时秒数
    var currentSecond = 0;                  // 验证码倒计时
    var interval = null;                    // 验证码计时器
    var $container = null;                  // 当前模块容器
    var index = null;                       // 主页面对象
    var recommendMobile = '';               // 推荐者手机号
    var mobile = '';                        // 用户手机号
    var existed = '';                       // 新老用户标记

    function checkMobile() {
        // 检查用户输入的手机号是否符合基本规范（首位为1后接10位数字）
        mobile = $container.find('#inputMobile').val();
        if (!/1[0-9]{10}/.test(mobile)) {
            // 手机号需为1开头的11位数字
            ui.showAlert('请输入正确的手机号！');
            return;
        }

        ui.showLoading();
        // 检查用户是否领过奖
        var params = {
            uri: 'vMarketing/getAwardInfoForSns',
            method: 'GET',
            params: {
                mobile: mobile,
                activityId: config.activityId
            }
        };
        // 向后台查询用户获奖情况（forChsp，byAjax）
        app.sendMessage(params, true, true,
            function (data) {
                console.log(data);
                data = data && data.params;
                // 如果已经领过红包或者礼包，直接显示红包或礼包，否则停留在输入手机号界面
                if (data.newUserGiftPack) {
                    // 因为确保用户分享后页面地址是带有推荐信息的，所以此处需要重新加载
                    data.isOld = true;
                    localStorage.setItem('reload_' + config.activityId, JSON.stringify(data));
                    // 用新链接刷新页面
                    jumpPage(getShareLink());
                } else {
                    // 没有领过礼包
                    checkUserStatus();
                }
            },
            function (err) {
                console.log('getAwardInfoForSns error:');
                console.log(err);
                ui.dismiss();
                // 服务器出错
                ui.showAlert(err.msg);
            },
            function (xhr) {
                console.log('getAwardInfoForSns: HTTP error:');
                console.log(xhr);
                ui.dismiss();
                ui.showAlert('获取领奖信息出错，请稍后重试！');
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
        app.sendMessage(params, true, true,
            function (data) {
                data = data && data.params;
                ui.dismiss();
                existed = data.existed;
                switch (existed) {
                    case '0':
                        // 新用户，显示验证码
                        $container.find('#captchaBlock').addClass('fadeIn');
                        $container.find('#captchaBlock').show();
                        break;
                    case '1':
                        // 活动期间注册老用户，直接获取礼包
                        getGift();
                        break;
                    case '2':
                        // 活动之外老用户，不能领礼包
                        data.mobile = mobile;
                        data.oldUser = true;
                        localStorage.setItem('reload_' + config.activityId, JSON.stringify(data));
                        // 因为确保用户分享后页面地址是带有推荐信息的，所以此处需要重新加载
                        jumpPage(getShareLink());
                        break;
                    default:
                        ui.showAlert('校验手机号出错，请检查活动地址是否正确！');
                }
            },
            function (err) {
                console.log('isUserExisted error: ' + JSON.stringify(err));
                ui.dismiss();
                // 服务器出错
                ui.showAlert(err.msg);
            },
            function (xhr) {
                console.log('isUserExisted: HTTP error. %o', xhr);
                ui.dismiss();
                ui.showAlert('检查用户状态出错，请稍后重试！');
            });
    }

    /**
     * 获取推荐链接
     * @returns {*}
     */
    function getShareLink() {
        var url = location.href;
        var link = url.substr(0, url.indexOf('.html') + 5);
        if (mobile) {
            link += '?r=' + encodeURIComponent(util.base64Encode(mobile));
        }
        return link;
    }

    /**
     * 领奖
     */
    function getGift() {
        var captcha = '';
        if (existed === '0') {
            // 新用户，检查验证码位数
            captcha = $container.find('#captchaInput').val();
            if (!/\d{6}/.test(captcha)) {
                ui.showAlert('请输入正确的验证码！');
                return;
            }
        }
        // 老用户直接领礼包
        ui.showLoading();
        var params = {
            uri: 'vMarketing/receiveAward',
            method: 'POST',
            params: {
                mobile: mobile,
                cityCd: '000000',
                vfyCode: captcha,
                recmdMobile: encodeURIComponent(recommendMobile),
                registered: existed,
                channel: 'BDYX',
                activityId: config.activityId
            }
        };
        app.sendMessage(params, true, true,
            function (data) {
                ui.dismiss();
                data = data && data.params;
                localStorage.setItem('reload_' + config.activityId, JSON.stringify(data));
                // 用新链接刷新页面
                jumpPage(getShareLink());
            },
            function (err) {
                console.log('receiveAward error: ' + JSON.stringify(err));
                ui.dismiss();
                // 领取红包出错
                ui.showAlert(err.msg);
            },
            function (xhr) {
                console.log('receiveAward: HTTP error. %o', xhr);
                ui.dismiss();
                ui.showAlert('领取礼包失败，请稍后重试！');
            }, 'POST');
    }

    /**
     * 获取验证码
     */
    function getCaptch() {
        // 调用服务器发送验证码
        var params = {
            uri: 'vMarketing/sendVfyCode',
            method: 'POST',
            params: {
                mobile: mobile,
                activityId: config.activityId
            }
        };
        app.sendMessage(params, true, true,
            function (data) {
                // 正常响应，不作处理
            },
            function (err) {
                console.log('sendVfyCode error: ' + JSON.stringify(err));
                // 服务器异常，停止计时
                ui.showAlert(err.msg);
                stopCountDown();
            },
            function (xhr) {
                console.log('sendVfyCode: HTTP error. %o', xhr);
                // HTTP异常，停止计时
                ui.showAlert('获取验证码失败，请稍后再试！');
                stopCountDown();
            });

        $container.find('#buttonSubmit').removeAttr('disabled');
        startCountDown();
    }

    /**
     * 开始倒计时
     */
    function startCountDown() {
        // 隐藏“获取验证码”、显示计秒
        currentSecond = COUNT_DOWN_SECOND;
        var $elSecond = $container.find('#captchaSecond');
        $elSecond.text(currentSecond);
        $elSecond.show();
        $container.find('#buttonCaptchaGet').hide();
        // 启动定时器
        interval = setInterval(countDownStep, 1000);
    }

    /**
     * 停止倒计时
     */
    function stopCountDown() {
        // 停止倒计时
        clearInterval(interval);
        // 隐藏计秒、显示“获取验证码”按钮
        $container.find('#captchaSecond').hide();
        $container.find('#buttonCaptchaGet').show();
    }

    /**
     * 倒计时Tick
     */
    function countDownStep() {
        if (currentSecond === 0) {
            // 计时到0，停止计时
            stopCountDown();
        } else {
            $container.find('#captchaSecond').text(--currentSecond);
        }
    }

    /**
     * 显示领奖状态
     */
    function showGift(data) {
        if (data.oldUser) {
            // 老用户
            $container.find('#inviteBlock').show();
        } else {
            if (data.isOld) {
                // 已领过
                $container.find('#resultBlock').show();
                $container.find('#resultBlock .card-already').show();
            } else if (data.newUserGiftPack) {
                // 新领取
                $container.find('#resultBlock').show();
                $container.find('#resultBlock .card-after').show();
            }
        }
        //显示扫码邀请
        $container.find('#buttonShowQRCode').show();
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
    }

    /**
     * 跳转页面
     * @param url
     */
    function jumpPage(url) {
        ui.showLoading();
        location.replace(url);
    }

    /**
     * 初始化微信失败
     */
    function wxReady() {
        var snsConfig = {
            title: config.shareTitle, // 分享标题
            desc: config.shareDesc, // 分享描述
            link: getShareLink(), // 分享链接
            imgUrl: env.currentPath.replace('/html/', config.shareIcon) + '?t=' + config.activityId, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        // 不能直接传同一个引用进去
        var timelineConfig = {
            title: config.shareTitle + ' ' + config.shareDesc, // 分享标题
            desc: config.shareDesc, // 分享描述
            link: getShareLink(), // 分享链接
            imgUrl: env.currentPath.replace('/html/', config.shareIcon) + '?t=' + (new Date()).getTime(), // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        // QQ空间
        window.wx.onMenuShareQZone(snsConfig);
        // QQ好友
        window.wx.onMenuShareQQ(snsConfig);
        // 微信好友
        window.wx.onMenuShareAppMessage(snsConfig);
        // 朋友圈
        // 朋友圈特殊处理，根据吴黎平要求，由于朋友圈只显示title，所以将title和desc都放上（appMain也有）
        window.wx.onMenuShareTimeline(timelineConfig);
    }

    /**
     * 初始化微信失败
     * @param res
     */
    function wxError(res) {
        console.log('Config wechat error: %o', res);
    }

    /**
     * 初始化微信JSSDK
     */
    function configWeChat() {
        // 此时应该能够从URL中获取code
        window.wx.ready(wxReady);
        window.wx.error(wxError);
        // 配置微信权限注入与查询openId无依赖关系，并行
        // 获取微信权限注入数据
        util.sendMessageWeChat('sdkConfig.php', {}, function (data) {
                window.wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'closeWindow'
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

            },
            function (err) {
                console.log('sdkConfig.php error: ' + err);
            });
    }

    /**
     * 初始化时被调用
     */
    snsMain.onInit = function ($el, indexRef) {
        console.log('snsMain init.');
        $container = $el;
        index = indexRef;
        // 推荐者手机号，缩短URL，参数缩短
        var query = util.urlQuery2Obj();
        if (query.r) {
            recommendMobile = query.r;
        } else if (query.originMobile) {
            // 兼容老的地推链接参数
            recommendMobile = query.originMobile;
        }

        // 绑定各种事件
        // 输入手机号后点击“立即领取”
        $container.find('#buttonGift').bind('click', checkMobile);
        // 获取验证码
        $container.find('#buttonCaptchaGet').bind('click', getCaptch);
        // 提交领取红包
        $container.find('#buttonSubmit').bind('click', getGift);
        // 分享蒙层
        $container.find('#buttonInvite').bind('click', function () {
            $container.find('#shareMask').show();
        });
        $container.find('#shareMask').bind('click', function () {
            $container.find('#shareMask').hide();
        });
        // 二维码
        $container.find('#buttonShowQRCode').bind('click', showQRCode);
        $container.find('#buttonCloseQRCode').bind('click', function () {
            $container.find('#qrCodeMask').hide();
        });

        // 加载持久化的信息，微信里可能获取到
        var data = localStorage.getItem('reload_' + config.activityId);
        localStorage.removeItem('reload_' + config.activityId);

        if (data) {
            // 如果有领奖结果，直接显示
            data = JSON.parse(data);
            mobile = data.mobile;
            showGift(data);
        } else {
            // 没有数据，则初始化为领奖界面
            $container.find('#giftBlock').show();
        }

        // 微信中需要进行配置
        if (env.platform === 'WeChat') {
            var jssdk = location.protocol + '//res.wx.qq.com/open/js/jweixin-1.1.0.js';
            seajs.use([jssdk], function (wx) {
                // WeChat jssdk支持AMD
                window.wx = wx;
                configWeChat();
            });
        }
    };

    /**
     * 显示时被调用
     */
    snsMain.onShow = function () {
        console.log('snsMain show.');
    };

})(Zepto, window.UP = window.UP || {}, window.config = window.config || {});