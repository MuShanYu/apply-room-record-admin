<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input v-model="name" class="icon-search" clearable placeholder="请输入图标名称(英文名称)" @clear="filterIcons" @input="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div class="list-container">
        <div v-for="(item, index) in iconList" class="icon-item-wrapper" :key="index" @click="selectedIcon(item)">
          <div :class="['icon-item', { active: activeIcon === item }]">
            <svg-icon :icon-class="item" class-name="icon" style="height: 25px;width: 16px;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './requireIcons'
export default {
  name: 'IconSelect',
  props: {
    activeIcon: {
      type: String
    }
  },
  data() {
    return {
      name: '',
      iconList: icons
    }
  },
  methods: {
    filterIcons() {
      this.iconList = icons
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-list {
  padding: 10px;
  max-height: 350px;
  overflow-y: auto; /* Enable vertical scrolling */
}
.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
}
.icon-item-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9; /* Optional: Add background color */
}

.icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.label {
  font-size: 14px;
}
</style>
