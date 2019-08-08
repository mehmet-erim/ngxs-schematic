export namespace <%= classify(name) %> {
  export interface State {
    <%= camelize(name) %>: any;
  }
}
