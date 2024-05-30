// 枚举合集
export default {
    // ---------------- AnswerApplyStatus枚举  开始 -------------------
    AnswerApplyStatus: {
        // 枚举列表
        list: [
            { label: "全部", value: null },
            { label: "待审核", value: "WAIT" },
            { label: "通过", value: "PASS" },
            { label: "未通过", value: "UN_PASS" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "WAIT":
                    return "待审核";
                case "PASS":
                    return "通过";
                case "UN_PASS":
                    return "未通过";
                default:
                    return val;
            }
        },
    },
    // ---------------- AnswerApplyStatus枚举  结束 -------------------

    // ---------------- AnswerType枚举  开始 -------------------
    AnswerType: {
        // 枚举列表
        list: [
            { label: "全部", value: null },
            { label: "文字", value: "WORD" },
            { label: "图片", value: "PICTURE" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "WORD":
                    return "文字";
                case "PICTURE":
                    return "图片";
                default:
                    return val;
            }
        },
    },
    // ---------------- AnswerType枚举  结束 -------------------

    // ---------------- BoxDramaApplyStatus枚举  开始 -------------------
    BoxDramaApplyStatus: {
        // 枚举列表
        list: [
            { label: "未开始", value: "UN_START" },
            { label: "授权中", value: "START" },
            { label: "已结束", value: "END" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "UN_START":
                    return "未开始";
                case "START":
                    return "授权中";
                case "END":
                    return "已结束";
                default:
                    return val;
            }
        },
    },
    // ---------------- BoxDramaApplyStatus枚举  结束 -------------------

    // ---------------- BoxStoreApplyStatus枚举  开始 -------------------
    BoxStoreApplyStatus: {
        // 枚举列表
        list: [
            { label: "全部", value: null },
            { label: "待付款", value: "WAIT_PAY" },
            { label: "待授权", value: "WAIT_AUTHORIZE" },
            { label: "未授权", value: "REJECT_AUTHORIZE" },
            { label: "已授权", value: "PASS_AUTHORIZE" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "WAIT_PAY":
                    return "待付款";
                case "WAIT_AUTHORIZE":
                    return "待授权";
                case "REJECT_AUTHORIZE":
                    return "未授权";
                case "PASS_AUTHORIZE":
                    return "已授权";
                default:
                    return val;
            }
        },
    },
    // ---------------- BoxStoreApplyStatus枚举  结束 -------------------

    // ---------------- DramaAgeAppropriate枚举  开始 -------------------
    DramaAgeAppropriate: {
        // 枚举列表
        list: [
            { label: "8+", value: "EXCEED_8" },
            { label: "12+", value: "EXCEED_12" },
            { label: "16+", value: "EXCEED_16" },
            { label: "18+", value: "EXCEED_18" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "EXCEED_8":
                    return "8+";
                case "EXCEED_12":
                    return "12+";
                case "EXCEED_16":
                    return "16+";
                case "EXCEED_18":
                    return "18+";
                default:
                    return val;
            }
        },
    },
    // ---------------- DramaAgeAppropriate枚举  结束 -------------------

    // ---------------- OrderStatus枚举  开始 -------------------
    OrderStatus: {
        // 枚举列表
        list: [
            { label: "全部", value: null },
            { label: "待支付", value: "NOT_PAY" },
            { label: "已支付", value: "PAYED" },
            { label: "已完成", value: "USED" },
            { label: "已退款", value: "REVERSE" },
            { label: "已关闭", value: "CLOSE" },
            { label: "已结算", value: "SETTLEMENT" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "NOT_PAY":
                    return "待支付";
                case "PAYED":
                    return "已支付";
                case "USED":
                    return "已完成";
                case "REVERSE":
                    return "已退款";
                case "CLOSE":
                    return "已关闭";
                case "SETTLEMENT":
                    return "已结算";
                default:
                    return "";
            }
        },
    },
    // ---------------- OrderStatus枚举  结束 -------------------

    // ---------------- ProductType枚举  开始 -------------------
    ProductType: {
        // 枚举列表
        list: [
            { label: "全部商品", value: null },
            { label: "组局商品", value: "GATHERING_PRODUCT" },
            { label: "申领剧本商品", value: "APPLY_DRAMA_PRODUCT" },
            { label: "票房商品", value: "BOX_OFFICE_PRODUCT" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "BOX_OFFICE_PRODUCT":
                    return "票房商品";
                case "APPLY_DRAMA_PRODUCT":
                    return "申领剧本商品";
                case "GATHERING_PRODUCT":
                    return "组局商品";
                default:
                    return "全部商品";
            }
        },
    },
    // ---------------- ProductType枚举  结束 -------------------

    // ---------------- CustomProductType枚举  开始 -------------------
    CustomProductType: {
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "BOX_OFFICE_PRODUCT":
                    return "票房本";
                case "GROUP_BUY_PRODUCT":
                    return "团购商品";
                case "APPLY_DRAMA_PRODUCT":
                    return "申领剧本";
                case "VIRTUAL_ITEM_PRODUCT":
                    return "道具商品";
                case "BLIND_BOX_PRODUCT":
                    return "盲盒商品";
                default:
                    return "";
            }
        },
    },
    // ---------------- CustomProductType枚举  结束 -------------------

    PayType: {
        // 枚举列表
        list: [
            { label: "余额支付", value: "BALANCE" },
            { label: "微信小程序", value: "WECHAT_WXA" },
            { label: "支付宝支付", value: "ALIPAY_APP" },
            { label: "优惠券支付", value: "COUPON" },
            { label: "微信APP支付", value: "WECHAT_APP" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "BALANCE":
                    return "余额支付";
                case "WECHAT_WXA":
                    return "微信小程序";
                case "ALIPAY_APP":
                    return "支付宝支付";
                case "COUPON":
                    return "优惠券支付";
                case "WECHAT_APP":
                    return "微信APP支付";
                default:
                    return "";
            }
        },
    },

    // ---------------- SellType枚举  开始 -------------------
    SellType: {
        // 枚举列表
        list: [
            { label: "盒装", value: "BOXED" },
            { label: "城限", value: "LIMITED" },
            { label: "独家", value: "EXCLUSIVE" },
            { label: "实景", value: "REAL_SCENE" },
            { label: "待定", value: "UNDETERMINED" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "BOXED":
                    return "盒装";
                case "LIMITED":
                    return "城限";
                case "EXCLUSIVE":
                    return "独家";
                case "REAL_SCENE":
                    return "实景";
                case "UNDETERMINED":
                    return "待定";
                default:
                    return val;
            }
        },
    },
    // ---------------- SellType枚举  结束 -------------------

    // ---------------- Sex枚举  开始 -------------------
    Sex: {
        // 枚举列表
        list: [
            { label: "男", value: "MALE" },
            { label: "女", value: "FEMALE" },
            { label: "未知", value: "UNKNOWN" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "MALE":
                    return "男";
                case "FEMALE":
                    return "女";
                case "UNKNOWN":
                    return "未知";
                default:
                    return val;
            }
        },
    },
    // ---------------- Sex枚举  结束 -------------------

    // ---------------- StoreApplyStatus枚举  开始 -------------------
    StoreApplyStatus: {
        // 枚举列表
        list: [
            { label: "全部", value: null },
            { label: "待审核", value: "WAIT_AUDIT" },
            { label: "已通过", value: "PASS" },
            { label: "未通过", value: "REJECT" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "WAIT_AUDIT":
                    return "待审核";
                case "PASS":
                    return "已通过";
                case "REJECT":
                    return "未通过";
                default:
                    return val;
            }
        },
    },
    // ---------------- StoreApplyStatus枚举  结束 ------------------
    CustomOrderStatus: {
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "NOT_PAY":
                    return "等待买家付款";
                case "PAYED":
                    return "买家已付款";
                case "USED":
                    return "已完成";
                case "REVERSE":
                    return "已退款";
                case "CLOSE":
                    return "已取消";
                case "SETTLEMENT":
                    return "已结算";
                default:
                    return val;
            }
        },
    },
    // ---------------- ShippingFee枚举  开始 -------------------
    LogisticsStatus: {
        // 枚举列表
        list: [
            { label: "全部", value: null },
            { label: "待揽收", value: "AWAITING_COLLECTION" },
            { label: "已揽收", value: "COLLECTED" },
            { label: "已签收", value: "DELIVERED" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "AWAITING_COLLECTION":
                    return "待揽收";
                case "COLLECTED":
                    return "已揽收";
                case "DELIVERED":
                    return "已签收";
                default:
                    return val;
            }
        },
    },
    // ---------------- ShippingFee枚举  结束 -------------------
    // ---------------- StoreApplyStatus枚举  开始 -------------------
    CouponUseStatus: {
        // 枚举列表
        list: [
            { label: "已过期", value: "EXPIRED" },
            { label: "已锁定", value: "LOCKED" },
            { label: "未使用", value: "NOT_USED" },
            { label: "已使用", value: "USED" },
            { label: "已撤回", value: "WITHDRAW_BACK" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "EXPIRED":
                    return "已过期";
                case "LOCKED":
                    return "已锁定";
                case "NOT_USED":
                    return "未使用";
                case "USED":
                    return "已使用";
                case "WITHDRAW_BACK":
                    return "已撤回";
                default:
                    return val;
            }
        },
    },
    // ---------------- StoreApplyStatus枚举  结束 ------------------
    // ---------------- VoteType枚举  开始 -------------------
    VoteType: {
        // 枚举列表
        list: [
            { label: "单选", value: "SINGLE" },
            { label: "多选", value: "MULTIPLE" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "SINGLE":
                    return "单选";
                case "MULTIPLE":
                    return "多选";
                default:
                    return val;
            }
        },
    },
    // ---------------- VoteType枚举  结束 ------------------
    // ---------------- QuestionType枚举  开始 -------------------
    QuestionType: {
        // 枚举列表
        list: [
            { label: "单选", value: "ONCE" },
            { label: "多选", value: "MULTIPLE" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "ONCE":
                    return "单选";
                case "MULTIPLE":
                    return "多选";
                default:
                    return val;
            }
        },
    },
    // ---------------- QuestionType枚举  结束 ------------------

    // ---------------- PlayType枚举  开始 -------------------
    PlayType: {
        // 枚举列表
        list: [
            { label: "单次", value: "ONCE" },
            { label: "循环", value: "LOOP" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "ONCE":
                    return "单次";
                case "LOOP":
                    return "循环";
                default:
                    return val;
            }
        },
    },
    // ---------------- PlayType枚举  结束 ------------------
    // ---------------- StoreEmployeeType枚举  开始 -------------------
    StoreEmployeeType: {
        // 枚举列表
        list: [
            { label: "店主", value: "OWNER" },
            { label: "店长", value: "SHOP_DIRECTOR" },
            { label: "店员", value: "EMPLOYEE" },
            { label: "主持人", value: "DM" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "OWNER":
                    return "店主";
                case "SHOP_DIRECTOR":
                    return "店长";
                case "EMPLOYEE":
                    return "店员";
                case "DM":
                    return "主持人";
                default:
                    return val;
            }
        },
    },
    // ---------------- PlayType枚举  结束 ------------------

    // ---------------- OrganizerType枚举  开始 -------------------
    OrganizerType: {
        // 枚举列表
        list: [],
        // 根据枚举值获取名称
        getName: function (val: string) {
            let name;
            this.list.map((v: any) => {
                if (v.value === val) {
                    name = v.label;
                }
            })
            return name;
        },
    },
    // ---------------- OrganizerType枚举  结束 ------------------

    // ---------------- GatherStatusType枚举  开始 -------------------
    GatherStatusType: {
        // 枚举列表
        list: [
            { label: "创建中", value: "CREATING" },
            { label: "拼场中", value: "GATHERING" },
            { label: "拼场成功", value: "SUCCESS" },
            { label: "拼场失败", value: "FAIL" },
            { label: "拼场解散", value: "DISMISS" },
            { label: "拼场完成", value: "COMPLETED" }
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "CREATING":
                    return "创建中";
                case "GATHERING":
                    return "拼场中";
                case "SUCCESS":
                    return "拼场成功";
                case "FAIL":
                    return "拼场失败";
                case "DISMISS":
                    return "拼场解散";
                case "COMPLETED":
                    return "拼场完成";
                default:
                    return val;
            }
        },
    },
    // ---------------- GatherStatusType枚举  结束 ------------------
    // ---------------- GatherLockStatus枚举  开始 -------------------
    GatherLockStatus: {
        // 枚举列表
        list: [
            { label: "未锁车", value: "UNLOCKED" },
            { label: "已锁车", value: "LOCKED" },
        ],
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "UNLOCKED":
                    return "未锁车";
                case "LOCKED":
                    return "已锁车";
                default:
                    return val;
            }
        },
    },
    // ---------------- GatherLockStatus枚举  结束 ------------------

    // ---------------- EXCEED_Type枚举  开始 -------------------
    EXCEED_Type: {
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "EXCEED_8":
                    return "适龄8+";
                case "EXCEED_12":
                    return "适龄12+";
                case "EXCEED_16":
                    return "适龄16+";
                case "EXCEED_18":
                    return "适龄18+";
                default:
                    return val;
            }
        },
    },
    // ---------------- EXCEED_Type枚举  结束 ------------------

    // ---------------- EVALUATE_Type枚举  开始 -------------------
    EVALUATE_Type: {
        // 根据枚举值获取名称
        getName: function (val: string) {
            switch (val) {
                case "RECOMMEND":
                    return "推荐";
                case "SO_SO":
                    return "一般";
                case "NOT_GOOD":
                    return "不行";
                default:
                    return val;
            }
        },
    },
    // ---------------- EVALUATE_Type枚举  结束 ------------------

    // ---------------- Rank_Type枚举  开始 -------------------
    Rank_Type: {
        // 根据枚举值获取名称
        getValue: function (val: string) {
            switch (val) {
                case "30天热榜":
                    return "HOT_RANK";
                case "人气总榜":
                    return "GATHER_SUM_RANK";
                case "口碑榜":
                    return "PRAISE_RANK";
                case "期待榜":
                    return "FOCUS_RANK";
                default:
                    return val;
            }
        },
        // 根据枚举值获取名称
        getName: function (type: string) {
            switch (type) {
                case "HOT_RANK":
                    return "30天热榜";
                case "GATHER_SUM_RANK":
                    return "人气总榜";
                case "PRAISE_RANK":
                    return "口碑榜";
                case "FOCUS_RANK":
                    return "期待榜";
                default:
                    return type;
            }
        },
    },
    // ---------------- EVALUATE_Type枚举  结束 ------------------

    // ---------------- Label枚举  开始 -------------------
    Label: {
        // 枚举列表
        list: [
            { label: "A", value: 0 },
            { label: "B", value: 1 },
            { label: "C", value: 2 },
            { label: "D", value: 3 },
            { label: "E", value: 4 },
            { label: "F", value: 5 },
        ],
        // 根据枚举值获取名称
        getName: function (val: number) {
            switch (val) {
                case 0:
                    return "A";
                case 1:
                    return "B";
                case 2:
                    return "C";
                case 3:
                    return "D";
                case 4:
                    return "E";
                case 5:
                    return "F";
                case 6:
                    return "G";
                case 7:
                    return "H";
                case 8:
                    return "I";
                case 9:
                    return "J";
                case 10:
                    return "K";
                default:
                    return val;
            }
        },
    },
    // ---------------- Label枚举  结束 ------------------

    // ---------------- TimeType枚举  开始 -------------------
    TimeType: {
        // 枚举列表
        list: [
            { label: "全部", value: null, time: null },
            { label: "日间", value: 'MORNING', time: '06:00~18:00' },
            { label: "晚间", value: 'NIGHT', time:'18:00~22:00' },
            { label: "通宵", value: 'WHOLENIGHT', time: '22:00~06:00' }
        ]
    },
    // ---------------- TimeType枚举  结束 ------------------

    // ---------------- PlayStatus枚举  开始 -------------------
    PlayStatus: {
        // 枚举列表
        list: [
            { label: "全部", value: null },
            { label: "只看想玩", value: 0 },
            { label: "不看玩过", value: 1 }
        ]
    },
    // ---------------- PlayStatus枚举  结束 ------------------

    // ---------------- CustomSellType枚举  开始 -------------------
    CustomSellType: {
        // 枚举列表
        list: [
            { label: "全部", value: null},
            { label: "盒装", value: 1},
            { label: "独家", value: 3},
            { label: "城限", value: 2}
        ]
    },
    // ---------------- CustomSellType枚举  开始 -------------------

    // ---------------- orderByType枚举  开始 -------------------
    OrderByType: {
        // 枚举列表
        list: [
            { label: "综合排序", value: 1},
            { label: "新手优先", value: 2},
            { label: "我想玩的", value: 3},
            { label: "离我最近", value: 4},
            { label: "即将满车", value: 5}
        ],
        getName: function (val: number) {
            switch (val) {
                case 1:
                    return "综合排序";
                case 2:
                    return "新手优先";
                case 3:
                    return "我想玩的";
                case 4:
                    return "离我最近";
                case 5:
                    return "即将满车";
                default:
                    return val;
            }
        },
    },
    // ---------------- orderByType枚举  开始 -------------------

    // ---------------- EditStoreType枚举  开始 -------------------
    EditStoreType: {
        getName: function (val: string) {
            switch (val) {
                case 'storeName':
                    return "门店名称";
                case 'storeDoor':
                    return "门牌号";
                case 'storePhone':
                    return "门店电话";
                case 'storeWechat':
                    return "门店微信";
                case 'storeDesc':
                    return "店铺简介";
                default:
                    return val;
            }
        },
    }
    // ---------------- EditStoreType枚举  开始 -------------------

};
