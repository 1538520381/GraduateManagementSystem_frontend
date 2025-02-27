<template>
  <div id="studentAdminManagement">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="1"></SidebarMenu>
      <div class="main">
        <div class="searchContainer">
          <el-select class="searchInput" v-model="queryPageForm.classNumber" placeholder="请选择班级号" clearable>
            <el-option v-for="item in studentAdminClassNumberList" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
          <el-input class="searchInput" v-model="queryPageForm.studentNumber" prefix-icon="el-icon-search"
                    placeholder="学号"></el-input>
          <el-input class="searchInput" v-model="queryPageForm.name" prefix-icon="el-icon-search"
                    placeholder="姓名"></el-input>
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
            <el-table-column class="tableColumn" prop="type" label="类型">
              <template slot-scope="scope">
                {{ scope.row.type === 0 ? '普通学生' : '学生管理员' }}
              </template>
            </el-table-column>
            <el-table-column class="tableColumn" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-popconfirm title="确定取消管理员吗?" @confirm="setType(scope.row.id,0)">
                  <el-button type="text" size="small" slot="reference">取消管理员</el-button>
                </el-popconfirm>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="small" slot="reference" @click="openTeamMemberDialog(scope.row.id)">
                  查看组员
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              :page-size="pageSize"
              :total="total"
              layout="total,prev, pager, next"
              @current-change="selectPage">
          </el-pagination>
        </el-scrollbar>
      </div>
    </div>

    <el-dialog class="teamMemberDialog" title="组员列表" :visible.sync="teamMemberDialogVis">
      <el-table class="table" :data="teamMemberDialogData.studentList" empty-text="暂无学生">
        <el-table-column class="tableColumn" prop="classNumber" label="班级号"></el-table-column>
        <el-table-column class="tableColumn" prop="studentNumber" label="学号"></el-table-column>
        <el-table-column class="tableColumn" prop="name" label="姓名"></el-table-column>
      </el-table>
      <el-pagination
          style="width: 100%;text-align: center"
          :total="teamMemberDialogData.studentList.length"
          layout="total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import SidebarMenu from "@/components/sidebarMenu/index.vue";
import Header from "@/components/header/index.vue";

import {isEmpty} from "@/utils/common";
import {
  studentGetClassNumberListOfStudentAdmin, studentQueryListByStudentAdminId,
  studentQueryPageWithStudentAdmin,
  studentSetType
} from "@/apis/student";
import {adminGetAdminByToken} from "@/apis/admin";

export default {
  name: 'StudentAdminManagement',
  components: {
    Header,
    SidebarMenu,
  },
  data() {
    return {
      admin: null,

      studentList: [],
      studentAdminClassNumberList: [],

      queryPageForm: {},

      page: 0,
      pageSize: 10,
      total: 0,

      teamMemberDialogVis: false,
      teamMemberDialogData: {
        studentList: []
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

    this.getClassNumberListOfStudentAdmin()
    this.queryPage()
  },
  methods: {
    initQueryPageForm() {
      this.queryPageForm = {
        studentNumber: null,
        name: null,
        classNumber: null,
        type: 1,
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
    setType(id, type) {
      studentSetType({
        id: id,
        type: type
      }).then((res) => {
        if (res.data.code === 200) {
          this.getClassNumberListOfStudentAdmin()
          this.queryPage()
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
    getClassNumberListOfStudentAdmin() {
      studentGetClassNumberListOfStudentAdmin().then((res) => {
        if (res.data.code === 200) {
          this.studentAdminClassNumberList = res.data.classNumberSet
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

    openTeamMemberDialog(studentAdminId) {
      studentQueryListByStudentAdminId({
        studentNumber: null,
        name: null,
        studentAdminId: studentAdminId
      }).then((res) => {
        if (res.data.code === 200) {
          this.teamMemberDialogData.studentList = res.data.studentList
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
      this.teamMemberDialogVis = true
    },

    toLogin() {
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
#studentAdminManagement {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#studentAdminManagement .middle {
  display: flex;

  flex-flow: row;

  flex: 1;

  width: 100%;
  height: 0;
}

#studentAdminManagement .middle .main {
  display: inline-flex;

  flex-flow: column;

  flex: 1;

  width: 0;
  height: 100%;
}

#studentAdminManagement .middle .main .searchContainer {
  width: 100%;
}

#studentAdminManagement .middle .main .searchContainer .searchInput {
  margin: 20px 0 0 20px;

  width: 200px;
}

#studentAdminManagement .middle .main .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}

#studentAdminManagement .middle .main .tableContainer {
  flex: 1;

  width: 100%;
  height: 0;

  text-align: center;
}

#studentAdminManagement .middle .main .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}
</style>