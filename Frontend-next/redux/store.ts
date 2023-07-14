import { configureStore } from '@reduxjs/toolkit'
import boardsSlice from './boardsSlice'

const store = configureStore({
  reducer: {
    boards: boardsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
