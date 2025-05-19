import React, { useEffect, useState } from "react";
import { Paper } from "../Paper";
import { StyleSheet, View } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import Svg, { Path, Text } from "react-native-svg";
import { ThemeText } from "../ThemeText";
import { useCurrentTheme } from "../../hooks/ThemeState";

export interface IGraphData {
  color: string;
  data: number[];
  label: string;
}

export interface BaseLineGraphProps {
  data: IGraphData[];
  dataLength: number;
  title?: string;
}

interface YValueLimits {
  minY: number;
  maxY: number;
}

export function BaseLineGraph(props: BaseLineGraphProps) {
  const tag = 'BaseLineGraph';
  const fontSize = 12;
  const widthScalar = props.dataLength;
  const [renderedLayout, setRenderedLayout] = useState({ width: 1, height: 1 });
  const [viewBox, setViewBox] = useState({ minX: -1, minY: 1, width: 1, height: 1 });
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);
  const [paths, setPaths] = useState<string[]>([]);
  const [yLimits, setYLimits] = useState<YValueLimits>({
    minY: Number.MAX_SAFE_INTEGER,
    maxY: Number.MIN_SAFE_INTEGER
  });

  const isValidNumber = (value: number) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  const reRenderData = () => {
    if (widthScalar === 0) {
      console.warn(tag, 'widthScalar is 0, cannot render graph');
      return;
    }
    const height = viewBox.height / 1.5;
    const width = viewBox.width;
    const deltaY = yLimits.maxY - yLimits.minY;
    const deltaX = width / widthScalar;
    if (!isValidNumber(deltaY) || !isValidNumber(deltaX)) {
      console.warn(tag, 'Invalid deltaY or deltaX', { deltaY, deltaX });
      return;
    }
    const newPaths = props.data.map((data) => {
      return data.data.map((value, index) => {
        const xMove = (index + 1) * deltaX;
        const yMove = height - ((value - yLimits.minY) / deltaY) * height; // Map minY to the top and maxY to the bottom
        if (!isValidNumber(yMove) || !isValidNumber(xMove)) {
          return '';
        }

        if (index === 0) {
          return `M${24},${yMove}`;
        }
        return ` L${xMove},${yMove}`;
      }).join(' ');
    });
    setPaths(newPaths);
  }

  useEffect(() => {
    if (!props.data.length || viewBox.height == 0 || viewBox.width === 0) {
      return;
    }
    reRenderData();
  }, [yLimits, viewBox]);

  useEffect(() => {
    if (!props.data.length || viewBox.height == 0 || viewBox.width === 0) {
      return;
    }
    const minY = Math.min(
      ...props.data.map((graph) => Math.min(...graph.data)),
      yLimits.minY);
    const maxY = Math.max(
      ...props.data.map((graph) => Math.max(...graph.data)),
      yLimits.maxY);
    if (!isValidNumber(minY) || !isValidNumber(maxY)) {
      return;
    }
    if (minY !== yLimits.minY || maxY !== yLimits.maxY) {
      setYLimits({
        minY,
        maxY
      });
    } else {
      reRenderData();
    }
  }, [props.data, viewBox]);


  useEffect(() => {
    const minX = -4;
    const minY = -4;
    const width = renderedLayout.width;
    const height = renderedLayout.height - 12;
    if (!isValidNumber(width) || !isValidNumber(height)) {
      return;
    }
    setViewBox({
      minX,
      minY,
      width,
      height
    });
  }, [renderedLayout]);

  return (
    <View
      style={styles.root}>
      {props.title && (
        <ThemeText style={styles.titleText}>
          {props.title}
        </ThemeText>
      )}
      <Paper style={styles.paper}>
        <Svg
          viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
          onLayout={(ev) => {
            setRenderedLayout({
              width: ev.nativeEvent.layout.width,
              height: ev.nativeEvent.layout.height
            })
          }}>
          {(isValidNumber(yLimits.minY) && isValidNumber(yLimits.maxY)) && (
            <>
              <Text
                fontSize={fontSize}
                y={0 + (fontSize / 1.4)}
                fill={theme.colors.text.primary.onPrimary}>
                {yLimits.maxY.toFixed(2)}
              </Text>
              <Text
                fontSize={fontSize}
                y={viewBox.height - (fontSize / 1.4)}
                fill={theme.colors.text.primary.onPrimary}>
                {yLimits.minY.toFixed(2)}
              </Text>
            </>
          )}
          {paths.map((path, index) =>
            <Path
              key={index}
              d={path}
              stroke={props.data[index].color}
              strokeWidth={1.5}
              fill={'transparent'} />
          )}
        </Svg>
      </Paper>
      <View style={styles.labelRow}>
        {props.data.map((data, index) =>
          <View style={styles.labelView} key={index}>
            <View style={{
              ...styles.labelIcon,
              backgroundColor: data.color
            }} />
            <ThemeText style={styles.labelText}>
              {data.label}
            </ThemeText>
          </View>
        )}
      </View>
    </View>
  )
}
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    titleText: {
      paddingTop: 5,
      paddingBottom: 5,
      color: theme.colors.text.primary.onPrimary
    },
    root: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 12,
      paddingBottom: 12
    },
    paper: {
      width: '95%',
      marginBottom: 5,
      padding: 0,
      paddingBottom: 4,
      paddingTop: 4
    },
    labelView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10
    },
    labelRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingBottom: 5
    },
    labelIcon: {
      width: 12,
      height: 12,
      borderRadius: 12,
      marginRight: 5
    },
    labelText: {
      color: theme.colors.text.primary.onPrimary
    }
  })
}