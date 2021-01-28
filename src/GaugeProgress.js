import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, ViewPropTypes, AppState, Dimensions } from 'react-native';
import { Surface, Shape, Path, Group, Text } from '@react-native-community/art';

const { height, width } = Dimensions.get('window');

const max = 50;
const ticksGapfromProgressBar = 0.015 * width;
const minimizeRadius = 0.03 * width;

export default class GaugeProgress extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        isVisible: true,
      });
    });
  }

  circlePath(cx, cy, r, startDegree, endDegree) {
    let p = Path();
    p.path.push(0, cx + r - minimizeRadius, cy);
    p.path.push(4, cx, cy, r - minimizeRadius, startDegree * Math.PI / 180, endDegree * Math.PI / 180, 1);
    return p;
  }

  extractFill(fill) {
    if (fill < 0.01) {
      return 0;
    } else if (fill > max) {
      return max;
    }

    return fill;
  }

  ticksPath(cx, cy, r, startDegree, endDegree) {
    let p = Path();
    p.path.push(0, cx + r - minimizeRadius, cy);
    p.path.push(
      4,
      cx,
      cy,
      r - minimizeRadius,
      (startDegree * Math.PI) / 180,
      (endDegree * Math.PI) / 180,
      1
    );
    return p;
  }

  render() {
    const { size, width, tintColor, backgroundColor, style, stroke, strokeCap, rotation, cropDegree, children } = this.props;
    const backgroundPath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, 0, (360 * 99.9 / 100) - cropDegree);

    const fill = this.extractFill(this.props.fill);
    const ticksPath = this.ticksPath(
      size / 2,
      size / 2,
      size / 2 + ticksGapfromProgressBar,
      0,
      (360 * 99.9) / 100 - cropDegree
    );
    const circlePath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, 0, ((360 * 99.9 / 100) - cropDegree) * fill / max);
    if (!this.state.isVisible) {
      return null;
    }
    return (
      <View style={style}>
        <Surface
          width={size}
          height={size} 
          >
          <Group rotation={rotation + cropDegree / 2} originX={size / 2} originY={size / 2}>
            <Shape d={ticksPath} stroke={backgroundColor} strokeWidth={2} />
            <Shape d={backgroundPath}
                   strokeDash={stroke}
                   stroke={backgroundColor}
                   strokeWidth={width}
                   strokeCap={strokeCap}/>
            <Shape d={circlePath}
                   strokeDash={stroke}
                   stroke={tintColor}
                   strokeWidth={width}
                   strokeCap={strokeCap}/>
          </Group>
          <Group x={size / 2 + 5.4 * width} y={size / 2 - 2 * width}>
            <Text
              font={`14px "Roboto-Regular", "Roboto", Arial`}
              fill="#c7c7cc"
              alignment="center"
            >
              40
            </Text>
          </Group>
          <Group x={size / 2 - 5.4 * width} y={size / 2 - 2 * width}>
            <Text
              font={`14px "Roboto-Regular", "Roboto", Arial`}
              fill="#c7c7cc"
              alignment="center"
            >
              10
            </Text>
          </Group>
          <Group x={size / 2 + 2.5 * width} y={size / 2 - 5.4 * width}>
            <Text
              font={`14px "Roboto-Regular", "Roboto", Arial`}
              fill="#c7c7cc"
              alignment="center"
            >
              30
            </Text>
          </Group>
          <Group x={size / 2 - 2.5 * width} y={size / 2 - 5.4 * width}>
            <Text
              font={`14px "Roboto-Regular", "Roboto", Arial`}
              fill="#c7c7cc"
              alignment="center"
            >
              20
            </Text>
          </Group>
          <Group x={size / 2 - 5 * width} y={size / 2 + 75}>
            <Text
              font={`14px "Roboto-Regular", "Roboto", Arial`}
              fill="#c7c7cc"
              alignment="center"
            >
              0
            </Text>
          </Group>
          <Group x={size / 2 + 5 * width} y={size / 2 + 75}>
            <Text
              font={`14px "Roboto-Regular", "Roboto", Arial`}
              fill="#c7c7cc"
              alignment="center"
            >
              Max
            </Text>
          </Group>
        </Surface>
        {typeof children === 'function' ? children(fill) : children}
      </View>
    )
  }
}

GaugeProgress.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  tintColor: PropTypes.string,
  stroke: PropTypes.arrayOf(PropTypes.number),
  strokeCap: PropTypes.string,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  cropDegree: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.array])
};

GaugeProgress.defaultProps = {
  tintColor: 'black',
  backgroundColor: '#e4e4e4',
  rotation: 90,
  cropDegree: 90,
  strokeCap: 'butt',
};
