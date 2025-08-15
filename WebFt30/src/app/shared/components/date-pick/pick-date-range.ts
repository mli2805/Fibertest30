import { AppTimezone } from 'src/app/core/store/models';

export class PickDateRange {
    public constructor(
        public label:string,
        public fromDate:Date,
        public toDate:Date,
        public isQuick = true,
        public appTimezone?:AppTimezone,
        public from?: string,
        public to?: string,
        public refresh?: boolean
    ){

    }
}
