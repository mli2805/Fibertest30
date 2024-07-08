import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RtuThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { RtuThemeSwitcherSimpleComponent } from './components/theme-switcher-simple/theme-switcher-simple.component';
import { RtuLanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { RtuRouterLinkComponent } from './components/link/router-link.component';
import { DummyComponent } from './components/dummy/dummy.component';
import {
  SelectComponent,
  SelectLabelDirective,
  SelectItemDirective
} from './components/select/select.component';

import { DialogHeaderComponent } from './components/dialog-header/dialog-header.component';
import { RtuDateTimePipe } from './pipes/datetime.pipe';
import { RtuDateToDayOfWeekPipe } from './pipes/day-of-week-pipe';
import { SimpleErrorComponent } from './components/simple-error/simple-error.component';
import { DescriptionLabelComponent } from './components/description-label/description-label.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { SingeErrorPopupComponent } from './components/single-error-popup/single-error-popup.component';
import { LoadingCenteredBigSpinnerComponent } from './components/loading-spinner/loading-centered-big-spiiner.component';

import {
  DefaultSystemEventViewerComponent,
  OnDemandCompletedSystemEventViewerComponent,
  OnDemandFailedSystemEventViewerComponent,
  BaselineCompletedSystemEventViewerComponent,
  BaselineFailedSystemEventViewerComponent,
  UserChangedSystemEventViewerComponent,
  UserCreatedSystemEventViewerComponent,
  UserDeletedSystemEventViewerComponent,
  SystemEventViewerComponent,
  OtauConnectionStatusChangedSystemEventViewerComponent,
  OtauChangedSystemEventViewerComponent,
  OtauRemovedEventViewerComponent,
  OtauAddedEventViewerComponent,
  OtauInformationChangedSystemEventViewerComponent,
  OtauTitleComponent,
  OtauPortPathTitleComponent,
  MonitoringPortStatusChangedSystemEventViewerComponent,
  MonitoringPortScheduleChangedSystemEventViewerComponent,
  MonitoringPortAlarmProfileChangedEventViewerComponent,
  AlarmProfileChangedEventViewerComponent,
  AlarmProfileCreatedEventViewerComponent,
  AlarmProfileDeletedEventViewerComponent,
  NotificationSettingsUpdatedSystemEventViewerComponent,
  UnsupportedOsmModuleEventViewerComponent
} from './system-events/system-event-viewers';
import { DoubleRangeSliderComponent } from './components/double-range-slider/double-range-slider.component';
import { SystemEventLevelDirective } from './system-events/colorize-by-system-event-level/colorize-by-system-event-level.directive';
import { OnDemandStatusComponent } from './common/task-status/on-demand-status/on-demand-status.component';
import { PasswordValidationComponent } from './components/overlays/password-validation/password-validation.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { CheckmarkOrCircleComponent } from './components/overlays/password-validation/checkmark-or-circle/checkmark-or-circle.component';
import { RelativeTimeRefreshComponent } from './components/relative-time-refresh/relative-time-refresh.component';
import { LabelWithDiffComponent } from './components/label-with-diff/label-with-diff.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { OtauPortIndexComponent } from './system-events/system-event-viewers/otau-viewers/otau-title/otau-port-index.component';
import { MonitoringPortStatusComponent } from './components/monitoring/monitoring-port-status/monitoring-port-status.component';
import { ScheduleModeLineComponent } from './components/schedule-mode-line/schedule-mode-line.component';
import { ScheduleModeIconComponent } from './components/schedule-mode-icon/schedule-mode-icon.component';
import { EofThresholdHelpComponent } from './components/context-help/components/eof-threshold-help/eof-threshold-help.component';
import { TestPortHelpComponent } from './components/context-help/components/test-port-help/test-port-help.component';
import { HelpTooltipComponent } from './components/context-help/help-tooltip.component';
import { ContextTooltipDirective } from './components/context-help/context-tooltip.directive';
import { HeaderMessageHelpComponent } from './components/context-help/components/header-message-help/header-message-help.component';
import { BluePointComponent } from './components/context-help/components/blue-point/blue-point.component';
import { TaskStatusComponent } from './common/task-status/task-status.component';
import { BaselineStatusComponent } from './common/task-status/baseline-status/baseline-status.component';
import { NavigateButtonComponent } from './components/svg-buttons/navigate-button.component';
import { SaveButtonComponent } from './components/svg-buttons/save-button.component';
import { CloseButtonComponent } from './components/svg-buttons/close-button.component';
import { ThresholdParameterPipe } from './pipes/threshold-parameter.pipe';
import { ThresholdUnitPipe } from './pipes/threshold-unit.pipe';
import { AlarmLevelDirective } from './domain-components/alarm-events/colorize-by-alarm-level/colorize-by-alarm-level.directive';
import { AlarmEventViewerComponent } from './domain-components/alarm-events/alarm-event-viewer/alarm-event-viewer.component';
import { OtdrTaskStatusComponent } from './common/task-status/otdr-task-simple-status/otdr-task-simple-status.component';
import { MonitoringChangeStatusComponent } from './components/monitoring-change-status/monitoirng-change-status.component';
import { SignedNumberPipe } from './pipes/signed-number.pipe';
import { QuickAnalysisChartComponent } from './quick-analysis/chart/quick-analysis-chart.component';
import { QuickAnalysisFilterComponent } from './quick-analysis/filter/quick-analysis-filter.component';
import { PortAlarmStatusComponent } from './common/port-alarm-status/port-alarm-status.component';
import { MonitoringChangeDistancesComponent } from './domain-components/monitoring-change-distances/monitoring-change-distances.component';
import { OrderButtonComponent } from './components/svg-buttons/order-button.component';
import { ExpandBranchComponent } from './components/svg-buttons/expand-branch.component';
import { CollapseBranchComponent } from './components/svg-buttons/collapse-branch.component';
import { SquarePictogramComponent } from './components/svg-buttons/square-pictogram.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    OverlayModule
  ],
  declarations: [
    RtuThemeSwitcherComponent,
    RtuThemeSwitcherSimpleComponent,
    RtuLanguageSwitcherComponent,
    RtuRouterLinkComponent,
    DummyComponent,
    SelectComponent,
    SelectLabelDirective,
    SelectItemDirective,
    SystemEventLevelDirective,
    AlarmLevelDirective,
    DialogHeaderComponent,
    RtuDateTimePipe,
    RtuDateToDayOfWeekPipe,
    ThresholdParameterPipe,
    ThresholdUnitPipe,
    SignedNumberPipe,
    SimpleErrorComponent,
    DescriptionLabelComponent,
    LoadingSpinnerComponent,
    LoadingCenteredBigSpinnerComponent,
    ValidationErrorComponent,
    UserCardComponent,
    SingeErrorPopupComponent,
    DoubleRangeSliderComponent,
    TaskStatusComponent,
    OtdrTaskStatusComponent,
    OnDemandStatusComponent,
    BaselineStatusComponent,
    UserAvatarComponent,
    RelativeTimeRefreshComponent,

    SystemEventViewerComponent,
    DefaultSystemEventViewerComponent,
    OnDemandCompletedSystemEventViewerComponent,
    OnDemandFailedSystemEventViewerComponent,
    BaselineCompletedSystemEventViewerComponent,
    BaselineFailedSystemEventViewerComponent,
    UserChangedSystemEventViewerComponent,
    UserCreatedSystemEventViewerComponent,
    UserDeletedSystemEventViewerComponent,
    OtauConnectionStatusChangedSystemEventViewerComponent,
    OtauChangedSystemEventViewerComponent,
    OtauRemovedEventViewerComponent,
    OtauAddedEventViewerComponent,
    OtauInformationChangedSystemEventViewerComponent,
    UnsupportedOsmModuleEventViewerComponent,
    MonitoringPortStatusChangedSystemEventViewerComponent,
    MonitoringPortScheduleChangedSystemEventViewerComponent,
    MonitoringPortAlarmProfileChangedEventViewerComponent,
    AlarmProfileChangedEventViewerComponent,
    AlarmProfileCreatedEventViewerComponent,
    AlarmProfileDeletedEventViewerComponent,
    NotificationSettingsUpdatedSystemEventViewerComponent,
    OtauTitleComponent,
    OtauPortIndexComponent,
    OtauPortPathTitleComponent,
    MonitoringPortStatusComponent,
    PasswordValidationComponent,
    CheckmarkOrCircleComponent,
    LabelWithDiffComponent,
    ConfirmationComponent,
    ScheduleModeLineComponent,
    ScheduleModeIconComponent,
    NavigateButtonComponent,
    CollapseBranchComponent,
    ExpandBranchComponent,
    SaveButtonComponent,
    CloseButtonComponent,
    OrderButtonComponent,
    SquarePictogramComponent,
    QuickAnalysisFilterComponent,
    QuickAnalysisChartComponent,

    HelpTooltipComponent,
    EofThresholdHelpComponent,
    TestPortHelpComponent,
    HeaderMessageHelpComponent,
    ContextTooltipDirective,
    BluePointComponent,
    AlarmEventViewerComponent,
    MonitoringChangeStatusComponent,
    PortAlarmStatusComponent,
    MonitoringChangeDistancesComponent
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    OverlayModule,
    RtuThemeSwitcherComponent,
    RtuThemeSwitcherSimpleComponent,
    RtuLanguageSwitcherComponent,
    RtuRouterLinkComponent,
    DummyComponent,
    SelectComponent,
    SelectLabelDirective,
    SelectItemDirective,
    SystemEventLevelDirective,
    AlarmLevelDirective,
    DialogHeaderComponent,
    RtuDateTimePipe,
    RtuDateToDayOfWeekPipe,
    ThresholdParameterPipe,
    ThresholdUnitPipe,
    SignedNumberPipe,
    SimpleErrorComponent,
    DescriptionLabelComponent,
    LoadingSpinnerComponent,
    LoadingCenteredBigSpinnerComponent,
    ValidationErrorComponent,
    UserCardComponent,
    SingeErrorPopupComponent,
    DoubleRangeSliderComponent,
    TaskStatusComponent,
    OtdrTaskStatusComponent,
    BaselineStatusComponent,
    OnDemandStatusComponent,
    UserAvatarComponent,
    RelativeTimeRefreshComponent,

    SystemEventViewerComponent,
    DefaultSystemEventViewerComponent,
    OnDemandCompletedSystemEventViewerComponent,
    OnDemandFailedSystemEventViewerComponent,
    BaselineCompletedSystemEventViewerComponent,
    BaselineFailedSystemEventViewerComponent,
    UserChangedSystemEventViewerComponent,
    UserCreatedSystemEventViewerComponent,
    UserDeletedSystemEventViewerComponent,
    PasswordValidationComponent,
    OtauInformationChangedSystemEventViewerComponent,
    MonitoringPortStatusChangedSystemEventViewerComponent,
    MonitoringPortScheduleChangedSystemEventViewerComponent,
    MonitoringPortAlarmProfileChangedEventViewerComponent,
    NotificationSettingsUpdatedSystemEventViewerComponent,
    AlarmProfileChangedEventViewerComponent,
    AlarmProfileCreatedEventViewerComponent,
    AlarmProfileDeletedEventViewerComponent,
    OtauTitleComponent,
    OtauPortIndexComponent,
    OtauPortPathTitleComponent,
    MonitoringPortStatusComponent,
    ScheduleModeLineComponent,
    ScheduleModeIconComponent,
    NavigateButtonComponent,
    CollapseBranchComponent,
    ExpandBranchComponent,
    SaveButtonComponent,
    CloseButtonComponent,
    OrderButtonComponent,
    SquarePictogramComponent,
    QuickAnalysisFilterComponent,
    QuickAnalysisChartComponent,

    HelpTooltipComponent,
    EofThresholdHelpComponent,
    TestPortHelpComponent,
    HeaderMessageHelpComponent,
    ContextTooltipDirective,
    AlarmEventViewerComponent,
    MonitoringChangeStatusComponent,
    PortAlarmStatusComponent,
    MonitoringChangeDistancesComponent
  ],
  providers: [RtuDateToDayOfWeekPipe]
})
export class SharedModule {}
