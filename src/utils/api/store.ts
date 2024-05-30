import { http } from '../http'

export default {
    /**
   * 分页查询店铺DM列表
   */
  async getStoreDMList(query: any) {
    return await http({ url: "/storeUser/getStorePersonnelPage", data: query });
  },
  /**
   * 店铺剧本-剧本列表分页查询-店铺
   */
  async queryStoreDramaPage(query: any) {
    return await http({ url: "/storeDrama/queryStoreDramaPage", data: query });
  },
  /**
   * 店铺-店铺查询-首页
   */
  async getStoreHome(query: any) {
    return await http({ url: "/v2/store/detail", data: query });
  },
  /**
   * 获取玩家组局列表
   */
  async getGatheringList(query: any) {
    return await http({ url: "/gathering/user/getCityGatheringInfo", data: query });
  },
  /**
   * 店铺评价列表
   */
  async evaluatePageList(query: any) {
    return await http({ url: "/store/evaluate/pageList", data: query });
  },
  /**
   * APP-关注-关注、取消关注用户
   * @param data 
   * @returns 
   */
  async updateUserFocus(query: any) {
    return await http({ url: "/userFocus/updateUserFocus", data: query });
  },
  /**
   * 添加-【想玩-收藏】
   */
  async storePlayFocus(query: any) {
    return await http({ url: "/user/storePlay/focus", data: query });
  },
  /**
   * 评价详情
   */
  async evaluateDetail(query: any) {
    return await http({ url: "/store/evaluate/detail", data: query });
  },
  /**
   * 添加-【想玩-收藏】
   */
  async updateUserDramaPlayMP(query: any) {
    return await http({ url: "/userDramaPlay/updateUserDramaPlayMP",data: query });
  },
  /**
   * 取消【想玩-收藏】
   */
  async cancelUserDramaPlayMP(query: any) {
    return await http({ url: "/userDramaPlay/cancelUserDramaPlayMP", data: query });
  },
  /**
   * 评价
   */
  async evaluateOperation(query: any) {
    return await http({ url: "/store/evaluate/operation", data: query });
  },
  /**
   * 举报-获取举报类型
   */
  async getFeedType(query: any) {
    return await http({ url: "/userFeedBack/getFeedType", data: query });
  },
  /**
   * 新增反馈信息（包括举报、建议）
   */
  async addUserFeedBackRecord(query: any) {
    return await http({ url: "/userFeedBack/addUserFeedBackRecord",data: query });
  },
  /* 剧本详情-可玩店铺
  */
  async queryDramaDetailStore(query: any) {
    return await http({url: "/v2/store/queryDramaDetailStore", data: query });
  },
  /* 剧本详情-可玩店铺
  */
  async queryRelateStore(query: any) {
    return await http({url: "/store/queryStoreDrama", data: query });
  },
  /* 剧本排行榜列表
  */
  async rankingList(query: any) {
    return await http({url: "/v2/drama/rankingList", data: query });
  },
  /* 发布动态
  */
  async addDynamicWithDrama(query: any) {
    return await http({url: "/userDynamicCircle/addDynamicWithDrama", data: query });
  },
  /**
   * 商户数据提交
   */
  async postMerchantBase(query: any) {
		return await http({url: "/merchant/merchantBaseCommit", data: query });
	},
   /**
   * 商户数据更新
   */
  async merchantBaseUpdate(query: any) {
		return await http({url: "/merchant/merchantBaseUpdate", data: query });
	},
   /**
   * 商户发送短信验证码
   */
  async getCaptchaCode(query: any) {
		return await http({url: "/merchant/getCaptchaCode", data: query });
	},
   /**
   * 校验验证码
   */
   async getAvailableCode(query: any) {
		return await http({url: "/merchant/getAvailableCode", data: query });
	},
}