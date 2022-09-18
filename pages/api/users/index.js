import { apiHandler, usersRepo, omit } from 'helpers/api';

export default apiHandler({
    get: getUsers
});

async function getUsers(req, res) {
    // return users without hashed passwords in the response
    const all_users = await usersRepo.getAll();
    let response = all_users.map(x => omit(x, 'hash'))
    return res.status(200).json(response);
}
