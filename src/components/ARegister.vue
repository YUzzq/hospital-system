<template>
  <div class="outBox">
    <div class="registerTittle">{{ registerTittle }}</div>
    <div class="aboutAuthCode">
      <el-input @focus="isRightMail = ''" @blur="checkMail" v-model="mail" :class="isRightMail" placeholder="邮箱"
        type="text" class="mailInput"></el-input>
      <div class="authCodeBox">
        <el-input v-model="authCode" placeholder="验证码" type="text" class="authCodeInput"></el-input>
        <el-button @click="sendAuthCode" class="sendBtn" plain type="primary" :disabled="isSendAgain"
          :style="{ width: 115 + 'px' }">{{
            cdWord
          }}</el-button>
      </div>
    </div>
    <div class="editInfo">
      <el-input v-model.trim="info.userName" placeholder="用户名(用于登录)" type="text" class="infoInput"></el-input>
      <el-input v-model.trim="info.password" placeholder="密码" type="password" class="infoInput"></el-input>
      <el-input v-model.trim="confirmPassword" placeholder="确认密码" type="password" class="infoInput"></el-input>
      <el-input v-model.trim="info.name" placeholder="姓名" type="text" class="infoInput"></el-input>
      <el-input v-model.number="info.age" placeholder="年龄" type="text" class="infoInput"></el-input>
      <el-select v-model="info.gender" placeholder="性别" type="select" class="infoInput">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
      <el-button round @click="registerDone" class="submitBtn" type="primary" plain>注册</el-button>
    </div>
    <el-link v-if="registerType == 'patient'" @click="showLogin">返回</el-link>
    <el-link v-if="registerType == 'doctor'" @click="cancelRegister">取消</el-link>
  </div>
</template>

<script>

import http from '@/utils/request'
export default {
  data() {
    return {
      //通过page来控制显示的组件
      mail: '',
      authCode: '',
      isRightMail: '',
      cd: 10,
      isSendAgain: false,
      isFirstSend: true,
      timer: null,
      confirmPassword: '',
      info: {
        userName: '',
        name: '',
        age: '',
        gender: '',
      }
    }
  },

  props: ['registerType'],
  computed: {
    //根据registerType来显示不同的注册标题
    registerTittle() {
      if (this.registerType == 'patient') {
        return '患者注册'
      } else if (this.registerType == 'doctor') {
        return '医生注册'
      }
    },
    //根据cd来显示不同的倒计时文字
    cdWord() {
      if (this.isFirstSend) {
        return '发送验证码'
      }
      if (this.cd == 0) {
        return '重新发送'
      }
      return this.cd + 's'
    }
  },
  methods: {
    // 发送验证码
    sendAuthCode() {
      this.isSendAgain = true
      this.isFirstSend = false
      this.cd = 10
      //发送验证码请求
      http({
        url: '/verify',
        method: 'get',
        params: {
          emailAddress: this.mail
        }
      })
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.cd--
        if (this.cd <= 0) {
          clearInterval(this.timer)
          this.isSendAgain = false
        }
      }, 1000)
    },
    //完成注册并跳转到登录页面
    registerDone() {
      //判断所有信息是否填写完整
      if (this.mail == '') {
        this.$message.error('请填写邮箱')
        return
      } else if (this.authCode == '') {
        this.$message.error('请填写验证码')
        return
      }
      for (let key in this.info) {
        if (this.info[key] == '') {
          this.$message.error('请填写完整信息')
          return
        }
      }
      if (this.info.password != this.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      if (this.registerType == 'patient') {
        //发送注册患者请求
        http({
          url: '/patient/register',
          method: 'post',
          data: {
            emailAddress: this.mail,
            verify: this.authCode,
            gender: this.info.gender,
            age: this.info.age,
            name: this.info.name,
            userName: this.info.userName,
            password: this.info.password
          }
        })
          .then(res => {
            if (res.data.code != 200) {
              this.$message.error(res.data.message)
              return
            }
            this.$message.success('注册成功,两秒后跳转到登录页面')
            setTimeout(() => {
              this.showLogin()
            }, 2000)
          })
      } else if (this.registerType == 'doctor') {
        //发送注册医生请求
        http({
          url: '/doctor/registerOther',
          method: 'post',
          data: {
            emailAddress: this.mail,
            verify: this.authCode,
            gender: this.info.gender,
            age: this.info.age,
            name: this.info.name,
            userName: this.info.userName,
            password: this.info.password
          }
        })
          .then(res => {
            if (res.data.code != 200) {
              this.$message.error(res.data.message)
              return
            }
            this.$message.success('注册成功,两秒后跳转到登录页面')
            setTimeout(() => {
              this.logout()
            }, 2000)
          })
      }
    },
    //返回到登录页面
    showLogin() {
      this.$bus.$emit('showLogin')
    },
    logout() {
      this.$bus.$emit('logout')
    },
    //检查邮箱格式
    checkMail() {
      //判断邮箱格式是否正确
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!reg.test(this.mail) && this.mail != '') {
        this.isRightMail = 'notRightMail'
      } else {
        this.isRightMail = ''
      }
    },
    //取消注册
    cancelRegister() {
      if (confirm('确定取消注册吗？')) {
        this.$bus.$emit('cancelRegister')
      }
    }
  },
}
</script>

<style scoped lang="less">
* {
  padding: 0;
  margin: 0;
}

.notRightMail {
  outline: 1px solid #f00;
  border-radius: 5px;

  &::after {
    content: '邮箱格式不正确';
    position: absolute;
    background-color: #fff;
    font-size: 12px;
    color: #f00;
    right: 0;
    bottom: -8px;
  }
}

.outBox {
  bottom: 0;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 400px;
  height: auto;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .registerTittle {
    font-size: 20px;
    text-align: center;
    padding: 10px;
    color: #000;
  }

  .mailInput,
  .submitBtn {
    display: block;
    width: 300px;
    margin: 15px auto;
  }

  .authCodeBox {
    display: flex;
    justify-content: space-between;
    width: 300px;
    margin: 15px auto;

    .authCodeInput {
      width: 150px;

      .sendBtn {
        width: 115px;
      }
    }
  }

  .editInfo {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 auto;
    width: 300px;

    .infoInput {
      width: 300px;
      margin: 5px 0;

      &:nth-child(4),
      &:nth-child(5) {
        width: 140px;
      }

      // &:nth-child(n):before {
      //   position: absolute;
      //   font-size: 16px;
      //   left: -10px;
      //   content: '*';
      //   color: #f00;
      // }
    }

  }
}
</style>