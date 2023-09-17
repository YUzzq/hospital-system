<template>
    <div class="outBox">
        <div class="headerBox">
            <span class="title">排班信息</span>
            <div class="btns">
                <span class="dateTitle">查看日期：</span>
                <el-date-picker v-model="chooseDate" :align="'right'" type="date" placeholder="选择日期"
                    :picker-options="pickerOptions" :style="{
                        width: '150px'
                    }">
                </el-date-picker>
                <el-popover placement="right bottom" width="400" trigger="click">
                    <el-button @click="defaultCopyFrom" slot="reference" type="info">复制</el-button>
                    <div class="copyBox">
                        <div class="row">
                            <span>复制方式</span>
                            <el-select placeholder="选择复制方式" v-model="copyType">
                                <el-option label="按日复制" value="date"></el-option>
                                <el-option label="按周复制" value="week"></el-option>
                                <el-option label="按月复制" value="month"></el-option>
                            </el-select>
                        </div>
                        <div class="row">
                            <span>将</span>
                            <el-date-picker v-model="copyFrom" :align="'right'" :type="copyType" placeholder="选择日期"
                                :picker-options="pickerOptions" :style="{
                                    width: '150px'
                                }">
                            </el-date-picker>
                        </div>
                        <div class="row">
                            <div class="copyToBox">
                                <span>复制到</span>
                                <el-date-picker v-model="copyTo" :align="'right'" :type="copyType" placeholder="选择日期"
                                    :picker-options="pickerOptions" :style="{
                                        width: '150px'
                                    }">
                                </el-date-picker>
                            </div>
                            <el-button type="primary" @click="confirmCopy">确认复制</el-button>
                        </div>
                    </div>
                </el-popover>
                <el-popover placement="bottom left" width="400" trigger="click">
                    <el-button type="primary" slot="reference">使用模板</el-button>
                    <div class="temBox">
                        <el-select placeholder="选择模板" v-model="usingTem">
                            <el-option v-for="(item, index) in workingTems" :key="index" :label="item.templateName"
                                :value="item.id"></el-option>
                        </el-select>
                        <el-button type="primary" @click="confirmTem">确认使用</el-button>
                    </div>
                </el-popover>
                <el-button @click="registerDeliver" type="success">手动放号</el-button>
            </div>
        </div>
        <div class="mainBox">
            <div @click="EditWorkingInfo(item)" :class="isActiveStyle(item)" class="workingInfoBox"
                v-for="item in showWorkingInfos" :key="item.id">
                <div class="workingTitle"><span>{{ item.data }}</span>
                    <el-button @click="confirmEdit(item)" v-if="item.isEdit" type="primary">提交</el-button>
                </div>
                <div class="registerTypes">
                    <div>挂号类型：</div>
                    <div class="tags">
                        <el-tag :type="tagColor(index)" effect="dark" size="small"
                            v-for="(type, index) in item.registrationTypes" :key="index">
                            {{ type.registrationName }}
                            <a v-if="item.isEdit" @click="delRegisterType(item.data, index)">×</a>
                        </el-tag>
                        <el-dropdown v-if="item.isEdit">
                            <i class="el-icon-plus el-icon--right"></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(type, index) in registerTypes" :key="index"><span
                                        @click="addRegisterType(item.data, index)">{{ type.registrationName
                                        }}</span></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="registerNum">
                    <div class="row">
                        <span>上午挂号数：</span>
                        <el-input-number :min="0" :disabled="!item.isEdit" size="small"
                            v-model="item.morningCheckNumber"></el-input-number>
                    </div>
                    <div class="row">
                        <span>下午挂号数：</span>
                        <el-input-number :min="0" :disabled="!item.isEdit" size="small"
                            v-model="item.afternoonCheckNumber"></el-input-number>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import http from '@/utils/request'
