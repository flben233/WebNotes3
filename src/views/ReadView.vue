<template>
  <div id="read">
    <md-editor v-model="text" pageFullscreen :disabled="true" :toolbars="toolbars">
      <template #defToolbars>
        <div style="display: flex; flex-flow: row; align-items: center;">
          <va-icon name="person"/>
          <p style="padding-bottom: 0.2vh; margin-left: 5px">{{ username }}</p>
        </div>

      </template>
    </md-editor>
  </div>
</template>

<script>
import {getArticleById} from "@/api/note";
import MdEditor from "md-editor-v3";
import {VaIcon} from "vuestic-ui";

const NormalToolbar = MdEditor.NormalToolbar;

export default {
  name: "ReadView",
  components: {VaIcon, MdEditor, NormalToolbar},
  mounted() {
    this.getText();
  },
  data() {
    return {
      text: '',
      username: '',
      toolbars: [
        0,
        "-",
        '=',
        'pageFullscreen',
        'fullscreen',
        'catalog',
      ]
    }
  },
  methods: {
    getText() {
      getArticleById(this.$route.params.aid).then((response) => {
        this.text = response.data.data.article
        this.username = response.data.data.username
      })
    },
    handler() {

    }
  }
}
</script>

<style>
  #read {
    overflow: auto;
  }
  .md-editor-input-wrapper {
    display: none;
  }
</style>