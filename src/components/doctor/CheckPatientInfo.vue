<template>
  <div class="outBox">
    <div class="headerBox">
      <el-link :underline="false" @click="backToWorkingRegister">
        <i class="el-icon-back"></i>
        返回
      </el-link>
      <span class="title">患者信息</span>
    </div>
    <div class="mainBox">
      <div class="normalInfoBox">
        <div class="infos">
          <div class="item">
            <span class="span">姓名：</span>
            <el-input v-model="patientInfo.name" placeholder="请输入姓名" :disabled="!isEdit">
            </el-input>
          </div>
          <div class="item">
            <span class="span">年龄：</span>
            <el-input v-model="patientInfo.age" placeholder="请输入姓名" :disabled="!isEdit"></el-input>
          </div>
          <div class="item">
            <span class="span">性别：</span>
            <el-select v-model="patientInfo.gender" placeholder="请输入姓名" :disabled="!isEdit">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </div>
          <!-- <div class="item">
            <span class="span">本次挂号时间：</span>
            <div class="registerDate">{{ patientInfo.registerDate }}</div>
          </div> -->
          <div class="item">
            <span class="span">挂号类别：</span>
            <el-tag>{{ patientInfo.registrationName }}</el-tag>
          </div>
          <div class="item">
            <span class="span">失约次数：</span>
            <el-tag :type="getNoVisitedTagColor(patientInfo.noShowNumber)">{{
              getNoVisitedTagContent(patientInfo.noShowNumber) }}</el-tag>
          </div>
          <div class="item">
            <span class="span">本次挂号状态：</span>
            <el-tag :type="patientStateColor(patientInfo.appointmentStatus)">{{
              patientState(patientInfo.appointmentStatus) }}</el-tag>
            <div v-if="isEdit" class="btns">
              <span v-if="patientInfo.appointmentStatus == 'waiting'">设置为：</span>
              <el-button @click="changeState('noVisited')" size="mini" type="danger"
                v-if="patientInfo.appointmentStatus == 'waiting'">失约</el-button>
              <el-button @click="changeState('visited')" size="mini" type="success"
                v-if="patientInfo.appointmentStatus == 'waiting'">已就诊</el-button>
            </div>
          </div>
        </div>
        <div class="btn">
          <el-button v-if="!isEdit" @click="isEdit = true" type="primary">编辑</el-button>
          <el-button v-if="isEdit" @click="EditPatientInfo" type="primary">保存</el-button>
        </div>
      </div>
      <div class="historyBox">
        <div class="historyTitle">历史挂号信息</div>
        <div class="itemBox">
          <div v-for="(item, index) in patientInfo.historys" :key="index" class="item">
            <div class="info">
              <span>挂号时间：</span>
              <span>{{ item.registrationTime }}</span>
              <span>医生姓名：</span>
              <span>{{ item.doctorName }}</span>
            </div>
            <div class="state">
              <span>状态</span>
              <el-tag :type="patientStateColor(item.registrationStatus)">{{ patientState(item.registrationStatus)
              }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/utils/request'
export default {
  data() {
    return {
      patientInfo: {
      },
      isEdit: false,
    }
  },
  methods: {
    //修改患者状态
    changeState(state) {
      if (confirm(`确认修改患者状态为${this.patientState(state)}吗`))
        this.patientInfo.appointmentStatus = state
    },
    //编辑患者信息
    EditPatientInfo() {
      //判断是否有信息未填写（年龄，姓名，姓名，状态）
      if (this.patientInfo.name == '' || this.patientInfo.age == '') {
        this.$message({
          message: '请填写完整信息',
          type: 'warning'
        })
        return
      }
      //发送请求
      http({
        url: '/doctor/setPatientCredit',
        method: 'post',
        data: {
          age: this.patientInfo.age,
          gender: this.patientInfo.gender,
          name: this.patientInfo.name,
          patientId: this.patientInfo.patientId,
          appointmentId: this.patientInfo.appointmentId,
          status: this.patientInfo.appointmentStatus
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success('修改成功')
          }
        })
      this.isEdit = false
    },
    //根据失约次数返回失约标签内容
    getNoVisitedTagContent(num) {
      if (num == 0) return '无失约'
      else return num + '次'
    },
    //根据失约次数返回失约标签颜色
    getNoVisitedTagColor(num) {
      if (num == 0) return 'success'
      else if (num < 4) return 'warning'
      else return 'danger'
    },
    //返回
    backToWorkingRegister() {
      this.$bus.$emit('showWorkingRegister')
    },
    //设置患者状态的颜色
    patientStateColor(state) {
      if (state == 'waiting')
        return 'info'
      if (state == 'visited')
        return 'success'
      if (state == 'noVisited')
        return 'danger'
      if (state == 'stopped')
        return 'warning'
      if (state == 'unpaid')
        return 'info'
      if (state == 'canceled')
        return 'danger'

    },
    //设置患者状态的文字
    patientState(state) {
      if (state == 'waiting')
        return '待就诊'
      if (state == 'visited')
        return '已就诊'
      if (state == 'noVisited')
        return '已失约'
      if (state == 'stopped')
        return '已中止'
      if (state == 'unpaid')
        return '未支付'
      if (state == 'canceled')
        return '已取消'
    },
  },
  mounted() {
    //获取患者基本信息,并保存在缓存中
    if (this.$route.query.patient.name) {
      localStorage.setItem('patientInfo', JSON.stringify(this.$route.query.patient))
    }
    this.patientInfo = JSON.parse(localStorage.getItem('patientInfo'))
    //获取患者历史挂号信息
    http({
      url: `/doctor/query/patient/appointment/${this.patientInfo.patientId}`,
      method: 'get'
    })
      .then(res => {
        if (res.data.code = 200) {
          this.patientInfo.historys = Object.assign([], res.data.data)
        }
      })
  },
}
</script>

<style scoped lang="less">
.outBox {
  width: 100%;
  height: 80vh;

  .headerBox {
    padding: 1% 2%;
    position: relative;
    width: 96%;
    height: 54px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 1%;

    .title {
      margin-left: 20px;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .mainBox {
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: space-between;

    .normalInfoBox {
      padding: 3%;
      margin-right: 2%;
      width: 38%;
      height: 94%;
      background-color: #fff;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .infos {
        .item {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 100%;
          margin-bottom: 30px;
          text-align: right;

          .span {
            width: 120px;
          }

          .registerDate {
            font-size: 15px;
            color: #777;
          }

          .el-input,
          .el-select {
            width: 200px;
          }

          .btns {
            color: #777;

            span {
              width: 120px;
            }

            margin-top: 12px;
            display: flex;
            width: 100%;
          }
        }
      }

    }

    .historyBox {
      width: 50%;
      padding: 3%;
      height: 90%;
      background-color: #fff;
      border-radius: 5px;

      .historyTitle {
        width: 100%;
        font-weight: 600;
        color: #555;
        height: 40px;
      }

      .itemBox {
        height: 100%;
        overflow: auto;

        .item {
          background-color: #eee;
          border-radius: 10px;
          height: 60px;
          margin-bottom: 20px;
          padding: 20px;
          display: flex;
          justify-content: space-between;

          .info {
            width: 50%;
            display: flex;
            flex-wrap: wrap;
            align-content: space-between;

            span:nth-child(1),
            span:nth-child(3) {
              font-weight: 600;
              color: #777;
            }

            span:nth-child(2),
            span:nth-child(4) {
              font-size: 15px;
            }
          }

          .state {
            width: 15%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: space-between;

          }
        }
      }
    }
  }
}
</style>