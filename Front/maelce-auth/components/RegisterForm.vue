<template>
  <div class="bg-white shadow-lg h-fit flex flex-col p-8 items-center w-fit max-w-xs">

    <img class="rounded-full w-16 mb-3" src="/logo-maelce.jpg"/>

    <span class="mb-6 font-sans text-xl font-semibold justify-center items-center">Inscrivez-vous</span>

    <form @submit.prevent="submitForm">

      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Nom Prénom :
      </label>
      <input v-model="formData.username"
        class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email" type="text" placeholder="Jean Rene">

      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Adresse mail :
      </label>
      <input v-model="formData.email"
        class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email" type="email" placeholder="jean.rene@yahoo.fr">

      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Mot de passe :
      </label>
      <input v-model="formData.password"
        class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="password" type="password" placeholder="xxxxxxxx">

      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Confirmez votre mot de passe :
      </label>
      <input v-model="formData.confirmPassword"
        class="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="password" type="password" placeholder="xxxxxxxx">

      <p v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</p>

      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
        Inscrivez-vous
      </button>

      <span class="text-xs text-gray-700 justify-center flex mb-1">- OU -</span>

      <NuxtLink to="/login" class="text-blue-500">
        <button class="bg-white border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 rounded w-full focus:outline-none focus:border-blue-700">
          Connectez-vous
        </button>
      </NuxtLink>
  </form>

</div></template>
  
  <script setup lang="ts">
  
  import axios from 'axios';
  import { type Ref, reactive, ref } from 'vue';
  
  const errorMessage:Ref<string> = ref('');
  
  const formData = reactive({
    username : '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const submitForm = async () => {
    const url:string = 'http://127.0.0.1:4686/register';

    if(formData.username === '') {
      errorMessage.value = 'Veuillez saisir votre nom';
      return;
    }
  
    if (formData.email === '' || formData.password === '') {
      errorMessage.value = 'Veuillez renseigner votre adresse mail et votre mot de passe';
      return;
    }

    if (formData.password!== formData.confirmPassword) {
      errorMessage.value = 'Les mots de passe ne correspondent pas';
      return;
    }
  
    type ReqParams = {
      username: string,
      email: string,
      password: string,
    }
  
    type ResParams = {
      refresh_token: string,
      token: string,
    }
  
    const params:ReqParams = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
  
    // Mettre dans he headers les tokens
    try {
      
      const response = await axios.post(url, params);
      const tokens:ResParams = response.data;

      errorMessage.value = ''
      
      localStorage.setItem('maelce-token', tokens.token);
      localStorage.setItem('maelce-refresh-token', tokens.refresh_token);


      window.location.href = 'http://127.0.0.1:4692/';
  
    } catch (error: any) {
      errorMessage.value = error.response.data;
    }
  
  };
  </script>