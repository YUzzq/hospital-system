import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '../components/Login.vue'
import LoginInputs from '../components/LoginInputs.vue'
import DoctorMain from '../components/doctor/DoctorMain.vue'
import PatientMain from '../components/patient/PatientMain.vue'
import DoctorInfo from '../components/doctor/DoctorInfo.vue'
import RegisterType from '../components/doctor/RegisterType.vue'
import WorkingInfo from '../components/doctor/WorkingInfo.vue'
import WorkingTem from '../components/doctor/WorkingTem.vue'
import WorkingRegister from '../components/doctor/WorkingRegister.vue'
import CheckPatientInfo from '../components/doctor/CheckPatientInfo.vue'
import PatientRegister from '../components/patient/PatientRegister.vue'
import HistoryRegister from '../components/patient/HistoryRegister.vue'
import HistoryOrder from '../components/patient/HistoryOrder.vue'

Vue.use(VueRouter)
const router = new VueRouter({
    routes: [
        {
            name: 'login',
            path: '/',
            component: Login,
            children: [
                {
                    name: 'loginInputs',
                    path: 'loginInputs',
                    component: LoginInputs
                }
            ]
        },
        {
            name: 'doctorMain',
            path: '/doctorMain',
            component: DoctorMain,
            redirect: '/doctorMain/WorkingRegister',
            children: [
                {
                    name: 'doctorInfo',
                    path: 'doctorInfo',
                    component: DoctorInfo
                },
                {
                    name: 'registerType',
                    path: 'registerType',
                    component: RegisterType
                },
                {
                    name: 'workingInfo',
                    path: 'workingInfo',
                    component: WorkingInfo
                },
                {
                    name: 'workingTem',
                    path: 'workingTem',
                    component: WorkingTem
                },
                {
                    name: 'workingRegister',
                    path: 'workingRegister',
                    component: WorkingRegister
                },
                {
                    name: 'checkPatientInfo',
                    path: 'checkPatientInfo',
                    component: CheckPatientInfo
                }
            ]
        },
        {
            name: 'patientMain',
            path: '/patientMain',
            component: PatientMain,
            redirect: '/patientMain/patientRegister',
            children:[
                {
                    name: 'patientRegister',
                    path: 'patientRegister',
                    component: PatientRegister
                },
                {
                    name: 'historyRegister',
                    path: 'historyRegister',
                    component: HistoryRegister
                },
                {
                    name: 'historyOrder',
                    path: 'historyOrder',
                    component: HistoryOrder
                }
            ]
        }
    ]
})
//设置路由守卫,防止未登录用户访问其他页面
// router.beforeEach((to, from, next) => {
//     if (to.path === '/') {
//         next()
//     } else {
//         let token = localStorage.getItem('Authorization')
//         if (token === null || token === '') {
//             next('/')
//         } else {
//             next()
//         }
//     }
// })

export default router