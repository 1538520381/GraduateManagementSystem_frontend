<template>
  <div id="studentHome">
    <StudentHeader title="首页"></StudentHeader>
    <el-scrollbar class="middle">
      <div class="module" @click="toStudentInternshipApplication">
        实习申请
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
      student: null
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

    toStudentInternshipApplication() {
      this.$router.push("/student/internshipApplication")
    }
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