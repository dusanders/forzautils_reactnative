import React, { useEffect, useState } from "react";
import { Paper } from "../Paper";
import { CardContainer } from "../CardContainer";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { IThemeElements } from "../../constants/Themes";
import { getTheme } from "../../redux/ThemeStore";
import Svg, { Path } from "react-native-svg";
import { ThemeText } from "../ThemeText";

export interface IGraphData {
  color: string;
  data: number[];
  label: string;
}

export interface BaseLineGraphProps {
  data: IGraphData[];
  dataLength: number;
}

export function BaseLineGraph(props: BaseLineGraphProps) {
  const tag = 'BaseLineGraph';
  const widthScalar = props.dataLength;
  const [renderedLayout, setRenderedLayout] = useState({ width: 0, height: 0 });
  const [viewBox, setViewBox] = useState({ minX: 0, minY: 0, width: 0, height: 0 });
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!props.data.length) return;
    const minY = Math.min(...props.data.map((point) => Math.min(...point.data)));
    const maxY = Math.max(...props.data.map((point) => Math.max(...point.data)));
    const newPaths = props.data.map((data) => {
      return `M${0},${0} ${data.data.map((value, index) => {
        const xMove = (index + 1) * (renderedLayout.width / widthScalar);
        const yMove = renderedLayout.height - ((value - minY) / (maxY - minY)) * renderedLayout.height; // Scale and flip Y-axis
        return ` L${xMove},${yMove}`; // Flip Y-axis
      })}`;
    });
    setPaths(newPaths);
  }, [props.data, renderedLayout]);


  useEffect(() => {
    const minX = 0;
    const minY = -(renderedLayout.height / 2);
    const width = renderedLayout.width;
    const height = renderedLayout.height;
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
            <ThemeText>
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
      justifyContent: 'space-evenly'
    },
    labelIcon: {
      width: 12,
      height: 12,
      borderRadius: 12,
      marginRight: 5
    }
  })
}