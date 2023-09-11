<template>
  <div class="outBox">
    <div v-if="isAdding" class="addRegisterMasking">
      <div class="addRegister">
        <div class="addRegisterTitle">添加挂号类别</div>
        <el-input v-model="newRegister.name" placeholder="挂号名称"></el-input>
        <el-input v-model="newRegister.time" placeholder="预计诊断时间"></el-input>
        <el-input v-model="newRegister.cost" placeholder="挂号费用"></el-input>
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
        <el-button @click="addRegisterType" type="primary" round><i
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
          <tr v-for="(item, index) in registerTypes" :key="index">
            <td v-if="isDeling"><el-checkbox :label="item.id" v-model="delIds"><span></span></el-checkbox></td>
            <td>
              <span class="registerName">{{ item.name }}</span>
              <input v-if="item.isEdit" placeholder="请输入类型名" v-model="item.name" type="text"
                class="editInput">
            </td>
            <td>
              <span class="registerTime">{{item.time}}分钟</span>
              <input v-if="item.isEdit" placeholder="请输入时长（分钟）" v-model.number="item.time"
                type="text" class="editInput"></td>
            <td>
              <span class="registerCost">{{item.cost}}元</span>
              <input v-if="item.isEdit" placeholder="请输入费用（元）" v-model="item.cost"
                type="text" class="editInput">
            </td>
            <td>
              <el-link v-if="!item.isEdit" @click="item.isEdit = true" type="primary">编辑&nbsp;</el-link>
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
export default {
  data() {
    return {
      registerTypes: [
        {
          id: 1,
          name: '普通号',
          time: 10,
          cost: 10
        },
        {
          id: 2,
          name: '专家号',
          time: 20,
          cost: 20
        },
        {
          id: 3,
          name: '特需号',
          time: 30,
          cost: 30
        }
      ],
      newRegister: {
        name: '',
        time: '',
        cost: ''
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
  },
  methods: {
    delItem(item) {
      if (!confirm(`确定删除${item.name}吗？`)) return
      this.registerTypes = this.registerTypes.filter(i => i.id !== item.id)
    },
    delInBatches() {
      if (!this.isDeling) {
        this.isDeling = true
        return
      } else if (this.delIds.length === 0) {
        this.isDeling = false
        return
      }
      if (!confirm(`确定删除这${this.delIds.length}项吗？`)) return
      this.registerTypes = this.registerTypes.filter(i => !this.delIds.includes(i.id))
      this.isDeling = false
    },
    checkAll() {
      if (this.isCheckAll) {
        this.delIds = this.registerTypes.map(i => i.id)
      } else {
        this.delIds = []
      }
    },
    addRegisterType() {
      this.isAdding = true
    },
    //取消添加挂号类型
    cancelAddRegister() {
      if(this.newRegister.name !== '' || this.newRegister.time !== '' || this.newRegister.cost !== '') {
        if(!confirm('确定取消添加吗？')) return
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
      this.registerTypes.push({
        id: this.registerTypes.length + 1,
        name: this.newRegister.name,
        time: this.newRegister.time,
        cost: this.newRegister.cost
      })
      this.newRegister = {
        name: '',
        time: '',
        cost: ''
      }
      this.isAdding = false
    },
    //确认编辑
    confirmEdit(item) {
      if (item.name === '' || item.time === '' || item.cost === '') {
        this.$message({
          message: '请填写完整信息',
          type: 'warning'
        })
        return
      }
      item.isEdit = false
    }
  },
  created() {
    this.registerTypes.forEach(item => {
      this.$set(item, 'isEdit', false)
    })
  },

}
</script>

<style scoped lang="less">
.outBox {
  width: 100%;
  height: 85%;

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
    height: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 1%;
  }

  .tableBox {
    width: 100%;
    height: 30%;
    padding: 1% 0;
    border-radius: 10px;

    .tableGrp {
      width: 100%;
      height: 100%;
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

          td {
            position: relative;
            padding: 10px 0;
            height: 30px;
            text-align: center;
            border-bottom: 3px solid #F7F8FD;
            color: #777;

            span {
              position: relative;
            }

            .registerName {
              color: #409EFF;
            }

            .editInput {
              position: absolute;
              top: 7.5px;
              left: 50%;
              transform: translateX(-50%);
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
}</style>