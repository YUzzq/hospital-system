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
            this.isLoading = 'loading'
            if (this.type == 'patient') {
                //模拟发送请求时的loading动画
                setTimeout(() => {
                    this.isLoading = ''
                    this.$bus.$emit('showPatientMain')
                }, 2000);
            }else if(this.type == 'doctor'){
                setTimeout(() => {
                    this.isLoading = ''
                    this.$bus.$emit('showDoctorMain')
                }, 2000);
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
}</style>