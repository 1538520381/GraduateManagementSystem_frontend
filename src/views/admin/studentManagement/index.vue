<template>
  <div id="studentManagement">
    <Header></Header>
    <div class="middle">
      <SidebarMenu userType="admin" active="0"></SidebarMenu>
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
          <el-button class="controlButton" type="primary" @click="downloadStudentImportTemplateExcel">导入模板下载
          </el-button>
          <el-button class="controlButton" type="primary"><label for="upload">导入</label></el-button>
          <input type="file" id="upload" ref="upload" @change="uploadStudentImportTemplateFile($event)"
                 style="display: none"/>
          <el-popconfirm title="确定删除吗?" @confirm="deleteByIds">
            <el-button class="controlButton" type="danger" slot="reference">批量删除</el-button>
          </el-popconfirm>
        </div>
        <div class="tableContainer">
          <el-table class="table" ref="table" :data="studentList" empty-text="暂无学生">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column class="tableColumn" prop="studentNumber" label="学号"></el-table-column>
            <el-table-column class="tableColumn" prop="name" label="姓名"></el-table-column>
            <el-table-column class="tableColumn" prop="classNumber" label="班级号"></el-table-column>
            <el-table-column class="tableColumn" prop="idNumber" label="身份证号（后六位）"></el-table-column>
            <el-table-column class-name="tableColumn" prop="type" label="类型">
              <template slot-scope="scope">
                {{ scope.row.type === 0 ? '普通学生' : '学生管理员' }}
              </template>
            </el-table-column>
            <el-table-column class="tableColumn" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-popconfirm title="确定删除吗?" @confirm="deleteById(scope.row.id)">
                  <el-button style="color: #ff0000" type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="small" v-if="scope.row.type === 0" @click="setType(scope.row.id,1)">
                  设为管理员
                </el-button>
                <el-popconfirm title="确定取消管理员吗?" @confirm="setType(scope.row.id,0)" v-else>
                  <el-button type="text" size="small" slot="reference">取消管理员</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              @current-change="selectPage">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from "@/components/sidebarMenu/index.vue";
import Header from "@/components/header/index.vue";

import * as XLSX from "xlsx";
import {isEmpty} from "@/utils/common";
import {studentAddList, studentDeleteById, studentDeleteByIds, studentQueryPage, studentSetType} from "@/apis/student";
import {adminGetAdminByToken} from "@/apis/admin";

export default {
  name: 'studentManagement',
  components: {
    Header,
    SidebarMenu,
  },
  data() {
    return {
      admin: null,

      studentList: [],

      queryPageForm: {},

      page: 0,
      pageSize: 5,
      total: 0,

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
      studentQueryPage({
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
    uploadStudentImportTemplateFile(event) {
      this.file = event.target.files[0];

      this.$refs.upload.value = null;

      let reader = new FileReader();
      reader.readAsBinaryString(this.file);
      reader.onload = (res) => {
        try {
          let data = res.target.result;
          let zzexcel = XLSX.read(data, {
            type: "binary",
          });
          let table = zzexcel.Sheets[Object.keys(zzexcel.Sheets)[0]];
          let regex = /^[A-Z]+\d+:[A-Z]+(\d+)$/;
          let row = table["!ref"].match(regex)[1]


          let studentList = []

          let j;
          for (let i = 3; i <= row; i++) {
            let student = {};

            j = 'B'
            if (isEmpty(table[j + i]) || isEmpty(table[j + i].v) || isEmpty(String(table[j + i].v).trim())) {
              this.$message.error("单元格" + j + i + "不能为空")
              return
            }
            student.studentNumber = String(table[j + i].v).trim()

            j = String.fromCharCode(j.charCodeAt(0) + 1)
            if (isEmpty(table[j + i]) || isEmpty(table[j + i].v) || isEmpty(String(table[j + i].v).trim())) {
              this.$message.error("单元格" + j + i + "不能为空")
              return
            }
            student.name = String(table[j + i].v).trim()

            j = String.fromCharCode(j.charCodeAt(0) + 1)
            if (isEmpty(table[j + i]) || isEmpty(table[j + i].v) || isEmpty(String(table[j + i].v).trim())) {
              this.$message.error("单元格" + j + i + "不能为空")
              return
            }
            student.classNumber = String(table[j + i].v).trim()

            j = String.fromCharCode(j.charCodeAt(0) + 1)
            if (isEmpty(table[j + i]) || isEmpty(table[j + i].v) || isEmpty(String(table[j + i].v).trim())) {
              this.$message.error("单元格" + j + i + "不能为空")
              return
            }
            student.idNumber = String(table[j + i].v).trim()

            studentList.push(student)
          }

          studentAddList({studentList: studentList}).then((res) => {
            if (res.data.code === 200) {
              this.queryPage()

              this.$message.success("成功" + (studentList.length - res.data.errorList.length) + "条，失败" + res.data.errorList.length + "条")

              if (!isEmpty(res.data.errorList)) {
                let workbook = XLSX.utils.book_new()

                let data = [["序号", "学号", "姓名", "班级号", "身份证号（后6位）", "导入失败原因"]]
                let index = 0
                res.data.errorList.forEach((item) => {
                  let row = [];
                  index++

                  row.push(index)
                  row.push(item.studentNumber)
                  row.push(item.name)
                  row.push(item.classNumber)
                  row.push(item.idNumber)
                  row.push(item.errorMessage)

                  data.push(row)
                })

                let dataSheet = XLSX.utils.aoa_to_sheet(data)
                XLSX.utils.book_append_sheet(workbook, dataSheet, "导入失败学生列表")
                XLSX.writeFile(workbook, "导入失败学生列表.xlsx")
              }
            } else {
              console.log(res)
              this.$message.error(res.data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error("服务器异常，请联系管理员")
          })
        } catch (err) {
          console.log(err)
          this.$message.error("导入失败，请联系管理员")
        }
      }
    },
    deleteById(id) {
      studentDeleteById({
        id: id
      }).then((res) => {
        if (res.data.code === 200) {
          this.queryPage()
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
    deleteByIds() {
      let ids = []
      this.$refs.table.selection.forEach((item) => {
        ids.push(item.id)
      })

      if (isEmpty(ids)) {
        this.$message.error("请先选择要删除的学生")
        return
      }

      studentDeleteByIds({
        ids: ids
      }).then((res) => {
        if (res.data.code === 200) {
          this.queryPage()
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
    setType(id, type) {
      studentSetType({
        id: id,
        type: type
      }).then((res) => {
        if (res.data.code === 200) {
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

    selectPage(page) {
      this.page = page
      this.queryPage()
    },

    downloadStudentImportTemplateExcel() {
      let a = document.createElement("a");
      a.href = "/static/download/" + "学生导入模板.xlsx";
      a.download = "学生导入模板.xlsx";
      a.click();
    },

    toLogin() {
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
#studentManagement {
  display: flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#studentManagement .middle {
  display: flex;

  flex-flow: row;

  flex: 1;

  width: 100%;
  height: 0;
}

#studentManagement .middle .main {
  flex: 1;

  width: 0;
  height: 100%;
}

#studentManagement .middle .main .searchContainer {
  width: 100%;
}

#studentManagement .middle .main .searchContainer .searchInput {
  margin: 20px 0 0 20px;

  width: 200px;
}

#studentManagement .middle .main .controlContainer .controlButton {
  margin: 10px 0 0 20px;
}

#studentManagement .middle .main .tableContainer {
  text-align: center;
}

#studentManagement .middle .main .tableContainer .table {
  margin: 0 auto 0 auto;

  width: 90%;
}
</style>