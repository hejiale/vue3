import api from './api/common';

// 隐私授权
export function requestAuthorize() {
    return new Promise((resolve) => {
        if (!uni.getStorageSync("isLocation")) {
            wx.requirePrivacyAuthorize({
                success: async () => {
                    try {
                        await getUserLocalResolverCity();
                        resolve(uni.getStorageSync("city-info"))
                    } catch (e) {
                        resolve(uni.getStorageSync("city-info"))
                    }

                },
                fail: () => {
                    resolve(uni.getStorageSync("city-info"))
                }, // 用户拒绝授权
            });
        } else {
            resolve(uni.getStorageSync("city-info"))
        }
    })
}

//获取经纬度信息并解析城市
async function getUserLocalResolverCity() {
    return new Promise(async (resolve, reject) => {
        try {
            await getUserLocation();

            if (!uni.getStorageSync("latitude") || !uni.getStorageSync("longitude")) {
                return reject();
            }

            let data: any = await api.regionResolver({
                latitude: uni.getStorageSync("latitude"),
                longitude: uni.getStorageSync("longitude"),
                userId: uni.getStorageSync('userInfo').id,
                dataSource: "SAAS_MP"
            });
            
            let cityData = {
                id: data.cityId,
                name: data.city,
            }
            uni.setStorageSync("city-info", cityData);
            resolve('');
        } catch (e) {
            reject();
        }
    })

}

// 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
function getUserLocation() {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    uni.hideLoading();
                    uni.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                uni.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                                reject();
                            } else if (res.confirm) {
                                uni.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            uni.showToast({
                                                title: '授权成功',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                            //再次授权，调用uni.getLocation的API
                                            getLocation().then(r => {
                                                resolve(r);
                                            }).catch(e => {
                                                reject(e);
                                            })
                                        } else {
                                            reject();
                                            uni.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用uni.getLocation的API
                    getLocation().then(r => {
                        resolve(r);
                    }).catch(e => {
                        reject(e);
                    })
                }
                else {
                    //调用uni.getLocation的API
                    getLocation().then(r => {
                        resolve(r);
                    }).catch(e => {
                        reject(e);
                    })
                }
            }
        })
    })
}

// 获取定位当前位置的经纬度
function getLocation() {
    return new Promise((resolve, reject) => {
        uni.getLocation({
            type: 'gcj02',
            isHighAccuracy: true,
            success: function (res) {
                uni.setStorageSync('longitude', res.longitude)
                uni.setStorageSync('latitude', res.latitude)
                uni.setStorageSync('isLocation', true);
                resolve('');
            },
            fail: function (e) {
                reject(e)
            }
        })
    })
}