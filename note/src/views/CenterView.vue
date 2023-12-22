<template>
  <div style="padding: 20px;">
    <va-modal
        v-model="showImg"
        no-padding
        size="large"
    >
      <template #content="{ ok }">
        <img :src="imageUrl"
            style="max-height: 100%; max-width: 100%"/>
      </template>
    </va-modal>

    <va-progress-bar
        :model-value="progr"
        size="medium"
        content-inside
        style="margin-bottom: 10px;"
        v-if="showProgr"
    >
      {{ progr }}
    </va-progress-bar>

    <div style="display: flex; height: 5vh; padding-bottom: 10px">
      <va-button
          color="info"
          gradient
          @click="manageImgBtn"
          style="margin-right: 10px;"
      >图片管理</va-button>
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
      <ConfirmButton @confirm="autoDelImg(0)" color="info" gradient="true" placement="bottom" style="margin-right: 10px">
        自动删除未使用图片
      </ConfirmButton>
      <va-button
          color="info"
          gradient
          @click="noteBtn"
          style="margin-right: 10px;"
      >返回笔记</va-button>
      <va-progress-circle indeterminate v-if="showLoading" size="small"/>
    </div>

    <div style="height: 10vh;">
      <va-card>
        <va-inner-loading :loading="onLoading">
          <va-list>
            <va-card-content>
              <p style="padding-bottom: var(--va-card-padding)">{{panelName}}</p>
              <div style="overflow-y: auto; overflow-x: auto; padding-top: 10px; max-height: 81vh;">
                  <va-list-item
                      v-for="(item, index) in list"
                      :key="index"
                  >
                    <va-list-item-section avatar>
                      <img
                          style="max-height: 100px; max-width: 100px; cursor: pointer;"
                          :src="baseUrl + item.name"
                          @click="showImage(baseUrl + item.name)"
                          loading="lazy"
                          v-if="isImage"
                      />
                    </va-list-item-section>

                    <va-list-item-section>
                      <va-list-item-label v-if="isImage" >
                        {{ item.name }}
                      </va-list-item-label>
                      <va-list-item-section v-if="!isImage">
                        <p id="title">{{ item.article.substring(0, item.article.indexOf("\n") > 30 ? 30 : item.article.indexOf("\n")).replaceAll("#", "") }}</p>
                        <p style="max-width: 60%; margin-bottom: 10px; overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;padding: 1px; font-size: 14px;">
                          {{ item.article.substring(item.article.indexOf("\n"), item.article.length > 100 ? 100 : item.article.length).replaceAll("#", "") + "..." }}
                        </p>
                        <Divider/>
                      </va-list-item-section>
                    </va-list-item-section>
                    <va-list-item-section icon>
                      <ConfirmButton v-if="isImage" icon="close" @confirm="delImg(item.name)" round="true" placement="right"/>
                      <ConfirmButton v-if="!isImage" icon="close" @confirm="shareCancel(item.aid, item.folder)" round="true" placement="right"/>
                    </va-list-item-section>
                  </va-list-item>
              </div>
            </va-card-content>
          </va-list>
        </va-inner-loading>
      </va-card>
    </div>
  </div>
</template>

<script>
import {THEME_COLOR} from "@/common/final";
import {deleteImg, getImgList} from "@/api/image";
import ConfirmButton from "@/components/button/ConfirmButton.vue";
import {cancelShare, getShareList, search} from "@/api/note"
import Divider from "@/components/Divider.vue";

export default {
  name: "CenterView",
  components: {Divider, ConfirmButton},
  data() {
    return {
      showLoading: false,
      list: [],
      themeColor: THEME_COLOR,
      baseUrl: "",
      imageUrl: "",
      showImg: false,
      onLoading: false,
      progr: 0,
      showProgr: false,
      panelName: "图片管理",
      isImage: true
    }
  },
  mounted() {
    this.getImages();
  },
  methods: {
    cancelShare,
    resetBtn() {
      this.showLoading = true;
      this.$router.push('/reset');
    },
    getImages() {
      this.onLoading = true;
      getImgList().then((resp) => {
        this.list = resp.data.data;
        this.baseUrl = resp.data.url;
        this.onLoading = false;
      })
    },
    noteBtn() {
      this.showLoading = true;
      this.$router.push('/');
    },
    showImage(url) {
      this.showImg = true;
      this.imageUrl = url;
    },
    delImg(imageName) {
      deleteImg(imageName).then((resp) => {
        this.$vaToast.init({ message: '正在删除', color: 'warning', closeable: false, duration: 3000 })
        if (resp.data.code === 0) {
          this.$vaToast.init({ message: '删除成功', color: 'success', closeable: false, duration: 3000 })
          this.getImages();
        } else {
          this.$vaToast.init({ message: '删除失败', color: 'danger', closeable: false, duration: 3000 })
        }
      })
    },
    autoDelImg(index) {
      this.showProgr = true;
      if (index >= this.images.length) {
        this.showProgr = false;
        this.getImages();
        return;
      }
      this.progr = Math.round(index / this.images.length * 100);
      search(this.images[index].name).then((resp) => {
        if (resp.data.data.length === 0) {
          deleteImg(this.images[index].name).then(() => {
            this.autoDelImg(index + 1);
          })
        } else {
          this.autoDelImg(index + 1);
        }
      })
    },
    getShare() {
      getShareList().then((resp) => {
        this.list = resp.data.data;
        this.onLoading = false;
        this.isImage = false;
      });
    },
    shareCancel(aid, fid) {
      this.$vaToast.init({ message: '正在取消分享', color: 'warning', closeable: false, duration: 3000 })
      cancelShare(aid, fid).then((resp) => {
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
    manageImgBtn() {
      this.isImage = true;
      this.panelName = "图片管理";
      this.getImages();
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