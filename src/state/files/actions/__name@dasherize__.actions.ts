export class <%= classify(name) %>Action {
  static readonly type = '[<%= classify(name) %>] Action';
  static readonly desc = '<%= dasherize(name) %> description';
  constructor(public readonly payload?: any) { }
}
