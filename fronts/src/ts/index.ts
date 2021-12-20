import './fetchio.ts'

/**
 * ActionRequest
 * @memberof Action
 * @alias ActionRequest
 */
export type ActionRequest = {
    /**
     * parameters passed in an URL
     */
    params: {
        /**
         * Id of current resource
         */
        resourceId: string;
        /**
         * Id of current record
         */
        recordId?: string;
        /**
         * Name of an action
         */
        action: string;

        [key: string]: any;
    };
}
