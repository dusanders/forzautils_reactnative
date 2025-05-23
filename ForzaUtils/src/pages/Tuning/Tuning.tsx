import React, { useEffect, useState } from "react";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IThemeElements } from "../../constants/Themes";
import { CardInput } from "../../components/CardInput";
import { Row } from "../../components/Row";
import { CardContainer } from "../../components/CardContainer";
import { ThemeSwitch } from "../../components/ThemeSwitch";
import { LabelText } from "../../components/ThemeText";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";
import { Drivetrain } from "ForzaTelemetryApi";
import { TextCard } from "../../components/TextCard";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { EngineLayout } from "../../context/viewModels/TuningViewModel";
import { Dropdown } from "./Dropdown";

export interface TuningPageProps {
  // Nothing
}

export function TuningPage(props: TuningPageProps) {
  const tag = 'TuningPage.tsx';
  const viewModel = useViewModelStore().tuning;
  const navigation = useNavigation();
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const [weightInput, setWeightInput] = useState(viewModel.totalVehicleWeight.toString());
  const [frontDistInput, setFrontDistInput] = useState(viewModel.frontDistribution.toLocaleString());
  const [frontHeightInput, setFrontHeightInput] = useState(viewModel.frontHeight.toLocaleString());
  const [rearHeightInput, setRearHeightInput] = useState(viewModel.rearHeight.toLocaleString());
  const [frontHzInput, setFrontHzInput] = useState(viewModel.frontHz.toLocaleString());
  const [rearHzInput, setRearHzInput] = useState(viewModel.rearHz.toLocaleString());
  const [selectedDrivetrain, setDrivetrain] = useState(viewModel.drivetrain);
  const [selectedLayout, setLayout] = useState(viewModel.engineLayout);

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
    setDrivetrain(viewModel.drivetrain)
  }, [viewModel.drivetrain]);

  useEffect(() => {
    if (frontHzInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(frontHzInput);
    if (parsed > 0) {
      viewModel.setFrontHz(parsed);;
    }
  }, [frontHzInput]);

  useEffect(() => {
    if (rearHzInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(rearHzInput);
    if (parsed > 0) {
      viewModel.setRearHz(parsed);
    }
  }, [rearHzInput])

  useEffect(() => {
    if (frontHeightInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(frontHeightInput);
    if (parsed > 0) {
      viewModel.setFrontHeight(parsed);
    }
  }, [frontHeightInput]);

  useEffect(() => {
    if (rearHeightInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(rearHeightInput);
    if (parsed > 0) {
      viewModel.setRearHeight(parsed);
    }
  }, [rearHeightInput]);

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
    setFrontDistInput(viewModel.frontDistribution.toLocaleString());
  }, [viewModel.frontDistribution]);

  //#endregion

  return (
    <AppBarContainer onBack={() => {
      navigation.goBack();
    }}>
      <ScrollView>
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
          <TextCard
            style={styles.baseCard}
            body={'Rear Distribution'}
            title={viewModel.rearDistribution.toFixed(0)} />
        </Row>
        <Row>
          <CardInput
            style={styles.baseCard}
            label="Front Height"
            placeholder="Front Height"
            value={frontHeightInput}
            onChange={(value) => {
              setFrontHeightInput(value);
            }} />
          <CardInput
            style={styles.baseCard}
            label={'Rear Height'}
            placeholder={'Rear Height'}
            value={rearHeightInput}
            onChange={(value) => {
              setRearHeightInput(value);
            }} />
        </Row>
        {/* <Row>
          <CardInput
            style={styles.baseCard}
            label="Front Hz"
            placeholder="Front Hz"
            value={frontHzInput.toLocaleString()}
            onChange={(value) => {
              setFrontHzInput(value);
            }} />
          <CardInput
            style={styles.baseCard}
            label={'Rear Hz'}
            placeholder={'Rear Hz'}
            value={rearHzInput.toLocaleString()}
            onChange={(value) => {
              setRearHzInput(value);
            }} />
        </Row> */}
        <Row>
          <CardContainer
            style={styles.pickerContainer}>
            <View style={styles.column}>
              <Dropdown
                value={selectedLayout}
                options={[
                  { value: EngineLayout.FRONT, label: labelForLayout(EngineLayout.FRONT) },
                  { value: EngineLayout.MID, label: labelForLayout(EngineLayout.MID) },
                  { value: EngineLayout.REAR, label: labelForLayout(EngineLayout.REAR) }
                ]}
                onValueChanged={(option) => {
                  viewModel.setEngineLayout(option.value)
                }} />
              <LabelText style={{ textAlign: 'center' }}>
                Engine Layout
              </LabelText>
            </View>
          </CardContainer>
          <CardContainer
            style={styles.pickerContainer}>
            <View style={styles.column}>
              <Dropdown
                value={selectedDrivetrain}
                options={[
                  { value: Drivetrain.FWD, label: labelForDrivetrain(Drivetrain.FWD) },
                  { value: Drivetrain.RWD, label: labelForDrivetrain(Drivetrain.RWD) },
                  { value: Drivetrain.AWD, label: labelForDrivetrain(Drivetrain.AWD) }
                ]}
                onValueChanged={(option) => {
                  viewModel.setDrivetrain(option.value)
                }} />
              <LabelText style={{ textAlign: 'center' }}>
                Drivetrain
              </LabelText>
            </View>
          </CardContainer>
        </Row>
        <Row >
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.weights.frontCorner.toFixed(2)}
            body={'LF Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.weights.frontAxle.toFixed(2)}
            body={'Front Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.weights.frontCorner.toFixed(2)}
            body={'RF Weight'} />
        </Row>
        <Row>
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.weights.rearCorner.toFixed(2)}
            body={'LR Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.weights.rearAxle.toFixed(2)}
            body={'Rear Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.weights.rearCorner.toFixed(2)}
            body={'RR Weight'} />
        </Row>
        <Row>
          <TextCard
            style={styles.springCard}
            centerContent
            title={viewModel.frontSettings.springRate.toFixed(2)}
            body="Front Spring" />
          <TextCard
            style={styles.springCard}
            centerContent
            title={viewModel.rearSettings.springRate.toFixed(2)}
            body="Rear Spring" />
        </Row>
        <Row>
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.frontSettings.bound.toFixed(2)}
            body="Front Bump" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.frontSettings.rebound.toFixed(2)}
            body="Front Rebound" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.frontSettings.ARB.toFixed(2)}
            body="Front ARB" />
        </Row>
        <Row>
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.rearSettings.bound.toFixed(2)}
            body="Rear Bump" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.rearSettings.rebound.toFixed(2)}
            body="Rear Rebound" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.rearSettings.ARB.toFixed(2)}
            body="Rear ARB" />
        </Row>
      </ScrollView>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    weightCard: {
      padding: 4,
      width: '33%'
    },
    springCard: {
      padding: 4,
      width: '50%'
    },
    baseRow: {
      flexGrow: 1
    },
    baseCard: {
      width: '50%',
      paddingBottom: 4
    },
    pickerContainer: {
      width: '50%',
      padding: 4,
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    }
  })
}