<template>
  <div class="bg-white shadow-lg h-fit flex flex-col p-8 items-center w-fit max-w-xs">

    <img class="rounded-full w-16 mb-3" src="/logo-maelce.jpg"/>

    <span class="mb-6 font-sans text-xl font-semibold justify-center items-center">Connectez-vous</span>

    <form @submit.prevent="submitForm">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Adresse mail :
    </label>
    <input v-model="formData.email" class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="jean.rene@yahoo.fr">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Mot de passe :</label>
    <div class="flex flex-col items-end align-top mb-2">
      <input v-model="formData.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="xxxxxxxx">
      <a class="text-xs italic text-blue-500 cursor-pointer"><NuxtLink to="/reset_password">Mot de passe oublié?</NuxtLink></a>
    </div>

    <p v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</p>

    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-1">
      Connectez-vous
    </button>

    <span class="text-xs text-gray-700 justify-center flex mb-1">- OU -</span>

    <NuxtLink to="/register" class="text-blue-500">
        <button class="bg-white border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 rounded w-full focus:outline-none focus:border-blue-700">
          Inscrivez-vous
        </button>
    </NuxtLink>
  </form>

  </div>
</template>

<script setup lang="ts">

import axios from 'axios';
import { type Ref, reactive, ref } from 'vue';

const errorMessage: Ref<string> = ref('');

const formData = reactive({
  email: '',
  password: '',
});

const submitForm = async () => {
  const url: string = 'http://127.0.0.1:4686/login';

  if (formData.email === '' || formData.password === '') {
    errorMessage.value = 'Veuillez renseigner votre adresse mail et votre mot de passe';
    return;
  }

  type ReqParams = {
    email: string,
    password: string,
  };

  type ResParams = {
    refresh_token: string,
    token: string,
  };

  const params: ReqParams = {
    email: formData.email,
    password: formData.password,
  };

  try {
    const response = await axios.post(url, params);

    errorMessage.value = '';

    // Utilisation du Cache Storage API au lieu de localStorage
    const cache = await caches.open('maelce-cache');
    const cacheData: ResParams = {
      refresh_token: response.data.refresh_token,
      token: response.data.token,
    };
    const cacheResponse = new Response(JSON.stringify(cacheData));
    await cache.put('maelce-token', cacheResponse);

    // Redirection vers la page d'accueil
    window.location.href = 'http://127.0.0.1:4692/';
  } catch (error: any) {
    errorMessage.value = error.response.data;
  }
};

</script>