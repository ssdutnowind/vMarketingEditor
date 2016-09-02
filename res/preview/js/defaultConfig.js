// 默认配置项
var defaultConfig = {
    // 活动ID
    activityId: "947",
    // 页面协议
    protocol: "https:",
    // 活动状态
    activityStatus: "1",
    // 分享标题
    shareTitle: "体育盛宴",
    // 分享摘要
    shareDesc: "汗水拼搏今天，激情点燃明天！发展体育运动，全民乐享优惠！",
    // 分享图标路径
    shareIcon: "/theme/img/shareIcon.jpg",
    // 扫码提示
    scanTip: "好友扫一扫，一起领取银联钱包新人礼！",
    // 领取按钮标题（社交）
    snsGiftButtonTitle: "领取大礼包",
    // 去钱包查看按钮标题（社交）
    snsWalletButtonTitle: "去银联钱包查看",
    // 邀请按钮标题（社交）
    snsInviteButtonTitle: "我要邀请",
    // 验证码文案
    captchaTitle: "为保证礼包领取成功，请验证手机号！",
    // 验证码提示
    captchaTip: "温馨提示：登录或注册银联钱包客户端的手机号码，必须与本次领券的手机号保持一致。",
    // 领取按钮标题（客户端）
    appGiftButtonTitle: "领取新人礼包",
    // 查看礼包按钮标题
    appShowGiftButtonTitle: "查看礼包",
    // 礼包标题
    giftListTitle: "已领取新人礼",
    // 礼包提示
    giftListTip: "*作弊用户将被取消各种礼品，最终获得奖励以中国银联最后公布为准",
    // 邀请说明标题
    inviteRuleTitle: "活动奖励",
    // 邀请说明内容
    inviteRuleContent: ["每邀请1名好友，您可获得1-10元随机银联红包奖励，好友可获得新人礼包。","好友再邀请1名好友，您可再获得2元银联红包奖励。","光荣奖：邀请好友达10-49名，再赠送30元银联红包；邀请好友达50-499名，再赠送300元银联红包；邀请好友达500名及以上，邀请人数最多的前5名，再赠送4999元银联红包。"],
    // 苹果无关提示
    appleTip: "",
    // 活动停止大标题
    activityStopTitle: "活动已完美闭幕！",
    // 活动停止小标题
    activityStopDesc: "2016.08.31日后邀请成功的小伙伴不再计入有效邀请数！",
    // 注释说明
    inviteListTip1: "注：好友注册且通过认证后，您可获得邀请计数",
    // 红包到账说明
    inviteListTip2: "红包在活动结束后9.9日前统一入账",
    // 显示拉新细则
    showNewRule: "1",
    // 细则标题
    ruleNewTitle: "新人专享活动细则",
    // 活动时间
    ruleNewTime: "2016.08.16-2016.08.31",
    // 活动规则
    ruleNewRule: ["1、新人礼包为银联钱包活动期间的新用户专享礼品包；","2、新人礼包记录在参与活动的手机号下，请使用参与活动的手机号注册并登录银联钱包APP；","3、礼包可立即领取，请注意礼包中的优惠券有效期，适用门店以优惠券详情中的适用门店为准。活动期间优惠券发放根据实际情况可能会有调整；","4、作弊、违规用户将被取消领取任何活动奖励的资格。"],
    // 活动说明
    ruleNewDesc: ["1、参与本活动用户不得实施下列任何一种违规行为(以下统称”违规行为”)：","a) 虚假交易的行为；","b) 以非法盈利为目的参与本活动的行为；","c)通过恶意使用多个账号（包括但不限于同一IP\\同一设备\\同一注册手机号\\同一银行卡预留手机号\\同一银行卡（包括主卡附属的虚拟卡））参与本活动的行为，参与或协助套取银联钱包资源（包括但不限于各种优惠券、银联红包）的行为。","d) 以任何机器人软件、蜘蛛软件、爬虫软件、刷屏软件或其他自动方式参与本活动的行为；","e) 实施违反诚实信用原则行为；","f) 实施其他非真实领取的作弊行为。","2、在获取和使用奖品过程中，如果出现违规行为，银联钱包有权取消用户参与本次活动的资格和对其银联钱包账号进行冻结，并取消用户中奖资格不予发奖；同时有权撤销违规交易，并收回活动中已发放的奖品(包含已使用的部分)。并视情节严重性向违规用户索赔，并追究相关法律责任。","3、发放奖品时，中国银联有权要求用户提供其身份证、护照等身份证件、联系方式、参与活动账号等证明用户符合本活动规则的材料信息，如用户所提供的信息不真实、不完整、失效或不合法，举办方有权不发放奖品。","4、用户知悉互联网存在诸多不确定性。如因不可抗力以及活动中存在大面积作弊行为、通讯路线故障或者计算机大规模瘫痪等举办方原因致使难以继续开展本活动的，举办方有权修改、暂停或取消本活动。","5、对于活动如有疑问请拨打银联热线95516咨询。银联有权对获奖用户进行电话抽查，对不符合要求的用户取消获奖资格。","6、本活动所指的用户为自然人。","7、本活动与苹果公司无关。"],
    // 显示邀请细则
    showInviteRule: "1",
    // 细则标题
    ruleInviteTitle: "邀请活动细则",
    // 活动时间
    ruleInviteTime: "2016.08.16-2016.08.31",
    // 活动主题
    ruleInviteTopic: "体育盛宴——拼搏享红包",
    // 奖励说明
    ruleInviteGiftDesc: ["1、每邀请1名好友，您可获得1-10元随机银联红包奖励，好友可获得新人礼包。","2、好友再邀请1名好友，您可再获得2元银联红包奖励。","3、额外奖励：邀请好友达10-49名，再赠送30元银联红包；邀请好友达50-499名，再赠送300元银联红包；邀请好友达500名及以上，邀请人数最多的前5名，再赠送4999元银联红包。","4、作弊用户将被取消领取活动奖励的资格。"],
    // 活动规则
    ruleInviteRule: ["1、邀请好友参加活动，用户自己邀请的好友称为一级好友，一级好友邀请的好友称为二级好友。每邀请一名一级好友在银联钱包注册且成功绑卡，奖励“银联红包”，一级好友再次邀请二级好友在银联钱包注册且成功绑卡，一级好友和用户自己均可获奖励“银联红包”。多邀多得，上不封顶。","2、额外奖励的银联红包，仅限直接邀请的一级好友绑卡成功或通过账户实名认证的人数，您的好友再邀请的好友人数不计入额外奖励的有效人数内。","3、活动结束后根据成功邀请的用户总数，额外奖励里的银联红包不重复发放。获奖名单和奖品通过银联钱包微信（微信号：Yinlian_KY）公布，银联并用短信或电话联系获奖人。获奖用户根据活动要求提供相关材料信息后，额外奖励的银联红包将直接充值到获奖用户银联钱包注册账号。","4、额外奖励中的4999元银联红包，邀请一级好友人数达到500人及其以上，邀请人数最多的前5名用户获得。","5、邀请方式：分享到各社交平台（微信、朋友圈、微博、QQ、QQ空间等）和二维码扫码邀请。","6、邀请小伙伴的记录、得到的银联红包数可在银联钱包客户端活动页面及时查看。邀请好友数为直接邀请一级好友数。","7、邀请红包记录可立即查看，在获取红包时间的2日后入账，如有违规行为不予入账。","8、邀请红包获取说明：被邀请的小伙伴必须打开邀请用户分享的活动链接或二维码页面，参与活动领取礼包，下载银联钱包APP并成功注册（注册账号必须与参与活动手机号一致）和绑卡，此位小伙伴就算入成功邀请名额，邀请用户获取邀请红包。","9、绑卡说明：在“银联钱包”APP中，通过“卡管家”—“添加银行卡”，成功通过支付认证。或通过 “我的”— “身份信息”中添加同通过实名认证添加银行卡。","10、活动期间，参与活动的多个用户如绑定同一张银行卡，只算一次有效邀请绑卡用户。","11、被邀请的多个不同的新注册用户，如绑定的银行卡为同一开卡人，邀请用户只能得到一个银联红包，第一个绑卡的账号有效；如通过账户实名认证绑卡的多个账号为同一个身份证号，只计为一个有效邀请用户，第一个通过账户实名认证绑卡的账号有效。","12、作弊用户将被取消领取任何活动奖励的资格。"],
    // 活动说明
    ruleInviteDesc: ["1、参与本活动用户不得实施下列任何一种违规行为(以下统称”违规行为”)：","a) 虚假交易的行为；","b) 以非法盈利为目的参与本活动的行为；","c) 通过恶意使用多个账号（包括但不限于同一IP\\同一设备\\同一注册手机号\\同一银行卡预留手机号\\同一银行卡（包括主卡附属的虚拟卡）\\同一身份证号）参与本活动的行为，参与或协助套取银联钱包资源（包括但不限于各种优惠券、银联红包）的行为。","d) 以任何机器人软件、蜘蛛软件、爬虫软件、刷屏软件或其他自动方式参与本活动的行为；","e) 实施违反诚实信用原则行为；","f) 实施其他非真实领取的作弊行为。","2、在获取和使用奖品过程中，如果出现违规行为，银联钱包有权取消用户参与本次活动的资格和对其银联钱包账号进行冻结，并取消用户中奖资格不予发奖；同时有权撤销违规交易，并收回活动中已发放的奖品(包含已使用的部分)。并视情节严重性向违规用户索赔，并追究相关法律责任。","3、发放奖品时，中国银联有权要求用户提供其身份证、护照等身份证件、联系方式、参与活动账号等证明用户符合本活动规则的材料信息，如用户所提供的信息不真实、不完整、失效或不合法，举办方有权不发放奖品。","4、用户知悉互联网存在诸多不确定性。如因不可抗力以及活动中存在大面积作弊行为、通讯路线故障或者计算机大规模瘫痪等举办方原因致使难以继续开展本活动的，举办方有权修改、暂停或取消本活动。","5、对于活动如有疑问请拨打银联热线95516咨询。银联有权对获奖用户进行电话抽查，对不符合要求的用户取消获奖资格。","6、本活动所指的用户为自然人。","7、本活动与苹果公司无关。"],
    // 推荐图片
    ruleInviteImage: "1"
};