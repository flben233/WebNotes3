<template>
  <div style="padding: 20px;">
    <div style="display: flex; height: 5vh; padding-bottom: 10px">
      <va-button
          color="info"
          gradient
          @click="manageShareBtn"
          style="margin-right: 10px;"
      >分享管理</va-button>
      <va-button
          color="info"
          gradient
          @click="resetBtn"
          style="margin-right: 10px;"
      >修改密码</va-button>
      <va-button
          color="info"
          gradient
          @click="noteBtn"
          style="margin-right: 10px;"
      >返回笔记</va-button>
      <va-progress-circle indeterminate v-if="showLoading" size="small"/>
    </div>
    <VaProgressBar style="margin-bottom: 1vh" :model-value="quota.used / quota.quota">
      {{ "图片限额：" + quota.used + "/" + quota.quota }}
    </VaProgressBar>
    <div>
      <va-card>
        <va-inner-loading :loading="onLoading">
          <va-list>
            <va-card-content style="height: 6vh">
              {{panelName}}
            </va-card-content>
            <va-card-content style="height: 82vh">
              <article-list :articles="list" :del-article="shareCancel" :wrapper-size="wrapperSize"/>
            </va-card-content>
          </va-list>
        </va-inner-loading>
      </va-card>
    </div>
  </div>
</template>

<script>
import {THEME_COLOR} from "@/common/final";
import {deleteImg, getImgList, getQuota} from "@/api/image";
import ConfirmButton from "@/components/button/ConfirmButton.vue";
import {cancelShare, getShareList, search} from "@/api/note"
import Divider from "@/components/Divider.vue";
import ArticleList from "@/components/ArticleList.vue";

export default {
  name: "CenterView",
  components: {ArticleList, Divider, ConfirmButton},
  data() {
    return {
      showLoading: false,
      list: [],
      themeColor: THEME_COLOR,
      baseUrl: "",
      onLoading: false,
      progr: 0,
      panelName: "分享管理",
      wrapperSize: 500,
      quota: {
        used: 0,
        quota: 0
      }
    }
  },
  mounted() {
    this.getShare();
    this.getQuota();
  },
  methods: {
    resetBtn() {
      this.showLoading = true;
      this.$router.push('/reset');
    },
    noteBtn() {
      this.showLoading = true;
      this.$router.push('/');
    },
    getShare() {
      getShareList().then((resp) => {
        this.list = resp.data.data;
        this.onLoading = false;
        this.isImage = false;
        this.$nextTick(() => {
          this.wrapperSize = innerHeight * 0.81;
        });
      });
    },
    shareCancel(aid) {
      this.$vaToast.init({ message: '正在取消分享', color: 'warning', closeable: false, duration: 3000 })
      cancelShare(aid).then((resp) => {
        if (resp.data.code === 0) {
          this.$vaToast.init({ message: '取消成功', color: 'success', closeable: false, duration: 3000 })
          this.getShare();
        } else {
          this.$vaToast.init({ message: '取消失败', color: 'danger', closeable: false, duration: 3000 })
        }
      });
    },
    manageShareBtn() {
      this.panelName = "分享管理";
      this.onLoading = true;
      this.getShare();
    },
    getQuota() {
      getQuota().then((resp) => {
        console.log(resp)
        this.quota = resp.data.data;
      });
    }
  }
}
</script>

<style scoped>
#title {
  white-space:nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 500;
  padding: 0 0 10px;
}
</style>