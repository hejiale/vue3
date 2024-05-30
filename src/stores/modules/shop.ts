import { defineStore } from 'pinia'
import api from '../../utils/api/store'

// 定义 Store
export const useShopStore = defineStore(
  'shop', () => {
    const storeId = ref();
    const storeInfo: any = reactive({});

    const setStoreId = async (val: any) => {
      storeId.value = val;

      let data: any = await api.getStoreHome({
        lat: uni.getStorageSync('latitude'),
        lon: uni.getStorageSync('longitude'),
        storeId: val,
        userId: uni.getStorageSync('userInfo').id
      });

      Object.assign(storeInfo, data);
    }

    return {
      storeId,
      storeInfo,
      setStoreId
    }
  }
)
