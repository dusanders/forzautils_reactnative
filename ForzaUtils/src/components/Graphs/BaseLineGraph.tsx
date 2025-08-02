import React, { useEffect, useState, useMemo } from "react";
import { Paper } from "../Paper";
import { StyleSheet, View } from "react-native";
import Svg, { Path, Text } from "react-native-svg";
import { ThemeText } from "../ThemeText";
import { invokeWithTheme } from "../../hooks/ThemeState";

export interface IGraphData {
  color: string;
  data: number[];
  label: string;
}

export interface BaseLineGraphProps {
  data: IGraphData[];
  minY: number;
  maxY: number;
  dataLength: number;
  title?: string;
}

export function BaseLineGraph(props: BaseLineGraphProps) {
  const tag = 'BaseLineGraph';
  const fontSize = 12;
  const widthScalar = props.dataLength;
  const [renderedLayout, setRenderedLayout] = useState({ width: 1, height: 1 });
  const [viewBox, setViewBox] = useState({ minX: -1, minY: 1, width: 1, height: 1 });
  const styles = themeStyles();

  const isValidNumber = (value: number) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  // compute SVG paths directly for smoother updates
  const paths = useMemo(() => {
    if (props.data.length === 0 || viewBox.height === 0 || viewBox.width === 0) {
      return [];
    }

    // Use 100% of the viewBox height to provide some vertical padding
    const height = viewBox.height * 1.0;
    const width = viewBox.width;

    // Fix the deltaY calculation (should be maxY - minY)
    const deltaY = props.maxY - props.minY;
    const deltaX = width / widthScalar;

    if (!isValidNumber(deltaY) || !isValidNumber(deltaX) || deltaY === 0) {
      return [];
    }

    // Calculate vertical offset to center the graph
    const verticalOffset = viewBox.height * 0.02; // 2% padding from top

    return props.data.map((graph) =>
      graph.data.map((value, index) => {
        const xMove = (index + 1) * deltaX;

        // Adjust yMove calculation to properly scale and center vertically
        const normalizedValue = (value - props.minY) / deltaY; // 0 to 1
        const yMove = verticalOffset + (height * (1 - normalizedValue)); // Invert and offset

        if (!isValidNumber(yMove) || !isValidNumber(xMove)) {
          return '';
        }
        return index === 0 ? `M${0},${yMove}` : ` L${xMove},${yMove}`;
      }).join(' ')
    );
  }, [props.data, viewBox, props.minY, props.maxY]);

  useEffect(() => {
    // Set up viewBox with proper dimensions
    const minX = 0;
    const minY = 0;
    const width = renderedLayout.width;
    // Don't subtract as much from the height to allow more vertical space
    const height = renderedLayout.height - 4;

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
    <View style={styles.root}>
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
          {(isValidNumber(props.minY) && isValidNumber(props.maxY)) && (
            <>
              <Text
                fontSize={fontSize}
                y={viewBox.height * 0.05 + (fontSize / 1.4)} // Position near the top with padding
                fill={invokeWithTheme(theme => theme.colors.text.primary.onPrimary)}>
                {props.maxY === Number.MIN_SAFE_INTEGER ? 0 : props.maxY.toFixed(2)}
              </Text>
              <Text
                fontSize={fontSize}
                y={viewBox.height * 0.95} // Position near the bottom with padding
                fill={invokeWithTheme(theme => theme.colors.text.primary.onPrimary)}>
                {props.minY === Number.MAX_SAFE_INTEGER ? 0 : props.minY.toFixed(2)}
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

function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
    titleText: {
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
    },
    paper: {
      width: '95%',
      marginBottom: 5,
      padding: 0,
      paddingBottom: 4,
      paddingTop: 4,
      flex: 1, // Add flex to fill available space
      display: 'flex',
      justifyContent: 'center' // Center content vertically
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
  }));
}

export const MemoBaseLineGraph = React.memo(BaseLineGraph);