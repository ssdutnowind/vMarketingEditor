(function ($, UP) {
    "use strict";

    UP.W = UP.W || {};
    // H5UI组件
    UP.W.UI = UP.W.UI || {};

    var ui = UP.W.UI;

    /**
     * 显示H5加载动画
     * @param msg
     */
    ui.showLoading = function (msg) {
        if ($('#commonUILoading').length === 0) {
            //将commonUI-mask和commonUI-loading并行放置，共同放置到 commonUILoading内[Android4.4.4黑条bug]
            var html = '<div id="commonUILoading"><div class="commonUI-mask"></div>';
            html += '<div class="commonUI-loading">';
            html += '<div class="commonUI-loadingPic">';
            html += '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(0 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(30 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.08333333333333333s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(60 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.16666666666666666s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(90 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.25s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(120 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.3333333333333333s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(150 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.4166666666666667s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(180 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(210 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5833333333333334s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(240 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.6666666666666666s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(270 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.75s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(300 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.8333333333333334s" repeatCount="indefinite"/></rect><rect  x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(330 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.9166666666666666s" repeatCount="indefinite"/></rect></svg>';
            html += '</div>';
            html += '<div class="commonUI-loadingText">加载中...</div>';
            html += '</div>';
            html += '</div>';
            $('body').append(html);
        }
        var $el = $('#commonUILoading');
        $el.find('.commonUI-loadingText').text(msg || '加载中...');
        $('body').addClass('commonUI-overflow');
        $el.show();
    };

    /**
     * 隐藏H5加载动画
     */
    ui.dismiss = function () {
        $('#commonUILoading').hide();
        $('body').removeClass('commonUI-overflow');
    };

    /**
     * 显示H5 Toast提示
     * @param msg
     */
    var toastTimer = null;
    ui.showToast = function (msg, time) {
        time = time || 3000;
        if ($('#commonUIToast').length === 0) {
            var html = '<div id="commonUIToast" class="commonUI-toast">';
            html += '<div class="commonUI-toast-wrapper">';
            html += '<span></span>';
            html += '</div>';
            html += '</div>';
            $('body').append(html);
        }
        var $el = $('#commonUIToast');
        $el.find('span').text(msg);
        // 动画渐显
        $el.show();
        $el.removeClass('fadeOut');
        $el.addClass('fadeIn');
        clearTimeout(toastTimer);
        // 动画渐隐
        toastTimer = setTimeout(function () {
            $el.removeClass('fadeIn');
            $el.addClass('fadeOut');
            setTimeout(function () {
                $el.hide();
            }, 800);
        }, time);
    };

    /**
     * 提示/确认对话框
     * @param message 提示消息
     * @param okCallback “确定/知道了”回调
     * @param cancelCallback “取消”回调
     * @param okText “确定/知道了”按钮自定义文本
     * @param cancelText “取消”按钮自定义文本
     * @param titleText “提示” 标题 文本
     */
    ui.showAlert = function (message, okCallback, cancelCallback, okText, cancelText, titleText) {
        if ($('#commonUIAlert').length === 0) {
            var html = '<div id="commonUIAlert" class="commonUI-mask">';
            html += '<div class="commonUI-alert">';
            //头部
            html += '<div class="commonUI-alertTitle">';
            html += '<p>提示</p>';
            html += '</div>';
            // 上部
            html += '<div class="commonUI-alertTop">';
            html += '<p></p>';
            html += '</div>';
            // 下部
            html += '<div class="commonUI-alertBottom">';
            html += '<button class="commonUI-alertButton" data-btn="Yes">确定</button>';
            html += '<button class="commonUI-alertButton" data-btn="No">取消</button>';
            html += '<button class="commonUI-alertButton" data-btn="OK">知道了</button>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            $('body').append(html);
        }

        $('.commonUI-alertButton').unbind().bind('click', function () {
            $el.hide();
            $('body').removeClass('commonUI-overflow');
            // 确定点击了哪个按钮，调用对应的回调
            var type = $(this).attr('data-btn');
            if (type === 'Yes' || type === 'OK') {
                if (typeof okCallback === 'function') {
                    okCallback();
                }
            } else if (type === 'No') {
                if (typeof cancelCallback === 'function') {
                    cancelCallback();
                }
            }
        });

        var $el = $('#commonUIAlert');
        // 如果定义了cancelCallback或cancelText则是confirm
        if (cancelCallback || cancelText) {
            $el.find('.commonUI-alertButton[data-btn="Yes"]').text(okText || '确定').show();
            $el.find('.commonUI-alertButton[data-btn="No"]').text(cancelText || '取消').show();
            $el.find('.commonUI-alertButton[data-btn="OK"]').hide();
        } else {
            $el.find('.commonUI-alertButton[data-btn="Yes"]').hide();
            $el.find('.commonUI-alertButton[data-btn="No"]').hide();
            $el.find('.commonUI-alertButton[data-btn="OK"]').show(okText || '知道了');
        }
        $el.find('.commonUI-alertTop p').text(message);
        //头部提示，允许为空串
        if (typeof titleText !== 'undefined') {
            $el.find('.commonUI-alertTitle p').text(titleText);
        } else if (cancelCallback || cancelText) {
            $el.find('.commonUI-alertTitle p').text("确认");
        } else {
            $el.find('.commonUI-alertTitle p').text("提示");
        }

        $('body').addClass('commonUI-overflow');
        $el.show();
    };

    /**
     * 显示缴费成功等提示等待画面
     * @param message1
     * @param message2
     * @param callback
     * @param buttonText
     */
    ui.showWaitingDialog = function (message1, message2, callback, buttonText) {
        if ($('#commonUIWaiting').length === 0) {
            var html = '<div id="commonUIWaiting" class="commonUI-mask">';
            html += '<div class="commonUI-waiting">';
            // 上部
            html += '<div class="commonUI-waitingTop">';
            html += '<div class="commonUI-waitingInner">';
            html += '<p class="commonUI-waiting-text1">缴费已经成功提交</p>';
            html += '<p class="commonUI-waiting-text2">预计10分钟后缴费成功，详情请稍后查看“我的消息”</p>';
            html += '</div>';
            html += '</div>';
            // 下部
            html += '<div class="commonUI-waitingBottom">';
            html += '<button class="commonUI-waitingButton" data-btn="OK">知道了</button>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            $('body').append(html);

            $('.commonUI-waitingButton').bind('click', function () {
                $('#commonUIWaiting').hide();
                $('body').removeClass('commonUI-overflow');
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }

        var $el = $('#commonUIWaiting');
        $el.find('.commonUI-waiting-text1').text(message1 || '缴费已经成功提交');
        $el.find('.commonUI-waiting-text2').text(message2 || '预计10分钟后缴费成功，详情请稍后查看“我的消息”');
        $el.find('.commonUI-waitingButton').text(buttonText || '知道了');
        $('body').addClass('commonUI-overflow');
        $el.show();
    };

})(Zepto, window.UP = window.UP || {});