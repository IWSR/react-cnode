import AppStateClass from './app-state';

export const AppState = AppStateClass;

export default {
  AppState,
};

// 提供给服务端渲染
export const createStoreMap = () => {
  return {
    appState: new AppState(),
  };
};
