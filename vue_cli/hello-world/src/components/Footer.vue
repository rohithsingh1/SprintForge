<template>
  <footer>
    <p>{{ websiteRights }}</p>
  </footer>
</template>

<script>
export default {
    name: 'AppFooter',
    data(){
        return {
            websiteRights: `© ${new Date().getFullYear()} SprintForge. All rights reserved.`
        }
    }
}

</script>

<style scoped>

</style>