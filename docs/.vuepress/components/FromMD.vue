<template>
  <div id="content"> 此部分为即时渲染，如果您看到我，请尝试刷新 </div>
</template>

<script>
//引入这个模块是因为之前是直接把markdown渲染成html，这样谷歌会检索到下载的链接，
//然后不知道为啥就给我屏蔽了，说是有恶意软件下载，我是真的服气
//试一下从markdown即时渲染出来能不能不被谷歌击毙
export default {
  props: ['source'],
  mounted() {
      fetch(this.source).then((response) => response.text().then((text)=>{
        document.getElementById('content').innerHTML = marked.parse(text);
    }))
  }
};
</script>

