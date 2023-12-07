<template>
    <div class="w-screen bg-white flex flew-row p-5 justify-between items-center">
      <img class="rounded-full w-12" src="https://urlz.fr/oOFT" />
      <div class="flex flex-row space-x-5 justify-start">
        <span>Electronique</span>
        <span>Informatique</span>
        <span>Sport</span>
        <span>Science</span>
      </div>
      <div class="mr-5 cursor-pointer flex flex-row space-x-3">

        <NuxtLink to="/cart">
            <img class="rounded-full w-7" src="/shopping-bag.png" />
        </NuxtLink>
      </div>
    </div>
  </template>

<script setup lang="ts">

import axios from 'axios';
import { type Ref, reactive, ref } from 'vue';

const isConnected:Ref<boolean> = ref(false);
const token:string = localStorage.getItem('maelce-token') || '';
const resfreshToken:string = localStorage.getItem('maelce-refresh-token') || '';

if(!token ||!resfreshToken) {
    console.log('No token or resfresh token in the cache');
    isConnected.value = false;
}
else {
    const url:string = 'http://127.0.0.1:4686/verify_token';

}

// get from getLocalStorage token and resfresh token
// We see if token is expired or not by fetchinf


</script>