## 项目简介
Waiting  小程序新架构测试

### 技术栈

- 前端框架：[uni-app](https://uniapp.dcloud.net.cn/) (Vue3 + TS + Setup)
- 状态管理：[pinia](https://pinia.vuejs.org/zh/)
- 组件库：[uVIEW-PLUS](https://uiadmin.net/uview-plus/components/tabbar.html)

## 资料说明
Waiting 首次搭建


### 📗 接口文档

[https://www.uat.juyyds.com/api/doc.html#/home](https://www.uat.juyyds.com/api/doc.html#/home)


### 📦 项目源码
https://gitlab.juyyds.com/frontend/mini-juyou/-/tree/master
(https://gitlab.juyyds.com/frontend/mini-juyou.git)


1. 安装nvm node版本控制器   调整node版本 16.20.2  
   GitHub地址 (如果更新地址自行查找)

   **必须安装在默认目录下 否则不能全局使用nvm命令
   https://github.com/coreybutler/nvm-windows/releases
   
   安装完成后 再执行一下命令
```shell
nvm install 16.20.2
nvm use 16.20.2
node -v   
```
------>>> (显示v16.20.2 为正确的版本)

2. 安装依赖 
```shell
npm install -g pnpm
pnpm install
```

3. 运行程序
```shell
pnpm dev:mp-weixin
```

3. 微信开发者工具导入 `/dist/dev/mp-weixin` 目录

### 工程结构解析

```

├── dist                       # 打包文件夹（可删除重新打包）
├── src                        # 源代码
│   ├── components             # 全局组件
│       ├── image-grid         # 图片九宫格组件
│       ├── no-more            # 列表加载完了底部提示组件
│       ├── noData             # 空数据页面提示组件
│       ├── dynamic            # 动态列表组件
│       ├── evaluate           # 剧评列表组件
│       ├── searchBar          # 搜索框
│       └── navigationBar      # 顶部导航栏组件
│   ├── hooks                  # 组合式函数
│       ├── useInstance        # 全局调用方法函数，包含filters、enums、utils、getUserInfo、api
│   ├── pages                  # 主包页面
│       ├── index               # 首页
│       └── my                  # 我的
│   ├── services               # 所有请求
│   ├── static                 # 存放应用引用的本地静态资源的目录
│       ├── images              # 普通图片
│       └── tabs                # tabBar 图片
│   ├── stores                 # 全局 pinia store
│       ├── modules             # 模块
│       └── index.ts            # store 入口
│   ├── styles                 # 全局样式
│       └── fonts.scss          # 字体图标
│   ├── types                  # 类型声明文件
│       └── component.d.ts      # 全局组件类型声明
│   ├── assets                  # 类型声明文件
│       └── index.scss         # 全局sass样式调用
│   ├── utils                  # 全局方法
│       ├── enums              # 枚举类
│       ├── filters            # 过滤器方法
│       ├── http               # 请求体方法  上传图片方法
│       ├── index              # 工具类方法
│       └── location           # 定位方法
│   ├── App.vue                # 入口页面
│   ├── main.ts                # Vue初始化入口文件
│   ├── pages.json             # 配置页面路由等页面类信息
│   ├── manifest.json          # 配置appid等打包信息
│   └── uni.scss               # uni-app 内置的常用样式变量
├── .gitignore                 # git 忽略文件
├── index.html                 # H5 端首页
├── package.json               # package.json 依赖
├── shims-uni.d.ts              # 声明模块并扩展类型
├── tsconfig.json              # typescript 配置
└── vite.config.ts             # vite 配置
```
