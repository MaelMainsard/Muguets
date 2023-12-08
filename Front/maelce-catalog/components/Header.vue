<template>
  <div class="fixed">
    <div class="w-screen bg-white flex flex-row p-5 justify-between items-center">
      <img class="rounded-full w-12" src="/logo-maelce.jpg" />
      <form class="w-4/6">
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            required
          />
          <button
            type="submit"
            class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
      <div class="mr-5 cursor-pointer flex flex-row space-x-3 items-center">
        <span v-if="isConnected" class="text-red-500 cursor-pointer">Déconnexion</span>
        <a v-else href="http://127.0.0.1:4690/login" class="cursor-pointer">Connexion</a>
        <NuxtLink to="/cart">
          <img class="rounded-full w-7" src="/shopping-bag.png" />
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex flex-row space-x-5 mx-5 overflow-x-auto scrollbar-hidden">
        <span
          class="cursor-pointer"
          :class="{ 'hover': hoveredCategoryId === category.id }"
          v-for="(category, index) in sortedCategoryList"
          :key="index"
          @mouseover="showSubcategories(category.id)"
          @mouseleave="hideSubcategories"
        >
          <NuxtLink :to="`/categories/${category.name}`">
            <span :style="{ 'font-weight': hoveredCategoryId === category.id ? 'bold' : 'normal' }">
              {{ category.name }}
            </span>
          </NuxtLink>
          <ul v-if="hoveredCategoryId === category.id">
            <li v-for="(subCategory, subIndex) in subCategoryList[category.id]" :key="subIndex">
              <NuxtLink :to="`/categories/${category.name}/${subCategory.name}`">{{ subCategory.name }}</NuxtLink>
            </li>
          </ul>
        </span>
      </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

const isConnected = ref(false);
const categoryList = ref<{ id: number; name: string }[]>([]);
const subCategoryList = ref<{ [key: number]: { id: number; name: string }[] }>({});
const hoveredCategoryId = ref<number | null>(null);

// Utilisez un tableau calculé pour trier la liste des catégories
const sortedCategoryList = ref<{ id: number; name: string }[]>([]);

onMounted(async () => {
  function getQueryParam(name:string) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Extraction des tokens depuis les paramètres de requête
  const accessToken = getQueryParam('accessToken');
  const refreshToken = getQueryParam('refreshToken');

  // Utilisation des tokens comme nécessaire
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  
  try {
    const response = await axios.get('http://127.0.0.1:4688/v1/parent-categories');
    response.data.forEach(async (category: { id: number; name: any }) => {
      categoryList.value.push({ id: category.id, name: category.name });
      // Initialize the subcategory list
      subCategoryList.value[category.id] = [];
      // Load subcategories
      await loadSubcategories(category.id);
    });

    // Triez la liste des catégories par ID
    sortedCategoryList.value = categoryList.value.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error(error);
  }
});

const showSubcategories = async (categoryId: number) => {
  // Mettez à jour la catégorie survolée
  hoveredCategoryId.value = categoryId;
};

const hideSubcategories = () => {
  // Réinitialisez la catégorie survolée lorsque le curseur quitte la zone de survol
  hoveredCategoryId.value = null;
};

const loadSubcategories = async (parentId: number) => {
  try {
    const response = await axios.get(`http://127.0.0.1:4688/v1/categories/${parentId}`);
    subCategoryList.value[parentId] = response.data;
  } catch (error) {
    console.error(error);
  }
};


</script>