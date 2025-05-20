// validateJson.js
import Ajv from "ajv";
import {dashboardSchema} from "../data/dashboardData.js";


const ajv = new Ajv({ allErrors: true });

/**
 * Valide un objet contre le schéma dashboardData
 * @param {object} data - L'objet à valider
 * @returns {{ valid: boolean, errors: array|null }}
 */
export function validateDashboardData(data) {
    const validate = ajv.compile(dashboardSchema);
    const valid = validate(data);

    return {
        valid,
        errors: valid ? null : validate.errors,
    };
}
