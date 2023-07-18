<script setup lang="ts">
import {usePageFrontmatter} from '@vuepress/client';
import {isArray} from '@vuepress/shared';
import {computed} from 'vue';
import type {DefaultThemeHomePageFrontmatter} from '@vuepress/theme-default/lib/client/components/../../shared/index.js';

const frontmatter = usePageFrontmatter<DefaultThemeHomePageFrontmatter>();
const features = computed(() => {
  if (isArray(frontmatter.value.features)) {
    return frontmatter.value.features;
  }
  return [];
});
</script>

<template>
  <div v-if="features.length" class="features">
    <div v-for="feature in features" :key="feature.title" class="feature">
      <h2>{{ feature.title }}</h2>
      <div v-html="feature.details"></div>
    </div>
  </div>
</template>
