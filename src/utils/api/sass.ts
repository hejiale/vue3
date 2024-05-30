import { http } from '../http'

export default {
    /**
     * 用户-角色下个人主页
     */
    async getStoreUserFunctions(query: any) {
        return await http({ url: "/store/userRolePermission/getStoreUserFunctions", data: query });
    },
    /**
     * 店铺-我的店铺更新
     */
    async updateMyStore(query: any) {
        return await http({ url: "/store/updateStoreDetail", data: query });
    },
    /**
     * 查询店铺信息
     */
    async queryStoreBi(query: any) {
        return await http({ url: "/v2/store/queryStoreBi", data: query });
    },
    /**
     * 查询优惠券卡包信息
     */
    async myTicket(query: any) {
        return await http({ url: "/couponTicket/myTicket", data: query });
    },
    /**
     * 查询商品列表
     */
    async getAuthorizedBoxProductList(query: any) {
        return await http({ url: "/product/getAuthorizedBoxProductList", data: query });
    },
    /**
     * 查询剧本详情
     */
    async getDramaDetail(query: any) {
        return await http({ url: "/drama/queryDramDetail", data: query });
    },
    /**
     * 查询已支付订单
     */
    async checkProductOrder(query: any) {
        return await http({ url: "/order/checkProductOrder", data: query });
    },
    /**
     * 查询店铺进行游戏
     */
    async getStoreCurrentGame(query: any) {
        return await http({ url: "/onlineGame/getStoreCurrentGame", data: query });
    }
}