import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Canvas, Path, Skia, Text, useFont } from "@shopify/react-native-skia";
import { ThemeText } from "../ThemeText";
import { Paper } from "../Paper";
import { invokeWithTheme } from "../../hooks/ThemeState";

export interface IGraphData {
  color: string;
  data: number[];
  label: string;
}

export interface SkiaLineGraphProps {
  data: IGraphData[];
  minY: number;
  maxY: number;
  dataLength: number;
  title?: string;
}

export function SkiaLineGraph(props: SkiaLineGraphProps) {
  const tag = 'SkiaLineGraph';
  const fontSize = 28;
  const widthScalar = props.dataLength;
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  const [error, setError] = useState<string | null>(null);
  const pathsRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const styles = themeStyles();

  // Load a font (replace with your project's font asset path if needed, e.g., './assets/fonts/Roboto-Regular.ttf')
  // Using null to fall back to system default font
  const font = useFont(null, fontSize);

  const isValidNumber = (value: number) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  };

  // Function to create paths
  const createPaths = useCallback(() => {
    if (props.data.length === 0 || dimensions.height === 0 || dimensions.width === 0) {
      return [];
    }

    const height = dimensions.height * 1.0;
    const width = dimensions.width;
    const deltaY = props.maxY - props.minY;
    const deltaX = width / widthScalar;

    if (!isValidNumber(deltaY) || !isValidNumber(deltaX) || deltaY === 0) {
      return [];
    }

    const verticalOffset = dimensions.height * 0.02;

    try {
      pathsRef.current = props.data.map((graph) => {
        const path = Skia.Path.Make();
        graph.data.forEach((value, index) => {
          const x = (index + 1) * deltaX;
          const normalizedValue = (value - props.minY) / deltaY;
          const y = verticalOffset + (height * (1 - normalizedValue));

          if (!isValidNumber(y) || !isValidNumber(x)) {
            return;
          }
          if (index === 0) {
            path.moveTo(0, y);
          } else {
            path.lineTo(x, y);
          }
        });
        return path;
      });
    } catch (err) {
      console.error(`[${tag}] Error creating Skia paths:`, err);
      setError('Failed to render graph paths');
      return [];
    }
  }, [props.data, dimensions, props.minY, props.maxY, widthScalar]);

  // Update paths using requestAnimationFrame
  const updatePaths = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!error) {
        createPaths();
      }
    });
  }, [createPaths, error]);

  // Effect to update paths when dependencies change
  useEffect(() => {
    updatePaths();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updatePaths]);


  if (error) {
    return (
      <View style={styles.root}>
        <ThemeText style={styles.titleText}>
          {props.title || 'Graph Error'}
        </ThemeText>
        <Paper style={styles.paper}>
          <ThemeText style={styles.errorText}>
            Error: {error}
          </ThemeText>
        </Paper>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {props.title && (
        <ThemeText style={styles.titleText}>
          {props.title}
        </ThemeText>
      )}
      <Paper style={styles.paper}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          onLayout={(ev) => {
            setDimensions({
              width: ev.nativeEvent.layout.width,
              height: ev.nativeEvent.layout.height
            });
          }}
        >
          {pathsRef.current.map((path, index) => (
            <Path
              key={index}
              path={path}
              style="stroke"
              strokeWidth={1.5}
              color={props.data[index].color}
            />
          ))}
          {(isValidNumber(props.minY) && isValidNumber(props.maxY)) && (
            <>
              <Text
                font={font}
                x={2}
                y={dimensions.height * 0.05 + (fontSize / 1.4)}
                text={props.maxY === Number.MIN_SAFE_INTEGER ? '0' : props.maxY.toFixed(2)}
                color={invokeWithTheme(theme => theme.colors.text.primary.onPrimary)}
              />
              <Text
                font={font}
                x={2}
                y={dimensions.height * 0.95}
                text={props.minY === Number.MAX_SAFE_INTEGER ? '0' : props.minY.toFixed(2)}
                color={invokeWithTheme(theme => theme.colors.text.primary.onPrimary)}
              />
            </>
          )}
        </Canvas>
      </Paper>
      <View style={styles.labelRow}>
        {props.data.map((data, index) => (
          <View style={styles.labelView} key={index}>
            <View style={{
              ...styles.labelIcon,
              backgroundColor: data.color
            }} />
            <ThemeText style={styles.labelText}>
              {data.label}
            </ThemeText>
          </View>
        ))}
      </View>
    </View>
  );
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
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
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
    },
    errorText: {
      color: theme.colors.text.error ? theme.colors.text.error.onPrimary : '#FF0000',
      textAlign: 'center',
      padding: 10
    }
  }));
}

export const MemoSkiaLineGraph = React.memo(SkiaLineGraph);