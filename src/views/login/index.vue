<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入校验码"></el-input>
        </el-form-item>
        <el-form-item prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import './gt.js';
export default {
  data () {
    var xieyiTest = function (rule, value, callback) {
      // rule:校验规则，一般不用
      // value:当前被校验的信息
      // callback：回调函数，校验成功或失败都需要执行
      if (value) {
        callback()
      } else {
        return callback(new Error('请无条件遵守规矩'))
      }
      // value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      loginForm: {
        mobile: '', // 手机号码
        code: '', // 校验码
        xieyi: false // 协议
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [{ required: true, message: '验证码必填' }],
        xieyi: [{ validator: xieyiTest }]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          // this.$router.push('/home')
          return false
        }
        // this.$router.push('/home')
        let pro = this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'get'
        })
        pro
          .then(result => {
            // console.log(result) // 极验的秘钥信息

            // 从result里边解构下述的data对象出来(对象结构赋值)
            let { data } = result.data
            // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
            window.initGeetest(
              {
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind' // 设置验证窗口样式的
              },
              captchaObj => {
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj
                  .onReady(() => {
                    // 验证码ready之后才能调用verify方法显示验证码(可以显示窗口了)
                    captchaObj.verify() // 显示验证码窗口
                  })
                  .onSuccess(() => {
                    // 行为校验正确的处理
                    // B. 验证账号，登录系统
                    this.loginAct()
                  })
                  .onError(() => {
                    // 行为校验错误的处理
                  })
              }
            )
          })
          .catch(err => {
            this.$message.error('获取极验秘钥失败：' + err)
          })
      })
    },
    loginAct () {
      let pro = this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'post',
        data: this.loginForm
      })
      pro
        .then(result => {
          // console.log(result) // 【data】  status statusText headers config request
          // 客户端浏览器把服务器端返回的秘钥等相关信息通过 sessionStorage 做记录，表明是登录状态
          window.sessionStorage.setItem(
            'userinfo',
            JSON.stringify(result.data.data)
          )
          this.$router.push('/home')
        })
        .catch(err => {
          this.$message.error('手机号码或验证码错误:' + err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: gray;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 410px;
    height: 345px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    img {
      width: 50%;
      margin: 20px auto;
    }
    .el-form {
      width: 75%;
    }
  }
}
</style>
