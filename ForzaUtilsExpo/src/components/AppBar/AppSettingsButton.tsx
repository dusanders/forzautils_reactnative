import { ReactElement, useCallback } from "react";
import { TouchableOpacity } from "react-native";


export interface AppBarSettingsButtonParams {
  id: string;
  onPress(): void;
  renderItem(): ReactElement;
}

export interface AppSettingsButtonProps {
  onPress(): void;
  children?: any;
  testID?: string;
}

export function AppSettingsButton(props: AppSettingsButtonProps) {
  const handleClick = useCallback(() => {
    props.onPress()
  }, [props.onPress]);
  
  return (
    <TouchableOpacity
      testID={props.testID}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12
      }}
      onPress={handleClick}
    >
      {props.children}
    </TouchableOpacity>
  )
}