<script setup lang="ts">
import {useSidebar} from 'vitepress/theme';
import {useData} from 'vitepress/dist/client/theme-default/composables/data';
import {useLangs} from 'vitepress/dist/client/theme-default/composables/langs';
import {normalizeLink} from 'vitepress/dist/client/theme-default/support/utils';
import VPImage from 'vitepress/dist/client/theme-default/components/VPImage.vue';
import Versions from './versions.vue';

const {site, theme} = useData();
const {hasSidebar} = useSidebar();
const {currentLang} = useLangs();
</script>

<template>
  <div class="VPNavBarTitle" :class="{'has-sidebar': hasSidebar}">
    <a class="title" :href="normalizeLink(currentLang.link)">
      <slot name="nav-bar-title-before" />
      <VPImage v-if="theme.logo" class="logo" :image="theme.logo" />
      <slot name="nav-bar-title-after" />
    </a>
    <Versions />
  </div>
</template>

<style scoped>
.VPNavBarTitle {
  display: inline-flex;
  align-items: center;
}

.title {
  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  height: var(--vp-nav-height);
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: opacity 0.25s;
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }

  .VPNavBarTitle.has-sidebar .title {
    border-bottom-color: var(--vp-c-divider);
  }
}

:deep(.logo) {
  margin-right: 0.3rem;
  height: 2.2rem;
  min-width: 2.2rem;
}
</style>
