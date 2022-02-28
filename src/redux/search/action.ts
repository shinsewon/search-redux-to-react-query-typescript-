import { createAction } from '../common/createActionReducer';

export enum ActionType {
  RequestChild = 'search/REQUEST_CHILD',
  AddChildList = 'search/ADD_CHILD_LIST',
  SetLoading = 'search/SET_LOADING',
  Error = 'search/ERROR',
}

export const actions = {
  requestChildList: (child: { child_name: string }) =>
    createAction(ActionType.RequestChild, child),
  addChildList: (list: any[]) => createAction(ActionType.AddChildList, list),
  setLoading: (isLoading: boolean) =>
    createAction(ActionType.SetLoading, isLoading),
  error: (isError: boolean) => createAction(ActionType.Error, isError),
};
