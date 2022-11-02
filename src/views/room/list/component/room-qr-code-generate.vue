<template>
  <div class="">
    <div class="option" style="text-align: center;margin-bottom: 10px;">
      <div style="font-size: 12px;color: #909399;margin-bottom: 10px;">二维码的生成由于网络原因可能会加载过慢，请耐心等待</div>
      <el-button :disabled="isDownload" :loading="loading" @click="batchDownloadImgToZip" type="primary" icon="el-icon-download">一键打包下载</el-button>
    </div>
    <div class="main">
      <div style="margin: 10px;text-align: center;" :id="'image-' + index" v-for="(item, index) in roomList" :key="item.id">
        <div style="color: #303133;font-size: 16px;margin-bottom: 8px;">{{item.roomName}}</div>
        <vue-qr :callback="generateQRCodeCallBack" :margin="10" :size="227" :logo-src="constants.logo" :text="constants.qrCodeUrlPrefix + item.id"></vue-qr>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

import constants from "@/common/CommonCantans";
export default {
  name: "room-qr-code-generate",
  props: {
    roomList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    constants() {
      return constants;
    }
  },
  data() {
    return {
      loading: false,
      QRCodeURLs: [],
      isDownload: false
    }
  },
  methods: {
    generateQRCodeCallBack(url, qid) {
      // this.QRCodeURLs.push(url)
    },
    batchDownloadImgToZip() {
      this.loading = true
      let zip = new JSZip()
      let promises = []
      this.$message.info('正在准备，二维码即将下载，请您耐心等待')
      setTimeout(() => {
        this.roomList.forEach((v, index) => {
          let promise = this.generateCanvasImg(index);
          promises.push(promise)
        })
        Promise.all(promises).then(() => {
          this.QRCodeURLs.forEach((v, index) => {
            const fileName = v.roomName + ".png";
            zip.file(fileName, v.imgUrl.substring(22), { base64: true }); //向zip中添加文件
          })
          zip.generateAsync({ type: "blob" }).then((content) => {
            // 生成二进制流
            saveAs(content, "房间二维码.zip"); // 利用file-saver保存文件
            this.loading = false
            this.QRCodeURLs = [] // 重置
            this.$message.success("已将二维码生成，并压缩下载")
            setTimeout(() => {
              this.$notify({
                title: '提示',
                message: '重复生成的二维码不影响旧二维码的使用，请注意查收下方下载的文件，并核对信息',
                type: 'success',
                duration: 8000
              })
            }, 200)
          });
        })
      }, 500)
    },
    generateCanvasImg(index) {
      return new Promise((resolve, reject) => {
        let that = this
        let imageCanvas = document.getElementById('image-' + index)
        html2canvas(imageCanvas).then((canvas) => {
          let imageUrl = canvas.toDataURL("image/png")
          let obj = {
            imgUrl: imageUrl,
            roomName: that.roomList[index].roomName
          }
          this.QRCodeURLs.push(obj)
          resolve()
        })
      })
    }
  }
}
</script>

<style scoped>
  .main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
