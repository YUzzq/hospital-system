<template>
    <div class="outBox">
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
        <div v-if="isPaid" class="paidMasking">
            <div class="paidBox">
                <div class="paidTitle">支付(精简版)</div>
                <el-button @click="cancelPaid" type="danger">取消支付</el-button>
                <el-button @click="paid" type="primary">支付</el-button>
            </div>
        </div>
        <div class="headerBox">
            <div class="filterInput">
                <span>选择日期：</span>
                <el-date-picker v-model="chooseDate" placeholder="请选择日期" :picker-options="pickerOptions"></el-date-picker>
                <span>选择科室：</span>
                <el-select v-model="section" placeholder="请选择科室">
                    <el-option v-for="item in sections" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
                <span>选择挂号种类：</span>
                <el-select v-model="doctorType" placeholder="请选择挂号种类">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="普通号" value="normal"></el-option>
                    <el-option label="专家号" value="specialist"></el-option>
                </el-select>
            </div>
            <el-input class="seacherInput" v-model="searchDoctor" placeholder="搜索医生"
                prefix-icon="el-icon-search"></el-input>
        </div>
        <div class="mainBox">
            <div class="chooseBox">
                <div v-if="this.filterDoctorList.length == 0" class="nullDoctorTip">
                    <span>暂无医生信息</span>
                </div>
                <div v-for="doctor in filterDoctorList" :key="doctor.id" class="item" @click="openDoctorDetail(doctor.id)">
                    <div class="leftBox">
                        <el-avatar :size="80" icon="el-icon-user-solid"></el-avatar>
                        <span class="name">{{ doctor.name }}</span>
                        <div class="sectionAndPosition">
                            <span>{{ doctor.section }}</span>
                            <span class="division"></span>
                            <span>{{ doctor.position }}</span>
                        </div>
                    </div>
                    <div class="rightBox">
                        <div>
                            <div class="gender">
                                <span class="name">性别：</span>
                                <span class="content">{{ doctor.gender }}</span>
                            </div>
                            <div class="specialLine">
                                <span class="name">擅长：</span>
                                <span class="content">{{ doctor.specializedField }}</span>
                            </div>
                        </div>
                        <div class="btn">
                            <el-button size="small" type="primary">预约</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <transition name="collapse">
                <div v-if="choosingDoctor.id" class="detailInfo">
                    <div class="closeBox"><a @click="closeDetaileBox" class="el-icon-close"></a></div>
                    <div class="infoBox">
                        <div class="upBox">
                            <el-avatar :size="80" icon="el-icon-user-solid"></el-avatar>
                            <span class="name">{{ choosingDoctor.name }}</span>
                            <div class="sectionAndPosition">
                                <span>{{ choosingDoctor.section }}</span>
                                <span class="division"></span>
                                <span>{{ choosingDoctor.position }}</span>
                            </div>
                        </div>
                        <div class="downBox">
                            <div class="gender">
                                <span class="name">性别：</span>
                                <span class="content">{{ choosingDoctor.gender }}</span>
                            </div>
                            <div class="specialLine">
                                <span class="name">擅长：</span>
                                <span class="content">{{ choosingDoctor.specializedField }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="registerBox">
                        <div class="chooseRegister">
                            <span class="registerTitle">挂号种类：</span>
                            <el-select @change="removeTime" v-model="choosingType" placeholder="请选择挂号种类">
                                <el-option v-for="item in doctorDetail.registrationTypes" :key="item.id" :value="item"
                                    :label="item.registrationName">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="chooseTime">
                            <div class=" timeTitle">选择时间段：</div>
                            <div class="row">
                                <el-radio :disabled="choosingType.estimatedTime > doctorDetail.nineTen"
                                    v-model="choosingTime" label="09:00-10:00" value='9-10' border></el-radio>
                                <el-radio :disabled="choosingType.estimatedTime > doctorDetail.tenEleven"
                                    v-model="choosingTime" label="10:00-11:00" value='10-11' border></el-radio>
                            </div>
                            <div class="row">
                                <el-radio :disabled="choosingType.estimatedTime > doctorDetail.elevenTwelve"
                                    v-model="choosingTime" label="11:00-12:00" value='11-12' border></el-radio>
                                <el-radio :disabled="choosingType.estimatedTime > doctorDetail.fourteenFifteen"
                                    v-model="choosingTime" label="14:00-15:00" value='14-15' border></el-radio>
                            </div>
                            <div class="row">
                                <el-radio :disabled="choosingType.estimatedTime > doctorDetail.fifteenSixteen"
                                    v-model="choosingTime" label="15:00-16:00" value='15-16' border></el-radio>
                                <el-radio :disabled="choosingType.estimatedTime > doctorDetail.sixteenSeventeen"
                                    v-model="choosingTime" label="16:00-17:00" value='15-17' border></el-radio>
                            </div>
                        </div>
                        <div class="submitBtn">
                            <el-button @click="closeDetaileBox" type="danger">取消</el-button>
                            <el-button @click='submitRegister' type="primary">预约</el-button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import http from '@/utils/request'
export default {
    data() {
        return {
            //日期选择器配置
            pickerOptions: {
                firstDayOfWeek: 1,
                //设置禁用以前及七天后的日期
                disabledDate(date) {
                    //获取当前日期
                    const nowTime = new Date()
                    //获取往后一个星期的日期
                    const afterOneWeek = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() + 7)
                    //判断获取时间是否在目标范围内
                    if (date < afterOneWeek && nowTime - date < 3600 * 1000 * 24) {
                        return false
                    }
                    return true
                }
            },
            //医生筛选条件
            section: '全部',
            chooseDate: new Date(),
            doctorType: '全部',
            searchDoctor: '',
            isAccountEdit: false,
            isPaid: false,
            //医生名单
            // doctorList: [
            //     { name: '张三', gender: '男', section: '内科', position: '教授', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '1' },
            //     { name: '李四', gender: '女', section: '外科', position: '副教授', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '2' },
            //     { name: '王五', gender: '女', section: '内科', position: '主任医师', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '3' },
            //     { name: '赵六', gender: '男', section: '外科', position: '医师', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '4' },
            //     { name: '孙七', gender: '男', section: '内科', position: '医师', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '5' },
            //     { name: '周八', gender: '女', section: '外科', position: '主任医师', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '6' },
            //     { name: '吴九', gender: '男', section: '内科', position: '教授', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '7' },
            //     { name: '郑十', gender: '女', section: '外科', position: '医师', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '8' },
            //     { name: '郑十', gender: '女', section: '外科', position: '医师', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '8' },
            //     { name: '郑十', gender: '女', section: '外科', position: '医师', specialLine: '心脏病、头痛与卒中、风湿骨痛、高血压、高血脂、高血糖', id: '8' },
            // ],
            doctorList: [],
            //科室名单
            sections: [
                { name: '全部', id: '16' },
                { name: '内科', id: '1' },
                { name: '外科', id: '2' },
                { name: '妇产科', id: '3' },
                { name: '儿科', id: '4' },
                { name: '皮肤科', id: '5' },
                { name: '耳鼻喉科', id: '6' },
                { name: '眼科', id: '7' },
                { name: '口腔科', id: '8' },
                { name: '中医科', id: '9' },
                { name: '肿瘤科', id: '10' },
                { name: '骨科', id: '11' },
                { name: '精神科', id: '12' },
                { name: '传染科', id: '13' },
                { name: '急诊科', id: '14' },
                { name: '康复科', id: '15' },
            ],
            //选中的医生
            choosingDoctor: {},
            //选中医生每日的的详细信息
            allDoctorDetail: [],
            //选中医生的挂号种类
            choosingType: {},
            choosingTime: ''

        }
    },
    computed: {
        //筛选后的医生列表
        filterDoctorList() {
            let list = this.doctorList
            if (this.section != '' && this.section != '全部') {
                list = list.filter(item => item.section == this.section)
            }
            if (this.doctorType == 'normal') {
                list = list.filter(item => item.position == '主任医师' || item.position == '医师')
            } else if (this.doctorType == 'specialist') {
                list = list.filter(item => item.position == '教授' || item.position == '副教授')
            }
            if (this.searchDoctor != '') {
                list = list.filter(item => item.name.indexOf(this.searchDoctor) != -1)
            }
            return list
        },
        //医生在选中日期的详细信息
        doctorDetail() {
            let info = {}
            this.allDoctorDetail.forEach(item => {
                if (item.date == this.formatDate2(this.chooseDate)) {
                    info = item
                }
            })
            return info
        },
    },
    watch: {
        //监听选中的日期
        chooseDate: {
            //获取选中日期的医生信息
            immediate: true,
            handler() {
                http({
                    url: '/patient/registration/check',
                    method: 'post',
                    data: {
                        date: this.chooseDate
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            this.doctorList = Object.assign([], res.data.data)
                        }
                    })
                    .catch(err => {
                        this.$message({
                            type: 'error',
                            message: '获取医生信息失败'
                        })
                    })
            },

        }
    },
    methods: {
        //取消支付
        cancelPaid() {
            this.isPaid = false
        },
        //支付
        paid() {
            //发送请求
            http({
                url: '/patient/confirmPayment',
                method: 'post',
                data: {
                    section: this.choosingDoctor.section,
                    registrationTypeId: this.choosingType.id,
                    doctorId: this.choosingDoctor.id,
                    date: this.formatDate2(this.chooseDate),
                    choiceTime: this.choosingTime
                }
            })
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('支付成功')
                        this.isPaid = false
                    }
                })
            this.isPaid = false
        },
        //修改类别时清空时间
        removeTime() {
            this.choosingTime = ''
        },
        //将日期转为一般格式（年月日）
        formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "年" + mymonth + "月" + myweekday + "日");
        },
        //将日期修改为一般格式（-）
        formatDate2(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        },
        //获取选中的挂号种类
        getChoosingType(type) {
            this.choosingType = type
        },
        //关闭医生详情框
        closeDetaileBox() {
            this.choosingDoctor = {}
        },
        //打开医生详情框
        openDoctorDetail(id) {
            this.choosingDoctor = this.filterDoctorList.find(item => item.id == id)
            //获取选中的医生信息
            http({
                url: `/patient/choice/${this.choosingDoctor.id}`,
                method: 'get'
            })
                .then(res => {
                    if (res.data.code == 200) {
                        console.log(res.data.data);
                        this.allDoctorDetail = Object.assign([], res.data.data)
                    }
                })

        },
        //提交挂号
        submitRegister() {
            if (this.choosingType == '') {
                this.$message({
                    message: '请选择挂号种类',
                    type: 'warning'
                })
                return
            }
            if (this.choosingTime == '') {
                this.$message({
                    message: '请选择挂号时间段',
                    type: 'warning'
                })
                return
            }
            //发送请求
            http({
                url: '/patient/choice/time',
                method: 'post',
                data: {
                    section: this.choosingDoctor.section,
                    registrationTypeId: this.choosingType.id,
                    doctorId: this.choosingDoctor.id,
                    date: this.formatDate2(this.chooseDate),
                    choiceTime: this.choosingTime
                }
            })
                .then(res => {
                    if (res.data.code = 200) {
                        this.$message.success('提交成功，请支付')
                        this.isPaid = true
                    }
                })
        },
        //取消订单
        cancelOrder() {
            if (confirm('确认取消订单吗？')) {
                http({
                    url: '/patient/cancelPayment',
                    method: 'post',
                    data: {
                        section: this.choosingDoctor.section,
                        registrationTypeId: this.choosingType.id,
                        doctorId: this.choosingDoctor.id,
                        date: this.formatDate2(this.chooseDate),
                        choiceTime: this.choosingTime
                    }
                }).then(res => {
                    console.log(res)
                    if (res.data.code == 200) {
                        this.$message({
                            message: '取消订单成功',
                            type: 'success'
                        })
                        this.historyInfo[0].registrationStatus = 'canceled'
                    }
                })
            }
        }

    },
    mounted() {
        //绑定事件
        this.$bus.$on('showPaid', this.paid)
        this.$bus.$on('showCancelOrder', this.cancelOrder)
    }
}
</script>

