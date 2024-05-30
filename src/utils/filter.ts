const placeholderImg = 'https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/20231228/1f649708-c1a0-4ef1-a563-975a0f56231f/icon-placeholder.png';
import enums from "@/utils/enums";

export default {
    /**
     * 处理数字过千处理
     * @param val 
     * @returns 
     */
    formatNum(val: any) {
        if (val >= 1000) {
            return `${Math.ceil(val / 1000)}k`;
        }
        return val;
    },
    /**
     * 数字补零
     */
    fillZero(val: number) {
        if (val < 10) {
            return `0${val}`;
        }
        return val;
    },
    /**
     * 保留一个小数点
     */
    forceOneDecimal(val: any) {
        // 如果输入为 null 或者无法转换为合法的数字，返回 '0.0'
        if (val === null || isNaN(parseFloat(val))) return '0.0';

        // 使用 toFixed(1) 来确保保留一位小数
        return parseFloat(val).toFixed(1);
    },
    /**
     * 手机号脱敏
     * @param val 
     * @returns 
     */
    matchPhone(val: any) {
        if (!val) return "";
        let reg = /(\d{3})\d*(\d{4})/;
        return val.replace(reg, "$1****$2");
    },
    /**
     * 阿里云图片压缩
     * @param url 
     * @param size 
     * @returns 
     */
    processImage(url: any, size: any) {
        if (!url)
            return "";
        return `${url}?x-oss-process=image/resize,w_${size}/interlace,1`;
    },
    /**
     * 处理门店logo图片
     * @param url 
     */
    processLogoImage(store: any){
        if(store.storeDoorstep){
            return store.storeDoorstep;
        }
        if(store.storeLogo){
            return store.storeLogo;
        }
        return placeholderImg;
    },
    /**
     * 虚化图片
     * @param url 
     * @returns 
     */
    filterBlur(url: any) {
        return (url || placeholderImg) + `?x-oss-process=image/blur,r_20,s_50`;
    },
    /**
     * 处理空图片
     * @param url 
     * @returns 
     */
    processLogo(url: any) {
        return url || placeholderImg;
    },
    /**
     * 时间段处理
     * @param startTime 
     * @param endTime 
     * @returns 
     */
    formatGameTime(startTime: any, endTime: any) {
        var startDate = new Date(startTime.replace(/-/g, '/'));
        var endDate = new Date(endTime.replace(/-/g, '/'));
        var startHours = startDate.getHours();
        var startMinutes = ("0" + startDate.getMinutes()).slice(-2);
        var endHours = endDate.getHours();
        var endMinutes = ("0" + endDate.getMinutes()).slice(-2);
        return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
    },
    /**
     * 开始时间处理
     * @param gameStartTime 
     * @returns 
     */
    formatGameStartTime(gameStartTime: any) {
        // 将日期字符串中的 '-' 替换为 '/'
        const compatibleGameStartTime = gameStartTime.replace(/-/g, '/');
        const time = new Date(compatibleGameStartTime);

        let hours: any = time.getHours();
        let minutes: any = time.getMinutes();

        // 补零
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${minutes}`;
    },
    /**
     * 转换日期
     */
    getWeek(dateString: any) {
        let d = new Date(dateString).setHours(0, 0, 0, 0);
        let today = new Date().setHours(0, 0, 0, 0);

        let obj: any = {
            "-86400000": "昨天",
            0: "今天",
            86400000: "明天",
        };
        if (obj[d - today]) return obj[d - today];


        let date = new Date(dateString).getDay();
        var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
        return "周" + weeks[date];
    },
    /**
     * 处理组局差人
     */
    doCalculateNeedCount(gatherInfo: any, needFirst:boolean = true) {
        //判断是否反串
        if (gatherInfo.isRevertSex) {
            return `${needFirst ? '差':''}${gatherInfo.maleLimitNum + gatherInfo.femaleLimitNum - gatherInfo.botMaleGamerNum - gatherInfo.botFemaleGamerNum - gatherInfo.realMaleGamerNum - gatherInfo.realFemaleGamerNum}人`;
        } else {
            let needMale: number = gatherInfo.maleLimitNum - gatherInfo.botMaleGamerNum - gatherInfo.realMaleGamerNum;
            let needFemal: number = gatherInfo.femaleLimitNum - gatherInfo.botFemaleGamerNum - gatherInfo.realFemaleGamerNum;

            return `${needFirst ? '差':''}${needMale > 0 ? `${needMale}男` : ''}${needFemal > 0 ? `${needFemal}女` : ''}`;
        }
    },
    /**
     * 组局差人
     */
    gatherNeedCount(gatherInfo: any) {
        return `等${gatherInfo.maleLimitNum + gatherInfo.femaleLimitNum - gatherInfo.botMaleGamerNum - gatherInfo.botFemaleGamerNum - gatherInfo.realMaleGamerNum - gatherInfo.realFemaleGamerNum}人`;
    },
    /**
     * 处理剧本dicts
     */
    doCalculateDramaDicts(dicts: any, splitTag: string = ' ') {
        let arr = dicts.map((v: any) => {
            return v.dictValue;
        });
        return arr.join(splitTag);
    },
    /**
     * 处理剧本作者名
     */
    doCalculateDramaAuthors(authors: any, splitTag: string = '&') {
        let arr = authors.map((v: any) => {
            return v.authorName;
        });
        return arr.join(splitTag);
    },
    /**
     * 处理剧本发行名
     *
     */
    doCalculateDramaPublisher(publishers: any, splitTag: string = '&') {
        let arr = publishers.map((v: any) => {
            return v.publisherName;
        });
        return arr.join(splitTag);
    },
    /**
     *  处理剧本评论
     */
    doCalculateDramaEvaluate: function (scoreList: any, splitTag: string = ' ') {
        let arr = scoreList.map((v: any) => {
            let score = Math.floor(Number(v.score) / 10);
            return v.dictValue + score;
        });
        return arr.join(splitTag);
    },
    /**
     * 处理倒计时
     * @param gameStartTime 
     * @returns 
     */
    calculateEndTime(gameStartTime: string) {
        const now = new Date();
        const startTime = new Date(gameStartTime);
        const timeDiff = startTime.getTime() - now.getTime();
        const absoluteDiff = Math.abs(timeDiff);

        // 计算天数、小时数和分钟数
        const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absoluteDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((absoluteDiff / (1000 * 60)) % 60);

        let message = '';

        if (days > 0) {
            message = `${days}天${hours}小时`;
        } else if (hours > 0) {
            message = `${hours}小时`;
        } else {
            message = `${minutes}分钟`;
        }
        return message;
    },
    /**
     * 将米转换为千米，添加 "km" 后缀
     * @param {number} meters - 待转换的数量
     * @returns {string} 转换后的字符串表示
     */
    metersTransferThousand(meters: number) {
        if (!meters) return '0.00km';

        // 否则，将数量除以 1000 并保留一位小数，然后添加 "km" 后缀
        return (meters / 1000).toFixed(2) + 'km';
    },
    /**
     * 根据icon名字获取图片链接
     * @param iconName 
     * @returns 
     */
    icon(iconName: string) {
        try {
            let icons: Array<any> = uni.getStorageSync('svg-icon');
            return icons.find((v: any) => v.iconParam === iconName).url;
        } catch (e) {
        }
    },
    doCalculateTime(drama:any){
      return `${drama.maleLimitNum}男${drama.femaleLimitNum}女 ${drama.gameTime}小时 适龄${enums.DramaAgeAppropriate.getName(drama.dramaAgeAppropriate)}`
    },
    /**
     * 处理发布时间
     * @param createTime 
     * @returns 
     */
    formatDynamicPublishTime(createTime: string) {
        if (typeof createTime !== 'string') {
            return '无效的日期';
        }

        const now: any = new Date();
        const createTimeAdjusted = createTime.replace(/-/g, '/'); // Adjust for iOS format
        const publishTime: any = new Date(createTimeAdjusted);
        const timeDiff = now - publishTime;
        const hoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
        const daysDiff = Math.floor(hoursDiff / 24);

        if (publishTime.getFullYear() === now.getFullYear() &&
            publishTime.getMonth() === now.getMonth() &&
            publishTime.getDate() === now.getDate()) {
            if (hoursDiff === 0) {
                return `1小时内`;
            }
            return `${hoursDiff}小时前`;
        }

        if (daysDiff === 1) {
            return '昨天';
        } else if (daysDiff === 2) {
            return '前天';
        }

        let date = `${publishTime.getMonth() + 1}-${publishTime.getDate()}`;
        if (publishTime.getFullYear() !== now.getFullYear()) {
            date = `${publishTime.getFullYear()}-${date}`;
        }
        return date;
    },
    /**
     * 格式化时间
     * @param date 
     * @param type 
     * @param zeroFillFlag 
     * @returns 
     */
    formatPast(date:any, type:string = "default", zeroFillFlag:boolean = true){
        // 定义countTime变量，用于存储计算后的数据
        let countTime;
        // 获取当前时间戳
        let time = new Date().getTime();
        // 转换传入参数为时间戳
        let afferentTime = new Date(date).getTime();
        // 当前时间戳 - 传入时间戳
        time = Number.parseInt(`${time - afferentTime}`);
        if (time < 10000) {
            // 10秒内
            return "刚刚";
        } else if (time < 60000) {
            // 超过10秒少于1分钟内
            countTime = Math.floor(time / 1000);
            return `${countTime}秒前`;
        } else if (time < 3600000) {
            // 超过1分钟少于1小时
            countTime = Math.floor(time / 60000);
            return `${countTime}分钟前`;
        } else if (time < 86400000) {
            // 超过1小时少于24小时
            countTime = Math.floor(time / 3600000);
            return `${countTime}小时前`;
        } else if (time >= 86400000 && type == "default") {
            // 超过二十四小时（一天）且格式参数为默认"default"
            countTime = Math.floor(time / 86400000);
            //大于等于365天
            if (countTime >= 365) {
                return `${Math.floor(countTime / 365)}年前`;
            }
            //大于等于30天
            if (countTime >= 30) {
                return `${Math.floor(countTime / 30)}个月前`;
            }
            return `${countTime}天前`;
        } else {
            // 一天（24小时）以上且格式不为"default"则按传入格式参数显示不同格式
            // 数字补零
            let Y = new Date(date).getFullYear();
            let M = new Date(date).getMonth() + 1;
            let zeroFillM = M > 9 ? M : "0" + M;
            let D = new Date(date).getDate();
            let zeroFillD = D > 9 ? D : "0" + D;
            // 传入格式为"-" "/" "."
            if (type == "-" || type == "/" || type == ".") {
                return zeroFillFlag
                    ? Y + type + zeroFillM + type + zeroFillD
                    : Y + type + M + type + D;
            }
            // 传入格式为"年月日"
            if (type == "年月日") {
                return zeroFillFlag
                    ? Y + type[0] + zeroFillM + type[1] + zeroFillD + type[2]
                    : Y + type[0] + M + type[1] + D + type[2];
            }
            // 传入格式为"月日"
            if (type == "月日") {
                return zeroFillFlag
                    ? zeroFillM + type[0] + zeroFillD + type[1]
                    : M + type[0] + D + type[1]
            }
            // 传入格式为"年"
            if (type == "年") {
                return Y + type
            }
        }
    }
};
