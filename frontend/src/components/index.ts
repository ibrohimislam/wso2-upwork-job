import { setRootPath, setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import './shell/shell.component';

declare var window: any;

setRootPath(window.Polymer.rootPath);
setPassiveTouchGestures(true);