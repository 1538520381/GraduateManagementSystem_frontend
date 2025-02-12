<template>
  <div id="internshipApplication">
    <StudentHeader title="实习申请"></StudentHeader>
    <div class="middle">
      <div class="addMain" v-if="tabFlag === 0">
        <div class="history" @click="historyTab">历史申请记录
          <svg-icon class="rightIcon" icon-class="right"></svg-icon>
        </div>
        <el-scrollbar class="internshipApplicationScrollbar">
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
            <el-form-item class="internshipApplicationFormItem" label="实习开始时间"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-date-picker
                  class="internshipApplicationInput"
                  v-model="internshipApplicationForm.internshipStartTime"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="internshipApplicationFormItem" label="实习结束时间"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-date-picker
                  class="internshipApplicationInput"
                  v-model="internshipApplicationForm.internshipEndTime"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="internshipApplicationFormItem" label="实习单位名称"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-input class="internshipApplicationInput" v-model="internshipApplicationForm.internshipUnit"
                        placeholder="输入实习单位名称"></el-input>
            </el-form-item>
            <el-form-item class="internshipApplicationFormItem" label="是否校外住宿"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-radio v-model="internshipApplicationForm.offCampusHousingFlag" :label="false">否</el-radio>
              <el-radio v-model="internshipApplicationForm.offCampusHousingFlag" :label="true">是</el-radio>
            </el-form-item>
            <el-form-item class="internshipApplicationFormItem" label="实习申请单"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-button @click="downloadStaticFile('计算机学院研究生开展就业实习申请单.docx')">模板下载</el-button>
              <el-button type="primary"><label for="uploadInternshipApplicationFormDocument">文件上传</label>
              </el-button>
              <input type="file" id="uploadInternshipApplicationFormDocument"
                     ref="uploadInternshipApplicationFormDocument"
                     @change="uploadInternshipApplicationFormDocument($event)"
                     style="display: none"/>
              <FileContainer :file="internshipApplicationForm.internshipApplicationFormDocument"
                             v-if="!isEmpty(internshipApplicationForm.internshipApplicationFormDocument)"></FileContainer>
            </el-form-item>
            <el-form-item class="internshipApplicationFormItem" label="家长知情书"
                          :label-width="internshipApplicationFormItemLabelWidth">
              <el-button @click="downloadStaticFile('实习家长知情书.doc')">模板下载</el-button>
              <el-button type="primary"><label for="uploadParentalNotificationLetterDocument">文件上传</label>
              </el-button>
              <input type="file" id="uploadParentalNotificationLetterDocument"
                     ref="uploadParentalNotificationLetterDocument"
                     @change="uploadParentalNotificationLetterDocument($event)"
                     style="display: none"/>
              <FileContainer :file="internshipApplicationForm.parentalNotificationLetterDocument"
                             v-if="!isEmpty(internshipApplicationForm.parentalNotificationLetterDocument)"></FileContainer>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button @click="toStudentHome">取消</el-button>
            <el-button type="primary" @click="addInternshipApplication">提交</el-button>
          </div>
        </el-scrollbar>
      </div>
      <div class="historyMain" v-if="tabFlag === 1">
        <el-page-header class="pageHeader" @back="addTab" content="历史申请记录"></el-page-header>
        <el-scrollbar class="historyListScrollbar">
          <div class="historyListEmpty" v-if="isEmpty(internshipApplicationList)">暂无记录</div>
          <div class="historyList" v-else>
            <el-form class="historyForm" v-for="(item,index) in internshipApplicationList">
              <el-form-item class="historyFormItem" label="实习开始时间">
                {{ formatTimestamp(item.internshipStartTime) }}
              </el-form-item>
              <el-form-item class="historyFormItem" label="实习结束时间">
                {{ formatTimestamp(item.internshipEndTime) }}
              </el-form-item>
              <el-form-item class="historyFormItem" label="实习单位名称">
                {{ item.internshipUnit }}
              </el-form-item>
              <el-form-item class="historyFormItem" label="是否校外住宿">
                {{ item.offCampusHousingFlag ? '是' : '否' }}
              </el-form-item>
              <el-form-item class="historyFormItem" label="实习申请单">
                <FileContainer :file="item.internshipApplicationFormDocument"></FileContainer>
              </el-form-item>
              <el-form-item class="historyFormItem" label="家长知情书">
                <FileContainer :file="item.parentalNotificationLetterDocument"></FileContainer>
              </el-form-item>
              <el-form-item class="historyFormItem" label="状态">
                {{ internshipApplicationStatusDict[item.status] }}
              </el-form-item>
              <el-form-item class="historyFormItem" label="备注" v-if="!isEmpty(item.remark)">
                {{ item.remark }}
              </el-form-item>
              <div class="footer" v-if="item.status === 0">
                <el-popconfirm title="确定撤回吗?" @confirm="updateInternshipApplicationById({
                  id: item.id,
                  status: 1,
                })">
                  <el-button type="primary" slot="reference">撤回</el-button>
                </el-popconfirm>
              </div>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import StudentHeader from "@/components/student/header/index.vue";
