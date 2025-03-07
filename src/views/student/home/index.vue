<template>
  <div id="studentHome">
    <StudentHeader title="首页"></StudentHeader>
    <el-form class="internshipApplicationForm">
      <el-form-item class="internshipApplicationFormItem" label="班级"
                    :label-width="internshipApplicationFormItemLabelWidth">
        <el-input class="internshipApplicationInput" v-model="student.classNumber"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item class="internshipApplicationFormItem" label="学号"
                    :label-width="internshipApplicationFormItemLabelWidth">
        <el-input class="internshipApplicationInput" v-model="student.studentNumber"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item class="internshipApplicationFormItem" label="姓名"
                    :label-width="internshipApplicationFormItemLabelWidth">
        <el-input class="internshipApplicationInput" v-model="student.name"
                  :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <el-scrollbar class="middle">
      <div class="module" @click="toUrl(item.url)" v-for="(item,index) in moduleList">
        {{ item.name }}
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import StudentHeader from "@/components/student/header/index.vue";
import {studentGetStudentByToken} from "@/apis/student";

export default {
  name: 'StudentHome',
  components: {StudentHeader},
  data() {
    return {
      student: {},

      internshipApplicationFormItemLabelWidth: '50px',

      moduleList: [
        {
          name: "实习申请",
          url: '/student/internshipApplication'
        },
        {
          name: "问卷",
          url: '/student/questionnaire'
        }
      ]
    }
  },
  async created() {
    await this.getStudentByToken()
  },
  methods: {
    getStudentByToken() {
      return studentGetStudentByToken().then((res) => {
        if (res.data.code === 200) {
          this.student = res.data.student
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
          this.toLogin()
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },

    toUrl(url) {
      if (window.location.pathname !== url) {
        this.$router.push(url)
      }
    },

    toLogin() {
      this.$router.push("/student/login")
    },
  }
}
</script>

<style scoped>
#studentHome {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#studentHome .internshipApplicationForm {
  margin: 20px auto 0 auto;

  width: 90%;
}

#studentHome .internshipApplicationForm .internshipApplicationFormItem /deep/ .el-form-item__label {
  white-space: pre-line;
  text-justify: distribute-all-lines;
}

#studentHome .internshipApplicationForm .internshipApplicationFormItem .internshipApplicationInput {
  width: 90%;
}

#studentHome .middle {
  flex: 1;

  width: 100%;
  height: 0;
}

#studentHome .middle .module {
  margin: 10px auto 0 auto;

  padding: 20px 0 20px 0;

  width: 90%;

  font-size: 40px;
  font-weight: bold;

  text-align: center;

  border-radius: 40px;

  background-color: #4F8CDF;

  color: #ffffff;
}
</style>