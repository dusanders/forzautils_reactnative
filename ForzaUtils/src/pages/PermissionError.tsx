import React from "react";
import { Container } from "../components/Container";
import { View } from "react-native";
import { ThemeText } from "../components/ThemeText";
import { useTheme } from "../context/Theme";
import { Paper } from "../components/Paper";
import { ThemeButton } from "../components/ThemeButton";


export interface PermissionErrorProps {
  onOpenSettings(): void;
  onIgnore(): void;
}

export function PermissionError(props: PermissionErrorProps) {
  const theme = useTheme().theme;
  return (
    <Container fill="parent"
      flex="column"
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Paper style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ThemeText
          fontFamily={'bold'}
          variant="error"
          style={{
            fontSize: theme.sizes.font.large,
            textTransform: 'uppercase',
            marginBottom: 5
          }}>
          Missing permissions
        </ThemeText>
        <View style={{
          width: '85%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ThemeText variant="primary"
            style={{ textAlign: 'center', marginBottom: 8 }}>
            The app uses Location permission to get the WiFi network name.
          </ThemeText>
          <ThemeText variant="secondary"
            fontSize={'small'}
            fontFamily={'bold'}>
            Location is requested because a WiFi network's name is considered to
            be location-specific.
          </ThemeText>
        </View>
        <View style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ThemeButton
            onPress={() => {
              props.onOpenSettings()
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 0,
              minWidth: 0,
            }}>
            <ThemeText
              fontFamily="bold"
              allcaps>
              Open Settings
            </ThemeText>
          </ThemeButton>
          <ThemeButton
            onPress={() => {
              props.onIgnore()
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 0,
              minWidth: 0,
            }}>
            <ThemeText
              variant="warning"
              fontFamily="bold"
              allcaps>
              Ignore
            </ThemeText>
          </ThemeButton>
        </View>
      </Paper>
    </Container>
  )
}