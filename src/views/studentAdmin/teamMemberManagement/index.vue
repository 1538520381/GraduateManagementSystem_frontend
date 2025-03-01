<template>
  <div id="teamMemberManagement">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="studentAdmin" active="0"></SidebarMenu>
      <div class="studentTable" v-if="studentTableFlag">
        <div class="main">
          <div class="searchContainer">
            <el-input class="searchInput" v-model="queryPageForm.studentNumber" prefix-icon="el-icon-search"
                      placeholder="学号"></el-input>
            <el-input class="searchInput" v-model="queryPageForm.name" prefix-icon="el-icon-search"
                      placeholder="姓名"></el-input>
          </div>
          <div class="controlContainer">
            <el-button class="controlButton" type="primary" @click="queryStudentListByStudentAdminId">搜索</el-button>
            <el-button class="controlButton" type="primary" @click="openTeamMemberSelectionDialog">选择组员</el-button>
          </div>
          <el-scrollbar class="tableContainer">
            <el-table class="table" :data="studentList" empty-text="暂无学生">
              <el-table-column class="tableColumn" prop="classNumber" label="班级号"></el-table-column>
              <el-table-column class="tableColumn" prop="studentNumber" label="学号"></el-table-column>
              <el-table-column class="tableColumn" prop="name" label="姓名"></el-table-column>
              <el-table-column class="tableColumn" fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="openStudentStatusRecordDialog(scope.row)">学生状态记录
                  </el-button>

                  <el-divider direction="vertical" v-if="scope.row.id !== student.id"></el-divider>
                  <el-popconfirm title="确定删除组员吗?" @confirm="deleteTeamMember(scope.row.id)"
                                 v-if="scope.row.id !== student.id">
                    <el-button style="color: #ff0000" type="text" size="small" slot="reference">删除</el-button>
                  </el-popconfirm>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="small" @click="selectStudentStatusRecord(scope.row)">
                    学生状态记录详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                style="width: 100%;text-align: center"
                :total="studentList.length"
                layout="total">
            </el-pagination>
          </el-scrollbar>
        </div>
      </div>
      <div class="studentStatusRecord" v-else>
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
        <el-tabs class="studentStatusRecordTabs" v-model="tabsActive" type="card">
          <el-tab-pane class="studentStatusRecordTab" v-for="(item,index) in studentStatusRecord.studentStatusRecords"
                       :label="item.studentAdminStudentStatusRecordDate.week"
                       v-if="item.studentAdminStudentStatusRecordDate.semester === studentStatusRecord.semesterList[studentStatusRecord.semester]">
            <el-form class="studentStatusRecordForm">
              <el-form-item class="studentStatusRecordFormItem" label="时间">
                {{
                  formatTimestamp(item.studentAdminStudentStatusRecordDate.startTime) + ' — ' + formatTimestamp(item.studentAdminStudentStatusRecordDate.endTime - 1)
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
    </div>

    <el-dialog class="teamMemberSelectionDialog" title="选择组员" :visible.sync="teamMemberSelectionDialogVis"
               :close-on-click-modal="false">
      <div class="searchContainer">
        <el-input class="searchInput" v-model="teamMemberSelectionDialogData.queryPageForm.studentNumber"
                  prefix-icon="el-icon-search" placeholder="学号"></el-input>
        <el-input class="searchInput" v-model="teamMemberSelectionDialogData.queryPageForm.name"
                  prefix-icon="el-icon-search" placeholder="姓名"></el-input>
      </div>
      <div class="controlContainer">
        <el-button class="controlButton" type="primary" @click="queryStudentListByClassNumberWithStudentAdmin">搜索
        </el-button>
      </div>
      <div class="tableContainer">
        <el-table class="table" :data="teamMemberSelectionDialogData.studentList" empty-text="暂无学生">
          <el-table-column class="tableColumn" prop="studentNumber" label="学号"></el-table-column>
          <el-table-column class="tableColumn" prop="name" label="姓名"></el-table-column>
          <el-table-column class="tableColumn" prop="classNumber" label="班级号"></el-table-column>
          <el-table-column class="tableColumn" label="所属管理员">
            <template slot-scope="scope">
              {{ isEmpty(scope.row.studentAdmin) ? '暂无分组' : scope.row.studentAdmin.name }}
            </template>
          </el-table-column>
          <el-table-column class="tableColumn" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" slot="reference" v-if="isEmpty(scope.row.studentAdmin)"
                         @click="choiceTeamMember(scope.row.id)">选择组员
              </el-button>
              <el-popconfirm title="确定删除组员吗?" @confirm="deleteTeamMember(scope.row.id)"
                             v-if="!isEmpty(scope.row.studentAdmin) && scope.row.studentAdmin.id === student.id && scope.row.id !== student.id">
                <el-button type="text" size="small" slot="reference">删除组员</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            style="width: 100%;text-align: center"
            :total="teamMemberSelectionDialogData.studentList.length"
            layout="total">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog class="studentStatusRecordDialog" title="学生状态记录"
               :visible.sync="studentStatusRecordDialogVis"
               :close-on-click-modal="false" width="600px">
      <el-form class="studentStatusRecordForm"
               v-if="!isEmpty(studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate)">
        <el-form-item class="studentStatusRecordFormItem" label="日期" label-width="150px">
          <div>{{
              studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.semester + " " + studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.week + '(' + formatTimestamp(studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.startTime) + ' — ' + formatTimestamp(studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.endTime - 1) + ')'
            }}
          </div>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="学号" label-width="150px">
          <el-input class="studentStatusRecordFormInput"
                    v-model="studentStatusRecordDialogData.studentStatusRecordForm.student.studentNumber"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="姓名" label-width="150px">
          <el-input class="studentStatusRecordFormInput"
                    v-model="studentStatusRecordDialogData.studentStatusRecordForm.student.name"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="是否在校" label-width="150px">
          <el-radio
              v-model="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag"
              :label="true">是
          </el-radio>
          <el-radio
              v-model="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag"
              :label="false">否
          </el-radio>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="离校原因"
                      v-if="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag === false"
                      label-width="150px">
          <el-input class="studentStatusRecordFormInput"
                    v-model="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolReason"
                    type="textarea" maxlength="500" placeholder="该生离校原因（上限500字）"></el-input>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="离校去向"
                      v-if="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag === false"
                      label-width="150px">
          <el-input class="studentStatusRecordFormInput"
                    v-model="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolDestination"
                    type="textarea" maxlength="500" placeholder="该生离校去向（上限500字）"></el-input>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="科研进展情况" label-width="150px">
          <el-input class="studentStatusRecordFormInput"
                    v-model="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.scientificResearchProgress"
                    type="textarea" maxlength="500"
                    placeholder="该生科研进展情况(越详细越好，包括大小论文进展专利情况等)（上限500字）"></el-input>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="性格、优缺点" label-width="150px">
          <el-input class="studentStatusRecordFormInput"
                    v-model="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.personalityTraits"
                    type="textarea" maxlength="500"
                    placeholder="据你接触该生是个什么性格的人，有什么优缺点（上限500字）"></el-input>
        </el-form-item>
        <el-form-item class="studentStatusRecordFormItem" label="需要特别关注的问题" label-width="150px">
          <el-input class="studentStatusRecordFormInput"
                    v-model="studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.abnormalIssues"
                    type="textarea" maxlength="500"
                    placeholder="该生目前有无需要特别去关心的问题（上限500字）"></el-input>
        </el-form-item>
        <div class="footer">
          <el-button @click="closeStudentStatusRecordDialog">取消</el-button>
          <el-button type="primary" @click="studentAdminStudentStatusRecordUpdate">确定</el-button>
        </div>
      </el-form>
      <div v-else>暂无须填写学生状态记录</div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/header/index.vue";
import SidebarMenu from "@/components/sidebarMenu/index.vue";
import {
  studentGetStudentByToken,
  studentQueryListByStudentAdminId,
  studentQueryStudentListByClassNumberWithStudentAdmin
} from "@/apis/student";
import {formatTimestamp, isEmpty} from "@/utils/common";
import {
  studentAdminStudentChoiceTeamMember,
  studentAdminStudentDeleteTeamMemberByStudentId
} from "@/apis/studentAdminStudent";
import {
  studentAdminStudentStatusRecordDateGetByNowTimeWithStudentAdminStudentStatusRecordByStudentId
} from "@/apis/studentAdminStudentStatusRecordDate";
import {
  studentAdminStudentStatusRecordGetLastUpdateTimeByStudentId,
  studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate,
  studentAdminStudentStatusRecordUpdate
} from "@/apis/studentAdminStudentStatusRecord";

export default {
  name: 'TeamMemberManagement',
  components: {SidebarMenu, Header},
  data() {
    return {
      student: {},

      queryPageForm: {},
      studentList: [],

      teamMemberSelectionDialogVis: false,
      teamMemberSelectionDialogData: {
        queryPageForm: {},
        studentList: [],
      },

      studentStatusRecordDialogVis: false,
      studentStatusRecordDialogData: {
        studentStatusRecordForm: {
          student: {
            id: null,
            studentNumber: null,
            name: null,
          },
          studentAdminStudentStatusRecordDate: {
            id: null,
            startTime: null,
            endTime: null,
            week: null,
            semester: null
          },
          studentAdminStudentStatusRecord: {
            onCampusFlag: null,
            leavingSchoolReason: null,
            leavingSchoolDestination: null,
            scientificResearchProgress: null,
            personalityTraits: null,
            abnormalIssues: null,
          }
        },
      },

      studentTableFlag: true,
      studentStatusRecord: {
        student: null,
        studentStatusRecords: [],
        semesterList: [],
        semester: 0,
        tabsActive: '0',
      },
    }
  },
  async created() {
    await this.getStudentByToken()

    this.initQueryPageForm()
    this.initTeamMemberSelectionDialogDataQueryPageForm()
    this.initStudentStatusRecordDialogDataStudentStatusRecordForm()

    this.queryStudentListByStudentAdminId()
  },
  methods: {
    formatTimestamp,
    initQueryPageForm() {
      this.queryPageForm = {
        studentNumber: null,
        name: null,
      }
    },
    initTeamMemberSelectionDialogDataQueryPageForm() {
      this.teamMemberSelectionDialogData.queryPageForm = {
        studentNumber: null,
        name: null
      }
    },
    initStudentStatusRecordDialogDataStudentStatusRecordForm() {
      this.studentStatusRecordDialogData.studentStatusRecordForm = {
        student: {
          id: null,
          studentNumber: null,
          name: null,
        },
        studentAdminStudentStatusRecordDate: {
          id: null,
          startTime: null,
          endTime: null,
          week: null,
          semester: null
        },
        studentAdminStudentStatusRecord: {
          onCampusFlag: null,
          leavingSchoolReason: null,
          leavingSchoolDestination: null,
          scientificResearchProgress: null,
          personalityTraits: null,
          abnormalIssues: null,
        }
      }
    },

    getStudentByToken() {
      return studentGetStudentByToken().then((res) => {
        if (res.data.code === 200) {
          this.student = res.data.student
          if (this.student.type !== 1) {
            this.toLogin()
            this.$message.error('非学生管理员')
          }
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

    queryStudentListByStudentAdminId() {
      studentQueryListByStudentAdminId({
        studentNumber: isEmpty(this.queryPageForm.studentNumber) ? null : this.queryPageForm.studentNumber,
        name: isEmpty(this.queryPageForm.name) ? null : this.queryPageForm.name,
        studentAdminId: this.student.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.studentList = res.data.studentList
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    queryStudentListByClassNumberWithStudentAdmin() {
      studentQueryStudentListByClassNumberWithStudentAdmin({
        studentNumber: this.teamMemberSelectionDialogData.queryPageForm.studentNumber,
        name: this.teamMemberSelectionDialogData.queryPageForm.name,
        classNumber: this.student.classNumber
      }).then((res) => {
        if (res.data.code === 200) {
          this.teamMemberSelectionDialogData.studentList = res.data.studentList
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
    choiceTeamMember(studentId) {
      studentAdminStudentChoiceTeamMember({
        studentAdminId: this.student.id,
        studentId: studentId
      }).then((res) => {
        if (res.data.code === 200) {
          this.queryStudentListByClassNumberWithStudentAdmin()
          this.queryStudentListByStudentAdminId()
          this.$message.success("选择成功")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    deleteTeamMember(studentId) {
      studentAdminStudentDeleteTeamMemberByStudentId({
        studentId: studentId
      }).then((res) => {
        if (res.data.code === 200) {
          this.queryStudentListByClassNumberWithStudentAdmin()
          this.queryStudentListByStudentAdminId()
          this.$message.success("删除成功")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    getByNowTimeWithStudentAdminStudentStatusRecordByStudentId(studentId) {
      studentAdminStudentStatusRecordDateGetByNowTimeWithStudentAdminStudentStatusRecordByStudentId({
        studentId: studentId
      }).then((res) => {
        if (res.data.code === 200) {
          if (isEmpty(res.data.studentAdminStudentStatusRecordDate)) {
            this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate = {}
            return
          }
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.id = res.data.studentAdminStudentStatusRecordDate.id
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.startTime = res.data.studentAdminStudentStatusRecordDate.startTime
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.endTime = res.data.studentAdminStudentStatusRecordDate.endTime
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.week = res.data.studentAdminStudentStatusRecordDate.week
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.semester = res.data.studentAdminStudentStatusRecordDate.semester

          if (isEmpty(res.data.studentAdminStudentStatusRecord)) {
            return
          }
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag = res.data.studentAdminStudentStatusRecord.onCampusFlag
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolReason = res.data.studentAdminStudentStatusRecord.leavingSchoolReason
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolDestination = res.data.studentAdminStudentStatusRecord.leavingSchoolDestination
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.scientificResearchProgress = res.data.studentAdminStudentStatusRecord.scientificResearchProgress
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.personalityTraits = res.data.studentAdminStudentStatusRecord.personalityTraits
          this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.abnormalIssues = res.data.studentAdminStudentStatusRecord.abnormalIssues
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    studentAdminStudentStatusRecordUpdate() {
      if (isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.student.id)) {
        this.$message.error("服务器异常")
        return
      } else if (isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.id)) {
        this.$message.error("服务器异常")
        return;
      } else if (isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag)) {
        this.$message.error("是否在校不能为空")
        return;
      } else if (!this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag && isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolReason)) {
        this.$message.error("学生若离校离校原因不能为空");
        return;
      } else if (!this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag && isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolDestination)) {
        this.$message.error("学生若离校离校去向不能为空");
        return;
      } else if (isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.scientificResearchProgress)) {
        this.$message.error("科研进展情况不能为空")
        return;
      } else if (isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.personalityTraits)) {
        this.$message.error("性格、优缺点不能为空")
        return;
      } else if (isEmpty(this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.abnormalIssues)) {
        this.$message.error("需要特别关注的问题不能为空")
        return;
      }

      studentAdminStudentStatusRecordUpdate({
        studentAdminId: this.student.id,
        studentId: this.studentStatusRecordDialogData.studentStatusRecordForm.student.id,
        studentAdminStudentStatusRecordDateId: this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecordDate.id,
        onCampusFlag: this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.onCampusFlag,
        leavingSchoolReason: this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolReason,
        leavingSchoolDestination: this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.leavingSchoolDestination,
        scientificResearchProgress: this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.scientificResearchProgress,
        personalityTraits: this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.personalityTraits,
        abnormalIssues: this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.abnormalIssues,
      }).then((res) => {
        if (res.data.code === 200) {
          this.closeStudentStatusRecordDialog()
          this.$message.success("记录成功")
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

    openTeamMemberSelectionDialog() {
      this.initTeamMemberSelectionDialogDataQueryPageForm()
      this.queryStudentListByClassNumberWithStudentAdmin()
      this.teamMemberSelectionDialogVis = true
    },
    openStudentStatusRecordDialog(item) {
      this.initStudentStatusRecordDialogDataStudentStatusRecordForm()

      this.studentStatusRecordDialogData.studentStatusRecordForm.student.id = item.id
      this.studentStatusRecordDialogData.studentStatusRecordForm.student.studentNumber = item.studentNumber
      this.studentStatusRecordDialogData.studentStatusRecordForm.student.name = item.name

      this.getByNowTimeWithStudentAdminStudentStatusRecordByStudentId(this.studentStatusRecordDialogData.studentStatusRecordForm.student.id)

      studentAdminStudentStatusRecordGetLastUpdateTimeByStudentId({
        studentId: item.id,
      }).then((res) => {
        if (res.data.code === 200) {
          if (!isEmpty(res.data.studentAdminStudentStatusRecord)) {
            console.log(JSON.stringify(this.studentStatusRecordDialogData))
            this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.scientificResearchProgress = res.data.studentAdminStudentStatusRecord.scientificResearchProgress
            console.log(JSON.stringify(this.studentStatusRecordDialogData))
            this.studentStatusRecordDialogData.studentStatusRecordForm.studentAdminStudentStatusRecord.personalityTraits = res.data.studentAdminStudentStatusRecord.personalityTraits
            console.log(JSON.stringify(this.studentStatusRecordDialogData))
          }
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
      this.$nextTick(() => {
        this.studentStatusRecordDialogVis = true
      })

    },
    closeStudentStatusRecordDialog() {
      this.studentStatusRecordDialogVis = false
    },

    selectStudentTable() {
      this.studentTableFlag = true
    },
    selectStudentStatusRecord(student) {
      this.studentTableFlag = false
      this.studentStatusRecord.student = student
      this.getStudentAdminStudentStatusRecordByStudentIdAndNowWithStudentAdminStudentStatusRecordDate(student.id)
    },

    toLogin() {
      this.$router.push("/login")
    },

    isEmpty,
  }
}
</script>

<style scoped>
#teamMemberManagement {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#teamMemberManagement .middle {
  display: flex;

  flex-flow: row;

  flex: 1;

  width: 100%;
  height: 0;
}

#teamMemberManagement .middle .studentTable {
  flex: 1;

  width: 0;
  height: 100%;
}

#teamMemberManagement .middle .studentTable .main {
  display: flex;

  flex-flow: column;

  flex: 1;

  width: 100%;
  height: 100%;
}

#teamMemberManagement .middle .studentTable .main .searchContainer {
  width: 100%;
}

#teamMemberManagement .middle .studentTable .main .searchContainer .searchInput {
  margin: 20px 0 0 20px;

  width: 200px;
}

#teamMemberManagement .middle .studentTable .main .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}

#teamMemberManagement .middle .studentTable .main .tableContainer {
  flex: 1;

  width: 100%;
  height: 0;
}

#teamMemberManagement .middle .studentTable .main .tableContainer /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

#teamMemberManagement .middle .studentTable .main .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}

#teamMemberManagement .middle .studentStatusRecord {
  flex: 1;

  width: 0;
  height: 100%;
}

#teamMemberManagement .middle .studentStatusRecord .pageHeader {
  margin: 20px 20px 0 20px;
}

#teamMemberManagement .middle .studentStatusRecord .studentInformationForm {
  margin: 10px 0 0 20px;
}

#teamMemberManagement .middle .studentStatusRecord .studentInformationForm .studentInformationFormItem {
  margin: 0 0 0 0;
}

#teamMemberManagement .middle .studentStatusRecord .studentStatusRecordTabs .studentStatusRecordTab .studentStatusRecordForm {
  margin: 0 0 0 20px;
}

#teamMemberManagement .middle .studentStatusRecord .studentStatusRecordTabs .studentStatusRecordTab .studentStatusRecordForm .studentStatusRecordFormItem {
  margin: 0 0 0 0;
}

#teamMemberManagement .teamMemberSelectionDialog /deep/ .el-dialog__body {
  padding: 0 0 20px 0;
}

#teamMemberManagement .teamMemberSelectionDialog .searchContainer {
  width: 100%;
}

#teamMemberManagement .teamMemberSelectionDialog .searchContainer .searchInput {
  margin: 20px 0 0 20px;

  width: 200px;
}

#teamMemberManagement .teamMemberSelectionDialog .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}

#teamMemberManagement .teamMemberSelectionDialog .tableContainer {

}

#teamMemberManagement .teamMemberSelectionDialog .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}

#teamMemberManagement .studentStatusRecordDialog .studentStatusRecordForm .studentStatusRecordFormItem .studentStatusRecordFormInput {
  width: 240px;
}

#teamMemberManagement .studentStatusRecordDialog .studentStatusRecordForm .footer {
  text-align: center;
}
</style>