export class <%= classify(name) %>Action {
  static readonly type = '[<%= classify(name) %>] Action';
  constructor(public payload?: any) { }
}
