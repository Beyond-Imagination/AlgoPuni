import {Data} from './data';
import {User} from './user';

import {findRepository} from '../../utils/files/repository'

export default class Context {
    constructor(repository=findRepository()) {
        this.repository = repository;
        this.user = new User(this.repository);
        this.data = new Data(this.repository);
    }

    addUser() {
        this.data.addUser(this.user);
    }
}
