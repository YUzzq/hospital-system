<template>
  <div class="outBox">
    <div v-if="isAdding" class="addRegisterMasking">
      <div class="addRegister">
        <div class="addRegisterTitle">添加挂号类别</div>
        <el-input v-model="newRegister.registrationName" placeholder="挂号名称"></el-input>
        <el-input v-model="newRegister.estimatedTime" placeholder="预计诊断时间"></el-input>
        <el-input v-model="newRegister.count" placeholder="挂号费用"></el-input>
        <div class="btns">
          <el-button type="danger" @click="cancelAddRegister">取消</el-button>
          <el-button type="primary" @click="confirmAddRegister">确认添加</el-button>
        </div>
      </div>
    </div>
    <div class="headerBox">
      <div class="title">
        <div class="title">挂号类别管理</div>
      </div>
      <div class="bts">
        <el-button @click="delInBatches" type="danger" round>
          <i class="el-icon-delete"></i>
          <span v-if="!isDeling">批量删除</span>
          <span v-if="isDeling">确认删除</span>
        </el-button>
        <el-button @click="isAdding = true" type="primary" round><i
            class="el-icon-circle-plus-outline"></i>添加类别</el-button>
      </div>
    </div>
    <div class="tableBox">
      <table class="tableGrp">
        <thead>
          <tr>
            <th v-if="isDeling"><el-checkbox @change="checkAll" v-model="isCheckAll"><span></span></el-checkbox></th>
            <th>类别名称</th>
            <th>预计诊断时间</th>
            <th>挂号费用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in registerTypes" :key="item.id">
            <td v-if="isDeling"><el-checkbox :label="item.id" v-model="delIds"><span></span></el-checkbox></td>
            <td>
              <span class="registerName">{{ item.registrationName }}</span>
              <input v-if="item.isEdit" placeholder="请输入类型名" v-model="item.registrationName" type="text"
                class="editInput">
            </td>
            <td>
              <span class="registerTime">{{ item.estimatedTime }}分钟</span>
              <input v-if="item.isEdit" placeholder="请输入时长（分钟）" v-model.number="item.estimatedTime" type="text"
                class="editInput">
            </td>
            <td>
              <span class="registerCost">{{ item.count }}元</span>
              <input v-if="item.isEdit" placeholder="请输入费用（元）" v-model="item.count" type="text" class="editInput">
            </td>
            <td>
              <el-link v-if="!item.isEdit" @click="EditregisterType(item)" type="primary">编辑&nbsp;</el-link>
              <el-link v-if="item.isEdit" @click="confirmEdit(item)" type="primary">完成&nbsp;</el-link>
              <el-link @click='delItem(item)' type="danger">删除</el-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import http from '@/utils/request'
