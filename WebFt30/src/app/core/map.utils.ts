import * as grpc from 'src/grpc-generated';
import { UserSettings } from './models/user-settings';
import { DeviceInfo } from './store/device/device.state';
import {
  DistanceRange,
  SystemNotification,
  LaserUnit,
  OtdrMeasurementParameters,
  User,
  Role,
  SystemEvent,
  SystemEventLevel,
  SystemEventSource,
  CompletedOnDemand,
  MeasurementSettings,
  Otau,
  OtauPort,
  OxcOtauParameters,
  MonitoringPort,
  MonitoringTimeSlot,
  TimeOnlyHourMinute,
  MonitoringResult,
  MonitoringBaseline,
  MonitoringAlarmEvent,
  AlarmNotification,
  MonitoringAlarmType,
  MonitoringAlarmLevel,
  MonitoringAlarmStatus,
  MonitoringAlarm,
  DataPoint,
  AppTimezone,
  PortLabel
} from './store/models';

import { PbLong } from '@protobuf-ts/runtime';

import { TimezoneUtils } from 'src/app/core/timezone.utils';

import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';
import { ApplicationUserPatch } from '../features/rfts-setup/components/platform-management/user-accounts/components/user-edit-dialog/application-user-patch';
import { OtauPatch } from '../features/rfts-setup/rfts-setup/otau-card/otau-patch';
import { OtauDiscover, OtauDiscoverError, OtauDiscoverResult } from './store/models/otau-discover';
import { OtdrTaskProgressData } from '../shared/system-events/system-event-data';
import { MonitoringSchedule } from './store/models/monitoring-schedule';
import { Duration } from 'src/grpc-generated/google/protobuf/duration';
import { OtdrTaskProgress } from './store/models/task-progress';
import { AlarmProfile } from './store/models/alarm-profile';
import { Threshold, ThresholdParameter } from './store/models/threshold';
import {
  EmailServer,
  NotificationSettings,
  TrapReceiver
} from './store/models/notification-settings';
import { MapJsonUtils } from './map-json.utils';
import { NetworkSettings } from './store/models/network-settings';
import { NtpSettings } from './store/models/ntp-settings';
import { TimeSettings } from './store/models/time-settings';
import { TimeZone } from './store/models/time-zone';
import { TreeMapping } from './store/mapping/tree-mapping';

export class MapUtils {
  static toGrpcNotificationSettings(settings: NotificationSettings): grpc.NotificationSettings {
    return {
      id: settings.id,
      emailServer:
        settings.emailServer !== undefined
          ? this.toGrpcEmailServer(settings.emailServer)
          : undefined,
      trapReceiver:
        settings.trapReceiver !== undefined
          ? this.toGrpcTrapReceiver(settings.trapReceiver)
          : undefined
    };
  }

  static toGrpcEmailServer(server: EmailServer): grpc.EmailServer {
    return {
      enabled: server.enabled,
      serverAddress: server.smtpServerAddress,
      serverPort: server.smtpServerPort,
      outgoingAddress: server.outgoingAddress,
      isAuthenticationOn: server.isAuthenticationOn,
      serverUserName: server.serverUserName,
      isPasswordSet: server.isPasswordSet,
      serverPassword: server.serverPassword,
      verifyCertificate: server.verifyCertificate,
      floodingPolicy: server.floodingPolicy,
      smsOverSmtp: server.smsOverSmtp
    };
  }

  static toGrpcTrapReceiver(receiver: TrapReceiver): grpc.TrapReceiver {
    return {
      enabled: receiver.enabled,
      snmpVersion: receiver.snmpVersion,
      useVeexOid: receiver.useVeexOid,
      customOid: receiver.customOid,
      community: receiver.community,
      authoritativeEngineId: receiver.authoritativeEngineId,
      userName: receiver.userName,
      isAuthPwdSet: receiver.isAuthPswSet,
      authenticationPassword: receiver.authenticationPassword,
      authenticationProtocol: receiver.authenticationProtocol,
      isPrivPwdSet: receiver.isPrivPswSet,
      privacyPassword: receiver.privacyPassword,
      privacyProtocol: receiver.privacyProtocol,
      trapReceiverAddress: receiver.trapReceiverAddress,
      trapReceiverPort: receiver.trapReceiverPort
    };
  }

  static toGrpcAlarmProfile(profile: AlarmProfile): grpc.AlarmProfile {
    return {
      id: profile.id,
      name: profile.name,
      thresholds: profile.thresholds.map((x) => this.toGrpcThreshold(x))
    };
  }

  static toGrpcThreshold(threshold: Threshold): grpc.Threshold {
    const result = {
      id: threshold.id,
      parameter: this.toGrpcThresholdParameter(threshold.parameter),
      isMinorOn: threshold.isMinorOn,
      isMajorOn: threshold.isMajorOn,
      isCriticalOn: threshold.isCriticalOn,
      minor: threshold.minor !== null ? threshold.minor : undefined,
      major: threshold.major !== null ? threshold.major : undefined,
      critical: threshold.critical !== null ? threshold.critical : undefined
    };

    return result;
  }

