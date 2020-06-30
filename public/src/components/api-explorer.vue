<template>
  <div>
    <iframe
      id="nb-api-explorer"
      :src="ApiExplorerUrlPrefix"
      ref="iframe"
      @load="iframeResizer()"
      scrolling="no"
    />
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      ApiExplorerUrlPrefix: window.ApiExplorerUrlPrefix || '/explorer',
      observer: undefined,
    };
  },
  methods: {
    iframeResizer: function() {
      // Select the node that will be observed for mutations
      const iframeNode = this.$refs.iframe;
      const targetNode = iframeNode.contentWindow.document.documentElement;

      // Options for the observer (which mutations to observe)
      const config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      };

      // Create an observer instance linked to the callback function
      this.observer = new MutationObserver(() => {
        iframeNode.style.height = targetNode.scrollHeight + 'px';
      });

      // Start observing the target node for configured mutations
      this.observer.observe(targetNode, config);
    },
  },
  beforeDestroy: function() {
    this.observer.disconnect();
  },
};
</script>
<style scoped>
iframe {
  min-width: 100%;
  width: 1px;
  border: none;
}
</style>
