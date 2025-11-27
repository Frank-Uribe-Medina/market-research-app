import { proxy } from "valtio"

import { State } from "../types/state.model"

const state: State = proxy({
  user: null,
  isUserLoaded: false,
  subPlan: 0,
})

export default state