  static toGrpcThresholdParameter(param: ThresholdParameter): grpc.ThresholdParameter {
    switch (param) {
      case ThresholdParameter.EventLoss:
        return grpc.ThresholdParameter.EventLoss;
      case ThresholdParameter.TotalLoss:
        return grpc.ThresholdParameter.TotalLoss;
      case ThresholdParameter.EventReflectance:
        return grpc.ThresholdParameter.EventReflectance;
      case ThresholdParameter.SectionAttenuation:
        return grpc.ThresholdParameter.SectionAttenuation;
      case ThresholdParameter.SectionLoss:
        return grpc.ThresholdParameter.SectionLoss;
      case ThresholdParameter.SectionLengthChange:
        return grpc.ThresholdParameter.SectionLengthChange;
      case ThresholdParameter.PortHealth:
        return grpc.ThresholdParameter.PortHealth;
      default:
        throw new Error(`Unknown ThresholdParameter: ${param}`);
    }
  }

  static toNtpSettings(grpcNtpSettings: grpc.NtpSettings): NtpSettings {
    const ntpSettings = new NtpSettings();
    ntpSettings.primaryNtpServer = grpcNtpSettings.primaryNtpServer
      ? grpcNtpSettings.primaryNtpServer
      : null;
    ntpSettings.secondaryNtpServer = grpcNtpSettings.secondaryNtpServer
      ? grpcNtpSettings.secondaryNtpServer
      : null;
    return ntpSettings;
  }

  static toGrpcNtpSettings(ntpSettings: NtpSettings): grpc.NtpSettings {
    const result = {
      primaryNtpServer:
        ntpSettings.primaryNtpServer !== null ? ntpSettings.primaryNtpServer : undefined,
      secondaryNtpServer:
        ntpSettings.secondaryNtpServer !== null ? ntpSettings.secondaryNtpServer : undefined
    };
    return result;
  }

  static toTimeSettings(grpcTimeSettings: grpc.TimeSettings): TimeSettings {
    const timeSettings = new TimeSettings();
    timeSettings.timeZone = this.toTimezone(grpcTimeSettings.appTimeZone!);
    timeSettings.ntpSettings = this.toNtpSettings(grpcTimeSettings.ntpSettings!);
    return timeSettings;
  }

  static toGrpcTimeSettings(timeSettings: TimeSettings): grpc.TimeSettings {
    const result = {
      appTimeZone: this.toGrpcTimezone(timeSettings.timeZone!),
      ntpSettings: this.toGrpcNtpSettings(timeSettings.ntpSettings)
    };
    return result;
  }

  static toNetworkSettings(grpcNetworkSettings: grpc.NetworkSettings): NetworkSettings {
    const networkSettings = new NetworkSettings();
    networkSettings.networkMode = grpcNetworkSettings.networkMode;
    networkSettings.localIpAddress = grpcNetworkSettings.localIpAddress;
    networkSettings.localSubnetMask = grpcNetworkSettings.localSubnetMask;
    networkSettings.localGatewayIp = grpcNetworkSettings.localGatewayIp;
    networkSettings.primaryDnsServer = grpcNetworkSettings.primaryDnsServer
      ? grpcNetworkSettings.primaryDnsServer
      : null;
    networkSettings.secondaryDnsServer = grpcNetworkSettings.secondaryDnsServer
      ? grpcNetworkSettings.secondaryDnsServer
      : null;
    return networkSettings;
  }

  static toGrpcNetworkSettings(networkSettings: NetworkSettings): grpc.NetworkSettings {
    const result = {
      networkMode: networkSettings.networkMode,
      localIpAddress: networkSettings.localIpAddress,
      localSubnetMask: networkSettings.localSubnetMask,
      localGatewayIp: networkSettings.localGatewayIp,

      primaryDnsServer:
        networkSettings.primaryDnsServer !== null ? networkSettings.primaryDnsServer : undefined,
      secondaryDnsServer:
        networkSettings.secondaryDnsServer !== null ? networkSettings.secondaryDnsServer : undefined
    };
    return result;
  }

  static toNotificationSettings(
    grpcNotificationSettings: grpc.NotificationSettings
  ): NotificationSettings {
    const notificationSettings = new NotificationSettings();
    notificationSettings.id = grpcNotificationSettings.id;
    notificationSettings.emailServer = this.toEmailServer(grpcNotificationSettings.emailServer!);
    notificationSettings.trapReceiver = this.toTrapReceiver(grpcNotificationSettings.trapReceiver!);
    return notificationSettings;
  }

  static toEmailServer(grpcEmailServer: grpc.EmailServer): EmailServer {
    const emailServer = new EmailServer();
    emailServer.enabled = grpcEmailServer.enabled;
    emailServer.smtpServerAddress = grpcEmailServer.serverAddress;
    emailServer.smtpServerPort = grpcEmailServer.serverPort;
    emailServer.outgoingAddress = grpcEmailServer.outgoingAddress;
    emailServer.isAuthenticationOn = grpcEmailServer.isAuthenticationOn;
    emailServer.serverUserName = grpcEmailServer.serverUserName;
    emailServer.isPasswordSet = grpcEmailServer.isPasswordSet;
    emailServer.serverPassword = grpcEmailServer.serverPassword;
    emailServer.verifyCertificate = grpcEmailServer.verifyCertificate;
    emailServer.floodingPolicy = grpcEmailServer.floodingPolicy;
    emailServer.smsOverSmtp = grpcEmailServer.smsOverSmtp;
    return emailServer;
  }

