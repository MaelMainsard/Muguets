'use strict';
const { faker } = require('@faker-js/faker');

function genererAdresseLivraison() {
  const adresse = faker.location.streetAddress();
  const ville = faker.location.city();
  const codePostal = faker.location.zipCode();
  const pays = faker.location.country();

  return(`${adresse},${ville},${codePostal},${pays}`)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Créez un tableau d'utilisateurs avec des mots de passe hachés
    const users = Array.from({ length: 30 }, (_, index) => ({
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      adress: genererAdresseLivraison(),
      phone: faker.phone.number(), // Génère des numéros de téléphone uniques
    }));

    // Insérez les utilisateurs dans la table Utilisateurs
    await queryInterface.bulkInsert('Users', users, {});

    // Ajoutez d'autres opérations que vous souhaitez effectuer après l'insertion des utilisateurs
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimez tous les utilisateurs insérés dans la fonction up
    await queryInterface.bulkDelete('Users', null, {});
  }
};