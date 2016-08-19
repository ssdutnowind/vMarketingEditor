var response = {
    old: {
        "vMarketing/isUserExisted": {
            "v": "1.0",
            "cmd": "vMarketing/getAwardInfoForSns",
            "params": {"cdhdUsrId": "", "existed": "2"},
            "msg": "",
            "resp": "00"
        }
    },
    new: {
        "vMarketing/isUserExisted": {
            "v": "1.0",
            "cmd": "vMarketing/getAwardInfoForSns",
            "params": {"cdhdUsrId": "", "existed": "0"},
            "msg": "",
            "resp": "00"
        }
    },
    already: {
        "vMarketing/getAwardInfoForSns": {
            "v": "1.0",
            "cmd": "vMarketing/getAwardInfoForSns",
            "params": {
                "newUserGiftPack": "123456",
                "recSt": "",
                "recUpdTs": "",
                "oldUserGiftPack": "",
                "mobile": "12300000000",
                "billList": [
                    {
                        "picPath": "../img/shareIcon.jpg",
                        "brandNm": "中国银联",
                        "cityCnNm": "上海",
                        "billNm": "中国银联预览用券1",
                        "validEndDt": "20161010"
                    },
                    {
                        "picPath": "../img/shareIcon.jpg",
                        "brandNm": "中国银联",
                        "cityCnNm": "沈阳",
                        "billNm": "中国银联预览用券2",
                        "validEndDt": "20161212"
                    }
                ]
            },
            "msg": "",
            "resp": "00"
        }
    },
    default: {
        "vMarketing/getAwardInfoForSns": {
            "v": "1.0",
            "cmd": "vMarketing/getAwardInfoForSns",
            "params": {
                "newUserGiftPack": "",
                "recSt": "",
                "recUpdTs": "",
                "oldUserGiftPack": "",
                "mobile": "12300000000"
            },
            "msg": "",
            "resp": "00"
        },
        "vMarketing/sendVfyCode": {
            "v": "1.0",
            "cmd": "vMarketing/sendVfyCode",
            "params": {},
            "msg": "",
            "resp": "00"
        },
        "vMarketing/receiveAward": {
            "v": "1.0",
            "cmd": "vMarketing/receiveAward",
            "params": {
                "newUserGiftPack": "123456",
                "recSt": "",
                "recUpdTs": "",
                "oldUserGiftPack": "",
                "mobile": ""
            },
            "msg": "",
            "resp": "00"
        },
        "vMarketing/getInvitationInfo": {
            "v": "1.0",
            "cmd": "vMarketing/receiveAward",
            "params": {
                "recmdUserNum": "12",
                "firstRecmdBonusTotalPoint": "100",
                "secondRecmdBonusTotalPoint": "88",
                "recmdBonusList": [
                    {
                        "recmdedUsrSt": "01",
                        "firstRecmdBonusPoint": "0",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "01",
                        "firstRecmdBonusPoint": "0",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "03",
                        "firstRecmdBonusPoint": "0",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "04",
                        "firstRecmdBonusPoint": "10",
                        "secondRecmdBonusPoint": "88",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "03",
                        "firstRecmdBonusPoint": "0",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "04",
                        "firstRecmdBonusPoint": "24",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "04",
                        "firstRecmdBonusPoint": "40",
                        "secondRecmdBonusPoint": "10",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "04",
                        "firstRecmdBonusPoint": "5",
                        "secondRecmdBonusPoint": "8",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "01",
                        "firstRecmdBonusPoint": "0",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "01",
                        "firstRecmdBonusPoint": "0",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    },
                    {
                        "recmdedUsrSt": "01",
                        "firstRecmdBonusPoint": "0",
                        "secondRecmdBonusPoint": "0",
                        "recmdedMobile": "186****1234"
                    }
                ]
            },
            "msg": "",
            "resp": "00"
        }
    }
};

window.plugins = {
    // UPWebAnalysisPlugin:{
    //     logPageBegin: function(){
    //
    //     }
    // },
    // UPWebUserInfoPlugin:{
    //     fetchNativeData: function(success){
    //
    //     }
    // }
};
var user = UP.W.Util.urlQuery2Obj().user || 'new';

UP.W.App.sendMessage = function (params, forChsp, byAjax, success, error, fail) {
    var cmd = params.uri || params.cmd;

    if (response[user][cmd]) {
        success(response[user][cmd]);
    } else {
        success(response.default[cmd]);
    }
};

UP.W.App.getUserDetailInfo = function(success, fail){
    success({username: '12300000000'});
};

UP.W.App.fetchNativeData = function(type, success, fail){
    success({userId: 'c00000001'});
};

UP.W.App.logEvent = function(){

};

UP.W.App.logPageBegin = function(){

};

UP.W.App.addBankCard = function(success, fail){
    success();
};