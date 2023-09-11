<template>
  <div class="loginOutBox">
    <h1>医院挂号系统</h1>
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
  methods: {
    showBtns() {
      this.type = ''
    },
    showRegister() {
      this.type = 'register'
    },
    showLogin() {
      this.type = 'patient'
    }
  },
  mounted() {
    this.$bus.$on('showBtns', this.showBtns)
    this.$bus.$on('showRegister', this.showRegister)
    this.$bus.$on('showLogin', this.showLogin)
    document.body.classList.add('loginBody')
  },
  beforeDestroy() {
    document.body.classList.remove('loginBody')
  }
}
</script>

<style lang="less">
.loginBody{
  background: #8EC5FC; 
}
.loginOutBox {
  h1 {
    width: 100%;
    color: #fff;
    text-align: center;
    font-size: 40px;
    margin-top: 10vh;
    margin-bottom: 10vh;
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