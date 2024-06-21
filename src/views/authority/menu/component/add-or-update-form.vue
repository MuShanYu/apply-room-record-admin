<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" :key="0">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <tree-select
              v-model="form.parentId"
              :options="menuOptions"
              :normalizer="normalizer"
              :show-count="true"
              :clearable="false"
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group @input="handleMenuTypeChange" v-model="form.menuType">
              <el-radio :label="0">目录</el-radio>
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType !== 2">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              width="350"
              trigger="click"
              @show="$refs['iconSelect'].reset()">
              <icon-select @selected="handleIconSelected" ref="iconSelect" :active-icon="form.icon"/>
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.icon"
                  slot="prefix"
                  :icon-class="form.icon"
                  style="width: 25px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入目录/菜单/按钮名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入路由名称"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" controls-position="right" :min="1" :max="30"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType !== 2">
          <el-form-item prop="isLink">
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
            <el-radio-group v-model="form.isLink">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="form.menuType !== 2">
          <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
            <el-input v-model="form.path" placeholder="请输入路由地址"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType === 1 && form.isLink === 0">
          <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
            <el-input v-model="form.component" placeholder="请输入组件路径"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType !== 0 && form.isLink === 0">
          <el-form-item prop="perms">
            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100"/>
            <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：system:user:list"
                            placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType === 1 && form.isLink === 0">
          <el-form-item prop="queryParam">
            <el-input v-model="form.queryParam" placeholder="请输入路由参数" maxlength="255"/>
            <span slot="label">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由参数
              </span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType === 1 && form.isLink === 0">
          <el-form-item prop="noCache">
              <span slot="label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
            <el-radio-group v-model="form.noCache">
              <el-radio :label="1">不缓存</el-radio>
              <el-radio :label="0">缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="form.menuType !== 2">
          <el-form-item prop="hide">
              <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
            <el-radio-group v-model="form.hide">
              <el-radio :label="1">隐藏</el-radio>
              <el-radio :label="0">不隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="state">
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
            <el-radio-group v-model="form.state">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="form.menuType === 1 && form.isLink === 0">
          <el-form-item prop="breadcrumb">
              <span slot="label">
                <el-tooltip content="是否添加到面包屑中，也就是顶部tab显示" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                面包屑
              </span>
            <el-radio-group v-model="form.breadcrumb">
              <el-radio :label="0">不加入</el-radio>
              <el-radio :label="1">加入</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="菜单备注" prop="remark">
            <el-input
              placeholder="请输入备注)"
              :rows="3"
              maxlength="100"
              show-word-limit
              type="textarea"
              v-model="form.remark"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect/index.vue";


export default {
  name: 'AddOrUpdateForm',
  components: {
    IconSelect,
    TreeSelect
  },
  props: {
    menuOptions: {
      type: Array,
      default() {
        return []
      }
    },
    form: {
      type: Object,
      default() {
        return {
          parentId: '0',
          menuType: 0,
          icon: '#',
          title: '',
          name: '',
          orderNum: 1,
          isLink: 0,
          path: '',
          component: '',
          perms: '',
          queryParam: '',
          noCache: 0,
          hide: 0,
          state: 1,
          breadcrumb: 1,
          remark: ''
        };
      }
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        title: [
          {required: true, message: "菜单名称不能为空", trigger: "blur"}
        ],
        orderNum: [
          {required: true, message: "菜单顺序不能为空", trigger: "blur"}
        ],
        path: [
          {required: true, message: "路由地址不能为空", trigger: "blur"}
        ],
        component: [
          {required: true, message: "路由组件路径不能为空", trigger: "blur"}
        ],
        perms: [
          {required: true, message: "权限标识不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "路由名称不能为空", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    /** 转换菜单数据结构 */
    normalizer(node) {
      let tmpNode = {
        id: node.id,
        label: node.title,
        children: node.children
      }
      if (!tmpNode.children || tmpNode.children.length === 0) {
        tmpNode.children = []
      }
      return tmpNode
    },
    handleMenuTypeChange(val) {
      if (val === 0) {
        this.form.parentId = '0'
      }
    },
    setSubmitAttr(menuType) {
      switch (menuType) {
        case 0:
          this.form.parentId = '0';
          this.form.component = 'Layout';
          this.form.perms = '';
          this.form.queryParam = '';
          this.form.noCache = 0;
          this.form.breadcrumb = 1;
          break;
        case 2:
          this.form.icon = '#';
          this.form.path = '';
          this.form.isLink = 0;
          this.form.component = '';
          this.form.queryParam = '';
          this.form.noCache = 0;
          this.form.breadcrumb = 1;
          this.form.hide = 0;
          break;
      }
    },
    submitForm() {
      if (this.form.menuType !== 0 && this.form.parentId === '0') {
        this.$message.warning('不允许在主类目下创建菜单或按钮')
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.setSubmitAttr(this.form.menuType)
          this.$emit('submit', this.form)
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$emit('close')
    },
    handleIconSelected(icon) {
      this.form.icon = icon
    },
    resetAttr() {
      this.form.parentId = '0';
      this.form.menuType = 0;
      this.form.icon = '#';
      this.form.title = '';
      this.form.name = '';
      this.form.orderNum = 1;
      this.form.isLink = 0;
      this.form.path = '';
      this.form.component = '';
      this.form.perms = '';
      this.form.queryParam = '';
      this.form.noCache = 0;
      this.form.breadcrumb = 1;
      this.form.hide = 0;
      this.form.state = 1;
      this.form.remark = '';
    }
  }
}
</script>

<style scoped lang="scss">

</style>
