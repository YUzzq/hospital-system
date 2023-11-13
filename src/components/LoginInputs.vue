<template>
    <div class="outBox">
        <div class="loginTitle">{{ loginInput }}</div>
        <el-input class="loginInput" v-model.lazy.trim="userName" placeholder="用户名" clearable></el-input>
        <el-input class="loginInput" placeholder="密码" v-model.trim.lazy="password" show-password></el-input>
        <el-button @click="login" class="loginBtn" :class="isLoading" type="primary" round plain>登录</el-button>
        <el-link @click="showBtns" class="bottomBtn">返回</el-link>
        <el-link @click="showRegister" v-show="type == 'patient'" class="bottomBtn">注册</el-link>
    </div>
</template>

<script>
import router from '@/router'
import http from '@/utils/request'
export default {
    data() {
        return {
            userName: '',
            password: '',
            isLoading: ''
        }
    },
    props: ['type'],
    computed: {
        loginInput() {
            if (this.type == 'patient') {
                return '患者登录'
            } else if (this.type == 'doctor') {
                return '医生登录'
            }
        }
    },
    methods: {
        //返回显示选择按钮
        showBtns() {
            this.$bus.$emit('showBtns')
        },
        //进入注册页面
        showRegister() {
            this.$bus.$emit('showRegister')
        },
        login() {
            if (this.userName == '' || this.password == '') {
                this.$message.error('用户名或密码不能为空')
                return
            }
            this.isLoading = 'loading'
            if (this.type == 'patient') {
                //发送登录请求，并开启loading动画
                http({
                    url: '/login',
                    method: 'post',
                    data: {
                        username: this.userName,
                        password: this.password
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        //登录成功，跳转到患者主页
                        this.$bus.$emit('showPatientMain')
                        this.isLoading = ''
                        //将token存入localStorage
                        localStorage.setItem('token', res.data.data.token)
                    } else {
                        //登录失败，提示错误信息
                        this.$message.error(res.data.msg)
                        this.isLoading = ''
                    }
                }).catch(err => {
                    console.log(err)
                })

            } else if (this.type == 'doctor') {
                //发送登录请求，并开启loading动画
                http({
                    url: '/login',
                    method: 'post',
                    data: {
                        username: this.userName,
                        password: this.password
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            //登录成功，跳转到医生主页
                            this.$bus.$emit('showDoctorMain')
                            this.isLoading = ''
                            //将token存入localStorage
                            localStorage.setItem('token', res.data.data.token)
                        } else {
                            //登录失败，提示错误信息
                            this.$message.error(res.data.msg)
                            this.isLoading = ''
                        }
                    }).catch(err => {
                        console.log(err)
                    })
            }
        }
    }
}
</script>

<style scoped lang="less">
.outBox {
    bottom: 0;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #ccc;
    width: 300px;
    height: auto;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .loginTitle {
        font-size: 20px;
        text-align: center;
        padding: 10px;
        color: #000;
    }

    .loginInput {
        display: block;
        width: 220px;
        margin: 15px auto;
    }

    .loginBtn {
        width: 220px;
        display: block;
        margin: 10px auto;
    }

    // loading动画
    .loading::after {
        content: '中';
        animation: loading 2.2s infinite;
    }

    @keyframes loading {
        0% {
            content: '中';
        }

        33% {
            content: '中.';
        }

        66% {
            content: '中..';
        }

        100% {
            content: '中...';
        }
    }

    .bottomBtn {
        margin: 0 20px;

        &:last-child {
            float: right;
        }
    }
}
</style>