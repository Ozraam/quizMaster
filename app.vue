<template>
  <header>
    <NuxtLink class="title" to="/">
      QUIZ MASTER
    </NuxtLink>

    <nav class="nav">
      <ul>
        <li>
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/login" class="nav-link">Login</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/create" class="nav-link">Create</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>

  <NuxtPage />
</template>

<style scoped lang="scss">
.nav ul {
    display: flex;
    width: 100%;
    gap: 10px;
    padding: 0;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav ul li {
    list-style: none;
}

header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    padding: 10px 20px;
}

header .nav-link {
    text-decoration: none;
    color: black;
}

header .nav-link:hover {
    text-decoration: underline;
}

.title {
    font-size: large;
    font-weight: bold;
    margin: 10px 0;
    text-decoration: none;
    color: black;
    cursor: pointer;
}
</style>