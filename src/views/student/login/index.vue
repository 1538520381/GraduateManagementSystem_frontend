<template>
  <div id="studentLogin">
    <div class="loginContainer">
      <div v-if="tabFlag === 0">
        <div class="title">登录</div>
        <el-input class="input" v-model="loginForm.account" placeholder="请输入学号"
                  prefix-icon="el-icon-user"></el-input>
        <el-input class="input" v-model="loginForm.password" placeholder="请输入密码（初始密码为身份证后6位）"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-button class="textButton" type="text" @click="forgetPasswordTab">忘记密码</el-button>
        <el-button class="formButton" @click="studentLogin">登录</el-button>
      </div>
      <div v-if="tabFlag === 1">
        <div class="title">忘记密码</div>
        <el-input class="input" v-model="forgetPasswordForm.studentNumber" placeholder="请输入学号"
                  prefix-icon="el-icon-user"></el-input>
        <el-input class="input" v-model="forgetPasswordForm.idNumber" placeholder="请输入身份证号后六位"
                  prefix-icon="el-icon-s-management"></el-input>
        <el-input class="input" v-model="forgetPasswordForm.password" placeholder="请输入新密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-input class="input" v-model="forgetPasswordForm.passwordAgain" placeholder="请再次输入新密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-button class="textButton" type="text" @click="loginTab">返回</el-button>
        <el-button class="formButton" @click="forgetPassword">确定</el-button>
      </div>
      <div v-if="tabFlag === 2">
        <div class="title">首次登录修改密码</div>
        <el-input class="input" v-model="updatePasswordForm.password" placeholder="请输入密码"
                  prefix-icon="el-icon-user" show-password></el-input>
        <el-input class="input" v-model="updatePasswordForm.passwordAgain" placeholder="请再次输入密码"
                  prefix-icon="el-icon-lock" show-password></el-input>
        <el-button class="formButton" @click="updatePassword">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {isEmpty} from "@/utils/common";
import {studentForgetPassword, studentLogin, studentUpdatePassword} from "@/apis/student";
import {isPassword} from "@/utils/validate";

export default {
  name: "StudentLogin",
  data() {
    return {
      loginForm: {},
      forgetPasswordForm: {},
      updatePasswordForm: {},

      tabFlag: 0
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

    studentLogin() {
      if (isEmpty(this.loginForm.account) || isEmpty(this.loginForm.account.trim())) {
        this.$message.error("账号不能为空")
        return
      } else if (isEmpty(this.loginForm.password) || isEmpty(this.loginForm.password.trim())) {
        this.$message.error("密码不能为空")
        return
      }

      studentLogin({
        studentNumber: this.loginForm.account.trim(),
        password: this.loginForm.password.trim(),
      }).then((res) => {
        if (res.data.code === 200) {
          localStorage.setItem('token', res.data.token)
          if (res.data.hasNotLoginFlag) {
            this.updatePasswordTab()
          } else {
            this.toStudentHome()
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
          this.loginTab()
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
      let token = localStorage.getItem('token')
      if (isEmpty(token)) {
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

      studentUpdatePassword({
        password: this.updatePasswordForm.password.trim()
      }).then((res) => {
        if (res.data.code === 200) {
          this.toStudentHome()
          this.$message.success("修改成功")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },

    loginTab() {
      this.initLoginForm()
      this.tabFlag = 0
    },
    forgetPasswordTab() {
      this.initForgetPasswordForm()
      this.tabFlag = 1
    },
    updatePasswordTab() {
      this.initUpdatePasswordForm()
      this.tabFlag = 2
    },

    toStudentHome() {
      this.$router.push("/student/home")
    }
  }
}
</script>

<style scoped>
#studentLogin {
  display: flex;

  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;

  background-color: #1D59AE;
}

#studentLogin .loginContainer {
  display: inline-block;

  padding: 15px 10px 15px 10px;

  width: 80%;

  border: 1px solid #1D59AE;
  border-radius: 20px;

  background-color: #ffffff;

  box-shadow: rgba(195, 200, 219, 0.7) 0 0 30px;
}

#studentLogin .loginContainer .title {
  text-align: center;

  font-weight: bold;
  font-size: 20px;
}

#studentLogin .loginContainer .input {
  display: block;

  margin: 10px 0 0 0;

  width: 100%;
}

#studentLogin .loginContainer .textButton {
  display: block;

  margin: 5px 0 0 0;
  padding: 0 0 0 0;

  color: #888888;
}

#studentLogin .loginContainer .formButton {
  margin: 5px 0 0 0;

  width: 100%;
}
</style>