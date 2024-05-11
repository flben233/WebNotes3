<template>
  <VaVirtualScroller
      v-slot="{ item, index }"
      :items="articles"
      :wrapper-size="wrapperSize"
  >
    <VaList>
      <VaListItem class="article-item">
        <VaListItemSection>
          <VaListItemLabel style="cursor: pointer;" @click="jump(item)">
            {{
              item.article.substring(0,
                  item.article.indexOf("\n")).replaceAll("#", "")
            }}
          </VaListItemLabel>

          <VaListItemLabel
              caption
              :lines="3"
          >
            {{ item.article }}
          </VaListItemLabel>
        </VaListItemSection>

        <VaListItemSection icon>
          <VaButton round icon="delete" color="danger" @click="delArticle(item.aid)"/>
        </VaListItemSection>
      </VaListItem>
    </VaList>
  </VaVirtualScroller>
</template>

<script>
export default {
  name: "ArticleList",
  props: ["articles", "wrapperSize", "delArticle"],
  methods: {
    jump(article) {
      open("http://" + location.host + '/article/' + article.aid)
    },
  }
}
</script>

<style scoped>
.article-item {
  margin-bottom: 20px;
}
</style>