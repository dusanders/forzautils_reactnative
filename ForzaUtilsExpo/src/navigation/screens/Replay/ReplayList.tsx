import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, RootStackParamList } from "@/navigation/types";
import { AppBarContainer } from "@/components/AppBar/AppBarContainer";
import { Row } from "@/components/Row";
import { ThemeText } from "@/components/ThemeText";
import { useRecorderService } from "@/services/Recorder/RecorderService";
import { DeleteDialog } from "./DeleteDialog";
import { ISession } from "@/services/Recorder/DatabaseInterfaces";
import { Logger } from "@/hooks/Logger";
import { IThemeElements } from "@/theme/Themes";
import { useThemeContext } from "@/theme/ThemeProvider";
import { useOnMount } from "@/hooks/useOnMount";

export interface ReplayRouteParams  {
  listId: string; // Optional listId for filtering sessions
}
type ReplayScreenProps = NativeStackScreenProps<RootStackParamList, AppRoutes.REPLAY_LIST>;
export function ReplayList(props: ReplayScreenProps) {
  const tag = 'ReplayList';
  const {route, navigation} = props;
  const replay = useRecorderService();
  const theme = useThemeContext();
  const styles = themeStyles(theme.theme);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [toDelete, setToDelete] = useState<ISession | undefined>(undefined);

  const getSessions = () => {
    const allSessions = replay.sessions;
    setSessions(allSessions);
  }

  useOnMount(() => {
    getSessions()
  });

  return (
    <AppBarContainer>
      <View style={styles.root}>
        {Boolean(toDelete) && (
          <DeleteDialog
            name={toDelete!.info.name}
            onCancel={() => { setToDelete(undefined) }}
            onConfirm={async () => {
              await toDelete?.delete();
              setToDelete(undefined);
              getSessions();
            }} />
        )}
        <Row style={styles.titleRow}>
          <View style={styles.titleText}>
            <ThemeText style={styles.titleText}>
              Replay
            </ThemeText>
            <ThemeText style={styles.bodyText}>
              Select a previously recorded session.
            </ThemeText>
          </View>
        </Row>
        <Row style={styles.listRow}>
          <FlatList
            style={styles.listRoot}
            contentContainerStyle={styles.listContent}
            data={sessions}
            ListEmptyComponent={(
              <View>
                <ThemeText style={{ textAlign: 'center' }}>
                  No Sessions Found
                </ThemeText>
              </View>
            )}
            ListFooterComponent={(
              <View style={{ height: 150 }} />
            )}
            renderItem={(info) => (
              <TouchableOpacity
                style={styles.listItemRoot}
                onLongPress={() => {
                  setToDelete(info.item);
                }}
                onPress={async () => {
                  Logger.log(tag, `Setting replay: ${info.item.info.name}`);
                  replay.loadReplay(info.item.info.name);
                  navigation.goBack();
                }}>
                <Row>
                  <ThemeText>
                    {info.item.info.name}
                  </ThemeText>
                </Row>
                <Row>
                  <ThemeText>
                    Packets: {info.item.info.length}
                  </ThemeText>
                </Row>
                <Row>
                  <ThemeText>
                    duration: {(((info.item.info.endTime - info.item.info.startTime) / 60) / 60).toFixed(1)}
                  </ThemeText>
                </Row>
              </TouchableOpacity>
            )} />
        </Row>
      </View>
    </AppBarContainer>
  )
}
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    listRow: {
      flexGrow: 1
    },
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    listItemRoot: {
      padding: 24,
      backgroundColor: theme.colors.background.onPrimary,
      margin: 12,
      borderRadius: theme.sizes.borderRadius
    },
    listRoot: {
      width: '80%',
      flexGrow: 1
    },
    listContent: {
      justifyContent: 'center',
      alignContent: 'center'
    },
    titleRow: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      marginBottom: 24
    },
    titleTextView: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center'
    },
    bodyText: {
      fontSize: 16,
      margin: 10,
      color: theme.colors.text.secondary.onPrimary,
      textAlign: 'center',
    }
  });
}