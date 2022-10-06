<template>
  <div id="content"></div>
</template>

<script>
export default {
  props: ['source'],
  mounted() {
      fetch(this.source).then((response) => response.text().then((text)=>{
        document.getElementById('content').innerHTML = marked.parse(text);
    }))
  }
};
</script>

