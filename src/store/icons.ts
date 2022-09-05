import { defineStore } from 'pinia'

export const widgetStore = defineStore({
  id: 'icons', // id 必填，且需要唯一
  state: () => {
    return {
      name: 'hui',
      widgetsData: {},
      widgetsDataArr: [],
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
  },
  getters: {
    fullName: (state) => {
      return state.name + '----你好呀！'
    },
  },
})
