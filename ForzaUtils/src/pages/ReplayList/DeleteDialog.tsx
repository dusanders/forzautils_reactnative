import React from "react";
import { ISessionInfo } from "../../services/Database/DatabaseInterfaces";
import { StyleSheet, View } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { ThemeText } from "../../components/ThemeText";
import { TextCard } from "../../components/TextCard";
import { themeService } from "../../hooks/ThemeState";

export interface DeleteDialogProps {
  session: ISessionInfo;
  onConfirm(): void;
  onCancel(): void;
}

export function DeleteDialog(props: DeleteDialogProps) {
  const theme = themeService().theme;
  const styles = themeStyles(theme);
  return (
    <View style={styles.root}>
      <View
        style={styles.dialogView}>
        <ThemeText
          fontFamily={'bold'}
          fontSize={'large'}
          style={styles.centerText}>
          Delete Session
        </ThemeText>
        <ThemeText style={styles.centerText}>
          Do you want to delete session {props.session.name}?
        </ThemeText>
      </View>
      <View style={styles.spacer} />
      <View style={styles.buttonView}>
        <TextCard
          allcapsLabel
          allcapsTitle
          centerContent
          title={'Delete'}
          onPress={() => {
            props.onConfirm();
          }} />
        <TextCard
          allcapsLabel
          allcapsTitle
          centerContent
          title={'Cancel'}
          onPress={() => {
            props.onCancel();
          }} />
      </View>
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    spacer: {
      height: '5%'
    },
    buttonView: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    centerText: {
      textAlign: 'center',
      marginBottom: 24
    },
    root: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.background.primary,
      zIndex: 99,
      elevation: 99,
    },
    dialogView: {
      paddingTop: '35%',
      width: '80%',
      height: '30%',
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center'
    }
  })
}