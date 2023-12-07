<template>
  <div class="bg-white shadow-lg h-fit flex flex-col p-8 items-center w-fit max-w-xs">

    <img class="rounded-full w-16 mb-3" src="/logo-maelce.jpg" />

    <span class="mb-6 font-sans text-xl font-semibold justify-center items-center text-center">Réinitialiser votre mot de passe</span>

    <form @submit.prevent="submitForm">

      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Adresse mail :
      </label>
      <input v-model="formData.email"
        class="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email" type="email" placeholder="jean.rene@yahoo.fr">

      <p v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</p>
      <p v-if="responseMessage" class=" text-blue-500 mb-2">{{ responseMessage }}</p>

      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-2">
        Envoyez l'email
      </button>

      <NuxtLink to="/login"><a class="text-xs italic text-blue-500 cursor-pointer flex">Revenir à la page de connection</a></NuxtLink>
    </form>

  </div>
</template>
  
  <script setup lang="ts">
  
  import axios from 'axios';
  import { type Ref, reactive, ref } from 'vue';
  
  const errorMessage:Ref<string> = ref('');
  const responseMessage:Ref<string> = ref('');

  const formData = reactive({
    email: '',
  });
  
  const submitForm = async () => {
    const url:string = 'http://127.0.0.1:4686/send_reset_password';
  
    if (formData.email === ''){
      errorMessage.value = 'Veuillez renseigner votre adresse mail';
      return;
    }
  
    type ReqParams = {
      email: string,
    }
  
    const params:ReqParams = {
      email: formData.email,
    };
  
    try {
      
      const response = await axios.post(url, params);
      errorMessage.value = ''
      responseMessage.value = 'Un email pour réinitialiser votre mot de passe a été envoyé, vérifiez vos spam.';
    } catch (error: any) {
      console.log(error);
      errorMessage.value = error.response.data;
    }
  
  };
  </script>