<template>
    <el-container>
        <el-header :height="60 + 'px'" :style="{ padding: 0 }">
            <patient-nav></patient-nav>
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
                            <div @click="logout">退出登录</div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span class="division">|</span>
                <div class="infoBox">
                    <el-avatar shape="square" icon="el-icon-user-solid" :size="25"></el-avatar>
                    <span>你好</span>
                    <span>{{ patientInfo.name }}</span>
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
            <router-view></router-view>
        </el-main>
    </el-container>
</template>
  
<script>
import http from '@/utils/request'
import patientNav from './PatientNav.vue'
export default {
    data() {
        return {
            isAccountEdit: false,
            patientInfo: {},
        }
    },
    components: { patientNav },
    methods: {
        //退出登录
        logout() {
            if (confirm('确定退出登录吗？')) {
                this.$bus.$emit('logout')
                //清除token
                localStorage.removeItem('token')
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
        //跳转到挂号页面
        showPatientRegister() {
            if (this.$route.name == 'patientRegister') return
            this.$router.replace({
                name: 'patientRegister',
            })
        },
        //跳转到历史订单页面
        showHistoryOrder() {
            if (this.$route.name == 'historyOrder') return
            this.$router.replace({
                name: 'historyOrder',
            })
        },
        //跳转到历史挂号页面
        showHistoryRegister() {
            if (this.$route.name == 'historyRegister') return
            this.$router.replace({
                name: 'historyRegister',
            })
        },
    },
    mounted() {
        //获取患者信息
        http({
            url: '/patient/queryInfo',
            method: 'get'
        })
            .then(res => {
                console.log(res.data.data);
                this.patientInfo = Object.assign({}, res.data.data)
            })
        //监听事件
        this.$bus.$on('showPatientRegister', this.showPatientRegister)
        this.$bus.$on('showHistoryOrder', this.showHistoryOrder)
        this.$bus.$on('showHistoryRegister', this.showHistoryRegister)
    },
    beforeDestroy() {
        //取消监听事件
        this.$bus.$off('showPatientRegister', this.showPatientRegister)
        this.$bus.$off('showHistoryOrder', this.showHistoryOrder)
        this.$bus.$off('showHistoryRegister', this.showHistoryRegister)
    }
}
</script>
  
<style scoped lang="less">
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

.el-container {
    height: 100vh;

    .el-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        position: relative;

        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 1px;
            position: absolute;
            background-color: #e6e6e6;
            left: 0px;
            bottom: 0px;
        }

        .headerInfo {
            height: 100%;
            padding: 0 5%;


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

        .el-main {
            width: 100%;
            height: 90%;
            overflow: auto;
        }
    }
}
</style>