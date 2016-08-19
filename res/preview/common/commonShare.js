/**
 * 注意：本文件依赖于commonUtil.js
 * 本文件用于放在分享到社交平台的页面内，能够尽量适配分享内容。
 * 使用该文件需要在全局声明如下变量：
 * [shareTitle] 分享标题
 * [shareDesc] 分享摘要
 * [shareUrl] 分享链接（可选，如果未配置则将当前页面链接作为分享地址）
 * [shareIcon] 分享图标（可选，如果未配置则默认指定钱包图标）
 */
(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    // 环境变量
    UP.W.Share = UP.W.Share || {};

    var share = UP.W.Share;
    var util = UP.W.Util;

    /**
     * 初始化
     */
    share.initShareData = function () {
        // 必需配置了分享内容
        if (window.shareTitle && window.shareDesc) {
            window.shareUrl = window.shareUrl || location.href;
            window.shareIcon = window.shareIcon || (UP.W.Env.pathWalletRes + '/web/common/img/shareIcon.png');
            // 有些浏览器会找页面最前面的h1、p、img等作为分享内容，所以放一个DIV存放这些内容
            // 而且这些内容不能隐藏，所以高度设为0，overflow设为hidden，确保不影响原有UI
            // 如果已经存在了则删除
            var dom = document.querySelector('#commonShareElement');
            if (dom) {
                document.removeChild(dom);
            }

            dom = document.createElement('div');
            dom.style.height = 0;
            dom.style.overflow = 'hidden';
            dom.id = 'commonShareElement';
            var html = '<h1 data-shareTitle>' + window.shareTitle + '</h1>';
            html += '<p data-shareDesc>' + window.shareDesc + '</p>';
            html += '<img class="logo" src="' + window.shareIcon + '"/>';
            dom.innerHTML = html;
            var body = document.querySelector('body');
            body.insertBefore(dom, body.firstElementChild);

            // 如果是微信需要加载并初始化JSSDK
            if(UP.W.Env.platform === 'WeChat') {
                var jssdk = location.protocol + '//res.wx.qq.com/open/js/jweixin-1.1.0.js';
                UP.W.Util.loadScript(jssdk);
                configWeChat();
            }
        }
    };

    /**
     * 初始化微信成功
     */
    function wxReady() {
        var snsConfig = {
            title: window.shareTitle, // 分享标题
            desc: window.shareDesc, // 分享描述
            link: window.shareUrl, // 分享链接
            imgUrl: window.shareIcon, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        };
        // 朋友圈
        window.wx.onMenuShareTimeline(snsConfig);
        // 微信好友
        window.wx.onMenuShareAppMessage(snsConfig);
        // QQ空间
        window.wx.onMenuShareQZone(snsConfig);
        // QQ好友
        window.wx.onMenuShareQQ(snsConfig);
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
        UP.W.Util.sendMessageWeChat('sdkConfig.php', {}, function (data) {
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
                        'onMenuShareQZone'
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

            },
            function (err) {
                console.log('sdkConfig.php error: ' + err);
            });
    }

    share.initShareData();

})(Zepto, window.UP = window.UP || {});