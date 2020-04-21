import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class SuccessResponse {
    constructor(
        public success: boolean,
        public data: any) { }
}

@Injectable({
    providedIn: 'root'
})
export class SuccessResponseAdapter implements Adapter<SuccessResponse> {

    constructor() { }

    adapt(res: any): SuccessResponse {
        return new SuccessResponse(
            res.success,
            res.data
        );
    }
}
