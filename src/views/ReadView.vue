<template>
  <div>
    <div style="padding: 0.5%; height: 5%; display: flex; align-items: center">
      <va-icon name="person"/>
      {{ username }}
    </div>
    <Divider/>
    <div id="main-read">
      <div id="read" style="max-width: 50%; margin-left: 10%">
        <md-editor v-model="text" previewOnly @onHtmlChanged="handler"/>
      </div>
      <div style="margin-left: 70%; max-height: 95%; overflow-y: auto; padding-top: 2%; padding-bottom: 2%; position: absolute">
        <div v-for="title in catalog" style="margin-top: 1.5vh">
          <a :href="'#' + title.id" style="color: var(--theme-color); font-size: 2vh;" v-if="title.localName === 'h1'"> {{ title.id }}</a>
          <a :href="'#' + title.id"
             :style="{'color': '#303133', 'font-size': fontSize[getNum(title.localName)], 'padding-left': paddingLeft[getNum(title.localName)]}"
             v-if="title.localName !== 'h1'">
            {{ title.id }}
          </a>
          <br/>
        </div>
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

export default {
  name: "ReadView",
  components: {Divider, VaIcon, MdEditor},
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
      this.catalog = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      console.log(this.catalog);
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