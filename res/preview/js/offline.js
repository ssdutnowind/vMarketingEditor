$(function () {
    "use strict";

    var util = UP.W.Util;
    var env = UP.W.Env;
    var app = UP.W.App;
    var ui = UP.W.UI;

    var COUNT_DOWN_SECOND = 60;             // 验证码倒计时秒数
    var currentSecond = 0;                  // 验证码倒计时
    var interval = null;                    // 验证码计时器
    var recommendMobile = '';               // 推荐者手机号
    var mobile = '';                        // 用户手机号
    var existed = '';                       // 新老用户标记

    // 配置项
    window.config = window.config || {};

    function checkMobile() {
        // 检查用户输入的手机号是否符合基本规范（首位为1后接10位数字）
        mobile = $('#inputMobile').val();
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
                    // 用新链接刷新页面
                    jumpPage();
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
                        $('#captchaBlock').addClass('fadeIn');
                        $('#captchaBlock').show();
                        break;
                    case '1':
                        // 活动期间注册老用户，直接获取礼包
                        getGift();
                        break;
                    case '2':
                        // 活动之外老用户，不能领礼包
                        jumpPage();
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
     * 领奖
     */
    function getGift() {
        var captcha = '';
        if (existed === '0') {
            // 新用户，检查验证码位数
            captcha = $('#captchaInput').val();
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
                jumpPage();
            },
            function (err) {
                console.log('receiveAward error: ' + JSON.stringify(err));
                ui.dismiss();
                if (err.resp === 'MB') {
                    // 领取红包出错（验证码错误）
                    ui.showAlert(err.msg);
                } else {
                    // 跳转到下载页面
                    jumpPage();
                }
            },
            function (xhr) {
                console.log('receiveAward: HTTP error. %o', xhr);
                ui.dismiss();
                ui.showAlert('领取礼包失败，请稍后重试！');
            }, 'POST');
    }

    /**
     * 获取验证吗
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

        $('#buttonSubmit').removeAttr('disabled');
        startCountDown();
    }

    /**
     * 开始倒计时
     */
    function startCountDown() {
        // 隐藏“获取验证码”、显示计秒
        currentSecond = COUNT_DOWN_SECOND;
        var $elSecond = $('#captchaSecond');
        $elSecond.text(currentSecond);
        $elSecond.show();
        $('#buttonCaptchaGet').hide();
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
        $('#captchaSecond').hide();
        $('#buttonCaptchaGet').show();
    }

    /**
     * 倒计时Tick
     */
    function countDownStep() {
        if (currentSecond === 0) {
            // 计时到0，停止计时
            stopCountDown();
        } else {
            $('#captchaSecond').text(--currentSecond);
        }
    }

    /**
     * 页面跳转
     */
    function jumpPage() {
        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.unionpay';
    }

    /**
     * 初始化时被调用
     */
    function init() {
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
        $('#buttonGift').bind('click', checkMobile);
        // 获取验证码
        $('#buttonCaptchaGet').bind('click', getCaptch);
        // 提交领取红包
        $('#buttonSubmit').bind('click', getGift);
    }

    init();
});