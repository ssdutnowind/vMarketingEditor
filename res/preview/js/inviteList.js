(function ($, UP, config) {
    "use strict";

    UP.W = UP.W || {};
    UP.W.VMarketing = UP.W.VMarketing || {};
    UP.W.VMarketing.InviteList = {};

    var inviteList = UP.W.VMarketing.InviteList;
    var util = UP.W.Util;
    var env = UP.W.Env;
    var app = UP.W.App;
    var ui = UP.W.UI;

    var $container = null;                  // 当前模块容器
    var cUserId = "";                  // 用户带c的userId
    var myInviteList = [];
    var listLimit = 10;     // 默认显示条数限制

    /**
     * 查询用户邀请列表信息
     */
    function initInviteList() {
        // 判断用户领奖情况
        var params = {
            uri: 'vMarketing/getInvitationInfo',
            method: 'GET',
            params: {
                cdhdUsrId: cUserId,
                activityId: config.activityId
            }
        };
        // 向后台查询用户获奖情况（forChsp，byPlugin）
        ui.showLoading();
        app.sendMessage(params, true, false,
            function (data) {
                data = data && data.params;
                ui.dismiss();
                // 推荐总人数、红包
                $("#inviteNumber").text(data.recmdUserNum || '0');
                $("#inviteFirstRedPack").text(data.firstRecmdBonusTotalPoint || '0');
                $("#inviteSecondRedPack").text(data.secondRecmdBonusTotalPoint || '0');
                // 推荐列表
                myInviteList = data.recmdBonusList || [];
                //向页面拼html串
                listHtml(myInviteList);
                // 超过5条
                if (myInviteList.length > listLimit) {
                    $('#moreButtonContainer').show();
                }

            },
            function (err) {
                console.log('vMarketing/getInvitationInfo error:');
                console.log(err);
                ui.dismiss();
                // 服务器出错
                ui.showToast(err.msg);
            },
            function (xhr) {
                console.log('vMarketing/getInvitationInfo: HTTP error:');
                console.log(xhr);
                ui.dismiss();
                ui.showToast('获取邀请列表信息出错，请稍后重试！');
            }
        );
    }

    /**
     * 拼html串
     */
    function listHtml(myInviteList) {
        // 每次进入重新刷新列表，所以先要清空
        $("#myInviteList").empty();
        var str = "";
        for (var i = 0; i < myInviteList.length; i++) {
            var recmdedUsrSt = myInviteList[i].recmdedUsrSt;
            var firstGift = '';
            var secondGift = (myInviteList[i].secondRecmdBonusPoint || '0') + '元红包';
            if (recmdedUsrSt === '01') {
                firstGift = '待认证';
            } else if (recmdedUsrSt === '03') {
                firstGift = '待注册';
            } else if (recmdedUsrSt === '04') {
                // 奎爷要求加的，一级用户被推荐时已经注册过，但是产生了二级用户
                firstGift = '已获取' + (myInviteList[i].firstRecmdBonusPoint || '0') + '元';
            } else {
                firstGift = '已获取' + (myInviteList[i].firstRecmdBonusPoint || '0') + '元';
            }
            var itemStr = '<div class="invite-list-item"><div>' + myInviteList[i].recmdedMobile + "</div> <div>" + firstGift + "</div> <div>" + secondGift + "</div> </div>";
            str += itemStr;
            // 达到默认显示上限
            if (i === listLimit - 1) {
                break;
            }
        }
        $("#myInviteList").append(str);
    }

    /**
     * 显示全部列表（页面点击事件）
     */
    function showMore() {
        var str = "";
        for (var i = listLimit; i < myInviteList.length; i++) {
            var recmdedUsrSt = myInviteList[i].recmdedUsrSt;
            var firstGift = '';
            var secondGift = (myInviteList[i].secondRecmdBonusPoint || '0') + '元红包';
            if (recmdedUsrSt === '01') {
                firstGift = '待认证';
            } else if (recmdedUsrSt === '03') {
                firstGift = '待注册';
            } else if (recmdedUsrSt === '04') {
                // 奎爷要求加的，一级用户被推荐时已经注册过，但是产生了二级用户
                firstGift = '已获取' + (myInviteList[i].firstRecmdBonusPoint || '0') + '元';
            } else {
                firstGift = '已获取' + (myInviteList[i].firstRecmdBonusPoint || '0') + '元';
            }
            var itemStr = '<div class="invite-list-item"><div>' + myInviteList[i].recmdedMobile + "</div> <div>" + firstGift + "</div> <div>" + secondGift + "</div> </div>";
            str += itemStr;
        }
        $("#myInviteList").append(str);
        $('#moreButtonContainer').hide();
    }

    /**
     * 获取用户信息，初始化页面
     */
    function initPageData() {
        ui.showLoading();

        // 查询用户id（带c开头的）
        app.fetchNativeData("5", function (data) {
            cUserId = data.userId;
            ui.dismiss();
            initInviteList();
        }, function (data) {
            ui.dismiss();
            ui.showToast(data);
        });
    }

    /**
     * 初始化时被调用
     */
    inviteList.onInit = function ($el, index, data) {
        console.log('inviteList init.');
        $container = $el;

        // 查看更多
        $container.find('#moreButton').bind('click', showMore);
    };

    /**
     * 显示时被调用
     */
    inviteList.onShow = function () {
        console.log('inviteList show.');
        $('#moreButtonContainer').hide();
        // 每次进入都重新刷页面
        if (app.isPluginReady()) {
            // 获取用户信息，初始化数据
            initPageData();
            app.logPageBegin('chongyang_myrewardView');
        } else {
            document.addEventListener('pluginready', function () {
                console.log('inviteList: Plugin Ready.');
                // 获取用户信息，初始化数据
                initPageData();
                app.logPageBegin('chongyang_myrewardView');
            }, false);
        }
    };

})(Zepto, window.UP = window.UP || {}, window.config = window.config || {});