export default {
  data() {
    return {
      registerTypes: [
      ],
      newRegister: {
        registrationName: '',
        estimatedTime: '',
        count: ''
      },
      delIds: [],
      isDeling: false,
      isCheckAll: false,
      isAdding: false
    }
  },
  watch: {
    delIds(val) {
      if (val.length === this.registerTypes.length) {
        this.isCheckAll = true
      } else {
        this.isCheckAll = false
      }
    },
    //为新增加的挂号类别设置是否在编辑状态
    registerTypes(val) {
      if (val.length === 0) return
      this.$set(val[val.length - 1], 'isEdit', false)
    }
  },
  methods: {
    //删除单个挂号类型
    delItem(item) {
      if (!confirm(`确定删除${item.registrationName}吗？`)) return
      //真正的删除
      http({
        url: '/doctor/registration/delete',
        method: 'post',
        data:[item.id]
      })
        .then(res => {
          if (res.data.code == 200) {
            //虚假的删除
            this.registerTypes = this.registerTypes.filter(i => i.id !== item.id)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(err => {
          console.log(err)
        })
    },
    //批量删除挂号类型
    delInBatches() {
      if (!this.isDeling) {
        this.isDeling = true
        return
      } else if (this.delIds.length === 0) {
        this.isDeling = false
        return
      }
      if (!confirm(`确定删除这${this.delIds.length}项吗？`)) return
      //虚假的删除
      this.registerTypes = this.registerTypes.filter(i => !this.delIds.includes(i.id))
      //真正的删除
     http({
        url: '/doctor/registration/delete',
        method: 'post',
        data: this.delIds
      })
      .then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
        .catch(err => {
          console.log(err.data.msg);
        })
      this.isDeling = false
      this.delIds = []
    },
    //选择全部
    checkAll() {
      if (this.isCheckAll) {
        this.delIds = this.registerTypes.map(i => i.id)
      } else {
        this.delIds = []
      }
    },
    //取消添加挂号类型
    cancelAddRegister() {
      if (this.newRegister.name !== '' || this.newRegister.time !== '' || this.newRegister.cost !== '') {
        if (!confirm('确定取消添加吗？')) return
      }
      this.newRegister = {
        name: '',
        time: '',
        cost: ''
      }
      this.isAdding = false
    },
    //确认添加挂号类型
    confirmAddRegister() {
      if (this.newRegister.name === '' || this.newRegister.time === '' || this.newRegister.cost === '') {
        this.$message({
          message: '请填写完整信息',
          type: 'warning'
        })
        return
      }
      //页面假装添加
      this.registerTypes.push({
        id: this.registerTypes.length + 1,
        registrationName: this.newRegister.registrationName,
        estimatedTime: this.newRegister.estimatedTime,
        count: this.newRegister.count
      })
      //真实的发送添加挂号类型请求
      http({
        url: '/doctor/registration/add',
        method: 'post',
        data: this.newRegister
      })
      .then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
      })
      this.newRegister = {
        registrationName: '',
        estimatedTime: '',
        count: ''
      }
      this.isAdding = false
    },
    //编辑挂号类型
    EditregisterType(item) {
      item.isEdit = true
      //将其他的挂号类型设置为不可编辑
      this.registerTypes.forEach(i => {
        if (i.isEdit==true&&i.id !== item.id) {
          i.isEdit = this.confirmEdit(i)
          item.isEdit = !i.isEdit
        }
      })
    },
    //确认编辑
    confirmEdit(item) {
      if (item.registrationName === '' || item.estimatedTime === '' || item.count === '') {
        this.$message({
          message: '请填写完整信息',
          type: 'warning'
        })
        return true
      }
      //发送编辑请求
      http({
        url: '/doctor/registration/update',
        method: 'post',
        data: item
      })
      .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      item.isEdit = false
      return false
    }
  },
  created() {
  },
  mounted() {
    //请求医生的挂号类别
   http({
        url: '/doctor/registration/query',
        method: 'get'
      })
      .then(res => {
        console.log(res);
        this.registerTypes = Object.assign([], res.data.data)
        this.registerTypes.forEach(item => {
          this.$set(item, 'isEdit', false)
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

}
</script>

<style scoped lang="less">
.outBox {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .headerBox {
    .title {
      font-size: 20px;
      font-weight: bold;
    }

    .el-button {
      i {
        margin-left: -10px;
        margin-right: 5px;
      }
    }

    padding: 1% 2%;
    width: 96%;
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 1%;
  }

  .tableBox {
    height: 84%;
    width: 100%;
    padding: 1% 0;
    border-radius: 10px;
    overflow: auto;

    .tableGrp {
      width: 100%;
      border-collapse: collapse;

      thead {
        tr {
          th {
            padding: 10px 0;
            text-align: center;

            .el-checkbox::after {
              content: '全选';
              position: absolute;
              z-index: 12;
            }

            .el-checkbox:hover::after {
              color: #409EFF;
            }
          }
        }

        font-weight: 600;
        border-bottom: 10px solid #F7F8FD;
        color: #333;
      }

      tbody {
        tr {
          background-color: #fff;
          border-bottom: 3px solid #F7F8FD;

          td {
            position: relative;
            padding: 10px 0;
            height: 30px;
            text-align: center;
            vertical-align: middle;
            line-height: 30px;
            color: #777;

            span {
              position: relative;
            }

            .registerName {
              color: #409EFF;
            }

            .editInput {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              border: none;
              border-bottom: 1px solid #409EFF;
              outline: none;
              text-align: center;
              font-size: 16px;
              padding-bottom: 3px;
              padding-top: 2px;
            }
          }
        }
      }
    }
  }

  .addRegisterMasking {
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

    .addRegister {
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
}
</style>