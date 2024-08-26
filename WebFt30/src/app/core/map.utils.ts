import * as grpc from 'src/grpc-generated';
import { UserSettings } from './models/user-settings';
import { DeviceInfo } from './store/device/device.state';
import {
  SystemNotification,
  User,
  Role,
  SystemEvent,
  SystemEventLevel,
  SystemEventSource,
  DataPoint,
  AppTimezone
} from './store/models';

import { PbLong } from '@protobuf-ts/runtime';

import { TimezoneUtils } from 'src/app/core/timezone.utils';

import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';
import { ApplicationUserPatch } from '../features/ft-settings/components/user-accounts/components/user-edit-dialog/application-user-patch';
import {
  EmailServer,
  NotificationSettings,
  TrapReceiver
} from './store/models/notification-settings';
import { TreeMapping } from './store/mapping/tree-mapping';
import { OpticalEvent } from './store/models/ft30/optical-event';
import { FtEnumsMapping } from './store/mapping/ft-enums-mapping';

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

  static toDeviceInfo(response: grpc.DeviceInfoResponse): DeviceInfo {
    const deviceInfo = new DeviceInfo();
    deviceInfo.notificationSettings = this.toNotificationSettings(response.notificationSettings!);
    deviceInfo.apiVersion = response.apiVersion;
    deviceInfo.rtus = response.rtus.map((r) => TreeMapping.fromGrpcRtu(r));

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

  static toOpticalEvents(grpcOpticalEvents: grpc.OpticalEvent[]): OpticalEvent[] {
    const opticalEvents = grpcOpticalEvents.map((item) => MapUtils.toOpticalEvent(item));
    return opticalEvents;
  }

  static toOpticalEvent(grpcOpticalEvent: grpc.OpticalEvent): OpticalEvent {
    const opticalEvent = new OpticalEvent();
    opticalEvent.eventId = grpcOpticalEvent.eventId;
    opticalEvent.measuredAt = Timestamp.toDate(grpcOpticalEvent.measuredAt!);
    opticalEvent.registeredAt = Timestamp.toDate(grpcOpticalEvent.registeredAt!);

    opticalEvent.rtuTitle = grpcOpticalEvent.rtuTitle;
    opticalEvent.rtuId = grpcOpticalEvent.rtuId;
    opticalEvent.traceTitle = grpcOpticalEvent.traceTitle;
    opticalEvent.traceId = grpcOpticalEvent.traceId;

    opticalEvent.baseRefType = grpcOpticalEvent.baseRefType;
    opticalEvent.traceState = FtEnumsMapping.fromGrpcFiberState(grpcOpticalEvent.traceState);

    opticalEvent.eventStatus = grpcOpticalEvent.eventStatus;
    opticalEvent.statusChangedAt = Timestamp.toDate(grpcOpticalEvent.statusChangedAt!);
    opticalEvent.statusChangedByUser = grpcOpticalEvent.statusChangedByUser;

    opticalEvent.comment = grpcOpticalEvent.comment;

    return opticalEvent;
  }

  static toSystemNotification(
    grpcSystemNotification: grpc.InAppSystemNotification
  ): SystemNotification {
    const eventNotification = new SystemNotification();
    eventNotification.systemEvent = MapUtils.toSystemEvent(grpcSystemNotification.systemEvent!);
    return eventNotification;
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
}
