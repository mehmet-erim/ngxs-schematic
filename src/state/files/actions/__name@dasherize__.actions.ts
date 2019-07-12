export class <%= classify(name) %>Action {
  static readonly type = '[<%= classify(name) %>] Action';
  constructor(public readonly payload?: any) { }
}
