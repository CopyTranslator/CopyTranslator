<template>
  <div id="vcomments"></div>
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
      placeholder: 'just go go' 
    });
  },
}
</script>