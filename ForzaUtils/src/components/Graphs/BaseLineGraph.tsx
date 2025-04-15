import React, { useEffect, useState } from "react";
import { Paper } from "../Paper";
import { CardContainer } from "../CardContainer";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { IThemeElements } from "../../constants/Themes";
import { getTheme } from "../../redux/ThemeStore";
import Svg, { Path, Text } from "react-native-svg";
import { ThemeText } from "../ThemeText";

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
  const [renderedLayout, setRenderedLayout] = useState({ width: 0, height: 0 });
  const [viewBox, setViewBox] = useState({ minX: 0, minY: 0, width: 0, height: 0 });
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const [paths, setPaths] = useState<string[]>([]);
  const [yLimits, setYLimits] = useState<YValueLimits>({
    minY: 0,
    maxY: 0
  });

  const reRenderData = () => {
    const height = viewBox.height / 1.5;
    const width = viewBox.width;
    const deltaY = yLimits.maxY - yLimits.minY;
    const deltaX = width / widthScalar;

    console.log(tag, `deltaX: ${deltaX}, deltaY: ${deltaY}`);

    const newPaths = props.data.map((data) => {
      return data.data.map((value, index) => {
        const xMove = (index + 1) * deltaX;
        // const yMove = ((value - yLimits.minY) / deltaY) * height;
        // const yMove = ((yLimits.maxY - value) / deltaY) * height; // Map minY to the top and maxY to the bottom
        const yMove = height - ((value - yLimits.minY) / deltaY) * height; // Map minY to the top and maxY to the bottom
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
    if (yLimits.minY === 0 || yLimits.maxY === 0) {
      return;
    }
    console.log(tag, `re-render on limits miny: ${yLimits.minY}, maxY: ${yLimits.maxY}`);
    reRenderData();
  }, [yLimits, viewBox]);

  useEffect(() => {
    if (!props.data.length || viewBox.height == 0 || viewBox.width === 0) {
      return;
    }
    const minY = (Math.min(...props.data.map((point) => Math.min(...point.data))));
    const maxY = (Math.max(...props.data.map((point) => Math.max(...point.data))));
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
    const minX = -1;
    const minY = -4;
    const width = renderedLayout.width;
    const height = renderedLayout.height - 12;
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
            console.log(ev.nativeEvent.layout);
            setRenderedLayout({
              width: ev.nativeEvent.layout.width,
              height: ev.nativeEvent.layout.height
            })
          }}>
          <Text
            fontSize={fontSize}
            y={0 + (fontSize / 1.4)}
            fill={theme.colors.text.primary.onPrimary}>
            {yLimits.maxY}
          </Text>
          <Text
            fontSize={fontSize}
            y={viewBox.height - (fontSize / 1.4)}
            fill={theme.colors.text.primary.onPrimary}>
            {yLimits.minY}
          </Text>
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