  static toTrapReceiver(grpcTrapReceiver: grpc.TrapReceiver): TrapReceiver {
    const trapReceiver = new TrapReceiver();
    trapReceiver.enabled = grpcTrapReceiver.enabled;
    trapReceiver.snmpVersion = grpcTrapReceiver.snmpVersion;
    trapReceiver.useVeexOid = grpcTrapReceiver.useVeexOid;
    trapReceiver.customOid = grpcTrapReceiver.customOid;
    trapReceiver.community = grpcTrapReceiver.community;
    trapReceiver.authoritativeEngineId = grpcTrapReceiver.authoritativeEngineId;
    trapReceiver.userName = grpcTrapReceiver.userName;
    trapReceiver.isAuthPswSet = grpcTrapReceiver.isAuthPwdSet;
    trapReceiver.authenticationPassword = grpcTrapReceiver.authenticationPassword;
    trapReceiver.authenticationProtocol = grpcTrapReceiver.authenticationProtocol;
    trapReceiver.isPrivPswSet = grpcTrapReceiver.isPrivPwdSet;
    trapReceiver.privacyPassword = grpcTrapReceiver.privacyPassword;
    trapReceiver.privacyProtocol = grpcTrapReceiver.privacyProtocol;
    trapReceiver.trapReceiverAddress = grpcTrapReceiver.trapReceiverAddress;
    trapReceiver.trapReceiverPort = grpcTrapReceiver.trapReceiverPort;

    return trapReceiver;
  }

  static toAlarmProfiles(grpcAlarmProfiles: grpc.AlarmProfile[]): AlarmProfile[] {
    const alarmProfiles = grpcAlarmProfiles.map((a) => this.toAlarmProfile(a));
    return alarmProfiles;
  }

  static toAlarmProfile(grpcAlarmProfile: grpc.AlarmProfile): AlarmProfile {
    const alarmProfile = new AlarmProfile();
    alarmProfile.id = grpcAlarmProfile.id;
    alarmProfile.name = grpcAlarmProfile.name;
    alarmProfile.thresholds = grpcAlarmProfile.thresholds.map((t) => this.toThreshold(t));
    return alarmProfile;
  }

  static toThreshold(grpcThreshold: grpc.Threshold): Threshold {
    const threshold = new Threshold(this.toThresholdParameter(grpcThreshold.parameter));
    threshold.id = grpcThreshold.id;
    threshold.isMinorOn = grpcThreshold.isMinorOn;
    threshold.isMajorOn = grpcThreshold.isMajorOn;
    threshold.isCriticalOn = grpcThreshold.isCriticalOn;

    threshold.minor = grpcThreshold.minor ? grpcThreshold.minor : null;
    threshold.major = grpcThreshold.major ? grpcThreshold.major : null;
    threshold.critical = grpcThreshold.critical ? grpcThreshold.critical : null;

    return threshold;
  }

  static toThresholdParameter(grpcThresholdParameter: grpc.ThresholdParameter): ThresholdParameter {
    switch (grpcThresholdParameter) {
      case grpc.ThresholdParameter.EventLoss:
        return ThresholdParameter.EventLoss;
      case grpc.ThresholdParameter.TotalLoss:
        return ThresholdParameter.TotalLoss;
      case grpc.ThresholdParameter.EventReflectance:
        return ThresholdParameter.EventReflectance;
      case grpc.ThresholdParameter.SectionAttenuation:
        return ThresholdParameter.SectionAttenuation;
      case grpc.ThresholdParameter.SectionLoss:
        return ThresholdParameter.SectionLoss;
      case grpc.ThresholdParameter.SectionLengthChange:
        return ThresholdParameter.SectionLengthChange;
      case grpc.ThresholdParameter.PortHealth:
        return ThresholdParameter.PortHealth;
      default:
        throw new Error(`Unknown grpc.ThresholdParameter: ${grpcThresholdParameter}`);
    }
  }

  static toUsers(grpcUsers: grpc.User[]): User[] {
    const users = grpcUsers.map((item) => MapUtils.toUser(item));
    return users;
  }

  static toUser(grpcUser: grpc.User): User {
    const user = new User();
    user.id = grpcUser.userId;
    user.name = grpcUser.userName;
    user.role = grpcUser.role;
    user.permissions = grpcUser.permissions;
    user.firstName = grpcUser.firstName;
    user.lastName = grpcUser.lastName;
    user.email = grpcUser.email;
    user.phoneNumber = grpcUser.phoneNumber;
    user.jobTitle = grpcUser.jobTitle;
    // we use fullName when we want to show user info
    // if firstName & lastName are not exist, let's use username as fullName
    if (grpcUser.firstName && grpcUser.lastName) {
      user.fullName = `${grpcUser.firstName} ${grpcUser.lastName}`;
    } else if (grpcUser.firstName) {
      user.fullName = grpcUser.firstName;
    } else if (grpcUser.lastName) {
      user.fullName = grpcUser.lastName;
    } else {
      user.fullName = grpcUser.userName;
    }
    return user;
  }

  static toGrpcApplicationUserPatch(patch: ApplicationUserPatch): grpc.ApplicationUserPatch {
    return {
      userName: patch.userName,
      firstName: patch.firstName,
      lastName: patch.lastName,
      jobTitle: patch.jobTitle,
      role: patch.role,
      email: patch.email,
      phoneNumber: patch.phoneNumber,
      password: patch.password
    };
  }

