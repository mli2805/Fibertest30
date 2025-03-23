import { createAction, props } from '@ngrx/store';
import { Rtu } from '../models/ft30/rtu';
import { AttachTraceDto } from '../models/ft30/attach-trace-dto';
import { AttachOtauDto } from '../models/ft30/attach-otau-dto';
import { DetachOtauDto } from '../models/ft30/detach-otau-dto';

const refreshRtuTree = createAction('[RtuTree] Refresh Rtu Tree');
const refreshRtuTreeSuccess = createAction(
  '[RtuTree] Refresh Rtu Tree Success',
  props<{ rtus: Rtu[] }>()
);
const refreshRtuTreeFailure = createAction(
  '[RtuTree] Refresh Rtu Tree Failure',
  props<{ errorMessageId: string }>()
);

const getOneRtu = createAction('[RtuTree] Get One Rtu', props<{ rtuId: string }>());
const getOneRtuSuccess = createAction('[RtuTree] Get One Rtu Success', props<{ rtu: Rtu }>());
const getOneRtuFailure = createAction(
  '[RtuTree] Get One Rtu Failure',
  props<{ errorMessageId: string }>()
);

const attachTrace = createAction('[RtuTree] Attach Trace', props<{ dto: AttachTraceDto }>());
const attachTraceSuccess = createAction('[RtuTree] Attach Trace Success');
const attachTraceFailure = createAction(
  '[RtuTree] Attach Trace Failure',
  props<{ errorMessageId: string }>()
);

const detachTrace = createAction('[RtuTree] Detach Trace', props<{ traceId: string }>());
const detachTraceSuccess = createAction('[RtuTree] Detach Trace Success');
const detachTraceFailure = createAction(
  '[RtuTree] Detach Trace Failure',
  props<{ errorMessageId: string }>()
);

const attachOtau = createAction('[RtuTree] Attach Otau', props<{ dto: AttachOtauDto }>());
const attachOtauSuccess = createAction('[RtuTree] Attach Otau Success');
const attachOtauFailure = createAction(
  '[RtuTree] Attach Otau Failure',
  props<{ errorMessageId: string }>()
);

const detachOtau = createAction('[RtuTree] Detach Otau', props<{ dto: DetachOtauDto }>());
const detachOtauSuccess = createAction('[RtuTree] Detach Otau Success');
const detachOtauFailure = createAction(
  '[RtuTree] Detach Otau Failure',
  props<{ errorMessageId: string }>()
);

const showLoading = createAction('[RtuTree] Show Loading');
const hideLoading = createAction('[RtuTree] Hide Loading');

export const RtuTreeActions = {
  refreshRtuTree,
  refreshRtuTreeSuccess,
  refreshRtuTreeFailure,

  getOneRtu,
  getOneRtuSuccess,
  getOneRtuFailure,

  attachTrace,
  attachTraceSuccess,
  attachTraceFailure,

  detachTrace,
  detachTraceSuccess,
  detachTraceFailure,

  attachOtau,
  attachOtauSuccess,
  attachOtauFailure,

  detachOtau,
  detachOtauSuccess,
  detachOtauFailure,

  showLoading,
  hideLoading
};
