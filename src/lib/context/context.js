import {Data} from './data';
import {User} from './user';

import {createRepository, findRepository} from '../../utils/files/repository'
import {createGitIgnore} from '../../utils/files/gitignore'

export default class Context {
    constructor(repository=findRepository()) {
        this.repository = repository;
        this.user = new User(this.repository);
        this.data = new Data(this.repository);
    }

    async create() {
        createRepository(this.repository);
        await this.user.create();
        this.data.addUser(this.user);
        this.data.create();
        createGitIgnore(this.repository);
    }
    
    read() {
        this.user.read();
        this.data.read();
    }

    write() {
        this.user.write();
        this.data.write();
    }
}
