import api from './api/common';
// 事件总线第三方库：
import mitt from 'mitt';
const bus = mitt();
export default bus;

/**
 * 日期格式化函数
 * @param date 日期对象
 * @param format 日期格式，默认为 YYYY-MM-DD HH:mm:ss
 */
export const formatDate = (date: Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  // 获取年月日时分秒，通过 padStart 补 0
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 返回格式化后的结果
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 获取胶囊的rect参数
 */
export const menuButtonRect = () => {
  return new Promise((resolve) => {
    const rect = uni.getMenuButtonBoundingClientRect();
    resolve(rect);
  });
}

/**
 * 获取设备信息
 */
export const systemInfo = () => {
  return new Promise((resolve) => {
    uni.getSystemInfo({
      success: function (res) {
        resolve(res);
      },
    });
  });
}

//剧游取色
export function getColor(url:string, isTransform: boolean = true) {
  return new Promise(async(resolve, reject) => {
    try{
      let res : any = await api.getCoverMainColor({str: url});
      if(isTransform){
        resolve(hexToRgb(res.coverMainColor));
      }else{
        resolve(res.coverMainColor);
      }
    }catch(e){
      reject(e)
    }
  });
}

//阿里云取色
export function aliGetColor(url:string) {
  return new Promise(async(resolve, reject) => {
    try{
      uni.request({
        method: "GET",
        url: `${url}?x-oss-process=image/average-hue`,
        complete: function complete(response: any) {
          resolve(hexToRgb(response.data.RGB.substring(
            2,
            response.data.RGB
          )))
        },
        fail(e) {},
      });
    }catch(e){
      reject(e)
    }
  });
}

export function hexToRgb(hex:string):string {
  // 去除前导符号"#"
  var color = hex.replace("#", "");
  // 分割成红、绿、蓝三部分
  var red = parseInt(color.substring(0,2),16);
  var green = parseInt(color.substring(2,4),16);
  var blue = parseInt(color.substring(4,6),16);
  return `${red}, ${green}, ${blue}`;
}

//判断是图片还是视频格式
export function judgeMediaType(fileName:string) {
  // 后缀获取
  var suffix = ''
  // 获取类型结果
  var result:any = ''
  try {
    var flieArr = fileName.split('.')
    suffix = flieArr[flieArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false
    return result
  }
  // 图片格式
  var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']
  // 进行图片匹配
  result = imglist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'image'
    return result
  }
  // 匹配txt
  var txtlist = ['txt']
  result = txtlist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'txt'
    return result
  }
  // 匹配 excel
  var excelist = ['xls', 'xlsx']
  result = excelist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'excel'
    return result
  }
  // 匹配 word
  var wordlist = ['doc', 'docx']
  result = wordlist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'word'
    return result
  }
  // 匹配 pdf
  var pdflist = ['pdf']
  result = pdflist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'pdf'
    return result
  }
  // 匹配 ppt
  var pptlist = ['ppt']
  result = pptlist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'ppt'
    return result
  }
  // 匹配 视频
  var videolist = ['mp4', 'm2v', 'mkv']
  result = videolist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'video'
    return result
  }
  // 匹配 音频
  var radiolist = ['mp3', 'wav', 'wmv']
  result = radiolist.some(function (item) {
    return item == suffix
  })
  if (result) {
    result = 'radio'
    return result
  }
  // 其他 文件类型
  result = 'other'
  return result
}

//获取图片的宽高
export function getImageSize(cover:string) {
  return new Promise((resolve, reject) => {
    uni.request({
      method: "GET",
      url: `${cover}?x-oss-process=image/info`,
      complete: function complete(response:any) {
        resolve(response.data);
      },
      fail(e) {
        reject(e)
      },
    });
  })
}

//获取视频的宽高
export function getVideoSize(cover:string) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await api.detectMediaMeta({ url: cover });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  })
}

//查询云svg图标
export async function querySvgIcons(){
  try{
    let data: any = await api.svgIconList({
      pageNo: 1,
      pageSize: 2000
    });
    uni.setStorageSync('svg-icon', data.records);
  }catch(e){}
}

//校验内容是否违规
export function checkContent(content: string) {
  return new Promise(async (resolve, reject) => {
    try {
      await api.riskCheckContent({ content });
      resolve('');
    } catch (e) {
      reject(e)
    }
  })
}

export function getDate(n:number) {
  var n = n;
  var myDate = new Date(new Date().setHours(0, 0, 0, 0));
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  if (day <= n) {
    if (month > 1) {
      month = month - 1;
    } else {
      year = year - 1;
      month = 12;
    }
  }
  myDate.setDate(myDate.getDate() - n);
  year = myDate.getFullYear();
  month = myDate.getMonth() + 1;
  day = myDate.getDate();
  let appointDate =
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day);
  // return new Date(appointDate).setHours(0, 0, 0, 0);
  return new Date(
    new Date(appointDate).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
  ); //到第13天的23分59秒
}