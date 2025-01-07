import React, { createContext, useContext, useEffect, useReducer } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import { AppRoutes, StateHandler } from "../constants/types";
import { useTheme } from "../hooks/useTheme";
import { ThemeText } from "../components/ThemeText";

export interface INavigationTarget {
  id?: string;
  route: AppRoutes;
}

export interface INavigate {
  navigateTo(route: AppRoutes): void;
  goBack(): void;
}

export interface NavigatorProps {
  initialRoute: AppRoutes;
  children: React.JSX.Element | React.JSX.Element[];
}

export const NavigationContext = createContext({} as INavigate);


interface NavigatorState {
  route: AppRoutes;
  backStack: AppRoutes[];
  isBackPress: boolean;
}
export function NavigationProvider(props: NavigatorProps) {
  const theme = useTheme();
  const children = normalizeChildren(props.children);
  const initialState: NavigatorState = {
    route: props.initialRoute,
    backStack: [],
    isBackPress: false
  }
  const [state, setState] = useReducer<StateHandler<NavigatorState>>((prev, next) => {
    if(next.isBackPress){
      next.isBackPress = false;
      next.backStack = prev.backStack
    } else {
      if(!next.backStack) {
        next.backStack = prev.backStack
      }
      next.backStack!.push(prev.route!);
    }
    if(next.backStack.length < 1) {
      next.backStack.push(next.route!);
    }
    console.log(`NEXT: ${JSON.stringify({...prev, ...next})}`)
    return {
      ...prev,
      ...next
    }
  }, initialState);
  console.log(`load page: ${state.route}`);

  const onHardwareBack = () => {
    console.log(`backstack: ${JSON.stringify(state)}`);
    if(state.backStack.length > 0){
      doGoBack();
      return true;
    }
    return false;
  }

  useEffect(() => {
    let onBackHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return onHardwareBack()
    });
    return () => {
      onBackHandler.remove();
    }
  }, []);


  const showChildren = () => {
    const toShow: JSX.Element[] = [];
    children.forEach((child) => {
      const childProps: INavigationTarget = child.props
      if (childProps.route == state.route) {
        toShow.push(child);
      }
    });
    return toShow;
  }

  const doGoBack = () => {
    const previous = state.backStack.pop() || props.initialRoute;
    console.log(`goback: ${previous}`)
    setState({
      route: previous,
      backStack: state.backStack,
      isBackPress: true
    })
  }
  return (
    <NavigationContext.Provider value={{
      navigateTo: (route) => {
        setState({
          route: route
        });
      },
      goBack: () => doGoBack()
    }}>
      {showChildren()}
    </NavigationContext.Provider>
  )
}

function normalizeChildren(children: React.JSX.Element | React.JSX.Element[]) {
  const combined = [];
  if (Array.isArray(children)) {
    combined.push(...children);
  } else {
    combined.push(children);
  }
  return combined;
}