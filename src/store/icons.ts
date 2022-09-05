import { defineStore } from 'pinia'

import type { AvatarOldOption, AvatarOption } from '@/utils/shapeBaseTypes'

export interface State {
  name: string
  widgetsData: AvatarOption
  widgetsDataArr: AvatarOldOption[]
  // colorsSetting: {
  //   bg: string
  //   tops: string
  //   clothes: string
  //   glasses: string
  //   earrings: string
  // }
  // activeShape: {
  //   face: string
  //   tops: string
  //   ear: string
  //   earrings: string
  //   eyebrow: string
  //   eyes: string
  //   nose: string
  //   glasses: string
  //   mouth: string
  //   beard: string
  //   clothes: string
  // }
}

export const widgetStore = defineStore({
  id: 'icons', // id 必填，且需要唯一
  state: (): State => {
    return {
      name: 'hui',
      widgetsData: {
        widgets: {},
      },
      widgetsDataArr: [],
      // colorsSetting: {
      //   bg: '#FFEBA4',
      //   tops: '#FC909F',
      //   clothes: '#F48150',
      //   glasses: '#000',
      //   earrings: '#F4D150',
      // },
      // activeShape: {
      //   face: 'base',
      //   tops: 'wave',
      //   ear: 'detached',
      //   earrings: 'hoop',
      //   eyebrow: 'eyelashesdown',
      //   eyes: 'eyeshadow',
      //   nose: 'curve',
      //   glasses: 'none',
      //   mouth: 'nervous',
      //   beard: 'none',
      //   clothes: 'collared',
      // },
    }
  },
  actions: {
    updateName(name: string) {
      this.name = name

      // 互相调用
      this.setData(name)
    },
    setData(data: string) {
      console.log('data', data)
    },
    // async changeName(name: string) {
    //   const { data } = await api.login(account, pwd)
    //   return data
    // }
    updateWidget(data: any) {
      console.log(`output->updateWidget`, data)
      this.widgetsData = data
    },
    addWidgetArr(data: AvatarOldOption) {
      console.log(`output->updateWidget`, data)
      this.widgetsDataArr.push(data)
    },
    updateWidgetArr(index: number, type: string, value: string) {
      if (index < 0) return
      // const _cur: AvatarOldOption[] = [...this.widgetsDataArr]
      // _cur[index].widgets[type] = value
      this.widgetsDataArr[index].widgets[type] = value
    },
    updateWidgetArrBg(index: number, type, value: string) {
      if (type && index >= 0) {
        this.widgetsDataArr[index][type] = value
      }
    },
  },
  getters: {
    fullName: (state) => {
      return state.name + '----你好呀！'
    },
  },
})