  static toGrpcOtauPatch(patch: OtauPatch): grpc.OtauPatch {
    return {
      name: patch.name,
      location: patch.location,
      rack: patch.rack,
      shelf: patch.shelf,
      note: patch.note
    };
  }

  static toGrpcMonitoringSchedule(schedule: MonitoringSchedule): grpc.MonitoringSchedule {
    const duration = Duration.create();
    if (schedule.schedulerMode === grpc.MonitoringSchedulerMode.AtLeastOnceIn)
      duration.seconds = '' + schedule.intervalSeconds!;
    return {
      schedulerMode: schedule.schedulerMode,
      interval: duration,
      timeSlotIds: schedule.timeSlotIds === undefined ? [] : schedule.timeSlotIds
    };
  }

  static toRoles(grpcRoles: grpc.Role[]): Role[] {
    const users = grpcRoles.map((item) => MapUtils.toRole(item));
    return users;
  }

  static toRole(grpcRole: grpc.Role): Role {
    const role = new Role();
    role.name = grpcRole.name;
    role.permissions = grpcRole.permissions;
    return role;
  }

  static toUserSettings(user?: grpc.UserSettings): UserSettings | null {
    if (!user) {
      return null;
    }

    return {
      language: user.language,
      theme: user.theme,
      dateTimeFormat: user.dateTimeFormat
    };
  }

  static toGprcUserSettings(user: UserSettings): grpc.UserSettings {
    return {
      language: user.language,
      theme: user.theme,
      dateTimeFormat: user.dateTimeFormat
    };
  }

  static toOtdrTaskProgress(progressData: OtdrTaskProgressData): OtdrTaskProgress {
    const progress = {
      otdrTaskId: progressData.TaskId,
      taskType: <any>progressData.TaskType.toLowerCase(),
      monitoringPortId: progressData.MonitoringPortId,
      createdByUserId: progressData.CreatedByUserId,
      queuePosition: progressData.QueuePosition,
      status: <any>progressData.Status.toLowerCase(),
      progress: progressData.Progress,
      completedAt: progressData.CompletedAt == null ? null : new Date(progressData.CompletedAt),
      stepName: progressData.StepName,
      failReason: progressData.FailReason
    };
    return progress;
  }

  static toDeviceInfo(response: grpc.DeviceInfoResponse): DeviceInfo {
    const deviceInfo = new DeviceInfo();
    deviceInfo.otaus = response.otaus.map((otau) => MapUtils.toOtau(otau));
    deviceInfo.monitoringPorts = response.monitoringPorts.map((port) =>
      MapUtils.toMonitoringPort(port)
    );
    deviceInfo.monitoringTimeSlots = response.monitoringTimeSlots.map((slot) =>
      MapUtils.toMonitoringTimeSlot(slot)
    );
    deviceInfo.alarmProfiles = response.alarmProfiles.map((p) => MapUtils.toAlarmProfile(p));
    deviceInfo.notificationSettings = this.toNotificationSettings(response.notificationSettings!);
    deviceInfo.serialNumber = response.serialNumber;
    deviceInfo.ipV4Address = response.ipV4Address;
    deviceInfo.timezone = this.toTimezone(response.timezone!);
    deviceInfo.apiVersion = response.apiVersion;
    deviceInfo.activeAlarms = response.activeAlarms.map((x) => MapUtils.toAlarm(x));
    deviceInfo.networkSettings = this.toNetworkSettings(response.networkSettings!);
    deviceInfo.timeSettings = this.toTimeSettings(response.timeSettings!);
    deviceInfo.portLabels = response.portLabels.map((x) => MapUtils.toPortLabel(x));
    deviceInfo.rtus = response.rtus.map((r) => TreeMapping.fromGrpcRtu(r));

    const supportedMeasurementParameters = new OtdrMeasurementParameters();
    supportedMeasurementParameters.laserUnits = [];

    for (const gRpcLaserUnit of response.supportedMeasurementParameters!.laserUnits) {
      const laserUnit = new LaserUnit();
      laserUnit.name = gRpcLaserUnit.name;
      laserUnit.distanceRanges = [];

      for (const gRpcDistanceRange of gRpcLaserUnit.distanceRanges) {
        const distanceRange = new DistanceRange();
        distanceRange.name = gRpcDistanceRange.name;
        distanceRange.pulseDurations = gRpcDistanceRange.pulseDurations;
        distanceRange.averagingTimes = gRpcDistanceRange.averagingTimes;
        distanceRange.liveAveragingTimes = gRpcDistanceRange.liveAveragingTimes;
        distanceRange.resolutions = gRpcDistanceRange.resolutions;
        laserUnit.distanceRanges.push(distanceRange);
      }

      supportedMeasurementParameters.laserUnits.push(laserUnit);
    }

    deviceInfo.supportedMeasurementParameters = supportedMeasurementParameters;

    return deviceInfo;
  }

