/* eslint-disable no-param-reassign */
import { Color } from 'tvision-color';
import STYLE_CONFIG from '@/config/style';
import { TColorSeries, TColorToken, LIGHT_CHART_COLORS, DARK_CHART_COLORS } from '@/config/color';
import { insertThemeStylesheet, generateColorMap } from '@/utils/color';

// 定义的state初始值
const state = {
  ...STYLE_CONFIG,
  showSettingPanel: false,
  colorList: {},
  chartColors: LIGHT_CHART_COLORS,
};

type IInitStateType = typeof state;

export interface IStateType extends IInitStateType {
  showSettingPanel: boolean;
}

// 定义的state的初始值方法，传入state或者额外的方法，然后利用 vuex 的双向数据驱动进行值的改变
// 可通过this.$store.commit(' ')调用，但是触发的是同步事件
const mutations = {
  update(state: IStateType, payload: IStateType) {
    state.showBreadcrumb = payload.showBreadcrumb;
    state.mode = payload.mode;
    state.layout = payload.layout;
    state.isSidebarCompact = payload.isSidebarCompact;
    state.splitMenu = payload.splitMenu;
    state.isSidebarFixed = payload.isSidebarFixed;
    state.isHeaderFixed = payload.isHeaderFixed;
    state.showHeader = payload.showHeader;
    state.brandTheme = payload.brandTheme;
    state.isUseTabsRouter = payload.isUseTabsRouter;
  },
  toggleSidebarCompact(state: IStateType) {
    state.isSidebarCompact = !state.isSidebarCompact;
  },
  toggleUseTabsRouter(state: IStateType) {
    state.isUseTabsRouter = !state.isUseTabsRouter;
  },
  showSidebarCompact(state: IStateType, payload: boolean) {
    state.isSidebarCompact = payload;
  },
  toggleSettingPanel(state: IStateType, payload: boolean) {
    state.showSettingPanel = payload;
  },
  addColor(state: IStateType, payload: TColorSeries) {
    state.colorList = { ...state.colorList, ...payload };
  },
  changeChartColor(state: IStateType, payload: TColorToken) {
    state.chartColors = { ...payload };
  },
};

const getters = {
  showHeader: (state: IStateType) => state.showHeader,
  showSidebar: (state: IStateType) => state.layout !== 'top',
  showSidebarLogo: (state: IStateType) => state.layout === 'side',
  showHeaderLogo: (state: IStateType) => state.layout !== 'side',
  isUseTabsRouter: (state: IStateType) => state.isUseTabsRouter,
  mode: (state: IStateType) => {
    if (state.mode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme:dark)');
      if (media.matches) {
        return 'dark';
      }
      return 'light';
    }
    return state.mode;
  },
};

const actions = {
  changeTheme({ commit, dispatch }, payload: IStateType) {
    dispatch('changeMode', payload);
    dispatch('changeBrandTheme', payload);
    commit('update', payload);
  },
  changeMode({ commit }, payload: IStateType) {
    let theme = payload.mode;
    if (payload.mode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme:dark)');
      if (media.matches) {
        theme = 'dark';
      } else {
        theme = 'light';
      }
    }
    const isDarkMode = theme === 'dark';

    document.documentElement.setAttribute('theme-mode', isDarkMode ? 'dark' : '');

    commit('changeChartColor', isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS);
  },
  changeBrandTheme(_: { state: IStateType }, payload: IStateType) {
    const { brandTheme, mode } = payload;
    const { colors: newPalette, primary: brandColorIndex } = Color.getColorGradations({
      colors: [brandTheme],
      step: 10,
      remainInput: false, // 是否保留输入 不保留会矫正不合适的主题色
    })[0];
    const colorMap = generateColorMap(brandTheme, newPalette, mode as 'light' | 'dark', brandColorIndex);

    insertThemeStylesheet(brandTheme, colorMap, mode as 'light' | 'dark');

    document.documentElement.setAttribute('theme-color', brandTheme);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
