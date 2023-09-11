<template>
  <div class="outBox">
    <div class="registerTittle">{{ registerTittle }}</div>
    <div class="aboutAuthCode" v-if="page == 'aboutAuthCode'">
      <el-input @focus="isRightMail = ''" @blur="checkMail" v-model.lazy="mail" :class="isRightMail" placeholder="邮箱"
        type="text" class="mailInput"></el-input>
      <div class="authCodeBox">
        <el-input v-model.number="authCode" placeholder="验证码" type="text" class="authCodeInput"></el-input>
        <el-button @click="sendAuthCode" class="sendBtn" plain type="primary" :disabled="isSendAgain"
          :style="{ width: 115 + 'px' }">{{
            cdWord
          }}</el-button>
      </div>
      <el-button round @click="checkAuthCode" class="submitBtn" type="primary" plain>提交</el-button>
    </div>
    <div class="editInfo" v-if="page == 'editInfo'">
      <el-input v-model.trim="info.userName" placeholder="用户名(用于登录)" type="text" class="infoInput"></el-input>
      <el-input v-model.trim="info.name" placeholder="姓名" type="text" class="infoInput"></el-input>
      <el-input v-model.number="info.age" placeholder="年龄" type="text" class="infoInput"></el-input>
      <el-select v-model="info.gender" placeholder="性别" type="select" class="infoInput">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
      <el-button round @click="registerDone" class="submitBtn" type="primary" plain>注册</el-button>
    </div>
    <el-link v-if="registerType=='patient'" @click="showLogin">返回</el-link>
    <el-link v-if="registerType=='doctor'" @click="cancelRegister">取消</el-link>
  </div>
</template>

<script>

export default {
  data() {
    return {
      //通过page来控制显示的组件
      page: 'aboutAuthCode',
      mail: '',
      authCode: '',
      isRightMail: '',
      cd: 10,
      isSendAgain: false,
      isFirstSend: true,
      timer: null,
      info: {
        userName: '',
        name: '',
        age: '',
        gender: '',
        section: '',
        specialLine: ''
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
      console.log('发送验证码')
      this.cd = 10
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.cd--
        if (this.cd <= 0) {
          clearInterval(this.timer)
          this.isSendAgain = false
        }
      }, 1000)
    },
    //提交并验证验证码
    checkAuthCode() {
      console.log('验证成功，进一步提交信息');
      this.page = 'editInfo'
    },
    //完成注册并跳转到登录页面
    registerDone() {
      console.log('注册完成');
      this.showLogin()
    },
    //返回到登录页面
    showLogin() {
      this.$bus.$emit('showLogin')
    },
    //检查邮箱格式
    checkMail() {
      //判断邮箱格式是否正确
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!reg.test(this.mail)&&this.mail!='') {
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
  &::after{
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
  width: 300px;
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
    width: 240px;
    margin: 15px auto;
  }

  .authCodeBox {
    display: flex;
    justify-content: space-between;
    width: 240px;
    margin: 15px auto;

    .authCodeInput {
      width: 120px;

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
    width: 240px;

    .infoInput {
      width: 240px;

      &:nth-child(2),
      &:nth-child(3) {
        width: 110px;
        margin: 15px 0;
      }

      &:nth-child(-n+4):before {
        position: absolute;
        font-size: 16px;
        left: -10px;
        content: '*';
        color: #f00;
      }
    }

  }
}</style>