<template>
  <div id="index">
    <!--  创建文件夹的窗口  -->
    <va-modal v-model="showCreateFolder" hide-default-actions>
      <template #header>
        <Title>新文件夹名</Title>
      </template>
      <va-input v-model="folderName" :color="themeColor"></va-input>
      <template #footer>
        <va-button :color="themeColor" text-color="#ffffff" @click="createNewFolder" style="margin-right: 20px">
          提交
        </va-button>
        <va-button preset="secondary" :color="themeColor" @click="showCreateFolder = false">
          关闭
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

    <NavBar :username="username" @click-left="sideChange" @click-logout="logoutBtn" @click-center="centerBtn"/>

    <va-progress-bar indeterminate :color="themeColor" :rounded="false" v-if="showLoading" size="small"/>

    <div id="content">
      <!--   显示笔记以及文件夹的侧边栏   -->
      <div :style="sideBar" id="side">
        <div style="display: flex; flex-flow: column; height: 12vh; background-color: white;
                    border-radius: 1rem; padding: 1.2vh; margin-bottom: 2vh; justify-content: space-between; overflow: clip">
          <el-autocomplete
              v-model="input"
              :fetch-suggestions="querySearchAsync"
              placeholder="    请输入关键词查找"
              @select="handleSelect"
          />
          <div style="display: flex; justify-content: space-between; overflow: clip; ">
            <va-button @click="showCreateFolder = !showCreateFolder" v-if="fid === 0" size="small" :color="themeColor"
                       preset="secondary">
              <va-icon name="create_new_folder"/>
            </va-button>
            <va-button @click="showDelete = (fid !== 0); delFolder = true;" v-if="fid !== 0" size="small"
                       :color="themeColor" preset="secondary">
              <va-icon name="folder_delete"/>
            </va-button>
            <va-button @click="clearText" size="small" :color="themeColor" preset="secondary">
              <va-icon name="create"/>
            </va-button>
            <va-button @click="showDelete = (aid !== 0)" size="small" :color="themeColor" preset="secondary">
              <va-icon name="delete"/>
            </va-button>
            <va-button @click="share" size="small" :color="themeColor" preset="secondary">
              <va-icon name="share"/>
            </va-button>
            <va-switch v-model="previewOnly" @click="refreshEditor" :color="themeColor">
              <template #innerLabel>
                <va-icon name="visibility" :color="themeColor"/>
              </template>
            </va-switch>
          </div>
        </div>

        <!--  列表渲染文件夹以及笔记  -->
        <div style="overflow: hidden; ">
          <div style="overflow: scroll; overflow-x: hidden; max-height: 76vh;">
            <va-card :text-color="item.color"
                     @click="clickCard(index)"
                     square v-for="(item, index) in items"
                     id="card">
              <!--  文件夹卡片  -->
              <div v-if="item.folder === -1" style="display: flex; justify-items: center; justify-content: start;">
                <va-icon name="folder" :color="themeColor" style="padding-top: 14px;padding-left: 20px"></va-icon>
                <Title style="padding: 20px; font-weight: normal; cursor: pointer">{{ item.name }}</Title>
              </div>
              <!--  笔记卡片  -->
              <div v-if="item.folder !== -1">
                <Title style="padding: 20px 20px 0 20px">{{ item.article.substring(0,
                  item.article.indexOf("\n")).replaceAll("#", "") }}</Title>
                <va-card-content style="padding-top: 10px">
                  <p style="overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;padding: 1px; font-size: 14px; cursor:pointer">
                    {{
                      item.article.substring(0, item.article.length > 100 ? 100 : item.article.length).replaceAll("#", "") + "..."
                    }}
                  </p>
                </va-card-content>
              </div>
            </va-card>
          </div>
        </div>
      </div>

      <div class="mar"/>
      <!--   编辑器   -->
      <md-editor v-if="showEditor" v-model="text" id="editor" @onSave="save" @onUploadImg="imgAdd" :style="editor"
                 :preview-only="previewOnly" :preview="preview"/>
    </div>

  </div>

