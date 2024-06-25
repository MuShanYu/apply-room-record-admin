<template>
  <div >
    <div class="treeContent">
      <el-tree
        :data="menuTree"
        :props="{children: 'children', label: 'title'}"
        show-checkbox
        check-strictly
        node-key="id"
        ref="tree"
        highlight-current
        default-expand-all
        :default-checked-keys="selectedMenu">
       <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="margin-left: 10px;">
          <el-tag
            size="mini">
            {{data.menuType | messageTypeFilter}}
          </el-tag>
        </span>
      </span>
      </el-tree>
    </div>
    <div style="margin-top: 15px;text-align: right;">
      <el-button @click="handleSubmit" type="primary">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'updateRoleMenuAuth',
  props: {
    menuTree: {
      type: Array,
      default() {
        return []
      }
    },
    selectedMenu: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    selectedMenu: {
      deep: true,
      handler: function (val, oldVal) {
        this.$refs.tree.setCheckedKeys(val);
      }
    }
  },
  filters: {
    messageTypeFilter(type) {
      switch (type) {
        case 0:
          return '目录';
        case 1:
          return '菜单';
        case 2:
          return '按钮'
      }
    }
  },
  data() {
    return {

    };
  },
  methods: {
    handleSubmit() {
      let checkedMenuIds = []
      checkedMenuIds.push(...this.$refs.tree.getCheckedKeys())
      checkedMenuIds.push(...this.$refs.tree.getHalfCheckedKeys())
      this.$emit('submitClick', checkedMenuIds)
    },
    // 所有菜单节点数据
    handleCancel() {
      this.$emit("cancelClick")
    }
  }
}
</script>

<style scoped lang="scss">
.treeContent {
  max-height: 400px;
  overflow-y: auto; /* Enable vertical scrolling */
}
</style>
