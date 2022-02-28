import { actions, ActionType } from './action';
import { createReducer } from '../common/createActionReducer';

export interface IState {
  list: any[];
  isLoading: boolean;
  isError: boolean;
}

const INITIAL_STATE = {
  list: [],
  isLoading: false,
  isError: false,
};
type Action = ReturnType<typeof actions[keyof typeof actions]>;

export default createReducer<IState, ActionType, Action>(INITIAL_STATE, {
  [ActionType.RequestChild]: (state) => state,
  [ActionType.AddChildList]: (state, action) => (state.list = action.payload),
  [ActionType.SetLoading]: (state, action) =>
    (state.isLoading = action.payload as unknown as boolean),
  [ActionType.Error]: (state, action) =>
    (state.isError = action.payload as unknown as boolean),
});
