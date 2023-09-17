<template>
  <div class="outBox">
    <div class="leftBox">
      <div class="item">
        <span>姓名：</span>
        <el-input v-model="docotrInfo.name" placeholder="请输入姓名" :disabled="!isEdit"></el-input>
      </div>
      <div class="item">
        <span>年龄：</span>
        <el-input v-model="docotrInfo.age" placeholder="请输入年龄" :disabled="!isEdit"></el-input>
      </div>
      <div class="item">
        <span>性别：</span>
        <el-select v-model="docotrInfo.gender" placeholder="请输入性别" :disabled="!isEdit">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </div>
      <div class="item">
        <span>职称：</span>
        <el-select v-model="docotrInfo.position" placeholder="请输入职位" :disabled="!isEdit">
          <el-option label="教授" value="教授"></el-option>
          <el-option label="副教授" value="副教授"></el-option>
          <el-option label="主治医师" value="主治医师"></el-option>
          <el-option label="医师" value="医师"></el-option>
        </el-select>
      </div>
      <div class="item">
        <span>科室：</span>
        <el-select v-model="docotrInfo.section" placeholder="请输入科室" :disabled="!isEdit">
          <el-option label="胸外科" value="胸外科"></el-option>
          <el-option label="耳鼻喉科" value="耳鼻喉科"></el-option>
          <el-option label="儿科" value="儿科"></el-option>
          <el-option label="牙科" value="牙科"></el-option>
          <el-option label="皮肤科" value="皮肤科"></el-option>
        </el-select>
      </div>
      <div class="item specialLine">
        <span>擅长方向：</span>
        <el-input maxlength="30" show-word-limit type="textarea" v-model="docotrInfo.specializedField"
          placeholder="请输入擅长领域" :disabled="!isEdit" :rows="3"></el-input>
      </div>
      <el-button v-if="!isEdit" @click="isEdit = true" type="primary">编辑</el-button>
      <el-button v-if="isEdit" @click="sendEditInfo" type="primary">保存</el-button>
    </div>
    <div class="rightBox">
      <span>头像：</span>
      <el-avatar :size="130" icon="el-icon-user-solid"></el-avatar>
      <div class="uploadBtn">
        <!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
          :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload> -->
        <el-button type="info" plain>上传头像</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/utils/request'
export default {
  data() {
    return {
      isEdit: false,
      docotrInfo: {
      },
      // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  methods: {
    //上传头像
    // handleRemove(file, fileList) {
    //   console.log(file, fileList + '@@@');
    // },
    // handlePreview(file) {
    //   console.log(file);
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // }
    //发送修改信息请求
    sendEditInfo() {
      http({
        url: '/doctor/updateInfo',
        method: 'post',
        data: this.docotrInfo
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success('修改成功')
            this.isEdit = false
          } else {
            this.$message.error(res.data.msg)
            if (res.data.code == 401)
              console.log(localStorage.getItem('token'));
            //登录过期，3s后跳转到登录页面
            setTimeout(() => {
              this.$bus.$emit('logout')
            }, 3000)
          }
        })
    },
  },
  mounted() {
    //获取医生信息
    http({
      url: '/doctor/queryInfo',
      method: 'get',
    })
      .then(res => {
        this.docotrInfo = Object.assign({}, res.data.data)
      })
  }
}
</script>

<style scoped lang="less">
.outBox {
  width: 90%;
  padding: 5%;
  border-radius: 10px;
  background-color: #eee;
  display: flex;
  justify-content: space-between;

  .leftBox {
    .item {
      margin-bottom: 20px;

      span {
        width: 100px;
      }

      .el-input,
      .el-select {
        width: 300px;
      }
    }

    .specialLine {
      span {
        display: block;
        margin-bottom: 10px;
      }
    }
  }

  .rightBox {
    display: flex;
    flex-wrap: wrap;
    width: 400px;

    span {
      color: #777;
    }

    .el-avatar {
      color: #fff;
      margin-right: 160px;
      font-size: 80px;
    }

    .el-button {
      margin-top: 20px;
      flex: none;
    }

    .uploadBtn {
      margin: -140px 0 0 55px;

      i {
        margin-right: 3px;
      }
    }
  }
}
</style>