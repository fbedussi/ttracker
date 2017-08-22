import idMaker from './helpers/idMaker';

const clients = [];
const projects = [];

const clientsIdMaker = idMaker(clients);
const projectsIdMaker = idMaker(projects, 'p');