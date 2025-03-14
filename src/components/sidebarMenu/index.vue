<template>
  <div id="sidebarMenu">
    <el-menu class="menu" :default-active="active">
      <template v-for="(item,index) in menuItems">
        <el-menu-item class="menuItem" :index="item.index"
                      v-if="userType === item.userType" @click="toUrl(item.url)">
          <i class="el-icon-menu"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SidebarMenu',
  props: {
    userType: String,

    active: String,
  },
  data() {
    return {
      menuItems: [
        {
          title: '学生管理',
          index: '0',
          userType: 'admin',
          url: '/studentManagement'
        },
        {
          title: '学生管理员管理',
          index: '1',
          userType: 'admin',
          url: '/studentAdminManagement'
        },
        {
          title: '学生状态总览',
          index: '2',
          userType: 'admin',
          url: '/studentStatusRecord'
        }, {
          title: '学生状态详情',
          index: '3',
          userType: 'admin',
          url: '/studentStatusRecordDetail'
        }, {
          title: '状态填写时间设置',
          index: '4',
          userType: 'admin',
          url: '/studentStatusRecordDate'
        }, {
          title: '问卷设置',
          index: '5',
          userType: 'admin',
          url: '/questionnaireManagement'
        }, {
          title: '实习申请管理',
          index: '6',
          userType: 'admin',
          url: '/internshipApplicationManagement'
        },

        {
          title: '组员管理',
          index: '0',
          userType: 'studentAdmin',
          url: '/teamMemberManagement'
        },
      ]
    }
  },
  methods: {
    toUrl(url) {
      if (window.location.pathname !== url) {
        this.$router.push(url)
      }
    }
  }
}
</script>

<style scoped>
#sidebarMenu {
  width: 200px;
  height: 100%;

  background: #F0F9FD;
}

#sidebarMenu .menu {
  width: 100%;
  height: 100%;
}

#sidebarMenu .menu .menuItem:hover {
  background: #FFFFFF;
}

#sidebarMenu .menu .menuItem:focus {
  background: #FFFFFF;
}
</style>