<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <div class="text item">
        <el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormRules">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <quillEditor v-model="editForm.content"></quillEditor>
          </el-form-item>
          <el-form-item label="封面：" prop="channel_id">
            <el-radio-group v-model="editForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道：">
            <channel @slt="selectHandler" :chid="editForm.channel_id"></channel>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editarticle(false)">修改</el-button>
            <el-button @click="editarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import Channel from '@/components/channel.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'ArticleEdit',
  created () {
    this.getChannelList()
    this.getArticleById() // 获得指定文章
  },
  data () {
    return {
      channelList: [],
      editForm: {
        title: '',
        content: '',
        channel_id: '', // 频道
        cover: {
          type: 0,
          images: []
        }
      },
      editFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      }
    }
  },
  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor,
    Channel
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  methods: {
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    getChannelList () {
      var pro = this.$http.get('/mp/v1_0/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获取文章频道错误' + err)
        })
    },
    getArticleById () {
      // axios带着id请求服务器端
      let pro = this.$http({
        url: '/mp/v1_0/articles/' + this.aid,
        method: 'get'
      })
      pro
        .then(result => {
          // console.log(result)
          // editForm表单对象接收修改文章信息
          this.editForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('获取文章失败：' + err)
        })
    },
    editarticle (flag) {
      // 获取表单内容,axios上传
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        let pro = this.$http({
          url: '/mp/v1_0/articles/' + this.aid,
          method: 'put',
          data: this.editForm, // 表单数据
          params: { draft: flag } // 请求字符串数据
        })
        pro
          .then(result => {
            this.$message.success('修改成功')
            this.$router.push({ name: 'article' })
          })
          .catch(err => {
            return this.$message.error('修改文章失败：' + err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.quill-editor /deep/ .ql-editor {
  height: 200px;
}
</style>
