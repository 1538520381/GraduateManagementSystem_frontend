<template>
  <div id="studentStatusRecord">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="3"></SidebarMenu>
      <div class="studentTable" v-if="studentTableTab === 0">
        <div class="main">
          <div class="searchContainer">
            <el-select class="searchInput" v-model="queryPageForm.semester" placeholder="请选择学期">
              <el-option
                  v-for="item in (isEmpty(studentAdminStudentStatusRecordDateDict) ? [] : Object.keys(this.studentAdminStudentStatusRecordDateDict))"
                  :key="item" :label="item"
                  :value="item"></el-option>
            </el-select>
            <el-select class="searchInput" v-model="queryPageForm.week" placeholder="请选择周">
              <el-option
                  v-for="item in (isEmpty(studentAdminStudentStatusRecordDateDict) ? [] : studentAdminStudentStatusRecordDateDict[queryPageForm.semester])"
                  :key="item"
                  :label="item"
                  :value="item"></el-option>
            </el-select>
            <el-select class="searchInput" v-model="queryPageForm.classNumber" placeholder="请选择班级号" clearable>
              <el-option v-for="item in studentClassNumberList" :key="item" :label="item"
                         :value="item"></el-option>
            </el-select>
            <el-input class="searchInput" v-model="queryPageForm.studentNumber" prefix-icon="el-icon-search"
                      placeholder="学号"></el-input>
            <el-input class="searchInput" v-model="queryPageForm.name" prefix-icon="el-icon-search"
                      placeholder="姓名"></el-input>
          </div>
          <div class="controlContainer">
            <el-button class="controlButton" type="primary" @click="queryPage">搜索</el-button>
            <el-button class="controlButton" type="primary" @click="downloadStudentAdminStudentStatusRecordExcel">导出
            </el-button>
          </div>
          <el-scrollbar class="tableContainer">
            <el-table class="table" ref="table" :data="studentList" empty-text="暂无学生">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column class="tableColumn" prop="classNumber" label="班级号"></el-table-column>
              <el-table-column class="tableColumn" prop="studentNumber" label="学号"></el-table-column>
              <el-table-column class="tableColumn" prop="name" label="姓名"></el-table-column>
              <el-table-column class="tableColumn" label="所属管理员">
                <template slot-scope="scope">
                  {{ isEmpty(scope.row.studentAdmin) ? '暂无分组' : scope.row.studentAdmin.name }}
                </template>
              </el-table-column>
              <el-table-column class="tableColumn" label="是否在校">
                <template slot-scope="scope">
                  {{
                    isEmpty(scope.row.studentAdminStudentStatusRecord) ? null : (scope.row.studentAdminStudentStatusRecord.onCampusFlag ? '是' : '否')
                  }}
                </template>
              </el-table-column>
              <el-table-column class="tableColumn" prop="studentAdminStudentStatusRecord.leavingSchoolReason"
                               label="离校原因"></el-table-column>
              <el-table-column class="tableColumn" prop="studentAdminStudentStatusRecord.leavingSchoolDestination"
                               label="离校去向"></el-table-column>
              <el-table-column class="tableColumn" :prop="'studentAdminStudentStatusRecord.problem' + (index + 1)"
                               :label="item.stem"
                               v-for="(item,index) in studentAdminStudentStatusRecordNameList"></el-table-column>
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
      <div class="studentStatusRecord" v-else-if="studentTableTab === 1">
        <el-page-header class="pageHeader" @back="selectStudentTable"
                        content="学生状态记录详情"></el-page-header>
        <el-form class="studentInformationForm">
          <el-form-item class="studentInformationFormItem" label="学期">
            2024~2025学年第2学期
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
        <el-tabs class="studentStatusRecordTabs" v-model="studentStatusRecord.tabsActive" type="card">
          <el-tab-pane class="studentStatusRecordTab" v-for="(item,index) in studentStatusRecord.studentStatusRecords"
                       :label="item.studentAdminStudentStatusRecordDate.week">
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
                <el-form-item class="studentStatusRecordFormItem" label="科研进展情况">
                  {{ item.scientificResearchProgress }}
                </el-form-item>
                <el-form-item class="studentStatusRecordFormItem" label="性格、优缺点">
                  {{ item.personalityTraits }}
                </el-form-item>
                <el-form-item class="studentStatusRecordFormItem" label="需要特别关注的问题">
                  {{ item.abnormalIssues }}
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
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
import {
  studentGetClassNumberList, studentQueryListWithStudentAdminStudentStatusRecord,
  studentQueryPageWithStudentAdmin,
  studentQueryPageWithStudentAdminStudentStatusRecord
} from "@/apis/student";
import {adminGetAdminByToken} from "@/apis/admin";
import {
  studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate
} from "@/apis/studentAdminStudentStatusRecord";
import {questionnaireGetListWithStudentQuestionnaireAnswerByStudentId} from "@/apis/questionnaire";
import {
  studentAdminStudentStatusRecordDateGetById,
  studentAdminStudentStatusRecordDateGetList
} from "@/apis/studentAdminStudentStatusRecordDate";
import XLSX from "xlsx";
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

      studentAdminStudentStatusRecordDateDict: {},
      semesterAndWeekToIdDict: {},

      studentTableTab: 0,

      studentList: [],
      studentClassNumberList: [],

      queryPageForm: {},

      page: 0,
      pageSize: 5,
      total: 0,

      studentStatusRecord: {
        student: null,
        studentStatusRecords: [],
        tabsActive: '0',
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
      ],

      studentAdminStudentStatusRecordNameList: []
    }
  },
  async created() {
    await this.getAdminByToken()

    await this.getStudentAdminStudentStatusRecordDateList()
    console.log(this.semesterAndWeekToIdDict)
    this.initQueryPageForm()
    this.queryPage()
    this.getClassNumberList()
  },
  methods: {
    initQueryPageForm() {
      this.queryPageForm = {
        semester: isEmpty(this.studentAdminStudentStatusRecordDateDict) ? null : Object.keys(this.studentAdminStudentStatusRecordDateDict)[0],
        week: isEmpty(this.studentAdminStudentStatusRecordDateDict) ? null : (isEmpty(this.studentAdminStudentStatusRecordDateDict[Object.keys(this.studentAdminStudentStatusRecordDateDict)[0]]) ? null : this.studentAdminStudentStatusRecordDateDict[Object.keys(this.studentAdminStudentStatusRecordDateDict)[0]][0]),
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

    getStudentAdminStudentStatusRecordDateList() {
      return studentAdminStudentStatusRecordDateGetList().then((res) => {
        this.studentAdminStudentStatusRecordDateDict = {}
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.studentAdminStudentStatusRecordDateList.length; i++) {
            if (isEmpty(this.studentAdminStudentStatusRecordDateDict[res.data.studentAdminStudentStatusRecordDateList[i].semester])) {
              this.studentAdminStudentStatusRecordDateDict[res.data.studentAdminStudentStatusRecordDateList[i].semester] = []
            }
            this.studentAdminStudentStatusRecordDateDict[res.data.studentAdminStudentStatusRecordDateList[i].semester].push(res.data.studentAdminStudentStatusRecordDateList[i].week)

            this.semesterAndWeekToIdDict[res.data.studentAdminStudentStatusRecordDateList[i].semester + "Persolute" + res.data.studentAdminStudentStatusRecordDateList[i].week] = res.data.studentAdminStudentStatusRecordDateList[i].id
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
    queryPage() {
      if (isEmpty(this.queryPageForm.semester) || isEmpty(this.queryPageForm.week)) {
        this.$message.error("系统异常")
        return
      }
      studentQueryPageWithStudentAdminStudentStatusRecord({
        semester: this.queryPageForm.semester,
        week: this.queryPageForm.week,
        studentNumber: isEmpty(this.queryPageForm.studentNumber) ? null : this.queryPageForm.studentNumber.trim(),
        name: isEmpty(this.queryPageForm.name) ? null : this.queryPageForm.name.trim(),
        classNumber: isEmpty(this.queryPageForm.classNumber) ? null : this.queryPageForm.classNumber.trim(),
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
      this.getStudentAdminStudentStatusRecordNameByStudentAdminStudentStatusrRecordDateId(this.semesterAndWeekToIdDict[this.queryPageForm.semester + "Persolute" + this.queryPageForm.week])
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
    downloadStudentAdminStudentStatusRecordExcel() {
      const XLSX = require("xlsx");
      const workbook = XLSX.utils.book_new();

      let mainSheetData = [];
      let columnName = ['学期', '周', '开始时间', '结束时间', '班级号', '学号', '姓名', '所属管理员', '是否在校', '离校原因', '离校去向'];
      mainSheetData.push(columnName)

      if (isEmpty(this.queryPageForm.semester) || isEmpty(this.queryPageForm.week)) {
        this.$message.error("系统异常")
        return
      }

      studentAdminStudentStatusRecordDateGetById({
        id: isEmpty(this.semesterAndWeekToIdDict[this.queryPageForm.semester + "Persolute" + this.queryPageForm.week]) ? -1 : this.semesterAndWeekToIdDict[this.queryPageForm.semester + "Persolute" + this.queryPageForm.week]
      }).then((res) => {
        let studentAdminStudentStatusRecordDate = res.data.studentAdminStudentStatusRecordDate
        if (res.data.code === 200) {
          studentAdminStudentStatusRecordNameGetByStudentAdminStudentStatusrRecordDateId({
            studentAdminStudentStatusrRecordDateId: isEmpty(this.semesterAndWeekToIdDict[this.queryPageForm.semester + "Persolute" + this.queryPageForm.week]) ? -1 : this.semesterAndWeekToIdDict[this.queryPageForm.semester + "Persolute" + this.queryPageForm.week]
          }).then((res) => {
            if (res.data.code === 200) {
              let studentAdminStudentStatusRecordNameList = res.data.studentAdminStudentStatusRecordNameList.sort((o1, o2) => {
                return o1.sort - o2.sort;
              })

              for (let i = 0; i < studentAdminStudentStatusRecordNameList.length; i++) {
                columnName.push(studentAdminStudentStatusRecordNameList[i].stem)
              }

              studentQueryListWithStudentAdminStudentStatusRecord({
                semester: this.queryPageForm.semester,
                week: this.queryPageForm.week,
                studentNumber: isEmpty(this.queryPageForm.studentNumber) ? null : this.queryPageForm.studentNumber.trim(),
                name: isEmpty(this.queryPageForm.name) ? null : this.queryPageForm.name.trim(),
                classNumber: isEmpty(this.queryPageForm.classNumber) ? null : this.queryPageForm.classNumber.trim(),
              }).then((res) => {
                if (res.data.code === 200) {
                  for (let i = 0; i < res.data.studentList.length; i++) {
                    let row = [
                      this.queryPageForm.semester,
                      this.queryPageForm.week,
                      formatTimestamp(studentAdminStudentStatusRecordDate.startTime),
                      formatTimestamp(studentAdminStudentStatusRecordDate.endTime),
                      res.data.studentList[i].classNumber,
                      res.data.studentList[i].studentNumber,
                      res.data.studentList[i].name,
                      (isEmpty(res.data.studentList[i].studentAdmin) ? '暂无分组' : res.data.studentList[i].studentAdmin.name),
                      (isEmpty(res.data.studentList[i].studentAdminStudentStatusRecord) ? null : (res.data.studentList[i].studentAdminStudentStatusRecord.onCampusFlag ? '是' : '否')),
                      (isEmpty(res.data.studentList[i].studentAdminStudentStatusRecord) ? null : res.data.studentList[i].studentAdminStudentStatusRecord.leavingSchoolReason),
                      (isEmpty(res.data.studentList[i].studentAdminStudentStatusRecord) ? null : res.data.studentList[i].studentAdminStudentStatusRecord.leavingSchoolDestination)
                    ]

                    for (let j = 0; j < studentAdminStudentStatusRecordNameList.length; j++) {
                      row.push((isEmpty(res.data.studentList[i].studentAdminStudentStatusRecord) ? null : res.data.studentList[i].studentAdminStudentStatusRecord['problem' + (j + 1)]))
                    }

                    mainSheetData.push(row)
                  }
                  const mainSheet = XLSX.utils.aoa_to_sheet(mainSheetData);

                  XLSX.utils.book_append_sheet(workbook, mainSheet, "主表");

                  XLSX.writeFile(workbook, "学生状态信息表.xlsx");
                } else {
                  console.log(res)
                  this.$message.error(res.data.msg)
                }
              }).catch((err) => {
                console.log(err)
                this.$message.error("服务器异常，请联系管理员")
              })

            } else {
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error("服务器异常，请联系管理员")
          })
        } else {

        }
      })
    },
    getStudentAdminStudentStatusRecordNameByStudentAdminStudentStatusrRecordDateId(studentAdminStudentStatusrRecordDateId) {
      if (isEmpty(studentAdminStudentStatusrRecordDateId)) {
        this.studentAdminStudentStatusRecordNameList = []
        return
      }
      studentAdminStudentStatusRecordNameGetByStudentAdminStudentStatusrRecordDateId({
        studentAdminStudentStatusrRecordDateId: studentAdminStudentStatusrRecordDateId
      }).then((res) => {
        if (res.data.code === 200) {
          this.studentAdminStudentStatusRecordNameList = res.data.studentAdminStudentStatusRecordNameList.sort((o1, o2) => {
            return o1.sort - o2.sort;
          })
        } else {
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

#studentStatusRecord .middle .studentTable .main .tableContainer .table /deep/ .el-table__row {
  font-size: 12px;
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