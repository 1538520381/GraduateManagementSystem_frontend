<template>
  <div id="studentStatusRecordDate">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="4"></SidebarMenu>
      <div class="main">
        <div class="controlContainer">
          <el-button class="controlButton" type="primary" @click="openAddStudentStatusRecordDateDialog">新增</el-button>
        </div>
        <el-scrollbar class="tableContainer">
          <el-table class="table" ref="table" :data="studentAdminStudentStatusRecordDateList" empty-text="暂无时间">
            <el-table-column class="tableColumn" prop="semester" label="学期"
                             show-overflow-tooltip></el-table-column>
            <el-table-column class="tableColumn" prop="week" label="周"
                             show-overflow-tooltip></el-table-column>
            <el-table-column class="tableColumn" label="开始时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ formatTimestamp(scope.row.startTime) }}
              </template>
            </el-table-column>
            <el-table-column class="tableColumn" label="结束时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ formatTimestamp(scope.row.endTime) }}
              </template>
            </el-table-column>
            <el-table-column class="tableColumn" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-popconfirm title="确定要删除吗？删除后已填写的将消失！！！"
                               @confirm="deleteStudentAdminStudentStatusRecord(scope.row.id)">
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
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

    <el-dialog class="addStudentStatusRecordDateDialog" title="新增时间"
               :visible.sync="addStudentStatusRecordDateDialogVis"
               :close-on-click-modal="false" width="500px">
      <el-form class="addStudentStatusRecordDateForm">
        <el-form-item class="addStudentStatusRecordDateFormItem" label="学期" label-width="100px">
          <el-input class="addStudentStatusRecordDateFormInput"
                    v-model="addStudentStatusRecordDateForm.semester" placeholder="请输入学期"></el-input>
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" label="周" label-width="100px">
          <el-input class="addStudentStatusRecordDateFormInput"
                    v-model="addStudentStatusRecordDateForm.week" placeholder="请输入周"></el-input>
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" label="开始时间" label-width="100px">
          <el-date-picker
              class="addStudentStatusRecordDateFormInput"
              v-model="addStudentStatusRecordDateForm.startTime"
              type="datetime"
              placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" label="结束时间" label-width="100px">
          <el-date-picker
              class="addStudentStatusRecordDateFormInput"
              v-model="addStudentStatusRecordDateForm.endTime"
              type="datetime"
              placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <div class="footer">
          <el-button @click="closeStudentStatusRecordDateDialog">取消</el-button>
          <el-button type="primary" @click="addStudentStatusRecordDate">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SidebarMenu from "@/components/sidebarMenu/index.vue";
import Header from "@/components/header/index.vue";
import {adminGetAdminByToken} from "@/apis/admin";
import {
  studentAdminStudentStatusRecordDateAdd,
  studentAdminStudentStatusRecordDateDeleteById,
  studentAdminStudentStatusRecordDateGetPage
} from "@/apis/studentAdminStudentStatusRecordDate";
import {formatTimestamp} from "../../../utils/common";

export default {
  name: 'StudentStatusRecordDate',
  components: {Header, SidebarMenu},
  data() {
    return {
      admin: null,

      studentAdminStudentStatusRecordDateList: [],

      addStudentStatusRecordDateForm: {},

      page: 0,
      pageSize: 10,
      total: 0,

      addStudentStatusRecordDateDialogVis: false,
    }
  },
  async created() {
    await this.getAdminByToken()

    this.initAddStudentStatusRecordDateForm()

    this.getStudentAdminStudentStatusRecordDatePage()
  },
  methods: {
    initAddStudentStatusRecordDateForm() {
      this.addStudentStatusRecordDateForm = {
        semester: null,
        week: null,
        startTime: null,
        endTime: null,
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

    getStudentAdminStudentStatusRecordDatePage() {
      studentAdminStudentStatusRecordDateGetPage({
        page: this.page,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.data.code === 200) {
          this.studentAdminStudentStatusRecordDateList = res.data.pageInfo.records
          this.total = res.data.pageInfo.total
          if (res.data.pageInfo.pages < this.page) {
            this.page = res.data.pageInfo.pages
            this.getStudentAdminStudentStatusRecordDatePage()
          }
          console.log(this.studentAdminStudentStatusRecordDateList)
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    deleteStudentAdminStudentStatusRecord(id) {
      studentAdminStudentStatusRecordDateDeleteById({
        id: id
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("删除成功")
          this.getStudentAdminStudentStatusRecordDatePage()
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    addStudentStatusRecordDate() {
      studentAdminStudentStatusRecordDateAdd({
        startTime: this.addStudentStatusRecordDateForm.startTime,
        endTime: this.addStudentStatusRecordDateForm.endTime,
        semester: this.addStudentStatusRecordDateForm.semester,
        week: this.addStudentStatusRecordDateForm.week
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("新增成功")
          this.getStudentAdminStudentStatusRecordDatePage()
          this.closeStudentStatusRecordDateDialog()
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
      this.getStudentAdminStudentStatusRecordDatePage()
    },

    openAddStudentStatusRecordDateDialog() {
      this.addStudentStatusRecordDateDialogVis = true
      this.initAddStudentStatusRecordDateForm()
    },
    closeStudentStatusRecordDateDialog() {
      this.addStudentStatusRecordDateDialogVis = false
    },

    formatTimestamp,
  }
}
</script>

<style scoped>
#studentStatusRecordDate {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#studentStatusRecordDate .middle {
  display: flex;

  flex-flow: row;

  flex: 1;

  width: 100%;
  height: 0;
}

#studentStatusRecordDate .middle .main {
  display: inline-flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#studentStatusRecordDate .middle .main .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}

#studentStatusRecordDate .middle .main .tableContainer {
  flex: 1;

  width: 100%;
  height: 0;

  text-align: center;
}

#studentStatusRecordDate .middle .main .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}

#studentStatusRecordDate .addStudentStatusRecordDateDialog .addStudentStatusRecordDateForm .addStudentStatusRecordDateFormItem .addStudentStatusRecordDateFormInput {
  width: 240px;
}
</style>