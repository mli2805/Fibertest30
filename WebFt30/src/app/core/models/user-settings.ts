import { AppTheme } from '../store/settings/settings.state';

export class UserSettings {
  language!: string;
  theme!: AppTheme;
  dateTimeFormat!: string;
  latLngFormat!: string;
  zoom!: number;
  lat!: number;
  lng!: number;
  showNodesFromZoom!: number;
  sourceMapId!: number;
  switchOffSuspicionSignalling!: boolean;
  switchOffRtuStatusEventsSignalling!: boolean;
}
