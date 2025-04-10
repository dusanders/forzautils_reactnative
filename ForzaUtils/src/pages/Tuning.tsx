import React, { useEffect, useState } from "react";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles, IThemeElements } from "../constants/Themes";
import { CardInput } from "../components/CardInput";
import { Row } from "../components/Row";
import { CardContainer } from "../components/CardContainer";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { LabelText, ThemeText } from "../components/ThemeText";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";
import { EngineLayout, useTuningViewModel } from "../context/viewModels/TuningViewModel";
import { Picker } from "@react-native-picker/picker";
import { Drivetrain } from "ForzaTelemetryApi";
import { TextCard } from "../components/TextCard";

export interface TuningPageProps {
  // No props needed for this page
}

export function TuningPage(props: TuningPageProps) {
  const tag = 'TuningPage.tsx';
  const drivetrainOptions: Drivetrain[] = [
    Drivetrain.FWD,
    Drivetrain.RWD,
    Drivetrain.AWD
  ]
  const layoutOptions: EngineLayout[] = [
    EngineLayout.FRONT,
    EngineLayout.MID,
    EngineLayout.REAR
  ]
  const navigation = useNavigation();
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const viewModel = useTuningViewModel();
  const [weightInput, setWeightInput] = useState(viewModel.totalVehicleWeight.toString());
  const [frontDistInput, setFrontDistInput] = useState('');
  const [rearDistInput, setRearDistInput] = useState('');
  const [drivetrainPicker, setDrivetrainPicker] = useState(drivetrainOptions[0]);
  const [layoutPicker, setLayoutPicker] = useState(layoutOptions[0]);

  const labelForDrivetrain = (type: Drivetrain) => {
    switch (type) {
      case Drivetrain.AWD: return 'AWD';
      case Drivetrain.FWD: return 'FWD';
      case Drivetrain.RWD: return 'RWD';
    }
  }

  const labelForLayout = (type: EngineLayout) => {
    switch (type) {
      case EngineLayout.FRONT: return 'Front';
      case EngineLayout.MID: return 'Mid';
      case EngineLayout.REAR: return 'Rear';
    }
  }

  const parseFloat = (value: string) => {
    let result = 0.0
    try {
      result = Number.parseFloat(value);
      if (Number.isNaN(result)) {
        result = 0.0
      }
    } catch (e) {
      console.warn(tag, `Failed to parse input: ${value}`);
    }
    return result;
  }

  //#region Effects

  useEffect(() => {
    if (weightInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(weightInput);
    if (parsed > 0) {
      viewModel.setTotalVehicleWeight(parsed);
    }
  }, [weightInput]);

  useEffect(() => {
    if (frontDistInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(frontDistInput);
    if (parsed > 0 && parsed !== viewModel.frontDistribution) {
      viewModel.setFrontDistribution(parsed);
    }
  }, [frontDistInput]);

  useEffect(() => {
    if (rearDistInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(rearDistInput);
    if (parsed > 0 && parsed !== viewModel.rearDistribution) {
      viewModel.setRearDistribution(parsed);
    }
  }, [rearDistInput]);

  useEffect(() => {
    setFrontDistInput(viewModel.frontDistribution.toLocaleString());
  }, [viewModel.frontDistribution]);

  useEffect(() => {
    setRearDistInput(viewModel.rearDistribution.toLocaleString());
  }, [viewModel.rearDistribution]);

  //#endregion

  return (
    <AppBarContainer onBack={() => {
      navigation.goBack();
    }}>
      <Row>
        <CardInput
          style={styles.baseCard}
          label="Vehicle Weight"
          value={weightInput} // This will be bound to state in a real application
          onChange={(value: string) => {
            setWeightInput(value);
          }}
          placeholder="Vehicle Weight" />
        <CardContainer
          style={styles.baseCard}
          centerContent>
          <ThemeSwitch
            value={viewModel.hasRollCage}
            onValueChange={(ev) => viewModel.setHasRollCage(ev)} />
          <LabelText>
            Roll Cage
          </LabelText>
        </CardContainer>
      </Row>
      <Row>
        <CardInput
          style={styles.baseCard}
          label="Front Distribution"
          placeholder="Front Distribution"
          value={frontDistInput}
          onChange={(value) => {
            setFrontDistInput(value);
          }} />
        <CardInput
          style={styles.baseCard}
          label={'Rear Distribution'}
          placeholder={'Rear Distribution'}
          value={rearDistInput}
          onChange={(value) => {
            setRearDistInput(value);
          }} />
      </Row>
      <Row>
        <CardContainer
          style={styles.pickerContainer}>
          <View style={styles.column}>
            <Picker
              dropdownIconColor={theme.colors.text.primary.onPrimary}
              selectedValue={drivetrainPicker}
              onValueChange={(value, index) => {
                setDrivetrainPicker(value);
              }}>
              {drivetrainOptions.map((i) => (
                <Picker.Item key={i}
                  value={i}
                  label={labelForDrivetrain(i)}
                  style={styles.pickerItemStyle} />
              ))}
            </Picker>
            <LabelText style={{ textAlign: 'center' }}>
              Drivetrain
            </LabelText>
          </View>
        </CardContainer>
        <CardContainer
          style={styles.pickerContainer}>
          <View style={styles.column}>
            <Picker
              dropdownIconColor={theme.colors.text.primary.onPrimary}
              selectedValue={layoutPicker}
              onValueChange={(value, index) => {
                setLayoutPicker(value);
              }}>
              {layoutOptions.map((i) => (
                <Picker.Item
                  key={i}
                  value={i}
                  label={labelForLayout(i)}
                  style={styles.pickerItemStyle} />
              ))}
            </Picker>
            <LabelText style={{ textAlign: 'center' }}>
              Engine Layout
            </LabelText>
          </View>
        </CardContainer>
      </Row>
      <Row>
        <TextCard
          style={styles.weightCard}
          centerContent
          title={viewModel.frontCornerWeight.toFixed(2)}
          body={'LF Weight'} />
        <TextCard
          style={styles.weightCard}
          centerContent
          title={viewModel.frontWeight.toFixed(2)}
          body={'Front Weight'} />
        <TextCard
          style={styles.weightCard}
          centerContent
          title={viewModel.frontCornerWeight.toFixed(2)}
          body={'RF Weight'} />
      </Row>
      <Row>
        <TextCard
          style={styles.weightCard}
          centerContent
          title={viewModel.rearCornerWeight.toFixed(2)}
          body={'LR Weight'} />
        <TextCard
          style={styles.weightCard}
          centerContent
          title={viewModel.rearWeight.toFixed(2)}
          body={'Rear Weight'} />
        <TextCard
          style={styles.weightCard}
          centerContent
          title={viewModel.rearCornerWeight.toFixed(2)}
          body={'RR Weight'} />
      </Row>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    pickerItemStyle: {
      color: theme.colors.text.primary.onPrimary
    },
    weightCard: {
      padding: 4
    },
    baseRow: {
      flexGrow: 1
    },
    baseCard: {
      width: '50%',
    },
    pickerContainer: {
      width: '50%',
      padding: 4
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    }
  })
}