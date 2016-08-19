(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    UP.W.VMarketing = UP.W.VMarketing || {};
    UP.W.VMarketing.InviteIndex = UP.W.VMarketing.InviteIndex || {};

    var inviteIndex = UP.W.VMarketing.InviteIndex;
    var util = UP.W.Util;
    var env = UP.W.Env;
    var ui = UP.W.UI;

    // 配置项
    window.config = $.extend(window.defaultConfig, window.config || {});

    // 页面路由
    var loadingModule = false;
    var router = {
        inviteMain: 'InviteMain',
        inviteList: 'InviteList',
        activityRuleNew: '',
        activityRuleInvite: '',
        redPackIntro: ''
    };
    // 页面参数
    var pageData = {};

    /**
     * 根据hash加载模块
     * @param hash
     */
    function loadModule(hash) {
        // 禁止在模块加载时加载模块
        if (loadingModule) {
            return;
        }
        document.body.scrollTop = 0;
        // 单独本页面逻辑
        if (router[hash]) {
            $('#buttonShowQRCode').show();
        } else {
            $('#buttonShowQRCode').hide();
        }


        // 找不到则默认加载首页
        var moduleName = router[hash] === undefined ? 'InviteMain' : router[hash];
        var $el = $('#page_' + hash);
        if ($el.length > 0) {
            ui.dismiss();
            // 已经存在，直接显示并调用show方法
            $('.page-container').hide();
            $el.show();
            if (UP.W.VMarketing[moduleName] && (typeof UP.W.VMarketing[moduleName].onShow === 'function')) {
                UP.W.VMarketing[moduleName].onShow();
            }
        } else {
            // 不存在则动态加载
            ui.showLoading();
            loadingModule = true;
            var modules = ['./' + hash + '.html'];
            if (moduleName) {
                modules.push('../js/' + hash + '.js');
            }
            seajs.use(modules, function (html) {
                loadingModule = false;
                ui.dismiss();
                // 生成界面
                html = initTemplate(window.config, html.replace(/<script[^>]*>|<\/script>/g,''));
                var $el = $('<div class="page-container"></div>').append(html);
                // 初始化管理平台配置的文案
                $el.attr('id', 'page_' + hash);
                $('#pageWrapper').append($el);
                $('.page-container').hide();
                if (UP.W.VMarketing[moduleName]) {
                    var data = pageData[hash] || {};
                    delete pageData[hash];
                    if (typeof UP.W.VMarketing[moduleName].onInit === 'function') {
                        UP.W.VMarketing[moduleName].onInit($el, inviteIndex, data);
                    }
                }
                $el.show();
                if (UP.W.VMarketing[moduleName]) {
                    if (typeof UP.W.VMarketing[moduleName].onShow === 'function') {
                        UP.W.VMarketing[moduleName].onShow();
                    }
                }
            });
        }
    }

    /**
     * 根据配置初始化模板中的文案
     * @param config
     * @param html
     */
    function initTemplate(config, html) {
        return util.template(html, config);
    }

    /**
     * hash改变，进行页面跳转
     * @param e
     */
    function onHashChange(e) {
        var hash = location.hash.replace('#', '');
        console.log('hash change: ' + (hash || 'inviteMain'));
        loadModule(hash || 'inviteMain');
    }

    /**
     * 通过脚本方式打开一个页面并传递参数
     * @param page
     * @param data
     */
    inviteIndex.openPage = function (page, data) {
        if (data) {
            pageData[page] = data;
        }
        location.hash = page;
    };

    /**
     * 初始化
     */
    inviteIndex.init = function () {
        // 监听hashchange事件，在hashchange时进行页面切换
        location.hash = '#';
        console.log('load module: inviteMain');
        loadModule('inviteMain');
        setTimeout(function () {
            $(window).bind('hashchange', onHashChange);
        }, 0);

        // inviteIndex内页面共用扫码，特殊处理一下
        if(config && config.scanTip) {
            $('#scanTip').text(config.scanTip);
        }
    };

    // 初始化整个营销页面
    inviteIndex.init();

})(Zepto, window.UP = window.UP || {});