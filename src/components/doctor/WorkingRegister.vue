<template>
    <div class="outBox">
        <div class="headerBox">
            <div class="title">
                <div class="title">挂号信息管理</div>
            </div>
            <div class="chooseDate">
                <span class="dateTitle">查看日期：</span>
                <el-date-picker v-model="chooseDate" :align="'right'" type="date" placeholder="选择日期"
                    :picker-options="pickerOptions" :style="{
                        width: '150px'
                    }">
                </el-date-picker>
            </div>
        </div>
        <div class="mainBox">
            <div class="dayBox">
                <div class="dayTitle"><i class="el-icon-sunrise-1"></i>上午</div>
                <div class="dayHeader">
                    <span>时段</span>
                    <span>状态</span>
                </div>
                <ul class="workingItems">
                    <li v-for="(item, index) in registerInfo.slice(0, 3)" :key="index" class="workingItem">
                        <div @click="openPatientInfo(item)" class="aboutWorking">
                            <span>{{ turnTime(item.appointmentNumber) }}</span>
                            <div v-if="!item.isFold" class="tip">点击查看该时段患者信息</div>
                            <div v-if="item.isFold" class="tip">点击关闭</div>
                            <span :style="{ color: stateColor(item.patientAppiontmentPationInfos) }">{{
                                turnState(item.patientAppiontmentPationInfos) }}</span>
                        </div>
                        <el-collapse-transition>
                            <div v-if="item.isFold" class="aboutPatient">
                                <div v-if="item.patientAppiontmentPationInfos[0]" class="patientItem patientItemHeader">
                                    <span class="span">姓名</span>
                                    <span class="span">年龄</span>
                                    <span class="span">性别</span>
                                    <span class="span">挂号类型</span>
                                    <span class="span">操作</span>
                                    <span class="span">状态</span>
                                </div>
                                <div v-if="!item.patientAppiontmentPationInfos[0]" class="patientItem nullPatient">
                                    <span class="span">暂无患者信息</span>
                                </div>
                                <div v-for="(patient, index) in item.patientAppiontmentPationInfos " :key="index"
                                    class="patientItem">
                                    <span class="span">{{ patient.name }}</span>
                                    <span class="span">{{ patient.age + '岁' }}</span>
                                    <span class="span">{{ patient.gender }}</span>
                                    <span class="span"><el-tag>{{ patient.registrationName }}</el-tag></span>
                                    <span class="span" @click="showCheckPatientInfo(patient)"><el-link>详情</el-link></span>
                                    <span class="span"><el-tag :type="patientStateColor(patient.appointmentStatus)">{{
                                        patientState(patient.appointmentStatus) }}</el-tag></span>
                                </div>
                            </div>
                        </el-collapse-transition>
                    </li>
                </ul>
            </div>
            <div class="dayBox">
                <div class="dayTitle"><i class="el-icon-sunset"></i>下午</div>
                <div class="dayHeader">
                    <span>时段</span>
                    <span>状态</span>
                </div>
                <ul class="workingItems">
                    <li v-for="(item, index) in registerInfo.slice(3, 6)" :key="index" class="workingItem">
                        <div @click="openPatientInfo(item)" class="aboutWorking">
                            <span>{{ turnTime(item.appointmentNumber) }}</span>
                            <div v-if="!item.isFold" class="tip">点击查看该时段患者信息</div>
                            <div v-if="item.isFold" class="tip">点击关闭</div>
                            <span :style="{ color: stateColor(item.patientAppiontmentPationInfos) }">{{
                                turnState(item.patientAppiontmentPationInfos) }}</span>
                        </div>
                        <el-collapse-transition>
                            <div v-if="item.isFold" class="aboutPatient">
                                <div v-if="item.patientAppiontmentPationInfos[0]" class="patientItem patientItemHeader">
                                    <span class="span">姓名</span>
                                    <span class="span">年龄</span>
                                    <span class="span">性别</span>
                                    <span class="span">挂号类型</span>
                                    <span class="span">操作</span>
                                    <span class="span">状态</span>
                                </div>
                                <div v-if="!item.patientAppiontmentPationInfos[0]" class="patientItem nullPatient">
                                    <span>暂无患者信息</span>
                                </div>
                                <div v-for="(patient, index) in item.patientAppiontmentPationInfos " :key="index"
                                    class="patientItem">
                                    <span class="span">{{ patient.name }}</span>
                                    <span class="span">{{ patient.age + '岁' }}</span>
                                    <span class="span">{{ patient.gender }}</span>
                                    <span class="span"><el-tag size="mini">{{ patient.registrationName }}</el-tag></span>
                                    <span class="span"><el-link @click="showCheckPatientInfo(patient)">详情</el-link></span>
                                    <span class="span"><el-tag :type="patientStateColor(patient.appointmentStatus)">{{
                                        patientState(patient.appointmentStatus) }}</el-tag></span>
                                </div>
                            </div>
                        </el-collapse-transition>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
    
