<template>
  <div style="background-color: white; height: 100vh; width: 100vw;">
    <div style="padding: 0.5%; height: 5vh; display: flex; align-items: center; justify-content: space-between">
      <div>
        <va-icon name="person"/>
        {{ username }}
      </div>
      <div style="display: flex; align-items: center">
        <DarkModeButton/>
        <va-button id="catalog-btn" preset="secondary" color="#39c5bb" @click="showMobileCatalog = !showMobileCatalog">
          <va-icon name="menu"/>
        </va-button>
      </div>
    </div>
    <Divider/>
    <div v-if="showMobileCatalog" style="max-height: 91vh; overflow-y: auto; margin: 2vh;">
      <MdCatalog :editor-id="'md-editor-v3'"
                 style="text-overflow: ellipsis;"
                 :scrollElement="scrollElement"
      />
    </div>
    <div id="main-read">
      <md-preview ref="reader"
          id="read" :editor-id="'md-editor-v3'" v-model="text" @onHtmlChanged="handler"/>
      <div id="catalog">
        <MdCatalog :editor-id="'md-editor-v3'"
                   style="text-overflow: ellipsis; max-width: 100%;"
                   :scrollElement="scrollElement"
                   v-if="showCatalog"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {getArticleById} from "@/api/note";
import {MdCatalog, MdPreview} from "md-editor-v3";
import {VaIcon} from "vuestic-ui";
import Divider from "@/components/Divider.vue";
import {ROOT_DOMAIN, THEME_COLOR} from "@/common/final";
import DarkModeButton from "@/components/DarkModeButton.vue";
import {setImgElement} from "@/common/utils";

export default {
  name: "ReadView",
  components: {MdPreview, DarkModeButton, Divider, VaIcon, MdCatalog},
  mounted() {
    this.getText();
  },
  data() {
    return {
      text: '',
      username: '',
      catalog: [],
      fontSize: ["1.8vh", "1.6vh", "1.4vh", "1.2vh", "1.0vh"],
      paddingLeft: ["0.5vw", "1.0vw", "1.5vw", "2.0vw", "2.5vw"],
      themeColor: THEME_COLOR,
      scrollElement: null,
      showCatalog: false,
      showMobileCatalog: false,
    }
  },
  methods: {
    getText() {
      getArticleById(this.$route.params.aid).then((response) => {
        this.text = response.data.data.article;
        this.username = response.data.data.username;
      })
    },
    handler() {
      this.scrollElement = document.getElementById("read");
      this.showCatalog = true;
      this.$nextTick(() => setImgElement())
    },
    getNum(tag) {
      switch (tag) {
        case "h2":
          return 0;
        case "h3":
          return 1;
        case "h4":
          return 2;
        case "h5":
          return 3;
        case "h6":
          return 4;
      }
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 1024px) {
  ::-webkit-scrollbar {
    display: none;
  }
}

#read {
  position: absolute;
  overflow-y: auto;
  width: 60vw;
  padding: 5vw;
  max-height: 95%;
  margin-left: 10%;
  @media screen and (max-width: 1024px) {
    width: 90vw;
    margin-left: 5%;
  }
}

#main-read {
  display: flex;
}

#catalog {
  overflow-y: auto;
  margin-left: 75%;
  max-height: 95%;
  width: 20vw;
  padding-top: 2%;
  padding-bottom: 2%;
  position: absolute;
  @media screen and (max-width: 1024px) {
    display: none;
  }
}

#catalog-btn {
  @media screen and (min-width: 1024px) {
    display: none;
  }
}
</style>