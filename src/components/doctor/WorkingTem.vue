<template>
  <div class="outBox">
    <div v-if="isAdding" class="addWorkingTemMasking">
      <div class="addWorkingTem">
        <div class="addWorkingTemTitle">添加排班模板</div>
        <el-input v-model="newWorkingTem.templateName" placeholder="模板名称"></el-input>
        <div class="newWorkingTemRegisterTypeBox">
          <span class="registerTypesTitle">挂号类型：</span>
          <el-tag v-for="(type, index) in newWorkingTem.registrationTypes" :key="index" type="info">
            {{ type.registrationName }}
            <a @click="delNewWokingTemRegisterType(index)">×</a>
          </el-tag>
          <el-dropdown triggle="click">
            <el-button size="small" type="info" plain><i class="el-icon-plus"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(type, index) in registerTypes" :key="index">
                <div class="shooseRegisterTypes" @click="addNewWokingTemRegisterType(index)">{{ type.registrationName }}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-input v-model="newWorkingTem.morningCheckNumber" placeholder="上午挂号数量"></el-input>
        <el-input v-model="newWorkingTem.afternoonCheckNumber" placeholder="下午挂号数量"></el-input>
        <div class="btns">
          <el-button type="danger" @click="cancelAddWorkingTem">取消添加</el-button>
          <el-button type="primary" @click="confirmAddWorkingTem">确认添加</el-button>
        </div>
      </div>
    </div>
    <div class="headerBox">
      <div class="title">
        <div class="title">排班模板管理</div>
      </div>
      <div class="bts">
        <el-button @click="delInBatches" type="danger" round>
          <i class="el-icon-delete"></i>
          <span v-if="!isDeling">批量删除</span>
          <span v-if="isDeling">确认删除</span>
        </el-button>
        <el-button @click="addWorkingTem" type="primary" round><i class="el-icon-circle-plus-outline"></i>添加模板</el-button>
      </div>
    </div>
    <div class="tableBox">
      <table class="tableGrp">
        <thead>
          <tr>
            <th v-if="isDeling"><el-checkbox @change="checkAll" v-model="isCheckAll"><span></span></el-checkbox></th>
            <th>模板名称</th>
            <th>可挂号类型</th>
            <th>上午挂号数</th>
            <th>下午挂号数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in workingTems" :key="item.id">
            <td v-if="isDeling"><el-checkbox :label="item.id" v-model="delIds"><span></span></el-checkbox></td>
            <td>
              <span class="workingTemName">{{ item.templateName }}</span>
              <input v-if="item.isEdit" placeholder="请输入模板名" v-model="item.templateName" type="text" class="editInput">
            </td>
            <td class="registerTypesTd">
              <div class=" workingTemTime registerTypesBox">
                <el-tag size="mini" :type="tagColor(index)" v-for="(type, index) in item.registrationTypes"
                  :key="type.id">
                  {{ type.registrationName }}
                  <a v-if="item.isEdit" @click="delRegisterType(item.id, index)">×</a>
                </el-tag>
                <el-dropdown v-if="item.isEdit">
                  <i class="el-icon-plus el-icon--right"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(type, index) in registerTypes" :key="index">
                      <span @click="addRegisterType(item.id, index)">{{ type.registrationName }}</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </td>
            <td>
              <span class="workingTemCost">{{ item.morningCheckNumber }}</span>
              <input v-if="item.isEdit" placeholder="请输入上午挂号数" v-model="item.morningCheckNumber" type="text"
                class="editInput">
            </td>
            <td>
              <span class="workingTemCost">{{ item.afternoonCheckNumber }}</span>
              <input v-if="item.isEdit" placeholder="请输入下午挂号数" v-model="item.afternoonCheckNumber" type="text"
                class="editInput">
            </td>
            <td>
              <el-link v-if="!item.isEdit" @click="EditItem(item)" type="primary">编辑&nbsp;</el-link>
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
      workingTems: [
        {
          templateName: '',
          registrationTypes: [
            {
              id: 0,
              registrationName: '',
              morningCheckNumber: '',
              afternoonCheckNumber: ''
            }
          ],
          morningCheckNumber: '',
          afternoonCheckNumber: ''
        }
      ],
      newWorkingTem: {
        templateName: '',
        registrationTypes: [
        ],
        morningCheckNumber: '',
        afternoonCheckNumber: ''
      },
      registerTypes: [
        {
          id: 0,
          registrationName: '',
          morningCheckNumber: '',
          afternoonCheckNumber: ''
        }
      ],
      delIds: [],
      isDeling: false,
      isCheckAll: false,
      isAdding: false
    }
  },
  watch: {
    //检查是否全选
    delIds(val) {
      if (val.length === this.workingTems.length) {
        this.isCheckAll = true
      } else {
        this.isCheckAll = false
      }
    },
    //为模板设置是否在编辑状态
    workingTems(val) {
      //为模板设置是否在编辑状态
      val.forEach(i => {
        this.$set(i, 'isEdit', false)
      })
    }
  },
  methods: {
    //单个删除模板
    delItem(item) {
      if (!confirm(`确定删除${item.templateName}吗？`)) return
      //虚假的删除
      this.workingTems = this.workingTems.filter(i => i.id !== item.id)
      //真正的删除
      http({
        url: '/doctor/template/delete',
        method: 'post',
        data: [item.id]
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
        }).catch(err => {
          console.log(err)
        })
    },
    //批量删除模板
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
      this.workingTems = this.workingTems.filter(i => !this.delIds.includes(i.id))
      //真正的删除
      http({
        url: '/doctor/template/delete',
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

      this.delIds = []
      this.isDeling = false
    },
    //批量时删除选择全部
    checkAll() {
      if (this.isCheckAll) {
        this.delIds = this.workingTems.map(i => i.id)
      } else {
        this.delIds = []
      }
    },
    //添加挂号模板
    addWorkingTem() {
      //获取医生设置的挂号类别
      http({
        url: '/doctor/registration/query',
        method: 'get'
      })
        .then(res => {
          console.log(res);
          this.registerTypes = Object.assign([], res.data.data)
        })
        .catch(err => {
          console.log(err);
        })
      this.isAdding = true
    },
    //取消添加挂号模板
    cancelAddWorkingTem() {
      if (this.newWorkingTem.name !== '' || this.newWorkingTem.time !== '' || this.newWorkingTem.cost !== '') {
        if (!confirm('确定取消添加吗？')) return
      }
      this.newWorkingTem = {
        name: '',
        time: '',
        cost: ''
      }
      this.isAdding = false
    },
    //确认添加挂号模板
    confirmAddWorkingTem() {
      if (this.newWorkingTem.templateName === '' || this.newWorkingTem.registrationTypes.length == 0 || this.newWorkingTem.morningCheckNumber === '' || this.newWorkingTem.afternoonCheckNumber === '') {
        this.$message({
          message: '请填写完整信息',
          type: 'warning'
        })
        return
      }
      //虚假的添加模板
      this.workingTems.push({
        id: this.workingTems.length + 1,
        ...this.newWorkingTem
      })
      //真实的发送添加模板请求
      http({
        url: '/doctor/template/add',
        method: 'post',
        data: this.newWorkingTem
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
      this.newWorkingTem = {
        templateName: '',
        registrationTypes: [],
        morningCheckNumber: '',
        afternoonCheckNumber: ''
      }
      this.isAdding = false
    },
    //编辑模板
    EditItem(item) {
      item.isEdit = true
      this.workingTems.forEach(i => {
        if (i.isEdit && i.id !== item.id) {
          //由其他未保存的编辑是否合法来决定该修改设置是否生效
          i.isEdit = this.confirmEdit(i)
          item.isEdit = !i.isEdit
        }
      })
    },
    //确认编辑
    confirmEdit(item) {
      if (item.templateName === '' || item.registrationTypes == [] || item.morningCheckNumber === '' || item.afternoonCheckNumber === '') {
        this.$message({
          message: '请填写完整信息',
          type: 'warning'
        })
        //返回true，禁止直接点击编辑其他模板
        return true
      }
      //发送编辑请求
      http({
        url: '/doctor/template/update',
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
      //若该模板无空白信息，可通过点击编辑其他模板保存该模板
      return false
    },
    //控制标签颜色
    tagColor(index) {
      if (index % 3 == 0) {
        return 'success'
      } else if (index % 2 == 1) {
        return 'primary'
      } else {
        return 'danger'
      }
    },
    //删除挂号类别
    delRegisterType(id, index) {
      this.workingTems.forEach(i => {
        if (i.id == id) {
          i.registrationTypes.splice(index, 1)
        }
      })
    },
    //添加挂号类别
    addRegisterType(id, index) {
      this.workingTems.forEach(i => {
        if (i.id == id) {
          if (i.registrationTypes.includes(this.registerTypes[index])) return
          i.registrationTypes.push(this.registerTypes[index])
        }
      })
    },
    //添加新增模板的挂号类别
    addNewWokingTemRegisterType(index) {
      this.newWorkingTem.registrationTypes.push(this.registerTypes[index])
    },
    //删除新增模板的挂号类别
    delNewWokingTemRegisterType(index) {
      this.newWorkingTem.registerTypes.splice(index, 1)
    }
  },
  mounted() {
    //请求医生的挂号模板
    http({
      url: '/doctor/template/query',
      method: 'get'
    })
      .then(res => {
        console.log(res);
        this.workingTems = Object.assign([], res.data.data)
      })
      .catch(err => {
        this.$message({
          message: err.data.msg,
          type: 'error'
        })
      })
    //请求医生的挂号类别
    http({
      url: '/doctor/registration/query',
      method: 'get'
    })
      .then(res => {
        console.log(res);
        this.registerTypes = Object.assign([], res.data.data)
      })
      .catch(err => {
        console.log(err);
      })
  },
}
</script>
  
<style scoped lang="less">
.outBox {
  width: 100%;
  height: 100%;
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
    width: 100%;
    height: 84%;
    overflow: auto;
    padding: 1% 0;
    border-radius: 10px;

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
          // height: 60px;
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

            .workingTemName {
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

          .registerTypesTd {
            display: flex;
            justify-content: center;

            .registerTypesBox {
              width: 80%;
              height: 32px;
              overflow: auto;
              position: absolute;

              .el-tag {
                margin-right: 2px;
              }
            }
          }
        }
      }
    }
  }

  .addWorkingTemMasking {
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

    .addWorkingTem {
      width: 400px;
      height: 340px;
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      font-size: 20px;

      .el-tag {
        margin-right: 5px;
      }

      .registerTypesTitle {
        font-size: 16px;
        color: #777;
      }

      .shooseRegisterTypes {
        text-align: center;
        width: 100%;
      }

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