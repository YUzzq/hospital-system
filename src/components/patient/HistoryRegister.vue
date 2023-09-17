<template>
  <div class="outBox">
    <div class="headerBox">
      <span>历史挂号信息</span>
    </div>
    <div class="mainBox">
      <div class="item" v-for="(item, index) in reverseHistoryInfo" :key="index">
        <div class="orderHeaderBox">
          <div class="state">
            <span>状态：</span>
            <el-tag :type="patientStateColor(item.registrationStatus)">{{ patientState(item.registrationStatus)
            }}</el-tag>
          </div>
          <div>
            <el-button v-if="item.registrationStatus == 'unpaid'" @click="cancelOrder" type="danger">取消订单</el-button>
            <el-button v-if="item.registrationStatus == 'unpaid'" @click="showPaid" type="primary">支付</el-button>
          </div>
        </div>
        <div class="divison"></div>
        <div class="sideBox">
          <div class="infoBox">
            <span>病人姓名：</span>
            <span>{{ patientInfo.name }}</span>
          </div>
          <div class="infoBox">
            <span>挂号科室：</span>
            <span>{{ item.section }}</span>
          </div>
          <div class="infoBox">
            <span>挂号医生：</span>
            <span>{{ item.doctorName }}</span>
          </div>
        </div>
        <div class="sideBox">
          <div class="infoBox">
            <span>挂号时间：</span>
            <span>{{ item.registrationTime }}</span>
          </div>
          <div class="infoBox">
            <span>挂号类型：</span>
            <span>{{ item.registrationTypes[0].registrationName }}</span>
          </div>
          <div class="infoBox">
            <span>挂号费用：</span>
            <span>{{ item.registrationTypes[0].count+'元' }}</span>
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
      patientInfo: {},
      historyInfo: []
    }
  },
  computed: {
    //反转数组
    reverseHistoryInfo() {
      return this.historyInfo.reverse()
    }
  },
  methods: {
    //取消订单
    cancelOrder() {
      this.$bus.$emit('showCancelOrder')
    },
    //支付
    showPaid() {
      this.$bus.$emit('showPaid')
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
    //获取历史挂号信息
    http({
      url: '/patient/query/patient/appointment',
      method: 'get',
      params: {
        patientId: localStorage.getItem('patientId')
      }
    }).then(res => {
      console.log(res)
      this.historyInfo = Object.assign([], res.data.data)
    })
    //获取患者信息
    http({
      url: '/patient/queryInfo',
      method: 'get'
    }).then(res => {
      console.log(res.data.data)
      this.patientInfo = Object.assign({}, res.data.data)
    })
  }
}
</script>
  
<style scoped lang="less">
.outBox {
  height: 100%;

  .headerBox {
    width: 100%;
    display: flex;
    flex: auto;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #409EFF;
    border-radius: 10px;
    color: #eee;

    span {
      font-size: 20px;
      font-weight: bold;
      margin-left: 20px;
    }
  }

  .mainBox {
    .item {
      background-color: #fff;
      margin: 20px;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 0 10px 5px #eee;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .orderHeaderBox {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        span {
          font-size: 18px;
        }
      }

      .divison {
        width: 95%;
        margin: 0 auto;
        height: 1px;
        background-color: #ddd;
        margin-bottom: 20px;
      }

      .sideBox {
        margin: 0 2.5%;

        .infoBox {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          span {
            font-size: 16px;

            &:first-child {
              color: #777;
            }
          }
        }
      }
    }
  }
}
</style>