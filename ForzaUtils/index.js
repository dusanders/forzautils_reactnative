/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Main from './Main';
import {name as appName} from './app.json';
global.Buffer = require('buffer').Buffer;

AppRegistry.registerComponent(appName, () => Main);
