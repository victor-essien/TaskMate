import {
  createSlice,
  configureStore,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";
interface TaskType {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  taskName: string;
  dueDate: Timestamp | null;
  startDate: Timestamp | null;
  progress: number | 82;
  status?: string;
}
const initialState: TaskType[] = [];
const taskSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    setTasks(state, action: PayloadAction<TaskType[]>) {
      // console.log(state)
      // Directly return the payload as the new state since it's an array
      return action.payload;
    },
  },
});
export const { setTasks } = taskSlice.actions;
export function fetchAndSetTasks(
  task: TaskType[]
): ThunkAction<void, RootState, unknown, ReturnType<typeof setTasks>> {
  return (dispatch) => {
    dispatch(setTasks(task)); // Use the `setTasks` action to update state
  };
}

export const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer,
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false // Disable serialization check (not recommended)
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
