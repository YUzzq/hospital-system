<template>
  <div class="outBox">
    <div class="showType"><i class="el-icon-first-aid-kit"></i> 医生平台</div>
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#fff">
      <el-menu-item @click="showDoctorInfo" index="1">
        <i class="el-icon-user-solid"></i>
        <span>个人信息</span>
      </el-menu-item>
      <el-menu-item @click="showRegisterType" index="2">
        <i class="el-icon-menu"></i>
        <span>挂号类别</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-order"></i>
          <span slot="title">排班信息</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="showWorkingInfo" index="2-1">排班信息管理</el-menu-item>
          <el-menu-item @click="showWorkingTem" index="2-2">排班模板管理</el-menu-item>
          <el-menu-item @click="showWorkingRegister" index="2-3">挂号管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item @click="showCheckPatientInfo" index="4">
        <i class="el-icon-user"></i>
        <span slot="title">患者信息</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  methods: {
    //打开关闭菜单
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //跳转到医生信息页面
    showDoctorInfo() {
      this.$bus.$emit('showDoctorInfo')
    },
    //跳转到挂号类别页面
    showRegisterType() {
      this.$bus.$emit('showRegisterType')
    },
    //跳转到排班信息页面
    showWorkingInfo() {
      this.$bus.$emit('showWorkingInfo')
    },
    //跳转到排班模板页面
    showWorkingTem() {
      this.$bus.$emit('showWorkingTem')
    },
    //跳转到挂号管理页面
    showWorkingRegister() {
      this.$bus.$emit('showWorkingRegister')
    },
    //跳转到患者信息页面
    showCheckPatientInfo() {
      this.$bus.$emit('showCheckPatientInfo')
    }
  }
}
</script>
<style scoped lang="less">
.outBox {
  width: 250px;
  height: 100%;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  box-shadow: inset -1px -1px 0 #e6e6e6;

  .showType {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    background-color: #409EFF;
    color: #fff;
    margin-bottom: 20px;
    i{
      margin-right: 10px;
      font-size: 22px;
      vertical-align: middle;
    }
  }
}
</style>