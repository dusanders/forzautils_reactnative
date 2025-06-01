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
import { Drivetrain } from "ForzaTelemetryApi";
import { TextCard } from "../../components/TextCard";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { Dropdown } from "./Dropdown";
import { useCurrentTheme } from "../../hooks/ThemeState";
import { EngineLayout } from "../../context/viewModels/Tuning/Calculators";

export interface TuningPageProps {
  // Nothing
}

export function TuningPage(props: TuningPageProps) {
  const tag = 'TuningPage.tsx';
  const viewModel = useViewModelStore().tuning;
  const navigation = useNavigation();
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);
  const [weightInput, setWeightInput] = useState(viewModel.input.totalWeight.toString());
  const [frontDistInput, setFrontDistInput] = useState(viewModel.input.frontWeightDistribution.toLocaleString());
  const [frontHeightInput, setFrontHeightInput] = useState(viewModel.input.rideHeight.front.toLocaleString());
  const [rearHeightInput, setRearHeightInput] = useState(viewModel.input.rideHeight.rear.toLocaleString());
  const [frontHzInput, setFrontHzInput] = useState(viewModel.input.suspensionHz.front.toLocaleString());
  const [rearHzInput, setRearHzInput] = useState(viewModel.input.suspensionHz.rear.toLocaleString());
  const [selectedDrivetrain, setDrivetrain] = useState(viewModel.input.drivetrain);
  const [selectedLayout, setLayout] = useState(viewModel.input.engineLayout);

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
    setDrivetrain(viewModel.input.drivetrain)
  }, [viewModel.input.drivetrain]);

  useEffect(() => {
    if (frontHzInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(frontHzInput);
    if (parsed > 0) {
      viewModel.setInput({
        ...viewModel.input,
        suspensionHz: {
          ...viewModel.input.suspensionHz,
          front: parsed
        }
      });
    }
  }, [frontHzInput]);

  useEffect(() => {
    if (rearHzInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(rearHzInput);
    if (parsed > 0) {
      viewModel.setInput({
        ...viewModel.input,
        suspensionHz: {
          ...viewModel.input.suspensionHz,
          rear: parsed
        }
      });
    }
  }, [rearHzInput])

  useEffect(() => {
    if (frontHeightInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(frontHeightInput);
    if (parsed > 0) {
      viewModel.setInput({
        ...viewModel.input,
        rideHeight: {
          ...viewModel.input.rideHeight,
          front: parsed
        }
      });
    }
  }, [frontHeightInput]);

  useEffect(() => {
    if (rearHeightInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(rearHeightInput);
    if (parsed > 0) {
      viewModel.setInput({
        ...viewModel.input,
        rideHeight: {
          ...viewModel.input.rideHeight,
          rear: parsed
        }
      });
    }
  }, [rearHeightInput]);

  useEffect(() => {
    if (weightInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(weightInput);
    if (parsed > 0) {
      viewModel.setInput({
        ...viewModel.input,
        totalWeight: parsed
      });
    }
  }, [weightInput]);

  useEffect(() => {
    if (frontDistInput.endsWith('.')) {
      return;
    }
    let parsed = parseFloat(frontDistInput);
    if (parsed > 0 && parsed !== viewModel.input.frontWeightDistribution) {
      viewModel.setInput({
        ...viewModel.input,
        frontWeightDistribution: parsed
      });
    }
  }, [frontDistInput]);

  useEffect(() => {
    setFrontDistInput(viewModel.input.frontWeightDistribution.toLocaleString());
  }, [viewModel.input.frontWeightDistribution]);

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
              value={viewModel.input.hasRollCage}
              onValueChange={(ev) => {
                viewModel.setInput({
                  ...viewModel.input,
                  hasRollCage: ev
                });
              }} />
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
            title={Number(100 - viewModel.input.frontWeightDistribution).toFixed(0)} />
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
                  viewModel.setInput({
                    ...viewModel.input,
                    engineLayout: option.value
                  })
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
                  viewModel.setInput({
                    ...viewModel.input,
                    drivetrain: option.value
                  });
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
            title={viewModel.settings.cornerWeights.front.toFixed(2)}
            body={'LF Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.axleWeights.front.toFixed(2)}
            body={'Front Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.cornerWeights.front.toFixed(2)}
            body={'RF Weight'} />
        </Row>
        <Row>
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.cornerWeights.rear.toFixed(2)}
            body={'LR Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.axleWeights.rear.toFixed(2)}
            body={'Rear Weight'} />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.cornerWeights.rear.toFixed(2)}
            body={'RR Weight'} />
        </Row>
        <Row>
          <TextCard
            style={styles.springCard}
            centerContent
            title={viewModel.settings.springRates.front.toFixed(2)}
            body="Front Spring" />
          <TextCard
            style={styles.springCard}
            centerContent
            title={viewModel.settings.springRates.rear.toFixed(2)}
            body="Rear Spring" />
        </Row>
        <Row>
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.damperBound.front.toFixed(2)}
            body="Front Bump" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.damperRebound.front.toFixed(2)}
            body="Front Rebound" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.antiRollBar.front.toFixed(2)}
            body="Front ARB" />
        </Row>
        <Row>
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.damperBound.rear.toFixed(2)}
            body="Rear Bump" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.damperRebound.rear.toFixed(2)}
            body="Rear Rebound" />
          <TextCard
            style={styles.weightCard}
            centerContent
            title={viewModel.settings.antiRollBar.rear.toFixed(2)}
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