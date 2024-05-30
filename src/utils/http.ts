/**
 * 添加拦截器:
 *   拦截 request 请求
 */
import CONF from '@/config'
import api from '@/utils/api/common'

let requestQueue:any = []; // 使用数组作为简单的队列实现
let shouldRefreshToken = false;

function enqueueRequest(request:any) {  
  if(requestQueue.length){
    //去除重复的请求
    if(requestQueue.findIndex((v:any)=>v.url === request.url) === -1){
      requestQueue.push(request);  
    }
  }else{
    requestQueue.push(request);  
  }
}

//队列重新请求
async function dequeueAndProcessRequests() {  

  while (requestQueue.length > 0) {  

    const request = requestQueue.shift(); // 从队列头部取出一个请求  

    try {  

      await http(request); // 处理请求  

      // 处理响应或更新应用状态  

    } catch (error) {  

      // 处理请求处理过程中的错误  

      console.error('Error processing request:', error);  

    }  

  }  
}


// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = `${CONF.baseURL}/api${options.url}`
    }
    // 请求超时, 默认 60s
    options.timeout = 10000
    // 添加 token 请求头标识
    if (uni.getStorageSync('SID')) {
      const SID = JSON.parse(uni.getStorageSync('SID'));
      options.header = {};
      options.header[SID.tokenName] = `Bearer ${SID.tokenValue}`
    }
  },
}
uni.addInterceptor('request', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */

type Data<T> = {
  code: string
  msg: string
  result: T
}

// 2.2 添加类型，支持泛型
export const http = async <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    options.data = options.data || {};
    uni.request({
      ...options,
      method: 'POST',
      success(res: any) {
        if (res.statusCode == 200) {
          if (res.data.code === 9999) {
            getGrant().then(_ => {
              setTimeout(async () => {
                try {
                  let res: any = await http(options);
                  resolve(res)
                } catch (e) {
                  reject(e)
                }
              }, 0)
            })


            
            // enqueueRequest(options);
            
            // //重新获取token
            // if(!shouldRefreshToken){
            //   shouldRefreshToken = true;

            //   getGrant().then(_ => {
            //     shouldRefreshToken = false;
            //     dequeueAndProcessRequests();
            //   })
            // }else{
            //   //请求到新token 刷新队列
            //   if(uni.getStorageSync('isLogin')){
            //     dequeueAndProcessRequests();
            //   }
            // }
            
          } else {
            resolve(res.data.data);
          }
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      }
    })
  })
}

/**
 * 登录
 * @returns 
 */
export const getGrant = () => {
  uni.removeStorageSync('isLogin')

  return new Promise((resolve, reject) => {
    uni.login({
      success: async (res) => {
        try {
          await login(res.code)
          resolve('');
        } catch (e) {
          reject(e)
        }
      },
      fail: (e) => {
        reject();
        uni.removeStorageSync('isLogin')
      }
    })
  })
}

export const login = <T>(code: any) => {
  return new Promise<String>(async (resolve, reject) => {
    //已登录成功的，不再获取token
    if (uni.getStorageSync('isLogin')) return;

    try {
      let res: any = await api.code2Session({ code });

      uni.setStorageSync('isLogin', true)
      uni.setStorageSync('SID', JSON.stringify(res.saTokenInfo))
      resolve('');
    } catch (e) {
      uni.removeStorageSync('isLogin')
      reject();
    }
  })
}

/**
 * 上传图片
 * @param url 
 * @returns 
 */
export const uploadFile = <T>(url: string) => {
  return new Promise((resolve, reject) => {
    const tokenValue = `Bearer ${JSON.parse(uni.getStorageSync("SID")).tokenValue}`;

    uni.uploadFile({
      url: CONF.baseURL + "/api/file/upload",
      filePath: url,
      name: "file",
      header: {"Authorization-user": tokenValue},
      success: async (res) => {
        let response = JSON.parse(res.data);

        if (response.code === 200) {
          try {
            //校验图片是否违规
            let data = await api.riskCheckContent({ fileList: [response.data.fileUrl] });
            if (data) {
              resolve(response.data.fileUrl);
            }
          } catch (e) { }
        }
      },
    });
  });
}
