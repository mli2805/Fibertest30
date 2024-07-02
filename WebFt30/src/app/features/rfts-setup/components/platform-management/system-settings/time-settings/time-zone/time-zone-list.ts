import { TimeZone } from 'src/app/core/store/models/time-zone';

export class TimeZoneList {
  public timeZones!: TimeZone[];

  constructor() {
    // prettier-ignore
    this.timeZones = [
        { displayName: "Midway Island, Samoa",                      ianaId: "Pacific/Apia",                     displayBaseUtcOffset: "UTC-11:00" },
        { displayName: "Hawaii",                                    ianaId: "Pacific/Honolulu",                 displayBaseUtcOffset: "UTC-10:00" },
        { displayName: "Alaska",                                    ianaId: "America/Anchorage",                displayBaseUtcOffset: "UTC-09:00" },
        { displayName: "Pacific Time (US & Canada)",                ianaId: "Pacific/Pitcairn",                 displayBaseUtcOffset: "UTC-08:00" },
        { displayName: "Mountain Time (US & Canada)",               ianaId: "America/Denver",                   displayBaseUtcOffset: "UTC-07:00" },
        { displayName: "Central Time (US & Canada), Mexico City",   ianaId: "America/Chicago",                  displayBaseUtcOffset: "UTC-06:00" },
        { displayName: "East Time (US & Canada)",                   ianaId: "America/New_York",                 displayBaseUtcOffset: "UTC-05:00" },
        { displayName: "Atlantic Time (Canada)",                    ianaId: "Canada/Atlantic",                  displayBaseUtcOffset: "UTC-04:00" },
        { displayName: "Brasilia, Buenos Aires",                    ianaId: "America/Argentina/Buenos_Aires",   displayBaseUtcOffset: "UTC-03:00" },
        { displayName: "Mid-Atlantic",                              ianaId: "America/Noronha",                  displayBaseUtcOffset: "UTC-02:00" },
        { displayName: "Azores Cape Verde Is.",                     ianaId: "Atlantic/Cape_Verde",              displayBaseUtcOffset: "UTC-01:00" },
        { displayName: "Greenwich Mean Time: London",               ianaId: "Etc/GMT",                          displayBaseUtcOffset: "UTC+00:00" },
        { displayName: "Berlin, Rome",                              ianaId: "Europe/Berlin",                    displayBaseUtcOffset: "UTC+01:00" },
        { displayName: "Athens, Bucharest",                         ianaId: "Europe/Athens",                    displayBaseUtcOffset: "UTC+02:00" },
        { displayName: "Minsk, Moscow, Riyadh",                     ianaId: "Europe/Minsk",                     displayBaseUtcOffset: "UTC+03:00" },
        { displayName: "Abu Dhabi, Baku",                           ianaId: "Indian/Mauritius",                 displayBaseUtcOffset: "UTC+04:00" },
        { displayName: "Islamabad, Karachi",                        ianaId: "Asia/Karachi",                     displayBaseUtcOffset: "UTC+05:00" },
        { displayName: "New Delhi",                                 ianaId: "Asia/Calcutta",                    displayBaseUtcOffset: "UTC+05:30" },
        { displayName: "Dhaka, Novosibirsk",                        ianaId: "Asia/Dhaka",                       displayBaseUtcOffset: "UTC+06:00" },
        { displayName: "Bangkok, Hanoi, Jakarta",                   ianaId: "Asia/Bangkok",                     displayBaseUtcOffset: "UTC+07:00" },
        { displayName: "Beijing, Hong Kong",                        ianaId: "Asia/Shanghai",                    displayBaseUtcOffset: "UTC+08:00" },
        { displayName: "Seoul, Tokyo",                              ianaId: "Asia/Tokyo",                       displayBaseUtcOffset: "UTC+09:00" },
        { displayName: "Melbourne, Sydney",                         ianaId: "Australia/Melbourne",              displayBaseUtcOffset: "UTC+10:00" },
        { displayName: "Magadan, Solomon Is.",                      ianaId: "Pacific/Noumea",                   displayBaseUtcOffset: "UTC+11:00" },
        { displayName: "Wellington, Marshall Is.",                  ianaId: "Pacific/Nauru",                    displayBaseUtcOffset: "UTC+12:00" },
    ];
  }
}
