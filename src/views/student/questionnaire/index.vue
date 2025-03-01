<template>
  <div id="questionnaire">
    <StudentHeader title="问卷" :to-home-button-flag="true"></StudentHeader>
    <div class="middle">
      <div class="questionnaireListMain" v-if="tabFlag === 0">
        <el-scrollbar class="questionnaireListScrollbar">
          <div class="questionnaire" v-for="(item,index) in questionnaireList" @click="selectQuestionnaire(item)">
            <el-form class="questionnaireForm" v-if="item.startTime <= new Date().getTime()">
              <el-form-item class="questionnaireFormItem" label="问卷名称">
                {{ item.name }}
              </el-form-item>
              <el-form-item class="questionnaireFormItem" label="填写期限">
                {{ formatTimestamp(item.startTime) + " - " + formatTimestamp(item.endTime) }}
              </el-form-item>
              <el-form-item class="questionnaireFormItem" :style="{color: judgeQuestionnaireStatus(item).color}"
                            label="问卷状态">
                {{ judgeQuestionnaireStatus(item).status }}
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
      <div class="questionnaireMain" v-if="tabFlag === 1">
        <el-page-header class="pageHeader" @back="toQuestionnaireList" content="问卷">
        </el-page-header>
        <el-scrollbar class="questionList">
          <el-form class="internshipApplicationForm">
            <el-form-item class="internshipApplicationFormItem" label="班级"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-input class="internshipApplicationInput" v-model="internshipApplicationForm.classNumber"
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item class="internshipApplicationFormItem" label="学号"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-input class="internshipApplicationInput" v-model="internshipApplicationForm.studentNumber"
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item class="internshipApplicationFormItem" label="姓名"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-input class="internshipApplicationInput" v-model="internshipApplicationForm.name"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          <div class="question" v-for="(item,index) in questionnaireQuestionList">
            <div class="stem">{{ (index + 1) + ". " + item.stem }}</div>
            <el-input type="textarea" v-model="item.answer" maxlength="500" :disabled="questionnaireStatus === '已结束'"
                      @input="forceUpdate"></el-input>
          </div>
          <div class="footer" v-if="questionnaireStatus !== '已结束'">
            <el-button type="primary" @click="addStudentQuestionnaireAnswerList">提交</el-button>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import StudentHeader from "@/components/student/header/index.vue";
import {
  questionnaireGetListWithStudentQuestionnaireAnswerByStudentId
} from "@/apis/questionnaire";
import {studentGetStudentByToken} from "@/apis/student";
import {formatTimestamp, isEmpty} from "@/utils/common";
import {studentQuestionnaireAnswerAddList} from "@/apis/studentQuestionnaireAnswer";