  static toTimezone(timezone: grpc.AppTimeZone): AppTimezone {
    if (TimezoneUtils.supportTimezoneByIanaId(timezone.ianaId)) {
      const result = new AppTimezone();
      result.ianaId = timezone.ianaId;
      result.displayName = timezone.displayName;
      result.displayBaseUtcOffset = timezone.displayBaseUtcOffset;
      result.appliedDeviceTimeZone = true;
      return result;
    }

    const result = new AppTimezone();
    result.ianaId = 'Etc/GMT';
    result.displayName = '(UTC) Coordinated Universal Time';
    result.displayBaseUtcOffset = 'UTC+00:00';
    result.appliedDeviceTimeZone = false;
    result.serverIanaId = timezone.ianaId;
    result.serverDisplayName = timezone.displayName;
    result.serverDisplayBaseUtcOffset = timezone.displayBaseUtcOffset;
    return result;
  }

  static toGrpcTimezone(timezone: TimeZone): grpc.AppTimeZone {
    const result = {
      ianaId: timezone.ianaId,
      displayName: timezone.displayName,
      displayBaseUtcOffset: timezone.displayBaseUtcOffset
    };
    return result;
  }

  static toAlarms(grpcAlarms: grpc.MonitoringAlarm[]): MonitoringAlarm[] {
    const alarms = grpcAlarms.map((item) => MapUtils.toAlarm(item));
    return alarms;
  }

  static toAlarm(grpcAlarm: grpc.MonitoringAlarm): MonitoringAlarm {
    const alarm = new MonitoringAlarm();
    alarm.id = grpcAlarm.id;
    alarm.alarmGroupId = grpcAlarm.alarmGroupId;
    alarm.monitoringPortId = grpcAlarm.monitoringPortId;
    alarm.monitoringResultId = grpcAlarm.monitoringResultId;
    alarm.lastChangedAt = Timestamp.toDate(grpcAlarm.lastChangedAt!);
    alarm.activeAt = Timestamp.toDate(grpcAlarm.activeAt!);
    alarm.resolvedAt = grpcAlarm.resolvedAt ? Timestamp.toDate(grpcAlarm.resolvedAt!) : null;
    alarm.type = MapUtils.toMonitoringAlarmType(grpcAlarm.type);
    alarm.level = MapUtils.toMonitoringAlarmLevel(grpcAlarm.level);
    alarm.status = MapUtils.toMonitoringAlarmStatus(grpcAlarm.status);
    alarm.distanceMeters = grpcAlarm.distanceMeters?.value ?? null;
    alarm.events = grpcAlarm.events.map((item) => MapUtils.toAlarmEvent(item));

    // sort by descending
    alarm.events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    return alarm;
  }

  static toDataPoints(grpcDataPoints: grpc.DataPoint[]): DataPoint[] {
    const result = grpcDataPoints.map((item) => {
      // borrowed from the Timestamp.toDate(...), we spare a single call of new Date(...)
      const timestamp =
        PbLong.from(item.x!.seconds).toNumber() * 1000 + Math.ceil(item.x!.nanos / 1000000);

      return {
        x: timestamp,
        y: item.y
      };
    });
    return result;
  }

  static toAlarmEvents(grpcAlarmEvents: grpc.MonitoringAlarmEvent[]): MonitoringAlarmEvent[] {
    const alarmEvents = grpcAlarmEvents.map((item) => MapUtils.toAlarmEvent(item));
    return alarmEvents;
  }

  static toAlarmEvent(grpcAlarmEvent: grpc.MonitoringAlarmEvent): MonitoringAlarmEvent {
    const alarmEvent = new MonitoringAlarmEvent();
    alarmEvent.id = grpcAlarmEvent.id;
    alarmEvent.monitoringAlarmGroupId = grpcAlarmEvent.monitoringAlarmGroupId;
    alarmEvent.monitoringPortId = grpcAlarmEvent.monitoringPortId;
    alarmEvent.monitoringAlarmId = grpcAlarmEvent.monitoringAlarmId;
    alarmEvent.monitoringResultId = grpcAlarmEvent.monitoringResultId;
    alarmEvent.type = MapUtils.toMonitoringAlarmType(grpcAlarmEvent.type);
    alarmEvent.distanceMeters = grpcAlarmEvent.distanceMeters?.value ?? null;
    alarmEvent.at = Timestamp.toDate(grpcAlarmEvent.at!);

    alarmEvent.oldLevel = grpcAlarmEvent.oldLevel
      ? MapUtils.toMonitoringAlarmLevel(grpcAlarmEvent.oldLevel.value)
      : null;
    alarmEvent.level = MapUtils.toMonitoringAlarmLevel(grpcAlarmEvent.level);

    alarmEvent.oldStatus = grpcAlarmEvent.oldStatus
      ? MapUtils.toMonitoringAlarmStatus(grpcAlarmEvent.oldStatus.value)
      : null;

    alarmEvent.status = MapUtils.toMonitoringAlarmStatus(grpcAlarmEvent.status);

    alarmEvent.change = grpcAlarmEvent.jsonChange
      ? MapJsonUtils.fromJsonToChange(grpcAlarmEvent.jsonChange)
      : null;

    return alarmEvent;
  }

  static toAlarmNotification(grpcAlarmEvent: grpc.MonitoringAlarmEvent): AlarmNotification {
    const notification = new AlarmNotification();
    notification.alarmEvent = MapUtils.toAlarmEvent(grpcAlarmEvent);
    return notification;
  }

  static toSystemEvents(grpcSystemEvents: grpc.SystemEvent[]): SystemEvent[] {
    const systemEvents = grpcSystemEvents.map((item) => MapUtils.toSystemEvent(item));
    return systemEvents;
  }

