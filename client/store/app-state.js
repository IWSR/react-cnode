import {
  observable,
  computed,
  // autorun,
  action,
} from 'mobx';

export class AppState {
  @observable count = 0
  @observable name = '0w0'
  @computed get msg() {
    return `${this.name} say count is ${this.count}`;
  }
  @action add() {
    this.count += 1;
  }
  @action changeName(name) {
    this.name = name;
  }
}

const appState = new AppState();

export default appState;
