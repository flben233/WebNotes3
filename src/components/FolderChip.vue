<template>
  <div>
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
    <va-modal v-model="showRename" hide-default-actions>
      <template #header>
        <Title style="text-align: center">请输入新名字</Title>
      </template>
      <va-input v-model="newName" :color="themeColor"/>
      <template #footer>
        <va-button :color="themeColor" text-color="#ffffff" @click="rename" style="margin-right: 10px">
          确认
        </va-button>
        <va-button preset="secondary" :color="themeColor" @click="showRename = false">
          取消
        </va-button>
      </template>
    </va-modal>
    <va-dropdown trigger="right-click">
      <template #anchor>
        <va-chip size="small"
                 :style="{whiteSpace: 'nowrap', marginRight: '5px', fontSize: 'x-small', transform: 'scale(' + (pageHeight * 0.03 / 28.0).toString() + ')'}"
                 :color="themeColor" outline>
          {{ item.name }}
        </va-chip>
      </template>
      <va-dropdown-content>
        <va-button :color="themeColor" text-color="#ffffff" style="margin-right: 10px" @click="showDelete = true">
          删除
        </va-button>
        <va-button :color="themeColor" text-color="#ffffff" style="margin-right: 10px" @click="showRename = true">
          重命名
        </va-button>
      </va-dropdown-content>
    </va-dropdown>
  </div>
</template>

<script>
import {THEME_COLOR} from "@/common/final";
import Title from "@/components/Title.vue";
import {deleteFolder, renameFolder} from "@/api/folder";

export default {
  name: "FolderChip",
  components: {Title},
  props: ["item"],
  emits: ["start", "finish"],
  data() {
    return {
      themeColor: THEME_COLOR,
      pageHeight: innerHeight,
      showDelete: false,
      showRename: false,
      newName: ""
    }
  },
  methods: {
    del() {
      this.$emit("start");
      deleteFolder(this.item.id).then((resp) => {
        if (resp.data.code === 0) {
          this.$vaToast.init({message: '删除成功', color: 'success', closeable: false, duration: 3000});
        } else {
          this.$vaToast.init({message: '删除失败', color: 'danger', closeable: false, duration: 3000});
        }
        this.showDelete = false;
        this.$emit("finish");
      })
    },
    rename() {
      this.$emit("start");
      renameFolder(this.item.id, this.newName).then((resp) => {
        if (resp.data.code === 0) {
          this.$vaToast.init({message: '重命名成功', color: 'success', closeable: false, duration: 3000});
        } else {
          this.$vaToast.init({message: '重命名失败', color: 'danger', closeable: false, duration: 3000});
        }
        this.showRename = false;
        this.$emit("finish");
      })
    },
  }
}
</script>

<style scoped>

</style>