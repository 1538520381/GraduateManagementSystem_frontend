<template>
  <div id="questionnaireManagementSystem">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="5"></SidebarMenu>
      <div class="main">
        <div class="controlContainer">
          <el-button class="controlButton" type="primary" @click="openAddQuestionnaireDialog">新增</el-button>
        </div>
        <el-scrollbar class="tableContainer">
          <el-table class="table" ref="table" :data="questionnaireList" empty-text="暂无问卷">
            <el-table-column class="tableColumn" prop="name" label="问卷名称"
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
                               @confirm="deleteQuestionnaire(scope.row.id)">
                  <el-button style="color: #ff0000" type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="small" slot="reference"
                           @click="openUpdateQuestionnaireDialog(scope.row)">详情
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

    <el-dialog class="addStudentStatusRecordDateDialog" title="新增问卷"
               :visible.sync="addQuestionnaireDialogVis"
               :close-on-click-modal="false" width="500px">
      <el-form class="addStudentStatusRecordDateForm">
        <el-form-item class="addStudentStatusRecordDateFormItem" label="问卷名称" label-width="100px">
          <el-input class="addStudentStatusRecordDateFormInput"
                    v-model="addQuestionnaireForm.name" placeholder="请输入问卷名称"></el-input>
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" label="开始时间" label-width="100px">
          <el-date-picker
              class="addStudentStatusRecordDateFormInput"
              v-model="addQuestionnaireForm.startTime"
              type="datetime"
              placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" label="结束时间" label-width="100px">
          <el-date-picker
              class="addStudentStatusRecordDateFormInput"
              v-model="addQuestionnaireForm.endTime"
              type="datetime"
              placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" :label="'题目' + (index + 1)" label-width="100px"
                      v-for="(item,index) in addQuestionnaireForm.questionNum">
          <el-input class="addStudentStatusRecordDateFormInput"
                    v-model="addQuestionnaireForm['question' + (index + 1)]"
                    :placeholder="'请输入题目' + (index + 1)"></el-input>
          <el-button class="circleButton" icon="el-icon-plus" circle
                     v-if="index + 1 === addQuestionnaireForm.questionNum" @click="addQuestionnaireNum"></el-button>
          <el-button class="circleButton" icon="el-icon-minus" circle
                     v-if="index + 1 === addQuestionnaireForm.questionNum && addQuestionnaireForm.questionNum !== 1"
                     @click="reduceQuestionnaireNum"></el-button>
        </el-form-item>
        <div class="footer">
          <el-button @click="closeQuestionnaireDialog">取消</el-button>
          <el-button type="primary" @click="addQuestionnaire">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog class="updateStudentStatusRecordDateDialog" title="问卷详情"
               :visible.sync="updateQuestionnaireDialogVis"
               :close-on-click-modal="false" width="500px">
      <el-form class="addStudentStatusRecordDateForm">
        <el-form-item class="addStudentStatusRecordDateFormItem" label="问卷名称" label-width="100px">
          {{updateQuestionnaireForm.name}}
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" label="开始时间" label-width="100px">
          {{formatTimestamp(updateQuestionnaireForm.startTime)}}
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" label="结束时间" label-width="100px">
          {{ formatTimestamp(updateQuestionnaireForm.endTime)}}
        </el-form-item>
        <el-form-item class="addStudentStatusRecordDateFormItem" :label="'题目' + (index + 1)" label-width="100px"
                      v-for="(item,index) in updateQuestionnaireForm.questionNum">
          {{updateQuestionnaireForm['question' + (index + 1)]}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/header/index.vue";
import SidebarMenu from "@/components/sidebarMenu/index.vue";
import {adminGetAdminByToken} from "@/apis/admin";
import {questionnaireAdd, questionnaireDeleteById, questionnaireGetPage} from "@/apis/questionnaire";
import {formatTimestamp, isEmpty} from "@/utils/common";

export default {
  name: "QuestionnaireManagementSystem",
  components: {SidebarMenu, Header},
  data() {
    return {
      admin: null,

      questionnaireList: [],

      page: 0,
      pageSize: 10,
      total: 0,

      addQuestionnaireDialogVis: false,
      addQuestionnaireForm: {
        name: null,
        startTime: null,
        endTime: null,
        questionNum: 1,
        question1: null
      },

      updateQuestionnaireDialogVis: false,
      updateQuestionnaireForm: {
        name: null,
        startTime: null,
        endTime: null,
        questionNum: 1,
        question1: null
      },
    }
  },
  async created() {
    await this.getAdminByToken()

    this.initAddQuestionnaireForm()

    this.getQuestionnairePage()
  },
  methods: {
    formatTimestamp,
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

    initAddQuestionnaireForm() {
      this.addQuestionnaireForm = {
        name: null,
        startTime: null,
        endTime: null,
        questionNum: 1,
        question1: null
      }
    },
    initUpdateQuestionnaireForm() {
      this.addQuestionnaireForm = {
        name: null,
        startTime: null,
        endTime: null,
        questionNum: 1,
        question1: null
      }
    },

    getQuestionnairePage() {
      questionnaireGetPage({
        page: this.page,
        pageSize: this.pageSize,
      }).then((res) => {
        if (res.data.code === 200) {
          this.questionnaireList = res.data.pageInfo.records
          this.total = res.data.pageInfo.total
          if (res.data.pageInfo.pages < this.page) {
            this.page = res.data.pageInfo.pages
            this.getQuestionnairePage()
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
    addQuestionnaire() {
      let data = {
        name: this.addQuestionnaireForm.name,
        startTime: this.addQuestionnaireForm.startTime,
        endTime: this.addQuestionnaireForm.endTime,
        questionList: []
      }
      for (let i = 0; i < this.addQuestionnaireForm.questionNum; i++) {
        if (!isEmpty(this.addQuestionnaireForm['question' + (i + 1)]) && !isEmpty(this.addQuestionnaireForm['question' + (i + 1)].trim())) {
          data.questionList.push(this.addQuestionnaireForm['question' + (i + 1)].trim())
        }
      }
      questionnaireAdd(data).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("新增成功")
          this.getQuestionnairePage()
          this.closeQuestionnaireDialog()
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    deleteQuestionnaire(id) {
      questionnaireDeleteById({
        id: id
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("删除成功")
          this.getQuestionnairePage()
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },

    addQuestionnaireNum() {
      this.addQuestionnaireForm.questionNum++;
    },
    reduceQuestionnaireNum() {
      if (this.addQuestionnaireForm.questionNum > 1) {
        this.addQuestionnaireForm.questionNum--;
      }
    },

    openAddQuestionnaireDialog() {
      this.initAddQuestionnaireForm()
      this.addQuestionnaireDialogVis = true
    },
    closeQuestionnaireDialog() {
      this.addQuestionnaireDialogVis = false
    },
    openUpdateQuestionnaireDialog(item) {
      this.initUpdateQuestionnaireForm()
      this.updateQuestionnaireForm.name = item.name
      this.updateQuestionnaireForm.startTime = item.startTime
      this.updateQuestionnaireForm.endTime = item.endTime
      for (let i = 0; i < item.questionnaireQuestionList.length; i++) {
        this.updateQuestionnaireForm['question' + (i + 1)] = item.questionnaireQuestionList[i].stem
      }
      this.updateQuestionnaireForm.questionNum = item.questionnaireQuestionList.length
      this.updateQuestionnaireDialogVis = true
    },

    selectPage(page) {
      this.page = page
      this.getQuestionnairePage()
    },
  }
}
</script>

<style scoped>
#questionnaireManagementSystem {
  width: 100%;
  height: 100%;
}

#questionnaireManagementSystem {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#questionnaireManagementSystem .middle {
  display: flex;

  flex-flow: row;

  flex: 1;

  width: 100%;
  height: 0;
}

#questionnaireManagementSystem .middle .main {
  display: inline-flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#questionnaireManagementSystem .middle .main .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}


#questionnaireManagementSystem .middle .main .tableContainer {
  flex: 1;

  width: 100%;
  height: 0;

  text-align: center;
}

#questionnaireManagementSystem .middle .main .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}

#questionnaireManagementSystem .addStudentStatusRecordDateDialog .addStudentStatusRecordDateForm .addStudentStatusRecordDateFormItem .addStudentStatusRecordDateFormInput {
  width: 240px;
}

#questionnaireManagementSystem .addStudentStatusRecordDateDialog .addStudentStatusRecordDateForm .addStudentStatusRecordDateFormItem .circleButton {
  margin: 0 0 0 10px;
}
</style>