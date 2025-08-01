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
  UserChangedSystemEventViewerComponent,
  UserCreatedSystemEventViewerComponent,
  UserDeletedSystemEventViewerComponent,
  SystemEventViewerComponent,
  NotificationSettingsUpdatedSystemEventViewerComponent
} from './system-events/system-event-viewers';
import { DoubleRangeSliderComponent } from './components/double-range-slider/double-range-slider.component';
import { SystemEventLevelDirective } from './system-events/colorize-by-system-event-level/colorize-by-system-event-level.directive';
import { PasswordValidationComponent } from './components/overlays/password-validation/password-validation.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { CheckmarkOrCircleComponent } from './components/overlays/password-validation/checkmark-or-circle/checkmark-or-circle.component';
import { RelativeTimeRefreshComponent } from './components/relative-time-refresh/relative-time-refresh.component';
import { LabelWithDiffComponent } from './components/label-with-diff/label-with-diff.component';
import { EofThresholdHelpComponent } from './components/context-help/components/eof-threshold-help/eof-threshold-help.component';
import { TestPortHelpComponent } from './components/context-help/components/test-port-help/test-port-help.component';
import { HelpTooltipComponent } from './components/context-help/help-tooltip.component';
import { ContextTooltipDirective } from './components/context-help/context-tooltip.directive';
import { HeaderMessageHelpComponent } from './components/context-help/components/header-message-help/header-message-help.component';
import { BluePointComponent } from './components/context-help/components/blue-point/blue-point.component';
import { NavigateButtonComponent } from './components/svg-buttons/navigate-button.component';
import { SaveButtonComponent } from './components/svg-buttons/save-button.component';
import { CloseButtonComponent } from './components/svg-buttons/close-button.component';
import { SignedNumberPipe } from './pipes/signed-number.pipe';
import { OrderButtonComponent } from './components/svg-buttons/order-button.component';
import { ExpandBranchComponent } from './components/svg-buttons/expand-branch.component';
import { CollapseBranchComponent } from './components/svg-buttons/collapse-branch.component';
import { SquarePictogramComponent } from './components/svg-buttons/square-pictogram.component';
import { IitLogoComponent } from './components/svg-buttons/iit-logo.component';
import { TrianglePictogramComponent } from './components/svg-buttons/triangle-pictogram.component';
import { FiberStateBgDirective } from '../features/op-evnts/optical-events/colorize-bg-by-fiberstate.directive';
import { FiberStatePipe } from './pipes/fiberstate.pipe';
import { EventStatusPipe } from './pipes/event-status.pipe';
import { EventStatusBgDirective } from '../features/op-evnts/optical-events/colorize-bg-by-eventstatus.directive';
import { FrequencyPipe } from './pipes/frequency.pipe';
import { ChannelEventPipe } from './pipes/channel-event.pipe';
import { ChannelEventBgDirective } from '../features/net-evnts/newtork-events/colorize-bg-by-channelevent.directive';
import { IsAvailableBgDirective } from '../features/net-evnts/newtork-events/colorize-bg-by-isavailable.directive';
import { BaseRefTypePipe } from './pipes/base-ref-type.pipe';
import { EventTableIconComponent } from './components/event-table-icon/event-table-icon.component';
import { ExpandMinimizeAvailableActionComponent } from './components/svg-buttons/available-action/expand-minimize-available-action.component';
import { TraceStatePipe } from './pipes/trace-state.pipe';
import { TraceStateBgDirective } from '../features/rtus/trace-statistics/colorize-bg-by-tracestate.directive';
import { RtuPartStatePipe } from './pipes/rtu-part-state.pipe';
import { GraphSorAvailableActionComponent } from './components/svg-buttons/available-action/graph-sor-available-action.component';
import { GraphIconComponent } from './components/svg-buttons/graph-icon.component';
import { SorIconComponent } from './components/svg-buttons/sor-icon.component';
import { GisIconComponent } from './components/svg-buttons/gis-icon.component';
import { EquipmentPipe } from './pipes/equipment.pipe';
import { RadioButtonComponent } from './components/svg-buttons/radio-button/radio-button.component';
import { PencilButtonComponent } from './components/svg-buttons/pencil-button.component';
import { DeleteButtonComponent } from './components/svg-buttons/delete-button.component';
import { MultiSelectionButtonComponent } from './components/svg-buttons/multi-selection-button/multi-selection-button.component';
import { TraceInfoComponent } from '../features/gis/forms/trace-info-dialog/trace-info/trace-info.component';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { LatlngFormatSwitcherComponent } from './components/latlng-format-switcher/latlng-format-switcher.component';
import { GeoCoordinatesPipe } from './pipes/geo-coordinates.pipe';
import { RftsEventsButtonComponent } from './components/svg-buttons/rfts-events-button.component';
import { TabHeaderComponent } from './components/svg-buttons/tab-header/tab-header.component';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import './../app/number-extension';
import { Delete2ButtonComponent } from './components/svg-buttons/delete2-button.component';
import { OpenFileButtonComponent } from './components/svg-buttons/open-file-button.component';
import { DragHeaderComponent } from './components/drag-header/drag-header.component';
import { DraggableWindowComponent } from './components/draggable-window/draggable-window.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GroupBoxComponent } from './components/group-box/group-box.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    OverlayModule,
    DragDropModule
  ],
  declarations: [
    RtuThemeSwitcherComponent,
    RtuThemeSwitcherSimpleComponent,
    RtuLanguageSwitcherComponent,
    LatlngFormatSwitcherComponent,
    RtuRouterLinkComponent,
    DummyComponent,
    SelectComponent,
    SelectLabelDirective,
    SelectItemDirective,
    SystemEventLevelDirective,
    FiberStateBgDirective,
    TraceStateBgDirective,
    EventStatusBgDirective,
    ChannelEventBgDirective,
    IsAvailableBgDirective,
    DialogHeaderComponent,
    RtuDateTimePipe,
    RtuDateToDayOfWeekPipe,
    SignedNumberPipe,
    FiberStatePipe,
    NumberFormatPipe,
    TraceStatePipe,
    FrequencyPipe,
    EventStatusPipe,
    ChannelEventPipe,
    BaseRefTypePipe,
    EquipmentPipe,
    RtuPartStatePipe,
    GeoCoordinatesPipe,
    SimpleErrorComponent,
    DescriptionLabelComponent,
    LoadingSpinnerComponent,
    LoadingCenteredBigSpinnerComponent,
    ValidationErrorComponent,
    UserCardComponent,
    SingeErrorPopupComponent,
    DoubleRangeSliderComponent,
    UserAvatarComponent,
    RelativeTimeRefreshComponent,

    SystemEventViewerComponent,
    DefaultSystemEventViewerComponent,
    UserChangedSystemEventViewerComponent,
    UserCreatedSystemEventViewerComponent,
    UserDeletedSystemEventViewerComponent,

    NotificationSettingsUpdatedSystemEventViewerComponent,
    PasswordValidationComponent,
    CheckmarkOrCircleComponent,
    LabelWithDiffComponent,
    NavigateButtonComponent,
    CollapseBranchComponent,
    ExpandBranchComponent,
    SaveButtonComponent,
    CloseButtonComponent,
    OrderButtonComponent,
    SquarePictogramComponent,
    TrianglePictogramComponent,
    IitLogoComponent,
    PencilButtonComponent,
    DeleteButtonComponent,
    Delete2ButtonComponent,
    OpenFileButtonComponent,
    RftsEventsButtonComponent,

    HelpTooltipComponent,
    EofThresholdHelpComponent,
    TestPortHelpComponent,
    HeaderMessageHelpComponent,
    ContextTooltipDirective,
    BluePointComponent,
    EventTableIconComponent,

    ExpandMinimizeAvailableActionComponent,
    GraphIconComponent,
    SorIconComponent,
    GisIconComponent,
    GraphSorAvailableActionComponent,
    RadioButtonComponent,
    MultiSelectionButtonComponent,
    TraceInfoComponent,
    MessageBoxComponent,
    TabHeaderComponent,
    DragHeaderComponent,
    DraggableWindowComponent,
    GroupBoxComponent
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    OverlayModule,
    RtuThemeSwitcherComponent,
    RtuThemeSwitcherSimpleComponent,
    RtuLanguageSwitcherComponent,
    LatlngFormatSwitcherComponent,
    RtuRouterLinkComponent,
    DummyComponent,
    SelectComponent,
    SelectLabelDirective,
    SelectItemDirective,
    SystemEventLevelDirective,
    FiberStateBgDirective,
    TraceStateBgDirective,
    EventStatusBgDirective,
    ChannelEventBgDirective,
    IsAvailableBgDirective,
    DialogHeaderComponent,
    RtuDateTimePipe,
    RtuDateToDayOfWeekPipe,
    SignedNumberPipe,
    FiberStatePipe,
    NumberFormatPipe,
    TraceStatePipe,
    FrequencyPipe,
    EventStatusPipe,
    ChannelEventPipe,
    BaseRefTypePipe,
    EquipmentPipe,
    RtuPartStatePipe,
    GeoCoordinatesPipe,
    SimpleErrorComponent,
    DescriptionLabelComponent,
    LoadingSpinnerComponent,
    LoadingCenteredBigSpinnerComponent,
    ValidationErrorComponent,
    UserCardComponent,
    SingeErrorPopupComponent,
    DoubleRangeSliderComponent,
    UserAvatarComponent,
    RelativeTimeRefreshComponent,

    SystemEventViewerComponent,
    DefaultSystemEventViewerComponent,
    UserChangedSystemEventViewerComponent,
    UserCreatedSystemEventViewerComponent,
    UserDeletedSystemEventViewerComponent,
    PasswordValidationComponent,
    NotificationSettingsUpdatedSystemEventViewerComponent,
    NavigateButtonComponent,
    CollapseBranchComponent,
    ExpandBranchComponent,
    SaveButtonComponent,
    CloseButtonComponent,
    OrderButtonComponent,
    SquarePictogramComponent,
    TrianglePictogramComponent,
    IitLogoComponent,
    PencilButtonComponent,
    DeleteButtonComponent,
    Delete2ButtonComponent,
    OpenFileButtonComponent,
    RftsEventsButtonComponent,

    HelpTooltipComponent,
    EofThresholdHelpComponent,
    TestPortHelpComponent,
    HeaderMessageHelpComponent,
    ContextTooltipDirective,
    EventTableIconComponent,

    ExpandMinimizeAvailableActionComponent,
    GraphIconComponent,
    SorIconComponent,
    GisIconComponent,
    GraphSorAvailableActionComponent,

    RadioButtonComponent,
    MultiSelectionButtonComponent,
    TraceInfoComponent,
    TabHeaderComponent,
    DragHeaderComponent,
    DraggableWindowComponent,
    GroupBoxComponent
  ],
  providers: [
    RtuDateToDayOfWeekPipe,
    FrequencyPipe,
    RtuDateTimePipe,
    BaseRefTypePipe,
    EquipmentPipe,
    GeoCoordinatesPipe
  ]
})
export class SharedModule {}
