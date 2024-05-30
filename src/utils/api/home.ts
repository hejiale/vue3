import { http } from '../http'

export default {
    /**
     *  首页banner图信息
     */
    async promotionList(query: any) {
        return await http({ url: "/activity/promotionList", data: query });
    },
    /* 首页获取城市组局列表
    */
    async getCityGatheringInfo(query: any) {
        return await http({ url: "/gathering/user/getCityGatheringInfo", data: query });
    },
    /* 首页热本推荐
    */
    async queryHotDrama(query: any) {
        return await http({ url: "/v2/drama/popularList", data: query });
    },
    /**
     * 我的组局列表
     */
    async playerGatheredGamePage(query: any) {
        return await http({ url: "/gathering/user/getCurrentGatherStation", data: query });
    },
    /**
     * 附近门店列表
     */
    async getStoreNearbyList(query: any) {
        return await http({ url: "/store/getStoreNearbyList", data: query });
    },
    /**
     * 动态列表
     */
    async homePageDynamic(query: any) {
        return await http({ url: "/community/homePageDynamic", data: query });
    },
    /**
     * 排行榜列表
     */
    async rankingList(query: any) {
        return await http({ url: "/v2/drama/rankingList", data: query });
    },
    /**
     * 首页剧评列表
     */
    async recommendEvaluate(query: any) {
        return await http({ url: "/v2/dramaEvaluate/recommendEvaluate", data: query });
    },
    /**
     * 剧本详情剧评
     */
    async dramaDetailEvaluate(query: any) {
        return await http({ url: "/v2/dramaEvaluate/dramaDetailEvaluate", data: query });
    },
    /**
     * 剧本详情剧评-数量
     */
    async dramaDetailEvaluateCount(query: any) {
        return await http({ url: "/v2/dramaEvaluate/dramaDetailEvaluateCount", data: query });
    },
    /* 剧本详情 - 相关推荐
    */
    async getDramaDetailRecommend(query: any) {
        return await http({ url: "/drama/getDramaDetailRecommend", data: query });
    },
}