<template>
  <VaInnerLoading :loading="loading">
    <nav-bar @click-left="toggleSideBar"/>
    <div id="admin">
      <side-bar ref="sideBarRef">
        <div
            style="overflow-y: scroll; overflow-x: hidden; max-height: 91vh; scrollbar-width: none; border-radius: 1rem">
          <admin-card v-for="user in users" :key="user.username" :user="user" :stripe="stripeList[user.username]"
                      @click="clickCard(user.username)"/>
        </div>
      </side-bar>
      <div id="user-panel">
        <va-button color="danger" @click="delUser">
          删除用户
        </va-button>
        <br/>
        <div style="justify-content: center; display: flex; width: fit-content; margin: 10px 0 10px 0">
          <VaInput
              v-model="currentUser.role"
              label="权限组"
          />
          <va-button @click="updateRole" style="margin-left: 10px">更新</va-button>
        </div>
        <article-list :articles="articles" @del="delArticle" :wrapper-size="wrapperSize"/>
      </div>
    </div>
  </VaInnerLoading>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
import AdminCard from "@/components/AdminCard.vue";
import {delArticle, deleteUser, getArticleList, listUser, updateUserInfo} from "@/api/admin";
import ArticleList from "@/components/ArticleList.vue";

export default {
  name: "AdminView",
  components: {ArticleList, AdminCard, SideBar, NavBar},
  mounted() {
    this.loadData();
  },
  data() {
    return {
      stripeList: {},
      defaultStripe: "",
      users: [],
      currentUser: {},
      articles: [],
      loading: false,
      wrapperSize: 500
    }
  },
  methods: {
    toggleSideBar() {
      this.$refs.sideBarRef.toggleSideBar();
    },
    clickCard(username) {
      this.stripeList = JSON.parse(this.defaultStripe);
      this.stripeList[username] = true;
      this.currentUser = this.users.find(user => user.username === username);
      this.loading = true;
      getArticleList(username).then(resp => {
        this.articles = resp.data.data;
        this.loading = false;
        this.$nextTick(() => {
          this.wrapperSize = innerHeight * 0.75;
        });
      });
    },
    delUser() {
      this.loading = true;
      deleteUser(this.currentUser.username).then(() => {
        this.loadData();
        this.loading = false;
      });
    },
    delArticle(aid) {
      this.loading = true;
      delArticle(this.currentUser.username, aid).then(() => {
        this.loadData();
        this.clickCard(this.currentUser.username);
      });
    },
    updateRole() {
      updateUserInfo(this.currentUser.username, this.currentUser.role).then(() => {
        this.loadData();
      });
    },
    loadData() {
      this.loading = true;
      listUser().then(resp => {
        this.users = resp.data.data;
        for (const user of this.users) {
          let username = user.username;
          this.stripeList[username] = false;
        }
        this.defaultStripe = JSON.stringify(this.stripeList);
        this.loading = false;
      });
    }
  }
}
</script>

<style scoped>
#admin {
  display: flex;
  height: 100%;
}

#user-panel {
  width: 81vw;
  margin-right: 1vw;
  margin-left: 1vw;
  margin-top: 2vh;
  height: 91vh;
  padding: 20px;
  background: white;
  border-radius: 1rem;
  display: block;
}
</style>