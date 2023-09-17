<template>
  <div class="loginOutBox">
    <h1 :style="registerStyle">在线挂号系统</h1>
    <div v-if="!type" class="chooseBtns">
      <a @click="type = 'patient'" class="patientIn">
        <div></div>
        <span>患者入口</span>
      </a>
      <a @click="type = 'doctor'" class="doctorIn">
        <div></div>
        <span>医生入口</span>
      </a>
    </div>
    <login-inputs v-if="type == 'patient' || type == 'doctor'" :type="type"></login-inputs>
    <register v-if="type == 'register'" registerType="patient"></register>
  </div>
</template>

<script>
import LoginInputs from './LoginInputs.vue';
import Register from './ARegister.vue';
export default {
  components: { LoginInputs, Register },
  data() {
    return {
      //通过type来控制显示的组件
      type: '',
    };
  },
  computed:{
    registerStyle(){
      if(this.type == 'register'){
        return {
          marginTop: '10vh'
        }
      }
    }
  },
  methods: {
    //显示选择按钮
    showBtns() {
      this.type = ''
    },
    //显示注册组件
    showRegister() {
      this.type = 'register'
    },
    //显示登录组件
    showLogin() {
      this.type = 'patient'
    }
  },
  mounted() {
    //监听事件
    this.$bus.$on('showBtns', this.showBtns)
    this.$bus.$on('showRegister', this.showRegister)
    this.$bus.$on('showLogin', this.showLogin)
    //添加背景颜色
    document.body.classList.add('loginBody')
  },
  beforeDestroy() {
    document.body.classList.remove('loginBody')
    //移除监听事件
    this.$bus.$off('showBtns', this.showBtns)
    this.$bus.$off('showRegister', this.showRegister)
    this.$bus.$off('showLogin', this.showLogin)
  }
}
</script>

<style lang="less">
.loginBody{
  background: #8EC5FC; 
}
.loginOutBox {
  h1 {
    font-weight: bold;
    width: 100%;
    color: #fff;
    text-align: center;
    font-size: 40px;
    margin-top: 20vh;
    margin-bottom: 5vh;
    height: 100px;
  }

  .chooseBtns {

    .patientIn,
    .doctorIn {
      display: block;
      height: 100px;
      width: 100px;
      border-radius: 10px;
      font-size: 20px;
      text-align: center;
      position: relative;
      padding: 10px;
      z-index: 2;
      left: 50%;
      transform: translateX(-90%);

      &:hover {
        z-index: 3;
      }

      &:hover div {
        animation: move;
        animation-duration: 2s;
        animation-iteration-count: infinite;
      }

      div {
        background-size: 100%;
        width: 60px;
        height: 60px;
        margin: auto;
        margin-bottom: 10px;

        @keyframes move {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.1);
          }

          100% {
            transform: scale(1);
          }
        }



      }

      span {
        padding: 3px 14px;
        border-radius: 12px;
        font-size: 16px;
      }
    }

    .patientIn {
      div {
        background-image: url(../assets/patient-logo.png);
      }

      span {
        background: #fff;
        color: #409EFF;
      }

      background: #409EFF;
      color: #fff;

    }

    .doctorIn {
      div {
        background-image: url(../assets/doctor-logo.png);
      }

      span {
        background: #409EFF;
        color: #fff;
      }

      background: #fff;
      color: #000;
      transform: translate(-20%, -30%);
      z-index: 1;
    }
  }
}
</style>