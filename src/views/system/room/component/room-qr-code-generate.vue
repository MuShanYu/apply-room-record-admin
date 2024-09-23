<template>
  <div class="">
    <div class="option" style="text-align: center;margin-bottom: 10px;">
      <div style="font-size: 12px;color: #909399;margin-bottom: 10px;">二维码的生成由于网络原因可能会加载过慢，请耐心等待，如需单个请右键(长按)保存</div>
      <el-button :loading="loading" @click="batchDownloadImgToZip" type="primary" icon="el-icon-download">一键打包下载</el-button>
    </div>
    <div class="main">
      <div class="item" style="margin: 10px;text-align: center;" :id="'image-' + index" v-for="(item, index) in qrCodeRoomList" :key="item.id">
        <div style="color: #303133;font-size: 24px;margin-bottom: 15px;">{{item.room.roomName}}</div>
        <div>
          <el-image style="width: 280px;height: 280px;" :src="item.qrCodeUrl">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <div style="margin-bottom: 5px;">生成失败</div>
             <svg-icon style="width: 100px;height: 100px;" icon-class="imgFailed"/>
            </div>
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

import config from "@/common/sys-config";
export default {
  name: "room-qr-code-generate",
  props: {
    qrCodeRoomList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    config() {
      return config;
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    batchDownloadImgToZip() {
      this.loading = true;
      let zip = new JSZip();
      let promises = [];
      this.$message.info('正在准备，二维码即将下载，请您耐心等待');

      setTimeout(() => {
        this.qrCodeRoomList.forEach((v, index) => {
          // 获取每个图片的URL，并转换成Blob格式
          let promise = fetch(v.qrCodeUrl).then(response => response.blob()).then(blob => {
            // 创建文件名并将Blob添加到zip文件中
            const fileName = v.room.roomName + ".png";
            zip.file(fileName, blob); // 向zip中添加Blob文件
          });
          promises.push(promise);
        });

        Promise.all(promises).then(() => {
          // 当所有图片都添加到zip文件中，生成并下载zip
          zip.generateAsync({ type: "blob" }).then((content) => {
            // 生成二进制流并下载
            saveAs(content, "房间二维码.zip"); // 利用file-saver保存文件
            this.loading = false;
            this.$message.success("已将二维码生成，并压缩下载");
            setTimeout(() => {
              this.$notify({
                title: '提示',
                message: '请注意查收下方下载的文件，并核对信息',
                type: 'success',
                duration: 5000
              });
            }, 200);
          });
        });
      }, 500);
    },
  }
}
</script>

<style scoped>
  .main {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 自动填充列，最小宽度150px */
    gap: 26px; /* 设置项目之间的间距 */
    justify-items: start; /* 左对齐项目 */
  }
</style>
