import { useDispatch, useSelector } from "react-redux";
import store from "./store";
import type { TypedUseSelectorHook } from 'react-redux';

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type AppDispatchType = typeof store.dispatch;
export const useAppDispatch: () => AppDispatchType = useDispatch;
