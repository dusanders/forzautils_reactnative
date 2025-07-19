import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { Row } from "../../components/Row";
import { ThemeText } from "../../components/ThemeText";
import { IThemeElements } from "../../constants/Themes";
import { ISessionInfo } from "../../services/Database/DatabaseInterfaces";
import { useReplay } from "../../context/Recorder";
import { useLogger } from "../../context/Logger";
import { useNetworkContext } from "../../context/Network";
import { AppRoutes, RootStackParamList } from "../../constants/types";
import { DeleteDialog } from "./DeleteDialog";
import { themeService } from "../../hooks/ThemeState";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export interface ReplayRouteParams  {
  listId: string; // Optional listId for filtering sessions
}
type ReplayScreenProps = NativeStackScreenProps<RootStackParamList, AppRoutes.REPLAY_LIST>;
export function ReplayList(props: ReplayScreenProps) {
  const tag = 'ReplayList';
  const {route, navigation} = props;
  const logger = useLogger();
  const replay = useReplay();
  const network = useNetworkContext();
  const theme = themeService().theme;
  const styles = themeStyles(theme);
  const [sessions, setSessions] = useState<ISessionInfo[]>([]);
  const [toDelete, setToDelete] = useState<ISessionInfo | undefined>(undefined);

  const getSessions = async () => {
    const allSessions = await replay.getAllSessions();
    setSessions(allSessions);
  }

  useEffect(() => {
    getSessions()
  }, []);

  return (
    <AppBarContainer>
      <View style={styles.root}>
        {Boolean(toDelete) && (
          <DeleteDialog
            session={toDelete!}
            onCancel={() => { setToDelete(undefined) }}
            onConfirm={async () => {
              await replay.delete(toDelete!);
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
                  logger.log(tag, `Setting replay: ${info.item.name}`);
                  const session = await replay.getOrCreate(info.item);
                  network.setReplaySession(session);
                  navigation.goBack();
                }}>
                <Row>
                  <ThemeText>
                    {info.item.name}
                  </ThemeText>
                </Row>
                <Row>
                  <ThemeText>
                    Packets: {info.item.length}
                  </ThemeText>
                </Row>
                <Row>
                  <ThemeText>
                    duration: {(((info.item.endTime - info.item.startTime) / 60) / 60).toFixed(1)}
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