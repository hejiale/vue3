import { http } from '../http'

export default {
    /**
     * 用户-角色下个人主页
     */
    async getHomePageRoleDetail(query: any) {
        return await http({ url: "/v2/user/homePageRoleDetail", data: query });
    },


    /**
     * 用户-角色评论
     */
    async getDramaEvaluate(query: any) {
        return await http({ url: "/v2/dramaEvaluate/myDramaEvaluate", data: query });
    },

    /**
     * 用户-角色动态
     */
    async getDramaDynamics(query: any) {
        return await http({ url: "/userDynamicCircle/queryDynamicWithDramaPage", data: query });
    },


    /**
     * 用户-角色收藏
     */
    async getStoreCollects(query: any) {
        return await http({ url: "/v2/store/conditionPageList", data: query });
    },


}