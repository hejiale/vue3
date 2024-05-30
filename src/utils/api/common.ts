import { http } from '../http'

export default {
  /**
   * 用户-saas小程序绑定手机号
   */
  async mpBindPhone(query: any) {
    return await http({ url: "/auth/saveWeChatMiniAppUserPhone", data: query });
  },
  /**
   * 用户-用户查询
   */
  async getUserSelf(query: any) {
    return await http({ url: "/user/getCurrentUserInfo", data: query });
  },
  /**
  * 小程序-Code2Session
  */
  async code2Session(query: any) {
    return await http({ url: "/auth/loginWeChatMiniApp", data: query });
  },
  /* 我的页面用户信息
  */
  async homePage(query: any) {
    return await http({ url: "/v2/user/homePage", data: query });
  },
  /**
   * 获取主题色
   */
  async getCoverMainColor(query: any) {
    return await http({ url: "/v2/user/getCoverMainColor", data: query });
  },
  /*
  保存用户编辑信息
  */
  async saveAppUserEditInfo(query: any) {
    return await http({ url: "/user/saveAppUserEditInfo", data: query });
  },
  /**
   * B端订单列表
   */
  async orderList(query: any) {
    return await http({ url: "/order/b-list", data: query });
  },
  /**
   * 视频分析
   */
  async detectMediaMeta(query: any) {
    return await http({ url: "/file/detectMediaMeta", data: query });
  },
  /**
   * svg图标列表
   */
  async svgIconList(query: any) {
    return await http({ url: "/iconSvg/queryPage", data: query });
  },
  /**
   * 添加-【想玩-收藏】
   */
  async updateUserDramaPlayMP(query: any) {
    return await http({ url: "/userDramaPlay/updateUserDramaPlayMP", data: query });
  },
  /**
   * 取消【想玩-收藏】
   */
  async cancelUserDramaPlayMP(query: any) {
    return await http({ url: "/userDramaPlay/cancelUserDramaPlayMP", data: query })
  },
  /**
   * 剧圈动态点赞
   * @param data 
   * @returns 
   */
  async userPraiseDynamic(query: any) {
    return await http({ url: "/community/userPraiseDynamic", data: query });
  },
  /**
   * 字典-字典列表查询
   */
  async queryDictParama(query: any) {
    return await http({ url: "/dict/queryDicts", data: query });
  },
  /**
   * 校验图片或内容是否合规
   */
  async riskCheckContent(query: any) {
    return await http({ url: "/risk/checkContent", data: query });
  },
  /**
   * 店铺剧本-剧本列表分页查询-店铺
   */
  async queryStoreDramaPage(query: any) {
    return await http({ url: "/storeDrama/queryStoreDramaPage", data: query });
  },
  /**
   * 剧本详情
   */
  async dramaDetail(query: any) {
    return await http({ url: "/v2/drama/dramaDetail", data: query });
  },
  /**
   * 按字母排序获取行政区划[到县市一级
   * @param query 
   * @returns 
   */
  async getRegionByLetter(query: any) {
    return await http({ url: "/region/getRegionByLetterSecond", data: query });
  },
  /**
   * 查询历史城市
   * @param query 
   * @returns 
   */
  async getqueryHistoryRegionList(query: any) {
    return await http({ url: "/userRegion/queryHistoryRegionList", data: query });
  },
  /**
   * 获取热门城市
   * @param query 
   * @returns 
   */
  async getRegionResolver(query: any) {
    return await http({ url: "/region/regionResolver", data: query });
  },
  /**
   * 获取城市筛选热门城市列表
   * @param query 
   * @returns 
   */
  async getHotCity(query: any) {
    return await http({ url: "/region/getHotCity", data: query });
  },
  /**
   * 坐标解析行政区划
   */
  async regionResolver(query: any) {
    return await http({ url: "/region/regionResolver", data: query });
  },
  /**
   * 新增历史记录
   * @param query 
   * @returns 
   */
  async saveCommonRegion(query: any) {
    return await http({ url: "/userRegion/saveCommonRegion", data: query });
  },
  /**
   * 获取城市区域
   * @param query 
   * @returns 
   */
  async getRegion(query: any) {
    return await http({ url: "/region/getRegion", data: query });
  },
  /**
   * 动态详情-V2
   * @param query 
   * @returns 
   */
  async dynamicDetail(query: any) {
    return await http({ url: "/userDynamicCircle/dynamicDetail", data: query });
  },
  /**
   * 圈子-查询评论列表(分页)
   * @param query 
   * @returns 
   */
  async queryDynamicCommentPage(query: any) {
    return await http({ url: "/userDynamicCircle/queryDynamicCommentPage", data: query });
  },
  /**
   * 圈子-圈子-发表评论
   * @param query 
   * @returns 
   */
  async addUserDynamicComment(query: any) {
    return await http({ url: "/userDynamicCircle/addUserDynamicComment", data: query });
  },
  /**
   * 关联剧本
   * @param query 
   * @returns 
   */
  async dramaGatherPage(query: any) {
    return await http({ url: "/v2/drama/dramaGatherPage", data: query });
  },
  /**
   * 关联资讯
   * @param query 
   * @returns 
   */
  async officialDynamicList(query: any) {
    return await http({ url: "/backend/activity/officialDynamicList", data: query });
  },
  /**
   * 关联资讯
   * @param query 
   * @returns 
   */
  async queryUserList(query: any) {
    return await http({ url: "/user/queryUserList", data: query });
  },
  /**
   * 查询店铺详情
   * @param query 
   * @returns 
   */
  async queryStoreDetail(query: any) {
    return await http({ url: "/store/queryStoreDetail", data: query });
  },
  /**
   * 创建订单
   * @param query 
   * @returns 
   */
  async createOrder(query: any) {
    return await http({ url: "/order/create", data: query });
  },
  /**
   * 网关类支付
   * @param query 
   * @returns 
   */
  async paymentGw(query: any) {
    return await http({ url: "/payment/paymentGw", data: query });
  }
}