  static toSystemEvent(grpcSystemEvent: grpc.SystemEvent): SystemEvent {
    const systemEvent = new SystemEvent();
    systemEvent.id = grpcSystemEvent.id;
    systemEvent.type = grpcSystemEvent.type;
    systemEvent.level = MapUtils.toSystemEventLevel(grpcSystemEvent.level);
    systemEvent.jsonData = grpcSystemEvent.jsonData;
    systemEvent.at = Timestamp.toDate(grpcSystemEvent.at!);
    systemEvent.source = new SystemEventSource();
    systemEvent.source.userId = grpcSystemEvent.source?.userId ?? null;
    systemEvent.source.source = grpcSystemEvent.source?.source ?? null;
    return systemEvent;
  }

  static toSystemNotification(
    grpcSystemNotification: grpc.InAppSystemNotification
  ): SystemNotification {
    const eventNotification = new SystemNotification();
    eventNotification.systemEvent = MapUtils.toSystemEvent(grpcSystemNotification.systemEvent!);
    return eventNotification;
  }

  static toMonitoringAlarmType(grpcAlarmType: grpc.MonitoringAlarmType): MonitoringAlarmType {
    switch (grpcAlarmType) {
      case grpc.MonitoringAlarmType.EventLoss:
        return MonitoringAlarmType.EventLoss;
      case grpc.MonitoringAlarmType.TotalLoss:
        return MonitoringAlarmType.TotalLoss;
      case grpc.MonitoringAlarmType.EventReflectance:
        return MonitoringAlarmType.EventReflectance;
      case grpc.MonitoringAlarmType.SectionAttenuation:
        return MonitoringAlarmType.SectionAttenuation;
      case grpc.MonitoringAlarmType.SectionLoss:
        return MonitoringAlarmType.SectionLoss;
      case grpc.MonitoringAlarmType.SectionLengthChange:
        return MonitoringAlarmType.SectionLengthChange;
      case grpc.MonitoringAlarmType.PortHealth:
        return MonitoringAlarmType.PortHealth;
      case grpc.MonitoringAlarmType.FiberBreak:
        return MonitoringAlarmType.FiberBreak;
      case grpc.MonitoringAlarmType.NewEvent:
        return MonitoringAlarmType.NewEvent;
      case grpc.MonitoringAlarmType.NewEventAfterEof:
        return MonitoringAlarmType.NewEventAfterEof;
      default:
        throw new Error(`Unknown grpc.MonitoringAlarmType: ${grpcAlarmType}`);
    }
  }

  static toMonitoringAlarmLevel(grpcLevel: grpc.MonitoringAlarmLevel): MonitoringAlarmLevel {
    switch (grpcLevel) {
      case grpc.MonitoringAlarmLevel.Minor:
        return MonitoringAlarmLevel.Minor;
      case grpc.MonitoringAlarmLevel.Major:
        return MonitoringAlarmLevel.Major;
      case grpc.MonitoringAlarmLevel.Critical:
        return MonitoringAlarmLevel.Critical;
      default:
        throw new Error(`Unknown grpc.MonitoringAlarmLevel: ${grpcLevel}`);
    }
  }

  static toGrpcMonitoringAlarmLevel(alarmLevel: MonitoringAlarmLevel): grpc.MonitoringAlarmLevel {
    switch (alarmLevel) {
      case MonitoringAlarmLevel.Minor:
        return grpc.MonitoringAlarmLevel.Minor;
      case MonitoringAlarmLevel.Major:
        return grpc.MonitoringAlarmLevel.Major;
      case MonitoringAlarmLevel.Critical:
        return grpc.MonitoringAlarmLevel.Critical;
      default:
        throw new Error(`Unknown MonitoringAlarmLevel: ${alarmLevel}`);
    }
  }

  static toMonitoringAlarmStatus(grpcStatus: grpc.MonitoringAlarmStatus): MonitoringAlarmStatus {
    switch (grpcStatus) {
      case grpc.MonitoringAlarmStatus.Active:
        return MonitoringAlarmStatus.Active;
      case grpc.MonitoringAlarmStatus.Resolved:
        return MonitoringAlarmStatus.Resolved;
      default:
        throw new Error(`Unknown grpc.MonitoringAlarmStatus: ${grpcStatus}`);
    }
  }

  static toSystemEventLevel(grpcLevel: grpc.SystemEventLevel): SystemEventLevel {
    switch (grpcLevel) {
      case grpc.SystemEventLevel.Info:
        return SystemEventLevel.Info;
      case grpc.SystemEventLevel.Major:
        return SystemEventLevel.Major;
      case grpc.SystemEventLevel.Critical:
        return SystemEventLevel.Critical;
      default:
        throw new Error(`Unknown grpc.SystemEventLevel: ${grpcLevel}`);
    }
  }

  static toGrpcSystemEventLevel(level: SystemEventLevel): grpc.SystemEventLevel {
    switch (level) {
      case SystemEventLevel.Info:
        return grpc.SystemEventLevel.Info;
      case SystemEventLevel.Major:
        return grpc.SystemEventLevel.Major;
      case SystemEventLevel.Critical:
        return grpc.SystemEventLevel.Critical;
      default:
        throw new Error(`Unknown SystemEventLevel: ${level}`);
    }
  }