import SvgIcon from "@/components/svgIcon/index.vue";
import {studentGetStudentByToken} from "@/apis/student";
import {documentUpload} from "@/apis/document";
import FileContainer from "@/components/fileContainer/index.vue";
import {formatTimestamp, isEmpty} from "@/utils/common";
import {
  internshipApplicationAdd,
  internshipApplicationListByStudentId,
  internshipApplicationUpdateById
} from "@/apis/internshipApplication";

export default {
  name: 'InternshipApplication',
  components: {FileContainer, SvgIcon, StudentHeader}, data() {
    return {
      student: null,

      internshipApplicationForm: {},
      internshipApplicationFormItemLabelWidth: '100px',

      internshipApplicationList: [],

      tabFlag: 0,

      internshipApplicationStatusDict: {
        0: '待审核',
        1: '撤回',
        2: '审核通过',
        3: '审核驳回'
      }
    }
  },
  async created() {
    await this.getStudentByToken()

    this.initInternshipApplicationForm()

    this.listInternshipApplicationByStudentId()
  },
  methods: {
    formatTimestamp,
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

    initInternshipApplicationForm() {
      this.internshipApplicationForm = {
        classNumber: this.student.classNumber,
        studentNumber: this.student.studentNumber,
        name: this.student.name,
        internshipStartTime: null,
        internshipEndTime: null,
        internshipUnit: null,
        offCampusHousingFlag: null,
        internshipApplicationFormDocument: null,
        parentalNotificationLetterDocument: null
      }
    },

    uploadInternshipApplicationFormDocument(event) {
      if (event.target.files[0] === undefined) {
        return
      }
      documentUpload({
        document: event.target.files[0],
      }).then((res) => {
        if (res.data.code === 200) {
          this.internshipApplicationForm.internshipApplicationFormDocument = res.data.document
          this.$message.success("上传成功")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      }).finally(() => {
        document.getElementById('uploadInternshipApplicationFormDocument').value = null
      })
    },
    uploadParentalNotificationLetterDocument(event) {
      if (event.target.files[0] === undefined) {
        return
      }
      documentUpload({
        document: event.target.files[0],
      }).then((res) => {
        if (res.data.code === 200) {
          this.internshipApplicationForm.parentalNotificationLetterDocument = res.data.document
          this.$message.success("上传成功")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      }).finally(() => {
        document.getElementById('uploadParentalNotificationLetterDocument').value = null
      })
    },
    addInternshipApplication() {
      if (isEmpty(this.internshipApplicationForm.internshipStartTime)) {
        this.$message.error("实习开始时间不能为空");
        return
      } else if (isEmpty(this.internshipApplicationForm.internshipEndTime)) {
        this.$message.error("实习结束时间不能为空")
        return
      } else if (isEmpty(this.internshipApplicationForm.internshipUnit)) {
        this.$message.error("实习单位名称不能为空")
        return
      } else if (isEmpty(this.internshipApplicationForm.offCampusHousingFlag)) {
        this.$message.error("是否校外住宿不能为空")
        return
      } else if (isEmpty(this.internshipApplicationForm.internshipApplicationFormDocument)) {
        this.$message.error("实习申请单不能为空")
        return
      } else if (isEmpty(this.internshipApplicationForm.parentalNotificationLetterDocument)) {
        this.$message.error("家长知情书不能为空")
        return
      }


      internshipApplicationAdd({
        studentId: this.student.id,
        internshipStartTime: this.internshipApplicationForm.internshipStartTime,
        internshipEndTime: this.internshipApplicationForm.internshipEndTime,
        internshipUnit: this.internshipApplicationForm.internshipUnit,
        offCampusHousingFlag: this.internshipApplicationForm.offCampusHousingFlag,
        internshipApplicationFormDocumentId: this.internshipApplicationForm.internshipApplicationFormDocument.id,
        parentalNotificationLetterDocumentId: this.internshipApplicationForm.parentalNotificationLetterDocument.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.initInternshipApplicationForm()
          this.listInternshipApplicationByStudentId()
          this.$message.success("成功发起申请")
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },
    listInternshipApplicationByStudentId() {
      internshipApplicationListByStudentId({
        studentId: this.student.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.internshipApplicationList = res.data.listByStudentIdWithDocumentVOList
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
        status: isEmpty(updateInternshipApplicationByIdForm.status) ? null : updateInternshipApplicationByIdForm.status
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("更新成功")
          this.listInternshipApplicationByStudentId()
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器异常，请联系管理员")
      })
    },

    downloadStaticFile(fileName) {
      let a = document.createElement("a");
      a.href = "/static/download/" + fileName;
      a.download = fileName;
      a.click();
    },

    addTab() {
      this.tabFlag = 0
    },
    historyTab() {
      this.tabFlag = 1
    },

    toStudentHome() {
      this.$router.push("/student/home")
    },

    isEmpty,
  }
}
</script>

<style scoped>
#internshipApplication {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#internshipApplication .middle {
  flex: 1;

  width: 100%;
  height: 0;
}

#internshipApplication .middle .addMain {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#internshipApplication .middle .addMain .history {
  padding: 10px 0 10px 0;

  font-size: 20px;

  line-height: 30px;

  text-align: center;

  vertical-align: top;

  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
}

#internshipApplication .middle .addMain .history .rightIcon {
  width: 30px;
  height: 30px;

  vertical-align: top;
}

#internshipApplication .middle .addMain .internshipApplicationScrollbar {
  flex: 1;

  width: 100%;
  height: 0;
}

