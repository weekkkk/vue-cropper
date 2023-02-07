<template>
  <router-view />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
html {
  font-family: 'Montserrat';
  font-size: var(--n-lh-regular);
  font-size: var(--n-fs-p);
  color: var(--n-base);
}

table {
  $border: 1px solid var(--n-second-25);
  border-collapse: collapse;
  tr {
    td,
    th {
      vertical-align: top;
      padding: var(--n-indent-3);
      &:not(:last-child) {
        border-right: $border;
      }
    }
    &:not(:last-child) {
      td,
      th {
        border-bottom: $border;
      }
    }
  }
}
section.info {
  overflow: auto;
}
</style>
