<template>
    <form
        ref="loginRef"
        action=""
        class="login-form"
    >
        <h1 class="title">
            Login
        </h1>

        <div class="input-group username input-before">
            <label
                for="username"
                class="input-label hide"
            >Username</label>

            <input
                id="username"
                type="text"
                name="username"
                class="input"
                placeholder=" "
                autocomplete="off"
            >
        </div>

        <div class="input-group password input-before">
            <label
                for="password"
                class="input-label hide"
            >Password</label>

            <input
                id="password"
                type="password"
                name="password"
                class="input"
                placeholder=" "
            >
        </div>

        <div class="input-group">
            <button class="btn">
                Login
            </button>
        </div>
    </form>
</template>
