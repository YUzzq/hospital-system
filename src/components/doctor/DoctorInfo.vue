<template>
  <div class="outBox">
    <div class="leftBox">
      <div class="item">
        <span>姓名：</span>
        <el-input v-model="docotrInfo.name" placeholder="请输入姓名" :disabled="!isEdit"></el-input>
      </div>
      <div class="item">
        <span>年龄：</span>
        <el-input v-model="docotrInfo.age" placeholder="请输入姓名" :disabled="!isEdit"></el-input>
      </div>
      <div class="item">
        <span>性别：</span>
        <el-select v-model="docotrInfo.gender" placeholder="请输入姓名" :disabled="!isEdit">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </div>
      <div class="item">
        <span>职称：</span>
        <el-select v-model="docotrInfo.position" placeholder="请输入姓名" :disabled="!isEdit">
          <el-option label="教授" value="教授"></el-option>
          <el-option label="副教授" value="副教授"></el-option>
          <el-option label="主治医师" value="主治医师"></el-option>
          <el-option label="医师" value="医师"></el-option>
        </el-select>
      </div>
      <div class="item">
        <span>科室：</span>
        <el-select v-model="docotrInfo.section" placeholder="请输入姓名" :disabled="!isEdit">
          <el-option label="胸外科" value="胸外科"></el-option>
          <el-option label="耳鼻喉科" value="耳鼻喉科"></el-option>
          <el-option label="儿科" value="儿科"></el-option>
          <el-option label="牙科" value="牙科"></el-option>
          <el-option label="皮肤科" value="皮肤科"></el-option>
        </el-select>
      </div>
      <div class="item specialLine">
        <span>擅长方向：</span>
        <el-input maxlength="30" show-word-limit type="textarea" v-model="docotrInfo.specialLine" placeholder="请输入姓名"
          :disabled="!isEdit" :rows="3"></el-input>
      </div>
      <el-button v-if="!isEdit" @click="isEdit = true" type="primary">编辑</el-button>
      <el-button v-if="isEdit" @click="isEdit = false" type="primary">保存</el-button>
    </div>
    <div class="rightBox">
      <span>头像：</span>
      <el-avatar :size="130" icon="el-icon-user-solid"></el-avatar>
      <div class="uploadBtn">
        <el-button type="info" plain><i class="el-icon-upload2"></i>上传头像</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false,
      docotrInfo: {
        name: '张三',
        age: 45,
        gender: '男',
        section: '内科',
        specialLine: '心脏病,高血压,低血糖',
        position: '教授'
      }
    }
  },
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
    .uploadBtn{
      margin: -140px 0 0 55px;
      i{
        margin-right: 3px;
      }
    }
  }
}</style>