export default {
  name: "Questionnaire",
  components: {StudentHeader},
  data() {
    return {
      student: null,

      questionnaireList: [],

      questionnaireStatus: null,
      questionnaireQuestionList: [
        {
          answer: null,
        }
      ],

      internshipApplicationForm: {},
      internshipApplicationFormItemLabelWidth: '50px',

      tabFlag: 0
    }
  },
  async created() {
    await this.getStudentByToken()

    this.internshipApplicationForm = {
      classNumber: this.student.classNumber,
      studentNumber: this.student.studentNumber,
      name: this.student.name,
    }

    this.getQuestionnaireListWithStudentQuestionnaireAnswerByStudentId()
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

    getQuestionnaireListWithStudentQuestionnaireAnswerByStudentId() {
      questionnaireGetListWithStudentQuestionnaireAnswerByStudentId({
        studentId: this.student.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.questionnaireList = res.data.questionnaireList
          this.questionnaireList.sort((o1, o2) => {
            return o2.startTime - o1.startTime
          })
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    addStudentQuestionnaireAnswerList() {
      let studentQuestionnaireAnswerList = []
      for (let i = 0; i < this.questionnaireQuestionList.length; i++) {
        if (isEmpty(this.questionnaireQuestionList[i].answer)) {
          this.$message.error("题目" + this.questionnaireQuestionList[i].questionNumber + "不能为空")
          return
        }
        console.log(this.questionnaireQuestionList[i])
        studentQuestionnaireAnswerList.push({
          studentId: this.student.id,
          questionnaireId: this.questionnaireQuestionList[i].questionnaireId,
          questionnaireQuestionId: this.questionnaireQuestionList[i].id,
          answer: this.questionnaireQuestionList[i].answer
        })
      }
      studentQuestionnaireAnswerAddList({
        studentQuestionnaireAnswerList: studentQuestionnaireAnswerList
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("提交成功")
          this.getQuestionnaireListWithStudentQuestionnaireAnswerByStudentId()
          this.toQuestionnaireList()
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },

    judgeQuestionnaireStatus(questionnaire) {
      if (questionnaire.endTime < new Date().getTime()) {
        return {
          status: "已结束",
          color: "#888888"
        }
      } else if (isEmpty(questionnaire.studentQuestionnaireAnswerList)) {
        return {
          status: "待填写",
          color: "#0000ff"
        }
      } else {
        return {
          status: "已填写",
          color: "#43BE86"
        }
      }
    },

    selectQuestionnaire(questionnaire) {
      this.questionnaireStatus = this.judgeQuestionnaireStatus(questionnaire).status
      this.questionnaireQuestionList = questionnaire.questionnaireQuestionList
      this.questionnaireQuestionList.sort((o1, o2) => {
        return o1.questionNumber - o2.questionNumber
      })

      for (let j = 0; j < this.questionnaireQuestionList.length; j++) {
        this.questionnaireQuestionList[j].questionnaireId = questionnaire.id
        for (let i = 0; i < questionnaire.studentQuestionnaireAnswerList.length; i++) {
          if (questionnaire.studentQuestionnaireAnswerList[i].questionnaireQuestionId === this.questionnaireQuestionList[j].id) {
            this.questionnaireQuestionList[j].answer = questionnaire.studentQuestionnaireAnswerList[i].answer
            break
          }
        }
      }
      this.tabFlag = 1
    },

    toQuestionnaireList() {
      this.tabFlag = 0
    },

    toLogin() {
      this.$router.push("/login")
    },

    formatTimestamp,

    forceUpdate() {
      this.$forceUpdate()
    },

  }
}
</script>

<style scoped>
#questionnaire {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#questionnaire .middle {
  flex: 1;

  width: 100%;
  height: 0;
}

#questionnaire .middle .questionnaireListMain .questionnaireListScrollbar {
  width: 100%;
  height: calc(100% - 1px);

  border-top: 1px solid #888888;
}

#questionnaire .middle .questionnaireListMain .questionnaireListScrollbar .questionnaire {
}

#questionnaire .middle .questionnaireListMain .questionnaireListScrollbar .questionnaire .questionnaireForm {
  padding: 10px 20px 10px 20px;

  border-bottom: 1px solid #888888;
}

#questionnaire .middle .questionnaireListMain .questionnaireListScrollbar .questionnaire .questionnaireForm .questionnaireFormItem {
  margin: 0 0 0 0;
}

#questionnaire .middle .questionnaireMain {
  display: inline-flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#questionnaire .middle .questionnaireMain .pageHeader {
  margin: 0 0 0 10px;

  height: 60px;

  line-height: 60px;
}

#questionnaire .middle .questionnaireMain .internshipApplicationForm {
  margin: 20px auto 0 auto;

  width: 90%;
}

#questionnaire .middle .questionnaireMain .internshipApplicationForm .internshipApplicationFormItem /deep/ .el-form-item__label {
  white-space: pre-line;
  text-justify: distribute-all-lines;
}

#questionnaire .middle .questionnaireMain .internshipApplicationForm .internshipApplicationFormItem .internshipApplicationInput {
  width: 90%;
}

#questionnaire .middle .questionnaireMain .questionList {
  flex: 1;

  width: 100%;
  height: 0;
}

#questionnaire .middle .questionnaireMain .questionList .question {
  margin: 0 auto 10px auto;

  width: 90%;

  line-height: 25px;

  text-align: left;
}

#questionnaire .middle .questionnaireMain .questionList .question .stem {
  display: block;

  word-wrap: break-word
}

#questionnaire .middle .questionnaireMain .questionList .footer {
  padding: 0 20px 20px 20px;

  text-align: right;
}
</style>