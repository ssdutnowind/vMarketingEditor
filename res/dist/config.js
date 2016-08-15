var EDITOR_CONFIG = {
    varsion: '0.1',
    groups: [
        {
            groupId: 'g01',
            groupName: '活动基本配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '活动ID',
                    itemDesc: '每期活动对应ID，需要从biz获取',
                    type: 'String',
                    exports: 'activityId',
                    default: '',
                    extra: {
                        must: true,
                        maxLength: 10,
                        size: 6
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '活动状态',
                    itemDesc: '0：结束；1：开始',
                    type: 'Select',
                    exports: 'activityStatus',
                    default: '1',
                    options: [
                        {
                            label: '1: 开始',
                            value: '1'
                        },
                        {
                            label: '0: 结束',
                            value: '0'
                        }
                    ],
                    extra: {
                        size: 6
                    }
                }
            ]
        },
        {
            groupId: 'g02',
            groupName: '分享内容配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '分享标题',
                    itemDesc: '分享到社交平台的标题内容',
                    type: 'String',
                    exports: 'shareTitle',
                    default: '',
                    extra: {
                        must: true,
                        maxLength: 20
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '分享摘要',
                    itemDesc: '分享到社交平台的摘要内容',
                    type: 'String',
                    exports: 'shareDesc',
                    default: '',
                    extra: {
                        must: true,
                        maxLength: 50
                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '分享图标路径',
                    itemDesc: '一般使用默认值即可',
                    type: 'String',
                    exports: 'shareIcon',
                    default: '/theme/img/shareIcon.jpg',
                    extra: {
                        must: true,
                        maxLength: 100
                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '分享图标',
                    itemDesc: '分享到社交平台的图标文件，和“分享图标路径”配合使用',
                    type: 'Image',
                    exports: 'shareIcon.jpg',
                    default: '',
                    extra: {
                        suffix: '.jpg',
                        maxSize: 100 * 1024
                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '扫码提示',
                    itemDesc: '二维码下方的提示文本',
                    type: 'String',
                    exports: 'scanTip',
                    default: '好友扫一扫，一起领取银联钱包新人礼',
                    extra: {
                        must: true,
                        maxLength: 20
                    }
                }
            ]
        },
        {
            groupId: 'g03',
            groupName: '拉新页面配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '领取按钮标题（社交）',
                    itemDesc: '社交平台领取按钮的文本',
                    type: 'String',
                    exports: 'snsGiftButtonTitle',
                    default: '领取新人礼包',
                    extra: {
                        must: true,
                        maxLength: 10
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '验证码文案',
                    itemDesc: '输入验证码界面的标题文本',
                    type: 'String',
                    exports: 'captchaTitle',
                    default: '为保证礼包领取成功，请验证手机号',
                    extra: {
                        must: true,
                        maxLength: 20
                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '验证码提示',
                    itemDesc: '输入验证码界面下方的提示信息',
                    type: 'String',
                    exports: 'captchaTip',
                    default: '温馨提示：登录或注册银联钱包客户端的手机号码，必须与本次领券的手机号保持一致。',
                    extra: {
                        must: true,
                        maxLength: 50
                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '领取按钮标题（客户端）',
                    itemDesc: '分享到社交平台的摘要内容',
                    type: 'String',
                    exports: 'appGiftButtonTitle',
                    default: '领取新人礼包',
                    extra: {
                        must: true,
                        maxLength: 10
                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '查看礼包按钮标题',
                    itemDesc: '二维码下方的提示文本',
                    type: 'String',
                    exports: 'appShowGiftButtonTitle',
                    default: '查看礼包',
                    extra: {
                        must: true,
                        maxLength: 10
                    }
                }
            ]
        },
        {
            groupId: 'g04',
            groupName: '礼包页面配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '礼包标题',
                    itemDesc: '',
                    type: 'String',
                    exports: 'giftListTitle',
                    default: '已领取新人礼',
                    extra: {
                        must: true,
                        maxLength: 10
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '礼包提示',
                    itemDesc: '礼包页面下方的提示信息',
                    type: 'String',
                    exports: 'giftListTip',
                    default: '*作弊用户将被取消各种礼品，最终获得奖励以中国银联最后公布为准',
                    extra: {
                        must: true,
                        maxLength: 50
                    }
                }
            ]
        },
        {
            groupId: 'g05',
            groupName: '邀请页面配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '邀请说明标题',
                    itemDesc: '下方邀请说明的标题',
                    type: 'String',
                    exports: 'inviteRuleTitle',
                    default: '更多红包，更多好礼等你拿',
                    extra: {
                        must: true,
                        maxLength: 15
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '邀请说明内容',
                    itemDesc: '邀请说明具体内容，每行一条，不需输入1、2、3',
                    type: 'Array',
                    exports: 'inviteRuleContent',
                    default: [
                        '每邀请1名好友，您可获得1-10元随机银联红包奖励，好友可获得新人礼包。',
                        '好友再邀请1名好友，您可再获得2元银联红包奖励。',
                        '光荣奖：邀请好友达10-49名，再赠送30元银联红包；邀请好友达50-499名，再赠送300元银联红包；邀请好友达500名及以上，邀请人数最多的前5名，再赠送4999元银联红包。'
                    ],
                    extra:{
                        must: true
                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '苹果无关提示',
                    itemDesc: '不需要可以清空',
                    type: 'String',
                    exports: 'appleTip',
                    default: '本活动与Apple Inc.无关',
                    extra: {
                        must: true,
                        maxLength: 20
                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '活动停止大标题',
                    itemDesc: '活动停止提示的第一行文字，可以改为暂停等含义',
                    type: 'String',
                    exports: 'activityStopTitle',
                    default: '活动已完美闭幕！',
                    extra: {
                        must: true,
                        maxLength: 50
                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '活动停止小标题',
                    itemDesc: '活动停止提示的第二行文字，可以改为暂停等含义',
                    type: 'String',
                    exports: 'activityStopDesc',
                    default: 'XXXX.XX.XX日后邀请成功的小伙伴不再获得红包',
                    extra: {
                        must: true,
                        maxLength: 50
                    }
                }
            ]
        },
        {
            groupId: 'g06',
            groupName: '邀请列表页配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '注释说明',
                    itemDesc: '',
                    type: 'String',
                    exports: 'inviteListTip1',
                    default: '注：好友注册且绑定银行卡后，您可获得邀请奖励',
                    extra: {
                        maxLength: 50
                    }
                },
                {
                    itemId: 'i01',
                    itemLabel: '红包到账说明',
                    itemDesc: '',
                    type: 'String',
                    exports: 'inviteListTip2',
                    default: '红包将在获奖2天后到账',
                    extra: {
                        maxLength: 50
                    }
                }
            ]
        },
        {
            groupId: 'g07',
            groupName: '拉新细则配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '细则标题',
                    itemDesc: '',
                    type: 'String',
                    exports: 'ruleNewTitle',
                    default: '新人专享活动细则',
                    extra: {
                        must: true,
                        maxLength: 15
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '活动时间',
                    itemDesc: '',
                    type: 'String',
                    exports: 'ruleNewTime',
                    default: '2016.XX.XX-2016.XX.XX',
                    extra: {
                        must: true,
                        maxLength: 30
                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '活动规则',
                    itemDesc: '拉新活动细则，每行一条',
                    type: 'Array',
                    exports: 'ruleNewRule',
                    default: [
                        '1、新人礼包为银联钱包活动期间的新用户专享礼品包；',
                        '2、新人礼包记录在参与活动的手机号下，请使用参与活动的手机号注册并登录银联钱包APP；',
                        '3、礼包可立即领取，请注意礼包中的优惠券有效期，适用门店以优惠券详情中的适用门店为准。活动期间优惠券发放根据实际情况可能会有调整；',
                        '4、作弊、违规用户将被取消领取任何活动奖励的资格。'
                    ],
                    extra:{
                        must: true
                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '活动说明',
                    itemDesc: '拉新活动说明，每行一条',
                    type: 'Array',
                    exports: 'ruleNewDesc',
                    default: [
                        '1、参与本活动用户不得实施下列任何一种违规行为(以下统称”违规行为”)：',
                        'a) 虚假交易的行为；',
                        'b) 以非法盈利为目的参与本活动的行为；',
                        'c)通过恶意使用多个账号（包括但不限于同一IP\\同一设备\\同一注册手机号\\同一银行卡预留手机号\\同一银行卡（包括主卡附属的虚拟卡））参与本活动的行为，参与或协助套取银联钱包资源（包括但不限于各种优惠券、银联红包）的行为。',
                        'd) 以任何机器人软件、蜘蛛软件、爬虫软件、刷屏软件或其他自动方式参与本活动的行为；',
                        'e) 实施违反诚实信用原则行为；',
                        'f) 实施其他非真实领取的作弊行为。',
                        '2、在获取和使用奖品过程中，如果出现违规行为，银联钱包有权取消用户参与本次活动的资格和对其银联钱包账号进行冻结，并取消用户中奖资格不予发奖；同时有权撤销违规交易，并收回活动中已发放的奖品(包含已使用的部分)。并视情节严重性向违规用户索赔，并追究相关法律责任。',
                        '3、发放奖品时，中国银联有权要求用户提供其身份证、护照等身份证件、联系方式、参与活动账号等证明用户符合本活动规则的材料信息，如用户所提供的信息不真实、不完整、失效或不合法，举办方有权不发放奖品。',
                        '4、用户知悉互联网存在诸多不确定性。如因不可抗力以及活动中存在大面积作弊行为、通讯路线故障或者计算机大规模瘫痪等举办方原因致使难以继续开展本活动的，举办方有权修改、暂停或取消本活动。',
                        '5、对于活动如有疑问请拨打银联热线95516咨询。银联有权对获奖用户进行电话抽查，对不符合要求的用户取消获奖资格。',
                        '6、本活动所指的用户为自然人。',
                        '7、本活动与苹果公司无关。'
                    ],
                    extra:{
                        must: true
                    }
                }
            ]
        },
        {
            groupId: 'g08',
            groupName: '邀请细则配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '细则标题',
                    itemDesc: '',
                    type: 'String',
                    exports: 'ruleInviteTitle',
                    default: '邀请活动细则',
                    extra: {
                        must: true,
                        maxLength: 15
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '活动时间',
                    itemDesc: '',
                    type: 'String',
                    exports: 'ruleInviteTime',
                    default: '2016.XX.XX-2016.XX.XX',
                    extra: {
                        must: true,
                        maxLength: 30
                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '活动主题',
                    itemDesc: '',
                    type: 'String',
                    exports: 'ruleInviteTopic',
                    default: '',
                    extra: {
                        must: true,
                        maxLength: 30
                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '奖励说明',
                    itemDesc: '邀请活动奖励说明，每行一条',
                    type: 'Array',
                    exports: 'ruleInviteGiftDesc',
                    default: [
                        '1、每邀请1名好友，您可获得1-10元随机银联红包奖励，好友可获得新人礼包。',
                        '2、好友再邀请1名好友，您可再获得2元银联红包奖励。',
                        '3、额外奖励：邀请好友达10-49名，再赠送30元银联红包；邀请好友达50-499名，再赠送300元银联红包；邀请好友达500名及以上，邀请人数最多的前5名，再赠送4999元银联红包。',
                        '4、作弊用户将被取消领取活动奖励的资格。'
                    ],
                    extra:{
                        must: true
                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '活动规则',
                    itemDesc: '邀请活动规则，每行一条',
                    type: 'Array',
                    exports: 'ruleInviteRule',
                    default: [
                        '1、邀请好友参加活动，用户自己邀请的好友称为一级好友，一级好友邀请的好友称为二级好友。每邀请一名一级好友在银联钱包注册且成功绑卡，奖励“银联红包”，一级好友再次邀请二级好友在银联钱包注册且成功绑卡，一级好友和用户自己均可获奖励“银联红包”。多邀多得，上不封顶。',
                        '2、额外奖励的银联红包，仅限直接邀请的一级好友绑卡成功或通过账户实名认证的人数，您的好友再邀请的好友人数不计入额外奖励的有效人数内。',
                        '3、活动结束后根据成功邀请的用户总数，额外奖励里的银联红包不重复发放。获奖名单和奖品通过银联钱包微信（微信号：Yinlian_KY）公布，银联并用短信或电话联系获奖人。获奖用户根据活动要求提供相关材料信息后，额外奖励的银联红包将直接充值到获奖用户银联钱包注册账号。',
                        '4、额外奖励中的4999元银联红包，邀请一级好友人数达到500人及其以上，邀请人数最多的前5名用户获得。',
                        '5、邀请方式：分享到各社交平台（微信、朋友圈、微博、QQ、QQ空间等）和二维码扫码邀请。',
                        '6、邀请小伙伴的记录、得到的银联红包数可在银联钱包客户端活动页面及时查看。邀请好友数为直接邀请一级好友数。',
                        '7、邀请红包记录可立即查看，在获取红包时间的2日后入账，如有违规行为不予入账。',
                        '8、邀请红包获取说明：被邀请的小伙伴必须打开邀请用户分享的活动链接或二维码页面，参与活动领取礼包，下载银联钱包APP并成功注册（注册账号必须与参与活动手机号一致）和绑卡，此位小伙伴就算入成功邀请名额，邀请用户获取邀请红包。',
                        '9、绑卡说明：在“银联钱包”APP中，通过“卡管家”—“添加银行卡”，成功通过支付认证。或通过 “我的”— “身份信息”中添加同通过实名认证添加银行卡。',
                        '10、活动期间，参与活动的多个用户如绑定同一张银行卡，只算一次有效邀请绑卡用户。',
                        '11、被邀请的多个不同的新注册用户，如绑定的银行卡为同一开卡人，邀请用户只能得到一个银联红包，第一个绑卡的账号有效；如通过账户实名认证绑卡的多个账号为同一个身份证号，只计为一个有效邀请用户，第一个通过账户实名认证绑卡的账号有效。',
                        '12、作弊用户将被取消领取任何活动奖励的资格。'
                    ],
                    extra:{
                        must: true
                    }
                },
                {
                    itemId: 'i06',
                    itemLabel: '活动说明',
                    itemDesc: '邀请活动说明，每行一条',
                    type: 'Array',
                    exports: 'ruleNewDesc',
                    default: [
                        '1、参与本活动用户不得实施下列任何一种违规行为(以下统称”违规行为”)：',
                        'a) 虚假交易的行为；',
                        'b) 以非法盈利为目的参与本活动的行为；',
                        'c) 通过恶意使用多个账号（包括但不限于同一IP\\同一设备\\同一注册手机号\\同一银行卡预留手机号\\同一银行卡（包括主卡附属的虚拟卡）\\同一身份证号）参与本活动的行为，参与或协助套取银联钱包资源（包括但不限于各种优惠券、银联红包）的行为。',
                        'd) 以任何机器人软件、蜘蛛软件、爬虫软件、刷屏软件或其他自动方式参与本活动的行为；',
                        'e) 实施违反诚实信用原则行为；',
                        'f) 实施其他非真实领取的作弊行为。',
                        '2、在获取和使用奖品过程中，如果出现违规行为，银联钱包有权取消用户参与本次活动的资格和对其银联钱包账号进行冻结，并取消用户中奖资格不予发奖；同时有权撤销违规交易，并收回活动中已发放的奖品(包含已使用的部分)。并视情节严重性向违规用户索赔，并追究相关法律责任。',
                        '3、发放奖品时，中国银联有权要求用户提供其身份证、护照等身份证件、联系方式、参与活动账号等证明用户符合本活动规则的材料信息，如用户所提供的信息不真实、不完整、失效或不合法，举办方有权不发放奖品。',
                        '4、用户知悉互联网存在诸多不确定性。如因不可抗力以及活动中存在大面积作弊行为、通讯路线故障或者计算机大规模瘫痪等举办方原因致使难以继续开展本活动的，举办方有权修改、暂停或取消本活动。',
                        '5、对于活动如有疑问请拨打银联热线95516咨询。银联有权对获奖用户进行电话抽查，对不符合要求的用户取消获奖资格。',
                        '6、本活动所指的用户为自然人。',
                        '7、本活动与苹果公司无关。'
                    ],
                    extra:{
                        must: true
                    }
                }
            ]
        },
        {
            groupId: 'g09',
            groupName: '背景图片配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '说明背景图片',
                    itemDesc: 'bg_kb.jpg',
                    type: 'Image',
                    exports: 'bg_kb.jpg',
                    extra: {
                        suffix: '.jpg',
                        maxSize: 200 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.kb-bg',
                        name: 'background-image',
                        value: 'url("img/bg_kb.jpg")'

                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '拉新背景图片',
                    itemDesc: 'bg_lx.jpg',
                    type: 'Image',
                    exports: 'bg_lx.jpg',
                    extra: {
                        suffix: '.jpg',
                        maxSize: 200 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.lx-bg',
                        name: 'background-image',
                        value: 'url("img/bg_lx.jpg")'

                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '老用户背景图片',
                    itemDesc: 'bg_lyh.jpg',
                    type: 'Image',
                    exports: 'bg_lyh.jpg',
                    extra: {
                        suffix: '.jpg',
                        maxSize: 200 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.lyh-bg',
                        name: 'background-image',
                        value: 'url("img/bg_lyh.jpg")'

                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '邀请首页背景图片',
                    itemDesc: 'bg_yq.jpg',
                    type: 'Image',
                    exports: 'bg_yq.jpg',
                    extra: {
                        suffix: '.jpg',
                        maxSize: 200 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.yq-bg',
                        name: 'background-image',
                        value: 'url("img/bg_yq.jpg")'

                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '邀请列表背景图片',
                    itemDesc: 'bg_yq2.jpg',
                    type: 'Image',
                    exports: 'bg_yq2.jpg',
                    extra: {
                        suffix: '.jpg',
                        maxSize: 200 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.yq2-bg',
                        name: 'background-image',
                        value: 'url("img/bg_yq2.jpg")'

                    }
                }
            ]
        },
        {
            groupId: 'g10',
            groupName: '提示卡片配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '领取成功卡片',
                    itemDesc: 'card_after.png',
                    type: 'Image',
                    exports: 'card_after.png',
                    extra: {
                        suffix: '.png',
                        maxSize: 100 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.card-after',
                        name: 'background-image',
                        value: 'url("img/card_after.png")'

                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '已领取过卡片',
                    itemDesc: 'card_already.png',
                    type: 'Image',
                    exports: 'card_already.png',
                    extra: {
                        suffix: '.png',
                        maxSize: 100 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.card-already',
                        name: 'background-image',
                        value: 'url("img/card_already.png")'

                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '领取前卡片',
                    itemDesc: 'card_before.png',
                    type: 'Image',
                    exports: 'card_before.png',
                    extra: {
                        suffix: '.png',
                        maxSize: 100 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.card-before',
                        name: 'background-image',
                        value: 'url("img/card_before.png")'

                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '老用户卡片',
                    itemDesc: 'card_old.png',
                    type: 'Image',
                    exports: 'card_old.png',
                    extra: {
                        suffix: '.png',
                        maxSize: 100 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.card-old',
                        name: 'background-image',
                        value: 'url("img/card_old.png")'

                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '违规卡片',
                    itemDesc: 'card_violate.png',
                    type: 'Image',
                    exports: 'card_violate.png',
                    extra: {
                        suffix: '.png',
                        maxSize: 100 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.card-violate',
                        name: 'background-image',
                        value: 'url("img/card_violate.png")'

                    }
                }
            ]
        },
        {
            groupId: 'g11',
            groupName: '基本样式配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '页面背景颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: 'body',
                    default: '#FFFFFF',
                    extra: {
                        name: 'background-color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '按钮背景颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.button-large, .button-action',
                    default: '#eca810',
                    extra: {
                        name: 'background-color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '按钮文字颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.button-large, .button-action',
                    default: '#ffffff',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i04',
                    itemLabel: '扫码背景颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.scan-block span',
                    default: '#ffffff',
                    extra: {
                        name: 'background-color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '扫码边框颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.scan-block span',
                    default: '#ad180b',
                    extra: {
                        name: 'border-color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i05',
                    itemLabel: '扫码文字颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.scan-block span',
                    default: '#ad180b',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i06',
                    itemLabel: '苹果无关文字颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.apple-text',
                    default: '#050505',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i07',
                    itemLabel: '主要文字颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.activity-invite-title, .activity-invite-block p, .activity-title, .activity-body h1, .gift-title, .invite-color, .invite-activity-title, .invite-list-title',
                    default: '#FDEBBF',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i08',
                    itemLabel: '主要边框颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.activity-invite-block, .activity-invite-title, .activity-block, .activity-title, .bindCard-image, .gift-block, .gift-title, .invite-activity-block, .invite-activity-title, .invite-list-title, .invite-summary, .invite-list-item',
                    default: '#FDEBBF',
                    extra: {
                        name: 'border-color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i09',
                    itemLabel: '文字标签颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.activity-invite-mark',
                    default: '#FDEBBF',
                    extra: {
                        name: 'background-color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i10',
                    itemLabel: '次要文字颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.link-block.invite-tips, .gift-tips, .gift-join-tips',
                    default: '#666666',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i11',
                    itemLabel: '细则文字颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.activity-block p',
                    default: '#666666',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i12',
                    itemLabel: '活动结束文字颜色',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.invite-end-big, .invite-end-small',
                    default: '#666666',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                }
            ]
        },
        {
            groupId: 'g12',
            groupName: '条款、链接配置',
            items: [
                {
                    itemId: 'i01',
                    itemLabel: '条款图标',
                    itemDesc: 'icon_right.png',
                    type: 'Image',
                    exports: 'icon_right.png',
                    extra: {
                        suffix: '.png',
                        maxSize: 200 * 1024
                    },
                    relevance: {
                        type: 'CSS',
                        exports: '.icon-rule',
                        name: 'background-image',
                        value: 'url("img/icon_right.png")'

                    }
                },
                {
                    itemId: 'i02',
                    itemLabel: '条款普通文字',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.link-block',
                    default: '#ad180b',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                },
                {
                    itemId: 'i03',
                    itemLabel: '条款链接文字',
                    itemDesc: '',
                    type: 'CSS',
                    exports: '.link-block a',
                    default: '#d23123',
                    extra: {
                        name: 'color',
                        type: 'Color'
                    }
                }
            ]
        }
    ]
};