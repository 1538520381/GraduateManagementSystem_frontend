<template>
  <div id="studentStatusRecord">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="2"></SidebarMenu>
      <div class="studentTable" v-if="studentTableTab === 0">
        <div class="main">
          <div class="searchContainer">
            <el-select class="searchInput" v-model="queryPageForm.classNumber" placeholder="请选择班级号" clearable>
              <el-option v-for="item in studentClassNumberList" :key="item" :label="item"
                         :value="item"></el-option>
            </el-select>
            <el-input class="searchInput" v-model="queryPageForm.studentNumber" prefix-icon="el-icon-search"
                      placeholder="学号"></el-input>
            <el-input class="searchInput" v-model="queryPageForm.name" prefix-icon="el-icon-search"
                      placeholder="姓名"></el-input>
            <el-select class="searchInput" v-model="queryPageForm.type" placeholder="请选择类型" clearable>
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="controlContainer">
            <el-button class="controlButton" type="primary" @click="queryPage">搜索</el-button>
          </div>
          <el-scrollbar class="tableContainer">
            <el-table class="table" ref="table" :data="studentList" empty-text="暂无学生">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column class="tableColumn" prop="classNumber" label="班级号"></el-table-column>
              <el-table-column class="tableColumn" prop="studentNumber" label="学号"></el-table-column>
              <el-table-column class="tableColumn" prop="name" label="姓名"></el-table-column>
              <el-table-column class="tableColumn" prop="idNumber" label="身份证号（后六位）"></el-table-column>
              <el-table-column class-name="tableColumn" prop="type" label="类型">
                <template slot-scope="scope">
                  {{ scope.row.type === 0 ? '普通学生' : '学生管理员' }}
                </template>
              </el-table-column>
              <el-table-column class="tableColumn" label="所属管理员">
                <template slot-scope="scope">
                  {{ isEmpty(scope.row.studentAdmin) ? '暂无分组' : scope.row.studentAdmin.name }}
                </template>
              </el-table-column>
              <el-table-column class="tableColumn" fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="selectStudentStatusRecord(scope.row)">
                    学生状态
                  </el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="small" @click="selectStudentQuestionnaireAnswer(scope.row)">
                    问卷
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                :current-page="page"
                :page-size="pageSize"
                :total="total"
                layout="total,prev, pager, next"
                @current-change="selectPage">
            </el-pagination>
          </el-scrollbar>
        </div>
      </div>
      <el-scrollbar class="studentStatusRecord" v-else-if="studentTableTab === 1">
        <el-page-header class="pageHeader" @back="selectStudentTable"
                        content="学生状态记录详情"></el-page-header>
        <el-form class="studentInformationForm">
          <el-form-item class="studentInformationFormItem" label="学期">
            <el-radio v-model="studentStatusRecord.semester" :label="index"
                      v-for="(item,index) in studentStatusRecord.semesterList">{{ item }}
            </el-radio>
          </el-form-item>
          <el-form-item class="studentInformationFormItem" label="班级号">
            {{ studentStatusRecord.student.classNumber }}
          </el-form-item>
          <el-form-item class="studentInformationFormItem" label="学号">
            {{ studentStatusRecord.student.studentNumber }}
          </el-form-item>
          <el-form-item class="studentInformationFormItem" label="姓名">
            {{ studentStatusRecord.student.name }}
          </el-form-item>
        </el-form>
        <el-tabs class="studentStatusRecordTabs" v-model="studentStatusRecord.tabsActive" type="card"
                 @tab-click="selectStudentStatusRecordTab">
          <el-tab-pane class="studentStatusRecordTab" v-for="(item,index) in studentStatusRecord.studentStatusRecords"
                       :key="index"
                       :name="String(index)"
                       :label="item.studentAdminStudentStatusRecordDate.week"
                       v-if="item.studentAdminStudentStatusRecordDate.semester === studentStatusRecord.semesterList[studentStatusRecord.semester]">
            <el-form class="studentStatusRecordForm">
              <el-form-item class="studentStatusRecordFormItem" label="时间">
                {{
                  formatTimestamp(item.studentAdminStudentStatusRecordDate.startTime) + ' — ' + formatTimestamp(item.studentAdminStudentStatusRecordDate.endTime)
                }}
              </el-form-item>
              <div v-if="isEmpty(item.id)">
                该生该时间段暂未登记状态记录
              </div>
              <div v-else>
                <el-form-item class="studentStatusRecordFormItem" label="是否在校">
                  {{ item.onCampusFlag ? '是' : '否' }}
                </el-form-item>
                <el-form-item class="studentStatusRecordFormItem" label="离校原因" v-if="!item.onCampusFlag">
                  {{ item.leavingSchoolReason }}
                </el-form-item>
                <el-form-item class="studentStatusRecordFormItem" label="离校去向" v-if="!item.onCampusFlag">
                  {{ item.leavingSchoolDestination }}
                </el-form-item>
                <el-form-item class="studentStatusRecordFormItem" :label="item1.stem"
                              v-for="(item1,index) in studentStatusRecord.studentAdminStudentStatusRecordNameList">
                  {{ item['problem' + (index + 1)] }}
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
      <div class="studentQuestionnaireAnswer" v-else-if="studentTableTab === 2">
        <el-page-header class="pageHeader" @back="selectStudentTable"
                        content="问卷结果详情"></el-page-header>
        <el-form class="studentInformationForm">
          <el-form-item class="studentInformationFormItem" label="班级号">
            {{ studentQuestionnaireAnswer.student.classNumber }}
          </el-form-item>
          <el-form-item class="studentInformationFormItem" label="学号">
            {{ studentQuestionnaireAnswer.student.studentNumber }}
          </el-form-item>
          <el-form-item class="studentInformationFormItem" label="姓名">
            {{ studentQuestionnaireAnswer.student.name }}
          </el-form-item>
        </el-form>
        <el-tabs class="studentQuestionnaireAnswerTabs" v-model="studentQuestionnaireAnswer.tabsActive" type="card">
          <el-tab-pane class="studentQuestionnaireAnswerTab"
                       v-for="(item1,index) in studentQuestionnaireAnswer.questionnaireList"
                       :label="item1.name">
            <el-scrollbar class="studentQuestionnaireAnswerScrollbar">
              <el-form class="studentQuestionnaireAnswerForm">
                <el-form-item class="studentQuestionnaireAnswerFormItem" label="时间">
                  {{
                    formatTimestamp(item1.startTime) + ' — ' + formatTimestamp(item1.endTime)
                  }}
                </el-form-item>
                <el-form-item class="studentQuestionnaireAnswerFormItem"
                              :style="{color: judgeQuestionnaireStatus(item1).color}" label="问卷状态">
                  {{
                    judgeQuestionnaireStatus(item1).status
                  }}
                </el-form-item>
                <div v-if="isEmpty(item1.studentQuestionnaireAnswerList)">
                  该生该问卷暂未填写
                </div>
                <div v-else>
                  <div class="question" v-for="(item2,index) in item1.questionnaireQuestionList">
                    <div class="stem">{{ (index + 1) + ". " + item2.stem }}</div>
                    <div class="answer">{{ item2.answer }}</div>
                  </div>
                </div>
              </el-form>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from "@/components/sidebarMenu/index.vue";