<style scoped lang="less">
.collapse-enter,
.collapse-leave-to {
    transform: translateX(100%);
}

.collapse-enter-active,
.collapse-leave-active {
    transition: all 0.3s;
}

.collapse-enter-to,
.collapse-leave {
    transform: translateX(0);
}

.outBox {
    height: 100%;

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

    .paidMasking {
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

        .paidBox {
            width: 360px;
            height: 200px;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            font-size: 20px;

            .paidTitle {
                width: 100%;
                font-size: 25px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
            }

            .el-button {
                width: 100px;
                margin: 0 30px;
            }
        }
    }

    .headerBox {
        width: 100%;
        display: flex;
        flex: auto;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        background-color: #fff;

        .filterInput {
            display: flex;
            align-items: center;

            .el-date-picker {
                width: 200px;
            }

            .el-select {
                width: 200px;
                margin-right: 20px;
            }
        }

        .el-input {
            width: 200px;
            margin-right: 20px;
        }
    }

    .mainBox {
        margin-top: 20px;
        display: flex;
        height: 90%;

        .chooseBox {
            flex: 1 1 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            height: 100%;
            padding-left: 2px;
            overflow: auto;

            .item {
                background-color: #fff;
                box-shadow: 0 0 2px 2px #eee;
                border-radius: 10px;
                width: 313px;
                height: 180px;
                margin-right: 1%;
                margin-top: 1%;
                display: flex;
                justify-content: space-between;
                padding: 1%;
                transition: all, 0.4s;

                &:hover {
                    box-shadow: 0 0 2px 2px #409EFF;
                }

                .leftBox {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;

                    .el-avatar {
                        font-size: 45px;
                        background-color: #409EFF;
                    }

                    .name {
                        font-size: 20px;
                        font-weight: bold;
                    }

                    .sectionAndPosition {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-items: center;
                        width: 80%;

                        .division {
                            width: 1em;
                        }

                        span {
                            font-size: 13px;
                            color: #777;
                        }

                    }
                }

                .rightBox {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .gender {
                        margin-bottom: 20px;
                    }

                    .name {
                        font-size: 15px;
                        font-weight: bold;
                        color: #777;
                    }

                    .content {
                        font-size: 14px;
                        color: #777;
                    }

                    .btn {
                        width: 100%;
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }

            .nullDoctorTip {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    font-size: 30px;
                    color: #aaa;
                }
            }
        }

        .detailInfo {
            padding: 10px;
            background-color: #fff;
            border-radius: 10px;
            width: 35%;

            .closeBox {
                width: 100%;

                a {
                    font-size: 25px;
                    float: right;

                    &:hover {
                        background-color: #F56C6C;
                        color: #fff;
                    }
                }
            }

            .infoBox {
                height: 50%;

                .upBox {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    height: 50%;

                    .name {
                        font-size: 20px;
                        font-weight: bold;
                    }

                    .sectionAndPosition {
                        display: flex;
                        justify-content: center;
                        width: 100%;

                        span {
                            font-size: 14px;
                            color: #777;
                        }

                        .division {
                            width: 1.5em;
                        }
                    }
                }

                .downBox {
                    padding: 0 10%;
                    margin-top: 5%;
                    width: 80%;

                    .gender {
                        margin-bottom: 10px;
                    }

                    .name {
                        font-weight: bold;
                        color: #777;
                        font-size: 16px;
                    }

                    .content {
                        font-size: 15px;
                        color: #555;
                    }
                }
            }

            .registerBox {
                height: 50%;

                .chooseRegister {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;

                    .registerTitle {
                        font-weight: bold;
                        color: #555;

                    }

                    span {
                        font-size: 16px;
                    }

                    .el-select {
                        width: 200px;
                        margin-left: 10px;
                    }
                }

                .chooseTime {
                    margin-bottom: 20px;

                    .timeTitle {
                        margin-bottom: 20px;
                        font-weight: bold;
                        color: #555;
                    }

                    .row {
                        width: 100%;
                        margin: 0 auto;

                        .el-radio {
                            margin: 0 0 10px 30px;
                        }
                    }
                }

                .submitBtn {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;

                    .el-button {
                        width: 100px;
                    }
                }
            }
        }
    }
}
</style>