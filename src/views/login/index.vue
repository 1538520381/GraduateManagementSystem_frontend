<template>
  <div id="login">
    <el-image class="background" :src="assets.background"></el-image>

    <el-tabs class="loginContainer" v-model="tabsActive" type="border-card">
      <el-tab-pane v-if="tabFlag === 0" label="学生管理员登录">
        <el-input class="input" v-model="loginForm.account" placeholder="请输入学号"
                  prefix-icon="el-icon-user"></el-input>
        <el-input class="input" v-model="loginForm.password" placeholder="请输入密码（初始密码为身份证后6位）"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-button class="textButton" type="text" @click="forgetPasswordTab">忘记密码</el-button>
        <el-button class="formButton" @click="studentAdminLogin">登录</el-button>
      </el-tab-pane>
      <el-tab-pane v-if="tabFlag === 0" label="超级管理员登录">
        <el-input class="input" v-model="loginForm.account" placeholder="请输入账号"
                  prefix-icon="el-icon-user"></el-input>
        <el-input class="input" v-model="loginForm.password" placeholder="请输入密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-button class="formButton" @click="adminLogin">登录</el-button>
      </el-tab-pane>
      <el-tab-pane v-if="tabFlag === 1" label="忘记密码">
        <el-input class="input" v-model="forgetPasswordForm.studentNumber" placeholder="请输入学号"
                  prefix-icon="el-icon-user"></el-input>
        <el-input class="input" v-model="forgetPasswordForm.idNumber" placeholder="请输入身份证号后六位"
                  prefix-icon="el-icon-s-management"></el-input>
        <el-input class="input" v-model="forgetPasswordForm.password" placeholder="请输入新密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-input class="input" v-model="forgetPasswordForm.passwordAgain" placeholder="请再次输入新密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-button class="textButton" type="text" @click="studentAdminLoginTab">返回</el-button>
        <el-button class="formButton" @click="forgetPassword">确定</el-button>
      </el-tab-pane>
      <el-tab-pane v-if="tabFlag === 2" label="首次登录修改密码">
        <el-input class="input" v-model="updatePasswordForm.password" placeholder="请输入密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-input class="input" v-model="updatePasswordForm.passwordAgain" placeholder="请再次输入密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-button class="formButton" @click="updatePassword">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import background from '@/assets/pictures/background.jpg'

import {adminLogin, adminUpdatePassword} from "@/apis/admin";

import {isEmpty} from "@/utils/common";
import {isPassword} from "@/utils/validate";
import {studentAdminLogin, studentForgetPassword, studentUpdatePassword} from "@/apis/student";

