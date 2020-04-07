<template>
<div>
  <h1>评论</h1>
  <div id="vcomments"></div>
</div>
</template>

<script>
export default {
  name: 'Valine',
  mounted: function(){
    // require window 
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      this.window = window
      window.AV = require('leancloud-storage')
    }
     
    new Valine({
      el: '#vcomments' ,
      appId: '6NloYo1rdCw6Rsg6jhcogzje-gzGzoHsz',// your appId
      appKey: 'fXEoGtiwFukkdeGkWkizPsBY', // your appKey
      notify:false, 
      verify:false, 
      avatar:'mm', 
      placeholder: '支持markdown回复哦' 
    });
  },
}
</script>
<style>
.comment{
  background:gray;
}
</style>