<script>
import http from '@/utils/request.js'
export default {
    data() {
        return {
            pickerOptions: {
                firstDayOfWeek: 1,
                //设置禁用2个月以外的日期
                disabledDate(date) {
                    //获取当前日期
                    const nowTime = new Date()
                    //获取往前第二个月的日期
                    const beforeTwoMonth = new Date(nowTime.getFullYear(), nowTime.getMonth() - 1)
                    //获取往后第二个月的日期
                    const afterTwoMonth = new Date(nowTime.getFullYear(), nowTime.getMonth() + 2)
                    //判断获取时间是否在目标范围内
                    if (date > beforeTwoMonth && date < afterTwoMonth) {
                        return false
                    }
                    return true
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            chooseDate: new Date(),
            registerInfo: [

            ],
        }
    },
    watch: {
        chooseDate: {
            immediate: true,
            //请求数据
            handler() {
                console.log(this.formatDate2(this.chooseDate));
                http({
                    url: '/doctor/registration/check',
                    method: 'get',
                    params: {
                        date: this.formatDate2(this.chooseDate)
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            console.log(res.data.data);
                        }
                        this.registerInfo = Object.assign([], res.data.data)
                        //为每个时段添加是否展开的属性,并为每个患者添加日期属性
                        this.registerInfo.forEach(item => {
                            this.$set(item, 'isFold', false)
                            item.patientAppiontmentPationInfos.forEach(patient => {
                                this.$set(patient, 'registerDate', item.appointmentNumber)
                            })
                        })
                    })
                    .catch(err => {
                        this.$message({
                            type: 'error',
                            message: '获取数据失败'
                        })
                    })
            }
        }
    },
    methods: {
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
        //跳转到患者信息页面
        showCheckPatientInfo(item) {
            this.$bus.$emit('showCheckPatientInfo',item)
        },
        //通过时段患者数量显示状态
        turnState(patientArr) {
            if (!patientArr) return
            if (!patientArr[0])
                return '暂无预约'
            return '已有预约'
        },
        //设置状态的字体颜色
        stateColor(patientArr) {
            if (!patientArr) return
            if (!patientArr[0])
                return '#909399'
            return '#67C23A'
        },
        //提取具体日期中的时段
        turnTime(date) {
            if (date) {
                let list = date.split(' ')
                return list[1]
            }

        },
        //设置患者状态的颜色
        patientStateColor(state) {
            if (state == 'waiting')
                return 'info'
            if (state == 'visited')
                return 'success'
            if (state == 'noVisited')
                return 'danger'
        },
        //设置患者状态的文字
        patientState(state) {
            if (state == 'waiting')
                return '待就诊'
            if (state == 'visited')
                return '已就诊'
            if (state == 'noVisited')
                return '已失约'
        },
        //展开患者信息
        openPatientInfo(item) {
            this.registerInfo.forEach(i => {
                if (i.appointmentNumber == item.appointmentNumber) {
                    i.isFold = !i.isFold
                } else {
                    i.isFold = false
                }
            })

        }
    },
    mounted() {
        //监听事件，展开患者信息
    }
}
</script>
    
<style scoped lang="less">
.outBox {
    width: 100%;
    height: 80vh;

    .headerBox {
        .title {
            font-size: 20px;
            font-weight: bold;
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

        .chooseBtns {
            .dateTitle {
                color: #444;
                font-weight: bold;
            }
        }
    }

    .mainBox {
        width: 100%;
        height: 78vh;
        overflow: auto;

        .dayBox {
            margin-bottom: 3%;

            .dayTitle {
                font-size: 20px;
                color: #409EFF;
                margin: 10px 0 10px 60px;

                i {
                    margin-right: 5px;
                }
            }

            .dayHeader {
                position: relative;
                height: 50px;

                span {
                    font-size: 16px;
                    font-weight: bold;
                    position: absolute;
                    top: 40%;

                    &:first-child {
                        left: 10%;
                        transform: translateX(-50%);
                    }

                    &:last-child {
                        right: 10%;
                        transform: translateX(50%);
                    }
                }
            }

            .workingItems {
                .workingItem {
                    margin-bottom: 5px;

                    .aboutWorking {
                        position: relative;
                        width: 100%;
                        border-radius: 5px;
                        background-color: #fff;
                        height: 60px;
                        transition: all 0.4s;

                        span {
                            font-size: 16px;
                            position: absolute;
                            top: 40%;

                            &:first-child {
                                left: 10%;
                                transform: translateX(-50%);
                            }

                            &:last-child {
                                right: 10%;
                                transform: translateX(50%);
                            }
                        }

                        .tip {
                            position: absolute;
                            top: 40%;
                            left: 50%;
                            transform: translateX(-50%);
                            color: #ccc;
                            opacity: 0;
                            transition: all, 0.4s;
                        }

                        &:hover,
                        &:hover .tip {
                            background-color: #eee;
                            opacity: 1;
                        }
                    }

                    .aboutPatient {
                        width: 90%;
                        margin: 0 5%;
                        overflow: hidden;

                        .patientItem {
                            background-color: #fff;
                            position: relative;
                            display: flex;
                            padding: 1% 8%;
                            justify-content: space-between;
                            align-items: center;
                            height: 30px;
                            font-size: 14px;

                            .span {
                                width: 16%;
                                display: flex;
                                justify-content: center;
                            }
                        }

                        .patientItemHeader {
                            font-size: 16px;
                            font-weight: 600;
                            color: #777;
                        }

                        .nullPatient {
                            span {
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                color: #909399;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>