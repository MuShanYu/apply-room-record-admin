<template>
  <el-row :gutter="20" class="panel-group" justify="space-between">

    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="card-panel-col">
      <el-card shadow="hover" class="card-panel">
        <el-skeleton :loading="loading" animated :rows="2">
          <template #default>
            <div class="" style="display: flex;justify-content: space-between;">
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
              </div>
              <div style="display: flex;flex-direction: column; justify-content: space-between;">
                <div style="font-size: 16px;font-weight: 500;color: rgb(107 114 128);">
                  用户数量
                </div>
                <div style="font-weight: 700;font-size: 20px;">
                  <count-to :start-val="0" :end-val="countData.userCount" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-card>

    </el-col>

    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="card-panel-col">
      <el-card shadow="hover" class="card-panel">
        <el-skeleton :loading="loading" animated :rows="2">
          <template #default>
            <div class="" style="display: flex;justify-content: space-between;">
              <div class="card-panel-icon-wrapper icon-room">
                <svg-icon icon-class="room" class-name="card-panel-icon"/>
              </div>
              <div style="display: flex;flex-direction: column; justify-content: space-between;">
                <div style="font-size: 16px;font-weight: 500;color: rgb(107 114 128);">
                  房间数量
                </div>
                <div style="font-weight: 700;font-size: 20px;">
                  <count-to :start-val="0" :end-val="countData.roomCount" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-card>
    </el-col>

    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="card-panel-col">
      <el-card shadow="hover" class="card-panel">
        <el-skeleton :loading="loading" animated :rows="2">
          <template #default>
            <div class="" style="display: flex;justify-content: space-between;">
              <div class="card-panel-icon-wrapper icon-apply">
                <svg-icon icon-class="apply" class-name="card-panel-icon"/>
              </div>
              <div style="display: flex;flex-direction: column; justify-content: space-between;">
                <div style="font-size: 16px;font-weight: 500;color: rgb(107 114 128);">
                  用户数量
                </div>
                <div style="font-weight: 700;font-size: 20px;">
                  <count-to :start-val="0" :end-val="countData.roomReserveReviewed" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-card>
    </el-col>

    <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="card-panel-col">
      <el-card shadow="hover" class="card-panel">
        <el-skeleton :loading="loading" animated :rows="2">
          <template #default>
            <div class="" style="display: flex;justify-content: space-between;">
              <div class="card-panel-icon-wrapper icon-liudong">
                <svg-icon icon-class="liudong" class-name="card-panel-icon"/>
              </div>
              <div style="display: flex;flex-direction: column; justify-content: space-between;">
                <div style="font-size: 16px;font-weight: 500;color: rgb(107 114 128);">
                  用户数量
                </div>
                <div style="font-weight: 700;font-size: 20px;">
                  <count-to :start-val="0" :end-val="countData.accessRecordCount" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    countData: {
      type: Object,
      default() {
        return {
          accessRecordCount: 0,
          roomCount: 0,
          roomReserveReviewed: 0,
          userCount: 0
        }
      }
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

.panel-group {

  .card-panel {
    margin-bottom: 20px;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-room {
        background: #36a3f7;
      }

      .icon-apply {
        background: #f4516c;
      }

      .icon-liudong {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-room {
      color: #36a3f7;
    }

    .icon-apply {
      color: #f4516c;
    }

    .icon-liudong {
      color: #34bfa3
    }

  }

  .card-panel-icon {
    font-size: 40px;
  }

  .card-panel-icon-wrapper {
    padding: 16px;
    border-radius: 6px;
  }

}
</style>
