<script setup lang="ts">
import Home from '@theme/Home.vue'
import Navbar from '@theme/Navbar.vue'
import Page from '@theme/Page.vue'
import Sidebar from '@theme/Sidebar.vue'
import { usePageData, usePageFrontmatter } from '@vuepress/client'
import { computed, onMounted, onUnmounted, ref, Transition } from 'vue'
import { useRouter } from 'vue-router'
import {
  useScrollPromise,
  useSidebarItems,
  useThemeLocaleData,
} from '@vuepress/theme-default/lib/client/composables'

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'jxy-walkthrough-sidebar-collapsed'

const page = usePageData()
const frontmatter = usePageFrontmatter()
const themeLocale = useThemeLocaleData()

// navbar
const shouldShowNavbar = computed(
  () => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false
)

// sidebar
const sidebarItems = useSidebarItems()
const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const hasSidebar = computed(() => sidebarItems.value.length > 0)

const toggleSidebar = (to?: boolean): void => {
  isSidebarOpen.value = typeof to === 'boolean' ? to : !isSidebarOpen.value
}

const persistSidebarCollapsed = (value: boolean): void => {
  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(value))
  } catch {
    // Ignore storage errors so the visual toggle still works.
  }
}

const toggleSidebarCollapsed = (): void => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  persistSidebarCollapsed(isSidebarCollapsed.value)
}

const touchStart = { x: 0, y: 0 }
const onTouchStart = (e): void => {
  touchStart.x = e.changedTouches[0].clientX
  touchStart.y = e.changedTouches[0].clientY
}
const onTouchEnd = (e): void => {
  const dx = e.changedTouches[0].clientX - touchStart.x
  const dy = e.changedTouches[0].clientY - touchStart.y
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx > 0 && touchStart.x <= 80) {
      toggleSidebar(true)
    } else {
      toggleSidebar(false)
    }
  }
}

// classes
const containerClass = computed(() => [
  {
    'no-navbar': !shouldShowNavbar.value,
    'no-sidebar': !hasSidebar.value,
    'sidebar-open': isSidebarOpen.value,
    'sidebar-collapsed': hasSidebar.value && isSidebarCollapsed.value,
  },
  frontmatter.value.pageClass,
])

// close mobile sidebar after navigation
let unregisterRouterHook
onMounted(() => {
  try {
    isSidebarCollapsed.value =
      window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
  } catch {
    isSidebarCollapsed.value = false
  }

  const router = useRouter()
  unregisterRouterHook = router.afterEach(() => {
    toggleSidebar(false)
  })
})
onUnmounted(() => {
  unregisterRouterHook()
})

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
</script>

<template>
  <div
    class="theme-container"
    :class="containerClass"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <slot name="navbar">
      <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar">
        <template #before>
          <slot name="navbar-before" />
        </template>
        <template #after>
          <slot name="navbar-after" />
        </template>
      </Navbar>
    </slot>

    <button
      v-if="hasSidebar"
      class="sidebar-collapse-toggle"
      :class="{ 'is-collapsed': isSidebarCollapsed }"
      type="button"
      :aria-label="isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
      :title="isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
      :aria-pressed="isSidebarCollapsed"
      @click="toggleSidebarCollapsed"
    >
      <span class="toggle-arrow" aria-hidden="true">
        {{ isSidebarCollapsed ? '▶' : '◀' }}
      </span>
    </button>

    <div class="sidebar-mask" @click="toggleSidebar(false)" />

    <slot name="sidebar">
      <Sidebar>
        <template #top>
          <slot name="sidebar-top" />
        </template>
        <template #bottom>
          <slot name="sidebar-bottom" />
        </template>
      </Sidebar>
    </slot>

    <slot name="page">
      <Home v-if="frontmatter.home" />

      <Transition
        v-else
        name="fade-slide-y"
        mode="out-in"
        @before-enter="onBeforeEnter"
        @before-leave="onBeforeLeave"
      >
        <Page :key="page.path">
          <template #top>
            <slot name="page-top" />
          </template>
          <template #bottom>
            <slot name="page-bottom" />
          </template>
        </Page>
      </Transition>
    </slot>
  </div>
</template>