  static toCompletedOnDemands(grpcOnDemands: grpc.CompletedOnDemand[]): CompletedOnDemand[] {
    const onDemands = grpcOnDemands.map((item) => MapUtils.toCompletedOnDemand(item));
    return onDemands;
  }

  static toCompletedOnDemand(grpcOnDemand: grpc.CompletedOnDemand): CompletedOnDemand {
    const onDemand = new CompletedOnDemand();
    onDemand.id = grpcOnDemand.id;
    onDemand.createdByUserId = grpcOnDemand.createdByUserId;
    onDemand.completedAt = Timestamp.toDate(grpcOnDemand.completedAt!);
    onDemand.monitoringPortId = grpcOnDemand.monitoringPortId;
    onDemand.measurementSettings = MapUtils.toMeasurementSettings(
      grpcOnDemand.measurementSettings!
    );
    return onDemand;
  }

  static toMonitoringResults(grpcMonitorings: grpc.MonitoringResult[]): MonitoringResult[] {
    const monitorings = grpcMonitorings.map((item) => MapUtils.toMonitoringResult(item));
    return monitorings;
  }

  static toMonitoringResult(grpcMonitoring: grpc.MonitoringResult): MonitoringResult {
    const monitoring = new MonitoringResult();
    monitoring.id = grpcMonitoring.id;
    monitoring.completedAt = Timestamp.toDate(grpcMonitoring.completedAt!);
    monitoring.monitoringPortId = grpcMonitoring.monitoringPortId;
    monitoring.baselineId = grpcMonitoring.baselineId;
    monitoring.changesCount = grpcMonitoring.changesCount;

    monitoring.mostSevereChangeLevel =
      grpcMonitoring.changesCount > 0
        ? MapUtils.toMonitoringAlarmLevel(grpcMonitoring.mostSevereChangeLevel)
        : null;

    monitoring.measurementSettings = grpcMonitoring.measurementSettings
      ? MapUtils.toMeasurementSettings(grpcMonitoring.measurementSettings!)
      : null;

    monitoring.changes = grpcMonitoring.jsonChanges
      ? MapJsonUtils.fromJsonToChanges(grpcMonitoring.jsonChanges || null)
      : null;

    return monitoring;
  }

  static toMeasurementSettings(grpcSettings: grpc.MeasurementSettings): MeasurementSettings {
    const measSettings = new MeasurementSettings();
    measSettings.autoMode = grpcSettings.measurementType === grpc.MeasurementType.Auto;
    measSettings.networkType = grpcSettings.networkType;
    measSettings.backscatteringCoeff = grpcSettings.backscatterCoeff.toString();
    measSettings.refractiveIndex = grpcSettings.refractiveIndex.toString();
    measSettings.laser = grpcSettings.laser;
    measSettings.distanceRange = grpcSettings.distanceRange ?? '';
    measSettings.averagingTime = grpcSettings.averagingTime ?? '';
    measSettings.pulse = grpcSettings.pulse ?? '';
    measSettings.samplingResolution = grpcSettings.samplingResolution ?? '';
    measSettings.eventLossThreshold = grpcSettings.eventLossThreshold.toString();
    measSettings.eventReflectanceThreshold = grpcSettings.eventReflectanceThreshold.toString();
    measSettings.endOfFiberThreshold = grpcSettings.endOfFiberThreshold.toString();
    measSettings.fastMeasurement = grpcSettings.fastMeasurement;
    measSettings.frontPanelCheck = grpcSettings.checkConnectionQuality;
    measSettings.splitter1dB = grpcSettings.splitter1DB;
    measSettings.splitter2dB = grpcSettings.splitter2DB;
    measSettings.mux = grpcSettings.mux;
    return measSettings;
  }

  static toGrpcMeasurementSettings(measSettings: MeasurementSettings): grpc.MeasurementSettings {
    return {
      measurementType: measSettings.autoMode
        ? grpc.MeasurementType.Auto
        : grpc.MeasurementType.Manual,
      networkType: measSettings.networkType,
      backscatterCoeff: +measSettings.backscatteringCoeff!,
      refractiveIndex: +measSettings.refractiveIndex!,
      laser: measSettings.laser,
      distanceRange: measSettings.distanceRange ?? '',
      averagingTime: measSettings.averagingTime ?? '',
      pulse: measSettings.pulse ?? '',
      samplingResolution: measSettings.samplingResolution ?? '',
      eventLossThreshold: +measSettings.eventLossThreshold!,
      eventReflectanceThreshold: +measSettings.eventReflectanceThreshold!,
      endOfFiberThreshold: +measSettings.endOfFiberThreshold!,
      fastMeasurement: measSettings.fastMeasurement,
      checkConnectionQuality: measSettings.frontPanelCheck,
      splitter1DB: measSettings.splitter1dB,
      splitter2DB: measSettings.splitter2dB,
      mux: measSettings.mux
    };
  }

