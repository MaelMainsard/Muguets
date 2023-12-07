<template>
    <div class="w-screen bg-white flex flew-row p-5 justify-between items-center">
      <img class="rounded-full w-12" src="/logo-maelce.jpg" />
      <form class=" w-4/6">   
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required>
              <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
      </form>
      <div class="mr-5 cursor-pointer flex flex-row space-x-3 items-center">
        <span v-if="isConnected" class="test-red-500 cursor-pointer">Déconnexion</span>
        
        <a v-else href="http://127.0.0.1:4690/login" class="cursor-pointer">Connexion</a>

        <NuxtLink to="/cart">
            <img class="rounded-full w-7" src="/shopping-bag.png" />
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flew flex-row space-x-5 mx-5">
      <span class=" cursor-pointer" v-for="(category, index) in categoryList" :key="index">{{ category }}</span>
    </div>
  </template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

const isConnected = ref(false);
const categoryList = ['Electronics','Companies','Groceries','Computers','Books']

onMounted(async () => {

  const token = localStorage.getItem('maelce-token');
  const refreshToken = localStorage.getItem('maelce-refresh-token');

  

  if (!token) {
    console.log('No token in the cache');
    isConnected.value = false;
  } else {
    const url = 'http://127.0.0.1:4686/verify_token';

    console.log(token);

    try {
      const params = {
        token: token,
      };

      const response = await axios.post(url, params);

      if(response.data){
        isConnected.value = true;
      }
      else {
        isConnected.value = false;
      }

    } catch (error) {
      console.error(error);
    }
  }
});
</script>