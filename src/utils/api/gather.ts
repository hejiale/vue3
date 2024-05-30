import { http } from '../http'

export default {
  /**
   * 玩家--每日组局数列表
   */
  async getUserGatheringOverviewByDate(query: any) {
    return await http({ url: "/gathering/getUserGatheringOverviewByDate", data: query });
  },
  /**
   * 查询同城组局 
   */
  async getCityGatheringPage(query: any) {
    return await http({ url: "/gathering/getCityGatheringPage", data: query });
  },
  /**
   * 查询热玩剧本和我想玩的
   * @param query 
   * @returns 
   */
  async getDramaGatherPage(query: any) {
    return await http({ url: "/v2/drama/dramaGatherPage", data: query });
  },
  /**
   * 店家--每日组局数列表
   */
  async getStoreGatheringOverviewByDate(query: any) {
    return await http({url: "/gathering/getStoreGatheringOverviewByDate", data: query});
  },
  /**
   * 店家,玩家--组局列表
   */
  async getGatheringList(query: any) {
    return await http({url: "/gathering/getGatheringList", data: query});
  },
  /**
   * 组局详情Detail
   */
  async getGatheringDetail(query: any) {
    return await http({url: "/gathering/getGatheringDetail", data: query});
  },
  /**
   * 玩家组局详情Detail
   */
  async getPlayerGatheringDetail(query: any) {
    return await http({url: "/gathering/getCurrentUserInGatheringInfo", data: query});
  },
  /**
   * 商品列表分页查询
   */
  async getStoreProductPage(query: any) {
    return await http({url: "/storeProductController/getConditionStoreProductPage", data: query});
  },
  /**
   * 发起组局可玩的店铺列表
   */
  async storePage(query: any) {
    return await http({url: "/v2/store/gather/storePage", data: query});
  },
  /**
   * 玩家--发起组局，生成订单
   */
  async userCreateGathering(query: any) {
    return await http({url: "/gathering/userCreateGathering", data: query});
  },
  /**
   * 玩家--加入组局
   */
  async joinGathering(query: any) {
    return await http({url: "/gathering/joinGathering", data: query});
  },
  /**
   * 获取该用户组局内的未支付订单信息
   */
  async getGatherNotPayOrderInfo(query: any) {
    return await http({url: "/gathering/getGatherNotPayOrderInfo", data: query});
  },
  /**
    * 店家--发起组局
    */
  async storeCreateGathering(query: any) {
    return await http({url: "/gathering/storeCreateGathering", data: query});
  },
  /**
    * 店家--锁车
    */
  async lockGathering(query: any) {
    return await http({ url: "/gathering/lockGathering", data: query });
  },
  /**
    * 店家--解锁
    */
  async unlockGathering(query) {
    return await http({ url: "/gathering/unlockGathering", data: query });
  },
}