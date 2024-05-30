import api from './api/common';
let canPay = false;

//调起支付
export const doPay = (userId: any, totalAmount: any, productType: string, productName: string, productId: any, payUserType: string, lianlianUserType: string, quantity: number, lpActivityUserItem: any, storeId: any, coupon: any, deliveryAddressesId: any, gatheringId: any) => {
    return new Promise(async (resolve, reject) => {
        if (canPay) return;
        canPay = true;

        uni.showLoading({ title: "支付中..." });

        //创单
        let info: any = await api.createOrder({
            userId,
            optUserId: userId,
            totalAmount,
            productType,
            productName,
            productId,
            payUserType,
            lianlianUserType,
            quantity,
            lpActivityUserItem,
            storeId,
            couponId: coupon ? coupon.id: null,
            gatheringId,
            deliveryAddressesId
        }).catch(_=>{
            canPay = false;
        });

        //优惠券金额
        let couponPrice = coupon ? coupon.cutPrice: 0;

        if (totalAmount - couponPrice > 0) {
            //预支付
            let res: any = await api.paymentGw({
                clientIp: uni.getStorageSync('localip'),
                orderId: info.id,
                payType: "WECHAT_WXA",
                userId,
            }).catch(_=>{
                canPay = false;
            })

            let paylod: any = JSON.parse(res.payload);
            //微信支付
            wx.requestPayment({
                timeStamp: paylod.timeStamp,
                nonceStr: paylod.nonceStr,
                package: paylod.package,
                signType: paylod.signType,
                paySign: paylod.paySign,
                success: async () => {
                    uni.hideLoading();
                    canPay = false;
                    resolve(info.id)
                },
                fail: () => {
                    canPay = false;
                    uni.hideLoading();

                    uni.showToast({
                        title: "未完成支付！",
                        icon: "none",
                    });

                    reject();
                },
            });
        } else {
            canPay = false;
            uni.hideLoading();

            resolve(info.id);
        }
    })
}

//订单支付
export const  orderPay = (orderId: any, userId: any)=> {
    return new Promise(async (resolve, reject) => {
        if (canPay) return;
        canPay = true;

        //预支付
        let res: any = await api.paymentGw({
            clientIp: uni.getStorageSync('localip'),
            orderId,
            payType: "WECHAT_WXA",
            userId,
        }).catch(_=>{
            canPay = false;
        });

        let paylod: any = JSON.parse(res.payload);
        //微信支付
        wx.requestPayment({
            timeStamp: paylod.timeStamp,
            nonceStr: paylod.nonceStr,
            package: paylod.package,
            signType: paylod.signType,
            paySign: paylod.paySign,
            success: async () => {
                uni.hideLoading();
                canPay = false;
                resolve(res.orderTicketId)
            },
            fail: () => {
                canPay = false;
                uni.hideLoading();

                uni.showToast({
                    title: "未完成支付！",
                    icon: "none",
                });

                reject();
            },
        });
    })
}