import Header from "@/components/header/index.vue";

import {formatTimestamp, isEmpty} from "@/utils/common";
import {studentGetClassNumberList, studentQueryPageWithStudentAdmin} from "@/apis/student";
import {adminGetAdminByToken} from "@/apis/admin";
import {
  studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate
} from "@/apis/studentAdminStudentStatusRecord";
import {questionnaireGetListWithStudentQuestionnaireAnswerByStudentId} from "@/apis/questionnaire";
import {
  studentAdminStudentStatusRecordNameGetByStudentAdminStudentStatusrRecordDateId
} from "@/apis/studentAdminStudentStatusRecordName";

export default {
  name: 'StudentStatusRecord',
  components: {
    Header,
    SidebarMenu,
  },
  data() {
    return {
      admin: null,

      studentTableTab: 0,

      studentList: [],
      studentClassNumberList: [],

      queryPageForm: {},

      page: 0,
      pageSize: 10,
      total: 0,

      studentStatusRecord: {
        student: null,
        studentStatusRecords: [],
        semesterList: [],
        studentAdminStudentStatusRecordNameList: [],
        tabsActive: '0',
        semester: 0,
      },

      studentQuestionnaireAnswer: {
        student: null,
        questionnaireList: [],
        tabsActive: '0',
      },

      typeOptions: [
        {
          value: 0,
          label: '普通学生'
        },
        {
          value: 1,
          label: '学生管理员'
        }
      ]
    }
  },
  async created() {
    await this.getAdminByToken()

    this.initQueryPageForm()
    this.queryPage()
    this.getClassNumberList()
  },
  methods: {
    initQueryPageForm() {
      this.queryPageForm = {
        studentNumber: null,
        name: null,
        classNumber: null,
        type: null,
      }
    },

    getAdminByToken() {
      return adminGetAdminByToken().then((res) => {
        if (res.data.code === 200) {
          this.admin = res.data.admin
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

    queryPage() {
      studentQueryPageWithStudentAdmin({
        studentNumber: isEmpty(this.queryPageForm.studentNumber) ? null : this.queryPageForm.studentNumber.trim(),
        name: isEmpty(this.queryPageForm.name) ? null : this.queryPageForm.name.trim(),
        classNumber: isEmpty(this.queryPageForm.classNumber) ? null : this.queryPageForm.classNumber.trim(),
        type: isEmpty(this.queryPageForm.type) ? null : this.queryPageForm.type,
        page: this.page,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.data.code === 200) {
          this.studentList = res.data.pageInfo.records
          this.total = res.data.pageInfo.total
          if (res.data.pageInfo.pages < this.page) {
            this.page = res.data.pageInfo.pages
            this.queryPage()
          }
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    getClassNumberList() {
      studentGetClassNumberList().then((res) => {
        if (res.data.code === 200) {
          this.studentClassNumberList = res.data.classNumberSet
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    getStudentAdminStudentStatusRecordByStudentIdAndNowWithStudentAdminStudentStatusRecordDate(studentId) {
      studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate({studentId: studentId}).then((res) => {
        if (res.data.code === 200) {
          this.studentStatusRecord.studentStatusRecords = res.data.withStudentAdminStudentStatusRecordDateVOList
          if (!isEmpty(this.studentStatusRecord.studentStatusRecords)) {
            this.studentStatusRecord.semesterList = []
            for (let i = 0; i < this.studentStatusRecord.studentStatusRecords.length; i++) {
              if (this.studentStatusRecord.semesterList.indexOf(this.studentStatusRecord.studentStatusRecords[i].studentAdminStudentStatusRecordDate.semester) === -1) {
                this.studentStatusRecord.semesterList.push(this.studentStatusRecord.studentStatusRecords[i].studentAdminStudentStatusRecordDate.semester)
              }
            }
            this.getStudentAdminStudentStatusRecordNameByStudentAdminStudentStatusrRecordDateId(this.studentStatusRecord.studentStatusRecords[0].studentAdminStudentStatusRecordDate.id);
          }
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    getQuestionnaireListWithStudentQuestionnaireAnswerByStudentId() {
      questionnaireGetListWithStudentQuestionnaireAnswerByStudentId({
        studentId: this.studentQuestionnaireAnswer.student.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.studentQuestionnaireAnswer.questionnaireList = res.data.questionnaireList
          this.studentQuestionnaireAnswer.questionnaireList.sort((o1, o2) => {
            return o2.startTime - o1.startTime
          })
          for (let i = 0; i < this.studentQuestionnaireAnswer.questionnaireList.length; i++) {
            this.studentQuestionnaireAnswer.studentQuestionnaireAnswers = []
            this.studentQuestionnaireAnswer.questionnaireList[i].questionnaireQuestionList.sort((o1, o2) => {
              return o1.questionNumber - o2.questionNumber
            })
            for (let j = 0; j < this.studentQuestionnaireAnswer.questionnaireList[i].questionnaireQuestionList.length; j++) {
              for (let k = 0; k < this.studentQuestionnaireAnswer.questionnaireList[i].studentQuestionnaireAnswerList.length; k++) {
                if (this.studentQuestionnaireAnswer.questionnaireList[i].studentQuestionnaireAnswerList[k].questionnaireQuestionId === this.studentQuestionnaireAnswer.questionnaireList[i].questionnaireQuestionList[j].id) {
                  this.studentQuestionnaireAnswer.questionnaireList[i].questionnaireQuestionList[j].answer = this.studentQuestionnaireAnswer.questionnaireList[i].studentQuestionnaireAnswerList[k].answer
                  break
                }
              }
            }
          }
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    getStudentAdminStudentStatusRecordNameByStudentAdminStudentStatusrRecordDateId(studentAdminStudentStatusrRecordDateId) {
      studentAdminStudentStatusRecordNameGetByStudentAdminStudentStatusrRecordDateId({
        studentAdminStudentStatusrRecordDateId: studentAdminStudentStatusrRecordDateId
      }).then((res) => {
        if (res.data.code === 200) {
          this.studentStatusRecord.studentAdminStudentStatusRecordNameList = res.data.studentAdminStudentStatusRecordNameList.sort((o1, o2) => {
            return o1.sort - o2.sort;
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

    selectPage(page) {
      this.page = page
      this.queryPage()
    },
    selectStudentTable() {
      this.studentTableTab = 0
    },
    selectStudentStatusRecord(student) {
      this.studentTableTab = 1
      this.studentStatusRecord.student = student
      this.studentStatusRecord.tabsActive = '0'
      this.studentStatusRecord.semester = 0
      this.getStudentAdminStudentStatusRecordByStudentIdAndNowWithStudentAdminStudentStatusRecordDate(student.id)
    },
    selectStudentQuestionnaireAnswer(student) {
      this.studentTableTab = 2
      this.studentQuestionnaireAnswer.student = student
      this.getQuestionnaireListWithStudentQuestionnaireAnswerByStudentId()
    },
    selectStudentStatusRecordTabs(tab, event) {
      console.log(this.studentStatusRecord.tabsActive);
    },

    judgeQuestionnaireStatus(questionnaire) {
      if (questionnaire.endTime < new Date().getTime()) {
        return {
          status: "已结束",
          color: "#888888"
        }
      } else if (questionnaire.startTime > new Date().getTime()) {
        return {
          status: "未开始",
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

    selectStudentStatusRecordTab(tab, event) {
      this.getStudentAdminStudentStatusRecordNameByStudentAdminStudentStatusrRecordDateId(this.studentStatusRecord.studentStatusRecords[parseInt(tab.name)].studentAdminStudentStatusRecordDate.id)
    },

    toLogin() {
      this.$router.push("/login")
    },

    isEmpty,
    formatTimestamp,
  }
}
</script>

<style scoped>
#studentStatusRecord {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#studentStatusRecord .middle {
  display: flex;

  flex-flow: row;

  flex: 1;

  width: 100%;
  height: 0;
}

#studentStatusRecord .middle .studentTable {
  flex: 1;

  width: 0;
  height: 100%;
}

#studentStatusRecord .middle .studentTable .main {
  display: inline-flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#studentStatusRecord .middle .studentTable .main .searchContainer {
  width: 100%;
}

#studentStatusRecord .middle .studentTable .main .searchContainer .searchInput {
  margin: 20px 0 0 20px;

  width: 200px;
}

#studentStatusRecord .middle .studentTable .main .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}

#studentStatusRecord .middle .studentTable .main .tableContainer {
  flex: 1;

  width: 100%;
  height: 0;

  text-align: center;
}

#studentStatusRecord .middle .studentTable .main .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}

#studentStatusRecord .middle .studentStatusRecord {
  flex: 1;

  width: 0;
  height: 100%;
}

#studentStatusRecord .middle .studentStatusRecord .pageHeader {
  margin: 20px 20px 0 20px;
}

#studentStatusRecord .middle .studentStatusRecord .studentInformationForm {
  margin: 10px 0 0 20px;
}

#studentStatusRecord .middle .studentStatusRecord .studentInformationForm .studentInformationFormItem {
  margin: 0 0 0 0;
}

#studentStatusRecord .middle .studentStatusRecord .studentStatusRecordTabs .studentStatusRecordTab .studentStatusRecordForm {
  margin: 0 0 0 20px;
}

#studentStatusRecord .middle .studentStatusRecord .studentStatusRecordTabs .studentStatusRecordTab .studentStatusRecordForm .studentStatusRecordFormItem {
  margin: 0 0 0 0;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer {
  display: inline-flex;

  flex-flow: column;

  flex: 1;

  width: 0;
  height: 100%;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .pageHeader {
  margin: 20px 20px 0 20px;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentInformationForm {
  margin: 10px 0 0 20px;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentInformationForm .studentInformationFormItem {
  margin: 0 0 0 0;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs {
  display: inline-block;
  position: relative;

  flex: 1;

  width: 100%;
  height: 0;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs /deep/ .el-tabs__header {
  display: inline-block;

  margin: 0 0 0 0 !important;

  width: 100%;
  height: 40px;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs /deep/ .el-tabs__content {
  display: inline-block;

  width: 100%;
  height: calc(100% - 50px);
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab {
  width: 100%;
  height: 100%;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab .studentQuestionnaireAnswerScrollbar {
  width: 100%;
  height: 100%;
}


#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab .studentQuestionnaireAnswerScrollbar /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab .studentQuestionnaireAnswerScrollbar .studentQuestionnaireAnswerForm {
  margin: 0 0 0 20px;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab .studentQuestionnaireAnswerScrollbar .studentQuestionnaireAnswerForm .studentQuestionnaireAnswerFormItem {
  margin: 0 0 0 0;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab .studentQuestionnaireAnswerScrollbar .studentQuestionnaireAnswerForm .question {
  margin: 10px auto 10px auto;

  line-height: 25px;

  text-align: left;
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab .studentQuestionnaireAnswerScrollbar .studentQuestionnaireAnswerForm .question .stem {
  display: block;

  word-wrap: break-word
}

#studentStatusRecord .middle .studentQuestionnaireAnswer .studentQuestionnaireAnswerTabs .studentQuestionnaireAnswerTab .studentQuestionnaireAnswerScrollbar .studentQuestionnaireAnswerForm .question .answer {
  margin: 5px 15px 0 15px;
}
</style>