#internshipApplication .middle .addMain .internshipApplicationScrollbar .internshipApplicationForm {
  margin: 20px auto 0 auto;

  width: 90%;
}

#internshipApplication .middle .addMain .internshipApplicationScrollbar .internshipApplicationForm .internshipApplicationFormItem /deep/ .el-form-item__label {
  white-space: pre-line;
  text-justify: distribute-all-lines;
}

#internshipApplication .middle .addMain .internshipApplicationScrollbar .internshipApplicationForm .internshipApplicationFormItem .internshipApplicationInput {
  width: 90%;
}

#internshipApplication .middle .addMain .internshipApplicationScrollbar .footer {
  text-align: center;

  padding: 0 0 20px 0;
}

#internshipApplication .middle .historyMain {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#internshipApplication .middle .historyMain .pageHeader {
  margin: 0 0 0 10px;

  height: 60px;

  line-height: 60px;
}

#internshipApplication .middle .historyMain .historyListScrollbar {
  flex: 1;

  width: 100%;
  height: 0;
}

#internshipApplication .middle .historyMain .historyListScrollbar .historyListEmpty {
  width: 100%;

  font-size: 20px;

  color: #888888;

  text-align: center;
}

#internshipApplication .middle .historyMain .historyListScrollbar .historyList {
  border-top: 1px solid #000000;
}

#internshipApplication .middle .historyMain .historyListScrollbar .historyList .historyForm {
  padding: 5px 10px 5px 10px;

  width: calc(100% - 20px);

  border-bottom: 1px solid #000000;
}

#internshipApplication .middle .historyMain .historyListScrollbar .historyList .historyForm .historyFormItem {
  margin: 0 0 0 0;
}

#internshipApplication .middle .historyMain .historyListScrollbar .historyList .historyForm .footer {

  width: calc(100%);

  text-align: right;
}
</style>