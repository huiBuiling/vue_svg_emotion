<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <div class="svg_all">
    <div class="svg_div" v-for="item in svgIcons" :key="item.name">
      <Icon
        :class="`${itemC.class}`"
        :icon="itemC.name"
        v-for="itemC in item.icons"
        :key="itemC.name"
      />
      <Icon class="eye" icon="eye" />
      <Icon class="mouth" icon="mouth" :class="'test'" />
      <Icon class="ear" icon="ear" />

      <!-- <Icon class="hair" icon="girl01" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon.vue'

const svgIcons = [
  {
    name: '齐刘海',
    icons: [
      {
        name: 'girl_qi'
      },
      {
        name: 'hair_qi',
        class: 'hair'
      }
      // {
      //   name: 'eye',
      //   class: 'eye'
      // },
      // {
      //   name: 'mouth',
      //   class: 'mouth'
      // }
    ]
  },
  {
    name: '卷发',
    icons: [
      {
        name: 'girl_juan',
        class: 'hair'
      }
      // {
      //   name: 'hair_juan',
      //   class: 'juan_hair'
      // }
    ]
  },
  {
    name: '齐刘海',
    icons: [
      // {
      //   name: 'eye',
      //   class: 'head'
      // },
      // {
      //   name: 'mouth',
      //   class: 'mouth'
      // }
    ]
  },
  {
    name: '齐刘海',
    icons: [
      // {
      //   name: 'eye',
      //   class: 'head'
      // },
      // {
      //   name: 'mouth',
      //   class: 'mouth'
      // }
    ]
  }
]
</script>

<style scoped>
.svg_all {
  display: flex;
  flex-wrap: wrap;
  max-width: 31rem;
}
.svg_div {
  /* flex: 1; */
  position: relative;
  width: 15em;
  height: 15em;
  border: 1px solid slateblue;
}
.head {
  position: absolute;
  left: 0;
  top: 0;
}

.hair,
.eye,
.ear,
.mouth {
  position: absolute;
  left: 0;
  top: 0;
}
.juan_hair {
  position: absolute;
  top: -24px;
  left: 7px;
}

.test {
  color: slateblue;
}
</style>
