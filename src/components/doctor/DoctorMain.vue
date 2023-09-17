<template>
  <el-container>
    <el-aside width="250px"><doctor-nav></doctor-nav></el-aside>
    <el-container>
      <el-header :height="60 + 'px'" :style="{ padding: 0 }">
        <div class="headerInfo">
          <el-dropdown placement="bottom-start">
            <span class="el-dropdown-link">
              <i class="el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown" :split-button="true">
              <!-- <el-dropdown-item>
                <div @click="accountEdit">修改密码</div>
              </el-dropdown-item> -->
              <el-dropdown-item>
                <div @click="doctorRegister">医生注册</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="logout">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="division">|</span>
          <div class="infoBox">
            <el-avatar shape="square" icon="el-icon-user-solid" :size="25"></el-avatar>
            <span>你好</span>
            <span>{{ doctorName[0] + '医生' }}</span>
          </div>
        </div>
      </el-header>
      <el-main>
        <div v-if="isAccountEdit" class="accountEditMasking">
          <div class="accountEdit">
            <div class="accountEditTitle">修改密码</div>
            <el-input v-model="usingPassword" placeholder="旧密码"></el-input>
            <el-input v-model="newPassword" placeholder="新密码"></el-input>
            <el-input v-model="newPasswordConfirm" placeholder="确认新密码"></el-input>
            <div class="btns">
              <el-button type="danger" @click="cancelEditAccount">取消</el-button>
              <el-button type="primary" @click="confirmEditAccount">确认修改</el-button>
            </div>
          </div>
        </div>
        <div v-if="isdoctorRegister" class="doctorRegisterMasking">
          <div class="doctorRegister">
            <a-register registerType="doctor"></a-register>
          </div>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ARegister from '../ARegister.vue'
import DoctorNav from './DoctorNav.vue'
import http from '@/utils/request'
export default {
  data() {
    return {
      usingPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      isAccountEdit: false,
      isdoctorRegister: false,
      //医生姓名
      doctorName: '',
    }
  },
  components: { DoctorNav, ARegister },
  methods: {
    //跳转到医生信息页面
    showDoctorInfo() {
      if (this.$route.name == 'doctorInfo') return
      this.$router.replace({
        name: 'doctorInfo'
      })
    },
    //跳转到挂号类别页面
    showRegisterType() {
      if (this.$route.name == 'registerType') return
      this.$router.replace({
        name: 'registerType'
      })
    },
    //跳转到排班信息页面
    showWorkingInfo() {
      if (this.$route.name == 'workingInfo') return
      this.$router.replace({
        name: 'workingInfo'
      })
    },
    //跳转到排班模板页面
    showWorkingTem() {
      if (this.$route.name == 'workingTem') return
      this.$router.replace({
        name: 'workingTem'
      })
    },
    //跳转到挂号管理页面
    showWorkingRegister() {
      if (this.$route.name == 'workingRegister') return
      this.$router.replace({
        name: 'workingRegister'
      })
    },
    //跳转到查看患者信息页面
    showCheckPatientInfo(patient) {
      if (this.$route.name == 'checkPatientInfo') return
      this.$router.replace({
        name: 'checkPatientInfo',
        query: {
          patient: patient,
        }
      })
    },
    //退出登录
    logout() {
      if (confirm('确定退出登录吗？')){
        //清除token
        localStorage.removeItem('token')
        this.$bus.$emit('logout')
      }
    },
    //修改密码
    accountEdit() {
      this.isAccountEdit = true
    },
    //取消修改密码
    cancelEditAccount() {
      this.isAccountEdit = false
    },
    //确认修改密码
    confirmEditAccount() {
      if (this.newPassword == '' || this.newPasswordConfirm == '' || this.usingPassword == '') {
        this.$message({
          message: '请填写完整信息',
        })
        return
      } else if (this.newPassword != this.newPasswordConfirm) {
        this.$message({
          message: '两次输入的密码不一致',
        })
        return
      } else if (this.newPassword == this.usingPassword) {
        this.$message({
          message: '新密码不能与旧密码相同',
        })
        return
      } else if (this.newPassword.length < 6) {
        this.$message({
          message: '密码长度不能小于6位',
        })
        return
      } else if (this.newPassword == this.newPasswordConfirm) {
        this.$message({
          message: '修改成功',
        })
      }
      this.isAccountEdit = false
    },
    //医生注册
    doctorRegister() {
      this.isdoctorRegister = true
    },
    //取消医生注册
    cancelRegister() {
      this.isdoctorRegister = false
    },
  },
  mounted() {
    //监听事件
    this.$bus.$on('showDoctorInfo', this.showDoctorInfo)
    this.$bus.$on('cancelRegister', this.cancelRegister)
    this.$bus.$on('showRegisterType', this.showRegisterType)
    this.$bus.$on('showWorkingInfo', this.showWorkingInfo)
    this.$bus.$on('showWorkingTem', this.showWorkingTem)
    this.$bus.$on('showWorkingRegister', this.showWorkingRegister)
    this.$bus.$on('showCheckPatientInfo', this.showCheckPatientInfo)
    //根据token获取医生信息
    http({
      url: 'doctor/queryInfo',
      method: 'get',
    }).then(res => {
      //获取医生姓名
      this.doctorName = res.data.data.name
    }).catch(err => {
      this.$message.error(err.response.data.msg)
    })
  },
  beforeDestroy() {
    //取消监听事件
    this.$bus.$off('showDoctorInfo', this.showDoctorInfo)
    this.$bus.$off('cancelRegister', this.cancelRegister)
    this.$bus.$off('showRegisterType', this.showRegisterType)
    this.$bus.$off('showWorkingInfo', this.showWorkingInfo)
    this.$bus.$off('showWorkingTem', this.showWorkingTem)
    this.$bus.$off('showWorkingRegister', this.showWorkingRegister)
    this.$bus.$off('showCheckPatientInfo', this.showCheckPatientInfo)
  }
}
</script>

<style scoped lang="less">
.el-container {
  height: 100vh;
  overflow: hidden;

  .el-container {
    flex: auto;
    display: flex;
    flex-wrap: wrap;
    height: 100%;

    .el-header {
      .headerInfo {
        width: 90%;
        height: 100%;
        padding: 0 5%;
        background-color: #fff;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: right;
        align-items: center;

        .division {
          margin: 0 20px;
          color: #ddd;
          vertical-align: middle;
        }

        .infoBox {
          display: flex;
          align-items: center;

          span {
            font-size: 14px;
            margin-left: 5px;

            &:nth-child(2) {
              color: #aaa;
              margin-left: 20px;
            }

            &:nth-child(3) {
              font-weight: bold;
            }
          }
        }

        .el-avatar {
          background-color: #409EFF;
          font-size: 15px;
        }

        .el-icon-setting {
          font-size: 20px;

          &:hover {
            color: #409EFF;
            animation: spin 0.5s;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        }
      }
    }

    .el-aside {
      background-color: #fff;
    }

    .el-main {
      height: 80%;

      .accountEditMasking {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;

        .accountEdit {
          width: 400px;
          height: 340px;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          display: flex;
          flex-wrap: wrap;
          font-size: 20px;

          .btns {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }

      .doctorRegisterMasking {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}</style>