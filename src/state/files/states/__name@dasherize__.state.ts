import { State, Action, StateContext, Selector } from '@ngxs/store';
import { <%= classify(name) %>Action } from '../actions/<%= dasherize(name) %>.actions';
import { <%= classify(name) %> } from '../models/<%= dasherize(name) %>';

@State<<%= classify(name) %>.State> ({
  name: '<%= classify(name) %>State',
  defaults: {<%= camelize(name) %>: {}} as <%= classify(name) %>.State
})
export class <%= classify(name) %>State {
  @Selector()
  static get<%= classify(name) %>({ <%= camelize(name) %> }: <%= classify(name) %>.State) {
    return <%= camelize(name) %>;
  }

  constructor() { }

  @Action(<%= classify(name) %>Action)
  <%= camelize(name) %>Action({ getState, patchState }: StateContext<<%= classify(name) %>.State>, { payload }: <%= classify(name) %>Action) {
    const state = getState();
    patchState({
      ...state,
    });
  }
}
