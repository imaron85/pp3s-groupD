import { createStore } from "zustand/vanilla";

export type UserState = {
  nickname?: string;
};

export type UserActions = {
  // eslint-disable-next-line no-unused-vars
  setNickname: (nickname: string) => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => ({});

export const defaultInitialUserState: UserState = {
  nickname: undefined,
};

export const createUserStore = (
  initState: UserState = defaultInitialUserState
) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setNickname: (nickname: string) =>
      set({
        nickname,
      }),
  }));
};
