const CONFIG = {
  development: {
    baseUrl: 'http://localhost:8500',
    logo: 'http://localhost:9528/logo.png',
    avatar: 'http://localhost:9528/header1.gif',
    emptyImg: 'http://localhost:9528/empty.png',
    qrCodeUrlPrefix: '',
    roomExcelHref: 'https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/%E6%88%BF%E9%97%B4%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
    userExcelHref: 'https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/%E4%BA%BA%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF-%E5%9D%87%E4%B8%BA%E5%BF%85%E5%A1%AB%E9%A1%B9.xlsx'
  },
  // 内网访问后端服务
  production: {
    baseUrl: 'https://ip:8500',
    logo: 'https://ip/logo.png',
    avatar: 'https://ip/header1.gif',
    emptyImg: 'https://ip/empty.png',
    qrCodeUrlPrefix: '',
    roomExcelHref: 'https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/%E6%88%BF%E9%97%B4%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
    userExcelHref: 'https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/%E4%BA%BA%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF-%E5%9D%87%E4%B8%BA%E5%BF%85%E5%A1%AB%E9%A1%B9.xlsx'
  }
}

export default CONFIG[process.env.NODE_ENV];
