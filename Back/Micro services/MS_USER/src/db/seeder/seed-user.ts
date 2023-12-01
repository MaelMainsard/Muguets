import { AppDataSource } from "../data-source"
import { User } from '../entity/User';
import { faker } from '@faker-js/faker';

export async function seedUsers() {
    // Vérifiez le nombre d'utilisateurs dans la table
    const userRepository = AppDataSource.getRepository(User);
    const usersCount = await userRepository.count();

    // Ajoutez des données uniquement si la table est vide
    if (usersCount === 0) {
        // Ajoutez 30 utilisateurs
        for (let i = 0; i < 30; i++) {
            const user = new User();
            user.username = faker.person.fullName();
            user.email = faker.internet.email();
            user.password = faker.internet.password();
            user.adress = faker.location.street();
            user.phone = faker.phone.number();
            user.confirmed = false;
            await userRepository.save(user);
        }
    }
}