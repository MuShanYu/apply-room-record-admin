const CONFIG = {
  development: {
    baseUrl: 'http://localhost:8500',
    logo: 'http://localhost:9528/logo.png',
    avatar: 'http://localhost:9528/header1.gif',
    emptyImg: 'http://localhost:9528/empty.png',
    qrCodeUrlPrefix: 'http://localhost:8800?target=',
    roomExcelHref: 'https://mushanyu-file-save.oss-cn-beijing.aliyuncs.com/project/apply-room-record/%E6%88%BF%E9%97%B4%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
    userExcelHref: 'https://mushanyu-file-save.oss-cn-beijing.aliyuncs.com/project/apply-room-record/%E4%BA%BA%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
  },
  production: {
    baseUrl: 'https://www.mushan.top:8500',
    logo: 'https://www.mushan.top/logo.png',
    avatar: 'https://www.mushan.top/header1.gif',
    emptyImg: 'https://www.mushan.top/empty.png',
    qrCodeUrlPrefix: 'https://www.mushan.top:8800?target=',
    roomExcelHref: 'https://mushanyu-file-save.oss-cn-beijing.aliyuncs.com/project/apply-room-record/%E6%88%BF%E9%97%B4%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
    userExcelHref: 'https://mushanyu-file-save.oss-cn-beijing.aliyuncs.com/project/apply-room-record/%E4%BA%BA%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
  }
}

export default CONFIG[process.env.NODE_ENV];
