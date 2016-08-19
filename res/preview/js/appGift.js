(function ($, UP, config) {
    "use strict";

    UP.W = UP.W || {};
    UP.W.VMarketing = UP.W.VMarketing || {};
    UP.W.VMarketing.AppGift = {};

    var ICON_ROOT = (function () {
        var host = location.hostname;
        if (host === 'youhui.95516.com' || host === 'wallet.95516.com') {
            return 'http://youhui.95516.com/';
        } else {
            return 'http://172.18.179.11/';
        }
    })();

    var appGift = UP.W.VMarketing.AppGift;
    var util = UP.W.Util;
    var env = UP.W.Env;
    var app = UP.W.App;
    var ui = UP.W.UI;

    var $container = null;                  // 当前模块容器
    var index = null;                       // 主页面对象
    var mobile = '';                        // 用户手机号

    /**
     * 查询票券列表
     */
    function initPageData() {
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
                ui.dismiss();
                data = data && data.params;
                var gift = data.billList;
                if (gift && gift.length > 0) {
                    var template = '<% for(var i = 0, len = gift.length; i < len; i++) { %>';
                    template += '<div class="ticket">';
                    template += '        <div class="ticket-icon"><img src="<%- gift[i].picPath %>"/></div>';
                    template += '        <div class="ticket-text"><p class="ticket-title"><%- gift[i].brandNm %></p><span class="ticket-quan">券</span>';
                    template += '        <span>&nbsp;&nbsp;<%- gift[i].cityCnNm %></span>';
                    template += '    <p class="ticket-desc"><%- gift[i].billNm %></p>';
                    template += '        <p class="ticket-date">有效期至：<%- gift[i].validEndDt %></p></div>';
                    template += '    </div>';
                    template += '<% } %>';
                    // 票券图标路径及日期需要预处理一下
                    for (var i = 0, len = gift.length; i < len; i++) {
                        gift[i].picPath = ICON_ROOT + gift[i].picPath;
                        gift[i].validEndDt = (gift[i].validEndDt || '').replace(/(\d{4}|\d{2})(?=\d{2})/g, '$1-');
                    }
                    var tpl = util.template(template, {gift: gift});
                    $container.find('#ticketList').append(tpl);
                }

                // 检查绑卡情况
                checkUserBindCard();
            },
            function (err) {
                console.log('getAwardInfoForSns error:');
                console.log(err);
                ui.dismiss();
                // 服务器出错
                ui.showToast(err.msg);
            },
            function (xhr) {
                console.log('getAwardInfoForSns: HTTP error:');
                console.log(xhr);
                ui.dismiss();
                ui.showToast('获取领奖信息出错，请稍后重试！');
            }
        );
    }

    /**
     * 判断用户绑卡情况
     */
    function checkUserBindCard() {
        // 判断绑卡
        var params = {
            method: 'POST',
            cmd: 'card.list',
            params: {}
        };
        ui.showLoading();
        app.sendMessage(params, false, false,
            function (data) {
                ui.dismiss();
                console.log(data);
                data = data && data.params;

                if (data && data.bindRelations && data.bindRelations.length > 0) {
                    // 有绑卡
                    $container.find('#bindCardTip2').show();
                    $container.find('#joinActivityButton').show();
                    $container.find('#giftJoinTips').show();
                } else {
                    // 无绑卡
                    $container.find('#bindCardTip1').show();
                    $container.find('#bindCardButton').show();
                }
            },
            function (err) {
                console.log('card.list error:');
                console.log(err);
                ui.dismiss();
                // 服务器出错
                ui.showToast(err.msg);
            },
            function (xhr) {
                console.log('card.list: HTTP error:');
                console.log(xhr);
                ui.dismiss();
                ui.showToast('查询卡列表出错，请稍后重试！');
            });
    }

    /**
     * 绑卡并检查结果
     */
    function addBankCard() {
        app.addBankCard(function () {
                $container.find('#bindCardTip2').show();
                $container.find('#joinActivityButton').show();
                $container.find('#giftJoinTips').show();
                $container.find('#bindCardTip1').hide();
                $container.find('#bindCardButton').hide();
            },
            function (err) {
                // 取消或绑卡失败
            }, {});
        app.logEvent("chongyang_giftView_bindcard");
    }

    /**
     * 初始化时被调用
     */
    appGift.onInit = function ($el, indexRef, data) {
        console.log('appGift init.');
        $container = $el;
        index = indexRef;
        mobile = data.mobile || '';

        // 绑定各种事件
        // 绑卡
        $container.find('#buttonBindCard').bind('click', addBankCard);

        if (app.isPluginReady()) {
            // 获取用户信息，初始化数据
            initPageData();
            app.logPageBegin("chongyang_giftView");
        } else {
            document.addEventListener('pluginready', function () {
                console.log('appGift: Plugin Ready.');
                // 获取用户信息，初始化数据
                initPageData();
                app.logPageBegin("chongyang_giftView");
            }, false);
        }

    };

    /**
     * 显示时被调用
     */
    appGift.onShow = function () {
        console.log('appGift show.');
    };

})(Zepto, window.UP = window.UP || {}, window.config = window.config || {});