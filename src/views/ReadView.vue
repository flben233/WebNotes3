<template>
  <div>
    <div style="padding: 0.5%; height: 5%; display: flex; align-items: center">
      <va-icon name="person"/>
      {{ username }}
    </div>
    <Divider/>
    <div id="main-read">
      <div id="read" style="margin-left: 15%; max-width: 50%">
        <md-editor :editor-id="'md-editor-v3'" v-model="text" previewOnly @onHtmlChanged="handler"/>
      </div>
      <div style="overflow-y: auto; margin-left: 75%; max-height: 95%; padding-top: 2%; padding-bottom: 2%; position: absolute;">
        <MdCatalog :editor-id="'md-editor-v3'"
                   style="overflow-x: clip; text-overflow: ellipsis; max-width: 70%;"
                   :scrollElement="scrollElement"
                   v-if="showCatalog"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {getArticleById} from "@/api/note";
import MdEditor from "md-editor-v3";
import {VaIcon} from "vuestic-ui";
import Divider from "@/components/Divider.vue";
import {THEME_COLOR} from "@/common/final";

const MdCatalog = MdEditor.MdCatalog;
export default {
  name: "ReadView",
  components: {Divider, VaIcon, MdEditor, MdCatalog},
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
    },
    getNum(tag) {
      switch (tag) {
        case "h2": return 0;
        case "h3": return 1;
        case "h4": return 2;
        case "h5": return 3;
        case "h6": return 4;
      }
    }
  }
}
</script>

<style scoped>
  #read {
    position: absolute;
    overflow-y: auto;
    padding: 2%;
    max-height: 95%;
  }
  #main-read {
    display: flex;
  }
</style>