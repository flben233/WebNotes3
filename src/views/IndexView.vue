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

    <NavBar :username="username" @click-left="sideChange" @click-logout="logoutBtn" @click-center="centerBtn"/>

    <va-progress-bar indeterminate :color="themeColor" :rounded="false" v-if="showLoading" size="small"/>

    <div id="content">
      <!--   显示笔记以及文件夹的侧边栏   -->
      <div :style="sideBar" id="side">
        <div style="display: flex; flex-flow: column; height: 12vh; background-color: white;
                    border-radius: 1rem; padding: 1.2vh; margin-bottom: 1vh; justify-content: space-between; overflow: clip">
          <el-autocomplete
              v-model="input"
              :fetch-suggestions="querySearchAsync"
              placeholder="    请输入关键词查找"
              @select="handleSelect"
          />
          <div style="display: flex; justify-content: space-between; overflow: clip; ">
            <va-button @click="showCreateFolder = !showCreateFolder" size="small" :color="themeColor"
                       preset="secondary">
              <va-icon name="create_new_folder"/>
            </va-button>
            <va-button @click="clearText" size="small" :color="themeColor" preset="secondary">
              <va-icon name="create"/>
            </va-button>
            <DarkModeButton/>
            <va-switch v-if="showSwitch" v-model="previewOnly" @click="refreshEditor" :color="themeColor">
              <template #innerLabel>
                <va-icon name="visibility" :color="themeColor"/>
              </template>
            </va-switch>
          </div>
        </div>

        <div style="overflow: hidden; max-height: 77vh">
          <!--    列表渲染文件夹    -->
          <div style="overflow: auto; margin-bottom: 1vh; height: 3vh; display: flex; align-items: center">
            <FolderChip v-for="(item, index) in folders" @click="selectFolder(item.id)" :item="item" @start="start"
                        @finish="folderFinish"/>
          </div>
          <!--  列表渲染笔记  -->
          <div style="overflow: scroll; overflow-x: hidden; max-height: 73vh;">
            <NoteCard v-for="(item, index) in items" :item="item" :folders="folders" @click="clickCard(item)"
                      @start="start" @finish="finish"/>
          </div>
        </div>
      </div>

      <div class="mar"/>
      <!--   编辑器   -->
      <md-editor ref="editor" v-if="showEditor" v-model="text" id="editor" :style="editor"
                 @onSave="save" @onUploadImg="imgAdd" @onHtmlChanged="onHtmlChange" @onChange="modified = true"
                 :preview-only="previewOnly" :preview="preview"/>
    </div>
  </div>

</template>

<script>
import {ElAutocomplete} from 'element-plus'
import {ROOT_DOMAIN, THEME_COLOR} from "@/common/final";
import 'element-plus/es/components/autocomplete/style/css'
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {VaButton, VaCardContent, VaIcon, VaInput} from "vuestic-ui";
import Divider from "../components/Divider.vue"
import {logout} from "@/api/login"
import {
  search,
  getData,
  createNote,
  updateNotes
} from "@/api/note";
import {allFolder, createFolder} from "@/api/folder";
import {uploadImg} from "@/api/image"
import Title from "@/components/Title.vue";
import NavBar from "@/components/NavBar.vue";
import NoteCard from "@/components/NoteCard.vue";
import FolderChip from "@/components/FolderChip.vue";
import DarkModeButton from "@/components/DarkModeButton.vue";
import {setImgElement} from "@/common/utils";

