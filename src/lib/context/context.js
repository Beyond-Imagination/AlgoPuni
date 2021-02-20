import {Data} from './data';
import {User} from './user';

import {createRepository, findRepository} from '../../utils/files/repository'

export default class Context {
    constructor(repository=findRepository()) {
        this.repository = repository;
        this.user = new User(this.repository);
        this.data = new Data(this.repository);
    }

    create() {
        createRepository(this.repository);
        this.user.create(this.repository);
        this.data.addUser(this.user);
        this.data.create(this.repository);
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
