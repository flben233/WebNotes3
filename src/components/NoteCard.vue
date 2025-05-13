<template>
  <div>
    <!--  删除笔记/文件夹的窗口  -->
    <va-modal v-model="showDelete" hide-default-actions>
      <template #header>
        <Title style="text-align: center">确定要删除吗</Title>
      </template>
      <template #footer>
        <va-button :color="themeColor" text-color="#ffffff" @click="del" style="margin-right: 10px">
          删除
        </va-button>
        <va-button preset="secondary" :color="themeColor" @click="showDelete = false">
          取消
        </va-button>
      </template>
    </va-modal>
    <!--  显示分享笔记的链接的窗口  -->
    <va-modal v-model="showShare" hide-default-actions>
      <template #header>
        <Title>分享</Title>
      </template>
      <div>{{ message }}</div>
      <template #footer>
        <va-button :color="themeColor" text-color="#ffffff" @click="showShare = false">
          关闭
        </va-button>
      </template>
    </va-modal>
    <!--  显示移动到文件夹的窗口  -->
    <va-modal v-model="showMove" hide-default-actions>
      <template #header>
        <Title>请选择目标文件夹</Title>
      </template>
      <va-list class="modal" v-for="(item, index) in folders">
        <va-sidebar-item :activeColor="themeColor" @click="mv(item.id)">
          <va-sidebar-item-content>
            <va-sidebar-item-title> {{item.name}} </va-sidebar-item-title>
          </va-sidebar-item-content>
        </va-sidebar-item>
      </va-list>
      <template #footer>
        <va-button :color="themeColor" text-color="#ffffff" @click="showMove = false">
          关闭
        </va-button>
      </template>
    </va-modal>

    <va-dropdown trigger="right-click">
      <template #anchor>
        <va-card :text-color="item.color"
                 square
                 class="card"
        >
          <div v-if="item.folder !== -1">
            <Title style="padding: 20px 20px 0 20px">{{ getTitle(item) }}</Title>
            <va-card-content style="padding-top: 10px">
              <p class="text">
                {{
                  item.article.substring(0, item.article.length > 100 ? 100 : item.article.length).replaceAll("#", "") + "..."
                }}
              </p>
            </va-card-content>
          </div>
        </va-card>
      </template>
      <va-dropdown-content>
        <va-button :color="themeColor" text-color="#ffffff" style="margin-right: 10px" @click="showDelete = true">
          删除
        </va-button>
        <va-button :color="themeColor" text-color="#ffffff" style="margin-right: 10px" @click="showMove = true">
          移动
        </va-button>
        <va-button :color="themeColor" text-color="#ffffff" @click="share">
          分享
        </va-button>
      </va-dropdown-content>
    </va-dropdown>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import {THEME_COLOR, WEB_URL} from "@/common/final";
import {deleteNote, moveTo, share} from "@/api/note";

export default {
  name: "NoteCard",
  props: ["item", "folders"],
  emits: ["start", "finish"],
  components: {Title},
  data() {
    return {
      themeColor: THEME_COLOR,
      showDelete: false,
      showShare: false,
      showMove: false,
      message: "",
    }
  },
  methods: {
    del() {
      this.showDelete = false;
      this.$emit("start");
      deleteNote(this.item.aid).then(() => {
        this.$vaToast.init({message: '删除成功', color: 'success', closeable: false, duration: 3000});
        this.$emit("finish");
      })
    },
    mv(folder) {
      this.$emit("start");
      moveTo(this.item.aid, folder).then(() => {
        this.showMove = false;
        this.$emit("finish");
      })
    },
    share() {
      if (this.item.aid !== 0) {
        share(this.item.aid).then((resp) => {
          if (resp.data.code === 0) {
            this.showShare = true;
            this.message = '链接: ' + WEB_URL + '/article/' + this.item.aid;
          } else {
            this.$vaToast.init({message: '内部错误', color: 'danger', closeable: false, duration: 3000});
          }
        })
      }
    },
    getTitle(item) {
      let lines = item.article.split("\n");
      let title = lines[0].replaceAll("#", "");
      const isComment = (str) => str.indexOf("<!--") === 0 && str.indexOf("-->") > 0;
      if (isComment(title)) {
        for (const l of lines) {
          if (!isComment(l)) {
            title = l.replaceAll("#", "");
            break;
          }
        }
      }
      return title;
    }
  }
}
</script>
<style scoped>
.text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  padding: 1px;
  font-size: 14px;
}
.card {
  --va-card-border-radius: 0;
  --va-card-box-shadow: none;
  border-radius: 1rem;
  margin-bottom: 2%;
  cursor: pointer;
}
.modal {
  width: 50vw;
  @media screen and (max-width: 1024px) {
    width: 80vw;
  }
}
</style>