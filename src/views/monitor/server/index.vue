<template>
  <div style="padding: 15px;">
    <el-row :gutter="25">
      <el-col :span="12">
        <el-card>
          <div slot="header"><span><i class="el-icon-cpu"></i> CPU</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
              <tr>
                <th class="el-table__cell is-leaf">
                  <div class="cell">属性</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">值</div>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">核心数</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.cpu">{{ server.cpu.cpuNum }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">用户使用率</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.cpu">{{ server.cpu.user }}%</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">系统使用率</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.cpu">{{ server.cpu.sys }}%</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">当前空闲率</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.cpu">{{ server.cpu.free }}%</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header"><span><i class="el-icon-box"></i> 内存</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
              <tr>
                <th class="el-table__cell is-leaf">
                  <div class="cell">属性</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">内存</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">JVM</div>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">总内存</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.mem">{{ server.mem.totalMemory }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.jvmTotal }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">已用内存</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.mem">{{ server.mem.memoryUsed }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.usedMemory }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">剩余内存</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.mem">{{ server.mem.restMemory }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.freeMemory }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">使用率</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.mem" :class="{'text-danger': server.mem.usage > 80}">
                    {{ server.mem.usage }}%
                  </div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm" :class="{'text-danger': server.jvm.usage > 80}">
                    {{ server.jvm.usage }}%
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-top: 25px;">
        <el-card>
          <div slot="header">
            <span><i class="el-icon-monitor"></i> 服务器信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">服务器名称</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.sys">{{ server.sys.computerName }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">操作系统</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.sys">{{ server.sys.osName }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">服务器IP</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.sys">{{ server.sys.computerIp }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">系统架构</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.sys">{{ server.sys.osArch }}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-top: 25px;">
        <el-card>
          <div slot="header">
            <span><i class="el-icon-coffee-cup"></i> Java虚拟机信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;table-layout:fixed;">
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">Java名称</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.jvmName }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">Java版本</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.version }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">启动时间</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.startTime }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">运行时长</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.uptime }}</div>
                </td>
              </tr>
              <tr>
                <td colspan="1" class="el-table__cell is-leaf">
                  <div class="cell">安装路径</div>
                </td>
                <td colspan="3" class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.home }}</div>
                </td>
              </tr>
              <tr>
                <td colspan="1" class="el-table__cell is-leaf">
                  <div class="cell">项目路径</div>
                </td>
                <td colspan="3" class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.sys">{{ server.sys.userDir }}</div>
                </td>
              </tr>
              <tr>
                <td colspan="1" class="el-table__cell is-leaf">
                  <div class="cell">运行参数</div>
                </td>
                <td colspan="3" class="el-table__cell is-leaf">
                  <div class="cell-value" v-if="server.jvm">{{ server.jvm.inputArguments }}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-top: 25px;">
        <el-card>
          <div slot="header">
            <span><i class="el-icon-receiving"></i> 磁盘状态</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
              <tr>
                <th class="el-table__cell el-table__cell is-leaf">
                  <div class="cell">盘符路径</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">文件系统</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">盘符类型</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">总大小</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">可用大小</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">已用大小</div>
                </th>
                <th class="el-table__cell is-leaf">
                  <div class="cell">已用百分比</div>
                </th>
              </tr>
              </thead>
              <tbody v-if="server.sysFiles">
              <tr v-for="(sysFile, index) in server.sysFiles" :key="index">
                <td class="el-table__cell is-leaf">
                  <div class="cell-value">{{ sysFile.dirName }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value">{{ sysFile.sysTypeName }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value">{{ sysFile.typeName }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value">{{ sysFile.fileSize }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value">{{ sysFile.restSize }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value">{{ sysFile.usedSize }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell-value" :class="{'text-danger': sysFile.usage > 80}">{{ sysFile.usage }}%</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dataStatistics from "@/api/data-statistics";
import interval from "echarts/src/scale/Interval";
import da from "element-ui/src/locale/lang/da";

export default {
  name: 'Server',
  data() {
    return {
      server: {},
      timer: null
    }
  },
  created() {
    this.fetchDataPeriodically(3000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    async fetchDataPeriodically(interval) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let isFetching = false;
      this.server = await dataStatistics.getServerInfoApi();
      loading.close()
      this.timer = setInterval(async () => {
        if (isFetching) return; // 如果当前正在进行请求，则返回，避免并发请求
        isFetching = true;
        try {
          this.server = await dataStatistics.getServerInfoApi();
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          isFetching = false;
        }
      }, interval);
    }
  }
}
</script>

<style scoped lang="scss">
  .cell-value {
    font-weight: bold;
  }
</style>
