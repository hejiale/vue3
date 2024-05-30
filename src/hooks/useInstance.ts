// import { getCurrentInstance } from "vue";
// import type { ComponentInternalInstance } from "vue";
/**
 * store集
 */
import { useShopStore } from '../stores/modules/shop'
import { useUserStore } from '../stores/modules/user'
import CONF from '../config';
/**
 * 接口集
 */
import api from '../utils/api/common';
import { uploadFile } from '../utils/http';
import gatherApi from '../utils/api/gather';
import myApi from '../utils/api/my';
import homeApi from '../utils/api/home';
import storeApi from '../utils/api/store';
import sassApi from '../utils/api/sass';
/**
 * 工具集
 */
import dayjs from 'dayjs'
import enums from "@/utils/enums";
import { requestAuthorize } from '@/utils/location';
import { formatDate, getDate, menuButtonRect, systemInfo, getColor, aliGetColor, judgeMediaType, getVideoSize, getImageSize, checkContent } from '../utils/index';
import filters from '../utils/filter';
import bus from '@/utils/index';
import { doPay, orderPay } from "@/utils/pay";

export default function useInstance() {
  // const { appContext } = getCurrentInstance() as ComponentInternalInstance;
  const useStore = useShopStore()
  const useUser = useUserStore()

  return {
    bus,
    api,
    myApi,
    formatDate,
    menuButtonRect,
    systemInfo,
    dayjs,
    filters,
    getColor,
    CONF,
    aliGetColor,
    judgeMediaType,
    getImageSize,
    getVideoSize,
    homeApi,
    enums,
    useStore,
    useUser,
    storeApi,
    sassApi,
    uploadFile,
    checkContent,
    requestAuthorize,
    gatherApi,
    getDate,
    doPay,
    orderPay
  };
}