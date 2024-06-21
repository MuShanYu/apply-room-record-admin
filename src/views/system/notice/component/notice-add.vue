<template>
  <div>
      <el-form
        :model="notice"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input
            placeholder="请输入该公告标题"
            v-model="notice.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            placeholder="请输入要发布的公告内容)"
            :rows="6"
            maxlength="1024"
            show-word-limit
            type="textarea"
            v-model="notice.content"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="btnLoading" @click="submitForm" type="primary"
            >添加</el-button
          >
          <el-button @click="cancelUpdate" style="margin-left: 10px"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import noticeApi from "@/api/notice";

export default {
  name: "notice-add",

  data() {
    return {
      notice: {
        title: "",
        content: "",
      },
      btnLoading: false,
      rules: {
        title: [
          { required: true, message: "请填写公告标题", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请填写公告内容", trigger: "blur" },
          {
            min: 1,
            max: 1024,
            message: "长度在 1 到 1024 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          noticeApi
            .addNotice(this.notice)
            .then((data) => {
              this.btnLoading = false;
              this.$message.success("添加成功");
              // 发送修改成功的对象
              this.$emit("addSuccess", data);
            })
            .catch((e) => {
              this.btnLoading = false;
            });
        } else {
          this.$message.warning("请检查您输入的信息");
          return false;
        }
      });
    },
    cancelUpdate() {
      this.$emit("cancelUpdate");
    },
  },
};
</script>

<style lang="scss" scoped></style>
