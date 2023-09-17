<template>
  <div class="outBox">
    <div class="headerBox">
      <span>当前订单信息</span>
    </div>
    <div class="mainBox">
      <div class="item">
        <div class="orderHeaderBox">
          <div class="orderTitle">
            <span>单号：</span>
            <span>123456789</span>
          </div>
          <div class="state">
            <span>状态：</span>
            <el-tag type="success">已完成</el-tag>
          </div>
        </div>
        <div class="divison"></div>
        <div class="sideBox">
          <div class="infoBox">
            <span>病人姓名：</span>
            <span>张三</span>
          </div>
          <div class="infoBox">
            <span>挂号科室：</span>
            <span>内科</span>
          </div>
          <div class="infoBox">
            <span>挂号医生：</span>
            <span>张医生</span>
          </div>
        </div>
        <div class="sideBox">
          <div class="infoBox">
            <span>挂号时间：</span>
            <span>2020-12-12 12:12:12</span>
          </div>
          <div class="infoBox">
            <span>挂号类型：</span>
            <span>心脑血管</span>
          </div>
          <div class="infoBox">
            <span>挂号费用：</span>
            <span>12元</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

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