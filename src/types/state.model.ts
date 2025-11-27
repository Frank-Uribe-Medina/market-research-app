import { User } from "./user.model"

export type State = {
  user: User | null
  isUserLoaded: boolean
  subPlan: 0 | 1 | 2
}
