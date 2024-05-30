import { defineStore } from 'pinia'
import api from '../../utils/api/common'

// 定义 Store
export const useUserStore = defineStore(
    'user', () => {
        const getUserInfo = async (reload = false) =>
         {
            if (uni.getStorageSync('userInfo') && !reload) {
                return uni.getStorageSync('userInfo');
            } else {
                let data = await api.getUserSelf({});

                uni.setStorageSync('userInfo', data);

                return data;
            }
        }

        return {
            getUserInfo
        }
    }
)
