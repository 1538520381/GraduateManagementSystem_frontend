<template>
  <div id="internshipApplicationManagement">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="5"></SidebarMenu>
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
          <el-select class="searchInput" v-model="queryPageForm.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="controlContainer">
          <el-button class="controlButton" type="primary" @click="queryPage">搜索</el-button>
        </div>
        <el-scrollbar class="tableContainer">
          <el-table class="table" ref="table" :data="internshipApplicationList" empty-text="暂无申请">
            <el-table-column class="tableColumn" prop="student.classNumber" label="班级号"
                             show-overflow-tooltip></el-table-column>
            <el-table-column class="tableColumn" prop="student.studentNumber" label="学号"
                             show-overflow-tooltip></el-table-column>
            <el-table-column class="tableColumn" prop="student.name" label="姓名"
                             show-overflow-tooltip></el-table-column>
            <el-table-column class="tableColumn" label="实习开始时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ formatTimestamp(scope.row.internshipStartTime) }}
              </template>
            </el-table-column>
            <el-table-column class="tableColumn" label="实习结束时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ formatTimestamp(scope.row.internshipEndTime) }}
              </template>
            </el-table-column>
            <el-table-column class="tableColumn" prop="internshipUnit" label="实习单位名称"
                             show-overflow-tooltip></el-table-column>
            <el-table-column class="tableColumn" prop="createTime" label="申请时间"
                             show-overflow-tooltip></el-table-column>
            <el-table-column class="tableColumn" fixed="right" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ internshipApplicationStatusDict[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column class="tableColumn" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openInternshipApplicationDetailsDialog(scope.row)">详情
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

    <el-dialog class="internshipApplicationDetailDialog" title="申请详情" width="450px"
               :visible.sync="internshipApplicationDetailDialogVis">
      <el-form class="internshipApplicationDetailForm" v-if="!isEmpty(internshipApplication)">
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="班级">
          {{ internshipApplication.student.classNumber }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="学号">
          {{ internshipApplication.student.studentNumber }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="姓名">
          {{ internshipApplication.student.name }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="实习开始时间">
          {{ formatTimestamp(internshipApplication.internshipStartTime) }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="实习结束时间">
          {{ formatTimestamp(internshipApplication.internshipEndTime) }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="实习单位名称">
          {{ internshipApplication.internshipUnit }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="是否校外住宿">
          {{ internshipApplication.offCampusHousingFlag ? '是' : '否' }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="实习申请单">
          <FileContainer :file="internshipApplication.internshipApplicationFormDocument"></FileContainer>
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="家长知情书">
          <FileContainer :file="internshipApplication.parentalNotificationLetterDocument"></FileContainer>
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="状态">
          {{ internshipApplicationStatusDict[internshipApplication.status] }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="备注"
                      v-if="!isEmpty(internshipApplication.remark)">
          {{ internshipApplication.remark }}
        </el-form-item>
        <el-form-item class="internshipApplicationDetailFormItem"
                      :label-width="internshipApplicationDetailFormItemWidth" label="备注"
                      v-if="internshipApplication.status === 0">
          <el-input v-model="updateInternshipApplicationForm.remark" type="textarea" maxlength="500"
                    placeholder="可输入需向学生回复的内容(500字以内）"></el-input>
        </el-form-item>
        <div class="footer" v-if="internshipApplication.status === 0">
          <el-popconfirm title="确定通过吗?" @confirm="updateInternshipApplicationById({
                  id: internshipApplication.id,
                  status: 2,
                  remark: updateInternshipApplicationForm.remark,
                })">
            <el-button class="controlButton" type="primary" slot="reference">通过</el-button>
          </el-popconfirm>
          <el-popconfirm title="确定驳回吗?" @confirm="updateInternshipApplicationById({
                  id: internshipApplication.id,
                  status: 3,
                  remark: updateInternshipApplicationForm.remark,
                })">
            <el-button class="controlButton" type="danger" slot="reference">驳回</el-button>
          </el-popconfirm>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/header/index.vue";
import SidebarMenu from "@/components/sidebarMenu/index.vue";
import {adminGetAdminByToken} from "@/apis/admin";
import {
  internshipApplicationQueryPageWithoutStatus1WithStudentAndDocument,
  internshipApplicationUpdateById
} from "@/apis/internshipApplication";
import {formatTimestamp, isEmpty} from "@/utils/common";
import FileContainer from "@/components/fileContainer/index.vue";
import {studentGetClassNumberList} from "@/apis/student";

export default {
  name: 'InternshipApplicationManagement',
  components: {FileContainer, SidebarMenu, Header},
  data() {
    return {
      admin: null,

      queryPageForm: {},

      internshipApplicationList: [],
      studentClassNumberList: [],

      page: 0,
      pageSize: 10,
      total: 0,

      internshipApplicationDetailDialogVis: false,
      internshipApplication: null,
      internshipApplicationDetailFormItemWidth: '100px',
      updateInternshipApplicationForm: {},

      statusOptions: [
        {
          value: 0,
          label: '待审核',
        },
        {
          value: 2,
          label: '审核通过',
        },
        {
          value: 3,
          label: '审核驳回',
        },
      ],

      internshipApplicationStatusDict: {
        0: '待审核',
        1: '撤回',
        2: '审核通过',
        3: '审核驳回'
      }
    }
  },
  async created() {
    await this.getAdminByToken()

    this.initQueryPageForm()
    this.initUpdateInternshipApplicationForm()

    this.queryPage()
    this.getClassNumberList()
  },
  methods: {
    formatTimestamp,
    isEmpty,
    initQueryPageForm() {
      this.queryPageForm = {
        studentNumber: null,
        name: null,
        classNumber: null,
      }
    },
    initUpdateInternshipApplicationForm() {
      this.updateInternshipApplicationForm = {
        remark: null
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
      internshipApplicationQueryPageWithoutStatus1WithStudentAndDocument({
        page: this.page,
        pageSize: this.pageSize,
        studentNumber: isEmpty(this.queryPageForm.studentNumber) ? null : this.queryPageForm.studentNumber,
        name: isEmpty(this.queryPageForm.name) ? null : this.queryPageForm.name,
        classNumber: isEmpty(this.queryPageForm.classNumber) ? null : this.queryPageForm.classNumber,
        status: isEmpty(this.queryPageForm.status) ? null : this.queryPageForm.status,
      }).then((res) => {
        if (res.data.code === 200) {
          this.internshipApplicationList = res.data.queryPageWithoutStatus1WithStudentVOPage.records
          this.total = res.data.queryPageWithoutStatus1WithStudentVOPage.total
          if (res.data.queryPageWithoutStatus1WithStudentVOPage.pages < this.page) {
            this.page = res.data.queryPageWithoutStatus1WithStudentVOPage.pages
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
    updateInternshipApplicationById(updateInternshipApplicationByIdForm) {
      internshipApplicationUpdateById({
        id: updateInternshipApplicationByIdForm.id,
        status: isEmpty(updateInternshipApplicationByIdForm.status) ? null : updateInternshipApplicationByIdForm.status,
        remark: isEmpty(updateInternshipApplicationByIdForm.remark) ? null : updateInternshipApplicationByIdForm.remark.trim()
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("更新成功")
          this.queryPage()
          this.closeInternshipApplicationDetailsDialog()
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },

    openInternshipApplicationDetailsDialog(internshipApplication) {
      this.initUpdateInternshipApplicationForm()
      this.internshipApplication = internshipApplication
      this.internshipApplicationDetailDialogVis = true
    },
    closeInternshipApplicationDetailsDialog() {
      this.internshipApplicationDetailDialogVis = false
    },

    selectPage(page) {
      this.page = page
      this.queryPage()
    },
  }
}
</script>

<style scoped>
#internshipApplicationManagement {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#internshipApplicationManagement .middle {
  display: flex;

  flex-flow: row;

  flex: 1;

  width: 100%;
  height: 0;
}

#internshipApplicationManagement .middle .main {
  display: inline-flex;

  flex-flow: column;

  flex: 1;

  width: 0;
  height: 100%;
}

#internshipApplicationManagement .middle .main .searchContainer {
  width: 100%;
}

#internshipApplicationManagement .middle .main .searchContainer .searchInput {
  margin: 20px 0 0 20px;

  width: 200px;
}

#internshipApplicationManagement .middle .main .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}

#internshipApplicationManagement .middle .main .tableContainer {
  flex: 1;

  width: 100%;
  height: 0;

  text-align: center;
}

#internshipApplicationManagement .middle .main .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}

#internshipApplicationManagement .internshipApplicationDetailDialog /deep/ .el-dialog__body {
  padding-top: 0;
}

#internshipApplicationManagement .internshipApplicationDetailDialog .internshipApplicationDetailForm .internshipApplicationDetailFormItem {
  margin: 0 0 0 0;
}

#internshipApplicationManagement .internshipApplicationDetailDialog .internshipApplicationDetailForm .footer {
  margin: 10px 0 0 0;

  text-align: right;
}

#internshipApplicationManagement .internshipApplicationDetailDialog .internshipApplicationDetailForm .footer .controlButton {
  margin: 0 0 0 10px;
}

</style>