export default {
    data() {
        return {
            //设置日期选择器信息
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
            workingInfos: [],
            registerTypes: [],
            workingTems: [],
            copyType: 'date',
            copyFrom: '',
            copyTo: '',
            usingTem: ''
        };
    },
    computed: {
        //展示选择日期及往后一周的排班信息
        showWorkingInfos() {
            let arr = []
            arr = this.workingInfos.filter(item => {
                //获取医生排班日期的时间戳
                const workingTime = new Date(item.data).getTime()
                if (this.chooseDate.getTime() - workingTime < 3600 * 1000 * 24 && workingTime <= this.chooseDate.getTime() + 3600 * 1000 * 24 * 7) {
                    return item
                }
            })
            return arr
        }
    },
    methods: {
        //手动放号
        registerDeliver() {
            if (!confirm('确定放号吗？')) return
            http({
                url: '/doctor/registration/deliver',
                method: 'get',
            })
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('放号成功')
                    } else if (res.data.code == 500) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        //设置选中的排班信息的样式
        isActiveStyle(item) {
            if (item.isEdit) {
                return 'active'
            }
        },
        //编辑排班信息
        EditWorkingInfo(item) {
            //判断是否为近七天的排班信息，如果是则无法编辑
            if (new Date(item.data).getTime() < new Date().getTime()) {
                this.$message.error('无法修改过去的排班信息')
                return
            }
            // }else if(new Date(item.data).getTime() < new Date().getTime() + 3600 * 1000 * 24 * 7){
            //     this.$message.error('无法修改近七天的排班信息')
            //     return
            // }
            item.isEdit = true
            //将其他的编辑状态设为false
            this.workingInfos.forEach(info => {
                if (info.data != item.data) {
                    info.isEdit = false
                }
            })
        },
        //确认编辑排班信息
        confirmEdit(item) {
            http({
                url: '/doctor/schedule/set',
                method: 'post',
                data: item
            })
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('修改成功')
                    } else if (res.data.code == 500) {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(err => {
                    // this.$message.error(err.data.msg)
                })
            item.isEdit = false
        },
        //将日期转为一般格式（年月日）
        formatDate(date) {
            let myyear = date.getFullYear();
            let mymonth = date.getMonth() + 1;
            let myweekday = date.getDate();
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
            let myyear = date.getFullYear();
            let mymonth = date.getMonth() + 1;
            let myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        },
        //通过日期获取到今年该周的周数
        formatDateWeek(date) {
            const onejan = new Date(date.getFullYear(), 0, 1);
            const yearNum = date.getFullYear()
            const millisecsInDay = 86400000;
            let weekNum = Math.ceil(((date - onejan) / millisecsInDay + onejan.getDay() + 1) / 7);
            if (weekNum < 10) {
                weekNum = '0' + weekNum
            }
            return yearNum + ' 第 ' + weekNum + ' 周'
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
        delRegisterType(data, index) {
            this.workingInfos.forEach(item => {
                if (item.data == data) {
                    item.registrationTypes.splice(index, 1)
                }
            })
        },
        //添加挂号类别
        addRegisterType(data, index) {
            this.workingInfos.forEach(item => {
                if (item.data == data) {
                    item.registrationTypes.push(this.registerTypes[index])
                }
            })
        },
        //将默认被复制日期设为当前选择的日期
        defaultCopyFrom() {
            this.copyFrom = this.chooseDate
        },
        //确认复制操作
        confirmCopy() {
            //判断信息是否完整
            if (this.copyFrom == '' || this.copyTo == '') {
                this.$message.error('请填写完整信息')
                return
            }
            let copyFrom
            let copyTo
            if (this.copyType == 'week') {
                copyFrom = this.formatDateWeek(this.copyFrom)
                copyTo = this.formatDateWeek(this.copyTo)
            } else {
                copyFrom = this.formatDate2(this.copyFrom)
                copyTo = this.formatDate2(this.copyTo)
            }
            //判断复制方式，日，周，月
            if (this.copyType == 'date') {
                http({
                    url: '/doctor/schedule/copy/day',
                    method: 'post',
                    data: {
                        sourDay: copyFrom,
                        targetDay: copyTo
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('复制成功')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(err => {
                        // this.$message.error(err.data.msg)
                    })
            } else if (this.copyType == 'week') {
                http({
                    url: '/doctor/schedule/copy/week',
                    method: 'post',
                    data: {
                        sourWeekNumber: copyFrom,
                        targetWeekNumber: copyTo
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('复制成功')
                        }
                    })
                    .catch(err => {
                        // this.$message.error(err.data.msg)
                    })
            } else if (this.copyType == 'month') {
                http({
                    url: '/doctor/schedule/copy/month',
                    method: 'post',
                    data: {
                        sourMonthNumber: copyFrom,
                        targetMonthNumber: copyTo
                    }
                })
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('复制成功')
                        }
                    })
                    .catch(err => {
                        // this.$message.error(err.data.msg)
                    })
            }
        },
        //确认使用模板操作
        confirmTem() {
            http({
                url: '/doctor/schedule/template',
                method: 'post',
                data: {
                    date: this.chooseDate,
                    templateId: this.usingTem
                }
            })
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('使用成功')
                    } else if (res.data.code == 500) {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(err => {
                    // this.$message.error(err.data.msg)
                })
        }
    },
    mounted() {
        //请求排班信息
        http({
            url: '/doctor/schedule/query',
            method: 'get'
        })
            .then(res => {
                if (res.data.code == 200) {
                    console.log(res.data.data);
                    this.workingInfos = Object.assign([], res.data.data)
                    //为每日排班添加是否编辑的标志
                    this.workingInfos.forEach(item => {
                        this.$set(item, 'isEdit', false)
                    })
                } else {
                    this.$message.error(res.data.msg)
                }
            })
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
    }
};
</script>

<style scoped lang="less">
.outBox {
    width: 100%;
    height: 85vh;

    .headerBox {
        width: 96%;
        padding: 1% 2%;
        height: 54px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
            font-size: 20px;
            font-weight: bold;
            color: #444;
        }

        .btns {
            .dateTitle {
                color: #444;
                font-weight: bold;
            }

            .el-date-picker {
                width: 50px;
            }

            .copyBox {
                display: flex;
                flex-wrap: wrap;

                .row {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;

                    span {
                        width: 70px;
                        text-align: right;
                        font-size: 16px;
                        font-weight: bold;
                        margin-right: 20px;
                    }

                    .copyToBox {
                        display: flex;
                        align-items: center;
                    }

                    &:last-child {
                        justify-content: space-between;
                    }
                }


            }

            .temBox {
                display: flex;
                justify-content: space-between;
            }

            .el-button {
                margin-left: 10px;
            }
        }
    }

    .mainBox {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 90%;

        .active {
            box-shadow: 0 0 10px 5px #409eff;
        }

        .workingInfoBox {
            border-radius: 5px;
            width: 21%;
            height: 44%;
            margin: 1%;
            padding: 0.5% 1%;
            background-color: #eee;
            display: flex;
            flex-wrap: wrap;
            // box-shadow: 0 0 10px 5px #eee;
            transition: all, 0.4s;

            &:hover {
                box-shadow: 0 0 10px 5px #409eff;
            }

            .workingTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 20px;
                font-size: 16px;
                font-weight: bold;
                color: #444;
                margin-top: 20px;
            }

            .registerTypes {
                width: 100%;

                div {
                    margin-bottom: 5px;
                    font-size: 14px;
                    color: #444;
                }

                .tags {
                    height: 54px;
                    overflow: auto;

                    .el-tag {
                        margin-left: 5px;
                        margin-bottom: 3px;
                        color: #fff;

                        a {
                            font-size: 15px;

                            &:hover {
                                color: #f00;
                            }
                        }
                    }

                    .addBtn {}
                }
            }

            .registerNum {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                .row {
                    width: 100%;

                    span {
                        font-size: 14px;
                        color: #444;
                        font-weight: bolder;
                    }

                    .el-input-number {
                        width: 120px;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
}
</style>