  static toOtau(gprcOtau: grpc.Otau): Otau {
    const otau = new Otau();
    otau.id = gprcOtau.id;
    otau.type = gprcOtau.type;
    otau.ocmPortIndex = gprcOtau.ocmPortIndex;
    otau.portCount = gprcOtau.portCount;
    otau.serialNumber = gprcOtau.serialNumber;
    otau.name = gprcOtau.name;
    otau.location = gprcOtau.location;
    otau.rack = gprcOtau.rack;
    otau.shelf = gprcOtau.shelf;
    otau.note = gprcOtau.note;
    otau.jsonParameters = gprcOtau.jsonParameters;
    otau.isConnected = gprcOtau.isConnected;
    otau.onlineAt = gprcOtau.onlineAt ? Timestamp.toDate(gprcOtau.onlineAt!) : null;
    otau.offlineAt = gprcOtau.offlineAt ? Timestamp.toDate(gprcOtau.offlineAt!) : null;
    otau.name = gprcOtau.name;
    otau.ports = gprcOtau.ports.map((x) => MapUtils.toOtauPort(x));
    return otau;
  }

  static toOxcOtauParameters(jsonParameters: string): OxcOtauParameters {
    return <OxcOtauParameters>JSON.parse(jsonParameters);
  }

  static toOtauPort(gprcOtauPort: grpc.OtauPort): OtauPort {
    const otauPort = new OtauPort();
    otauPort.id = gprcOtauPort.id;
    otauPort.portIndex = gprcOtauPort.portIndex;
    otauPort.unavailable = gprcOtauPort.unavailable;
    otauPort.monitoringPortId = gprcOtauPort.monitoringPortId;
    otauPort.otauId = gprcOtauPort.otauId;
    return otauPort;
  }

  static toMonitoringPort(gprcMonitoringPort: grpc.MonitoringPort): MonitoringPort {
    const port = new MonitoringPort();
    port.id = gprcMonitoringPort.id;
    port.note = gprcMonitoringPort.note;
    port.otauPortId = gprcMonitoringPort.otauPortId;
    port.otauId = gprcMonitoringPort.otauId;
    port.status = gprcMonitoringPort.status;
    port.schedule = new MonitoringSchedule();
    port.schedule.schedulerMode = gprcMonitoringPort.schedulerMode;
    port.schedule.intervalSeconds = gprcMonitoringPort.interval
      ? parseInt(gprcMonitoringPort.interval.seconds)
      : null;
    port.schedule.timeSlotIds = gprcMonitoringPort.timeSlotIds;

    port.baseline = MapUtils.toMonitoringBaseline(gprcMonitoringPort.baseline || null);
    port.alarmProfileId = gprcMonitoringPort.alarmProfileId;

    return port;
  }

  static toMonitoringBaselines(grpcBaselines: grpc.MonitoringBaseline[]): MonitoringBaseline[] {
    const baselines = grpcBaselines.map((item) => MapUtils.toMonitoringBaseline(item)!);
    return baselines;
  }

  static toMonitoringBaseline(
    grpcBaseline: grpc.MonitoringBaseline | null
  ): MonitoringBaseline | null {
    if (grpcBaseline === null) {
      return null;
    }

    const baseline = new MonitoringBaseline();
    baseline.id = grpcBaseline.id;
    baseline.monitoringPortId = grpcBaseline.monitoringPortId;
    baseline.createdByUserId = grpcBaseline.createdByUserId;
    baseline.createdAt = Timestamp.toDate(grpcBaseline.createdAt!);
    baseline.measurementSettings = MapUtils.toMeasurementSettings(
      grpcBaseline.measurementSettings!
    );
    return baseline;
  }

  static toMonitoringTimeSlot(gprcMonitoringTimeSlot: grpc.MonitoringTimeSlot): MonitoringTimeSlot {
    const timeSlot = new MonitoringTimeSlot();
    timeSlot.id = gprcMonitoringTimeSlot.id;
    timeSlot.start = MapUtils.toHoursMinutes(gprcMonitoringTimeSlot.start!);
    timeSlot.end = MapUtils.toHoursMinutes(gprcMonitoringTimeSlot.end!);
    return timeSlot;
  }

  static toHoursMinutes(grpcTime: grpc.TimeOnlyHourMinute): TimeOnlyHourMinute {
    const time = new TimeOnlyHourMinute();
    time.hour = grpcTime.hour;
    time.minute = grpcTime.minute;
    return time;
  }

  private static toDiscoverOtau(grpcDiscoverOtau: grpc.OtauDiscover): OtauDiscover {
    const otauDiscover = new OtauDiscover();
    otauDiscover.serialNumber = grpcDiscoverOtau.serialNumber;
    otauDiscover.portCount = grpcDiscoverOtau.portCount;
    return otauDiscover;
  }

  static toOtauDiscoverResult(grpcDiscoverOtauResult: grpc.OtauDiscoverResult): OtauDiscoverResult {
    const otauDiscoverResult = new OtauDiscoverResult();
    if (grpcDiscoverOtauResult.discover === undefined) {
      otauDiscoverResult.discover = null;
    } else {
      otauDiscoverResult.discover = this.toDiscoverOtau(grpcDiscoverOtauResult.discover);
    }
    otauDiscoverResult.error = grpcDiscoverOtauResult.error;
    return otauDiscoverResult;
  }

  static toPortLabel(grpcPortLabel: grpc.PortLabel): PortLabel {
    const portLabel = new PortLabel();
    portLabel.id = grpcPortLabel.id;
    portLabel.name = grpcPortLabel.name;
    portLabel.hexColor = grpcPortLabel.hexColor;
    portLabel.monitoringPortIds = grpcPortLabel.monitoringPortIds;
    return portLabel;
  }
}
