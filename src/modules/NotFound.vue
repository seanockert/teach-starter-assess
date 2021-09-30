<template>
  <div class="wrapper">
    <div class="content">
      <img src="/images/not-found.png" alt="" height="200" width="200" />
      <h1>Oops, page not found</h1>
      <p>
        Please check that you've typed in the correct link or
        <router-link :to="baseUrl">return home</router-link>.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  align-items: center;
  background-color: $grey-0;
  display: flex;
  justify-content: center;
  text-align: center;
}

h1 {
  margin-top: 0;
}

img {
  margin: 0 auto;
}
</style>
