<template>
  <div id="studentStatusRecord">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="2"></SidebarMenu>
      <div class="studentTable" v-if="studentTableFlag">
        <div class="main">
          <div class="searchContainer">
            <el-input class="searchInput" v-model="queryPageForm.studentNumber" prefix-icon="el-icon-search"
                      placeholder="学号"></el-input>
            <el-input class="searchInput" v-model="queryPageForm.name" prefix-icon="el-icon-search"
                      placeholder="姓名"></el-input>
            <el-input class="searchInput" v-model="queryPageForm.classNumber" prefix-icon="el-icon-search"
                      placeholder="班级号"></el-input>
            <el-select class="searchInput" v-model="queryPageForm.type" placeholder="请选择类型" clearable>
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="controlContainer">
            <el-button class="controlButton" type="primary" @click="queryPage">搜索</el-button>
          </div>
          <div class="tableContainer">
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
                    学生状态记录详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                :current-page="page"
                :page-size="pageSize"
                :total="total"
                layout="prev, pager, next"
                @current-change="selectPage">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="studentStatusRecord" v-else>
        <el-page-header class="pageHeader" @back="selectStudentTable"
                        content="学生状态记录详情"></el-page-header>
        <el-form class="studentInformationForm">
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
                       :label="item.studentAdminStudentStatusRecordDate.name">
            <el-form class="studentStatusRecordForm">
              <el-form-item class="studentStatusRecordFormItem" label="时间">
                {{
                  formatTimestamp(item.studentAdminStudentStatusRecordDate.startTime) + ' —— ' + formatTimestamp(item.studentAdminStudentStatusRecordDate.endTime)
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
                <el-form-item class="studentStatusRecordFormItem" label="异常问题">
                  {{ item.abnormalIssues }}
                </el-form-item>
              </div>
            </el-form>
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
import {studentQueryPageWithStudentAdmin} from "@/apis/student";
import {adminGetAdminByToken} from "@/apis/admin";
import {
  studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate
} from "@/apis/studentAdminStudentStatusRecord";

export default {
  name: 'StudentStatusRecord',
  components: {
    Header,
    SidebarMenu,
  },
  data() {
    return {
      admin: null,

      studentTableFlag: true,

      studentList: [],

      queryPageForm: {},

      page: 0,
      pageSize: 5,
      total: 0,

      studentStatusRecord: {
        student: null,
        studentStatusRecords: []
      },

      tabsActive: '0',

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
    getStudentAdminStudentStatusRecordByStudentIdAndNowWithStudentAdminStudentStatusRecordDate(studentId) {
      studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate({studentId: studentId}).then((res) => {
        if (res.data.code === 200) {
          this.studentStatusRecord.studentStatusRecords = res.data.withStudentAdminStudentStatusRecordDateVOList
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
</style>