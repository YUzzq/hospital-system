<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import VueRouter from 'vue-router';
import router from './router'  //引入路由配置文件
export default {
  router,
  methods: {
    showDoctorMain() {
      this.$router.replace({
        name: 'doctorMain'
      })
    },
    showPatientMain() {
      this.$router.replace({
        name: 'patientMain'
      })
    },
    logout() {
      this.$router.replace({
        name: 'login'
      })
    },

  },
  mounted() {
    this.$bus.$on('showDoctorMain', this.showDoctorMain)
    this.$bus.$on('showPatientMain', this.showPatientMain)
    this.$bus.$on('logout', this.logout)
  },
  beforeDestroy() {
    this.$bus.$off('showDoctorMain', this.showDoctorMain)
    this.$bus.$off('showPatientMain', this.showPatientMain)
    this.$bus.$off('logout', this.logout)
  }
}
</script>

<style>
body {
  background-color: #F7F8FD;
}
</style>