</template>

<script>
import {ElAutocomplete} from 'element-plus'
import {THEME_COLOR} from "@/common/final";
import 'element-plus/es/components/autocomplete/style/css'
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {VaButton, VaCardContent, VaIcon, VaInput} from "vuestic-ui";
import Divider from "../components/Divider.vue"
import {logout} from "@/api/login"
import {
  search,
  getData,
  searchByFolder,
  createNote,
  updateNotes,
  share,
  deleteNote,
  createFolder,
  deleteFolder
} from "@/api/note";
import {uploadImg} from "@/api/image"
import {WEB_URL} from "@/common/final";
import Title from "@/components/Title.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  components: {NavBar, Title, VaInput, VaButton, VaIcon, VaCardContent, ElAutocomplete, MdEditor, Divider},
  name: "IndexView",
  mounted() {
    this.username = localStorage.getItem("username");
    this.getArticles();
    this.setSideSize();
  },
  data() {
    return {
      minimized: false,
      items: [{article: "\n", aid: 1, folder: 0}],
      input: '',
      text: '',
      lastCard: null,
      username: '',
      aid: 0,
      fid: 0,
      showShare: false,
      showDelete: false,
      showCreateFolder: false,
      showLoading: false,
      message: '',
      folderName: '',
      themeColor: THEME_COLOR,
      delFolder: false,
      selectIndex: -1,
      previewOnly: false,
      preview: false,
      showEditor: true,
      sideBar: {
        width: "25vw",
        marginTop: "2vh",
        marginLeft: "1vw"
      },
      editor: {
        height: "90vh",
        border: "transparent",
        marginTop: "2vh",
        marginRight: "2vw",
        borderRadius: "1rem"
      }
    }
  },
  methods: {
    getArticles(needSelect) {
      this.showLoading = true;
      if (this.fid === 0) {
        getData().then((resp) => {
          this.items = [{}];
          this.items = resp.data.data;
          if (needSelect) {
            this.aid = this.items[0].aid;
          }
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].aid != null && this.items[i].aid === this.aid) {
              this.selectIndex = i;
              break;
            }
          }
          this.clickCard(this.selectIndex);
          this.showLoading = false;
        });
      } else {
        searchByFolder(this.fid).then((resp) => {
          this.items = resp.data.data;
          this.items.unshift({folder: -1, name: "..", id: 0})
          if (needSelect) {
            this.aid = this.items[this.items.length - 1].aid;
          }
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].aid != null && this.items[i].aid === this.aid) {
              this.selectIndex = i;
              break;
            }
          }
          this.clickCard(this.selectIndex);
          this.showLoading = false;
        })
      }
    },
    clearText() {
      this.text = "";
      this.aid = 0;
      this.lastCard.color = null;
    },
    save() {
      this.showLoading = true;
      if (this.aid === 0) {
        this.create();
      } else {
        this.update();
      }
    },
    create() {
      createNote(this.text, this.fid).then(() => {
        this.$vaToast.init({message: '保存成功', color: 'success', closeable: false, duration: 3000});
        this.getArticles(true);
      })
    },
    update() {
      updateNotes(this.text, this.aid, this.fid).then(() => {
        this.$vaToast.init({message: '保存成功', color: 'success', closeable: false, duration: 3000});
        this.getArticles(false);
      })
    },
    share() {
      if (this.aid !== 0) {
        share(this.aid, this.fid).then((resp) => {
          if (resp.data.code === 0) {
            this.showShare = true;
            this.message = '链接: ' + WEB_URL + '/article/' + this.aid;
          } else {
            this.$vaToast.init({message: '内部错误', color: 'danger', closeable: false, duration: 3000});
          }
        })
      }
    },
    del() {
      this.showLoading = true;
      if (this.delFolder) {
        deleteFolder(this.fid).then(() => {
          this.$vaToast.init({message: '删除成功', color: 'success', closeable: false, duration: 3000});
          this.showLoading = false;
          this.fid = 0;
          this.delFolder = false;
          this.showDelete = false;
          this.selectIndex--;
          this.getArticles(false);
        })
      } else {
        deleteNote(this.aid).then(() => {
          this.$vaToast.init({message: '删除成功', color: 'success', closeable: false, duration: 3000});
          this.showDelete = false;
          this.aid = 0;
          this.getArticles(false);
        })
      }
    },
    imgAdd(files, callback) {
      this.showLoading = true;
      for (let file of files) {
        uploadImg(file).then((resp) => {
          callback(resp.data);
          this.showLoading = false;
        })
      }
    },
    createNewFolder() {
      this.showLoading = true;
      createFolder(this.folderName).then((resp) => {
        if (resp.data.code === 0) {
          this.$vaToast.init({message: '创建成功', color: 'success', closeable: false, duration: 3000});
          this.getArticles(false);
          this.showCreateFolder = false;
          if (this.selectIndex >= 0) this.selectIndex++;
        }
      })
    },
    querySearchAsync(queryString, cb) {
      clearTimeout(5000);
      search(queryString).then(function (resp) {
        cb(resp.data.data);
      })
    },
    handleSelect(item) {
      for (let item1 of this.items) {
        if (item.aid === item1.aid) {
          this.text = item1.article;
        }
      }
    },
    clickCard(index) {
      let item = this.items[index];
      if (item == null) {
        return;
      }
      if (this.lastCard != null) {
        this.lastCard.color = null;
      }
      item.color = this.themeColor;
      this.lastCard = item;
      if (item.folder === -1) {
        // 如果是文件夹就根据文件夹ID向后端请求内容，然后刷新items
        this.fid = item.id;
        this.getArticles(false);
      } else {
        this.text = item.article;
        this.aid = item.aid;
        this.selectIndex = index;
        if (innerWidth < 1024) {
          this.sideChange();
        }
      }
    },
    sideChange() {
      this.minimized = !this.minimized;
      if (this.minimized) {
        this.sideBarStyle = JSON.stringify(this.sideBar);
        this.sideBar.width = "0";
        this.sideBar.marginLeft = "0";
        this.editor = JSON.parse(this.editorStyle);
      } else {
        this.sideBar = JSON.parse(this.sideBarStyle);
        this.setSideSize();
      }
    },
    logoutBtn() {
      logout().then(() => {
        this.$vaToast.init({message: '退出成功', color: 'success', closeable: false, duration: 3000});
        location.reload();
      })
    },
    centerBtn() {
      this.showLoading = true;
      this.$router.push("/center")
    },
    setSideSize() {
      if (innerWidth < 1024) {
        this.sideBar.width = "96vw";
        this.sideBar.marginLeft = "2vw";
        this.editorStyle = JSON.stringify(this.editor);
        this.editor.width = "0";
        this.editor.marginRight = "0";
      } else {
        this.preview = true;
        this.refreshEditor();
      }
    },
    refreshEditor() {
      this.showEditor = false;
      this.preview = this.previewOnly;
      this.$nextTick(() => {
        this.showEditor = true;
      })
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  width: 0;
  padding-right: 2px;
}

::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
}

::-webkit-scrollbar-thumb:hover {
  background: #908f8f;
}

::-webkit-scrollbar-thumb {
  background: #b9b9b9;
}

#index {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  background-color: #f6f6f6;
}

#card {
  --va-card-border-radius: 0;
  --va-card-box-shadow: none;
  border-radius: 1rem;
  margin-bottom: 2%;
}

.el-input {
  --el-input-focus-border: var(--theme-color);
  --el-input-focus-border-color: var(--theme-color);
}

.el-input__wrapper {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 0;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: var(--el-transition-box-shadow);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

#content {
  display: flex;
}

#editor {
  transition: all 0.5s;
}

#side {
  overflow: clip;
  transition: all 0.5s;
}

.mar {
  min-width: 1vw;
  @media screen and (max-width: 1024px) {
    min-width: 2vw;
  }
}
</style>