export default {
  name: 'Login',
  data() {
    return {
      assets: {
        background: background
      },

      loginForm: {},
      forgetPasswordForm: {},
      updatePasswordForm: {},

      tabsActive: '0',
      tabFlag: 0,
    }
  },
  created() {
    this.initLoginForm()
    this.initForgetPasswordForm()
    this.initUpdatePasswordForm()
  },
  methods: {
    initLoginForm() {
      this.loginForm = {
        account: null,
        password: null
      }
    },
    initForgetPasswordForm() {
      this.forgetPasswordForm = {
        studentNumber: null,
        idNumber: null,
        password: null,
        passwordAgain: null,
      }
    },
    initUpdatePasswordForm() {
      this.updatePasswordForm = {
        password: null,
        passwordAgain: null
      }
    },

    adminLogin() {
      if (isEmpty(this.loginForm.account) || isEmpty(this.loginForm.account.trim())) {
        this.$message.error("账号不能为空")
        return
      } else if (isEmpty(this.loginForm.password) || isEmpty(this.loginForm.password.trim())) {
        this.$message.error("密码不能为空")
        return
      }

      adminLogin({
        account: this.loginForm.account.trim(),
        password: this.loginForm.password.trim(),
      }).then((res) => {
        if (res.data.code === 200) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userType', 'admin')
          if (res.data.hasNotLoginFlag) {
            this.updatePasswordTab()
          } else {
            this.toStudentManagement()
          }
          this.$message.success("登录成功")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    studentAdminLogin() {
      if (isEmpty(this.loginForm.account) || isEmpty(this.loginForm.account.trim())) {
        this.$message.error("账号不能为空")
        return
      } else if (isEmpty(this.loginForm.password) || isEmpty(this.loginForm.password.trim())) {
        this.$message.error("密码不能为空")
        return
      }

      studentAdminLogin({
        studentNumber: this.loginForm.account.trim(),
        password: this.loginForm.password.trim(),
      }).then((res) => {
        if (res.data.code === 200) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userType', 'studentAdmin')
          if (res.data.hasNotLoginFlag) {
            this.updatePasswordTab()
          } else {
            this.toTeamMemberManagement()
          }
          this.$message.success("登录成功")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    forgetPassword() {
      if (isEmpty(this.forgetPasswordForm.studentNumber) || isEmpty(this.forgetPasswordForm.studentNumber.trim())) {
        this.$message.error("学号不能为空")
        return
      } else if (isEmpty(this.forgetPasswordForm.idNumber) || isEmpty(this.forgetPasswordForm.idNumber.trim())) {
        this.$message.error("身份证号不能为空")
        return
      } else if (isEmpty(this.forgetPasswordForm.password) || isEmpty(this.forgetPasswordForm.password.trim())) {
        this.$message.error("密码不能为空")
        return
      } else if (!isPassword(this.forgetPasswordForm.password.trim())) {
        this.$message.error("请输入包含英文字母和数字的8-30位密码")
        return
      } else if (isEmpty(this.forgetPasswordForm.passwordAgain) || isEmpty(this.forgetPasswordForm.passwordAgain.trim())) {
        this.$message.error("请再次输入密码")
        return
      } else if (this.forgetPasswordForm.password.trim() !== this.forgetPasswordForm.passwordAgain.trim()) {
        this.$message.error("两次输入的密码不一致")
        return
      }

      studentForgetPassword({
        studentNumber: this.forgetPasswordForm.studentNumber.trim(),
        idNumber: this.forgetPasswordForm.idNumber.trim(),
        password: this.forgetPasswordForm.password.trim(),
      }).then((res) => {
        if (res.data.code === 200) {
          this.studentAdminLoginTab()
          this.$message.success("修改成功");
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    updatePassword() {
      let userType = localStorage.getItem('userType')
      if (isEmpty(userType)) {
        this.studentAdminLoginTab()
        this.$message.error("请先登录")
        return;
      } else if (isEmpty(this.updatePasswordForm.password) || isEmpty(this.updatePasswordForm.password.trim())) {
        this.$message.error("密码不能为空")
        return
      } else if (!isPassword(this.updatePasswordForm.password.trim())) {
        this.$message.error("请输入包含英文字母和数字的8-30位密码")
        return
      } else if (isEmpty(this.updatePasswordForm.passwordAgain) || isEmpty(this.updatePasswordForm.passwordAgain.trim())) {
        this.$message.error("请再次输入密码")
        return
      } else if (this.updatePasswordForm.password.trim() !== this.updatePasswordForm.passwordAgain.trim()) {
        this.$message.error("两次输入的密码不一致")
        return
      }

      if (userType === 'studentAdmin') {
        studentUpdatePassword({
          password: this.updatePasswordForm.password.trim()
        }).then((res) => {
          if (res.data.code === 200) {
            this.toTeamMemberManagement()
            this.$message.success("修改成功")
          } else {
            console.log(res)
            this.$message.error(res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error("服务器异常，请联系管理员")
        })
      } else if (userType === 'admin') {
        adminUpdatePassword({
          password: this.updatePasswordForm.password.trim()
        }).then((res) => {
          if (res.data.code === 200) {
            this.toStudentManagement()
            this.$message.success("修改成功")
          } else {
            console.log(res)
            this.$message.error(res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error("服务器异常，请联系管理员")
        })
      } else {
        this.$message.error("服务器异常，请联系管理员")
      }
    },

    studentAdminLoginTab() {
      this.initLoginForm()
      this.tabsActive = '0'
      this.tabFlag = 0
    },
    forgetPasswordTab() {
      this.initForgetPasswordForm()
      this.tabsActive = '0'
      this.tabFlag = 1
    },
    updatePasswordTab() {
      this.initUpdatePasswordForm()
      this.tabsActive = '0'
      this.tabFlag = 2
    },

    toStudentManagement() {
      this.$router.push("/studentManagement")
    },
    toTeamMemberManagement() {
      this.$router.push("/teamMemberManagement")
    }
  }
}
</script>

<style scoped>
#login {
  display: flex;

  align-items: center;

  width: 100%;
  height: 100%;
}

#login .background {
  position: absolute;

  top: 0;
  bottom: 0;
}

#login .loginContainer {
  position: relative;

  margin: auto auto auto auto;


  background: white;
}

#login .loginContainer .input {
  display: block;

  margin: 10px 0 0 0;

  width: 300px;
}

#login .loginContainer .textButton {
  display: block;

  margin: 5px 0 0 0;
  padding: 0 0 0 0;

  color: #888888;
}

#login .loginContainer .formButton {
  margin: 5px 0 0 0;

  width: 300px;
}
</style>