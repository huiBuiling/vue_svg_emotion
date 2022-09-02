import { type InjectionKey } from 'vue'
import { type Store, createStore, useStore as baseUseStore } from 'vuex'

import { WrapperShape } from '@/enums'
import type { AvatarOption } from '@/types'
import { getRandomAvatarOption } from '@/utils'
import { SCREEN } from '@/utils/constant'

import {
  REDO,
  SET_AVATAR_OPTION,
  SET_SIDER_STATUS,
  UNDO,
} from './mutation-type'

export interface State {
  history: {
    past: AvatarOption[]
    present: AvatarOption
    future: AvatarOption[]
  }
  isSiderCollapsed: boolean
}

/**
 * present = past: => 
 [{
    background: {color: '#506AF4'},
    gender: "female",
    wrapperShape: "squircle",
    widgets: {
      face: {shape: 'base'}, // 脸
      tops: {shape: 'wave', fillColor: '#C09FFF'}, // 头发
      ear: {shape: 'attached'}, // 耳朵
      earrings: {shape: 'none'}, // 耳环
      eyebrows: {shape: 'up'}, // 眉毛
      eyes: {shape: 'ellipse'}, // 眼睛
      nose: {shape: 'round'}, // 鼻子
      glasses: {shape: 'none'}, // 眼镜
      mouth: {shape: 'frown'}, // 嘴巴
      beard: {shape: 'none'}, // 胡子
      clothes: {shape: 'open', fillColor: '#FC909F'}, // 衣服
    }
  }]
 */
export default createStore<State>({
  strict: true,

  // past, parent 用来撤回，前进
  state: {
    history: {
      past: [],
      present: getRandomAvatarOption({ wrapperShape: WrapperShape.Squircle }),
      future: [],
    },
    isSiderCollapsed: window.innerWidth <= SCREEN.lg,
  },

  mutations: {
    [SET_AVATAR_OPTION](state, data: AvatarOption) {
      state.history = {
        past: [...state.history.past, state.history.present],
        present: data,
        future: [],
      }
      console.log('slide_store', state.history.past)
      console.log('slide_store', JSON.parse(JSON.stringify(state.history.past)))
    },

    [UNDO](state) {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1]
        const newPast = state.history.past.slice(
          0,
          state.history.past.length - 1
        )
        state.history = {
          past: newPast,
          present: previous,
          future: [state.history.present, ...state.history.future],
        }
      }
    },

    [REDO](state) {
      if (state.history.future.length > 0) {
        const next = state.history.future[0]
        const newFuture = state.history.future.slice(1)
        state.history = {
          past: [...state.history.past, state.history.present],
          present: next,
          future: newFuture,
        }
      }
    },

    [SET_SIDER_STATUS](state, collapsed) {
      if (collapsed !== state.isSiderCollapsed) {
        state.isSiderCollapsed = collapsed
      }
    },
  },
})

export const storeKey: InjectionKey<Store<State>> = Symbol()

export function useStore() {
  return baseUseStore(storeKey)
}