export default {
  components: {
    DarkModeButton,
    FolderChip,
    NoteCard, NavBar, Title, VaInput, VaButton, VaIcon, VaCardContent, ElAutocomplete, MdEditor, Divider
  },
  name: "IndexView",
  mounted() {
    this.username = localStorage.getItem("username");
    this.getArticles();
    this.setSideSize();
    this.$refs.editor.on("preview", this.onHtmlChange);
    window.addEventListener("beforeunload", (e) => {
      if (this.modified) {
        e.preventDefault();
        e.returnValue = ""
        return "";
      }
    });
  },
  data() {
    return {
      minimized: false,
      items: [],
      articles: [],
      folders: [],
      input: '',
      text: '',
      lastCard: null,
      username: '',
      aid: 0,
      fid: 0,
      showCreateFolder: false,
      showLoading: false,
      folderName: '',
      themeColor: THEME_COLOR,
      selectedItem: null,
      previewOnly: false,
      preview: false,
      showEditor: true,
      showSwitch: false,
      pageHeight: innerHeight,
      modified: false,
      sideBar: {
        width: "25vw",
        marginTop: "2vh",
        marginLeft: "1vw"
      },
      sideBarMin: {
        width: "0",
        marginLeft: "0",
        marginTop: "2vh",
        height: "100%"
      },
      sideBarMobile: {
        marginTop: "2vh",
        width: "96vw",
        marginLeft: "2vw"
      },
      editor: {
        height: "90vh",
        border: "transparent",
        marginTop: "2vh",
        marginRight: "1vw",
        borderRadius: "1rem"
      },
      editorMin: {
        width: "0",
        marginRight: "0",
        padding: "0",
        marginTop: "2vh",
        height: "90vh"
      }
    }
  },
  methods: {
    async getArticles(callback = () => {}) {
      this.showLoading = true;
      let resp = await getData();
      if (resp.data.code === -6) {
        this.$router.go("/login")
      }
      this.articles = resp.data.data;
      for (let item of this.articles) {
        if (item.aid === this.aid) {
          item.color = this.themeColor;
          this.lastCard = item;
        }
      }
      await this.getFolders();
      callback()
      this.showLoading = false;
    },
    async getFolders() {
      let resp = await allFolder();
      this.folders = [{name: "/", id: 0}]
      for (let folder of resp.data.data) {
        this.folders.push(folder);
      }
      this.articleFilter();
    },
    articleFilter() {
      this.items = []
      for (let item of this.articles) {
        if (item.folder === this.fid) {
          this.items.push(item);
        }
      }
    },
    selectFolder(folder) {
      this.fid = folder;
      this.articleFilter();
    },
    start() {
      this.showLoading = true;
    },
    finish() {
      this.aid = 0;
      this.getArticles();
    },
    folderFinish() {
      this.fid = 0;
      this.getFolders();
      this.showLoading = false;
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
      createNote(this.text, this.fid).then((resp) => {
        if (resp.data.code === 0) {
          this.$vaToast.init({message: '保存成功', color: 'success', closeable: false, duration: 3000});
          this.getArticles(() => {
            this.aid = this.items[0].aid;
            this.clickCard(this.items[0]);
            this.modified = false;
          });
        } else {
          this.$vaToast.init({message: '保存失败', color: 'danger', closeable: false, duration: 3000});
          this.showLoading = false;
        }
      })
    },
    update() {
      updateNotes(this.text, this.aid, this.fid).then((resp) => {
        if (resp.data.code === 0) {
          this.$vaToast.init({message: '保存成功', color: 'success', closeable: false, duration: 3000});
        } else {
          this.$vaToast.init({message: '保存失败', color: 'danger', closeable: false, duration: 3000});
        }
        this.getArticles();
        this.modified = false;
      })
    },
    imgAdd(files, callback) {
      this.showLoading = true;
      for (let file of files) {
        uploadImg(file, this.aid).then((resp) => {
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
          this.showCreateFolder = false;
        }
        this.getArticles();
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
    clickCard(item) {
      if (this.lastCard != null) {
        this.lastCard.color = null;
      }
      item.color = this.themeColor;
      this.lastCard = item;
      this.text = item.article;
      this.aid = item.aid;
      this.selectedItem = item;
      if (innerWidth < 1024) {
        this.sideChange();
      }
    },
    sideChange() {
      this.minimized = !this.minimized;
      if (this.minimized) {
        this.sideBar = this.sideBarMin;
        this.editor = JSON.parse(this.editorStyle);
      } else {
        this.sideBar = JSON.parse(this.sideBarStyle);
        if (innerWidth < 1024)
          this.editor = this.editorMin;
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
        this.showSwitch = true;
        this.sideBar = this.sideBarMobile;
        this.editorStyle = JSON.stringify(this.editor);
        this.sideBarStyle = JSON.stringify(this.sideBar);
        this.editor = this.editorMin;
      } else {
        this.editorStyle = JSON.stringify(this.editor);
        this.sideBarStyle = JSON.stringify(this.sideBar);
        this.preview = true;
        this.refreshEditor();
      }
    },
    refreshEditor() {
      this.showEditor = false;
      if (innerWidth < 1024) {
        this.preview = this.previewOnly;
      }
      this.$nextTick(() => {
        this.showEditor = true;
      })
    },
    onHtmlChange() {
      this.$nextTick(() => setImgElement())
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
  @media screen and (max-width: 1024px) {
    padding: 10px;
  }
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