<template>
    <div class="outBox">
      <div class="showType"><i class="el-icon-s-custom"></i> 患者平台</div>
      <el-menu mode="horizontal" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
        background-color="#fff">
        <el-menu-item @click="showshowPatientRegister" index="1">
          <i class="el-icon-s-order"></i>
          <span>挂号</span>
        </el-menu-item>
        <!-- <el-menu-item @click="showshowHistoryOrder" index="2">
          <i class="el-icon-s-finance"></i>
          <span>订单信息</span>
        </el-menu-item> -->
        <el-menu-item @click="showshowHistoryRegister" index="3">
          <i class="el-icon-s-claim"></i>
          <span>挂号记录</span>
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
      //跳转到挂号页面
      showshowPatientRegister() {
        this.$bus.$emit('showPatientRegister')
      },
      //跳转到订单信息页面
      showshowHistoryOrder() {
        this.$bus.$emit('showHistoryOrder')
      },
      //跳转到挂号记录页面
      showshowHistoryRegister() {
        this.$bus.$emit('showHistoryRegister')
      },
    }
  }
  </script>
  <style scoped lang="less">
  .outBox {
    display: flex;
    background-color: #fff;
    height: 60px;
    .showType {
      width: 250px;
      line-height: 60px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      background-color: #409EFF;
      color: #fff;
      i{
        margin-right: 10px;
        font-size: 22px;
        vertical-align: middle;
      }
    }
  }
  </style>